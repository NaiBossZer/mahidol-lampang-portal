import { useEffect, useState } from "react";
import { CheckCircle2, RefreshCw, ShieldCheck, XCircle } from "lucide-react";
import { toast } from "sonner";
import { AIAccessGuard } from "@/components/ai/AIAccessGuard";
type Execution = {
  id: string;
  tool_id: string;
  intent: string;
  status: string;
  risk_level: string;
  input: Record<string, unknown>;
  created_at: string;
};
export function AIApprovalPage() {
  const [data, setData] = useState<Execution[]>([]),
    [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/ai-approval", {
          credentials: "include",
          headers: { Accept: "application/json" },
        }),
        b = await r.json();
      if (!r.ok) throw new Error(b?.error || "โหลด approval ไม่สำเร็จ");
      setData(b.data ?? []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "โหลด approval ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  async function decide(id: string, decision: "approved" | "rejected") {
    try {
      const r = await fetch("/api/admin/ai-approval", {
          method: "POST",
          credentials: "include",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({ executionId: id, decision }),
        }),
        b = await r.json();
      if (!r.ok) throw new Error(b?.error || "ดำเนินการไม่สำเร็จ");
      toast.success(decision === "approved" ? "อนุมัติและส่งงานแล้ว" : "ปฏิเสธงานแล้ว");
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "ดำเนินการไม่สำเร็จ");
    }
  }
  return (
    <AIAccessGuard permission="ai.approval.read">
      <section className="min-h-[calc(100vh-4rem)] bg-[#f8f9ff] px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.14em] text-emerald-700">
                APPROVAL GATE
              </p>
              <h1 className="mt-1 text-2xl font-bold text-[#002d62]">AI Approval</h1>
              <p className="mt-1 text-sm text-slate-600">
                รายการ AI ที่ต้องมี Admin decision ก่อนเรียก Portal API จริง
              </p>
            </div>
            <button
              type="button"
              onClick={() => void load()}
              className="inline-flex h-10 items-center gap-2 rounded-xl border bg-white px-3 text-sm font-semibold"
            >
              <RefreshCw className="h-4 w-4" />
              รีเฟรช
            </button>
          </div>
          {loading ? (
            <div className="mt-6 rounded-2xl border bg-white p-8 text-center text-sm text-slate-500">
              กำลังโหลด...
            </div>
          ) : data.length === 0 ? (
            <div className="mt-6 rounded-2xl border bg-white p-10 text-center text-sm text-slate-500">
              <ShieldCheck className="mx-auto mb-2 h-7 w-7 text-slate-300" />
              ไม่มีงานรออนุมัติ
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {data.map((x) => (
                <div key={x.id} className="rounded-2xl border bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-bold text-brand-navy">{x.intent}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        risk {x.risk_level} · {new Date(x.created_at).toLocaleString("th-TH")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => void decide(x.id, "rejected")}
                        className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold text-red-700"
                      >
                        <XCircle className="h-4 w-4" />
                        ปฏิเสธ
                      </button>
                      <button
                        type="button"
                        onClick={() => void decide(x.id, "approved")}
                        className="inline-flex items-center gap-2 rounded-xl bg-brand-navy px-3 py-2 text-xs font-bold text-white"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        อนุมัติ
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </AIAccessGuard>
  );
}
