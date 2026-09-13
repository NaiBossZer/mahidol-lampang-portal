/**
 * AI Execution Management API
 * Cloudflare Function for managing AI tool execution
 */

import { getSupabaseUser, isAdminRole, json, supabaseConfig } from "../auth/_shared";

type Env = Record<string, unknown>;

const cookie = (request: Request): string | null => {
  const cookies = (request.headers.get("Cookie") ?? "").split(";").map((v) => v.trim());
  const found = cookies.find((v) => v.startsWith("sb_access_token="));
  return found ? decodeURIComponent(found.slice(17)) : null;
};

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
    const role = user?.app_metadata?.role;
    const token = cookie(request);

    if (!user || !isAdminRole(role) || !token) {
      return json({ success: false, error: "Unauthorized" }, 401);
    }

    const { method } = request;
    const url = new URL(request.url);
    const executionId = url.pathname.split("/").pop();

    // GET: Get execution status
    if (method === "GET") {
      if (!executionId || executionId === "ai-execution") {
        // List executions
        const executions = await callSupabase(
          env,
          token,
          "ai_executions?select=*&order=created_at.desc&limit=50",
        );
        return json({ success: true, data: executions });
      }

      // Get specific execution
      const execution = await callSupabase(
        env,
        token,
        `ai_executions?id=eq.${executionId}&select=*`,
      );

      if (!execution || execution.length === 0) {
        return json({ success: false, error: "Execution not found" }, 404);
      }

      return json({ success: true, data: execution[0] });
    }

    // POST: Execute tool
    if (method === "POST") {
      const body = (await request.json()) as {
        executionId?: string;
        toolKey?: string;
        parameters?: Record<string, unknown>;
      };

      if (!body.executionId) {
        return json({ success: false, error: "executionId is required" }, 400);
      }

      // Get execution record
      const executions = await callSupabase(
        env,
        token,
        `ai_executions?id=eq.${body.executionId}&select=*`,
      );

      if (!executions || executions.length === 0) {
        return json({ success: false, error: "Execution not found" }, 404);
      }

      const execution = executions[0];

      // Check if execution can be executed
      if (execution.status !== "queued" && execution.status !== "approved") {
        return json(
          {
            success: false,
            error: `Execution cannot be executed in status: ${execution.status}`,
          },
          409,
        );
      }

      // Get tool details
      if (execution.tool_id) {
        const tools = await callSupabase(
          env,
          token,
          `ai_tools?id=eq.${execution.tool_id}&select=*`,
        );

        if (tools && tools.length > 0) {
          const tool = tools[0];

          // Update execution status to running
          await callSupabase(env, token, `ai_executions?id=eq.${body.executionId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              status: "running",
              started_at: new Date().toISOString(),
            }),
          });

          // Execute tool (simplified - in production would use execution engine)
          try {
            // Call the tool endpoint
            const toolUrl = new URL(tool.endpoint, request.url.origin);
            const toolResponse = await fetch(toolUrl.toString(), {
              method: tool.method,
              headers: {
                "Content-Type": "application/json",
                Cookie: request.headers.get("Cookie") || "",
              },
              body: tool.method !== "GET" ? JSON.stringify(execution.input) : undefined,
            });

            const toolResult = await toolResponse.json();

            // Update execution status to completed
            await callSupabase(env, token, `ai_executions?id=eq.${body.executionId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                status: "completed",
                output: toolResult,
                completed_at: new Date().toISOString(),
              }),
            });

            return json({
              success: true,
              data: {
                executionId: body.executionId,
                result: toolResult,
                status: "completed",
              },
            });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Execution failed";

            // Update execution status to failed
            await callSupabase(env, token, `ai_executions?id=eq.${body.executionId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                status: "failed",
                error: errorMessage,
                completed_at: new Date().toISOString(),
              }),
            });

            return json(
              {
                success: false,
                error: errorMessage,
              },
              500,
            );
          }
        }
      }

      return json({ success: false, error: "Tool not found" }, 404);
    }

    // PATCH: Update execution
    if (method === "PATCH") {
      if (!executionId) {
        return json({ success: false, error: "Execution ID is required" }, 400);
      }

      const body = (await request.json()) as {
        status?: string;
        steps?: any[];
        output?: any;
        error?: string;
      };

      // Update execution
      const updateData: Record<string, any> = {};
      if (body.status) updateData.status = body.status;
      if (body.steps) updateData.steps = body.steps;
      if (body.output) updateData.output = body.output;
      if (body.error) updateData.error = body.error;

      if (body.status === "completed" || body.status === "failed") {
        updateData.completed_at = new Date().toISOString();
      }

      await callSupabase(env, token, `ai_executions?id=eq.${executionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      return json({ success: true, data: { executionId, ...updateData } });
    }

    // DELETE: Cancel execution
    if (method === "DELETE") {
      if (!executionId) {
        return json({ success: false, error: "Execution ID is required" }, 400);
      }

      // Check if execution can be cancelled
      const executions = await callSupabase(
        env,
        token,
        `ai_executions?id=eq.${executionId}&select=status`,
      );

      if (!executions || executions.length === 0) {
        return json({ success: false, error: "Execution not found" }, 404);
      }

      const execution = executions[0];

      if (execution.status === "completed" || execution.status === "failed") {
        return json(
          {
            success: false,
            error: `Cannot cancel execution in status: ${execution.status}`,
          },
          409,
        );
      }

      // Update execution status to rejected
      await callSupabase(env, token, `ai_executions?id=eq.${executionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "rejected",
          completed_at: new Date().toISOString(),
        }),
      });

      return json({ success: true, data: { executionId, status: "rejected" } });
    }

    return json({ success: false, error: "Method Not Allowed" }, 405);
  } catch (error) {
    console.error("/api/admin/ai-execution", error);
    return json(
      {
        success: false,
        error: error instanceof Error ? error.message : "AI execution management failed",
      },
      500,
    );
  }
}
