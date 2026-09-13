import { useEffect, useState } from "react";
import { RefreshCw, ServerCog } from "lucide-react";
import { toast } from "sonner";
type System = {
  system_key: string;
  system_name: string;
  system_type: string;
  base_url?: string;
  status: string;
  owner_domain: string;
  updated_at: string;
};
export function SystemSettingsPage() {
  const [data, setData] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/system-settings", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      const b = await r.json();
      if (!r.ok) throw new Error(b?.error || "โหลดไม่สำเร็จ");
      setData(b.data ?? []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "โหลด settings ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.14em] text-emerald-700">
            Governance
          </p>
          <h1 className="mt-1 text-2xl font-bold text-brand-navy lg:text-3xl">System Settings</h1>
          <p className="mt-1 text-sm text-slate-600">สถานะระบบที่ Portal เชื่อมต่อและดูแล</p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border bg-white px-4 text-sm font-semibold"
        >
          <RefreshCw className="h-4 w-4" />
          รีเฟรช
        </button>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {loading ? (
          <div className="rounded-2xl border bg-white p-8 text-sm text-slate-500">กำลังโหลด...</div>
        ) : (
          data.map((x) => (
            <div key={x.system_key} className="rounded-2xl border bg-white p-5 shadow-sm">
              <ServerCog className="h-5 w-5 text-brand-navy" />
              <div className="mt-3 flex items-center justify-between">
                <h2 className="font-bold text-brand-navy">{x.system_name}</h2>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold">
                  {x.status}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {x.system_key} · {x.system_type}
              </p>
              <p className="mt-2 text-xs text-slate-500 break-all">
                {x.base_url ?? "ไม่เปิดเผย endpoint"}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
