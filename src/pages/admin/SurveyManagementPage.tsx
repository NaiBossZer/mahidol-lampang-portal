import { useEffect, useState } from "react";
import { Plus, RefreshCw, Save } from "lucide-react";
import { toast } from "sonner";
import { getAdminOccurrences, type ActivityOccurrence } from "@/services/admin-occurrences";
import { createAdminQuestion, createAdminSurvey, getAdminSurveys, updateAdminSurvey, type AdminSurvey } from "@/services/admin-surveys";

export function SurveyManagementPage() {
  const [occurrences, setOccurrences] = useState<ActivityOccurrence[]>([]);
  const [surveys, setSurveys] = useState<AdminSurvey[]>([]);
  const [occurrenceId, setOccurrenceId] = useState("");
  const [selected, setSelected] = useState<AdminSurvey | null>(null);
  const [questionText, setQuestionText] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const activities = await (await fetch("/api/admin/activities", { credentials: "include" })).json();
      const all: ActivityOccurrence[] = [];
      for (const activity of (activities.data ?? []).slice(0, 50)) {
        const rows = await getAdminOccurrences(String(activity.id));
        all.push(...rows.filter((x) => !["cancelled", "archived"].includes(x.status)));
      }
      setOccurrences(all);
      const data = await getAdminSurveys();
      setSurveys(data);
      if (!selected && data[0]) setSelected(data[0]);
    } catch (e) { toast.error(e instanceof Error ? e.message : "โหลดข้อมูลไม่สำเร็จ"); }
    finally { setLoading(false); }
  }

  useEffect(() => { void load(); }, []);

  async function createSurvey() {
    if (!occurrenceId) { toast.error("กรุณาเลือกรอบกิจกรรม"); return; }
    try {
      const survey = await createAdminSurvey({ occurrenceId, enabled: true, anonymous: false, openAt: null, closeAt: null, welcomeText: "ขอความร่วมมือประเมินกิจกรรม" });
      setSurveys((items) => [survey, ...items]); setSelected(survey); toast.success("สร้างแบบสอบถามแล้ว");
    } catch (e) { toast.error(e instanceof Error ? e.message : "สร้างแบบสอบถามไม่สำเร็จ"); }
  }

  async function addQuestion() {
    if (!selected || !questionText.trim()) { toast.error("กรุณาระบุคำถาม"); return; }
    try {
      const question = await createAdminQuestion({ surveyId: selected.id, section_key: "general", question_text: questionText.trim(), question_type: "rating", required: true, order_index: selected.questions.length, options: [], scale_min: 1, scale_max: 5 });
      setSelected({ ...selected, questions: [...selected.questions, question] }); setQuestionText(""); toast.success("เพิ่มคำถามแล้ว");
    } catch (e) { toast.error(e instanceof Error ? e.message : "เพิ่มคำถามไม่สำเร็จ"); }
  }

  async function toggleAnonymous() {
    if (!selected) return;
    try { const updated = await updateAdminSurvey(selected.id, { anonymous: !selected.anonymous }); setSelected({ ...selected, ...updated }); setSurveys((items) => items.map((x) => x.id === selected.id ? { ...x, ...updated } : x)); toast.success(updated.anonymous ? "ตั้งเป็น Anonymous แล้ว" : "ตั้งเป็น Identified แล้ว"); }
    catch (e) { toast.error(e instanceof Error ? e.message : "บันทึกไม่สำเร็จ"); }
  }

  return <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">Survey Management</p><h1 className="mt-1 text-2xl font-bold text-brand-navy lg:text-3xl">แบบสอบถามและ Question Builder</h1><p className="mt-1 text-sm text-slate-600">สร้างแบบสอบถามแยกตามรอบกิจกรรม และเพิ่มคำถามโดยไม่ต้องแก้โครงสร้างฐานข้อมูล</p></div><button type="button" onClick={() => void load()} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-brand-navy"><RefreshCw className="h-4 w-4"/>รีเฟรช</button></div>
    <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1.5fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-bold text-brand-navy">แบบสอบถาม</h2><div className="mt-4 flex gap-2"><select value={occurrenceId} onChange={(e) => setOccurrenceId(e.target.value)} className="dashboard-control min-w-0 flex-1"><option value="">เลือกรอบกิจกรรม</option>{occurrences.map((x) => <option key={x.id} value={x.id}>ครั้งที่ {x.occurrence_no} · {new Date(x.start_at).toLocaleDateString("th-TH")}</option>)}</select><button type="button" onClick={() => void createSurvey()} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-navy px-4 text-sm font-bold text-white"><Plus className="h-4 w-4"/>สร้าง</button></div><div className="mt-5 space-y-2">{loading ? <p className="text-sm text-slate-500">กำลังโหลด...</p> : surveys.length === 0 ? <p className="text-sm text-slate-500">ยังไม่มีแบบสอบถาม</p> : surveys.map((x) => <button type="button" key={x.id} onClick={() => setSelected(x)} className={`block w-full rounded-xl border p-3 text-left ${selected?.id === x.id ? "border-brand-navy bg-slate-50" : "border-slate-200"}`}><div className="flex items-center justify-between"><span className="text-sm font-bold text-slate-800">รอบ {occurrences.find((o) => o.id === x.occurrence_id)?.occurrence_no ?? "-"}</span><span className="text-xs font-semibold text-emerald-700">{x.anonymous ? "Anonymous" : "Identified"}</span></div><p className="mt-1 text-xs text-slate-500">{x.questions.length} คำถาม · {x.enabled ? "เปิดใช้งาน" : "ปิดใช้งาน"}</p></button>)}</div></div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">{selected ? <><div className="flex items-center justify-between gap-3"><div><h2 className="font-bold text-brand-navy">Question Builder</h2><p className="text-xs text-slate-500">กำหนดคำถามจริงใน Supabase</p></div><button type="button" onClick={() => void toggleAnonymous()} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold">{selected.anonymous ? "Anonymous" : "Identified"}</button></div><div className="mt-5 flex gap-2"><input value={questionText} onChange={(e) => setQuestionText(e.target.value)} placeholder="พิมพ์คำถามแบบประเมินระดับ 1–5" className="dashboard-control min-w-0 flex-1"/><button type="button" onClick={() => void addQuestion()} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-navy px-4 text-sm font-bold text-white"><Save className="h-4 w-4"/>เพิ่ม</button></div><div className="mt-5 space-y-2">{selected.questions.map((q, i) => <div key={q.id} className="rounded-xl border border-slate-200 p-3"><div className="flex items-start gap-3"><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold">{i + 1}</span><div><p className="text-sm font-semibold text-slate-800">{q.question_text}</p><p className="mt-1 text-xs text-slate-500">{q.question_type} · {q.required ? "จำเป็น" : "ไม่จำเป็น"} · scale {q.scale_min}–{q.scale_max}</p></div></div></div>)}</div></> : <div className="grid min-h-72 place-items-center text-center text-sm text-slate-500">เลือกแบบสอบถามเพื่อเริ่มสร้างคำถาม</div>}</div>
    </div>
  </section>;
}
