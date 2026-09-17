import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { getAIInsights, type AIInsightSummary } from "@/services/ai-dashboard-integration";

export default function AIInsightsPanel() {
  const [insights, setInsights] = useState<AIInsightSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void getAIInsights()
      .then((value) => { if (active) setInsights(value); })
      .catch((error) => console.error("Failed to load AI insights:", error))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <section className="mt-5 mb-5 rounded-xl border border-violet-200 bg-gradient-to-r from-violet-50 to-purple-50 p-4 shadow-xs">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-2">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
          <h2 className="min-w-0 text-[14px] font-bold leading-5 text-violet-900">AI Insights และสมรรถนะแบบสอบถาม</h2>
        </div>
        <span className="w-fit shrink-0 rounded-full bg-violet-100 px-2 py-1 text-[10px] font-medium text-violet-600">AI Studio Integration</span>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => <div key={item} className="h-20 animate-pulse rounded-lg border border-violet-100 bg-white/60" />)}
        </div>
      ) : insights ? (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="แบบสอบถามทั้งหมด" value={String(insights.totalSurveys)} suffix="surveys" />
            <Metric label="AI สร้าง" value={String(insights.aiGeneratedSurveys)} suffix={`(${insights.aiPercentage.toFixed(1)}%)`} />
            <Metric label="Manual" value={String(insights.manualSurveys)} suffix="surveys" />
            <Metric label="AI Confidence" value={insights.averageAIConfidence.toFixed(2)} suffix="avg score" />
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
            <Compare label="AI vs Manual คะแนนเฉลี่ย" ai={insights.aiVsManualPerformance.aiAvgScore} manual={insights.aiVsManualPerformance.manualAvgScore} />
            <Compare label="AI vs Manual อัตราตอบกลับ" ai={insights.aiVsManualPerformance.aiResponseRate} manual={insights.aiVsManualPerformance.manualResponseRate} percent />
          </div>
        </>
      ) : (
        <p className="rounded-lg bg-white/60 p-4 text-center text-xs text-slate-500">ยังไม่มีข้อมูล AI Insights</p>
      )}
    </section>
  );
}

function Metric({ label, value, suffix }: { label: string; value: string; suffix: string }) {
  return <div className="min-w-0 rounded-lg border border-violet-100 bg-white/60 p-3"><p className="truncate text-[10px] font-medium text-violet-600">{label}</p><p className="text-lg font-bold text-violet-900">{value}</p><p className="text-[10px] text-slate-500">{suffix}</p></div>;
}

function Compare({ label, ai, manual, percent = false }: { label: string; ai: number; manual: number; percent?: boolean }) {
  const max = percent ? 100 : 5;
  const format = (value: number) => percent ? `${value.toFixed(1)}%` : value.toFixed(2);
  return <div className="min-w-0 rounded-lg border border-violet-100 bg-white/60 p-3"><p className="mb-2 text-[11px] font-medium text-violet-700">{label}</p><div className="space-y-2"><Bar label="AI" value={ai} width={Math.min(100, Math.max(0, ai / max * 100))} text={format(ai)} /><Bar label="Manual" value={manual} width={Math.min(100, Math.max(0, manual / max * 100))} text={format(manual)} /></div></div>;
}

function Bar({ label, width, text }: { label: string; value: number; width: number; text: string }) {
  return <div className="flex min-w-0 items-center gap-2"><span className="w-12 shrink-0 text-[10px] text-slate-500">{label}: {text}</span><div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-violet-500" style={{ width: `${width}%` }} /></div></div>;
}
