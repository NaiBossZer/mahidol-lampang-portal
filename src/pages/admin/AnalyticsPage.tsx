import { useEffect, useMemo, useState } from "react";
import { BarChart3, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { getAdminDashboardData, type AdminDashboardData } from "@/services/api";
const groups = [
  { key: "p2", label: "การจัดกิจกรรม" },
  { key: "p3", label: "เนื้อหาและการเรียนรู้" },
  { key: "p4", label: "ประโยชน์และการต่อยอด" },
] as const;
const fields: Record<string, string[]> = {
  p2: ["p2_location", "p2_schedule", "p2_readiness", "p2_reception", "p2_overall"],
  p3: ["p3_interest", "p3_content", "p3_clarity", "p3_benefit", "p3_application"],
  p4: ["p4_knowledge", "p4_inspiration", "p4_community_resource", "p4_future_return"],
};
function average(values: number[]) {
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
}
export function AnalyticsPage() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    try {
      setData(await getAdminDashboardData());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "โหลด Analytics ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  const stats = useMemo(
    () =>
      groups.map((group) => ({
        ...group,
        score: average(
          (data?.responses ?? []).flatMap((response) =>
            fields[group.key]
              .map((field) => Number((response as Record<string, unknown>)[field] ?? NaN))
              .filter((value) => Number.isFinite(value)),
          ),
        ),
      })),
    [data],
  );
  const byActivity = useMemo(
    () =>
      (data?.activities ?? [])
        .filter(
          (activity) =>
            activity.status !== "cancelled" &&
            activity.status !== "archived" &&
            activity.status !== "retired",
        )
        .map((activity) => ({
          ...activity,
          responses: (data?.responses ?? []).filter(
            (response) => response.activity_id === activity.id,
          ).length,
        }))
        .sort((a, b) => b.responses - a.responses)
        .slice(0, 12),
    [data],
  );
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
            Insights
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-brand-navy lg:text-3xl">
            Analytics
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            ภาพรวมผลลัพธ์กิจกรรมและแบบสอบถามจากข้อมูลกลางของ Portal
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex min-h-11 items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-brand-navy"
        >
          <RefreshCw className="h-4 w-4" />
          รีเฟรช
        </button>
      </div>
      {loading ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          กำลังโหลด Analytics...
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.key}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
                <p className="mt-2 text-3xl font-black text-brand-navy">
                  {stat.score == null ? "—" : stat.score.toFixed(2)}
                </p>
                <p className="mt-1 text-xs text-slate-400">คะแนนเฉลี่ยจากสเกล 5</p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="font-bold text-brand-navy">การตอบแบบสอบถามรายกิจกรรม</h2>
                <p className="mt-1 text-xs text-slate-500">
                  กิจกรรมที่ไม่มีแบบสอบถามยังคงอยู่ในข้อมูลกิจกรรม แต่ไม่ถูกนับเป็นคะแนน 0
                </p>
              </div>
              {byActivity.length === 0 ? (
                <p className="p-8 text-sm text-slate-500">ยังไม่มีข้อมูล</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {byActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between gap-4 px-5 py-4"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900">{activity.title}</p>
                        <p className="text-xs text-slate-500">{activity.activity_date}</p>
                      </div>
                      <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600">
                        {activity.responses} responses
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <BarChart3 className="h-6 w-6 text-brand-navy" />
              <h2 className="mt-3 font-bold text-brand-navy">Dataset summary</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">กิจกรรมทั้งหมด</dt>
                  <dd className="font-bold">{data?.activities.length ?? 0}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">กิจกรรมที่ประเมิน</dt>
                  <dd className="font-bold">
                    {new Set((data?.responses ?? []).map((response) => response.activity_id)).size}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">ผู้ตอบแบบสอบถาม</dt>
                  <dd className="font-bold">{data?.responses.length ?? 0}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Learning Centers</dt>
                  <dd className="font-bold">{data?.learningCenters.length ?? 0}</dd>
                </div>
              </dl>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
