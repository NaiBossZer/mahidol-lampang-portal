import { getCookie, getSupabaseUser, isAdminRole, json, supabaseConfig } from "../auth/_shared";

type Env = Record<string, unknown>;
type ActivityOrganization = {
  organizationId: string;
  organizerRole?: "primary" | "co";
};
type RelationBody = {
  learningCenterIds?: string[];
  organizations?: ActivityOrganization[];
};

async function call(env: Env, token: string, path: string, init: RequestInit = {}) {
  const { url, key, configured } = supabaseConfig(env);
  if (!configured) throw new Error("Supabase is not configured");
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
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
  return body;
}

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  try {
    const user = await getSupabaseUser(request, env);
    const role = String(user?.app_metadata?.role ?? "");
    const token = getCookie(request, "sb_access_token");

    if (!user || !isAdminRole(role) || !token) {
      return json({ success: false, error: "Unauthorized" }, 401);
    }

    const params = new URL(request.url).searchParams;
    const activityId = params.get("activityId");
    if (!activityId) return json({ success: false, error: "activityId required" }, 400);

    if (request.method === "GET") {
      const [learningCenters, organizations] = await Promise.all([
        call(
          env,
          token,
          `activity_learning_centers?activity_id=eq.${encodeURIComponent(activityId)}&select=learning_center_id`,
        ),
        call(
          env,
          token,
          `activity_organizers?activity_id=eq.${encodeURIComponent(activityId)}&select=organization_id,organizer_role`,
        ),
      ]);

      return json({
        success: true,
        data: {
          learningCenterIds: (learningCenters as Array<{ learning_center_id: string }>).map(
            (row) => row.learning_center_id,
          ),
          organizations,
        },
      });
    }

    if (!["SUPER_ADMIN", "CONTENT_ADMIN", "OPERATIONS_ADMIN"].includes(role)) {
      return json({ success: false, error: "Forbidden" }, 403);
    }

    if (request.method !== "PUT") {
      return json({ success: false, error: "Method Not Allowed" }, 405, { Allow: "GET, PUT" });
    }

    const body = (await request.json()) as RelationBody;
    const learningCenterIds = Array.isArray(body.learningCenterIds) ? [...new Set(body.learningCenterIds)] : [];
    const organizations = Array.isArray(body.organizations)
      ? body.organizations.map((organization) => ({
          organizationId: organization.organizationId,
          organizerRole: organization.organizerRole ?? "co",
        }))
      : [];

    if (learningCenterIds.some((id) => !id) || organizations.some((item) => !item.organizationId)) {
      return json({ success: false, error: "ข้อมูลความสัมพันธ์ไม่ถูกต้อง" }, 400);
    }
    if (organizations.some((item) => !["primary", "co"].includes(item.organizerRole))) {
      return json({ success: false, error: "บทบาทผู้จัดกิจกรรมไม่ถูกต้อง" }, 400);
    }

    const result = await call(env, token, "rpc/replace_activity_relations", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        p_activity_id: activityId,
        p_learning_center_ids: learningCenterIds,
        p_organizations: organizations,
      }),
    });

    return json({ success: true, data: result });
  } catch (error) {
    console.error("/api/admin/activity-relations", error);
    return json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Activity relationship failed",
      },
      500,
    );
  }
}
