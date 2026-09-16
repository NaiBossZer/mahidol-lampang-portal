import { useState } from "react";
import { X, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Lightbulb } from "lucide-react";
import {
  submitPerformanceFeedback,
  type PerformanceFeedback,
  type ImprovementSuggestion,
} from "@/services/ai-feedback-loop";

interface AIPerformanceFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  surveyId?: string;
  executionId?: string;
  activityId?: string;
  predictedScore?: number;
  predictedResponseRate?: number;
  aiModelVersion?: string;
  activityTitle?: string;
}

export default function AIPerformanceFeedbackModal({
  isOpen,
  onClose,
  surveyId,
  executionId,
  activityId,
  predictedScore = 4.0,
  predictedResponseRate = 65,
  aiModelVersion = "1.0.0",
  activityTitle,
}: AIPerformanceFeedbackModalProps) {
  const [actualScore, setActualScore] = useState<number>(4.0);
  const [actualResponseRate, setActualResponseRate] = useState<number>(65);
  const [feedbackNotes, setFeedbackNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [improvementSuggestions, setImprovementSuggestions] = useState<ImprovementSuggestion[]>([]);

  if (!isOpen) return null;

  const performanceGap = Math.abs(predictedScore - actualScore);
  const responseRateGap = Math.abs(predictedResponseRate - actualResponseRate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const feedback: PerformanceFeedback = {
        surveyId,
        executionId,
        activityId,
        predictedScore,
        actualScore,
        predictedResponseRate,
        actualResponseRate,
        feedbackNotes,
        aiModelVersion,
      };

      const result = await submitPerformanceFeedback(feedback);
      setImprovementSuggestions(result.improvementSuggestions);
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPerformanceIcon = () => {
    if (actualScore >= predictedScore) return <TrendingUp className="w-5 h-5 text-green-600" />;
    return <TrendingDown className="w-5 h-5 text-red-600" />;
  };

  const getResponseRateIcon = () => {
    if (actualResponseRate >= predictedResponseRate) return <TrendingUp className="w-5 h-5 text-green-600" />;
    return <TrendingDown className="w-5 h-5 text-red-600" />;
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Feedback Submitted Successfully</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Performance feedback recorded</p>
                  <p className="text-sm text-green-700">Thank you for contributing to AI model improvement</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                AI-Generated Improvement Suggestions
              </h3>
              <div className="space-y-3">
                {improvementSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      suggestion.impact === "high"
                        ? "bg-red-50 border-red-200"
                        : suggestion.impact === "medium"
                        ? "bg-yellow-50 border-yellow-200"
                        : "bg-green-50 border-green-200"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 capitalize">{suggestion.category}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          suggestion.impact === "high"
                            ? "bg-red-100 text-red-800"
                            : suggestion.impact === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {suggestion.impact} impact
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{suggestion.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">AI Performance Feedback</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          {activityTitle && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Activity</p>
              <p className="font-medium text-gray-900">{activityTitle}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Performance Comparison */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-2">Predicted Score</p>
                <p className="text-2xl font-bold text-blue-900">{predictedScore.toFixed(1)}</p>
                <p className="text-xs text-blue-700 mt-1">AI Model v{aiModelVersion}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-gray-600 mb-2">Actual Score</p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={actualScore}
                    onChange={(e) => setActualScore(parseFloat(e.target.value))}
                    className="text-2xl font-bold text-green-900 bg-transparent border-b-2 border-green-300 focus:border-green-500 outline-none w-24"
                    required
                  />
                  {getPerformanceIcon()}
                </div>
                <p className="text-xs text-green-700 mt-1">Gap: {performanceGap.toFixed(1)}</p>
              </div>
            </div>

            {/* Response Rate Comparison */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-gray-600 mb-2">Predicted Response Rate</p>
                <p className="text-2xl font-bold text-purple-900">{predictedResponseRate.toFixed(0)}%</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm text-gray-600 mb-2">Actual Response Rate</p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={actualResponseRate}
                    onChange={(e) => setActualResponseRate(parseFloat(e.target.value))}
                    className="text-2xl font-bold text-orange-900 bg-transparent border-b-2 border-orange-300 focus:border-orange-500 outline-none w-24"
                    required
                  />
                  {getResponseRateIcon()}
                </div>
                <p className="text-xs text-orange-700 mt-1">Gap: {responseRateGap.toFixed(0)}%</p>
              </div>
            </div>

            {/* Performance Gap Alert */}
            {performanceGap > 0.5 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-900">Significant Performance Gap Detected</p>
                  <p className="text-sm text-yellow-700">
                    The actual performance differs significantly from AI predictions. This feedback will help improve future predictions.
                  </p>
                </div>
              </div>
            )}

            {/* Feedback Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Feedback Notes (Optional)
              </label>
              <textarea
                value={feedbackNotes}
                onChange={(e) => setFeedbackNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                placeholder="Add any observations or context that might help explain the performance gap..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
