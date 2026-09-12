import { AIWorkQueue } from "@/components/ai/AIWorkQueue";
import { AIAccessGuard } from "@/components/ai/AIAccessGuard";

export function AIWorkQueuePage() {
  return <AIAccessGuard permission="ai.queue.read"><section className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-6 sm:px-6 lg:px-8"><div className="mx-auto max-w-5xl"><h1 className="text-2xl font-bold tracking-tight text-brand-navy">คิวงาน AI</h1><p className="mt-1 text-sm text-slate-600">ศูนย์รวมงานที่ AI กำลังดำเนินการ รอการอนุมัติ หรือจำเป็นต้องได้รับข้อมูลเพิ่มเติม</p><div className="mt-6"><AIWorkQueue items={[]} /></div></div></section></AIAccessGuard>;
}
