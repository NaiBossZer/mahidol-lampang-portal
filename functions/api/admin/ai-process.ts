/**
 * AI Intent Processing API
 * Cloudflare Function for processing natural language intents
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
    const body = (await request.json()) as { intent?: string; context?: Record<string, unknown> };

    if (!body.intent?.trim()) {
      return json({ success: false, error: "Intent is required" }, 400);
    }

    // Get OpenAI API key from environment
    const openaiApiKey = env.OPENAI_API_KEY as string;
    if (!openaiApiKey) {
      return json({ success: false, error: "OpenAI API key not configured" }, 500);
    }

    // Fetch available tools from database
    const tools = await callSupabase(env, token, "ai_tools?enabled=eq.true&select=*");

    if (!tools || tools.length === 0) {
      return json({ success: false, error: "No tools available" }, 500);
    }

    // Import and use intent parser (this would need to be bundled with the function)
    // For now, we'll implement a simplified version directly in the function
    const parseResult = await parseIntentWithOpenAI(body.intent, tools, openaiApiKey);

    // Create execution record
    const executionData = {
      actor_id: user.id,
      tool_id: parseResult.matchedTool?.id || null,
      intent: body.intent.trim(),
      status: parseResult.requiresApproval ? "awaiting_approval" : "queued",
      risk_level: parseResult.riskLevel,
      input: body.context || {},
      execution_plan: parseResult.executionPlan,
      steps: parseResult.executionPlan.steps,
      created_at: new Date().toISOString(),
    };

    const execution = await callSupabase(env, token, "ai_executions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify(executionData),
    });

    const executionRecord = Array.isArray(execution) ? execution[0] : execution;

    // If approval is required, create notification
    if (parseResult.requiresApproval) {
      await callSupabase(env, token, "admin_notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({
          recipient_user_id: user.id,
          kind: "ai_approval",
          title: "AI ต้องการการอนุมัติ",
          body: `${parseResult.intent.tool} · risk ${parseResult.riskLevel}`,
          link: `/admin/ai/approval?executionId=${executionRecord.id}`,
        }),
      });
    }

    return json(
      {
        success: true,
        data: {
          execution: executionRecord,
          intent: parseResult.intent,
          executionPlan: parseResult.executionPlan,
          matchedTool: parseResult.matchedTool,
          requiresApproval: parseResult.requiresApproval,
          riskLevel: parseResult.riskLevel,
        },
      },
      202,
    );
  } catch (error) {
    console.error("/api/admin/ai-process", error);
    return json(
      {
        success: false,
        error: error instanceof Error ? error.message : "AI intent processing failed",
      },
      500,
    );
  }
}

/**
 * Simplified intent parsing with OpenAI
 * In production, this would use the full intent parser service
 */
async function parseIntentWithOpenAI(userIntent: string, tools: any[], apiKey: string) {
  const toolsList = tools
    .map((tool: any) => `- ${tool.tool_key}: ${tool.name} (${tool.domain}) - ${tool.description}`)
    .join("\n");

  const systemPrompt = `You are an AI intent parser for Mahidol Lampang Portal. Parse natural language commands into structured intents.

Available tools:
${toolsList}

Return response as JSON with this exact structure:
{
  "domain": "activities|survey|analytics|learning_centers|cms|organizations",
  "action": "list|get|create|update|publish|archive|analytics|export",
  "tool": "exact tool_key from available tools",
  "parameters": { /* extracted parameters */ },
  "confidence": 0.0-1.0,
  "reasoning": "brief explanation of why this tool was chosen"
}

Rules:
- Only return tools that exist in the available tools list
- Extract parameters from the user's request
- Set confidence based on how clear the intent is
- If no tool matches, return tool as "unknown" and confidence as 0.0`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Parse this user command: "${userIntent}"` },
        ],
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);

    // Find matched tool
    const matchedTool = tools.find((t: any) => t.tool_key === parsed.tool) || null;

    // Determine risk level
    const riskLevel = matchedTool?.risk_level || "medium";

    // Determine if approval is required
    const requiresApproval =
      riskLevel === "high" ||
      riskLevel === "critical" ||
      ["publish", "archive", "delete", "export"].includes(parsed.action);

    // Generate simple execution plan
    const executionPlan = {
      steps: [
        {
          id: "step_1",
          title: `Execute ${parsed.tool}`,
          description: parsed.reasoning || `Execute ${parsed.action} operation`,
          tool: parsed.tool,
          parameters: parsed.parameters || {},
          risk_level: riskLevel,
          requires_approval: requiresApproval,
        },
      ],
      estimated_duration: "unknown",
      total_risk_level: riskLevel,
    };

    return {
      intent: parsed,
      executionPlan,
      matchedTool,
      requiresApproval,
      riskLevel,
    };
  } catch (error) {
    console.error("OpenAI parsing failed:", error);

    // Fallback response
    return {
      intent: {
        domain: "unknown",
        action: "unknown",
        tool: "unknown",
        parameters: {},
        confidence: 0.0,
        reasoning: "Failed to parse intent",
      },
      executionPlan: {
        steps: [],
        estimated_duration: "unknown",
        total_risk_level: "medium",
      },
      matchedTool: null,
      requiresApproval: false,
      riskLevel: "medium",
    };
  }
}
