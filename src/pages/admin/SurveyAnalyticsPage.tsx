import { useEffect, useMemo, useState } from "react";
import { BarChart3, RefreshCw, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

type Response = Record<string, unknown>;
type Data = {
  responses: Response[];
  summary: {
    respondents: number;
    answeredScores: number;
    averageScore: number | null;
    satisfactionPercent: number | null;
  };
};

const groups = [
  {
    key: "opening",
    title: "พิธีเปิด",
    fields: ["p2_location", "p2_schedule", "p2_readiness", "p2_reception", "p2_overall"],
  },
  {
    key: "learning",
    title: "ห้องเรียนรู้",
    fields: ["p3_interest", "p3_content", "p3_clarity", "p3_benefit", "p3_application"],
  },
  {
    key: "outcome",
    title: "ผลที่ได้รับ",
    fields: ["p4_knowledge", "p4_inspiration", "p4_community_resource", "p4_future_return"],
  },
];
const labels: Record<string, string> = {
  p2_location: "สถานที่",
  p2_schedule: "กำหนดการ",
  p2_readiness: "ความพร้อมสถานที่",
  p2_reception: "การต้อนรับเจ้าหน้าที่",
  p2_overall: "ภาพรวม",
  p3_interest: "ความน่าสนใจ",
  p3_content: "ความเหมาะสมเนื้อหา",
  p3_clarity: "สื่อเข้าใจง่าย",
  p3_benefit: "ประโยชน์ความรู้",
  p3_application: "นำไปต่อยอด",
  p4_knowledge: "ความรู้เพิ่มขึ้น",
  p4_inspiration: "สร้างแรงบันดาลใจ",
  p4_community_resource: "แหล่งเรียนรู้ชุมชน",
  p4_future_return: "สนใจร่วมอีกในอนาคต",
};

export function SurveyAnalyticsPage() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/survey-responses", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      const b = await r.json();
      if (!r.ok) throw new Error(b.error || "โหลดผลประเมินไม่สำเร็จ");
      setData(b.data as Data);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "โหลดผลประเมินไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);

  const groupScores = useMemo(
    () =>
      groups.map((g) => {
        const values =
          data?.responses.flatMap((r) =>
            g.fields.map((f) => r[f]).filter((v): v is number => typeof v === "number"),
          ) ?? [];
        return {
          ...g,
          average: values.length ? values.reduce((a, b) => a + b, 0) / values.length : null,
        };
      }),
    [data],
  );
  const feedback = data?.responses.filter((r) => String(r.feedback ?? "").trim()).slice(0, 6) ?? [];

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.14em] text-emerald-700">
            Engagement & Insights
          </p>
          <h1 className="mt-1 text-2xl font-bold text-brand-navy lg:text-3xl">
            ผลการประเมินกิจกรรม
          </h1>
          <p className="mt-1 text-sm text-slate-600">ข้อมูลจากคำตอบจริงในฐานข้อมูลกลางของ Portal</p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-brand-navy shadow-sm"
        >
          <RefreshCw className="h-4 w-4" />
          รีเฟรช
        </button>
      </div>
      {loading ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          กำลังโหลดผลประเมิน...
        </div>
      ) : (
        data && (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <Users className="h-5 w-5 text-emerald-700" />
                <p className="mt-4 text-xs text-slate-500">ผู้ตอบแบบสอบถาม</p>
                <p className="mt-1 text-3xl font-bold text-brand-navy">
                  {data.summary.respondents}
                </p>
                <p className="mt-1 text-xs text-slate-500">responses</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <Star className="h-5 w-5 text-emerald-700" />
                <p className="mt-4 text-xs text-slate-500">คะแนนเฉลี่ย</p>
                <p className="mt-1 text-3xl font-bold text-brand-navy">
                  {data.summary.averageScore?.toFixed(2) ?? "—"}
                  <span className="ml-1 text-base font-medium text-slate-400">/ 5</span>
                </p>
                <p className="mt-1 text-xs text-slate-500">{data.summary.answeredScores} คะแนน</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <BarChart3 className="h-5 w-5 text-emerald-700" />
                <p className="mt-4 text-xs text-slate-500">ความพึงพอใจ</p>
                <p className="mt-1 text-3xl font-bold text-brand-navy">
                  {data.summary.satisfactionPercent?.toFixed(2) ?? "—"}
                  <span className="ml-1 text-base font-medium text-slate-400">%</span>
                </p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-600"
                    style={{ width: `${Math.min(100, data.summary.satisfactionPercent ?? 0)}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {groupScores.map((g) => (
                <div
                  key={g.key}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-brand-navy">{g.title}</h2>
                    <span className="text-lg font-bold text-brand-navy">
                      {g.average?.toFixed(2) ?? "—"}
                    </span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {g.fields.map((f) => {
                      const values = data.responses
                        .map((r) => r[f])
                        .filter((v): v is number => typeof v === "number");
                      const avg = values.length
                        ? values.reduce((a, b) => a + b, 0) / values.length
                        : 0;
                      return (
                        <div key={f}>
                          <div className="mb-1 flex justify-between gap-3 text-xs">
                            <span className="text-slate-600">{labels[f]}</span>
                            <span className="font-semibold text-slate-700">{avg.toFixed(2)}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-emerald-600"
                              style={{ width: `${Math.min(100, (avg / 5) * 100)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-bold text-brand-navy">ข้อเสนอแนะจากผู้เข้าร่วม</h2>
                  <p className="mt-1 text-xs text-slate-500">แสดงข้อความจริงจากแบบประเมิน</p>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {feedback.length} รายการ
                </span>
              </div>
              {feedback.length ? (
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {feedback.map((r) => (
                    <div
                      key={String(r.id)}
                      className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 text-sm text-slate-700"
                    >
                      {String(r.feedback)}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-5 text-sm text-slate-500">ไม่มีข้อเสนอแนะเพิ่มเติม</p>
              )}
            </div>
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-5">
                <h2 className="font-bold text-brand-navy">รายการคำตอบ</h2>
              </div>
              {data.responses.length === 0 ? (
                <p className="p-6 text-sm text-slate-500">ยังไม่มีคำตอบ</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b text-xs text-slate-500">
                      <tr>
                        <th className="p-3">วันที่ตอบ</th>
                        <th className="p-3">หน่วยงาน</th>
                        <th className="p-3">ข้อเสนอแนะ</th>
                        <th className="p-3 text-right">รายละเอียด</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.responses.map((r) => (
                        <tr key={String(r.id)} className="border-b border-slate-100 last:border-0">
                          <td className="whitespace-nowrap p-3">
                            {new Date(String(r.submitted_at)).toLocaleString("th-TH")}
                          </td>
                          <td className="p-3">{String(r.affiliation || "—")}</td>
                          <td className="max-w-md p-3">{String(r.feedback || "—")}</td>
                          <td className="p-3 text-right">
                            <Link
                              to={`/admin/surveys/response?id=${encodeURIComponent(String(r.id))}`}
                              className="font-semibold text-brand-navy underline underline-offset-2"
                            >
                              ดูรายละเอียด
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )
      )}
    </section>
  );
}
