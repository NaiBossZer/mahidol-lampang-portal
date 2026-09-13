/**
 * AI Intent Processing API
 * Server-side pipeline: natural language -> OpenAI -> governed tool -> execution/approval.
 */

import { getSupabaseUser, isAdminRole, json, permissionsForRole, supabaseConfig } from "../auth/_shared";

type Env = Record<string, unknown>;
type RiskLevel = "low" | "medium" | "high" | "critical";
type Tool = {
  id: string;
  tool_key: string;
  name: string;
  description: string | null;
  domain: string;
  endpoint: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  risk_level: RiskLevel;
  permission: string | null;
  input_schema: Record<string, unknown> | null;
  enabled: boolean;
  execution_mode: "sync" | "async";
};

type ParsedIntent = {
  domain?: string;
  action?: string;
  tool?: string;
  parameters?: Record<string, unknown>;
  confidence?: number;
  reasoning?: string;
};

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
    headers: {
      apikey: key,
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      ...(init.headers || {}),
    },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`Supabase REST ${response.status}`);
  return body;
}

function parseNumber(value: unknown, fallback: number, min: number, max: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function safeJson(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function validateParameters(tool: Tool, parameters: Record<string, unknown>) {
  const schema = safeJson(tool.input_schema);
  const required = Array.isArray(schema.required) ? schema.required.filter((v): v is string => typeof v === "string") : [];
  const missing = required.filter((key) => parameters[key] === undefined || parameters[key] === null || parameters[key] === "");
  if (missing.length) throw new Error(`Missing required parameter(s): ${missing.join(", ")}`);
}

function buildToolUrl(request: Request, endpoint: string, parameters: Record<string, unknown>): URL {
  const url = new URL(endpoint, request.url);
  if (url.origin !== new URL(request.url).origin) throw new Error("AI tool endpoint must use the same origin as the Portal");

  for (const [key, value] of Object.entries(parameters)) {
    const marker = `:${key}`;
    if (url.pathname.includes(marker)) {
      url.pathname = url.pathname.replace(marker, encodeURIComponent(String(value)));
    }
  }

  return url;
}

async function executeTool(
  request: Request,
  env: Env,
  token: string,
  executionId: string,
  tool: Tool,
  parameters: Record<string, unknown>,
): Promise<{ status: "completed" | "failed"; result?: unknown; error?: string }> {
  const startedAt = new Date().toISOString();
  await callSupabase(env, token, `ai_executions?id=eq.${encodeURIComponent(executionId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status: "running",
      started_at: startedAt,
      steps: [
        {
          id: "step_1",
          title: tool.name,
          description: tool.description ?? `Execute ${tool.tool_key}`,
          tool: tool.tool_key,
          parameters,
          risk_level: tool.risk_level,
          requires_approval: false,
          status: "running",
          startedAt,
        },
      ],
    }),
  });

  try {
    const target = buildToolUrl(request, tool.endpoint, parameters);
    const method = tool.method;
    const headers: HeadersInit = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Cookie: request.headers.get("Cookie") ?? "",
      "X-AI-Execution-Id": executionId,
    };

    if (method === "GET") {
      for (const [key, value] of Object.entries(parameters)) {
        if (value !== undefined && value !== null && !tool.endpoint.includes(`:${key}`)) {
          target.searchParams.set(key, String(value));
        }
      }
    }

    const response = await fetch(target.toString(), {
      method,
      headers,
      body: method === "GET" || method === "DELETE" ? undefined : JSON.stringify(parameters),
    });

    const result = await response.json().catch(async () => await response.text().catch(() => null));
    const completedAt = new Date().toISOString();
    const success = response.ok;

    await callSupabase(env, token, `ai_executions?id=eq.${encodeURIComponent(executionId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: success ? "completed" : "failed",
        output: success ? result : null,
        error: success ? null : `Portal API ${response.status}`,
        completed_at: completedAt,
        steps: [
          {
            id: "step_1",
            title: tool.name,
            description: tool.description ?? `Execute ${tool.tool_key}`,
            tool: tool.tool_key,
            parameters,
            risk_level: tool.risk_level,
            requires_approval: false,
            status: success ? "completed" : "failed",
            ...(success ? { output: result } : { error: `Portal API ${response.status}` }),
            startedAt,
            completedAt,
          },
        ],
      }),
    });

    return success ? { status: "completed", result } : { status: "failed", error: `Portal API ${response.status}` };
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI tool execution failed";
    const completedAt = new Date().toISOString();
    await callSupabase(env, token, `ai_executions?id=eq.${encodeURIComponent(executionId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "failed", error: message, completed_at: completedAt }),
    });
    return { status: "failed", error: message };
  }
}

async function parseIntentWithOpenAI(
  userIntent: string,
  tools: Tool[],
  apiKey: string,
  model: string,
  maxTokens: number,
  temperature: number,
): Promise<ParsedIntent> {
  const toolsList = tools.map((tool) => `${tool.tool_key} | ${tool.domain} | ${tool.name} | ${tool.description ?? ""}`).join("\n");
  const systemPrompt = `You are the intent router for Mahidol Lampang Portal.\nChoose exactly one tool from the supplied registry. Never invent a tool.\nReturn JSON only:\n{"domain":"...","action":"...","tool":"exact tool_key","parameters":{},"confidence":0.0,"reasoning":"brief"}\n\nAvailable governed tools:\n${toolsList}\n\nRules:\n- The tool must exactly match one available tool_key.\n- Extract only parameters needed by that tool.\n- Never invent IDs, dates, or values that the user did not provide.\n- If the request is ambiguous or no tool is appropriate, return tool="unknown" and confidence=0.\n- Do not decide permissions or risk; the server does that from the registry.`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userIntent },
        ],
        temperature,
        max_tokens: maxTokens,
        response_format: { type: "json_object" },
      }),
    });
    if (!response.ok) throw new Error(`OpenAI API error ${response.status}`);
    const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("OpenAI returned no intent payload");
    return safeJson(JSON.parse(content)) as ParsedIntent;
  } finally {
    clearTimeout(timeout);
  }
}

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  try {
    if (request.method !== "POST") return json({ success: false, error: "Method Not Allowed" }, 405, { Allow: "POST" });

    const user = await getSupabaseUser(request, env);
    const role = user?.app_metadata?.role;
    const token = cookie(request);
    if (!user || !isAdminRole(role) || !token) return json({ success: false, error: "Unauthorized" }, 401);

    const body = (await request.json()) as { intent?: string; context?: Record<string, unknown> };
    const intent = body.intent?.trim();
    if (!intent) return json({ success: false, error: "Intent is required" }, 400);

    const apiKey = String(env.OPENAI_API_KEY ?? "").trim();
    if (!apiKey) return json({ success: false, error: "OpenAI API key not configured" }, 503);
    if (!supabaseConfig(env).configured) return json({ success: false, error: "Supabase environment is not configured" }, 503);

    const tools = (await callSupabase(
      env,
      token,
      "ai_tools?enabled=eq.true&select=id,tool_key,name,description,domain,endpoint,method,risk_level,permission,input_schema,enabled,execution_mode&order=domain.asc,tool_key.asc",
    )) as Tool[];
    if (!Array.isArray(tools) || tools.length === 0) return json({ success: false, error: "No enabled AI tools available" }, 503);

    const model = String(env.OPENAI_MODEL ?? "gpt-4o-mini");
    const maxTokens = Math.round(parseNumber(env.OPENAI_MAX_TOKENS, 500, 100, 2000));
    const temperature = parseNumber(env.OPENAI_TEMPERATURE, 0.3, 0, 1);
    const parsed = await parseIntentWithOpenAI(intent, tools, apiKey, model, maxTokens, temperature);
    const parameters = safeJson(parsed.parameters);
    const matchedTool = tools.find((tool) => tool.tool_key === parsed.tool);
    const confidence = parseNumber(parsed.confidence, 0, 0, 1);

    if (!matchedTool || confidence < 0.5) {
      return json({ success: false, error: "AI could not confidently map the request to a governed tool", data: { intent: parsed, matchedTool: null, confidence } }, 422);
    }

    if (matchedTool.permission && !permissionsForRole(role).includes(matchedTool.permission)) {
      return json({ success: false, error: "Forbidden: tool permission denied for current role" }, 403);
    }
    validateParameters(matchedTool, parameters);

    const requiresApproval = matchedTool.risk_level !== "low";
    const executionPlan = {
      steps: [{
        id: "step_1",
        title: matchedTool.name,
        description: parsed.reasoning ?? matchedTool.description ?? `Execute ${matchedTool.tool_key}`,
        tool: matchedTool.tool_key,
        parameters,
        risk_level: matchedTool.risk_level,
        requires_approval: requiresApproval,
        status: requiresApproval ? "pending" : "running",
      }],
      estimated_duration: matchedTool.execution_mode === "async" ? "async" : "immediate",
      total_risk_level: matchedTool.risk_level,
    };

    const executionRows = await callSupabase(env, token, "ai_executions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify({
        actor_id: user.id,
        tool_id: matchedTool.id,
        intent,
        status: requiresApproval ? "awaiting_approval" : "running",
        risk_level: matchedTool.risk_level,
        input: parameters,
        execution_plan: executionPlan,
        steps: executionPlan.steps,
        created_at: new Date().toISOString(),
        started_at: requiresApproval ? null : new Date().toISOString(),
      }),
    });
    const execution = Array.isArray(executionRows) ? executionRows[0] : executionRows;

    if (requiresApproval) {
      await callSupabase(env, token, "admin_notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({
          recipient_user_id: user.id,
          kind: "ai_approval",
          title: "AI ต้องการการอนุมัติ",
          body: `${matchedTool.name} · risk ${matchedTool.risk_level}`,
          link: `/admin/ai/approval?executionId=${execution.id}`,
        }),
      });
      return json({ success: true, openAIUsed: true, requiresApproval: true, data: { execution, intent: parsed, matchedTool, executionPlan, riskLevel: matchedTool.risk_level } }, 202);
    }

    const result = await executeTool(request, env, token, execution.id, matchedTool, parameters);
    return json(
      { success: result.status === "completed", openAIUsed: true, requiresApproval: false, data: { executionId: execution.id, intent: parsed, matchedTool, executionPlan, result: result.result }, error: result.error },
      result.status === "completed" ? 200 : 502,
    );
  } catch (error) {
    console.error("/api/admin/ai-process", error instanceof Error ? error.message : "AI processing failed");
    return json({ success: false, error: error instanceof Error ? error.message : "AI intent processing failed" }, 500);
  }
}
