import { FileText, Sparkles } from "lucide-react";
import { UnifiedSurveyWorkflowShell } from "@/components/layout/UnifiedSurveyWorkflowShell";

export function UnifiedSurveyWorkflowPage() {
  return (
    <UnifiedSurveyWorkflowShell
      activeStep="docs"
      context={
        <div className="space-y-3 text-xs">
          <div className="rounded-xl border border-slate-200 p-3">
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <FileText className="h-4 w-4 text-brand-blue" />
              เอกสารโครงการ / นโยบาย
            </div>
            <p className="mt-1 text-slate-500">เลือกเอกสารเพื่อให้ AI วิเคราะห์บริบท</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 text-slate-500">
            Prototype: Context จะเชื่อมกับ Documents และ Survey ที่เลือกในขั้นถัดไป
          </div>
        </div>
      }
      assistant={
        <div className="space-y-3 text-xs">
          <div className="rounded-xl bg-violet-50 p-3 text-violet-900">
            <div className="flex items-center gap-2 font-semibold">
              <Sparkles className="h-4 w-4" />
              AI Assistant
            </div>
            <p className="mt-2 leading-5">เลือกเอกสารก่อน แล้วระบบจะพาไปขั้น Analyze เพื่อสรุปบริบทและแนะนำแนวทางสร้างแบบประเมิน</p>
          </div>
        </div>
      }
    >
      <div className="max-w-2xl">
        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">Prototype</span>
        <h2 className="mt-3 text-xl font-bold tracking-tight text-brand-navy">เริ่มสร้างแบบประเมินด้วย AI</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Workflow นี้จะรวม Documents, AI Analyze, Survey Builder, Review, Publish และ Results ไว้ใน journey เดียว
        </p>
        <div className="mt-6 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/60 p-10 text-center">
          <FileText className="mx-auto h-9 w-9 text-slate-400" />
          <h3 className="mt-3 text-sm font-bold">อัปโหลดหรือเลือกเอกสารโครงการ</h3>
          <p className="mt-1 text-xs text-slate-500">จุดนี้เป็น prototype shell ยังไม่เชื่อมการอัปโหลดจริง</p>
        </div>
      </div>
    </UnifiedSurveyWorkflowShell>
  );
}
