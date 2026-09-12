import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { AIAccessGuard } from "@/components/ai/AIAccessGuard";
import { AIApprovalDialog } from "@/components/ai/AIApprovalDialog";

export function AIApprovalPage() {
  const [open, setOpen] = useState(false);
  return <AIAccessGuard permission="ai.approval.read"><section className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-6 sm:px-6 lg:px-8"><div className="mx-auto max-w-3xl"><h1 className="text-2xl font-bold tracking-tight text-brand-navy">การอนุมัติการทำงานของ AI</h1><p className="mt-1 text-sm text-slate-600">Reusable confirmation surface สำหรับ action ที่ต้องให้ Admin ตัดสินใจก่อนดำเนินการ</p><div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><CheckCircle2 className="h-6 w-6 text-emerald-600"/><h2 className="mt-3 text-sm font-bold text-slate-900">Approval component พร้อมใช้งาน</h2><p className="mt-1 text-xs text-slate-500">ตัวอย่างนี้เปิดเฉพาะ UI component และยังไม่ส่ง action ใดไปยัง backend</p><button type="button" onClick={() => setOpen(true)} className="mt-5 min-h-10 rounded-xl bg-brand-navy px-4 text-sm font-bold text-white hover:opacity-90">ดูตัวอย่าง Approval</button></div></div><AIApprovalDialog open={open} title="ยืนยันการทำงานของ AI" summary="ตรวจสอบสิ่งที่ AI เตรียมไว้ก่อนอนุมัติการดำเนินการจริง" changes={["ตรวจ permission ของผู้ใช้งาน", "แสดงรายการข้อมูลที่จะถูกสร้างหรือแก้ไข", "บันทึกผลการอนุมัติลง audit trail"]} onApprove={() => setOpen(false)} onReject={() => setOpen(false)} onClose={() => setOpen(false)} /></section></AIAccessGuard>;
}
