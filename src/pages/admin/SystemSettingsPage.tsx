import { useEffect, useState } from "react";
import { RefreshCw, Save, ServerCog } from "lucide-react";
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
  const [saving, setSaving] = useState<string | null>(null);
  const [draftUrls, setDraftUrls] = useState<Record<string, string>>({});
  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/system-settings", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      const b = await r.json();
      if (!r.ok) throw new Error(b?.error || "โหลดไม่สำเร็จ");
      const rows = (b.data ?? []) as System[];
      setData(rows);
      setDraftUrls(
        Object.fromEntries(rows.map((row) => [row.system_key, row.base_url ?? ""])),
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "โหลด settings ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);

  async function save(systemKey: string) {
    setSaving(systemKey);
    try {
      const response = await fetch("/api/admin/system-settings", {
        method: "PATCH",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemKey,
          baseUrl: draftUrls[systemKey]?.trim() || null,
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body?.error || "บันทึกไม่สำเร็จ");
      toast.success("บันทึก URL ระบบเรียบร้อย");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "บันทึกไม่สำเร็จ");
    } finally {
      setSaving(null);
    }
  }
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
              <label className="mt-3 block text-xs font-medium text-slate-600">
                URL ระบบ
                <input
                  value={draftUrls[x.system_key] ?? ""}
                  onChange={(event) =>
                    setDraftUrls((current) => ({
                      ...current,
                      [x.system_key]: event.target.value,
                    }))
                  }
                  placeholder="https://example.org"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-navy"
                  inputMode="url"
                />
              </label>
              <button
                type="button"
                onClick={() => void save(x.system_key)}
                disabled={saving === x.system_key}
                className="mt-3 inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-brand-navy px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
              >
                <Save className="h-3.5 w-3.5" />
                {saving === x.system_key ? "กำลังบันทึก..." : "บันทึก URL"}
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
