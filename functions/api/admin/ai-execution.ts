/**
 * AI Execution Management API
 * Executes a previously created, governed AI execution.
 */

import { getSupabaseUser, isAdminRole, json, permissionsForRole, supabaseConfig } from "../auth/_shared";

type Env = Record<string, unknown>;
type Tool = {
  id: string;
  tool_key: string;
  name: string;
  endpoint: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  risk_level: "low" | "medium" | "high" | "critical";
  permission: string | null;
  enabled: boolean;
};

const getToken = (request: Request): string | null => {
  const cookies = (request.headers.get("Cookie") ?? "").split(";").map((part) => part.trim());
  const found = cookies.find((part) => part.startsWith("sb_access_token="));
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

function buildTarget(request: Request, tool: Tool, input: Record<string, unknown>): URL {
  const requestOrigin = new URL(request.url).origin;
  const target = new URL(tool.endpoint, request.url);
  if (target.origin !== requestOrigin) throw new Error("AI tool endpoint must use the same origin as the Portal");

  for (const [key, value] of Object.entries(input)) {
    const marker = `:${key}`;
    if (target.pathname.includes(marker)) target.pathname = target.pathname.replace(marker, encodeURIComponent(String(value)));
  }

  if (tool.method === "GET") {
    for (const [key, value] of Object.entries(input)) {
      if (value !== undefined && value !== null && !tool.endpoint.includes(`:${key}`)) target.searchParams.set(key, String(value));
    }
  }
  return target;
}

async function runExecution(request: Request, env: Env, token: string, execution: Record<string, unknown>, tool: Tool) {
  const id = String(execution.id);
  const input = execution.input && typeof execution.input === "object" ? execution.input as Record<string, unknown> : {};
  const startedAt = new Date().toISOString();

  await callSupabase(env, token, `ai_executions?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "running", started_at: startedAt }),
  });

  try {
    const target = buildTarget(request, tool, input);
    const response = await fetch(target.toString(), {
      method: tool.method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Cookie: request.headers.get("Cookie") ?? "",
        "X-AI-Execution-Id": id,
      },
      body: tool.method === "GET" || tool.method === "DELETE" ? undefined : JSON.stringify(input),
    });
    const result = await response.json().catch(async () => await response.text().catch(() => null));
    const completedAt = new Date().toISOString();
    const status = response.ok ? "completed" : "failed";

    await callSupabase(env, token, `ai_executions?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, output: response.ok ? result : null, error: response.ok ? null : `Portal API ${response.status}`, completed_at: completedAt }),
    });

    return { status, result };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Execution failed";
    await callSupabase(env, token, `ai_executions?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "failed", error: message, completed_at: new Date().toISOString() }),
    });
    return { status: "failed", result: null, error: message };
  }
}

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  try {
    const user = await getSupabaseUser(request, env);
    const role = user?.app_metadata?.role;
    const token = getToken(request);
    if (!user || !isAdminRole(role) || !token) return json({ success: false, error: "Unauthorized" }, 401);

    const url = new URL(request.url);
    const pathParts = url.pathname.split("/").filter(Boolean);
    const tail = pathParts[pathParts.length - 1];
    const executionId = tail && tail !== "ai-execution" ? tail : null;

    if (request.method === "GET") {
      const path = executionId
        ? `ai_executions?id=eq.${encodeURIComponent(executionId)}&select=*`
        : "ai_executions?select=*&order=created_at.desc&limit=50";
      const data = await callSupabase(env, token, path);
      if (executionId && (!Array.isArray(data) || data.length === 0)) return json({ success: false, error: "Execution not found" }, 404);
      return json({ success: true, data: executionId ? data[0] : data });
    }

    if (request.method === "POST") {
      const body = (await request.json()) as { executionId?: string };
      if (!body.executionId) return json({ success: false, error: "executionId is required" }, 400);

      const rows = await callSupabase(env, token, `ai_executions?id=eq.${encodeURIComponent(body.executionId)}&select=id,actor_id,tool_id,status,risk_level,input&limit=1`);
      const execution = rows?.[0];
      if (!execution) return json({ success: false, error: "Execution not found" }, 404);

      const tools = await callSupabase(env, token, `ai_tools?id=eq.${encodeURIComponent(execution.tool_id ?? "")}&enabled=eq.true&select=id,tool_key,name,endpoint,method,risk_level,permission,enabled&limit=1`);
      const tool = tools?.[0] as Tool | undefined;
      if (!tool) return json({ success: false, error: "Tool not found or disabled" }, 404);
      if (tool.permission && !permissionsForRole(role).some((permission) => permission === tool.permission)) return json({ success: false, error: "Forbidden: tool permission denied" }, 403);

      if (execution.status === "queued") {
        if (tool.risk_level !== "low") return json({ success: false, error: "Approval required before executing this risk level" }, 409);
      } else if (execution.status === "awaiting_approval") {
        const approvals = await callSupabase(env, token, `ai_approvals?execution_id=eq.${encodeURIComponent(body.executionId)}&decision=eq.approved&select=id&order=decided_at.desc&limit=1`);
        if (!approvals?.length) return json({ success: false, error: "Execution has not been approved" }, 409);
      } else {
        return json({ success: false, error: `Execution cannot be executed in status: ${execution.status}` }, 409);
      }

      const result = await runExecution(request, env, token, execution, tool);
      return json({ success: result.status === "completed", data: { executionId: body.executionId, status: result.status, result: result.result }, error: result.error }, result.status === "completed" ? 200 : 502);
    }

    if (request.method === "DELETE") {
      if (!executionId) return json({ success: false, error: "Execution ID is required" }, 400);
      const rows = await callSupabase(env, token, `ai_executions?id=eq.${encodeURIComponent(executionId)}&select=status&limit=1`);
      const execution = rows?.[0];
      if (!execution) return json({ success: false, error: "Execution not found" }, 404);
      if (["completed", "failed", "rejected"].includes(String(execution.status))) return json({ success: false, error: `Cannot cancel execution in status: ${execution.status}` }, 409);
      await callSupabase(env, token, `ai_executions?id=eq.${encodeURIComponent(executionId)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "rejected", completed_at: new Date().toISOString() }) });
      return json({ success: true, data: { executionId, status: "rejected" } });
    }

    return json({ success: false, error: "Method Not Allowed" }, 405, { Allow: "GET, POST, DELETE" });
  } catch (error) {
    console.error("/api/admin/ai-execution", error instanceof Error ? error.message : "AI execution management failed");
    return json({ success: false, error: error instanceof Error ? error.message : "AI execution management failed" }, 500);
  }
}
