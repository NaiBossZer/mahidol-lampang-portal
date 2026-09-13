import { getCookie, getSupabaseUser, isAdminRole, json, supabaseConfig } from "../auth/_shared";

type Env = Record<string, unknown>;

type ActivityOrganization = {
  organizationId: string;
  organizerRole?: string;
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
    throw new Error(`Supabase REST ${response.status}`);
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
    if (!activityId) {
      return json({ success: false, error: "activityId required" }, 400);
    }

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
    const learningCenterIds = Array.isArray(body.learningCenterIds) ? body.learningCenterIds : [];
    const organizations = Array.isArray(body.organizations) ? body.organizations : [];

    await call(
      env,
      token,
      `activity_learning_centers?activity_id=eq.${encodeURIComponent(activityId)}`,
      { method: "DELETE" },
    );

    if (learningCenterIds.length) {
      await call(env, token, "activity_learning_centers", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify(
          learningCenterIds.map((learning_center_id) => ({
            activity_id: activityId,
            learning_center_id,
          })),
        ),
      });
    }

    await call(env, token, `activity_organizers?activity_id=eq.${encodeURIComponent(activityId)}`, {
      method: "DELETE",
    });

    if (organizations.length) {
      await call(env, token, "activity_organizers", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify(
          organizations.map((organization) => ({
            activity_id: activityId,
            organization_id: organization.organizationId,
            organizer_role: organization.organizerRole ?? "co",
          })),
        ),
      });
    }

    return json({
      success: true,
      data: { learningCenterIds, organizations },
    });
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
