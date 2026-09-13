import { getSupabaseUser, isAdminRole, json, supabaseConfig } from "../auth/_shared";

type Env = Record<string, unknown>;
type Status = "draft" | "scheduled" | "ongoing" | "completed" | "cancelled" | "archived";
type Input = {
  id?: string;
  activityId?: string;
  occurrenceNo?: number;
  startAt?: string;
  endAt?: string | null;
  status?: Status;
  cancellationReason?: string | null;
  participantCount?: number;
  locationType?: "center" | "learning_center" | "external" | "online" | "hybrid";
  locationDetail?: string | null;
};
function cookieValue(request: Request, name: string) {
  const header = request.headers.get("Cookie") ?? "";
  const part = header
    .split(";")
    .map((x) => x.trim())
    .find((x) => x.startsWith(`${name}=`));
  return part ? decodeURIComponent(part.slice(name.length + 1)) : null;
}
async function requestDb<T>(env: Env, token: string, path: string, init: RequestInit = {}) {
  const { url, key, configured } = supabaseConfig(env);
  if (!configured) throw new Error("Supabase is not configured");
  const r = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const body = await r.json().catch(() => null);
  if (!r.ok)
    throw new Error(
      `Supabase REST ${r.status}: ${typeof body?.message === "string" ? body.message.slice(0, 300) : "request failed"}`,
    );
  return body as T;
}
async function auth(request: Request, env: Env) {
  const user = await getSupabaseUser(request, env);
  const role = user?.app_metadata?.role;
  const token = cookieValue(request, "sb_access_token");
  if (!user || !isAdminRole(role) || !token) return null;
  if (role !== "SUPER_ADMIN" && role !== "OPERATIONS_ADMIN") return null;
  return token;
}
const select =
  "id,activity_id,occurrence_no,start_at,end_at,status,cancellation_reason,participant_count,location_type,location_detail,created_at,updated_at";
function toRow(input: Input) {
  return {
    activity_id: input.activityId,
    occurrence_no: Math.max(1, Number(input.occurrenceNo ?? 1)),
    start_at: input.startAt,
    end_at: input.endAt || null,
    status: input.status ?? "scheduled",
    cancellation_reason: input.cancellationReason || null,
    participant_count: Math.max(0, Number(input.participantCount ?? 0)),
    location_type: input.locationType ?? null,
    location_detail: input.locationDetail || null,
  };
}
export async function onRequest({ request, env }: { request: Request; env: Env }) {
  const token = await auth(request, env);
  if (!token) return json({ success: false, error: "Forbidden" }, 403);
  const method = request.method.toUpperCase();
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const activityId = url.searchParams.get("activityId");
    if (method === "GET") {
      const filter = activityId ? `&activity_id=eq.${encodeURIComponent(activityId)}` : "";
      const rows = await requestDb<Record<string, unknown>[]>(
        env,
        token,
        `activity_occurrences?select=${select}${filter}&order=occurrence_no.asc`,
      );
      return json({ success: true, data: rows });
    }
    if (method === "POST") {
      const input = (await request.json()) as Input;
      if (!input.activityId || !input.startAt)
        return json({ success: false, error: "กรุณาระบุกิจกรรมและเวลาเริ่ม" }, 400);
      const rows = await requestDb<Record<string, unknown>[]>(env, token, "activity_occurrences", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify(toRow(input)),
      });
      return json({ success: true, data: rows[0] ?? null }, 201);
    }
    if (!id) return json({ success: false, error: "ต้องระบุ id" }, 400);
    if (method === "PUT") {
      const input = (await request.json()) as Input;
      const rows = await requestDb<Record<string, unknown>[]>(
        env,
        token,
        `activity_occurrences?id=eq.${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          headers: { Prefer: "return=representation" },
          body: JSON.stringify(toRow(input)),
        },
      );
      return rows[0]
        ? json({ success: true, data: rows[0] })
        : json({ success: false, error: "ไม่พบ occurrence" }, 404);
    }
    if (method === "DELETE") {
      const rows = await requestDb<Record<string, unknown>[]>(
        env,
        token,
        `activity_occurrences?id=eq.${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          headers: { Prefer: "return=representation" },
          body: JSON.stringify({ status: "archived" }),
        },
      );
      return rows[0]
        ? json({ success: true, data: rows[0] })
        : json({ success: false, error: "ไม่พบ occurrence" }, 404);
    }
    return json({ error: "Method Not Allowed" }, 405, { Allow: "GET, POST, PUT, DELETE" });
  } catch (error) {
    return json(
      { success: false, error: error instanceof Error ? error.message : "ไม่สามารถดำเนินการได้" },
      500,
    );
  }
}
