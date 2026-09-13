import { useState } from "react";
import { ArrowRight, Bot, CheckCircle2, ListTodo, Search, ShieldCheck, Sparkles } from "lucide-react";
import { AICommandBar } from "@/components/ai/AICommandBar";
import { AIAccessGuard } from "@/components/ai/AIAccessGuard";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const quickActions = ["สร้างกิจกรรมจากเอกสาร", "ตรวจข้อมูลกิจกรรมที่ยังไม่ครบ", "สรุปผลกิจกรรมล่าสุด"];

function CommandCenterContent() {
  const [intent, setIntent] = useState(""),
    [submitted, setSubmitted] = useState(false),
    [resultMessage, setResultMessage] = useState(""),
    [executionId, setExecutionId] = useState("");

  async function submit(value: string) {
    setIntent(value);
    setSubmitted(false);
    setResultMessage("");
    setExecutionId("");
    try {
      const r = await fetch("/api/admin/ai-intent", {
          method: "POST",
          credentials: "include",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({ intent: value }),
        }),
        b = await r.json();
      if (!r.ok) throw new Error(b?.error || "ส่งคำสั่งไม่สำเร็จ");

      const id = b?.data?.executionId ?? b?.data?.execution?.id ?? "";
      setExecutionId(id);
      setSubmitted(true);

      if (b?.requiresApproval) {
        setResultMessage("AI วิเคราะห์คำสั่งแล้ว และส่งเข้าสู่ Approval ก่อนดำเนินการ");
        toast.success("ส่งคำสั่งเข้า Approval แล้ว");
      } else if (b?.success) {
        setResultMessage("AI วิเคราะห์และดำเนินการผ่าน Tool Registry สำเร็จแล้ว");
        toast.success("AI ดำเนินการสำเร็จ");
      } else {
        setResultMessage("AI รับคำสั่งแล้ว แต่การดำเนินการไม่สำเร็จ");
        toast.error(b?.error || "AI ดำเนินการไม่สำเร็จ");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "ส่งคำสั่งไม่สำเร็จ");
    }
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-[#f8f9ff] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1280px]">
        <div className="rounded-2xl bg-[#002d62] px-5 py-6 text-white shadow-sm sm:px-7">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold tracking-wide text-[#d7e2ff]">
                <Sparkles className="h-3.5 w-3.5" />
                AUTONOMOUS AI
              </div>
              <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-[32px]">ศูนย์สั่งการอัจฉริยะ</h1>
              <p className="mt-2 text-sm leading-6 text-[#d7e2ff]">
                ส่งเป้าหมายเข้า AI แล้วระบบจะวิเคราะห์ Intent, ตรวจสิทธิ์, เลือก Tool และจัดการ Approval ตามระดับความเสี่ยง
              </p>
            </div>
            <div className="hidden rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-right sm:block">
              <p className="text-[10px] text-white/60">SYSTEM</p>
              <p className="mt-1 text-xs font-semibold text-[#95f8a7]">READY</p>
            </div>
          </div>
          <div className="mt-6 rounded-xl bg-[#00193c] p-2">
            <AICommandBar onSubmit={(v) => void submit(v)} placeholder="บอก AI ว่าต้องการให้ทำอะไร…" />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {quickActions.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => void submit(a)}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-white/80 hover:bg-white/10"
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {intent && (
          <div className="mt-4 rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[.12em] text-slate-400">CURRENT INTENT</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{intent}</p>
            <p className="mt-2 text-xs text-slate-500">{submitted ? resultMessage : "กำลังเตรียมส่ง..."}</p>
            {executionId && (
              <p className="mt-1 text-[10px] font-mono text-slate-400">Execution: {executionId}</p>
            )}
          </div>
        )}

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {[['/admin/ai/work-queue', ListTodo, 'คิวงาน AI', 'งานจริงที่กำลังทำหรือรอข้อมูล'], ['/admin/ai/execution', Bot, 'แผนและการทำงาน', 'execution ผ่าน Tool Registry'], ['/admin/ai/history', CheckCircle2, 'ประวัติการทำงาน', 'ตรวจสอบ execution จริง']].map(([to, Icon, title, description]) => {
            const I = Icon as typeof Bot;
            return (
              <Link key={String(to)} to={String(to)} className="group rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md">
                <div className="flex items-center justify-between">
                  <I className="h-5 w-5 text-[#002d62]" />
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-[#002d62]" />
                </div>
                <h2 className="mt-3 text-sm font-bold text-slate-900">{String(title)}</h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">{String(description)}</p>
              </Link>
            );
          })}
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1.35fr_.65fr]">
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Search className="h-4 w-4 text-[#002d62]" />
              <div>
                <h2 className="text-sm font-bold">AI Workspace</h2>
                <p className="text-xs text-slate-500">Intent → Context → Permission → Plan → Approval → Tool → Verification</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
            <ShieldCheck className="h-5 w-5 text-[#2e7d32]" />
            <h2 className="mt-2 text-sm font-bold">Protected workspace</h2>
            <p className="mt-1 text-xs leading-5 text-emerald-900">AI ไม่เขียนฐานข้อมูลโดยตรง</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AICommandCenterPage() {
  return (
    <AIAccessGuard permission="ai.command.read">
      <CommandCenterContent />
    </AIAccessGuard>
  );
}
