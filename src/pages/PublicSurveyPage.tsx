import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  Loader2,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
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

function isAnswered(value: string | string[] | undefined): boolean {
  return Array.isArray(value) ? value.length > 0 : typeof value === "string" && value.trim().length > 0;
}

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
  const [showValidation, setShowValidation] = useState(false);

  async function loadSurvey(id: string) {
    setLoading(true);
    setError("");
    setShowValidation(false);
    try {
      const response = await fetch(`/api/survey?surveyId=${encodeURIComponent(id)}`);
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "ไม่สามารถโหลดแบบประเมินได้");
      setSurvey(body.data as PublicSurvey);
      setAnswers({});
      setConsent(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "ไม่สามารถโหลดแบบประเมินได้");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetch("/api/survey")
      .then(async (r) => {
        const body = await r.json();
        if (!r.ok) throw new Error(body.error || "ไม่สามารถโหลดรายการแบบประเมินได้");
        return body.data as SurveySummary[];
      })
      .then((rows) => {
        setAvailable(rows);
        if (querySurveyId) void loadSurvey(querySurveyId);
        else setLoading(false);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "ไม่สามารถโหลดรายการแบบประเมินได้");
        setLoading(false);
      });
  }, [querySurveyId]);

  const setAnswer = (question: SurveyQuestion, value: string) =>
    setAnswers((current) => ({ ...current, [question.id]: value }));

  const answeredCount = survey
    ? survey.questions.filter((question) => isAnswered(answers[question.id])).length
    : 0;
  const questionCount = survey?.questions.length ?? 0;
  const progress = questionCount > 0 ? Math.round((answeredCount / questionCount) * 100) : 0;
  const missingQuestionIds = new Set(
    survey?.questions
      .filter((question) => question.required && !isAnswered(answers[question.id]))
      .map((question) => question.id) ?? [],
  );

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!survey) return;
    if (!consent) {
      setError("กรุณายืนยันการยอมรับข้อตกลงความเป็นส่วนตัวก่อนส่งแบบประเมิน");
      return;
    }
    const missing = survey.questions.filter(
      (question) => question.required && !isAnswered(answers[question.id]),
    );
    if (missing.length) {
      setShowValidation(true);
      setError("ยังมีคำถามที่จำเป็นที่ไม่ได้ตอบ กรุณาตรวจสอบรายการที่แจ้งไว้");
      document.getElementById(`survey-question-${missing[0].id}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const normalized = survey.questions.map((question) => {
        const value = answers[question.id];
        return question.question_type === "rating"
          ? { questionId: question.id, number: Number(value) }
          : question.question_type === "multi_choice"
            ? { questionId: question.id, options: Array.isArray(value) ? value : [String(value)] }
            : { questionId: question.id, text: String(value ?? "") };
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
      if (!response.ok) throw new Error(body.error || "ส่งแบบประเมินไม่สำเร็จ");
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "ส่งแบบประเมินไม่สำเร็จ");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f7f4] px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#002d62] text-white shadow-lg shadow-blue-950/10">
            <Loader2 className="h-6 w-6 animate-spin" />
          </span>
          <p className="text-sm font-semibold text-slate-700">กำลังเตรียมแบบประเมิน...</p>
          <p className="text-xs text-slate-500">กรุณารอสักครู่</p>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f7f4] px-4 py-10">
        <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-900/5 sm:p-10">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-10 w-10" />
          </span>
          <p className="mt-6 text-xs font-bold tracking-[0.16em] text-emerald-700">SUBMISSION COMPLETE</p>
          <h1 className="mt-2 text-2xl font-bold text-[#002d62]">ขอบคุณสำหรับการประเมิน</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-slate-600">
            ระบบบันทึกคำตอบของท่านเรียบร้อยแล้ว ขอบคุณที่สละเวลาแบ่งปันความคิดเห็นเพื่อพัฒนากิจกรรมให้ดียิ่งขึ้น
          </p>
          <div className="mt-7 rounded-2xl bg-[#f7f7f4] px-4 py-3 text-xs text-slate-500">
            ท่านสามารถปิดหน้านี้ได้
          </div>
        </section>
      </main>
    );
  }

  if (!survey) {
    return (
      <main className="min-h-screen bg-[#f7f7f4] px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <header className="overflow-hidden rounded-3xl bg-[#002d62] text-white shadow-lg shadow-blue-950/10">
            <div className="border-b border-white/10 px-6 py-5 sm:px-8">
              <p className="text-xs font-semibold tracking-[0.14em] text-blue-200">MAHIDOL UNIVERSITY</p>
              <p className="mt-1 text-xs text-white/70">คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ · งานพันธกิจเพื่อสังคม</p>
            </div>
            <div className="px-6 py-8 sm:px-8 sm:py-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90">
                <ClipboardCheck className="h-4 w-4" /> แบบประเมินกิจกรรม
              </span>
              <h1 className="mt-4 text-2xl font-bold sm:text-3xl">เลือกแบบประเมิน</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/75">
                กรุณาเลือกแบบประเมินที่ท่านต้องการตอบ ข้อมูลคำตอบจะถูกนำไปใช้เพื่อประเมินและพัฒนาการจัดกิจกรรม
              </p>
            </div>
            <div className="h-1.5 bg-[#a51f3a]" />
          </header>

          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">แบบประเมินที่เปิดรับคำตอบ</h2>
                <p className="mt-1 text-xs text-slate-500">{available.length} รายการ</p>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#f9edf0] text-[#a51f3a]">
                <ClipboardCheck className="h-5 w-5" />
              </span>
            </div>
            {error && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
              </div>
            )}
            {available.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
                <ClipboardCheck className="mx-auto h-8 w-8 text-slate-400" />
                <p className="mt-3 text-sm font-semibold text-slate-700">ขณะนี้ยังไม่มีแบบประเมินที่เปิดรับคำตอบ</p>
                <p className="mt-1 text-xs text-slate-500">กรุณากลับมาตรวจสอบอีกครั้งภายหลัง</p>
              </div>
            ) : (
              <div className="space-y-3">
                {available.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => void loadSurvey(item.id)}
                    className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-[#a51f3a]/40 hover:bg-[#fffafb] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#a51f3a]/10 sm:p-5"
                  >
                    <span className="min-w-0">
                      <span className="block font-semibold text-slate-900 group-hover:text-[#8f1831]">{item.title || "แบบประเมินกิจกรรม"}</span>
                      <span className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-slate-500">
                        <LockKeyhole className="h-3.5 w-3.5" /> {item.anonymous ? "ไม่ระบุตัวตน" : "มีการระบุตัวตน"}
                      </span>
                    </span>
                    <span className="shrink-0 rounded-full bg-[#f9edf0] px-3 py-1.5 text-xs font-semibold text-[#8f1831]">เริ่มตอบ</span>
                  </button>
                ))}
              </div>
            )}
          </section>
          <p className="mt-6 text-center text-[11px] text-slate-400">มหาวิทยาลัยมหิดล · คณะสิ่งแวดล้อมและทรัพยากรศาสตร์</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f4] px-3 py-5 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <header className="overflow-hidden rounded-3xl bg-[#002d62] text-white shadow-lg shadow-blue-950/10">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4 sm:px-7">
            <div>
              <p className="text-[10px] font-bold tracking-[0.16em] text-blue-200 sm:text-xs">MAHIDOL UNIVERSITY</p>
              <p className="mt-1 text-[11px] text-white/70 sm:text-xs">คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ · งานพันธกิจเพื่อสังคม</p>
            </div>
            <span className="hidden rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/90 sm:inline-flex">
              แบบประเมินกิจกรรม
            </span>
          </div>
          <div className="px-5 py-7 sm:px-7 sm:py-9">
            <button
              type="button"
              onClick={() => {
                setSurvey(null);
                setAnswers({});
                setConsent(false);
                setError("");
                setShowValidation(false);
              }}
              className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-white/75 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> กลับไปเลือกรายการ
            </button>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/90">
                แบบประเมิน
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/90">
                {survey.anonymous ? "ไม่ระบุตัวตน" : "มีการระบุตัวตน"}
              </span>
            </div>
            <h1 className="mt-4 text-2xl font-bold leading-snug sm:text-3xl">{survey.title || "แบบประเมินกิจกรรม"}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75">
              {survey.welcome_text || "ขอความร่วมมือในการตอบแบบประเมินกิจกรรม เพื่อใช้เป็นข้อมูลในการพัฒนาและปรับปรุงการดำเนินงาน"}
            </p>
          </div>
          <div className="h-1.5 bg-[#a51f3a]" />
        </header>

        <section className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-slate-800">ความคืบหน้าการตอบ</p>
              <p className="mt-1 text-[11px] text-slate-500">ตอบแล้ว {answeredCount} จาก {questionCount} ข้อ</p>
            </div>
            <span className="text-lg font-bold tabular-nums text-[#8f1831]">{progress}%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label="ความคืบหน้าการตอบแบบประเมิน" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
            <div className="h-full rounded-full bg-[#a51f3a] transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </section>

        <form onSubmit={submit} className="mt-4 space-y-4">
          <section className="rounded-2xl border border-[#eadfe1] bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#f9edf0] text-[#8f1831]">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-bold text-slate-900">การคุ้มครองข้อมูลส่วนบุคคล</h2>
                <p className="mt-1 text-xs leading-6 text-slate-600">
                  โปรดอ่านและยืนยันความยินยอมก่อนส่งแบบประเมิน ข้อมูลจะถูกใช้เพื่อการวิเคราะห์และปรับปรุงกิจกรรมตามวัตถุประสงค์ที่แจ้งไว้
                </p>
                <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                  <LockKeyhole className="h-3 w-3" /> รูปแบบการเก็บข้อมูล: {survey.anonymous ? "ไม่ระบุตัวตน" : "ระบุตัวตน"}
                </p>
              </div>
            </div>
            <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs leading-6 text-slate-700 transition hover:border-[#a51f3a]/30">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 accent-[#8f1831]"
              />
              <span>ข้าพเจ้ายอมรับข้อตกลงความเป็นส่วนตัวและยินยอมให้ใช้ข้อมูลเพื่อการวิเคราะห์และปรับปรุงกิจกรรม</span>
            </label>
            {!consent && error.includes("ความเป็นส่วนตัว") && (
              <p className="mt-2 text-xs font-medium text-red-600" role="alert">กรุณายืนยันความยินยอมก่อนดำเนินการต่อ</p>
            )}
          </section>

          {survey.questions.map((question, index) => {
            const options = choiceOptions(question);
            const missing = showValidation && missingQuestionIds.has(question.id);
            return (
              <fieldset
                key={question.id}
                id={`survey-question-${question.id}`}
                className={`rounded-2xl border bg-white p-4 shadow-sm transition sm:p-5 ${missing ? "border-red-300 ring-2 ring-red-100" : "border-slate-200"}`}
                aria-describedby={missing ? `question-error-${question.id}` : undefined}
              >
                <div className="flex items-start gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#f9edf0] text-xs font-bold text-[#8f1831]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <legend className="text-sm font-semibold leading-6 text-slate-900">{question.question_text}</legend>
                      {question.required ? (
                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-700">จำเป็น</span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">ไม่บังคับ</span>
                      )}
                    </div>
                    {question.question_type === "rating" && (
                      <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(2.75rem,1fr))] gap-2">
                        {Array.from(
                          { length: Math.max(0, question.scale_max - question.scale_min + 1) },
                          (_, i) => question.scale_min + i,
                        ).map((score) => (
                          <label key={score} className="group cursor-pointer">
                            <input
                              type="radio"
                              name={question.id}
                              value={score}
                              checked={answers[question.id] === String(score)}
                              onChange={() => setAnswer(question, String(score))}
                              className="peer sr-only"
                              required={question.required}
                            />
                            <span className="grid min-h-12 place-items-center rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition group-hover:border-[#a51f3a]/40 group-hover:bg-[#fffafb] peer-checked:border-[#8f1831] peer-checked:bg-[#8f1831] peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-[#a51f3a]/15">
                              {score}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                    {question.question_type === "rating" && (
                      <div className="mt-2 flex justify-between text-[10px] text-slate-400">
                        <span>คะแนนต่ำสุด {question.scale_min}</span>
                        <span>คะแนนสูงสุด {question.scale_max}</span>
                      </div>
                    )}
                    {question.question_type === "text" && (
                      <textarea
                        value={String(answers[question.id] ?? "")}
                        onChange={(event) => setAnswer(question, event.target.value)}
                        rows={4}
                        placeholder="พิมพ์ความคิดเห็นหรือข้อเสนอแนะของท่าน..."
                        required={question.required}
                        className="mt-4 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#a51f3a]/60 focus:bg-white focus:ring-4 focus:ring-[#a51f3a]/10"
                      />
                    )}
                    {(question.question_type === "single_choice" || question.question_type === "multi_choice") && (
                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        {options.map((option) => {
                          const selected = question.question_type === "multi_choice"
                            ? Array.isArray(answers[question.id]) && answers[question.id].includes(option)
                            : answers[question.id] === option;
                          return (
                            <label key={option} className="group flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 transition hover:border-[#a51f3a]/40 hover:bg-[#fffafb] has-[:checked]:border-[#a51f3a] has-[:checked]:bg-[#fff6f7]">
                              <input
                                type={question.question_type === "multi_choice" ? "checkbox" : "radio"}
                                name={question.id}
                                value={option}
                                checked={selected}
                                required={question.required && question.question_type === "single_choice"}
                                onChange={() => {
                                  if (question.question_type === "multi_choice") {
                                    setAnswers((current) => {
                                      const value = current[question.id];
                                      const selectedOptions = Array.isArray(value) ? value : [];
                                      return {
                                        ...current,
                                        [question.id]: selectedOptions.includes(option)
                                          ? selectedOptions.filter((item) => item !== option)
                                          : [...selectedOptions, option],
                                      };
                                    });
                                  } else {
                                    setAnswer(question, option);
                                  }
                                }}
                                className="h-4 w-4 shrink-0 accent-[#8f1831]"
                              />
                              <span>{option}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                    {missing && (
                      <p id={`question-error-${question.id}`} className="mt-3 flex items-center gap-1.5 text-xs font-medium text-red-600">
                        <AlertCircle className="h-3.5 w-3.5" /> กรุณาตอบคำถามนี้
                      </p>
                    )}
                  </div>
                </div>
              </fieldset>
            );
          })}

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700" role="alert">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
            </div>
          )}

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">ตรวจสอบคำตอบก่อนส่ง</p>
                <p className="mt-1 text-xs text-slate-500">ตอบแล้ว {answeredCount} จาก {questionCount} ข้อ · {progress}%</p>
              </div>
              <button
                type="submit"
                disabled={submitting || !consent}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#8f1831] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#741329] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#a51f3a]/20 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
              >
                {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> กำลังส่งคำตอบ...</> : <><ClipboardCheck className="h-4 w-4" /> ส่งแบบประเมิน</>}
              </button>
            </div>
            {!consent && <p className="mt-2 text-[11px] text-slate-400">กรุณายืนยันข้อตกลงความเป็นส่วนตัวเพื่อเปิดใช้งานปุ่มส่ง</p>}
          </section>
        </form>

        <footer className="px-3 py-6 text-center">
          <p className="text-[11px] font-medium text-slate-500">มหาวิทยาลัยมหิดล · คณะสิ่งแวดล้อมและทรัพยากรศาสตร์</p>
          <p className="mt-1 text-[10px] text-slate-400">งานพันธกิจเพื่อสังคม · ระบบแบบประเมินกิจกรรม</p>
        </footer>
      </div>
    </main>
  );
}
