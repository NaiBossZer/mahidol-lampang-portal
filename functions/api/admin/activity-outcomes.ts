import { getCookie, getSupabaseUser, hasAdminPermission, isAdminRole, json, supabaseConfig } from "../auth/_shared";

type Env = Record<string, unknown>;
type Row = Record<string, unknown>;
type OutcomeInput = {
  activityId?: string;
  metricName?: string;
  value?: string | number | null;
  unit?: string | null;
  description?: string | null;
};



async function rest<T>(env: Env, token: string, path: string, init: RequestInit = {}) {
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
  if (!response.ok) {
    const detail = typeof body === "object" && body && "message" in body ? String(body.message) : "";
    throw new Error(`Supabase REST ${response.status}${detail ? `: ${detail.slice(0, 300)}` : ""}`);
  }
  return body as T;
}

function normalize(row: Row) {
  return {
    id: String(row.id),
    activity_id: String(row.activity_id),
    metric_name: String(row.metric_name ?? ""),
    metric_value: row.metric_value == null ? null : String(row.metric_value),
    unit: row.unit == null ? null : String(row.unit),
    description: row.description == null ? null : String(row.description),
    created_at: String(row.created_at ?? ""),
  };
}

async function authorize(request: Request, env: Env) {
  const user = await getSupabaseUser(request, env);
  const role = String(user?.app_metadata?.role ?? "");
  if (!user || !isAdminRole(role)) return { error: json({ success: false, error: "Forbidden" }, 403) } as const;
  const token = getCookie(request, "sb_access_token");
  if (!token) return { error: json({ success: false, error: "Unauthorized" }, 401) } as const;
  return { token, role } as const;
}

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  const method = request.method.toUpperCase();
  if (!["GET", "POST", "PATCH", "DELETE"].includes(method)) {
    return json({ success: false, error: "Method Not Allowed" }, 405, { Allow: "GET, POST, PATCH, DELETE" });
  }
  const auth = await authorize(request, env);
  if ("error" in auth) return auth.error;
  const params = new URL(request.url).searchParams;

  if (
    method === "GET"
      ? !hasAdminPermission(auth.role, "activities.read")
      : !hasAdminPermission(auth.role, "activities.update") &&
        !hasAdminPermission(auth.role, "survey.update")
  ) {
    return json({ success: false, error: "Forbidden" }, 403);
  }

  try {
    if (method === "GET") {
      const activityId = params.get("activityId");
      const query = new URLSearchParams({
        select: "id,activity_id,metric_name,metric_value,unit,description,created_at",
        order: "created_at.asc",
      });
      if (activityId) query.set("activity_id", `eq.${activityId}`);
      const rows = await rest<Row[]>(env, auth.token, `activity_outcomes?${query.toString()}`);
      return json({ success: true, data: rows.map(normalize) });
    }

    if (method === "POST") {
      const input = (await request.json()) as OutcomeInput;
      const activityId = String(input.activityId ?? "").trim();
      const metricName = String(input.metricName ?? "").trim();
      const metricValue = input.value == null ? "" : String(input.value).trim();
      if (!activityId || !metricName || !metricValue) {
        return json({ success: false, error: "กรุณาระบุ Activity, Metric Name และ Value" }, 400);
      }
      const rows = await rest<Row[]>(env, auth.token, "activity_outcomes", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({
          activity_id: activityId,
          metric_name: metricName,
          metric_value: metricValue,
          unit: input.unit == null ? null : String(input.unit).trim() || null,
          description: input.description == null ? null : String(input.description).trim() || null,
        }),
      });
      return json({ success: true, data: rows[0] ? normalize(rows[0]) : null }, 201);
    }

    const id = params.get("id");
    if (!id) return json({ success: false, error: "ต้องระบุ id ของ Outcome Metric" }, 400);

    if (method === "PATCH") {
      const input = (await request.json()) as OutcomeInput;
      const patch: Record<string, unknown> = {};
      if (Object.prototype.hasOwnProperty.call(input, "metricName")) {
        const metricName = String(input.metricName ?? "").trim();
        if (!metricName) return json({ success: false, error: "Metric Name ห้ามว่าง" }, 400);
        patch.metric_name = metricName;
      }
      if (Object.prototype.hasOwnProperty.call(input, "value")) {
        const value = input.value == null ? "" : String(input.value).trim();
        if (!value) return json({ success: false, error: "Value ห้ามว่าง" }, 400);
        patch.metric_value = value;
      }
      if (Object.prototype.hasOwnProperty.call(input, "unit")) patch.unit = input.unit == null ? null : String(input.unit).trim() || null;
      if (Object.prototype.hasOwnProperty.call(input, "description")) patch.description = input.description == null ? null : String(input.description).trim() || null;
      if (!Object.keys(patch).length) return json({ success: false, error: "ไม่พบ field ที่ต้องการอัปเดต" }, 400);
      const rows = await rest<Row[]>(env, auth.token, `activity_outcomes?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify(patch),
      });
      if (!rows[0]) return json({ success: false, error: "ไม่พบ Outcome Metric" }, 404);
      return json({ success: true, data: normalize(rows[0]) });
    }

    const rows = await rest<Row[]>(env, auth.token, `activity_outcomes?id=eq.${encodeURIComponent(id)}&select=id`, {
      method: "DELETE",
      headers: { Prefer: "return=representation" },
    });
    if (!rows[0]) return json({ success: false, error: "ไม่พบ Outcome Metric" }, 404);
    return json({ success: true, data: { id } });
  } catch (error) {
    console.error(`/api/admin/activity-outcomes ${method}`, error);
    return json({ success: false, error: error instanceof Error ? error.message : "Outcome Metric operation failed" }, 500);
  }
}
