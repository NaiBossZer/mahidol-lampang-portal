import { AIExecutionPlan, AIVerificationBadge } from "@/components/ai/AIExecutionPlan";
import { AIAccessGuard } from "@/components/ai/AIAccessGuard";

const emptyPlan = [
  { id: "intent", title: "รับ Intent", detail: "รอคำสั่งจาก AI Command Center", status: "pending" as const },
  { id: "context", title: "อ่านบริบทและข้อมูล", detail: "ใช้ข้อมูลที่มีอยู่จริง ไม่คาดเดาข้อมูลที่ไม่มี", status: "pending" as const },
  { id: "permission", title: "ตรวจสิทธิ์และขอบเขต", detail: "AdminGuard + RBAC ของ Portal", status: "pending" as const },
  { id: "execute", title: "ดำเนินการผ่าน Tool Registry", detail: "รอการเชื่อม AI backend", status: "pending" as const },
  { id: "verify", title: "ตรวจสอบผลลัพธ์", detail: "แสดงผลเมื่อ execution เกิดขึ้นจริง", status: "pending" as const },
];

export function AIExecutionPage() {
  return <AIAccessGuard permission="ai.execution.read"><section className="min-h-[calc(100vh-4rem)] bg-[#f8f9ff] px-4 py-5 sm:px-6 lg:px-8"><div className="mx-auto max-w-[1280px]"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#3f5f8f]">LIVE EXECUTION</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-[#002d62] sm:text-[28px]">แผนและการทำงานของ AI</h1><p className="mt-1 text-sm text-slate-600">มองเห็นทุกขั้นตอนของงาน ตั้งแต่ Intent จนถึง Verification</p></div><AIVerificationBadge /></div><div className="mt-5 grid gap-3 lg:grid-cols-[1.35fr_.65fr]"><div className="rounded-xl border border-[#c4c6d1] bg-white p-5 shadow-sm"><div className="mb-5 flex items-center justify-between gap-3 border-b border-slate-100 pb-4"><div><p className="text-[10px] font-bold tracking-[0.12em] text-slate-400">CURRENT EXECUTION</p><p className="mt-1 text-sm font-bold text-slate-900">ยังไม่มี Execution ที่เชื่อมกับ AI backend</p></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">WAITING</span></div><AIExecutionPlan steps={emptyPlan} /></div><div className="rounded-xl border border-[#c4c6d1] bg-white p-5 shadow-sm"><h2 className="text-sm font-bold text-slate-900">Execution boundary</h2><div className="mt-4 space-y-3 text-xs leading-5 text-slate-600"><p>AI ไม่เขียนฐานข้อมูลโดยตรง</p><p>ทุก action ผ่าน Portal API / Tool Registry</p><p>ตรวจ permission ก่อน execution</p><p>งานเสี่ยงต้องผ่าน Approval</p><p>Execution จริงต้องตรวจผลและบันทึก Audit</p></div></div></div></div></section></AIAccessGuard>;
}
