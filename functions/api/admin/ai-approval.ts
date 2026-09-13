/**
 * AI Approval API
 * Handles governed approval decisions and triggers the shared execution endpoint.
 */

import { getSupabaseUser, isAdminRole, json, permissionsForRole, supabaseConfig } from "../auth/_shared";

type Env = Record<string, unknown>;

const cookie = (request: Request): string | null => {
  const cookies = (request.headers.get("Cookie") ?? "").split(";").map((v) => v.trim());
  const found = cookies.find((v) => v.startsWith("sb_access_token="));
  return found ? decodeURIComponent(found.slice(17)) : null;
};

async function callSupabase(env: Env, token: string, path: string, init: RequestInit = {}) {
  const { url, key, configured } = supabaseConfig(env);
  if (!configured) throw new Error("Supabase environment is not configured");
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: key, Authorization: `Bearer ${token}`, Accept: "application/json", ...(init.headers || {}) },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`Supabase REST ${response.status}`);
  return body;
}

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  try {
    const user = await getSupabaseUser(request, env);
    const role = user?.app_metadata?.role;
    const token = cookie(request);
    if (!user || !isAdminRole(role) || !token) return json({ success: false, error: "Unauthorized" }, 401);

    if (request.method === "GET") {
      const executions = await callSupabase(
        env,
        token,
        "ai_executions?status=eq.awaiting_approval&select=id,tool_id,intent,status,risk_level,input,execution_plan,steps,created_at&order=created_at.desc&limit=100",
      );
      if (executions?.length) {
        const toolIds = executions.map((exec: { tool_id?: string | null }) => exec.tool_id).filter((id): id is string => Boolean(id));
        if (toolIds.length) {
          const tools = await callSupabase(env, token, `ai_tools?id=in.(${toolIds.join(",")})&select=id,tool_key,name,description,domain,risk_level,permission`);
          const toolMap = new Map((tools || []).map((tool: { id: string }) => [tool.id, tool]));
          for (const execution of executions) execution.tool = execution.tool_id ? toolMap.get(execution.tool_id) : undefined;
        }
      }
      return json({ success: true, data: executions });
    }

    if (request.method !== "POST") return json({ success: false, error: "Method Not Allowed" }, 405, { Allow: "GET, POST" });

    const body = (await request.json()) as { executionId?: string; decision?: "approved" | "rejected"; reason?: string };
    if (!body.executionId || !body.decision) return json({ success: false, error: "executionId and decision are required" }, 400);

    const execRows = await callSupabase(
      env,
      token,
      `ai_executions?id=eq.${encodeURIComponent(body.executionId)}&select=id,tool_id,intent,status,risk_level,input,execution_plan,steps&limit=1`,
    );
    const execution = execRows?.[0];
    if (!execution || execution.status !== "awaiting_approval") return json({ success: false, error: "Execution is not awaiting approval" }, 409);

    const tools = await callSupabase(env, token, `ai_tools?id=eq.${encodeURIComponent(execution.tool_id ?? "")}&enabled=eq.true&select=id,tool_key,name,description,domain,endpoint,method,risk_level,permission,enabled&limit=1`);
    const tool = tools?.[0];
    if (!tool) return json({ success: false, error: "Tool no longer available" }, 404);

    if (tool.permission && !permissionsForRole(role).some((permission) => permission === tool.permission)) {
      return json({ success: false, error: "Forbidden: reviewer lacks tool permission" }, 403);
    }
    if (tool.risk_level === "critical" && role !== "SUPER_ADMIN") return json({ success: false, error: "Forbidden: critical AI actions require SUPER_ADMIN" }, 403);

    const existingApprovals = await callSupabase(env, token, `ai_approvals?execution_id=eq.${encodeURIComponent(execution.id)}&select=id,decision,reviewer_id,decided_at&order=decided_at.desc&limit=1`);
    if (existingApprovals?.length) return json({ success: false, error: "Execution already has an approval decision" }, 409);

    await callSupabase(env, token, "ai_approvals", {
      method: "POST",
      headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ execution_id: execution.id, reviewer_id: user.id, decision: body.decision, reason: body.reason?.trim() || null, decided_at: new Date().toISOString() }),
    });

    if (body.decision === "rejected") {
      await callSupabase(env, token, `ai_executions?id=eq.${encodeURIComponent(execution.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected", completed_at: new Date().toISOString() }),
      });
      return json({ success: true, status: "rejected", executionTriggered: false, message: "Execution rejected" });
    }

    // Keep the status at awaiting_approval. The execution endpoint verifies the approved record
    // before changing it to running, so approval cannot silently bypass the gate.
    const executionUrl = new URL("/api/admin/ai-execution", request.url);
    const executionResponse = await fetch(executionUrl.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", Cookie: request.headers.get("Cookie") ?? "" },
      body: JSON.stringify({ executionId: execution.id }),
    });
    const executionResult = await executionResponse.json().catch(() => null);

    return json(
      {
        success: executionResponse.ok,
        status: executionResponse.ok ? "approved" : "failed",
        executionTriggered: executionResponse.ok,
        executionResult: executionResult?.data,
        error: executionResponse.ok ? undefined : executionResult?.error ?? "Execution trigger failed",
        message: executionResponse.ok ? "Execution approved and completed/started" : "Approval was recorded but execution failed",
      },
      executionResponse.ok ? 200 : 502,
    );
  } catch (error) {
    console.error("/api/admin/ai-approval", error instanceof Error ? error.message : "AI approval processing failed");
    return json({ success: false, error: error instanceof Error ? error.message : "AI approval processing failed" }, 500);
  }
}
