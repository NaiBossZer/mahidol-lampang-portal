import { getCookie, getSupabaseUser, isAdminRole, json, supabaseConfig } from "../auth/_shared";

type Env = Record<string, unknown>;
type MediaRow = Record<string, unknown>;

const BUCKET = "portal-media";
const MAX_FILE_SIZE = 25 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);
const ADMIN_ROLES = new Set(["SUPER_ADMIN", "CONTENT_ADMIN", "OPERATIONS_ADMIN"]);

function cleanSegment(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

function cleanFileName(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-").slice(0, 160) || "file";
}

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
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${token}`,
      ...(init.headers ?? {}),
    },
  });
  if (!response.ok) throw new Error(`Storage ${response.status}`);
  return response;
}

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  try {
    const user = await getSupabaseUser(request, env);
    const role = String(user?.app_metadata?.role ?? "");
    const token = getCookie(request, "sb_access_token");
    if (!user || !isAdminRole(role) || !token || !ADMIN_ROLES.has(role)) {
      return json({ success: false, error: "Unauthorized" }, 401);
    }

    const params = new URL(request.url).searchParams;

    if (request.method === "GET") {
      const entityType = params.get("entityType");
      const entityId = params.get("entityId");
      const fieldKey = params.get("fieldKey");
      const query = new URLSearchParams({ select: "*", order: "display_order.asc,created_at.desc" });
      if (entityType) query.set("entity_type", `eq.${encodeURIComponent(entityType)}`);
      if (entityId) query.set("entity_id", `eq.${encodeURIComponent(entityId)}`);
      if (fieldKey) query.set("field_key", `eq.${encodeURIComponent(fieldKey)}`);
      return json({ success: true, data: await rest(env, token, `portal_media_assets?${query.toString()}`) });
    }

    if (request.method === "POST") {
      const form = await request.formData();
      const entityType = cleanSegment(String(form.get("entityType") ?? ""));
      const entityId = String(form.get("entityId") ?? "");
      const fieldKey = cleanSegment(String(form.get("fieldKey") ?? ""));
      const caption = String(form.get("caption") ?? "").trim() || null;
      const altText = String(form.get("altText") ?? "").trim() || null;
      const file = form.get("file");
      if (!entityType || !entityId || !fieldKey || !(file instanceof File)) {
        return json({ success: false, error: "entityType, entityId, fieldKey และ file จำเป็น" }, 400);
      }
      if (!ALLOWED_TYPES.has(file.type)) return json({ success: false, error: "รองรับ JPEG, PNG, WebP และ PDF" }, 415);
      if (file.size > MAX_FILE_SIZE) return json({ success: false, error: "ไฟล์ต้องไม่เกิน 25MB" }, 413);

      const path = `${entityType}/${entityId}/${fieldKey}/${crypto.randomUUID()}-${cleanFileName(file.name)}`;
      await storage(env, token, path, {
        method: "POST",
        headers: { "Content-Type": file.type, "x-upsert": "false" },
        body: await file.arrayBuffer(),
      });

      const config = supabaseConfig(env);
      const publicUrl = `${config.url}/storage/v1/object/public/${BUCKET}/${path}`;
      try {
        const rows = await rest(env, token, "portal_media_assets", {
          method: "POST",
          headers: { Prefer: "return=representation" },
          body: JSON.stringify({
            bucket_id: BUCKET,
            storage_path: path,
            public_url: publicUrl,
            entity_type: entityType,
            entity_id: entityId,
            field_key: fieldKey,
            media_type: file.type.startsWith("image/") ? "image" : "document",
            mime_type: file.type,
            size_bytes: file.size,
            original_name: file.name,
            caption,
            alt_text: altText,
            created_by: user.id,
          }),
        });
        return json({ success: true, data: Array.isArray(rows) ? rows[0] : rows }, 201);
      } catch (error) {
        await storage(env, token, path, { method: "DELETE" }).catch(() => undefined);
        throw error;
      }
    }

    if (request.method === "DELETE") {
      const id = params.get("id");
      if (!id) return json({ success: false, error: "id required" }, 400);
      const rows = await rest<MediaRow[]>(env, token, `portal_media_assets?id=eq.${encodeURIComponent(id)}&select=id,storage_path`);
      const row = rows[0];
      if (!row) return json({ success: false, error: "ไม่พบไฟล์" }, 404);
      await storage(env, token, String(row.storage_path), { method: "DELETE" });
      await rest(env, token, `portal_media_assets?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
      return json({ success: true, data: { id } });
    }

    return json({ success: false, error: "Method Not Allowed" }, 405, { Allow: "GET, POST, DELETE" });
  } catch (error) {
    console.error("/api/admin/media", error);
    return json({ success: false, error: error instanceof Error ? error.message : "Media operation failed" }, 500);
  }
}
