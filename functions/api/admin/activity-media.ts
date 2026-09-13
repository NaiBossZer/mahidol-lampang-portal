import { getCookie, getSupabaseUser, isAdminRole, json, supabaseConfig } from "../auth/_shared";

type Env = Record<string, unknown>;
type Row = Record<string, unknown>;
const BUCKET = "activity-media";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const WRITE_ROLES = new Set(["SUPER_ADMIN", "CONTENT_ADMIN", "OPERATIONS_ADMIN"]);

async function rest(env: Env, token: string, path: string, init: RequestInit = {}) {
  const config = supabaseConfig(env);
  if (!config.configured) throw new Error("Supabase is not configured");
  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`Supabase REST ${response.status}`);
  return body;
}
async function storage(env: Env, token: string, path: string, init: RequestInit = {}) {
  const config = supabaseConfig(env);
  if (!config.configured) throw new Error("Supabase is not configured");
  const response = await fetch(`${config.url}/storage/v1/object/${BUCKET}/${path}`, {
    ...init,
    headers: { apikey: config.key, Authorization: `Bearer ${token}`, ...(init.headers ?? {}) },
  });
  if (!response.ok) throw new Error(`Storage ${response.status}`);
}

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  try {
    const user = await getSupabaseUser(request, env);
    const role = String(user?.app_metadata?.role ?? "");
    const token = getCookie(request, "sb_access_token");
    if (!user || !isAdminRole(role) || !token)
      return json({ success: false, error: "Unauthorized" }, 401);
    const params = new URL(request.url).searchParams;
    if (request.method === "GET") {
      const query = new URLSearchParams({
        select:
          "id,activity_id,occurrence_id,storage_path,public_url,media_type,caption,is_post_event,display_order,status,created_at",
        order: "display_order.asc,created_at.desc",
      });
      if (params.get("activityId")) query.set("activity_id", `eq.${params.get("activityId")}`);
      return json({
        success: true,
        data: await rest(env, token, `activity_media?${query.toString()}`),
      });
    }
    if (!WRITE_ROLES.has(role)) return json({ success: false, error: "Forbidden" }, 403);
    if (request.method === "DELETE") {
      const id = params.get("id");
      if (!id) return json({ success: false, error: "id required" }, 400);
      const rows = (await rest(
        env,
        token,
        `activity_media?id=eq.${id}&select=id,storage_path`,
      )) as Row[];
      const row = rows[0];
      if (!row) return json({ success: false, error: "ไม่พบรูปภาพ" }, 404);
      await storage(env, token, String(row.storage_path), { method: "DELETE" });
      await rest(env, token, `activity_media?id=eq.${id}`, { method: "DELETE" });
      return json({ success: true, data: { id } });
    }
    if (request.method !== "POST")
      return json({ success: false, error: "Method Not Allowed" }, 405, {
        Allow: "GET, POST, DELETE",
      });
    const form = await request.formData();
    const activityId = String(form.get("activityId") ?? "");
    const occurrenceId = String(form.get("occurrenceId") ?? "") || null;
    const caption = String(form.get("caption") ?? "") || null;
    const file = form.get("file");
    if (!activityId || !(file instanceof File))
      return json({ success: false, error: "activityId และ file จำเป็น" }, 400);
    if (!ALLOWED_TYPES.has(file.type))
      return json({ success: false, error: "รองรับเฉพาะ JPEG, PNG, WebP" }, 415);
    if (file.size > MAX_FILE_SIZE)
      return json({ success: false, error: "ไฟล์ต้องไม่เกิน 10MB" }, 413);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `activities/${activityId}/${crypto.randomUUID()}-${safeName}`;
    await storage(env, token, path, {
      method: "POST",
      headers: { "Content-Type": file.type, "x-upsert": "false" },
      body: await file.arrayBuffer(),
    });
    const config = supabaseConfig(env);
    const publicUrl = `${config.url}/storage/v1/object/public/${BUCKET}/${path}`;
    try {
      const row = (await rest(env, token, "activity_media", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({
          activity_id: activityId,
          occurrence_id: occurrenceId,
          storage_path: path,
          public_url: publicUrl,
          media_type: "image",
          caption,
          is_post_event: true,
          created_by: user.id,
        }),
      })) as Row[];
      return json({ success: true, data: row[0] ?? null }, 201);
    } catch (error) {
      await storage(env, token, path, { method: "DELETE" }).catch(() => undefined);
      throw error;
    }
  } catch (error) {
    console.error("/api/admin/activity-media", error);
    return json(
      { success: false, error: error instanceof Error ? error.message : "Media operation failed" },
      500,
    );
  }
}
