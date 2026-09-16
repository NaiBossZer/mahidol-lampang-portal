/**
 * AI Predictive Analytics Service
 * Handles predictive metrics and AI recommendations for future activities
 */

import { apiRequest } from "./api";

export interface HistoricalData {
  participantCounts?: number[];
  responseRates?: number[];
  averageScores?: number[];
}

export interface RiskFactor {
  type: string;
  description: string;
  severity: string;
  mitigation: string;
}

export interface OptimizationSuggestion {
  category: string;
  suggestion: string;
  expectedImpact: number;
  implementationDifficulty: "low" | "medium" | "high";
  priority: number;
}

export interface PredictiveMetricsRequest {
  activityId: string;
  historicalData?: HistoricalData;
  aiAnalysis?: Record<string, unknown>;
  targetAudienceSize?: number;
}

export interface PredictiveMetricsResponse {
  activityId: string;
  activityTitle?: string;
  predictedMetrics: {
    predictedParticipantCount: number;
    predictedResponseRate: number;
    confidenceInterval: {
      participantCount: { min: number; max: number };
      responseRate: { min: number; max: number };
    };
  };
  riskFactors: RiskFactor[];
  optimizationSuggestions: OptimizationSuggestion[];
  metadata: {
    analysisDate: string;
    dataPoints: number;
    confidenceLevel: number;
  };
}

export interface Recommendation {
  category: string;
  recommendation: string;
  expectedImpact: number;
  implementationDifficulty: "low" | "medium" | "high";
  priority: number;
}

export interface AIRecommendationsRequest {
  activityId: string;
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
}

export interface AIRecommendationsResponse {
  activityId: string;
  activityTitle?: string;
  activityDate?: string;
  recommendations: {
    surveyOptimization: Recommendation[];
    participantEngagement: Recommendation[];
    timingOptimization: Recommendation[];
  };
  summary: {
    totalRecommendations: number;
    highPriorityCount: number;
    mediumPriorityCount: number;
    lowPriorityCount: number;
    topRecommendations: Recommendation[];
  };
  metadata: {
    generatedAt: string;
    analysisVersion: string;
  };
}

/**
 * Get predictive metrics for an activity
 */
export async function getPredictiveMetrics(
  request: PredictiveMetricsRequest
): Promise<PredictiveMetricsResponse> {
  try {
    return await apiRequest<PredictiveMetricsResponse>("/api/admin/ai-predictive-analytics", {
      method: "POST",
      body: JSON.stringify(request),
    });
  } catch (error) {
    console.error("Error getting predictive metrics:", error);
    throw error;
  }
}

/**
 * Get AI recommendations for an activity
 */
export async function getAIRecommendations(
  request: AIRecommendationsRequest
): Promise<AIRecommendationsResponse> {
  try {
    return await apiRequest<AIRecommendationsResponse>("/api/admin/ai-recommendations", {
      method: "POST",
      body: JSON.stringify(request),
    });
  } catch (error) {
    console.error("Error getting AI recommendations:", error);
    throw error;
  }
}

/**
 * Format confidence interval for display
 */
export function formatConfidenceInterval(interval: { min: number; max: number }): string {
  return `${interval.min.toFixed(0)} - ${interval.max.toFixed(0)}`;
}

/**
 * Get risk severity color
 */
export function getRiskSeverityColor(severity: string): string {
  switch (severity) {
    case "high":
      return "text-red-600 bg-red-50";
    case "medium":
      return "text-yellow-600 bg-yellow-50";
    case "low":
      return "text-green-600 bg-green-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
}

/**
 * Get priority color
 */
export function getPriorityColor(priority: number): string {
  switch (priority) {
    case 1:
      return "text-red-600";
    case 2:
      return "text-yellow-600";
    case 3:
      return "text-green-600";
    default:
      return "text-gray-600";
  }
}

/**
 * Get implementation difficulty badge
 */
export function getDifficultyBadge(difficulty: string): string {
  switch (difficulty) {
    case "low":
      return "bg-green-100 text-green-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "high":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
