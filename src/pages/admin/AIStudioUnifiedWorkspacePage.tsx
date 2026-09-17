import { useMemo, useState } from "react";
import { Activity, Bell, Bot, FileText, Group, Settings, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import { AIStudioWorkspacePage } from "./AIStudioWorkspacePage";
import { AIStudioOutcomeWorkspacePage } from "./AIStudioOutcomeWorkspacePage";
import { AIWorkspacePage } from "./AIWorkspacePage";
import { CmsPage } from "./CmsPage";
import { OrganizationsManagementPage } from "./OrganizationsManagementPage";
import { GovernancePage } from "./GovernancePage";
import { SystemSettingsPage } from "./SystemSettingsPage";
import { useAdminAuth } from "@/components/AdminGuard";
import type { AdminPermission } from "@/auth/permissions";

type ModuleId = "workflow" | "documents" | "assistant" | "access" | "notifications" | "settings";
type Step = { id: number; title: string; subtitle: string; phase: 1 | 2 };
const steps: Step[] = [
  { id: 1, title: "Activity Brief", subtitle: "บริบทกิจกรรม", phase: 1 }, { id: 2, title: "AI Analysis", subtitle: "วิเคราะห์ข้อมูล", phase: 1 }, { id: 3, title: "AI Survey", subtitle: "สร้างแบบประเมิน", phase: 1 }, { id: 4, title: "Admin Review", subtitle: "ทวนสอบ", phase: 1 }, { id: 5, title: "Confirm", subtitle: "ยืนยัน", phase: 1 },
  { id: 6, title: "Outcome Capture", subtitle: "รวบรวมผลจริง", phase: 2 }, { id: 7, title: "AI Outcome Report", subtitle: "สังเคราะห์รายงาน", phase: 2 }, { id: 8, title: "Publish Review", subtitle: "ตรวจสอบก่อนเผยแพร่", phase: 2 }, { id: 9, title: "Publish & Close", subtitle: "เผยแพร่และปิดงาน", phase: 2 },
];
const modules: Array<{ id: ModuleId; label: string; description: string; icon: typeof Bot; permission: AdminPermission }> = [
  { id: "workflow", label: "9-Step Workflow", description: "Activity → Outcome → Publish", icon: Workflow, permission: "ai.command.read" },
  { id: "documents", label: "คลังเอกสารราชการ", description: "Official Documents Repository", icon: FileText, permission: "cms.read" },
  { id: "assistant", label: "AI Assistant Studio", description: "Command · Queue · Execution · Approval", icon: Bot, permission: "ai.command.read" },
  { id: "access", label: "ผู้ใช้งาน & สิทธิ์", description: "Users · Organizations · Access", icon: Group, permission: "overview.read" },
  { id: "notifications", label: "การแจ้งเตือน", description: "Governance · Notifications", icon: Bell, permission: "system.read" },
  { id: "settings", label: "ตั้งค่าระบบ", description: "System Configuration", icon: Settings, permission: "system.read" },
];
function StepRail({ active, onSelect }: { active: number; onSelect: (step: number) => void }) {
  return <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4"><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-sky-200">Unified Workflow</p><p className="text-xs font-semibold text-white">Phase 1 · Activity & AI Survey <span className="mx-1 text-white/30">→</span> Phase 2 · Outcome & Publication</p></div><span className="rounded-full bg-violet-500/20 px-2.5 py-1 text-[10px] font-bold text-violet-100">9 STEPS</span></div><div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-9">{steps.map((step) => { const done = step.id < active; const selected = step.id === active; return <button key={step.id} type="button" onClick={() => onSelect(step.id)} className={`min-w-0 rounded-xl border p-2 text-left transition ${selected ? "border-sky-300/50 bg-white text-[#002d62] shadow-sm" : done ? "border-emerald-300/20 bg-emerald-400/10 text-white" : "border-white/10 bg-white/5 text-blue-100 hover:bg-white/10"}`}><div className="flex items-center gap-2"><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${selected ? "bg-[#002d62] text-white" : done ? "bg-emerald-400/20 text-emerald-200" : "bg-white/10 text-white/70"}`}>{done ? "✓" : step.id}</span><span className="min-w-0 truncate text-[10px] font-bold">{step.title}</span></div><p className={`mt-1 truncate pl-9 text-[9px] ${selected ? "text-violet-600" : "text-blue-100/60"}`}>{step.subtitle}</p></button>; })}</div></div>;
function ModuleCard({ active, onSelect, items }: { active: ModuleId; onSelect: (id: ModuleId) => void; items: typeof modules }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"><div className="flex gap-2 overflow-x-auto" role="tablist" aria-label="AI Studio functions">{items.map((module) => { const Icon = module.icon; const selected = module.id === active; return <button key={module.id} type="button" role="tab" aria-selected={selected} onClick={() => onSelect(module.id)} className={`min-w-[180px] rounded-xl px-3 py-2.5 text-left transition ${selected ? "bg-[#002d62] text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}><div className="flex items-center gap-2"><Icon className="h-4 w-4 shrink-0" /><span className="truncate text-xs font-bold">{module.label}</span></div><p className={`mt-1 truncate text-[10px] ${selected ? "text-blue-100" : "text-slate-400"}`}>{module.description}</p></button>; })}</div></div>;
}
export function AIStudioUnifiedWorkspacePage() {
  const { role, permissions } = useAdminAuth();
  const [module, setModule] = useState<ModuleId>("workflow");
  const [activeStep, setActiveStep] = useState(1);
  const visibleModules = useMemo(() => modules.filter((item) => role === "SUPER_ADMIN" || permissions.includes(item.permission)), [role, permissions]);
  const activeModule = visibleModules.some((item) => item.id === module) ? module : (visibleModules[0]?.id ?? "workflow");
  function selectStep(step: number) { setActiveStep(step); setModule("workflow"); }
  return <section className="min-h-[calc(100vh-4rem)] bg-[#f8f9ff] px-4 py-5 sm:px-6 lg:px-8"><div className="mx-auto max-w-[1400px] space-y-5">
    <header className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#002d62] via-[#0c2340] to-[#00152f] text-white shadow-sm"><div className="px-5 py-6 sm:px-7 sm:py-7"><div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-sky-100"><Sparkles className="h-3.5 w-3.5 text-sky-300" /> AI STUDIO · UNIFIED WORKSPACE</div><h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">AI Studio Workspace</h1><p className="mt-2 max-w-4xl text-sm leading-6 text-blue-100">ศูนย์กลางเดียวสำหรับ Workflow 9 ขั้นตอน พร้อมคลังเอกสารราชการ, AI Assistant, สิทธิ์การเข้าถึง, การแจ้งเตือน และการตั้งค่าระบบ</p></div><div className="grid grid-cols-2 gap-2 text-[10px] sm:flex sm:flex-wrap"><span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2"><ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-emerald-300" />Governance</span><span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2"><Bot className="mr-1 inline h-3.5 w-3.5 text-violet-300" />AI Execution</span><span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2"><Activity className="mr-1 inline h-3.5 w-3.5 text-sky-300" />Outcome</span><span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2"><FileText className="mr-1 inline h-3.5 w-3.5 text-amber-300" />Evidence</span></div></div><div className="mt-6"><StepRail active={activeStep} onSelect={selectStep} /></div></div></header>
    <ModuleCard active={activeModule} onSelect={setModule} items={visibleModules} />
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"><div className={activeModule === "workflow" ? "border-b border-slate-100 bg-slate-50 px-5 py-3 sm:px-6" : "hidden"}>{activeModule === "workflow" && <><p className="text-xs font-bold text-[#002d62]">Step {activeStep} / 9 · {steps[activeStep - 1].title}</p><p className="mt-0.5 text-[10px] text-slate-500">{steps[activeStep - 1].subtitle} · AI proposes · ADMIN verifies · System commits</p></>}</div>
      {activeModule === "workflow" && activeStep <= 5 && <AIStudioWorkspacePage />}
      {activeModule === "workflow" && activeStep >= 6 && <AIStudioOutcomeWorkspacePage />}
      {activeModule === "documents" && <CmsPage />}
      {activeModule === "assistant" && <AIWorkspacePage />}
      {activeModule === "access" && <OrganizationsManagementPage />}
      {activeModule === "notifications" && <GovernancePage />}
      {activeModule === "settings" && <SystemSettingsPage />}
    </div>
    <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-[11px] text-slate-500 shadow-sm sm:flex-row sm:items-center sm:justify-between"><span><strong className="text-slate-700">AI Studio Control Plane</strong> · ทุกการเปลี่ยนแปลงสำคัญต้องผ่านสิทธิ์และ Governance ที่มีอยู่</span><span className="font-semibold text-[#002d62]">AI proposes · ADMIN verifies · System commits</span></div>
  </div></section>;
}
