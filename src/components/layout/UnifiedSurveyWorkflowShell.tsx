import type { ReactNode } from "react";

export const UNIFIED_SURVEY_WORKFLOW_STEPS = [
  { id: "docs", label: "เอกสารระบบ" },
  { id: "analyze", label: "วิเคราะห์ AI" },
  { id: "build", label: "สร้างคำถาม" },
  { id: "review", label: "ตรวจสอบคุณภาพ" },
  { id: "publish", label: "เผยแพร่" },
  { id: "results", label: "ผลลัพธ์ & วิเคราะห์" },
] as const;

export type UnifiedSurveyWorkflowStep = (typeof UNIFIED_SURVEY_WORKFLOW_STEPS)[number]["id"];

type UnifiedSurveyWorkflowShellProps = {
  activeStep: UnifiedSurveyWorkflowStep;
  children: ReactNode;
  context?: ReactNode;
  assistant?: ReactNode;
};

export function UnifiedSurveyWorkflowShell({ activeStep, children, context, assistant }: UnifiedSurveyWorkflowShellProps) {
  const activeIndex = UNIFIED_SURVEY_WORKFLOW_STEPS.findIndex((step) => step.id === activeStep);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="px-5 py-4">
          <h1 className="text-lg font-bold">AI Survey Workflow</h1>
          <p className="text-xs text-slate-500">สร้างแบบประเมินด้วย AI ตั้งแต่เอกสารจนถึงผลลัพธ์</p>
        </div>
        <nav className="overflow-x-auto border-t border-slate-100 px-5 py-3" aria-label="Survey workflow">
          <ol className="flex min-w-max items-center gap-3">
            {UNIFIED_SURVEY_WORKFLOW_STEPS.map((step, index) => {
              const completed = index < activeIndex;
              const current = index === activeIndex;
              return (
                <li key={step.id} className="flex items-center gap-2">
                  <span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${completed || current ? "bg-brand-navy text-white" : "bg-slate-100 text-slate-500"}`}>
                    {completed ? "✓" : index + 1}
                  </span>
                  <span className={current ? "text-xs font-bold text-brand-navy" : "text-xs text-slate-500"}>{step.label}</span>
                  {index < UNIFIED_SURVEY_WORKFLOW_STEPS.length - 1 && <span className="text-slate-300">→</span>}
                </li>
              );
            })}
          </ol>
        </nav>
      </header>

      <main className="mx-auto grid max-w-[1600px] grid-cols-1 gap-4 p-4 lg:grid-cols-[260px_minmax(0,1fr)_300px] lg:p-5">
        <aside className="hidden rounded-2xl border border-slate-200 bg-white p-4 lg:block">
          <h2 className="mb-3 text-sm font-bold">Active Context</h2>
          {context ?? <p className="text-xs text-slate-500">ยังไม่มีบริบทที่เลือก</p>}
        </aside>
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 lg:p-5">{children}</section>
        <aside className="rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-bold">AI Assistant</h2>
          {assistant ?? <p className="text-xs text-slate-500">คำแนะนำจาก AI จะแสดงตามขั้นตอนปัจจุบัน</p>}
        </aside>
      </main>
    </div>
  );
}
