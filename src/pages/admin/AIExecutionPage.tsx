import { AIExecutionPlan, AIVerificationBadge } from "@/components/ai/AIExecutionPlan";
import { AIAccessGuard } from "@/components/ai/AIAccessGuard";

const emptyPlan = [
  { id: "intent", title: "รับ Intent", detail: "รอคำสั่งจาก AI Command Center", status: "pending" as const },
  { id: "permission", title: "ตรวจสิทธิ์และขอบเขต", detail: "ใช้ AdminGuard + RBAC ของ Portal", status: "pending" as const },
  { id: "execute", title: "ดำเนินการผ่าน Tool Registry", detail: "ยังไม่ได้เชื่อม AI backend", status: "pending" as const },
  { id: "verify", title: "ตรวจสอบผลลัพธ์", detail: "ผลลัพธ์จะแสดงเมื่อมี execution จริง", status: "pending" as const },
];

export function AIExecutionPage() {
  return <AIAccessGuard permission="ai.execution.read"><section className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-6 sm:px-6 lg:px-8"><div className="mx-auto max-w-6xl"><div className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-2xl font-bold tracking-tight text-brand-navy">แผนและการทำงานของ AI</h1><p className="mt-1 text-sm text-slate-600">พื้นที่สำหรับแสดงแผน execution แบบเป็นขั้นตอน โดยไม่เปิดเผยหรือจำลองผลลัพธ์ที่ยังไม่เกิดขึ้นจริง</p></div><AIVerificationBadge /></div><div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_.8fr]"><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-5"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">CURRENT EXECUTION</p><p className="mt-1 text-sm font-bold text-slate-900">ยังไม่มี Execution ที่เชื่อมกับ AI backend</p></div><AIExecutionPlan steps={emptyPlan} /></div><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-sm font-bold text-slate-900">Production boundary</h2><ul className="mt-4 space-y-3 text-xs leading-5 text-slate-600"><li>• AI ไม่เขียนฐานข้อมูลโดยตรง</li><li>• ทุก action ต้องผ่าน Portal API / Tool Registry</li><li>• ตรวจ permission ก่อน execution</li><li>• งานที่ต้องอนุมัติใช้ Approval component</li><li>• execution จริงต้องมี audit trail</li></ul></div></div></div></section></AIAccessGuard>;
}
