/**
 * AI Configuration Management API
 * Cloudflare Function for managing Gemini AI configuration
 */

import { getSupabaseUser, isAdminRole, json } from "../auth/_shared";

type Env = Record<string, unknown>;

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  try {
    const user = await getSupabaseUser(request, env);
    const role = user?.app_metadata?.role;

    if (!user || !isAdminRole(role)) {
      return json({ success: false, error: "Unauthorized" }, 401);
    }

    if (role !== "SUPER_ADMIN") {
      return json({ success: false, error: "Forbidden: SUPER_ADMIN only" }, 403);
    }

    const { method } = request;

    if (method === "GET") {
      const config = {
        geminiConfigured: Boolean(String(env.GEMINI_API_KEY ?? "").trim()),
        geminiModel: env.GEMINI_MODEL || "gemini-3.8-flash",
        maxOutputTokens: env.GEMINI_MAX_OUTPUT_TOKENS || 500,
        temperature: env.GEMINI_TEMPERATURE || 0.3,
        rateLimitEnabled: Boolean(env.AI_RATE_LIMIT_ENABLED),
        rateLimitRpm: env.AI_RATE_LIMIT_RPM || 10,
        costMonitoringEnabled: Boolean(env.AI_COST_MONITORING_ENABLED),
        budgetLimit: env.AI_BUDGET_LIMIT || 100,
      };

      return json({ success: true, data: config });
    }

    if (method === "PUT") {
      const body = (await request.json()) as {
        geminiModel?: string;
        maxOutputTokens?: number;
        temperature?: number;
        rateLimitEnabled?: boolean;
        rateLimitRpm?: number;
        costMonitoringEnabled?: boolean;
        budgetLimit?: number;
      };

      if (body.geminiModel !== undefined && !body.geminiModel.trim()) {
        return json({ success: false, error: "geminiModel cannot be empty" }, 400);
      }

      if (body.maxOutputTokens !== undefined && (body.maxOutputTokens < 1 || body.maxOutputTokens > 4000)) {
        return json({ success: false, error: "maxOutputTokens must be between 1 and 4000" }, 400);
      }

      if (body.temperature !== undefined && (body.temperature < 0 || body.temperature > 2)) {
        return json({ success: false, error: "temperature must be between 0 and 2" }, 400);
      }

      if (body.rateLimitRpm !== undefined && (body.rateLimitRpm < 1 || body.rateLimitRpm > 1000)) {
        return json({ success: false, error: "rateLimitRpm must be between 1 and 1000" }, 400);
      }

      if (body.budgetLimit !== undefined && body.budgetLimit < 0) {
        return json({ success: false, error: "budgetLimit must be 0 or greater" }, 400);
      }

      return json({
        success: true,
        message: "Configuration validated. Update environment variables to apply changes.",
        data: body,
      });
    }

    return json({ success: false, error: "Method Not Allowed" }, 405, { Allow: "GET, PUT" });
  } catch (error) {
    console.error("/api/admin/ai-config", error);
    return json({ success: false, error: error instanceof Error ? error.message : "AI configuration management failed" }, 500);
  }
}
