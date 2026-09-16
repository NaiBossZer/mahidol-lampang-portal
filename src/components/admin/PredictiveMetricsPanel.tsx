import { useState, useEffect } from "react";
import { Users, TrendingUp, AlertTriangle, Lightbulb, RefreshCw } from "lucide-react";
import {
  getPredictiveMetrics,
  formatConfidenceInterval,
  getRiskSeverityColor,
  type PredictiveMetricsRequest,
  type PredictiveMetricsResponse,
} from "@/services/ai-predictive-analytics";

interface PredictiveMetricsPanelProps {
  activityId: string;
  activityTitle?: string;
  historicalData?: {
    participantCounts?: number[];
    responseRates?: number[];
    averageScores?: number[];
  };
  aiAnalysis?: Record<string, unknown>;
  targetAudienceSize?: number;
}

export default function PredictiveMetricsPanel({
  activityId,
  activityTitle,
  historicalData,
  aiAnalysis,
  targetAudienceSize,
}: PredictiveMetricsPanelProps) {
  const [metrics, setMetrics] = useState<PredictiveMetricsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activityId) {
      loadPredictiveMetrics();
    }
  }, [activityId]);

  const loadPredictiveMetrics = async () => {
    setLoading(true);
    setError(null);

    try {
      const request: PredictiveMetricsRequest = {
        activityId,
        historicalData,
        aiAnalysis,
        targetAudienceSize,
      };

      const response = await getPredictiveMetrics(request);
      setMetrics(response);
    } catch (err) {
      console.error("Failed to load predictive metrics:", err);
      setError("Failed to load predictive metrics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 text-gray-400 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 text-red-600">
          <AlertTriangle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-gray-500 text-center">No predictive metrics available</p>
      </div>
    );
  }

  const highRiskCount = metrics.riskFactors.filter((r) => r.severity === "high").length;
  const mediumRiskCount = metrics.riskFactors.filter((r) => r.severity === "medium").length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Predictive Analytics
          </h3>
          {activityTitle && <p className="text-sm text-gray-600 mt-1">{activityTitle}</p>}
        </div>
        <button
          onClick={loadPredictiveMetrics}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Refresh predictions"
        >
          <RefreshCw className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Predicted Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-600" />
            <p className="text-sm text-gray-600">Predicted Participants</p>
          </div>
          <p className="text-2xl font-bold text-blue-900">
            {metrics.predictedMetrics.predictedParticipantCount}
          </p>
          <p className="text-xs text-blue-700 mt-1">
            Range: {formatConfidenceInterval(metrics.predictedMetrics.confidenceInterval.participantCount)}
          </p>
        </div>

        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <p className="text-sm text-gray-600">Predicted Response Rate</p>
          </div>
          <p className="text-2xl font-bold text-green-900">
            {metrics.predictedMetrics.predictedResponseRate.toFixed(0)}%
          </p>
          <p className="text-xs text-green-700 mt-1">
            Range: {formatConfidenceInterval(metrics.predictedMetrics.confidenceInterval.responseRate)}%
          </p>
        </div>
      </div>

      {/* Risk Factors */}
      {metrics.riskFactors.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            Risk Factors ({highRiskCount} high, {mediumRiskCount} medium)
          </h4>
          <div className="space-y-2">
            {metrics.riskFactors.map((risk, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${getRiskSeverityColor(risk.severity)}`}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="text-sm font-medium capitalize">{risk.type.replace(/_/g, " ")}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/50 capitalize">
                    {risk.severity}
                  </span>
                </div>
                <p className="text-sm mb-2">{risk.description}</p>
                <p className="text-xs italic opacity-75">Mitigation: {risk.mitigation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Optimization Suggestions */}
      {metrics.optimizationSuggestions.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-600" />
            Optimization Suggestions
          </h4>
          <div className="space-y-2">
            {metrics.optimizationSuggestions.slice(0, 3).map((suggestion, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between mb-1">
                  <span className="text-sm font-medium capitalize">{suggestion.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">+{suggestion.expectedImpact}%</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        suggestion.implementationDifficulty === "low"
                          ? "bg-green-100 text-green-800"
                          : suggestion.implementationDifficulty === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {suggestion.implementationDifficulty}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{suggestion.suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            Analysis based on {metrics.metadata.dataPoints} data points
          </span>
          <span>
            {new Date(metrics.metadata.analysisDate).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}
