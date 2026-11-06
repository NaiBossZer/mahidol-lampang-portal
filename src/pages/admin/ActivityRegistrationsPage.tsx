import { useEffect, useMemo, useState } from "react";
import { Download, Search, UserCheck, Users } from "lucide-react";

type ActivityOption = { id: string; title: string; slug: string };
type Registration = { id: string; registration_code: string; full_name: string; phone: string; email: string | null; organization: string | null; position: string | null; participant_type: string; status: string; created_at: string; checked_in_at: string | null };

export function ActivityRegistrationsPage() {
  const [activityId, setActivityId] = useState("");
  const [activities, setActivities] = useState<ActivityOption[]>([]);
  const [rows, setRows] = useState<Registration[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/activities", { credentials: "include" })
      .then((r) => r.json())
      .then((body) => {
        const items = (body.data ?? []) as ActivityOption[];
        setActivities(items);
        const shellac = items.find((item) => item.slug === "shellac-income-climate-workshop-2026-1793678474794");
        if (shellac) setActivityId(shellac.id);
        else if (items[0]) setActivityId(items[0].id);
      })
      .catch(() => setError("ไม่สามารถโหลดกิจกรรมได้"));
  }, []);

  useEffect(() => {
    if (!activityId) return;
    setLoading(true);
    fetch(`/api/registrations?activityId=${encodeURIComponent(activityId)}`, { credentials: "include" })
      .then(async (r) => { const body = await r.json(); if (!r.ok) throw new Error(body.error || "โหลดรายชื่อไม่สำเร็จ"); setRows(body.data ?? []); })
      .catch((e) => setError(e instanceof Error ? e.message : "โหลดรายชื่อไม่สำเร็จ"))
      .finally(() => setLoading(false));
  }, [activityId]);

  const filtered = useMemo(() => rows.filter((row) => [row.full_name, row.phone, row.email, row.organization, row.registration_code].join(" ").toLowerCase().includes(query.toLowerCase())), [rows, query]);

  async function checkIn(row: Registration) {
    const response = await fetch("/api/registrations", { method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: row.id, status: row.status === "checked_in" ? "registered" : "checked_in" }) });
    const body = await response.json();
    if (!response.ok) { setError(body.error || "ปรับสถานะไม่สำเร็จ"); return; }
    setRows((current) => current.map((item) => item.id === row.id ? { ...item, status: body.data.status, checked_in_at: body.data.status === "checked_in" ? new Date().toISOString() : null } : item));
  }

  function exportCsv() {
    const fields = ["registration_code", "full_name", "phone", "email", "organization", "position", "participant_type", "status", "created_at"];
    const escape = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const csv = "\uFEFF" + [fields.join(","), ...filtered.map((row) => fields.map((field) => escape((row as unknown as Record<string, unknown>)[field])).join(","))].join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "activity-registrations.csv"; anchor.click(); URL.revokeObjectURL(url);
  }

  return <main className="space-y-6"><header><p className="text-xs font-bold uppercase tracking-widest text-brand-blue">ACTIVITY OPERATIONS</p><h1 className="mt-2 text-2xl font-black text-brand-navy">จัดการผู้ลงทะเบียน</h1><p className="mt-1 text-sm text-slate-500">จัดการรายชื่อ เช็กอิน และส่งออกข้อมูลได้จากทุกกิจกรรม</p></header>
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><label className="block text-xs font-bold text-slate-600">เลือกกิจกรรม<select value={activityId} onChange={(e) => setActivityId(e.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm sm:max-w-xl"><option value="">เลือกกิจกรรม</option>{activities.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label></section>
    <section className="grid gap-3 sm:grid-cols-3"><Stat icon={<Users className="h-5 w-5" />} label="ลงทะเบียนทั้งหมด" value={rows.length} /><Stat icon={<UserCheck className="h-5 w-5" />} label="เช็กอินแล้ว" value={rows.filter((r) => r.status === "checked_in").length} /><Stat icon={<Users className="h-5 w-5" />} label="ยังไม่เช็กอิน" value={rows.filter((r) => r.status === "registered").length} /></section>
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex flex-col gap-3 sm:flex-row"><label className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ค้นหาชื่อ เบอร์โทร อีเมล หรือรหัสลงทะเบียน" className="min-h-11 w-full rounded-xl border border-slate-300 pl-9 pr-3 text-sm" /></label><button onClick={exportCsv} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 text-sm font-bold text-brand-navy"><Download className="h-4 w-4" />ส่งออก CSV</button></div>
      {error && <p className="mt-3 text-sm text-red-600" role="alert">{error}</p>}{loading ? <p className="py-8 text-center text-sm text-slate-500">กำลังโหลดรายชื่อ...</p> : <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr>{["รหัส","ชื่อ–นามสกุล","โทรศัพท์","หน่วยงาน","ประเภท","สถานะ","จัดการ"].map((v) => <th key={v} className="px-3 py-3">{v}</th>)}</tr></thead><tbody>{filtered.map((row) => <tr key={row.id} className="border-t border-slate-100"><td className="px-3 py-3 font-mono text-xs">{row.registration_code}</td><td className="px-3 py-3 font-semibold">{row.full_name}</td><td className="px-3 py-3">{row.phone}</td><td className="px-3 py-3">{row.organization || "—"}</td><td className="px-3 py-3">{row.participant_type}</td><td className="px-3 py-3">{row.status === "checked_in" ? "เช็กอินแล้ว" : row.status === "cancelled" ? "ยกเลิก" : "ลงทะเบียนแล้ว"}</td><td className="px-3 py-3"><button onClick={() => void checkIn(row)} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold">{row.status === "checked_in" ? "ยกเลิกเช็กอิน" : "เช็กอิน"}</button></td></tr>)}</tbody></table>{!filtered.length && <p className="py-8 text-center text-sm text-slate-400">ยังไม่มีผู้ลงทะเบียน</p>}</div>}
    </section>
  </main>;
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) { return <div className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex items-center gap-2 text-slate-400">{icon}<span className="text-xs">{label}</span></div><p className="mt-3 text-2xl font-black text-brand-navy">{value.toLocaleString("th-TH")}</p></div>; }
