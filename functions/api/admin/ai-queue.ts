/**
 * AI Queue API
 * Cloudflare Function for retrieving AI work queue with execution plans
 */

import { getSupabaseUser, isAdminRole, json, supabaseConfig } from "../auth/_shared";

type Env = Record<string, unknown>;

const cookie = (request: Request): string | null => {
  const cookies = (request.headers.get("Cookie") ?? "").split(";").map((v) => v.trim());
  const found = cookies.find((v) => v.startsWith("sb_access_token="));
  return found ? decodeURIComponent(found.slice(17)) : null;
};

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  try {
    // Only allow GET requests
    if (request.method !== "GET") {
      return json({ success: false, error: "Method Not Allowed" }, 405, { Allow: "GET" });
    }

    // Authentication check
    const user = await getSupabaseUser(request, env);
    const role = user?.app_metadata?.role;
    const token = cookie(request);

    if (!user || !isAdminRole(role) || !token) {
      return json({ success: false, error: "Unauthorized" }, 401);
    }

    const { url, key } = supabaseConfig(env);

    // Fetch active executions with execution plans
    const response = await fetch(
      `${url}/rest/v1/ai_executions?status=in.(queued,running,awaiting_approval)&select=id,intent,status,risk_level,created_at,started_at,execution_plan,steps,tool_id&order=created_at.desc&limit=100`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );

    const body = await response.json().catch(() => null);

    // Fetch tool information for executions that have tool_id
    if (body && Array.isArray(body) && body.length > 0) {
      const toolIds = body
        .map((exec: any) => exec.tool_id)
        .filter((id: string | null) => id !== null)
        .join(",");

      if (toolIds) {
        const toolsResponse = await fetch(
          `${url}/rest/v1/ai_tools?id=in.(${toolIds})&select=id,tool_key,name,description,domain,risk_level`,
          {
            headers: {
              apikey: key,
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          },
        );

        const tools = await toolsResponse.json().catch(() => []);

        // Map tools to executions
        const toolMap = new Map((tools || []).map((tool: any) => [tool.id, tool]));

        body.forEach((execution: any) => {
          if (execution.tool_id && toolMap.has(execution.tool_id)) {
            execution.tool = toolMap.get(execution.tool_id);
          }
        });
      }
    }

    return json(
      {
        success: response.ok,
        data: body,
      },
      response.ok ? 200 : response.status,
    );
  } catch (error) {
    console.error("/api/admin/ai-queue", error);
    return json(
      {
        success: false,
        error: error instanceof Error ? error.message : "AI queue failed",
      },
      500,
    );
  }
}
