import { getAdminDashboardData, type AdminDashboardData, type DashboardResponse } from "@/services/api";

/**
 * AI-Dashboard Integration Service
 * Bridges AI Studio Workspace with Executive Dashboard analytics
 */

export type AIInsightSummary = {
  totalSurveys: number;
  aiGeneratedSurveys: number;
  manualSurveys: number;
  aiPercentage: number;
  averageAIConfidence: number;
  aiVsManualPerformance: {
    aiAvgScore: number;
    manualAvgScore: number;
    aiResponseRate: number;
    manualResponseRate: number;
  };
};

export type AISurveyPerformance = {
  surveyId: string;
  activityId: string;
  activityTitle: string;
  aiGenerated: boolean;
  aiConfidenceScore?: number;
  responseCount: number;
  averageScore: number;
  responseRate: number;
  performanceVsManual: number; // positive = better than manual
};

/**
 * Calculate AI insights from dashboard data
 */
export async function getAIInsights(): Promise<AIInsightSummary> {
  try {
    const data = await getAdminDashboardData();
    const responses = data.responses as (DashboardResponse & {
      ai_generated?: boolean | null;
      ai_confidence_score?: number | null;
    })[];

    const aiResponses = responses.filter((r) => r.ai_generated === true);
    const manualResponses = responses.filter((r) => r.ai_generated === false || r.ai_generated === null);

    const totalSurveys = data.surveys.length;
    const aiGeneratedSurveys = data.surveys.filter((s) => 
      responses.some((r) => r.survey_id === s.id && r.ai_generated === true)
    ).length;
    const manualSurveys = totalSurveys - aiGeneratedSurveys;

    const aiConfidenceScores = aiResponses
      .map((r) => r.ai_confidence_score)
      .filter((score): score is number => score !== null && score !== undefined && typeof score === 'number');
    const averageAIConfidence = aiConfidenceScores.length
      ? aiConfidenceScores.reduce((a, b) => a + b, 0) / aiConfidenceScores.length
      : 0;

    // Calculate performance comparison
    const aiScores = aiResponses.flatMap((r) => [
      r.p2_location, r.p2_schedule, r.p2_readiness, r.p2_reception, r.p2_overall,
      r.p3_interest, r.p3_content, r.p3_clarity, r.p3_benefit, r.p3_application,
      r.p4_knowledge, r.p4_inspiration, r.p4_community_resource, r.p4_future_return,
    ].filter((score): score is number => score !== null && score !== undefined));

    const manualScores = manualResponses.flatMap((r) => [
      r.p2_location, r.p2_schedule, r.p2_readiness, r.p2_reception, r.p2_overall,
      r.p3_interest, r.p3_content, r.p3_clarity, r.p3_benefit, r.p3_application,
      r.p4_knowledge, r.p4_inspiration, r.p4_community_resource, r.p4_future_return,
    ].filter((score): score is number => score !== null && score !== undefined));

    const aiAvgScore = aiScores.length ? aiScores.reduce((a, b) => a + b, 0) / aiScores.length : 0;
    const manualAvgScore = manualScores.length ? manualScores.reduce((a, b) => a + b, 0) / manualScores.length : 0;

    // Calculate response rates
    const aiOccurrences = [...new Set(aiResponses.map((r) => r.occurrence_id))];
    const manualOccurrences = [...new Set(manualResponses.map((r) => r.occurrence_id))];

    const aiParticipants = aiOccurrences.reduce((sum, occId) => {
      const occ = data.occurrences.find((o) => o.id === occId);
      return sum + (occ?.participant_count || 0);
    }, 0);

    const manualParticipants = manualOccurrences.reduce((sum, occId) => {
      const occ = data.occurrences.find((o) => o.id === occId);
      return sum + (occ?.participant_count || 0);
    }, 0);

    const aiResponseRate = aiParticipants ? (aiResponses.length / aiParticipants) * 100 : 0;
    const manualResponseRate = manualParticipants ? (manualResponses.length / manualParticipants) * 100 : 0;

    return {
      totalSurveys,
      aiGeneratedSurveys,
      manualSurveys,
      aiPercentage: totalSurveys ? (aiGeneratedSurveys / totalSurveys) * 100 : 0,
      averageAIConfidence,
      aiVsManualPerformance: {
        aiAvgScore,
        manualAvgScore,
        aiResponseRate,
        manualResponseRate,
      },
    };
  } catch (error) {
    console.error("Failed to calculate AI insights:", error);
    return {
      totalSurveys: 0,
      aiGeneratedSurveys: 0,
      manualSurveys: 0,
      aiPercentage: 0,
      averageAIConfidence: 0,
      aiVsManualPerformance: {
        aiAvgScore: 0,
        manualAvgScore: 0,
        aiResponseRate: 0,
        manualResponseRate: 0,
      },
    };
  }
}

/**
 * Get detailed AI survey performance comparison
 */
export async function getAISurveyPerformance(): Promise<AISurveyPerformance[]> {
  try {
    const data = await getAdminDashboardData();
    const responses = data.responses as (DashboardResponse & {
      ai_generated?: boolean | null;
      ai_confidence_score?: number | null;
    })[];

    const surveyPerformance = new Map<string, AISurveyPerformance>();

    // Group responses by survey
    for (const response of responses) {
      if (!response.survey_id) continue;

      const existing = surveyPerformance.get(response.survey_id);
      const activity = data.activities.find((a) => a.id === response.activity_id);

      if (!existing && activity) {
        surveyPerformance.set(response.survey_id, {
          surveyId: response.survey_id,
          activityId: response.activity_id,
          activityTitle: activity.title,
          aiGenerated: response.ai_generated === true,
          aiConfidenceScore: response.ai_confidence_score ?? undefined,
          responseCount: 0,
          averageScore: 0,
          responseRate: 0,
          performanceVsManual: 0,
        });
      }

      const survey = surveyPerformance.get(response.survey_id);
      if (survey) {
        survey.responseCount++;
        survey.aiGenerated = response.ai_generated === true;
        survey.aiConfidenceScore = response.ai_confidence_score ?? undefined;
      }
    }

    // Calculate average scores and response rates
    const performance: AISurveyPerformance[] = [];
    for (const [surveyId, survey] of surveyPerformance) {
      const surveyResponses = responses.filter((r) => r.survey_id === surveyId);
      const scores = surveyResponses.flatMap((r) => [
        r.p2_location, r.p2_schedule, r.p2_readiness, r.p2_reception, r.p2_overall,
        r.p3_interest, r.p3_content, r.p3_clarity, r.p3_benefit, r.p3_application,
        r.p4_knowledge, r.p4_inspiration, r.p4_community_resource, r.p4_future_return,
      ].filter((score): score is number => score !== null && score !== undefined));

      survey.averageScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

      const occurrenceId = surveyResponses[0]?.occurrence_id;
      const occurrence = occurrenceId ? data.occurrences.find((o) => o.id === occurrenceId) : null;
      survey.responseRate = occurrence?.participant_count
        ? (survey.responseCount / occurrence.participant_count) * 100
        : 0;

      // Calculate performance vs manual baseline
      const manualSurveys = [...surveyPerformance.values()].filter((s) => !s.aiGenerated);
      const manualAvgScore = manualSurveys.length
        ? manualSurveys.reduce((sum, s) => sum + s.averageScore, 0) / manualSurveys.length
        : 0;
      survey.performanceVsManual = survey.averageScore - manualAvgScore;

      performance.push(survey);
    }

    return performance.sort((a, b) => b.responseCount - a.responseCount);
  } catch (error) {
    console.error("Failed to get AI survey performance:", error);
    return [];
  }
}

/**
 * Check if a specific survey was AI-generated
 */
export function isAIGeneratedSurvey(surveyId: string, data: AdminDashboardData): boolean {
  const response = data.responses.find((r) => r.survey_id === surveyId);
  return response?.ai_generated === true;
}

/**
 * Get AI confidence score for a survey
 */
export function getAIConfidenceScore(surveyId: string, data: AdminDashboardData): number | null {
  const response = data.responses.find((r) => r.survey_id === surveyId);
  return response?.ai_confidence_score ?? null;
}