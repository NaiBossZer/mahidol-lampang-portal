import { useState } from "react";
import { ArrowRight, Check, CheckCircle2, FileText, GripVertical, Plus, Sparkles, Wand2 } from "lucide-react";
import { UnifiedSurveyWorkflowShell, UNIFIED_SURVEY_WORKFLOW_STEPS, type UnifiedSurveyWorkflowStep } from "@/components/layout/UnifiedSurveyWorkflowShell";

type DraftQuestion = {
  id: string;
  text: string;
  type: "rating" | "text" | "single_choice" | "multi_choice";
  required: boolean;
};

const AI_DRAFT: DraftQuestion[] = [
  { id: "q1", text: "กิจกรรมนี้ตอบโจทย์วัตถุประสงค์ของท่านมากน้อยเพียงใด", type: "rating", required: true },
  { id: "q2", text: "ท่านพึงพอใจต่อคุณภาพการจัดกิจกรรมโดยรวมเพียงใด", type: "rating", required: true },
  { id: "q3", text: "ส่วนใดของกิจกรรมที่ท่านเห็นว่ามีประโยชน์มากที่สุด", type: "text", required: false },
];

const analysis = {
  document: "แผนยุทธศาสตร์บริการวิชาการ_โฮมสเตย์ชุมชน_ลำปาง_67.pdf",
  audience: "ผู้ประกอบการโฮมสเตย์และผู้นำชุมชนในจังหวัดลำปาง",
};

export function UnifiedSurveyWorkflowPage() {
  const [step, setStep] = useState<UnifiedSurveyWorkflowStep>("build");
  const [questions, setQuestions] = useState<DraftQuestion[]>(AI_DRAFT);
  const [editingId, setEditingId] = useState<string | null>(null);

  function updateQuestion(id: string, patch: Partial<DraftQuestion>) {
    setQuestions((items) => items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function addQuestion() {
    const id = `q-${Date.now()}`;
    setQuestions((items) => [...items, { id, text: "คำถามใหม่", type: "rating", required: true }]);
    setEditingId(id);
  }

  return (
    <UnifiedSurveyWorkflowShell
      activeStep={step}
      onStepClick={setStep}
      context={
        <div className="space-y-3 text-xs">
          <div className="rounded-xl border border-slate-200 p-3">
            <div className="flex items-center gap-2 font-semibold text-slate-800"><FileText className="h-4 w-4 text-brand-blue" /> เอกสารต้นทาง</div>
            <p className="mt-1 truncate text-slate-500">{analysis.document}</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-3">
            <p className="font-semibold text-slate-700">AI Context</p>
            <p className="mt-1 leading-5 text-slate-500">{analysis.audience}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3"><span className="font-semibold">Draft Survey</span><span className="ml-2 text-slate-500">{questions.length} คำถาม</span></div>
        </div>
      }
      assistant={
        <div className="space-y-3 text-xs">
          <div className="rounded-xl bg-violet-50 p-3 text-violet-950">
            <div className="flex items-center gap-2 font-bold"><Sparkles className="h-4 w-4" /> AI Survey Builder</div>
            <p className="mt-2 leading-5">AI สร้าง Draft จากบริบทที่วิเคราะห์แล้ว คุณยังเป็นผู้ตรวจและตัดสินใจก่อน Review และ Publish</p>
          </div>
          <button type="button" className="flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white px-3 py-2.5 font-bold text-violet-800"><Wand2 className="h-4 w-4" /> ปรับคำถามด้วย AI</button>
          <div className="rounded-xl border border-slate-200 p-3 text-slate-600">
            <p className="font-bold text-slate-800">Quality Check</p>
            <p className="mt-1">✓ มีคำถามหลัก</p><p>✓ มีคำถามบังคับ</p><p>• ตรวจ wording ก่อน Review</p>
          </div>
        </div>
      }
    >
      <div>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-brand-blue">STEP {UNIFIED_SURVEY_WORKFLOW_STEPS.findIndex((x) => x.id === step) + 1} / 6</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-brand-navy">สร้างคำถามจากผลการวิเคราะห์</h2>
            <p className="mt-1 text-sm text-slate-500">ตรวจ แก้ไข จัดลำดับ และเติมคำถามก่อนเข้าสู่ Review</p>
          </div>
          <div className="rounded-xl bg-slate-50 px-4 py-3 text-right"><p className="text-[11px] text-slate-500">Draft Questions</p><p className="text-xl font-black text-brand-navy">{questions.length}</p></div>
        </div>

        <div className="mt-6 rounded-2xl border border-violet-100 bg-violet-50/60 p-4">
          <div className="flex items-start gap-3"><div className="rounded-xl bg-white p-2 text-violet-700 shadow-sm"><Sparkles className="h-5 w-5" /></div><div><p className="text-sm font-bold text-violet-950">AI สร้าง Draft ให้แล้ว</p><p className="mt-1 text-xs leading-5 text-violet-900/70">คำถามด้านล่างมาจาก AI และยังอยู่ในสถานะ Draft</p></div></div>
        </div>

        <div className="mt-5 space-y-3">
          {questions.map((question, index) => {
            const editing = editingId === question.id;
            return <article key={question.id} className={`rounded-2xl border bg-white p-4 ${editing ? "border-brand-navy shadow-sm" : "border-slate-200"}`}>
              <div className="flex items-start gap-3">
                <GripVertical className="mt-1 h-5 w-5 shrink-0 text-slate-300" />
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">{index + 1}</div>
                <div className="min-w-0 flex-1">
                  {editing ? <div className="space-y-3">
                    <input value={question.text} onChange={(e) => updateQuestion(question.id, { text: e.target.value })} className="dashboard-control w-full" />
                    <div className="flex flex-wrap items-center gap-3">
                      <select value={question.type} onChange={(e) => updateQuestion(question.id, { type: e.target.value as DraftQuestion["type"] })} className="dashboard-control">
                        <option value="rating">Rating 1–5</option><option value="text">Text</option><option value="single_choice">Single choice</option><option value="multi_choice">Multi choice</option>
                      </select>
                      <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600"><input type="checkbox" checked={question.required} onChange={(e) => updateQuestion(question.id, { required: e.target.checked })} /> บังคับตอบ</label>
                      <button type="button" onClick={() => setEditingId(null)} className="rounded-xl bg-brand-navy px-4 py-2 text-xs font-bold text-white">บันทึก Draft</button>
                    </div>
                  </div> : <button type="button" onClick={() => setEditingId(question.id)} className="w-full text-left">
                    <p className="text-sm font-bold text-slate-900">{question.text}</p>
                    <div className="mt-2 flex gap-2 text-[11px] text-slate-500"><span className="rounded-full bg-slate-100 px-2 py-1">{question.type}</span><span className="rounded-full bg-slate-100 px-2 py-1">{question.required ? "จำเป็น" : "ไม่จำเป็น"}</span></div>
                  </button>}
                </div>
                {!editing && <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />}
              </div>
            </article>;
          })}
        </div>

        <button type="button" onClick={addQuestion} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 py-4 text-sm font-bold text-slate-600 hover:border-brand-navy hover:text-brand-navy"><Plus className="h-4 w-4" /> เพิ่มคำถาม</button>

        <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
          <button type="button" onClick={() => setStep("analyze")} className="rounded-xl border px-4 py-2.5 text-sm font-bold text-slate-600">ย้อนกลับ</button>
          <button type="button" onClick={() => setStep("review")} className="inline-flex items-center gap-2 rounded-xl bg-brand-navy px-5 py-2.5 text-sm font-bold text-white">ไปตรวจสอบคุณภาพ <ArrowRight className="h-4 w-4" /></button>
        </div>
      </div>
    </UnifiedSurveyWorkflowShell>
  );
}
