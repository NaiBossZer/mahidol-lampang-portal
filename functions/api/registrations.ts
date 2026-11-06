import { getCookie, getSupabaseUser, hasAdminPermission, isAdminRole, json, supabaseConfig } from "./auth/_shared";

type Env = Record<string, unknown>;
type Row = Record<string, unknown>;

async function requestRest<T>(env: Env, path: string, init: RequestInit = {}, accessToken?: string): Promise<T> {
  const { url, key, configured } = supabaseConfig(env);
  if (!configured) throw new Error("Supabase is not configured");
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${accessToken || key}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const value = body as { message?: string; code?: string } | null;
    const error = new Error(`Supabase REST ${response.status}${value?.message ? `: ${value.message}` : ""}`);
    (error as Error & { code?: string }).code = value?.code;
    throw error;
  }
  return body as T;
}

async function authorizeAdmin(request: Request, env: Env) {
  const user = await getSupabaseUser(request, env);
  const role = String(user?.app_metadata?.role ?? "");
  const token = getCookie(request, "sb_access_token");
  if (!user || !token || !isAdminRole(role) || !hasAdminPermission(role, "activities.read")) return null;
  return { token, role };
}

function normalizePhone(value: string) {
  return value.replace(/[^0-9+]/g, "").replace(/^\+66/, "0");
}

function registrationCode() {
  return `ENVI-${crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  try {
    const url = new URL(request.url);

    if (request.method === "GET" && url.searchParams.has("activityId")) {
      const admin = await authorizeAdmin(request, env);
      if (!admin) return json({ success: false, error: "ไม่มีสิทธิ์ดูรายชื่อผู้ลงทะเบียน" }, 403);
      const activityId = url.searchParams.get("activityId")!;
      const rows = await requestRest<Row[]>(
        env,
        `activity_registrations?activity_id=eq.${encodeURIComponent(activityId)}&select=id,registration_code,full_name,phone,email,organization,position,participant_type,status,created_at,checked_in_at&order=created_at.desc`,
        {},
        admin.token,
      );
      return json({ success: true, data: rows });
    }

    if (request.method === "GET") {
      const slug = url.searchParams.get("slug")?.trim();
      if (!slug) return json({ success: false, error: "กรุณาระบุ slug กิจกรรม" }, 400);
      const rows = await requestRest<Row[]>(
        env,
        `activities?slug=eq.${encodeURIComponent(slug)}&status=eq.published&select=id,title,slug,activity_date,location,featured_image,summary&limit=1`,
      );
      if (!rows[0]) return json({ success: false, error: "กิจกรรมนี้ยังไม่เปิดรับลงทะเบียน" }, 404);
      return json({ success: true, data: rows[0] });
    }

    if (request.method === "POST") {
      const body = await request.json() as Record<string, unknown>;
      const activityId = String(body.activityId ?? "").trim();
      const fullName = String(body.fullName ?? "").trim();
      const phone = String(body.phone ?? "").trim();
      const phoneNormalized = normalizePhone(phone);
      const email = String(body.email ?? "").trim().toLowerCase();
      const organization = String(body.organization ?? "").trim();
      const position = String(body.position ?? "").trim();
      const participantType = String(body.participantType ?? "general").trim();
      if (!activityId || fullName.length < 2 || fullName.length > 200 || !/^0[0-9]{8,9}$/.test(phoneNormalized) || body.pdpaConsent !== true) {
        return json({ success: false, error: "กรุณากรอกชื่อและเบอร์โทรศัพท์ให้ถูกต้อง พร้อมยินยอมประกาศความเป็นส่วนตัว" }, 400);
      }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ success: false, error: "รูปแบบอีเมลไม่ถูกต้อง" }, 400);
      const activities = await requestRest<Row[]>(
        env,
        `activities?id=eq.${encodeURIComponent(activityId)}&status=eq.published&select=id&limit=1`,
      );
      if (!activities[0]) return json({ success: false, error: "กิจกรรมยังไม่เปิดรับลงทะเบียน" }, 409);

      const code = registrationCode();
      await requestRest<null>(env, "activity_registrations", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          activity_id: activityId,
          registration_code: code,
          full_name: fullName,
          phone,
          phone_normalized: phoneNormalized,
          email: email || null,
          organization: organization || null,
          position: position || null,
          participant_type: participantType,
          pdpa_consent: true,
          pdpa_consent_at: new Date().toISOString(),
          pdpa_notice_version: "1.0",
        }),
      });
      return json({ success: true, data: { registrationCode: code } }, 201);
    }

    if (request.method === "PATCH") {
      const admin = await authorizeAdmin(request, env);
      if (!admin || !hasAdminPermission(admin.role, "activities.update")) return json({ success: false, error: "ไม่มีสิทธิ์แก้ไขสถานะผู้ลงทะเบียน" }, 403);
      const body = await request.json() as { id?: string; status?: string };
      if (!body.id || !["registered", "checked_in", "cancelled"].includes(String(body.status))) return json({ success: false, error: "ข้อมูลสถานะไม่ถูกต้อง" }, 400);
      const rows = await requestRest<Row[]>(
        env,
        `activity_registrations?id=eq.${encodeURIComponent(body.id)}&select=id,status`,
        {
          method: "PATCH",
          headers: { Prefer: "return=representation" },
          body: JSON.stringify({
            status: body.status,
            checked_in_at: body.status === "checked_in" ? new Date().toISOString() : null,
            checked_in_by: body.status === "checked_in" ? (await getSupabaseUser(request, env))?.id ?? null : null,
          }),
        },
        admin.token,
      );
      if (!rows[0]) return json({ success: false, error: "ไม่พบรายการลงทะเบียน" }, 404);
      return json({ success: true, data: rows[0] });
    }

    return json({ success: false, error: "Method Not Allowed" }, 405, { Allow: "GET, POST, PATCH" });
  } catch (error) {
    console.error("/api/registrations", error);
    const code = (error as { code?: string } | null)?.code;
    if (code === "23505") return json({ success: false, error: "เบอร์โทรศัพท์นี้ลงทะเบียนกิจกรรมแล้ว" }, 409);
    return json({ success: false, error: error instanceof Error ? error.message : "ไม่สามารถดำเนินการได้" }, 500);
  }
}
