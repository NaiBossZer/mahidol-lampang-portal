import { useEffect, useMemo, useState } from "react";
import { RefreshCw, Search, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { apiRequest } from "@/services/api";

type AuditRow = {
  id: number;
  actor_id?: string | null;
  action: string;
  table_name: string;
  record_id?: string | null;
  old_data?: unknown;
  new_data?: unknown;
  created_at: string;
};
export function AuditTrailPage() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [query, setQuery] = useState("");
  const [table, setTable] = useState("");
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "250" });
      if (table) params.set("table", table);
      const data = await apiRequest<AuditRow[]>(`/api/admin/audit-trail?${params}`);
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "โหลด Audit Trail ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, [table]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(
      (r) =>
        !q ||
        `${r.action} ${r.table_name} ${r.record_id ?? ""} ${r.actor_id ?? ""}`
          .toLowerCase()
          .includes(q),
    );
  }, [rows, query]);
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
            Governance
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-brand-navy lg:text-3xl">
            Audit Trail
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            บันทึกการเปลี่ยนแปลงสำคัญของระบบแบบอ่านอย่างเดียว
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex min-h-11 items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-brand-navy"
        >
          <RefreshCw className="h-4 w-4" />
          รีเฟรช
        </button>
      </div>
      <div className="mt-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_240px]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <span className="sr-only">ค้นหา Audit Trail</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหา action, table, record หรือ actor"
            className="dashboard-control w-full pl-10"
          />
        </label>
        <input
          value={table}
          onChange={(e) => setTable(e.target.value)}
          placeholder="กรอง table_name"
          className="dashboard-control"
        />
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">กำลังโหลด Audit Trail...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            <ShieldCheck className="mx-auto mb-2 h-7 w-7 text-slate-300" />
            ยังไม่มีรายการ
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500">
                <tr>
                  <th className="px-5 py-3 text-left">เวลา</th>
                  <th className="px-4 py-3 text-left">Action</th>
                  <th className="px-4 py-3 text-left">Table</th>
                  <th className="px-4 py-3 text-left">Record</th>
                  <th className="px-5 py-3 text-left">Actor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((r) => (
                  <tr key={r.id}>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {new Date(r.created_at).toLocaleString("th-TH")}
                    </td>
                    <td className="px-4 py-4 font-semibold text-brand-navy">{r.action}</td>
                    <td className="px-4 py-4 text-slate-700">{r.table_name}</td>
                    <td className="px-4 py-4 font-mono text-xs text-slate-500">
                      {r.record_id ?? "—"}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-slate-500">
                      {r.actor_id ?? "system"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
