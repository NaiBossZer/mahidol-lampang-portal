import { getCookie, getSupabaseUser, hasAdminPermission, isAdminRole, json, supabaseConfig } from "../auth/_shared";

type Env = Record<string, unknown>;
type Settings = {
  activity_id: string;
  enabled: boolean;
  opens_at: string | null;
  closes_at: string | null;
  capacity: number | null;
  form_fields: Record<string, boolean>;
  confirmation_message: string;
  updated_at?: string;
};

async function rest<T>(env: Env, path: string, init: RequestInit = {}, token?: string): Promise<T> {
  const { url, key, configured } = supabaseConfig(env);
  if (!configured) throw new Error("Supabase is not configured");
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${token || key}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const value = body as { message?: string } | null;
    throw new Error(`Supabase REST ${response.status}${value?.message ? `: ${value.message}` : ""}`);
  }
  return body as T;
}

const DEFAULT_FIELDS = { email: true, position: true, participantType: true };

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  const user = await getSupabaseUser(request, env);
  const role = String(user?.app_metadata?.role ?? "");
  const token = getCookie(request, "sb_access_token");
  if (!user || !token || !isAdminRole(role) || !hasAdminPermission(role, "activities.update")) {
    return json({ success: false, error: "ไม่มีสิทธิ์ตั้งค่าการลงทะเบียน" }, 403);
  }

  const activityId = new URL(request.url).searchParams.get("activityId")?.trim();
  if (!activityId) return json({ success: false, error: "กรุณาระบุรหัสกิจกรรม" }, 400);

  try {
    if (request.method === "GET") {
      const rows = await rest<Settings[]>(env,
        `activity_registration_settings?activity_id=eq.${encodeURIComponent(activityId)}&select=activity_id,enabled,opens_at,closes_at,capacity,form_fields,confirmation_message,updated_at&limit=1`,
        {}, token);
      return json({ success: true, data: rows[0] ?? {
        activity_id: activityId, enabled: true, opens_at: null, closes_at: null,
        capacity: null, form_fields: DEFAULT_FIELDS,
        confirmation_message: "ลงทะเบียนสำเร็จ ขอบคุณที่สนใจเข้าร่วมกิจกรรม",
      }});
    }

    if (request.method === "PUT") {
      const body = await request.json() as Record<string, unknown>;
      const enabled = body.enabled === true;
      const opensAt = body.opensAt ? new Date(String(body.opensAt)) : null;
      const closesAt = body.closesAt ? new Date(String(body.closesAt)) : null;
      const capacity = body.capacity === null || body.capacity === "" ? null : Number(body.capacity);
      if ((opensAt && !Number.isFinite(opensAt.getTime())) || (closesAt && !Number.isFinite(closesAt.getTime())) ||
          (opensAt && closesAt && opensAt >= closesAt)) {
        return json({ success: false, error: "ช่วงเวลาเปิด–ปิดรับสมัครไม่ถูกต้อง" }, 400);
      }
      if (capacity !== null && (!Number.isInteger(capacity) || capacity < 1)) {
        return json({ success: false, error: "จำนวนรับสมัครต้องเป็นจำนวนเต็มตั้งแต่ 1 คนขึ้นไป" }, 400);
      }
      const fieldsInput = body.formFields && typeof body.formFields === "object" ? body.formFields as Record<string, unknown> : {};
      const formFields = {
        email: fieldsInput.email === true,
        position: fieldsInput.position === true,
        participantType: fieldsInput.participantType === true,
      };
      const message = String(body.confirmationMessage ?? "").trim().slice(0, 500) ||
        "ลงทะเบียนสำเร็จ ขอบคุณที่สนใจเข้าร่วมกิจกรรม";
      const activity = await rest<Array<{id:string}>>(env,
        `activities?id=eq.${encodeURIComponent(activityId)}&select=id&limit=1`, {}, token);
      if (!activity[0]) return json({ success: false, error: "ไม่พบกิจกรรม" }, 404);

      const rows = await rest<Settings[]>(env, "activity_registration_settings?on_conflict=activity_id&select=activity_id,enabled,opens_at,closes_at,capacity,form_fields,confirmation_message,updated_at", {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify({
          activity_id: activityId, enabled,
          opens_at: opensAt?.toISOString() ?? null,
          closes_at: closesAt?.toISOString() ?? null,
          capacity, form_fields: formFields, confirmation_message: message,
          updated_by: user.id, updated_at: new Date().toISOString(),
        }),
      }, token);
      return json({ success: true, data: rows[0] });
    }
    return json({ success: false, error: "Method Not Allowed" }, 405, { Allow: "GET, PUT" });
  } catch (error) {
    console.error("/api/admin/registration-settings", error);
    return json({ success: false, error: error instanceof Error ? error.message : "บันทึกการตั้งค่าไม่สำเร็จ" }, 500);
  }
}
