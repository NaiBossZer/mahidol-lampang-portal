import { Check, Circle, Loader2, ShieldCheck } from "lucide-react";

export type AIPlanStep = {
  id: string;
  title: string;
  detail?: string;
  status: "pending" | "running" | "completed";
};

export function AIExecutionPlan({ steps }: { steps: AIPlanStep[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((step, index) => {
        const completed = step.status === "completed";
        const running = step.status === "running";
        return (
          <li key={step.id} className="relative flex gap-3">
            {index < steps.length - 1 && (
              <span
                className="absolute left-4 top-8 h-[calc(100%-8px)] w-px bg-slate-200"
                aria-hidden="true"
              />
            )}
            <div
              className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border ${completed ? "border-emerald-200 bg-emerald-50 text-emerald-700" : running ? "border-brand-navy/20 bg-brand-navy text-white" : "border-slate-200 bg-white text-slate-400"}`}
            >
              {completed ? (
                <Check className="h-4 w-4" />
              ) : running ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Circle className="h-3.5 w-3.5" />
              )}
            </div>
            <div className="min-w-0 flex-1 pb-1">
              <p className="text-sm font-bold text-slate-900">{step.title}</p>
              {step.detail && <p className="mt-0.5 text-xs text-slate-500">{step.detail}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function AIVerificationBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
      <ShieldCheck className="h-3 w-3" /> ตรวจสอบผลลัพธ์แล้ว
    </span>
  );
}
