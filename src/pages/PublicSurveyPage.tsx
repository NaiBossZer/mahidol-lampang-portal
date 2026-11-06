import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
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
  const isTestMode = useMemo(
    () => new URLSearchParams(window.location.search).get("mode") === "test",
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

  const loadSurvey = useCallback(async (id: string) => {
    setLoading(true);
    setError("");
    setShowValidation(false);
    try {
      const response = await fetch(`/api/survey?surveyId=${encodeURIComponent(id)}${isTestMode ? "&mode=test" : ""}`, { credentials: "include" });
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
  }, [isTestMode]);

  useEffect(() => {
    if (isTestMode) {
      if (querySurveyId) void loadSurvey(querySurveyId);
      else { setError("ลิงก์ทดสอบไม่ถูกต้อง"); setLoading(false); }
      return;
    }
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
  }, [querySurveyId, isTestMode, loadSurvey]);

  const setAnswer = (question: SurveyQuestion, value: string) => {
    setAnswers((current) => ({ ...current, [question.id]: value }));
    setError("");
  }

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
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surveyId: survey.id,
          occurrenceId: survey.occurrence_id,
          ...(isTestMode ? { mode: "test" } : {}),
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
          <p className="mt-6 text-xs font-bold tracking-[0.16em] text-emerald-700">{isTestMode ? "TEST SUBMISSION SAVED" : "SUBMISSION COMPLETE"}</p>
          <h1 className="mt-2 text-2xl font-bold text-[#002d62]">{isTestMode ? "บันทึกผลทดสอบเรียบร้อย" : "ขอบคุณสำหรับการประเมิน"}</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-slate-600">
            {isTestMode ? "คำตอบนี้ถูกจัดเก็บในฐานข้อมูลทดสอบแยกต่างหาก ไม่ถูกรวมในผลประเมินจริง" : "ระบบบันทึกคำตอบของท่านเรียบร้อยแล้ว ขอบคุณที่สละเวลาแบ่งปันความคิดเห็นเพื่อพัฒนากิจกรรมให้ดียิ่งขึ้น"}
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
      <main className="min-h-screen bg-[#fffdf7] pb-10 text-[#183153]">
        {isTestMode && <div className="border-b border-amber-300 bg-amber-50 px-4 py-2 text-center text-xs font-bold text-amber-900">โหมดทดสอบสำหรับผู้ดูแล · คำตอบจะไม่ถูกรวมกับผลประเมินจริง</div>}
        <header className="w-full border-b-[3px] border-[#d6b34a] bg-[#102d55] text-white">
          <div className="mx-auto flex min-h-[76px] w-full max-w-[560px] items-center justify-between gap-3 px-3 sm:px-0">
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <div className="flex shrink-0 items-center gap-1">
                <img src="/mahidol-logo.png" alt="มหาวิทยาลัยมหิดล" className="h-9 w-[68px] rounded bg-white object-contain p-1" />
                <img src="/envi-logo.jpg" alt="คณะสิ่งแวดล้อมและทรัพยากรศาสตร์" className="h-9 w-[42px] rounded bg-white object-contain p-1" />
                <img src="/social-engagement-logo.png" alt="งานพันธกิจเพื่อสังคม" className="h-9 w-[30px] rounded bg-white object-contain p-1" />
              </div>
              <div className="min-w-0 leading-tight">
                <p className="text-xs font-bold text-white sm:text-sm">งานพันธกิจเพื่อสังคม</p>
                <p className="mt-0.5 text-[9px] font-medium leading-4 text-white/90 sm:text-[10px]">คณะสิ่งแวดล้อมและทรัพยากรศาสตร์</p>
                <p className="text-[9px] leading-3 text-white/65">มหาวิทยาลัยมหิดล</p>
              </div>
            </div>
            <span className="inline-flex shrink-0 items-center gap-2 rounded-md border border-white/20 bg-white/5 px-2 py-2 text-[9px] text-white/90 sm:px-3 sm:text-[10px]">
              <ClipboardCheck className="h-3 w-3" /> ระบบแบบประเมินออนไลน์
            </span>
          </div>
        </header>

        <div className="mx-auto w-full max-w-[556px] px-3 pt-5 sm:px-0 sm:pt-7">
          <a
            href="/"
            className="mb-4 inline-flex min-h-9 items-center gap-2 rounded-md border border-[#d4dce6] bg-white px-3 py-2 text-xs font-semibold text-[#183153] transition hover:border-[#b51f43]/40 hover:bg-[#fff8f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b51f43]/20"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> กลับไปหน้าเว็บไซต์หลัก
          </a>

          <header className="overflow-hidden rounded-xl border border-[#e5e9ef] bg-white shadow-[0_5px_18px_rgba(25,45,75,0.06)]">
            <div className="border-b border-[#eee2c9] bg-[#fff8e9] px-5 py-5 sm:px-7">
              <span className="inline-flex items-center gap-2 text-[#b51f43]">
                <ClipboardCheck className="h-4 w-4" />
                <span className="text-xs font-bold tracking-wide">แบบประเมินกิจกรรม</span>
              </span>
              <h1 className="mt-3 text-xl font-bold text-[#183153] sm:text-2xl">เลือกแบบประเมิน</h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                กรุณาเลือกแบบประเมินที่ท่านต้องการตอบ ข้อมูลคำตอบจะถูกนำไปใช้เพื่อประเมินและพัฒนาการจัดกิจกรรม
              </p>
            </div>
          </header>

          <section className="mt-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
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
          <p className="mt-6 text-center text-[10px] leading-5 text-slate-400">มหาวิทยาลัยมหิดล · คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ · งานพันธกิจเพื่อสังคม</p>
        </div>
      </main>
    );
  }

  if (survey && !consent) {
    return (
      <main className="min-h-screen bg-[#fffdf7] pb-10 text-[#183153]">
        {isTestMode && <div className="border-b border-amber-300 bg-amber-50 px-4 py-2 text-center text-xs font-bold text-amber-900">โหมดทดสอบสำหรับผู้ดูแล · คำตอบจะไม่ถูกรวมกับผลประเมินจริง</div>}
        <header className="w-full border-b-[3px] border-[#d6b34a] bg-[#102d55] text-white">
          <div className="mx-auto flex min-h-[76px] w-full max-w-[560px] items-center justify-between gap-3 px-3 sm:px-0">
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <div className="flex shrink-0 items-center gap-1">
                <img src="/mahidol-logo.png" alt="มหาวิทยาลัยมหิดล" className="h-9 w-[68px] rounded bg-white object-contain p-1" />
                <img src="/envi-logo.jpg" alt="คณะสิ่งแวดล้อมและทรัพยากรศาสตร์" className="h-9 w-[42px] rounded bg-white object-contain p-1" />
                <img src="/social-engagement-logo.png" alt="งานพันธกิจเพื่อสังคม" className="h-9 w-[30px] rounded bg-white object-contain p-1" />
              </div>
              <div className="min-w-0 leading-tight">
                <p className="text-xs font-bold text-white sm:text-sm">งานพันธกิจเพื่อสังคม</p>
                <p className="mt-0.5 text-[9px] font-medium leading-4 text-white/90 sm:text-[10px]">คณะสิ่งแวดล้อมและทรัพยากรศาสตร์</p>
                <p className="text-[9px] leading-3 text-white/65">มหาวิทยาลัยมหิดล</p>
              </div>
            </div>
            <span className="inline-flex shrink-0 items-center gap-2 rounded-md border border-white/20 bg-white/5 px-2 py-2 text-[9px] text-white/90 sm:px-3 sm:text-[10px]">
              <ClipboardCheck className="h-3 w-3" /> ระบบแบบประเมินออนไลน์
            </span>
          </div>
        </header>

        <div className="mx-auto w-full max-w-[556px] px-3 pt-8 sm:px-0 sm:pt-12">
          <section className="overflow-hidden rounded-xl border border-[#e5e9ef] bg-white shadow-[0_5px_18px_rgba(25,45,75,0.06)]">
            <div className="border-b border-[#eee2c9] bg-[#fff8e9] px-5 py-5 sm:px-7">
              <div className="flex items-center gap-2 text-[#b51f43]">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-xs font-bold tracking-wide">ก่อนเริ่มทำแบบประเมิน</span>
              </div>
              <h1 className="mt-3 text-xl font-bold text-[#183153] sm:text-2xl">การคุ้มครองข้อมูลส่วนบุคคล (PDPA)</h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">{survey.title || "แบบประเมินกิจกรรม"}</p>
            </div>

            <div className="space-y-4 px-5 py-6 sm:px-7">
              <div className="rounded-lg border border-[#e5e9ef] bg-[#fafbfc] p-4">
                <h2 className="text-sm font-semibold text-[#183153]">วัตถุประสงค์ในการใช้ข้อมูล</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  ข้อมูลที่ท่านให้ผ่านแบบประเมินนี้จะถูกใช้เพื่อการวิเคราะห์และปรับปรุงกิจกรรมตามวัตถุประสงค์ที่แจ้งไว้
                </p>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-[#e5e9ef] p-4">
                <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-[#b51f43]" />
                <p className="text-sm leading-7 text-slate-600">
                  โปรดอ่านและพิจารณาข้อความการคุ้มครองข้อมูลส่วนบุคคลก่อนดำเนินการ หากท่านยินยอมจึงกดปุ่ม “ยอมรับและเริ่มทำแบบประเมิน”
                </p>
              </div>
              {error && <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
              <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setSurvey(null);
                    setAnswers({});
                    setConsent(false);
                    setError("");
                  }}
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#d4dce6] bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  กลับไปเลือกแบบประเมิน
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConsent(true);
                    setError("");
                  }}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#b51f43] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#941934]"
                >
                  <ShieldCheck className="h-4 w-4" /> ยอมรับและเริ่มทำแบบประเมิน
                </button>
              </div>
            </div>
          </section>
          <p className="mt-5 text-center text-[10px] leading-5 text-slate-400">
            มหาวิทยาลัยมหิดล · คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ · งานพันธกิจเพื่อสังคม
          </p>
        </div>
      </main>
    );
  }

  const sectionGroups = survey.questions.reduce<Array<{ key: string; title: string; questions: SurveyQuestion[] }>>(
    (groups, question) => {
      const key = question.section_key || "general";
      let group = groups.find((item) => item.key === key);
      if (!group) {
        const sectionTitles: Record<string, string> = { opening: "พิธีเปิด", learning: "ห้องเรียนรู้", learning_room: "ห้องเรียนรู้", outcomes: "ผลที่ได้รับ", feedback: "ความคิดเห็นเพิ่มเติม", profile: "ข้อมูลทั่วไป", organization: "การจัดกิจกรรม", practice: "การฝึกปฏิบัติ", overall: "ความพึงพอใจโดยรวม" };
        group = { key, title: sectionTitles[key] || (key === "general" ? "คำถามประเมิน" : key.replace(/[_-]+/g, " ")), questions: [] };
        groups.push(group);
      }
      group.questions.push(question);
      return groups;
    },
    [],
  );

  const activityTitle = (survey as PublicSurvey & { activity_title?: string | null }).activity_title;
  const activityDate = (survey as PublicSurvey & { activity_date?: string | null }).activity_date;

  return (
    <main className="min-h-screen bg-[#fffdf7] pb-10 text-[#183153]">
        {isTestMode && <div className="border-b border-amber-300 bg-amber-50 px-4 py-2 text-center text-xs font-bold text-amber-900">โหมดทดสอบสำหรับผู้ดูแล · คำตอบจะไม่ถูกรวมกับผลประเมินจริง</div>}
      <header className="w-full border-b-[3px] border-[#d6b34a] bg-[#102d55] text-white">
        <div className="mx-auto flex min-h-[76px] w-full max-w-[560px] items-center justify-between gap-3 px-3 sm:px-0">
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <div className="flex shrink-0 items-center gap-1">
              <img src="/mahidol-logo.png" alt="มหาวิทยาลัยมหิดล" className="h-9 w-[68px] rounded bg-white object-contain p-1" />
              <img src="/envi-logo.jpg" alt="คณะสิ่งแวดล้อมและทรัพยากรศาสตร์" className="h-9 w-[42px] rounded bg-white object-contain p-1" />
              <img src="/social-engagement-logo.png" alt="งานพันธกิจเพื่อสังคม" className="h-9 w-[30px] rounded bg-white object-contain p-1" />
            </div>
            <div className="min-w-0 leading-tight">
              <p className="text-xs font-bold text-white sm:text-sm">งานพันธกิจเพื่อสังคม</p>
              <p className="mt-0.5 text-[9px] font-medium leading-4 text-white/90 sm:text-[10px]">คณะสิ่งแวดล้อมและทรัพยากรศาสตร์</p>
              <p className="text-[9px] leading-3 text-white/65">มหาวิทยาลัยมหิดล</p>
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 rounded-md border border-white/20 bg-white/5 px-2 py-2 text-[9px] text-white/90 sm:px-3 sm:text-[10px]">
            <ClipboardCheck className="h-3 w-3" /> ระบบแบบประเมินออนไลน์
          </span>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[556px] px-3 pt-7 sm:px-0 sm:pt-12">
        <div className="overflow-hidden rounded-[9px] border border-[#e8e3d8] bg-white shadow-[0_5px_18px_rgba(25,45,75,0.06)]">
          <div className="grid min-h-[102px] grid-cols-1 sm:grid-cols-[1.8fr_1fr]">
            <div className="border-l-[4px] border-[#b51f43] px-4 py-4 sm:px-5">
              <p className="text-[9px] font-bold tracking-wide text-[#b51f43]">แบบประเมินกิจกรรม</p>
              <h1 className="mt-2 text-[17px] font-semibold leading-6 text-[#12345b]">{survey.title || "แบบประเมินกิจกรรม"}</h1>
              <p className="mt-1 text-[10px] leading-4 text-slate-500">
                {survey.welcome_text || "แบบประเมินเพื่อรับฟังความคิดเห็นและนำไปพัฒนาการจัดกิจกรรมให้มีประสิทธิภาพยิ่งขึ้น"}
              </p>
            </div>
            <div className="border-t border-[#eee4d0] bg-[#fff8e9] px-4 py-4 sm:border-l sm:border-t-0">
              <p className="flex items-center gap-2 text-[10px] font-bold text-[#b51f43]">
                <ClipboardCheck className="h-3.5 w-3.5" /> กิจกรรม
              </p>
              <p className="mt-2 text-[11px] font-semibold leading-5 text-[#183153]">{activityTitle || "ข้อมูลกิจกรรม"}</p>
              {activityDate && <p className="mt-1 text-[9px] text-slate-500">{activityDate}</p>}
              <p className="mt-1 text-[9px] text-slate-400">ใช้เวลาประมาณ 3–5 นาที · {questionCount} คำถาม</p>
            </div>
          </div>
        </div>

        <section className="mt-3 flex items-start gap-3 rounded-[9px] border border-[#eee2c9] bg-[#fff8e9] px-3 py-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-[#f0dfbd] bg-white text-[#b51f43]">
            <ClipboardCheck className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h2 className="text-[11px] font-semibold text-[#183153]">ยินดีต้อนรับสู่แบบประเมิน</h2>
            <p className="mt-1 text-[9px] leading-4 text-slate-500">
              กรุณาตอบคำถามตามความคิดเห็นของท่าน ข้อมูลคำตอบจะถูกเก็บเป็นความลับและใช้เพื่อการพัฒนากิจกรรมเท่านั้น
            </p>
          </div>
        </section>

        <section className="mt-3 rounded-[9px] border border-[#dce3ec] bg-white px-3 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[9px] font-semibold text-[#183153]">ความคืบหน้า</p>
              <p className="mt-1 text-[8px] text-slate-400">ตอบแล้ว {answeredCount} จาก {questionCount} ข้อ</p>
            </div>
            <div className="flex min-w-0 flex-1 items-center gap-3 pl-3">
              <div className="h-[5px] flex-1 overflow-hidden rounded-full bg-[#edf1f5]" role="progressbar" aria-label="ความคืบหน้าการตอบแบบประเมิน" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
                <div className="h-full rounded-full bg-[#b51f43] transition-all" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-[9px] font-bold tabular-nums text-[#b51f43]">{progress}%</span>
            </div>
          </div>
        </section>

        <form onSubmit={submit} className="mt-4 space-y-4">
          {sectionGroups.map((group) => (
            <section key={group.key}>
              <div className="mb-2 flex items-center gap-2">
                <h2 className="shrink-0 text-[10px] font-bold text-[#b51f43]">{group.title}</h2>
                <div className="h-px flex-1 bg-[#e8e2d9]" />
              </div>
              <div className="space-y-3">
                {group.questions.map((question) => {
                  const options = choiceOptions(question);
                  const missing = showValidation && missingQuestionIds.has(question.id);
                  return (
                    <section
                      role="group"
                      aria-labelledby={`question-title-${question.id}`}
                      key={question.id}
                      id={`survey-question-${question.id}`}
                      className={`rounded-[9px] border bg-white px-3 py-3 shadow-[0_2px_8px_rgba(25,45,75,0.025)] ${missing ? "border-red-300 ring-2 ring-red-100" : "border-[#e0e6ed]"}`}
                      aria-describedby={missing ? `question-error-${question.id}` : undefined}
                    >
                      <div className="flex items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 id={`question-title-${question.id}`} className="text-[10px] font-semibold leading-5 text-[#183153]">
                            {question.order_index}. {question.question_text}{question.required && <span className="ml-1 text-[#b51f43]">*</span>}
                          </h3>
                          {question.question_type === "rating" && (
                            <>
                              <div className="mt-2 flex items-center justify-between text-[8px] text-slate-400">
                                <span>น้อยที่สุด</span><span>มากที่สุด</span>
                              </div>
                              <div className="mt-1 flex flex-wrap gap-1.5">
                                {Array.from({ length: Math.max(0, question.scale_max - question.scale_min + 1) }, (_, i) => question.scale_min + i).map((score) => (
                                  <label key={score} className="cursor-pointer">
                                    <input
                                      type="radio"
                                      name={question.id}
                                      value={score}
                                      checked={answers[question.id] === String(score)}
                                      onChange={() => setAnswer(question, String(score))}
                                      className="peer sr-only"
                                    />
                                    <span className="grid h-8 w-10 place-items-center rounded-[5px] border border-[#d4dce6] bg-white text-[10px] font-medium text-[#183153] transition peer-checked:border-[#b51f43] peer-checked:bg-[#b51f43] peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-[#b51f43]/20">
                                      {score}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </>
                          )}
                          {question.question_type === "text" && (
                            <textarea
                              value={String(answers[question.id] ?? "")}
                              onChange={(event) => setAnswer(question, event.target.value)}
                              rows={3}
                              placeholder="พิมพ์ความคิดเห็นหรือข้อเสนอแนะของท่าน..."
                              className="mt-2 w-full rounded-md border border-[#d4dce6] bg-white px-3 py-2 text-[11px] leading-5 outline-none focus:border-[#b51f43] focus:ring-2 focus:ring-[#b51f43]/10"
                            />
                          )}
                          {(question.question_type === "single_choice" || question.question_type === "multi_choice") && (
                            <div className="mt-2 grid gap-2 sm:grid-cols-2">
                              {options.map((option) => {
                                const current = answers[question.id];
                                const selected = question.question_type === "multi_choice"
                                  ? Array.isArray(current) && current.includes(option)
                                  : current === option;
                                return (
                                  <label key={option} className="flex cursor-pointer items-center gap-2 rounded-md border border-[#d4dce6] px-3 py-2 text-[10px] text-slate-700 has-[:checked]:border-[#b51f43] has-[:checked]:bg-[#fff8f9]">
                                    <input
                                      type={question.question_type === "multi_choice" ? "checkbox" : "radio"}
                                      name={question.id}
                                      value={option}
                                      checked={selected}
                                      onChange={() => {
                                        if (question.question_type === "multi_choice") {
                                          setError("");
                                          setAnswers((currentAnswers) => {
                                            const value = currentAnswers[question.id];
                                            const selectedOptions = Array.isArray(value) ? value : [];
                                            return {
                                              ...currentAnswers,
                                              [question.id]: selectedOptions.includes(option)
                                                ? selectedOptions.filter((item) => item !== option)
                                                : [...selectedOptions, option],
                                            };
                                          });
                                        } else {
                                          setAnswer(question, option);
                                        }
                                      }}
                                      className="h-3.5 w-3.5 shrink-0 accent-[#b51f43]"
                                    />
                                    <span>{option}</span>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                          {missing && <p id={`question-error-${question.id}`} className="mt-2 text-[9px] font-medium text-red-600">กรุณาตอบคำถามนี้</p>}
                        </div>
                      </div>
                    </section>
                  );
                })}
              </div>
            </section>
          ))}

          {error && <p className="rounded-md border border-red-200 bg-red-50 p-3 text-[10px] text-red-700" role="alert">{error}</p>}

          <section className="flex flex-col gap-3 rounded-[9px] border border-[#e0e6ed] bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold text-[#183153]">ตรวจสอบคำตอบก่อนส่ง</p>
              <p className="mt-1 text-[9px] text-slate-500">ตอบแล้ว {answeredCount} จาก {questionCount} ข้อ</p>
            </div>
            <button
              type="submit"
              disabled={submitting || !consent}
              className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md bg-[#b51f43] px-5 py-2 text-[10px] font-semibold text-white transition hover:bg-[#941934] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {submitting ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> กำลังส่งคำตอบ...</> : "ส่งแบบประเมิน"}
            </button>
          </section>
        </form>

        <footer className="mt-6 border-t border-[#e8e2d9] pt-4 text-center text-[9px] leading-4 text-slate-400">
          มหาวิทยาลัยมหิดล · คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ · งานพันธกิจเพื่อสังคม
        </footer>
      </div>
    </main>
  );
}
