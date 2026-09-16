/**
 * AI Recommendations API
 * Generates AI-powered recommendations for survey optimization, participant engagement, and timing
 */

import { getSupabaseUser, isAdminRole, json, supabaseConfig } from "../auth/_shared";

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
 * Generate survey optimization recommendations
 */
function generateSurveyOptimizationRecommendations(
  currentMetrics: Record<string, unknown>,
  goals: Record<string, unknown>
): Array<{ category: string; recommendation: string; expectedImpact: number; implementationDifficulty: string; priority: number }> {
  const recommendations = [];
  const currentResponseRate = (currentMetrics.responseRate as number) ?? 0;
  const currentScore = (currentMetrics.averageScore as number) ?? 0;
  const targetResponseRate = (goals.targetResponseRate as number) ?? 70;
  const targetScore = (goals.targetScore as number) ?? 4.0;

  // Response rate optimization
  if (currentResponseRate < targetResponseRate) {
    const gap = targetResponseRate - currentResponseRate;
    if (gap > 20) {
      recommendations.push({
        category: "survey_length",
        recommendation: "Reduce survey length to under 5 minutes to improve completion rates",
        expectedImpact: 25,
        implementationDifficulty: "low",
        priority: 1,
      });
    }
    recommendations.push({
      category: "question_clarity",
      recommendation: "Simplify question wording and avoid technical jargon to improve comprehension",
      expectedImpact: 15,
      implementationDifficulty: "low",
      priority: 2,
    });
  }

  // Score optimization
  if (currentScore < targetScore) {
    recommendations.push({
      category: "question_relevance",
      recommendation: "Align survey questions more closely with activity objectives and participant expectations",
      expectedImpact: 20,
      implementationDifficulty: "medium",
      priority: 1,
    });
    recommendations.push({
      category: "scale_design",
      recommendation: "Review and optimize rating scales for better discrimination between satisfaction levels",
      expectedImpact: 10,
      implementationDifficulty: "low",
      priority: 3,
    });
  }

  // General improvements
  recommendations.push({
    category: "mobile_optimization",
    recommendation: "Ensure survey is fully optimized for mobile devices to accommodate all participants",
    expectedImpact: 12,
    implementationDifficulty: "medium",
    priority: 2,
  });

  return recommendations.sort((a, b) => a.priority - b.priority);
}

/**
 * Generate participant engagement recommendations
 */
function generateParticipantEngagementRecommendations(
  currentMetrics: Record<string, unknown>,
  targetAudience: Record<string, unknown>
): Array<{ category: string; recommendation: string; expectedImpact: number; implementationDifficulty: string; priority: number }> {
  const recommendations = [];
  const engagementLevel = (targetAudience.engagement_level as string) ?? "medium";

  if (engagementLevel === "low") {
    recommendations.push({
      category: "personalization",
      recommendation: "Use personalized invitation messages addressing participants by name and referencing their specific involvement",
      expectedImpact: 30,
      implementationDifficulty: "medium",
      priority: 1,
    });
    recommendations.push({
      category: "incentives",
      recommendation: "Consider small incentives or recognition for survey completion to boost motivation",
      expectedImpact: 25,
      implementationDifficulty: "medium",
      priority: 2,
    });
  }

  recommendations.push({
    category: "reminders",
    recommendation: "Implement automated reminder system at 24h and 48h after initial invitation",
    expectedImpact: 20,
    implementationDifficulty: "low",
    priority: 1,
  });

  recommendations.push({
    category: "communication_channel",
    recommendation: "Use multiple communication channels (email, LINE, in-person announcement) to maximize reach",
    expectedImpact: 18,
    implementationDifficulty: "medium",
    priority: 2,
  });

  if (engagementLevel === "high") {
    recommendations.push({
      category: "feedback_loop",
      recommendation: "Share survey results with participants to demonstrate value of their input",
      expectedImpact: 15,
      implementationDifficulty: "low",
      priority: 3,
    });
  }

  return recommendations.sort((a, b) => a.priority - b.priority);
}

/**
 * Generate timing optimization recommendations
 */
function generateTimingOptimizationRecommendations(
  currentMetrics: Record<string, unknown>,
  historicalData: Record<string, unknown>
): Array<{ category: string; recommendation: string; expectedImpact: number; implementationDifficulty: string; priority: number }> {
  const recommendations = [];
  const historicalBestTimes = (historicalData.bestTimes as Array<{ time: string; responseRate: number }>) ?? [];
  const currentTiming = (currentMetrics.surveyTiming as string) ?? "immediate";

  // Analyze historical best times
  if (historicalBestTimes.length > 0) {
    const bestTime = historicalBestTimes.reduce((best, current) =>
      current.responseRate > best.responseRate ? current : best
    );
    recommendations.push({
      category: "optimal_timing",
      recommendation: `Schedule survey distribution during ${bestTime.time} for highest response rates based on historical data`,
      expectedImpact: 22,
      implementationDifficulty: "low",
      priority: 1,
    });
  }

  // Current timing analysis
  if (currentTiming === "immediate") {
    recommendations.push({
      category: "delay_strategy",
      recommendation: "Consider 24-48 hour delay after activity completion to allow reflection before survey distribution",
      expectedImpact: 15,
      implementationDifficulty: "low",
      priority: 2,
    });
  }

  // Duration recommendations
  recommendations.push({
    category: "survey_window",
    recommendation: "Keep survey response window open for 5-7 days to accommodate different schedules",
    expectedImpact: 18,
    implementationDifficulty: "low",
    priority: 2,
  });

  // A/B testing suggestion
  recommendations.push({
    category: "ab_testing",
    recommendation: "Implement A/B testing for different survey distribution times to identify optimal strategy",
    expectedImpact: 25,
    implementationDifficulty: "high",
    priority: 3,
  });

  return recommendations.sort((a, b) => a.priority - b.priority);
}

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  try {
    const user = await getSupabaseUser(request, env);
    const role = user?.app_metadata?.role;
    const token = cookie(request);
    if (!user || !isAdminRole(role) || !token) return json({ success: false, error: "Unauthorized" }, 401);

    if (request.method === "POST") {
      const body = (await request.json()) as {
        activityId?: string;
        currentMetrics?: {
          responseRate?: number;
          averageScore?: number;
          surveyTiming?: string;
        };
        goals?: {
          targetResponseRate?: number;
          targetScore?: number;
        };
        targetAudience?: {
          engagement_level?: string;
          demographics?: Record<string, unknown>;
        };
        historicalData?: {
          bestTimes?: Array<{ time: string; responseRate: number }>;
          seasonalPatterns?: Array<{ period: string; responseRate: number }>;
        };
      };

      if (!body.activityId) {
        return json({ success: false, error: "activityId is required" }, 400);
      }

      // Get activity details for context
      const activities = await callSupabase(
        env,
        token,
        `activities?id=eq.${encodeURIComponent(body.activityId)}&select=title,activity_date&limit=1`
      );
      const activity = activities?.[0];

      // Generate recommendations for each category
      const surveyOptimization = generateSurveyOptimizationRecommendations(
        body.currentMetrics ?? {},
        body.goals ?? {}
      );

      const participantEngagement = generateParticipantEngagementRecommendations(
        body.currentMetrics ?? {},
        body.targetAudience ?? {}
      );

      const timingOptimization = generateTimingOptimizationRecommendations(
        body.currentMetrics ?? {},
        body.historicalData ?? {}
      );

      // Calculate overall priority ranking
      const allRecommendations = [
        ...surveyOptimization.map((r) => ({ ...r, categoryGroup: "survey_optimization" })),
        ...participantEngagement.map((r) => ({ ...r, categoryGroup: "participant_engagement" })),
        ...timingOptimization.map((r) => ({ ...r, categoryGroup: "timing_optimization" })),
      ].sort((a, b) => a.priority - b.priority);

      return json({
        success: true,
        data: {
          activityId: body.activityId,
          activityTitle: activity?.title,
          activityDate: activity?.activity_date,
          recommendations: {
            surveyOptimization,
            participantEngagement,
            timingOptimization,
          },
          summary: {
            totalRecommendations: allRecommendations.length,
            highPriorityCount: allRecommendations.filter((r) => r.priority === 1).length,
            mediumPriorityCount: allRecommendations.filter((r) => r.priority === 2).length,
            lowPriorityCount: allRecommendations.filter((r) => r.priority === 3).length,
            topRecommendations: allRecommendations.slice(0, 3),
          },
          metadata: {
            generatedAt: new Date().toISOString(),
            analysisVersion: "1.0.0",
          },
        },
      });
    }

    return json({ success: false, error: "Method Not Allowed" }, 405, { Allow: "POST" });
  } catch (error) {
    console.error("/api/admin/ai-recommendations", error instanceof Error ? error.message : "AI recommendations failed");
    return json({ success: false, error: error instanceof Error ? error.message : "AI recommendations failed" }, 500);
  }
}
