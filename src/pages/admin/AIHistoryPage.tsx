import { History, ShieldCheck } from "lucide-react";
import { AIAccessGuard } from "@/components/ai/AIAccessGuard";

export function AIHistoryPage() {
  return <AIAccessGuard permission="ai.execution.read"><section className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-6 sm:px-6 lg:px-8"><div className="mx-auto max-w-5xl"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-brand-navy shadow-sm"><History className="h-5 w-5"/></div><div><h1 className="text-2xl font-bold tracking-tight text-brand-navy">ประวัติการทำงานของ AI</h1><p className="mt-1 text-sm text-slate-600">Execution จริงของ AI จะแสดงที่นี่เมื่อเชื่อม backend และ audit trail แล้ว</p></div></div><div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm"><ShieldCheck className="mx-auto h-7 w-7 text-emerald-600"/><p className="mt-3 text-sm font-bold text-slate-800">ยังไม่มี Execution history</p><p className="mt-1 text-xs text-slate-500">หน้านี้ตั้งใจไม่สร้างข้อมูลจำลอง เพื่อให้ประวัติใน Production สะท้อนการทำงานจริงเท่านั้น</p></div></div></section></AIAccessGuard>;
}
