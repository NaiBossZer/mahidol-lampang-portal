import { useState, useEffect } from "react";
import { X, Lightbulb, CheckCircle, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import {
  getAIRecommendations,
  getPriorityColor,
  getDifficultyBadge,
  type AIRecommendationsRequest,
  type AIRecommendationsResponse,
  type Recommendation,
} from "@/services/ai-predictive-analytics";

interface AIRecommendationsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activityId: string;
  activityTitle?: string;
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

export default function AIRecommendationsSidebar({
  isOpen,
  onClose,
  activityId,
  activityTitle,
  currentMetrics,
  goals,
  targetAudience,
  historicalData,
}: AIRecommendationsSidebarProps) {
  const [recommendations, setRecommendations] = useState<AIRecommendationsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [implementedRecommendations, setImplementedRecommendations] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["surveyOptimization"]));

  useEffect(() => {
    if (isOpen && activityId) {
      loadRecommendations();
    }
  }, [isOpen, activityId]);

  const loadRecommendations = async () => {
    setLoading(true);
    setError(null);

    try {
      const request: AIRecommendationsRequest = {
        activityId,
        currentMetrics,
        goals,
        targetAudience,
        historicalData,
      };

      const response = await getAIRecommendations(request);
      setRecommendations(response);
    } catch (err) {
      console.error("Failed to load AI recommendations:", err);
      setError("Failed to load AI recommendations");
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const toggleImplemented = (recommendationId: string) => {
    setImplementedRecommendations((prev) => {
      const next = new Set(prev);
      if (next.has(recommendationId)) {
        next.delete(recommendationId);
      } else {
        next.add(recommendationId);
      }
      return next;
    });
  };

  const getRecommendationId = (recommendation: Recommendation, index: number, category: string) => {
    return `${category}-${index}`;
  };

  const renderRecommendationList = (recommendationsList: Recommendation[], category: string) => {
    return recommendationsList.map((recommendation, index) => {
      const id = getRecommendationId(recommendation, index, category);
      const isImplemented = implementedRecommendations.has(id);

      return (
        <div
          key={id}
          className={`p-3 rounded-lg border transition-all ${
            isImplemented
              ? "bg-green-50 border-green-200 opacity-75"
              : "bg-white border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleImplemented(id)}
                className={`p-1 rounded-full transition-colors ${
                  isImplemented ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                }`}
                title={isImplemented ? "Mark as not implemented" : "Mark as implemented"}
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium capitalize">{recommendation.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${getPriorityColor(recommendation.priority)}`}>
                P{recommendation.priority}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyBadge(recommendation.implementationDifficulty)}`}
              >
                {recommendation.implementationDifficulty}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-2">{recommendation.recommendation}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Expected impact: +{recommendation.expectedImpact}%</span>
          </div>
        </div>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            AI Recommendations
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        {activityTitle && <p className="text-sm text-gray-600">{activityTitle}</p>}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 text-gray-400 animate-spin" />
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : recommendations ? (
          <div className="space-y-4">
            {/* Summary */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Summary</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-blue-700">Total: </span>
                  <span className="font-medium">{recommendations.summary.totalRecommendations}</span>
                </div>
                <div>
                  <span className="text-red-700">High: </span>
                  <span className="font-medium">{recommendations.summary.highPriorityCount}</span>
                </div>
                <div>
                  <span className="text-yellow-700">Medium: </span>
                  <span className="font-medium">{recommendations.summary.mediumPriorityCount}</span>
                </div>
                <div>
                  <span className="text-green-700">Low: </span>
                  <span className="font-medium">{recommendations.summary.lowPriorityCount}</span>
                </div>
              </div>
            </div>

            {/* Top Recommendations */}
            {recommendations.summary.topRecommendations.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Top Priority Actions</h3>
                <div className="space-y-2">
                  {recommendations.summary.topRecommendations.map((recommendation, index) => (
                    <div key={index} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-sm font-medium text-yellow-900">{recommendation.recommendation}</p>
                      <p className="text-xs text-yellow-700 mt-1">Impact: +{recommendation.expectedImpact}%</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Survey Optimization */}
            {recommendations.recommendations.surveyOptimization.length > 0 && (
              <div>
                <button
                  onClick={() => toggleSection("surveyOptimization")}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">Survey Optimization</span>
                  {expandedSections.has("surveyOptimization") ? (
                    <ChevronUp className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  )}
                </button>
                {expandedSections.has("surveyOptimization") && (
                  <div className="mt-2 space-y-2">
                    {renderRecommendationList(recommendations.recommendations.surveyOptimization, "surveyOptimization")}
                  </div>
                )}
              </div>
            )}

            {/* Participant Engagement */}
            {recommendations.recommendations.participantEngagement.length > 0 && (
              <div>
                <button
                  onClick={() => toggleSection("participantEngagement")}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">Participant Engagement</span>
                  {expandedSections.has("participantEngagement") ? (
                    <ChevronUp className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  )}
                </button>
                {expandedSections.has("participantEngagement") && (
                  <div className="mt-2 space-y-2">
                    {renderRecommendationList(
                      recommendations.recommendations.participantEngagement,
                      "participantEngagement"
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Timing Optimization */}
            {recommendations.recommendations.timingOptimization.length > 0 && (
              <div>
                <button
                  onClick={() => toggleSection("timingOptimization")}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">Timing Optimization</span>
                  {expandedSections.has("timingOptimization") ? (
                    <ChevronUp className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  )}
                </button>
                {expandedSections.has("timingOptimization") && (
                  <div className="mt-2 space-y-2">
                    {renderRecommendationList(
                      recommendations.recommendations.timingOptimization,
                      "timingOptimization"
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No recommendations available</p>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={loadRecommendations}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Recommendations
        </button>
      </div>
    </div>
  );
}
