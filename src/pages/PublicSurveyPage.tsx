import { FormEvent, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import type { SurveyQuestion } from "@/services/admin-surveys";

type PublicSurvey = {
  id: string;
  occurrence_id: string;
  title: string | null;
  anonymous: boolean;
  welcome_text: string | null;
  questions: SurveyQuestion[];
};
type SurveySummary = Omit<PublicSurvey, "questions">;

function choiceOptions(question: SurveyQuestion): string[] {
  return Array.isArray(question.options) ? question.options.map((option) => String(option)) : [];
}

const sectionLabels: Record<string, string> = {
  profile: "ส่วนที่ 1 · ข้อมูลทั่วไป",
  organization: "ส่วนที่ 2 · ความพึงพอใจต่อการจัดอบรม",
  learning: "ส่วนที่ 3 · เนื้อหาและวิทยากร",
  practice: "ส่วนที่ 4 · การสาธิตและฝึกปฏิบัติ",
  outcomes: "ส่วนที่ 5 · ความรู้และการนำไปใช้",
  overall: "ส่วนที่ 6 · ภาพรวมโครงการ",
  feedback: "ส่วนที่ 7 · ความคิดเห็นเพิ่มเติม",
};

export function PublicSurveyPage() {
  const querySurveyId = useMemo(
    () => new URLSearchParams(window.location.search).get("surveyId"),
    [],
  );
  const [survey, setSurvey] = useState<PublicSurvey | null>(null);
  const [available, setAvailable] = useState<SurveySummary[]>([]);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function loadSurvey(id: string) {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/survey?surveyId=${encodeURIComponent(id)}`);
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "ไม่สามารถโหลดแบบสอบถามได้");
      setSurvey(body.data as PublicSurvey);
      setAnswers({});
      setConsent(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "ไม่สามารถโหลดแบบสอบถามได้");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetch("/api/survey")
      .then(async (r) => {
        const body = await r.json();
        if (!r.ok) throw new Error(body.error || "ไม่สามารถโหลดรายการแบบสอบถามได้");
        return body.data as SurveySummary[];
      })
      .then((rows) => {
        setAvailable(rows);
        if (querySurveyId) void loadSurvey(querySurveyId);
        else setLoading(false);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "ไม่สามารถโหลดรายการแบบสอบถามได้");
        setLoading(false);
      });
  }, [querySurveyId]);
  const isShellacSurvey = Boolean(survey?.title?.includes("ครั่งสร้างรายได้"));
  const setAnswer = (question: SurveyQuestion, value: string) =>
    setAnswers((current) => ({ ...current, [question.id]: value }));
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!survey || !consent) {
      setError("กรุณายอมรับข้อตกลงความเป็นส่วนตัว");
      return;
    }
    const missing = survey.questions.filter((q) => {
      const answer = answers[q.id];
      return (
        q.required &&
        (answer === undefined ||
          (typeof answer === "string" ? !answer.trim() : answer.length === 0))
      );
    });
    if (missing.length) {
      setError("กรุณาตอบคำถามที่จำเป็นให้ครบ");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const normalized = survey.questions.flatMap((q) => {
        const value = answers[q.id];
        const unanswered =
          value === undefined || value === "" || (Array.isArray(value) && value.length === 0);
        if (unanswered) return [];
        return [
          q.question_type === "rating"
            ? { questionId: q.id, number: Number(value) }
            : q.question_type === "multi_choice"
              ? { questionId: q.id, options: Array.isArray(value) ? value : [String(value)] }
              : { questionId: q.id, text: String(value) },
        ];
      });
      const response = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surveyId: survey.id,
          occurrenceId: survey.occurrence_id,
          pdpaConsent: true,
          answers: normalized,
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "ส่งแบบสอบถามไม่สำเร็จ");
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "ส่งแบบสอบถามไม่สำเร็จ");
    } finally {
      setSubmitting(false);
    }
  }
  if (loading)
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50">
        <div className="flex items-center gap-2 text-sm font-semibold text-brand-navy">
          <Loader2 className="h-5 w-5 animate-spin" />
          กำลังโหลดแบบสอบถาม...
        </div>
      </div>
    );
  if (submitted)
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 px-4">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
          <h1 className="mt-4 text-2xl font-bold text-brand-navy">ขอบคุณสำหรับการประเมิน</h1>
          <p className="mt-2 text-sm text-slate-600">ระบบบันทึกคำตอบลงฐานข้อมูลกลางเรียบร้อยแล้ว</p>
        </div>
      </div>
    );
  if (!survey)
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <header className="rounded-2xl bg-brand-navy p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">
              Mahidol Lampang · Survey
            </p>
            <h1 className="mt-2 text-2xl font-bold">เลือกแบบประเมินกิจกรรม</h1>
          </header>
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            {available.length === 0 ? (
              <p className="text-sm text-slate-500">ขณะนี้ยังไม่มีแบบสอบถามที่เปิดรับคำตอบ</p>
            ) : (
              <div className="space-y-2">
                {available.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => void loadSurvey(item.id)}
                    className="block w-full rounded-xl border border-slate-200 p-4 text-left hover:bg-slate-50"
                  >
                    <p className="font-semibold text-brand-navy">{item.title || "แบบประเมินกิจกรรม"}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.anonymous ? "Anonymous" : "Identified"}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    );
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <header className="rounded-2xl bg-brand-navy p-6 text-white shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">
            Mahidol Lampang · Survey
          </p>
          <h1 className="mt-2 text-2xl font-bold">{survey.title || "แบบประเมินกิจกรรม"}</h1>
          <p className="mt-2 text-sm leading-6 text-white/80">
            {survey.welcome_text || "ขอความร่วมมือในการประเมินกิจกรรม"}
          </p>
          {isShellacSurvey && (
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/75">
              <span className="rounded-full bg-white/10 px-3 py-1">วันศุกร์ที่ 18 ธันวาคม 2569</span>
              <span className="rounded-full bg-white/10 px-3 py-1">ใช้เวลาประมาณ 5–8 นาที</span>
              <span className="rounded-full bg-white/10 px-3 py-1">{survey.anonymous ? "ไม่ถามชื่อและเบอร์โทรศัพท์" : "แบบประเมินระบุตัวตน"}</span>
            </div>
          )}
        </header>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <label className="flex items-start gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4"
              />
              <span>
                {survey.anonymous
                  ? "ข้าพเจ้าได้รับทราบวัตถุประสงค์การเก็บข้อมูลเพื่อประเมินผลและปรับปรุงกิจกรรม โดยแบบประเมินนี้ไม่ถามชื่อหรือเบอร์โทรศัพท์ และยินยอมให้ใช้คำตอบเพื่อสรุปผลในภาพรวม"
                  : "ข้าพเจ้าได้รับทราบวัตถุประสงค์การเก็บข้อมูลเพื่อประเมินผลและปรับปรุงกิจกรรม และยินยอมให้ใช้ข้อมูลตามคำชี้แจงความเป็นส่วนตัวของกิจกรรมนี้"}
              </span>
            </label>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              {survey.anonymous
                ? "กรุณาไม่ระบุชื่อ เบอร์โทรศัพท์ หรือข้อมูลส่วนบุคคลของตนเองหรือบุคคลอื่นในช่องความคิดเห็น คำตอบจะถูกนำไปใช้เพื่อสรุปผลในภาพรวม"
                : "โปรดตรวจสอบคำชี้แจงความเป็นส่วนตัวของกิจกรรมก่อนส่งคำตอบ"}
            </p>
          </section>
          {survey.questions.map((q, index) => {
            const options = choiceOptions(q);
            const isNewSection = index === 0 || survey.questions[index - 1].section_key !== q.section_key;
            return (
              <div key={q.id}>
                {isNewSection && (
                  <div className="mb-2 mt-5 px-1 text-sm font-bold text-brand-navy">
                    {sectionLabels[q.section_key] ?? q.section_key}
                  </div>
                )}
              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold text-slate-800">
                  {index + 1}. {q.question_text}
                  {q.required && <span className="ml-1 text-red-600">*</span>}
                </p>
                {q.question_type === "rating" && (
                  <div className="mt-4 grid grid-cols-5 gap-2">
                    {Array.from(
                      { length: q.scale_max - q.scale_min + 1 },
                      (_, i) => q.scale_min + i,
                    ).map((score) => (
                      <label
                        key={score}
                        className="flex cursor-pointer flex-col items-center gap-1 rounded-xl border border-slate-200 p-2 text-xs hover:bg-slate-50"
                      >
                        <input
                          type="radio"
                          name={q.id}
                          checked={answers[q.id] === String(score)}
                          onChange={() => setAnswer(q, String(score))}
                        />
                        <span>{score}</span>
                      </label>
                    ))}
                  </div>
                )}
                {q.question_type === "text" && (
                  <textarea
                    value={String(answers[q.id] ?? "")}
                    onChange={(e) => setAnswer(q, e.target.value)}
                    rows={4}
                    className="dashboard-control mt-3 w-full"
                  />
                )}
                {(q.question_type === "single_choice" || q.question_type === "multi_choice") && (
                  <div className="mt-3 space-y-2">
                    {options.map((option) => (
                      <label key={option} className="flex items-center gap-2 text-sm">
                        <input
                          type={q.question_type === "multi_choice" ? "checkbox" : "radio"}
                          name={q.id}
                          value={option}
                          checked={
                            q.question_type === "multi_choice"
                              ? Array.isArray(answers[q.id]) && answers[q.id].includes(option)
                              : answers[q.id] === option
                          }
                          onChange={() =>
                            q.question_type === "multi_choice"
                              ? setAnswers((current) => {
                                  const value = current[q.id];
                                  const selected = Array.isArray(value) ? value : [];
                                  return {
                                    ...current,
                                    [q.id]: selected.includes(option)
                                      ? selected.filter((x) => x !== option)
                                      : [...selected, option],
                                  };
                                })
                              : setAnswer(q, option)
                          }
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                )}
              </section>
              </div>
            );
          })}
          {error && (
            <p
              className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              role="alert"
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting || !consent}
            className="min-h-12 w-full rounded-xl bg-brand-navy px-5 py-3 text-sm font-bold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "กำลังบันทึก..." : "ส่งแบบประเมิน"}
          </button>
        </form>
      </div>
    </main>
  );
}
