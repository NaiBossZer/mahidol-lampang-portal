/**
 * AI Configuration Management API
 * Cloudflare Function for managing AI configuration
 */

import { getSupabaseUser, isAdminRole, json } from "../auth/_shared";

type Env = Record<string, unknown>;

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  try {
    // Authentication check
    const user = await getSupabaseUser(request, env);
    const role = user?.app_metadata?.role;

    if (!user || !isAdminRole(role)) {
      return json({ success: false, error: "Unauthorized" }, 401);
    }

    // Only SUPER_ADMIN can manage AI configuration
    if (role !== "SUPER_ADMIN") {
      return json({ success: false, error: "Forbidden: SUPER_ADMIN only" }, 403);
    }

    const { method } = request;

    // GET: Get AI configuration status
    if (method === "GET") {
      const config = {
        openaiConfigured: !!(env.OPENAI_API_KEY as string),
        openaiModel: env.OPENAI_MODEL || "gpt-4o-mini",
        maxTokens: env.OPENAI_MAX_TOKENS || 500,
        temperature: env.OPENAI_TEMPERATURE || 0.3,
        rateLimitEnabled: !!(env.AI_RATE_LIMIT_ENABLED as string),
        rateLimitRpm: env.AI_RATE_LIMIT_RPM || 10,
        costMonitoringEnabled: !!(env.AI_COST_MONITORING_ENABLED as string),
        budgetLimit: env.AI_BUDGET_LIMIT || 100,
      };

      // Don't expose the actual API key
      return json({
        success: true,
        data: config,
      });
    }

    // PUT: Update AI configuration (limited operations)
    if (method === "PUT") {
      const body = (await request.json()) as {
        openaiModel?: string;
        maxTokens?: number;
        temperature?: number;
        rateLimitEnabled?: boolean;
        rateLimitRpm?: number;
        costMonitoringEnabled?: boolean;
        budgetLimit?: number;
      };

      // In a real implementation, this would update environment variables or configuration store
      // For Cloudflare Workers, this would typically be done through wrangler.toml or dashboard
      // This endpoint is mainly for validation and status checking

      // Validate configuration
      if (
        body.openaiModel &&
        !["gpt-4o-mini", "gpt-4o", "gpt-3.5-turbo"].includes(body.openaiModel)
      ) {
        return json(
          {
            success: false,
            error: "Invalid OpenAI model",
          },
          400,
        );
      }

      if (body.maxTokens && (body.maxTokens < 1 || body.maxTokens > 4000)) {
        return json(
          {
            success: false,
            error: "maxTokens must be between 1 and 4000",
          },
          400,
        );
      }

      if (body.temperature && (body.temperature < 0 || body.temperature > 2)) {
        return json(
          {
            success: false,
            error: "temperature must be between 0 and 2",
          },
          400,
        );
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
    return json(
      {
        success: false,
        error: error instanceof Error ? error.message : "AI configuration management failed",
      },
      500,
    );
  }
}
