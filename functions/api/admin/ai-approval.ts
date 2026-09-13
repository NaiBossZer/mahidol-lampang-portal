/**
 * AI Approval API
 * Cloudflare Function for managing AI approval workflow with execution trigger
 */

import { getSupabaseUser, isAdminRole, json, supabaseConfig } from "../auth/_shared";

type Env = Record<string, unknown>;

const cookie = (request: Request): string | null => {
  const cookies = (request.headers.get("Cookie") ?? "").split(";").map((v) => v.trim());
  const found = cookies.find((v) => v.startsWith("sb_access_token="));
  return found ? decodeURIComponent(found.slice(17)) : null;
};

// Permission mapping for role-based access control
const ROLE_PERMISSIONS: Record<string, Set<string>> = {
  SUPER_ADMIN: new Set(["*"]),
  CONTENT_ADMIN: new Set([
    "activities.update",
    "survey.create",
    "learning_centers.update",
    "cms.update",
  ]),
  OPERATIONS_ADMIN: new Set(["activities.update", "survey.create", "learning_centers.update"]),
  FACILITY_ADMIN: new Set(["facility.manage"]),
};

function hasPermission(role: string, permission: string): boolean {
  return ROLE_PERMISSIONS[role]?.has("*") || ROLE_PERMISSIONS[role]?.has(permission);
}

async function callSupabase(env: Env, token: string, path: string, init: RequestInit = {}) {
  const { url, key } = supabaseConfig(env);
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      ...(init.headers || {}),
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
    // Authentication check
    const user = await getSupabaseUser(request, env);
    const role = String(user?.app_metadata?.role ?? "");
    const token = cookie(request);

    if (!user || !isAdminRole(role) || !token) {
      return json({ success: false, error: "Unauthorized" }, 401);
    }

    // GET: Fetch pending approvals
    if (request.method === "GET") {
      const executions = await callSupabase(
        env,
        token,
        "ai_executions?status=eq.awaiting_approval&select=id,tool_id,intent,status,risk_level,input,execution_plan,steps,created_at&order=created_at.desc&limit=100",
      );

      // Fetch tool information for executions
      if (executions && Array.isArray(executions) && executions.length > 0) {
        const toolIds = executions
          .map((exec: any) => exec.tool_id)
          .filter((id: string | null) => id !== null)
          .join(",");

        if (toolIds) {
          const tools = await callSupabase(
            env,
            token,
            `ai_tools?id=in.(${toolIds})&select=id,tool_key,name,description,domain,risk_level,permission`,
          );

          const toolMap = new Map((tools || []).map((tool: any) => [tool.id, tool]));

          executions.forEach((execution: any) => {
            if (execution.tool_id && toolMap.has(execution.tool_id)) {
              execution.tool = toolMap.get(execution.tool_id);
            }
          });
        }
      }

      return json({ success: true, data: executions });
    }

    // POST: Process approval decision
    if (request.method === "POST") {
      const body = (await request.json()) as {
        executionId?: string;
        decision?: "approved" | "rejected";
        reason?: string;
      };

      if (!body.executionId || !body.decision) {
        return json(
          {
            success: false,
            error: "executionId and decision are required",
          },
          400,
        );
      }

      // Fetch execution record
      const execRows = await callSupabase(
        env,
        token,
        `ai_executions?id=eq.${encodeURIComponent(body.executionId)}&select=id,tool_id,intent,status,risk_level,input,execution_plan,steps&limit=1`,
      );

      const execution = execRows?.[0];

      if (!execution || execution.status !== "awaiting_approval") {
        return json(
          {
            success: false,
            error: "Execution is not awaiting approval",
          },
          409,
        );
      }

      // Fetch tool details
      const tools = await callSupabase(
        env,
        token,
        `ai_tools?id=eq.${execution.tool_id}&enabled=eq.true&limit=1`,
      );

      const tool = tools?.[0];

      if (!tool) {
        return json(
          {
            success: false,
            error: "Tool no longer available",
          },
          404,
        );
      }

      // Check reviewer permissions
      if (tool.permission && !hasPermission(role, String(tool.permission))) {
        return json(
          {
            success: false,
            error: "Forbidden: reviewer lacks tool permission",
          },
          403,
        );
      }

      // Create approval record
      await callSupabase(env, token, "ai_approvals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          execution_id: execution.id,
          reviewer_id: user.id,
          decision: body.decision,
          reason: body.reason || null,
          decided_at: new Date().toISOString(),
        }),
      });

      // Handle rejection
      if (body.decision === "rejected") {
        await callSupabase(env, token, `ai_executions?id=eq.${execution.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "rejected",
            completed_at: new Date().toISOString(),
          }),
        });

        return json({
          success: true,
          status: "rejected",
          message: "Execution rejected and marked as failed",
        });
      }

      // Handle approval - trigger execution
      // Update execution status to queued for execution
      await callSupabase(env, token, `ai_executions?id=eq.${execution.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "queued",
        }),
      });

      // Trigger execution by calling the execution API
      try {
        const executionUrl = new URL("/api/admin/ai-execution", request.url);
        const executionResponse = await fetch(executionUrl.toString(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: request.headers.get("Cookie") || "",
          },
          body: JSON.stringify({
            executionId: execution.id,
          }),
        });

        const executionResult = await executionResponse.json();

        if (executionResponse.ok) {
          return json({
            success: true,
            status: "approved",
            executionTriggered: true,
            executionResult: executionResult.data,
            message: "Execution approved and triggered",
          });
        } else {
          // Execution trigger failed, but approval is still recorded
          console.error("Execution trigger failed:", executionResult.error);
          return json({
            success: true,
            status: "approved",
            executionTriggered: false,
            error: "Execution approved but automatic trigger failed",
            message: "Execution approved. Please trigger manually.",
          });
        }
      } catch (error) {
        console.error("Execution trigger error:", error);
        return json({
          success: true,
          status: "approved",
          executionTriggered: false,
          error: "Execution approved but automatic trigger failed",
          message: "Execution approved. Please trigger manually.",
        });
      }
    }

    return json(
      {
        success: false,
        error: "Method Not Allowed",
      },
      405,
      { Allow: "GET, POST" },
    );
  } catch (error) {
    console.error("/api/admin/ai-approval", error);
    return json(
      {
        success: false,
        error: error instanceof Error ? error.message : "AI approval processing failed",
      },
      500,
    );
  }
}
