import { useState } from "react";
import { CheckCircle2, FileText, Sparkles, UploadCloud, ArrowRight, ShieldCheck, Wand2 } from "lucide-react";
import { UnifiedSurveyWorkflowShell, UNIFIED_SURVEY_WORKFLOW_STEPS, type UnifiedSurveyWorkflowStep } from "@/components/layout/UnifiedSurveyWorkflowShell";

const demoDocument = {
  name: "แผนยุทธศาสตร์บริการวิชาการ_โฮมสเตย์ชุมชน_ลำปาง_67.pdf",
  size: "4.2 MB",
  status: "พร้อมวิเคราะห์",
};

const analysis = {
  summary: "เพื่อเสริมสร้างธรรมและผู้ประกอบการโฮมสเตย์ให้มีทักษะการตลาดดิจิทัลและมาตรฐานความปลอดภัยตามบริบทชุมชนจังหวัดลำปาง",
  audience: "ผู้ประกอบการโฮมสเตย์และผู้นำชุมชนในจังหวัดลำปาง",
  topics: ["ทักษะดิจิทัลที่เพิ่มขึ้น", "มาตรฐานชุมชน", "การนำความรู้ไปปรับใช้ปรับโฮมสเตย์"],
};

export function UnifiedSurveyWorkflowPage() {
  const [step, setStep] = useState<UnifiedSurveyWorkflowStep>("docs");
  const [documentSelected, setDocumentSelected] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const activeIndex = UNIFIED_SURVEY_WORKFLOW_STEPS.findIndex((item) => item.id === step);
  const canAnalyze = documentSelected;

  const goAnalyze = () => {
    if (!canAnalyze) return;
    setAnalyzed(true);
    setStep("analyze");
  };

  const context = (
    <div className="space-y-3 text-xs">
      <div className="rounded-xl border border-slate-200 p-3">
        <div className="flex items-center gap-2 font-semibold text-slate-800">
          <FileText className="h-4 w-4 text-brand-blue" />
          เอกสารโครงการ / นโยบาย
        </div>
        <p className="mt-1 text-slate-500">{documentSelected ? demoDocument.name : "ยังไม่ได้เลือกเอกสาร"}</p>
      </div>
      {documentSelected && (
        <div className="rounded-xl bg-emerald-50 p-3 text-emerald-800">
          <div className="flex items-center gap-2 font-semibold"><CheckCircle2 className="h-4 w-4" /> Source พร้อมใช้งาน</div>
          <p className="mt-1">{demoDocument.size} • {demoDocument.status}</p>
        </div>
      )}
      {analyzed && (
        <div className="rounded-xl border border-slate-200 p-3">
          <p className="font-semibold text-slate-700">AI Context</p>
          <p className="mt-1 leading-5 text-slate-500">{analysis.audience}</p>
        </div>
      )}
    </div>
  );

  const assistant = (
    <div className="space-y-3 text-xs">
      <div className="rounded-xl bg-violet-50 p-3 text-violet-900">
        <div className="flex items-center gap-2 font-semibold"><Sparkles className="h-4 w-4" /> AI Assistant</div>
        {step === "docs" ? (
          <p className="mt-2 leading-5">เลือกเอกสารโครงการก่อน แล้ว AI จะวิเคราะห์บริบท วัตถุประสงค์ และกลุ่มเป้าหมายให้โดยอัตโนมัติ</p>
        ) : (
          <p className="mt-2 leading-5">AI วิเคราะห์เอกสารแล้ว สามารถตรวจสอบบริบทก่อนส่งต่อไปขั้นสร้างคำถาม</p>
        )}
      </div>
      {step === "analyze" && (
        <div className="rounded-xl border border-violet-200 p-3">
          <p className="font-semibold text-slate-700">หัวข้อที่ AI แนะนำ</p>
          <div className="mt-2 space-y-1.5">{analysis.topics.map((topic) => <div key={topic} className="rounded-lg bg-slate-50 px-2.5 py-2 text-slate-600">✦ {topic}</div>)}</div>
        </div>
      )}
    </div>
  );

  return (
    <UnifiedSurveyWorkflowShell activeStep={step} context={context} assistant={assistant}>
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-brand-blue">ขั้นตอนที่ {activeIndex + 1} / 6</p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-brand-navy">
                {step === "docs" ? "อัปโหลดเอกสารนโยบายและวิเคราะห์ AI" : "ผลการวิเคราะห์เอกสารเชิงลึกโดย AI"}
              </h2>
            </div>
            {documentSelected && <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">Context พร้อม</span>}
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {step === "docs" ? "เริ่มจากเอกสารจริงของโครงการ เพื่อให้ Survey ที่สร้างต่อไปมีที่มาและบริบทตรวจสอบย้อนกลับได้" : "ตรวจสอบสิ่งที่ AI เข้าใจจากเอกสารก่อนส่งต่อเข้าสู่ Survey Builder"}
          </p>
        </div>

        {step === "docs" ? (
          <div className="space-y-5">
            <button type="button" onClick={() => setDocumentSelected(true)} className="group flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 px-6 py-12 text-center transition hover:border-brand-blue hover:bg-white">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-white shadow-sm"><UploadCloud className="h-6 w-6 text-brand-blue" /></span>
              <span className="mt-4 text-sm font-bold text-slate-800">คลิกเพื่อเลือกเอกสาร หรืออัปโหลดไฟล์</span>
              <span className="mt-1 text-xs text-slate-500">รองรับ PDF, Word, Excel, JPG, PNG • สูงสุด 20MB</span>
            </button>

            {documentSelected && (
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-red-50"><FileText className="h-5 w-5 text-red-500" /></div>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-800">{demoDocument.name}</p><p className="text-xs text-slate-500">PDF • {demoDocument.size} • อัปโหลดสำเร็จ</p></div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">พร้อมวิเคราะห์</span>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
              <div className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue" /><div><p className="text-sm font-semibold text-slate-800">Traceability ตั้งแต่ต้นทาง</p><p className="mt-1 text-xs leading-5 text-slate-600">เอกสารที่เลือกจะเป็น Active Context สำหรับ AI และถูกใช้เป็นหลักฐานประกอบการสร้างแบบประเมินในขั้นถัดไป</p></div></div>
            </div>

            <button type="button" disabled={!documentSelected} onClick={goAnalyze} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-navy px-5 py-3 text-sm font-bold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto">
              <Wand2 className="h-4 w-4" /> วิเคราะห์เอกสารด้วย AI <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold text-slate-500">สรุปวัตถุประสงค์โครงการ</p>
              <p className="mt-2 text-sm leading-6 text-slate-800">{analysis.summary}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-4"><p className="text-xs text-slate-500">กลุ่มเป้าหมายที่ AI ตรวจพบ</p><p className="mt-2 text-sm font-semibold text-slate-800">{analysis.audience}</p></div>
              <div className="rounded-xl border border-slate-200 p-4"><p className="text-xs text-slate-500">หัวข้อประเมินที่แนะนำ</p><div className="mt-2 flex flex-wrap gap-2">{analysis.topics.map((topic) => <span key={topic} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">{topic}</span>)}</div></div>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"><div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" /><div><p className="text-sm font-bold text-emerald-900">AI วิเคราะห์เสร็จแล้ว</p><p className="mt-1 text-xs leading-5 text-emerald-800">Prototype นี้แสดงผลการวิเคราะห์จาก context จำลอง ยังไม่เรียก AI API จริง และยังไม่สร้าง Survey จนกว่าจะเข้าสู่ขั้น Build</p></div></div></div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => setStep("docs")} className="min-h-11 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700">กลับไปแก้เอกสาร</button>
              <button type="button" onClick={() => setStep("build")} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-navy px-5 py-3 text-sm font-bold text-white">ไปขั้นสร้างคำถาม <ArrowRight className="h-4 w-4" /></button>
            </div>
          </div>
        )}
      </div>
    </UnifiedSurveyWorkflowShell>
  );
}
