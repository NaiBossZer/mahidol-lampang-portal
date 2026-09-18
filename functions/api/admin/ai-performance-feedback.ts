/**
 * AI Performance Feedback API
 * Handles feedback submission for AI-generated surveys and stores actual vs predicted performance comparison
 */

import { getSupabaseUser, hasAdminPermission, isAdminRole, json, supabaseConfig } from "../auth/_shared";

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

/**
 * Generate AI improvement suggestions based on performance gap
 */
function generateImprovementSuggestions(
  performanceGap: number,
  actualResponseRate: number,
  actualScore: number
): Array<{ category: string; suggestion: string; impact: string; priority: number }> {
  const suggestions = [];

  // Performance gap analysis
  if (performanceGap > 0.5) {
    suggestions.push({
      category: "prediction_accuracy",
      suggestion: "AI model is underestimating performance. Review historical data patterns and adjust prediction algorithms.",
      impact: "high",
      priority: 1,
    });
  } else if (performanceGap < -0.5) {
    suggestions.push({
      category: "prediction_accuracy",
      suggestion: "AI model is overestimating performance. Investigate factors causing lower-than-expected results.",
      impact: "high",
      priority: 1,
    });
  }

  // Response rate analysis
  if (actualResponseRate < 50) {
    suggestions.push({
      category: "engagement",
      suggestion: "Low response rate detected. Consider survey timing, reminder mechanisms, and participant motivation strategies.",
      impact: "medium",
      priority: 2,
    });
  }

  // Score analysis
  if (actualScore < 3.5) {
    suggestions.push({
      category: "satisfaction",
      suggestion: "Below-average satisfaction scores. Review question clarity, survey length, and content relevance.",
      impact: "high",
      priority: 1,
    });
  }

  // General improvements
  if (suggestions.length === 0) {
    suggestions.push({
      category: "maintenance",
      suggestion: "Performance is within acceptable range. Continue monitoring and collect more data for model refinement.",
      impact: "low",
      priority: 3,
    });
  }

  return suggestions;
}

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  try {
    const user = await getSupabaseUser(request, env);
    const role = user?.app_metadata?.role;
    const token = cookie(request);
    if (!user || !isAdminRole(role) || !token) return json({ success: false, error: "Unauthorized" }, 401);
    if (!hasAdminPermission(role, "ai.command.read")) return json({ success: false, error: "Forbidden" }, 403);

    if (request.method === "GET") {
      const url = new URL(request.url);
      const surveyId = url.searchParams.get("surveyId");
      const executionId = url.searchParams.get("executionId");
      const activityId = url.searchParams.get("activityId");

      let path = "ai_performance_feedback?select=*&order=created_at.desc&limit=100";
      if (surveyId) path = `ai_performance_feedback?survey_id=eq.${encodeURIComponent(surveyId)}&select=*&order=created_at.desc`;
      if (executionId) path = `ai_performance_feedback?execution_id=eq.${encodeURIComponent(executionId)}&select=*&order=created_at.desc`;
      if (activityId) path = `ai_performance_feedback?activity_id=eq.${encodeURIComponent(activityId)}&select=*&order=created_at.desc`;

      const data = await callSupabase(env, token, path);
      return json({ success: true, data });
    }

    if (request.method === "POST") {
      const body = (await request.json()) as {
        surveyId?: string;
        executionId?: string;
        activityId?: string;
        predictedScore?: number;
        actualScore?: number;
        predictedResponseRate?: number;
        actualResponseRate?: number;
        feedbackNotes?: string;
        aiModelVersion?: string;
      };

      if (!body.surveyId && !body.executionId) {
        return json({ success: false, error: "surveyId or executionId is required" }, 400);
      }

      if (body.actualScore === undefined || body.actualResponseRate === undefined) {
        return json({ success: false, error: "actualScore and actualResponseRate are required" }, 400);
      }

      // Calculate performance gap
      const predictedScore = body.predictedScore ?? 4.0; // Default prediction
      const performanceGap = Math.abs(predictedScore - body.actualScore);

      // Generate AI improvement suggestions
      const improvementSuggestions = generateImprovementSuggestions(
        performanceGap,
        body.actualResponseRate,
        body.actualScore
      );

      // Get activity ID if not provided
      let activityId = body.activityId;
      if (!activityId && body.surveyId) {
        const surveys = await callSupabase(
          env,
          token,
          `occurrence_surveys?id=eq.${encodeURIComponent(body.surveyId)}&select=occurrence_id&limit=1`
        );
        if (surveys?.[0]?.occurrence_id) {
          const occurrences = await callSupabase(
            env,
            token,
            `activity_occurrences?id=eq.${encodeURIComponent(surveys[0].occurrence_id)}&select=activity_id&limit=1`
          );
          activityId = occurrences?.[0]?.activity_id;
        }
      }

      // Store feedback
      const feedback = await callSupabase(env, token, "ai_performance_feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json", Prefer: "return=representation" },
        body: JSON.stringify({
          survey_id: body.surveyId ?? null,
          execution_id: body.executionId ?? null,
          activity_id: activityId ?? null,
          predicted_score: body.predictedScore ?? null,
          actual_score: body.actualScore,
          predicted_response_rate: body.predictedResponseRate ?? null,
          actual_response_rate: body.actualResponseRate,
          performance_gap: performanceGap,
          feedback_notes: body.feedbackNotes ?? null,
          improvement_suggestions: improvementSuggestions,
          ai_model_version: body.aiModelVersion ?? "1.0.0",
          feedback_source: "manual",
        }),
      });

      // Update ai_executions with performance metrics if execution_id provided
      if (body.executionId) {
        await callSupabase(env, token, `ai_executions?id=eq.${encodeURIComponent(body.executionId)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            output: {
              performance_feedback: {
                actual_score: body.actualScore,
                actual_response_rate: body.actualResponseRate,
                performance_gap: performanceGap,
                feedback_id: feedback?.[0]?.id,
              },
            },
          }),
        }).catch(() => undefined);
      }

      return json({
        success: true,
        data: {
          feedbackId: feedback?.[0]?.id,
          performanceGap,
          improvementSuggestions,
        },
      });
    }

    if (request.method === "PATCH") {
      const url = new URL(request.url);
      const feedbackId = url.searchParams.get("id");
      if (!feedbackId) return json({ success: false, error: "Feedback ID is required" }, 400);

      const body = (await request.json()) as {
        feedbackNotes?: string;
        improvementSuggestions?: Array<{ category: string; suggestion: string; impact: string; priority: number }>;
      };

      await callSupabase(env, token, `ai_performance_feedback?id=eq.${encodeURIComponent(feedbackId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(body.feedbackNotes !== undefined && { feedback_notes: body.feedbackNotes }),
          ...(body.improvementSuggestions !== undefined && { improvement_suggestions: body.improvementSuggestions }),
        }),
      });

      return json({ success: true, data: { feedbackId } });
    }

    return json({ success: false, error: "Method Not Allowed" }, 405, { Allow: "GET, POST, PATCH" });
  } catch (error) {
    console.error("/api/admin/ai-performance-feedback", error instanceof Error ? error.message : "AI performance feedback failed");
    return json({ success: false, error: error instanceof Error ? error.message : "AI performance feedback failed" }, 500);
  }
}
