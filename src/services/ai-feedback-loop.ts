/**
 * AI Feedback Loop Service
 * Handles performance feedback submission and retrieval for AI-generated surveys
 */

import { apiRequest } from "./api";

export interface PerformanceFeedback {
  surveyId?: string;
  executionId?: string;
  activityId?: string;
  predictedScore?: number;
  actualScore: number;
  predictedResponseRate?: number;
  actualResponseRate: number;
  feedbackNotes?: string;
  aiModelVersion?: string;
}

export interface ImprovementSuggestion {
  category: string;
  suggestion: string;
  impact: string;
  priority: number;
}

export interface PerformanceFeedbackResponse {
  feedbackId: string;
  performanceGap: number;
  improvementSuggestions: ImprovementSuggestion[];
}

export interface PerformanceFeedbackRecord {
  id: string;
  survey_id: string | null;
  execution_id: string | null;
  activity_id: string | null;
  predicted_score: number | null;
  actual_score: number;
  predicted_response_rate: number | null;
  actual_response_rate: number;
  performance_gap: number;
  feedback_notes: string | null;
  improvement_suggestions: ImprovementSuggestion[];
  created_at: string;
  ai_model_version: string;
  feedback_source: string;
}

/**
 * Submit performance feedback for an AI-generated survey
 */
export async function submitPerformanceFeedback(
  feedback: PerformanceFeedback
): Promise<PerformanceFeedbackResponse> {
  try {
    return await apiRequest<PerformanceFeedbackResponse>("/api/admin/ai-performance-feedback", {
      method: "POST",
      body: JSON.stringify(feedback),
    });
  } catch (error) {
    console.error("Error submitting performance feedback:", error);
    throw error;
  }
}

/**
 * Get performance feedback history for a survey
 */
export async function getPerformanceFeedbackHistory(
  surveyId: string
): Promise<PerformanceFeedbackRecord[]> {
  try {
    return await apiRequest<PerformanceFeedbackRecord[]>(
      `/api/admin/ai-performance-feedback?surveyId=${encodeURIComponent(surveyId)}`
    );
  } catch (error) {
    console.error("Error getting performance feedback history:", error);
    throw error;
  }
}

/**
 * Get performance feedback for a specific AI execution
 */
export async function getPerformanceFeedbackByExecutionId(
  executionId: string
): Promise<PerformanceFeedbackRecord | null> {
  try {
    return await apiRequest<PerformanceFeedbackRecord | null>(
      `/api/admin/ai-performance-feedback?executionId=${encodeURIComponent(executionId)}`
    );
  } catch (error) {
    console.error("Error getting performance feedback by execution ID:", error);
    throw error;
  }
}

/**
 * Get performance feedback for a specific activity
 */
export async function getPerformanceFeedbackByActivityId(
  activityId: string
): Promise<PerformanceFeedbackRecord[]> {
  try {
    return await apiRequest<PerformanceFeedbackRecord[]>(
      `/api/admin/ai-performance-feedback?activityId=${encodeURIComponent(activityId)}`
    );
  } catch (error) {
    console.error("Error getting performance feedback by activity ID:", error);
    throw error;
  }
}

/**
 * Update performance feedback record
 */
export async function updatePerformanceFeedback(
  feedbackId: string,
  updates: {
    feedbackNotes?: string;
    improvementSuggestions?: ImprovementSuggestion[];
  }
): Promise<PerformanceFeedbackResponse> {
  try {
    return await apiRequest<PerformanceFeedbackResponse>(
      `/api/admin/ai-performance-feedback?id=${encodeURIComponent(feedbackId)}`,
      {
        method: "PATCH",
        body: JSON.stringify(updates),
      }
    );
  } catch (error) {
    console.error("Error updating performance feedback:", error);
    throw error;
  }
}

/**
 * Get all performance feedback records (for improvement dashboard)
 */
export async function getAllPerformanceFeedback(): Promise<PerformanceFeedbackRecord[]> {
  try {
    return await apiRequest<PerformanceFeedbackRecord[]>("/api/admin/ai-performance-feedback");
  } catch (error) {
    console.error("Error getting all performance feedback:", error);
    throw error;
  }
}
