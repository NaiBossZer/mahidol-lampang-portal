import { useState, useEffect } from "react";
import { TrendingUp, Clock, CheckCircle, AlertCircle, Settings, BarChart3, RefreshCw } from "lucide-react";
import {
  getAllPerformanceFeedback,
  type PerformanceFeedbackRecord,
} from "@/services/ai-feedback-loop";

export default function AIImprovementDashboard() {
  const [feedbackRecords, setFeedbackRecords] = useState<PerformanceFeedbackRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "all">("month");
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    void loadFeedbackRecords();
  }, []);

  const loadFeedbackRecords = async () => {
    setLoading(true);
    try {
      const records = await getAllPerformanceFeedback();
      setFeedbackRecords(records);
    } catch (error) {
      console.error("Failed to load feedback records:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterRecordsByPeriod = (records: PerformanceFeedbackRecord[]) => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    switch (selectedPeriod) {
      case "week":
        return records.filter((r) => new Date(r.created_at) >= weekAgo);
      case "month":
        return records.filter((r) => new Date(r.created_at) >= monthAgo);
      case "all":
        return records;
      default:
        return records;
    }
  };

  const filteredRecords = filterRecordsByPeriod(feedbackRecords);

  // Calculate performance trends
  const performanceTrends = {
    averagePerformanceGap: filteredRecords.length
      ? filteredRecords.reduce((sum, r) => sum + r.performance_gap, 0) / filteredRecords.length
      : 0,
    averageActualScore: filteredRecords.length
      ? filteredRecords.reduce((sum, r) => sum + r.actual_score, 0) / filteredRecords.length
      : 0,
    averageResponseRate: filteredRecords.length
      ? filteredRecords.reduce((sum, r) => sum + r.actual_response_rate, 0) / filteredRecords.length
      : 0,
    totalFeedbacks: filteredRecords.length,
  };

  // Aggregate improvement suggestions
  const suggestionCategories = new Map<string, number>();
  filteredRecords.forEach((record) => {
    record.improvement_suggestions.forEach((suggestion) => {
      const count = suggestionCategories.get(suggestion.category) || 0;
      suggestionCategories.set(suggestion.category, count + 1);
    });
  });

  const topSuggestionCategories = Array.from(suggestionCategories.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            AI Model Improvement Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Track AI model performance and improvement suggestions</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as "week" | "month" | "all")}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="all">All Time</option>
          </select>
          <button
            onClick={() => void loadFeedbackRecords()}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh data"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Model settings"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-blue-50">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs text-gray-500">Avg Gap</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{performanceTrends.averagePerformanceGap.toFixed(2)}</p>
          <p className="text-xs text-gray-600 mt-1">Performance gap</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-green-50">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs text-gray-500">Avg Score</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{performanceTrends.averageActualScore.toFixed(2)}</p>
          <p className="text-xs text-gray-600 mt-1">Actual satisfaction</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-purple-50">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs text-gray-500">Response Rate</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{performanceTrends.averageResponseRate.toFixed(0)}%</p>
          <p className="text-xs text-gray-600 mt-1">Average response</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-orange-50">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-xs text-gray-500">Total Feedback</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{performanceTrends.totalFeedbacks}</p>
          <p className="text-xs text-gray-600 mt-1">Feedback records</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Improvement Suggestion Categories */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            Top Improvement Areas
          </h3>
          {topSuggestionCategories.length > 0 ? (
            <div className="space-y-3">
              {topSuggestionCategories.map(([category, count]) => (
                <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 capitalize">{category.replace(/_/g, " ")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{count}</span>
                    <span className="text-xs text-gray-500">suggestions</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No improvement suggestions yet</p>
          )}
        </div>

        {/* Recent Feedback Records */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Recent Feedback
          </h3>
          {filteredRecords.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {filteredRecords.slice(0, 5).map((record) => (
                <div key={record.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">
                      {new Date(record.created_at).toLocaleDateString()}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      v{record.ai_model_version}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-600">Gap: </span>
                      <span className="font-medium">{record.performance_gap.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Score: </span>
                      <span className="font-medium">{record.actual_score.toFixed(2)}</span>
                    </div>
                  </div>
                  {record.feedback_notes && (
                    <p className="text-xs text-gray-600 mt-2 italic">{record.feedback_notes}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No feedback records yet</p>
          )}
        </div>
      </div>

      {/* Model Settings Panel */}
      {showSettings && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-600" />
            AI Model Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Model Version</label>
              <input
                type="text"
                defaultValue="1.0.0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prediction Sensitivity</label>
              <select defaultValue="Balanced" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm">
                <option>Conservative</option>
                <option>Balanced</option>
                <option>Aggressive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confidence Threshold</label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                defaultValue="0.7"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Auto-Improvement</label>
              <select defaultValue="Enabled" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm">
                <option>Disabled</option>
                <option>Enabled</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setShowSettings(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => setShowSettings(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Save Configuration
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
