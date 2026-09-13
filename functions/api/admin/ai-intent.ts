/**
 * AI Intent Intake API
 * Cloudflare Function for processing AI intents with OpenAI integration
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

    // Only allow POST requests
    if (request.method !== "POST") {
      return json({ success: false, error: "Method Not Allowed" }, 405, { Allow: "POST" });
    }

    // Parse request body
    const body = (await request.json()) as {
      intent?: string;
      context?: Record<string, unknown>;
      useOpenAI?: boolean;
    };

    if (!body.intent?.trim()) {
      return json({ success: false, error: "Intent is required" }, 400);
    }

    // Check if OpenAI processing is requested and available
    const useOpenAI = body.useOpenAI !== false && !!(env.OPENAI_API_KEY as string);

    if (useOpenAI) {
      // Delegate to ai-process endpoint for OpenAI processing
      try {
        const processUrl = new URL("/api/admin/ai-process", request.url);
        const processResponse = await fetch(processUrl.toString(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: request.headers.get("Cookie") || "",
          },
          body: JSON.stringify({
            intent: body.intent,
            context: body.context,
          }),
        });

        const processData = await processResponse.json();

        if (processResponse.ok) {
          return json(processData, processResponse.status);
        } else {
          // Fall back to simple intent intake if OpenAI processing fails
          console.warn(
            "OpenAI processing failed, falling back to simple intake:",
            processData.error,
          );
        }
      } catch (error) {
        console.warn("OpenAI processing error, falling back to simple intake:", error);
      }
    }

    // Simple intent intake (fallback or when OpenAI is not available)
    const { url, key } = supabaseConfig(env);
    const response = await fetch(`${url}/rest/v1/ai_executions`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        actor_id: user.id,
        intent: body.intent.trim(),
        status: "queued",
        risk_level: "medium",
        input: body.context ?? {},
        execution_plan: {
          steps: [
            {
              id: "step_1",
              title: "Process Intent",
              description: "Intent will be processed manually",
              tool: "unknown",
              parameters: body.context ?? {},
              risk_level: "medium",
              requires_approval: false,
            },
          ],
          estimated_duration: "unknown",
          total_risk_level: "medium",
        },
        steps: [
          {
            id: "step_1",
            title: "Process Intent",
            description: "Intent will be processed manually",
            tool: "unknown",
            parameters: body.context ?? {},
            risk_level: "medium",
            requires_approval: false,
          },
        ],
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(`Supabase REST ${response.status}`);
    }

    return json(
      {
        success: true,
        data: Array.isArray(data) ? data[0] : data,
        openAIUsed: false,
        message: "Intent queued for processing (OpenAI not available or disabled)",
      },
      202,
    );
  } catch (error) {
    console.error("/api/admin/ai-intent", error);
    return json(
      {
        success: false,
        error: error instanceof Error ? error.message : "AI intent intake failed",
      },
      500,
    );
  }
}
