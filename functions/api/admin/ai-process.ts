/**
 * AI Intent Processing API
 * Server-side pipeline: natural language -> Gemini -> governed tool -> execution/approval.
 */

import { getCookie, getSupabaseUser, isAdminRole, json, permissionsForRole, supabaseConfig } from "../auth/_shared";

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

function parseNumber(value: unknown, fallback: number, min: number, max: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function safeJson(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function getMissingRequiredParameters(tool: Tool, parameters: Record<string, unknown>): string[] {
  const schema = safeJson(tool.input_schema);
  const required = Array.isArray(schema.required) ? schema.required.filter((v): v is string => typeof v === "string") : [];
  return required.filter((key) => parameters[key] === undefined || parameters[key] === null || parameters[key] === "");
}

function buildToolUrl(request: Request, endpoint: string, parameters: Record<string, unknown>): URL {
  const requestUrl = new URL(request.url);
  const url = new URL(endpoint, request.url);
  if (url.origin !== requestUrl.origin) throw new Error("AI tool endpoint must use the same origin as the Portal");

  for (const [key, value] of Object.entries(parameters)) {
    const marker = `:${key}`;
    if (url.pathname.includes(marker)) url.pathname = url.pathname.replace(marker, encodeURIComponent(String(value)));
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
      steps: [{ id: "step_1", title: tool.name, description: tool.description ?? `Execute ${tool.tool_key}`, tool: tool.tool_key, parameters, risk_level: tool.risk_level, requires_approval: false, status: "running", startedAt }],
    }),
  });

  try {
    const target = buildToolUrl(request, tool.endpoint, parameters);
    const method = tool.method;
    if (method === "GET") {
      for (const [key, value] of Object.entries(parameters)) {
        if (value !== undefined && value !== null && !tool.endpoint.includes(`:${key}`)) target.searchParams.set(key, String(value));
      }
    }

    const response = await fetch(target.toString(), {
      method,
      headers: { Accept: "application/json", "Content-Type": "application/json", Cookie: request.headers.get("Cookie") ?? "", "X-AI-Execution-Id": executionId },
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
        steps: [{
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
        }],
      }),
    });

    return success ? { status: "completed", result } : { status: "failed", error: `Portal API ${response.status}` };
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI tool execution failed";
    await callSupabase(env, token, `ai_executions?id=eq.${encodeURIComponent(executionId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "failed", error: message, completed_at: new Date().toISOString() }),
    });
    return { status: "failed", error: message };
  }
}

const sleep = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function isRetryableGeminiStatus(status: number): boolean {
  return status === 429 || status === 500 || status === 503;
}

async function parseIntentWithGemini(
  userIntent: string,
  tools: Tool[],
  apiKey: string,
  model: string,
  maxTokens: number,
): Promise<ParsedIntent> {
  const toolsList = tools.map((tool) => `${tool.tool_key} | ${tool.domain} | ${tool.name} | ${tool.description ?? ""}`).join("\n");
  const systemPrompt = `You are the intent router for Mahidol Lampang Portal.\nChoose exactly one tool from the supplied registry. Never invent a tool.\nReturn JSON only:\n{"domain":"...","action":"...","tool":"exact tool_key","parameters":{},"confidence":0.0,"reasoning":"brief"}\n\nAvailable governed tools:\n${toolsList}\n\nRules:\n- The tool must exactly match one available tool_key.\n- Extract only parameters needed by that tool.\n- Never invent IDs, dates, or values that the user did not provide.\n- If the request is ambiguous or no tool is appropriate, return tool="unknown" and confidence=0.\n- Do not decide permissions or risk; the server does that from the registry.`;

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: "user", parts: [{ text: userIntent }] }],
          generationConfig: {
            maxOutputTokens: maxTokens,
            responseMimeType: "application/json",
            responseJsonSchema: {
              type: "object",
              properties: {
                domain: { type: "string" },
                action: { type: "string" },
                tool: { type: "string" },
                parameters: { type: "object", additionalProperties: true },
                confidence: { type: "number", minimum: 0, maximum: 1 },
                reasoning: { type: "string" },
              },
              required: ["tool", "parameters", "confidence"],
              additionalProperties: false,
            },
          },
        }),
      });
      const payload = (await response.json().catch(() => null)) as Record<string, unknown> | null;

      if (response.ok) {
        const candidates = Array.isArray(payload?.candidates) ? payload.candidates : [];
        const firstCandidate = safeJson(candidates[0]);
        const content = safeJson(firstCandidate.content);
        const parts = Array.isArray(content.parts) ? content.parts : [];
        const textPart = parts.find((part) => typeof safeJson(part).text === "string");
        const text = textPart ? String(safeJson(textPart).text) : "";
        if (!text) throw new Error("Gemini returned no intent payload");
        return safeJson(JSON.parse(text)) as ParsedIntent;
      }

      const apiError = safeJson(payload?.error);
      const message = typeof apiError.message === "string" ? apiError.message : `Gemini API error ${response.status}`;

      if (!isRetryableGeminiStatus(response.status) || attempt === maxAttempts) {
        throw new Error(`Gemini API error ${response.status}: ${message}`);
      }

      const retryAfterHeader = Number(response.headers.get("Retry-After") ?? "");
      const retryAfterMs = Number.isFinite(retryAfterHeader) && retryAfterHeader > 0 ? Math.min(10_000, retryAfterHeader * 1000) : Math.min(5_000, 500 * 2 ** (attempt - 1));
      await sleep(retryAfterMs);
    } catch (error) {
      if (error instanceof Error && error.message.startsWith("Gemini API error")) throw error;
      if (attempt === maxAttempts) throw error;
      await sleep(Math.min(5_000, 500 * 2 ** (attempt - 1)));
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new Error("Gemini intent processing failed after retries");
}

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  try {
    if (request.method !== "POST") return json({ success: false, error: "Method Not Allowed" }, 405, { Allow: "POST" });
    const user = await getSupabaseUser(request, env);
    const role = user?.app_metadata?.role;
    const token = getCookie(request, "sb_access_token");
    if (!user || !isAdminRole(role) || !token) return json({ success: false, error: "Unauthorized" }, 401);

    const body = (await request.json()) as { intent?: string; context?: Record<string, unknown> };
    const intent = body.intent?.trim();
    if (!intent) return json({ success: false, error: "Intent is required" }, 400);

    const apiKey = String(env.GEMINI_API_KEY ?? "").trim();
    if (!apiKey) return json({ success: false, error: "Gemini API key not configured" }, 503);
    if (!supabaseConfig(env).configured) return json({ success: false, error: "Supabase environment is not configured" }, 503);

    const tools = (await callSupabase(env, token, "ai_tools?enabled=eq.true&select=id,tool_key,name,description,domain,endpoint,method,risk_level,permission,input_schema,enabled,execution_mode&order=domain.asc,tool_key.asc")) as Tool[];
    if (!Array.isArray(tools) || tools.length === 0) return json({ success: false, error: "No enabled AI tools available" }, 503);

    const parsed = await parseIntentWithGemini(
      intent,
      tools,
      apiKey,
      String(env.GEMINI_MODEL ?? "gemini-3.8-flash"),
      Math.round(parseNumber(env.GEMINI_MAX_OUTPUT_TOKENS ?? env.OPENAI_MAX_TOKENS, 500, 100, 2000)),
    );
    const parameters = safeJson(parsed.parameters);
    const matchedTool = tools.find((tool) => tool.tool_key === parsed.tool);
    const confidence = parseNumber(parsed.confidence, 0, 0, 1);

    if (!matchedTool || confidence < 0.5) return json({ success: false, error: "AI could not confidently map the request to a governed tool", data: { intent: parsed, matchedTool: null, confidence } }, 422);
    if (matchedTool.permission && !permissionsForRole(role).some((permission) => permission === matchedTool.permission)) return json({ success: false, error: "Forbidden: tool permission denied for current role" }, 403);

    const missingParameters = getMissingRequiredParameters(matchedTool, parameters);
    if (missingParameters.length) {
      return json(
        {
          success: false,
          error: `Missing required parameter(s): ${missingParameters.join(", ")}`,
          code: "AI_MISSING_PARAMETERS",
          data: {
            intent: parsed,
            matchedTool,
            missingParameters,
            message: "กรุณาระบุข้อมูลที่จำเป็นก่อนสั่งให้ AI ดำเนินการ",
          },
        },
        422,
      );
    }

    const requiresApproval = matchedTool.risk_level !== "low";
    const executionPlan = {
      steps: [{ id: "step_1", title: matchedTool.name, description: parsed.reasoning ?? matchedTool.description ?? `Execute ${matchedTool.tool_key}`, tool: matchedTool.tool_key, parameters, risk_level: matchedTool.risk_level, requires_approval: requiresApproval, status: requiresApproval ? "pending" : "running" }],
      estimated_duration: matchedTool.execution_mode === "async" ? "async" : "immediate",
      total_risk_level: matchedTool.risk_level,
    };

    const executionRows = await callSupabase(env, token, "ai_executions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify({ actor_id: user.id, tool_id: matchedTool.id, intent, status: requiresApproval ? "awaiting_approval" : "running", risk_level: matchedTool.risk_level, input: parameters, execution_plan: executionPlan, steps: executionPlan.steps, created_at: new Date().toISOString(), started_at: requiresApproval ? null : new Date().toISOString() }),
    });
    const execution = Array.isArray(executionRows) ? executionRows[0] : executionRows;

    if (requiresApproval) {
      await callSupabase(env, token, "admin_notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ recipient_user_id: user.id, kind: "ai_approval", title: "AI ต้องการการอนุมัติ", body: `${matchedTool.name} · risk ${matchedTool.risk_level}`, link: `/admin/ai/approval?executionId=${execution.id}` }),
      });
      return json({ success: true, geminiUsed: true, requiresApproval: true, data: { execution, intent: parsed, matchedTool, executionPlan, riskLevel: matchedTool.risk_level } }, 202);
    }

    const result = await executeTool(request, env, token, execution.id, matchedTool, parameters);
    return json({ success: result.status === "completed", geminiUsed: true, requiresApproval: false, data: { executionId: execution.id, intent: parsed, matchedTool, executionPlan, result: result.result }, error: result.error }, result.status === "completed" ? 200 : 502);
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI processing failed";
    console.error("/api/admin/ai-process", message);
    const geminiStatusMatch = message.match(/^Gemini API error (429|500|503):/);
    if (geminiStatusMatch) {
      const status = Number(geminiStatusMatch[1]);
      return json({ success: false, error: message, code: status === 503 ? "GEMINI_CAPACITY" : "GEMINI_RETRYABLE_ERROR", retryable: true }, status === 429 ? 429 : 503);
    }
    if (message.startsWith("Supabase REST 401")) return json({ success: false, error: "Supabase authorization failed" }, 401);
    if (message === "Supabase environment is not configured") return json({ success: false, error: message }, 503);
    return json({ success: false, error: message }, 500);
  }
}
