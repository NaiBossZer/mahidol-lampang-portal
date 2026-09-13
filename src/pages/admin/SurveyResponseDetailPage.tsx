import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { toast } from "sonner";

type Detail = {
  response: Record<string, unknown>;
  answers: Array<Record<string, unknown>>;
  questions: Array<Record<string, unknown>>;
};

export function SurveyResponseDetailPage() {
  const [params] = useSearchParams();
  const id = params.get("id");
  const [data, setData] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!id) return;
    setLoading(true);
    try {
      const r = await fetch(`/api/admin/survey-response?id=${encodeURIComponent(id)}`, {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      const b = await r.json();
      if (!r.ok) throw new Error(b?.error || "โหลดคำตอบไม่สำเร็จ");
      setData(b.data as Detail);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "โหลดคำตอบไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [id]);
  if (!id) return <div className="p-8 text-center">ไม่พบ response id</div>;

  return (
    <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <Link
          to="/admin/surveys/analytics"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy"
        >
          <ArrowLeft className="h-4 w-4" />
          กลับ Analytics
        </Link>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold"
        >
          <RefreshCw className="h-4 w-4" />
          รีเฟรช
        </button>
      </div>
      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[.14em] text-emerald-700">
          Survey Response
        </p>
        <h1 className="mt-1 text-2xl font-bold text-brand-navy">รายละเอียดคำตอบ</h1>
      </div>
      {loading ? (
        <div className="mt-6 rounded-2xl border bg-white p-10 text-center text-sm text-slate-500">
          กำลังโหลด...
        </div>
      ) : (
        data && (
          <div className="mt-6 space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="font-bold text-brand-navy">ข้อมูลผู้ตอบ</h2>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                {["age_group", "affiliation", "ever_joined", "channels", "submitted_at"].map(
                  (k) => (
                    <div key={k}>
                      <dt className="text-xs text-slate-500">{k}</dt>
                      <dd className="mt-1 font-semibold">{String(data.response[k] ?? "—")}</dd>
                    </div>
                  ),
                )}
                <div>
                  <dt className="text-xs text-slate-500">Privacy</dt>
                  <dd className="mt-1 font-semibold">
                    {data.response.anonymous === true ? "Anonymous" : "ตามการตั้งค่าแบบสอบถาม"}
                  </dd>
                </div>
              </dl>
              <p className="mt-4 text-sm text-slate-700">{String(data.response.feedback ?? "")}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="font-bold text-brand-navy">คำตอบตามคำถาม</h2>
              <div className="mt-4 space-y-3">
                {data.answers.map((a) => {
                  const q = data.questions.find((x) => x.id === a.question_id);
                  const answer =
                    a.answer_number != null
                      ? `คะแนน ${String(a.answer_number)}`
                      : a.answer_text != null
                        ? String(a.answer_text)
                        : JSON.stringify(a.answer_options ?? []);
                  return (
                    <div key={String(a.id)} className="rounded-xl border border-slate-100 p-4">
                      <p className="text-sm font-semibold">
                        {String(q?.question_text ?? a.question_id)}
                      </p>
                      <p className="mt-2 text-sm text-slate-600">{answer}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )
      )}
    </section>
  );
}
