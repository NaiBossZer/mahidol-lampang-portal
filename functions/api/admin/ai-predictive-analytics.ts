/**
 * AI Predictive Analytics API
 * Provides predictive metrics and risk analysis for future activities based on AI analysis and historical data
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
 * Calculate confidence interval based on historical variance
 */
function calculateConfidenceInterval(
  predictedValue: number,
  historicalData: number[],
  confidenceLevel: number = 0.95
): { min: number; max: number } {
  if (historicalData.length < 2) {
    // Default ±20% confidence interval if insufficient data
    return {
      min: Math.max(0, predictedValue * 0.8),
      max: predictedValue * 1.2,
    };
  }

  const mean = historicalData.reduce((a, b) => a + b, 0) / historicalData.length;
  const variance = historicalData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (historicalData.length - 1);
  const stdDev = Math.sqrt(variance);

  // Simple confidence interval calculation
  const margin = (stdDev * 1.96) / Math.sqrt(historicalData.length); // 1.96 for 95% confidence

  return {
    min: Math.max(0, predictedValue - margin),
    max: predictedValue + margin,
  };
}

/**
 * Identify risk factors based on predicted metrics
 */
function identifyRiskFactors(
  predictedResponseRate: number,
  targetAudienceSize: number,
  historicalTrend: number[]
): Array<{ type: string; description: string; severity: string; mitigation: string }> {
  const risks = [];

  // Low response rate risk
  if (predictedResponseRate < 40) {
    risks.push({
      type: "low_response_rate",
      description: `Predicted response rate (${predictedResponseRate.toFixed(1)}%) is below optimal threshold`,
      severity: "high",
      mitigation: "Consider improving survey timing, adding reminder mechanisms, or simplifying questions",
    });
  } else if (predictedResponseRate < 60) {
    risks.push({
      type: "moderate_response_rate",
      description: `Predicted response rate (${predictedResponseRate.toFixed(1)}%) could be improved`,
      severity: "medium",
      mitigation: "Consider participant engagement strategies and survey optimization",
    });
  }

  // Small audience risk
  if (targetAudienceSize < 20) {
    risks.push({
      type: "small_sample_size",
      description: `Target audience size (${targetAudienceSize}) may limit statistical significance`,
      severity: "medium",
      mitigation: "Consider extending invitation to broader audience or combining multiple sessions",
    });
  }

  // Negative trend risk
  if (historicalTrend.length >= 3) {
    const recentAvg = historicalTrend.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const overallAvg = historicalTrend.reduce((a, b) => a + b, 0) / historicalTrend.length;
    if (recentAvg < overallAvg * 0.8) {
      risks.push({
        type: "declining_trend",
        description: "Recent response rates show declining trend compared to historical average",
        severity: "high",
        mitigation: "Investigate causes of decline and implement corrective measures",
      });
    }
  }

  return risks;
}

/**
 * Generate optimization suggestions based on AI analysis
 */
function generateOptimizationSuggestions(
  aiAnalysis: Record<string, unknown>,
  riskFactors: Array<{ type: string }>,
  historicalPerformance: Record<string, number>
): Array<{ category: string; suggestion: string; expectedImpact: number; implementationDifficulty: string; priority: number }> {
  const suggestions = [];

  // Analyze AI document analysis results
  const documentInsights = aiAnalysis.document_insights as Record<string, unknown> | undefined;
  const targetAudience = aiAnalysis.target_audience as Record<string, unknown> | undefined;

  // Survey optimization suggestions
  if (documentInsights?.complexity === "high") {
    suggestions.push({
      category: "survey_design",
      suggestion: "Simplify survey questions based on document complexity analysis to improve completion rates",
      expectedImpact: 15,
      implementationDifficulty: "low",
      priority: 1,
    });
  }

  // Target audience optimization
  if (targetAudience?.engagement_level === "low") {
    suggestions.push({
      category: "engagement",
      suggestion: "Implement personalized invitation messages and follow-up reminders for target audience",
      expectedImpact: 20,
      implementationDifficulty: "medium",
      priority: 1,
    });
  }

  // Risk-based suggestions
  if (riskFactors.some((r) => r.type === "low_response_rate")) {
    suggestions.push({
      category: "timing",
      suggestion: "Schedule survey distribution during optimal engagement periods based on historical data",
      expectedImpact: 25,
      implementationDifficulty: "low",
      priority: 1,
    });
  }

  // Historical performance suggestions
  if (historicalPerformance.averageScore < 3.5) {
    suggestions.push({
      category: "content",
      suggestion: "Review and optimize survey content based on lower-than-expected historical satisfaction scores",
      expectedImpact: 18,
      implementationDifficulty: "medium",
      priority: 2,
    });
  }

  // Default suggestion if no specific issues identified
  if (suggestions.length === 0) {
    suggestions.push({
      category: "monitoring",
      suggestion: "Continue current approach with regular monitoring and data collection for continuous improvement",
      expectedImpact: 5,
      implementationDifficulty: "low",
      priority: 3,
    });
  }

  return suggestions.sort((a, b) => a.priority - b.priority);
}

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  try {
    const user = await getSupabaseUser(request, env);
    const role = user?.app_metadata?.role;
    const token = cookie(request);
    if (!user || !isAdminRole(role) || !token) return json({ success: false, error: "Unauthorized" }, 401);
    if (!hasAdminPermission(role, "ai.command.read")) return json({ success: false, error: "Forbidden" }, 403);

    if (request.method === "POST") {
      const body = (await request.json()) as {
        activityId?: string;
        historicalData?: {
          participantCounts?: number[];
          responseRates?: number[];
          averageScores?: number[];
        };
        aiAnalysis?: Record<string, unknown>;
        targetAudienceSize?: number;
      };

      if (!body.activityId) {
        return json({ success: false, error: "activityId is required" }, 400);
      }

      // Get historical data for the activity
      const historicalParticipantCounts = body.historicalData?.participantCounts ?? [];
      const historicalResponseRates = body.historicalData?.responseRates ?? [];
      const historicalAverageScores = body.historicalData?.averageScores ?? [];

      // Get activity details
      const activities = await callSupabase(
        env,
        token,
        `activities?id=eq.${encodeURIComponent(body.activityId)}&select=title,participant_count,target_audience&limit=1`
      );
      const activity = activities?.[0];

      // Calculate predicted participant count
      const avgHistoricalParticipants = historicalParticipantCounts.length
        ? historicalParticipantCounts.reduce((a, b) => a + b, 0) / historicalParticipantCounts.length
        : activity?.participant_count ?? 50;

      const predictedParticipantCount = Math.round(avgHistoricalParticipants);

      // Calculate predicted response rate
      const avgHistoricalResponseRate = historicalResponseRates.length
        ? historicalResponseRates.reduce((a, b) => a + b, 0) / historicalResponseRates.length
        : 65; // Default 65% response rate

      const predictedResponseRate = Math.min(100, Math.max(0, avgHistoricalResponseRate));

      // Calculate confidence intervals
      const participantConfidence = calculateConfidenceInterval(predictedParticipantCount, historicalParticipantCounts);
      const responseRateConfidence = calculateConfidenceInterval(predictedResponseRate, historicalResponseRates);

      // Identify risk factors
      const targetAudienceSize = body.targetAudienceSize ?? activity?.participant_count ?? predictedParticipantCount;
      const riskFactors = identifyRiskFactors(predictedResponseRate, targetAudienceSize, historicalResponseRates);

      // Generate optimization suggestions
      const historicalPerformance = {
        averageScore: historicalAverageScores.length
          ? historicalAverageScores.reduce((a, b) => a + b, 0) / historicalAverageScores.length
          : 4.0,
      };

      const optimizationSuggestions = generateOptimizationSuggestions(
        body.aiAnalysis ?? {},
        riskFactors,
        historicalPerformance
      );

      return json({
        success: true,
        data: {
          activityId: body.activityId,
          activityTitle: activity?.title,
          predictedMetrics: {
            predictedParticipantCount,
            predictedResponseRate,
            confidenceInterval: {
              participantCount: participantConfidence,
              responseRate: responseRateConfidence,
            },
          },
          riskFactors,
          optimizationSuggestions,
          metadata: {
            analysisDate: new Date().toISOString(),
            dataPoints: historicalParticipantCounts.length,
            confidenceLevel: 0.95,
          },
        },
      });
    }

    return json({ success: false, error: "Method Not Allowed" }, 405, { Allow: "POST" });
  } catch (error) {
    console.error("/api/admin/ai-predictive-analytics", error instanceof Error ? error.message : "AI predictive analytics failed");
    return json({ success: false, error: error instanceof Error ? error.message : "AI predictive analytics failed" }, 500);
  }
}
