import { useCallback, useEffect, useMemo, useState } from "react";
import { BadgeCheck, CalendarDays, CheckCircle2, ChevronDown, ChevronRight, ClipboardList, Download, Eye, LoaderCircle, Mail, MapPin, Phone, RefreshCw, Search, SlidersHorizontal, Trash2, Users, UserRoundCheck, X } from "lucide-react";

type ActivityOption = { id: string; title: string; slug: string };
type Registration = { id: string; registration_code: string; full_name: string; phone: string; email: string | null; organization: string | null; position: string | null; participant_type: string; status: string; created_at: string; checked_in_at: string | null; pdpa_consent?: boolean; pdpa_consent_at?: string | null };
const typeLabels: Record<string, string> = { general: "บุคคลทั่วไป", community: "ชุมชน", student: "นักศึกษา", staff: "บุคลากร", partner: "หน่วยงานภาคี" };
const dateText = (value: string) => new Intl.DateTimeFormat("th-TH", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

function StatCard({ label, value, note, icon: Icon, tone }: { label: string; value: number; note: string; icon: typeof Users; tone: string }) {
  return <article className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-1.5 text-2xl font-bold tracking-tight text-[#17365f]">{value.toLocaleString("th-TH")}</p><p className="mt-1 text-xs text-slate-400">{note}</p></div><span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${tone}`}><Icon className="h-5 w-5" /></span></div></article>;
}
function Status({ value }: { value: string }) {
  const checked = value === "checked_in", cancelled = value === "cancelled";
  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${checked ? "bg-blue-50 text-blue-700" : cancelled ? "bg-slate-100 text-slate-500" : "bg-emerald-50 text-emerald-700"}`}><i className={`h-1.5 w-1.5 rounded-full ${checked ? "bg-blue-500" : cancelled ? "bg-slate-400" : "bg-emerald-500"}`} />{checked ? "เช็กอินแล้ว" : cancelled ? "ยกเลิก" : "ลงทะเบียนสำเร็จ"}</span>;
}
function Type({ value }: { value: string }) {
  const tone = value === "student" ? "bg-violet-50 text-violet-700" : value === "staff" ? "bg-cyan-50 text-cyan-800" : value === "community" ? "bg-amber-50 text-amber-800" : value === "partner" ? "bg-indigo-50 text-indigo-700" : "bg-slate-100 text-slate-600";
  return <span className={`inline-flex whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ${tone}`}>{typeLabels[value] ?? value}</span>;
}

export function ActivityRegistrationsPage() {
  const [activityId, setActivityId] = useState("");
  const [activities, setActivities] = useState<ActivityOption[]>([]);
  const [rows, setRows] = useState<Registration[]>([]);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [checkinFilter, setCheckinFilter] = useState("all");
  const [selected, setSelected] = useState<Registration | null>(null);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [loadingRows, setLoadingRows] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const loadActivities = useCallback(async () => {
    setLoadingActivities(true);
    try {
      const r = await fetch("/api/admin/activities", { credentials: "include" }), body = await r.json();
      if (!r.ok) throw new Error(body.error || "ไม่สามารถโหลดกิจกรรมได้");
      const items = (body.data ?? []) as ActivityOption[];
      setActivities(items);
      setActivityId((current) => current && items.some((x) => x.id === current) ? current : items.find((x) => x.slug === "shellac-income-climate-workshop-2026-1793678474794")?.id ?? items[0]?.id ?? "");
      setError("");
    } catch (e) { setError(e instanceof Error ? e.message : "ไม่สามารถโหลดกิจกรรมได้"); }
    finally { setLoadingActivities(false); }
  }, []);

  const loadRows = useCallback(async () => {
    if (!activityId) { setRows([]); return; }
    setLoadingRows(true);
    try {
      const r = await fetch(`/api/registrations?activityId=${encodeURIComponent(activityId)}`, { credentials: "include" }), body = await r.json();
      if (!r.ok) throw new Error(body.error || "โหลดรายชื่อไม่สำเร็จ");
      setRows((body.data ?? []) as Registration[]); setError("");
    } catch (e) { setError(e instanceof Error ? e.message : "โหลดรายชื่อไม่สำเร็จ"); }
    finally { setLoadingRows(false); }
  }, [activityId]);
  useEffect(() => { void loadActivities(); }, [loadActivities]);
  useEffect(() => { void loadRows(); }, [loadRows]);

  const counts = useMemo(() => ({ total: rows.filter(x => x.status !== "cancelled").length, registered: rows.filter(x => x.status === "registered").length, checked: rows.filter(x => x.status === "checked_in").length, cancelled: rows.filter(x => x.status === "cancelled").length }), [rows]);
  const filtered = useMemo(() => rows.filter((row) => {
    const q = query.trim().toLocaleLowerCase();
    const matches = !q || [row.full_name, row.phone, row.email ?? "", row.organization ?? "", row.registration_code].join(" ").toLocaleLowerCase().includes(q);
    const typeOk = typeFilter === "all" || row.participant_type === typeFilter;
    const statusOk = statusFilter === "all" || row.status === statusFilter;
    const checkinOk = checkinFilter === "all" || (checkinFilter === "checked_in" ? row.status === "checked_in" : row.status === "registered");
    return matches && typeOk && statusOk && checkinOk;
  }), [rows, query, typeFilter, statusFilter, checkinFilter]);

  async function toggleCheckIn(row: Registration) {
    const next = row.status === "checked_in" ? "registered" : "checked_in";
    if (next === "registered" && !window.confirm(`ยืนยันยกเลิกการเช็กอินของ ${row.full_name} หรือไม่?`)) return;
    setSavingId(row.id);
    try {
      const r = await fetch("/api/registrations", { method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: row.id, status: next }) });
      const body = await r.json(); if (!r.ok) throw new Error(body.error || "ปรับสถานะไม่สำเร็จ");
      const updated = { ...row, status: body.data.status, checked_in_at: body.data.status === "checked_in" ? new Date().toISOString() : null };
      setRows(current => current.map(x => x.id === row.id ? updated : x)); setSelected(current => current?.id === row.id ? updated : current); setError("");
    } catch (e) { setError(e instanceof Error ? e.message : "ปรับสถานะไม่สำเร็จ"); }
    finally { setSavingId(null); }
  }
  async function deleteRegistration(row: Registration) {
    const confirmed = window.confirm(`ยืนยันลบข้อมูลผู้สมัคร "${row.full_name}" (รหัส ${row.registration_code}) อย่างถาวรหรือไม่?\n\nข้อมูลที่ลบแล้วจะไม่สามารถกู้คืนได้`);
    if (!confirmed) return;
    setDeletingId(row.id);
    try {
      const r = await fetch("/api/registrations", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row.id }),
      });
      const body = await r.json();
      if (!r.ok) throw new Error(body.error || "ลบข้อมูลผู้สมัครไม่สำเร็จ");
      setRows(current => current.filter(item => item.id !== row.id));
      setSelected(current => current?.id === row.id ? null : current);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "ลบข้อมูลผู้สมัครไม่สำเร็จ");
    } finally {
      setDeletingId(null);
    }
  }
  function exportCsv() {
    const fields: (keyof Registration)[] = ["registration_code", "full_name", "phone", "email", "organization", "position", "participant_type", "status", "created_at", "checked_in_at"];
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = "\uFEFF" + [fields.join(","), ...filtered.map(row => fields.map(f => esc(row[f])).join(","))].join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = "activity-registrations.csv"; a.click(); URL.revokeObjectURL(url);
  }
  const clearFilters = () => { setQuery(""); setTypeFilter("all"); setStatusFilter("all"); setCheckinFilter("all"); };
  const activity = activities.find(x => x.id === activityId);

  return <main className="mx-auto w-full max-w-[1680px] space-y-5 px-4 pb-8 sm:px-6 xl:px-8">
    <header className="flex flex-col gap-3 border-b border-slate-200/80 pb-4 lg:flex-row lg:items-center lg:justify-between">
      <div><div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400"><span>จัดการกิจกรรม</span><ChevronRight className="h-3.5 w-3.5" /><span className="text-[#285b93]">ลงทะเบียนผู้เข้าร่วม</span></div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#4777aa]">ACTIVITY OPERATIONS</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-[#17365f] sm:text-3xl">ลงทะเบียนผู้เข้าร่วม</h1><p className="mt-1.5 text-sm text-slate-500">จัดการรายชื่อ ตรวจสอบข้อมูล และติดตามการเข้าร่วมกิจกรรม</p></div>
      <div className="flex gap-2"><button onClick={() => void loadRows()} disabled={loadingRows || !activityId} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${loadingRows ? "animate-spin" : ""}`} />รีเฟรช</button><button onClick={exportCsv} disabled={!filtered.length} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#17477b] px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#10365f] disabled:opacity-40"><Download className="h-4 w-4" />ส่งออก CSV</button></div>
    </header>

    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-center"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#285b93]"><CalendarDays className="h-5 w-5" /></span><div className="min-w-0 flex-1"><label htmlFor="registration-activity" className="mb-1 block text-xs font-semibold text-slate-500">กิจกรรมที่กำลังจัดการ</label><div className="relative"><select id="registration-activity" value={activityId} onChange={e => setActivityId(e.target.value)} disabled={loadingActivities || !activities.length} className="min-h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 pr-10 text-sm font-semibold text-[#17365f] outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"><option value="">{loadingActivities ? "กำลังโหลดกิจกรรม..." : "ไม่พบกิจกรรม"}</option>{activities.map(x => <option key={x.id} value={x.id}>{x.title}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-slate-400" /></div></div>{activity && <div className="hidden items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 lg:flex"><BadgeCheck className="h-4 w-4" />กิจกรรมที่เลือก</div>}</div>{activity && <p className="mt-3 text-xs text-slate-400 sm:pl-[52px]">แสดงข้อมูลผู้ลงทะเบียนของกิจกรรมที่เลือกเท่านั้น</p>}</section>

    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="ผู้ลงทะเบียนทั้งหมด" value={counts.total} note="ไม่รวมรายการที่ยกเลิก" icon={Users} tone="bg-blue-50 text-blue-700" />
      <StatCard label="ลงทะเบียนสำเร็จ" value={counts.registered} note="รอเข้าร่วมกิจกรรม" icon={ClipboardList} tone="bg-emerald-50 text-emerald-700" />
      <StatCard label="เช็กอินแล้ว" value={counts.checked} note="ยืนยันการเข้าร่วมแล้ว" icon={UserRoundCheck} tone="bg-amber-50 text-amber-700" />
      <StatCard label="ยกเลิกการลงทะเบียน" value={counts.cancelled} note="รายการที่ถูกยกเลิก" icon={Users} tone="bg-slate-100 text-slate-600" />
    </section>

    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-3.5 sm:flex-row sm:items-center sm:justify-between sm:p-4"><div><h2 className="text-base font-bold text-[#17365f]">รายชื่อผู้ลงทะเบียน</h2><p className="mt-1 text-xs text-slate-400">พบ {filtered.length.toLocaleString("th-TH")} รายการ จาก {rows.length.toLocaleString("th-TH")} รายการ</p></div><div className="flex flex-col gap-2 sm:w-[min(100%,410px)] sm:flex-row"><label className="relative min-w-0 flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="ค้นหาชื่อ เบอร์โทร หรือรหัส..." className="min-h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100" /></label><button onClick={() => setFiltersOpen(v => !v)} className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-semibold sm:hidden ${filtersOpen ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600"}`}><SlidersHorizontal className="h-4 w-4" />ตัวกรอง</button></div></div>
      <div className={`grid gap-2.5 border-b border-slate-100 bg-slate-50/70 p-3.5 sm:grid-cols-3 lg:grid-cols-[minmax(150px,1fr)_minmax(150px,1fr)_minmax(150px,1fr)_auto] lg:items-end ${filtersOpen ? "grid" : "hidden sm:grid"}`}>
        <label><span className="mb-1.5 block text-xs font-semibold text-slate-500">ประเภทผู้เข้าร่วม</span><select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700"><option value="all">ทุกประเภท</option>{Object.entries(typeLabels).map(([v,l]) => <option key={v} value={v}>{l}</option>)}</select></label>
        <label><span className="mb-1.5 block text-xs font-semibold text-slate-500">สถานะลงทะเบียน</span><select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700"><option value="all">ทุกสถานะ</option><option value="registered">ลงทะเบียนสำเร็จ</option><option value="checked_in">เช็กอินแล้ว</option><option value="cancelled">ยกเลิก</option></select></label>
        <label><span className="mb-1.5 block text-xs font-semibold text-slate-500">สถานะ Check-in</span><select value={checkinFilter} onChange={e => setCheckinFilter(e.target.value)} className="min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700"><option value="all">ทั้งหมด</option><option value="checked_in">เช็กอินแล้ว</option><option value="not_checked_in">ยังไม่เช็กอิน</option></select></label>
        <button onClick={clearFilters} className="min-h-10 px-2 text-left text-xs font-semibold text-[#4777aa] underline underline-offset-4 hover:text-[#17365f] lg:text-center">ล้างตัวกรอง</button>
      </div>
      {error && <div role="alert" className="mx-4 mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-5">{error}</div>}
      {loadingRows ? <div className="flex min-h-64 items-center justify-center gap-2 text-sm text-slate-400"><LoaderCircle className="h-5 w-5 animate-spin" />กำลังโหลดรายชื่อผู้ลงทะเบียน...</div> : !filtered.length ? <div className="flex min-h-56 flex-col items-center justify-center px-5 text-center"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400"><Search className="h-6 w-6" /></span><h3 className="mt-4 font-semibold text-slate-700">{rows.length ? "ไม่พบรายชื่อที่ตรงกับตัวกรอง" : "ยังไม่มีผู้ลงทะเบียน"}</h3><p className="mt-1 max-w-sm text-sm text-slate-400">{rows.length ? "ลองเปลี่ยนคำค้นหาหรือตัวกรองเพื่อดูผลลัพธ์อื่น" : "เมื่อมีผู้ลงทะเบียน รายชื่อจะแสดงในส่วนนี้"}</p>{(query || typeFilter !== "all" || statusFilter !== "all" || checkinFilter !== "all") && <button onClick={clearFilters} className="mt-4 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600">ล้างตัวกรองทั้งหมด</button>}</div> : <>
        <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[860px] table-fixed text-left text-sm"><colgroup><col className="w-[15%]" /><col className="w-[29%]" /><col className="w-[13%]" /><col className="w-[13%]" /><col className="w-[14%]" /><col className="w-[16%]" /></colgroup><thead className="bg-slate-50 text-[11px] font-semibold text-slate-500"><tr>{["รหัสลงทะเบียน","ผู้เข้าร่วม","โทรศัพท์","ประเภท","สถานะ","จัดการ"].map(x => <th key={x} className="px-3 py-3.5 first:pl-5">{x}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{filtered.map(row => <tr key={row.id} className="hover:bg-blue-50/30"><td className="break-words px-4 py-4 font-mono text-xs font-semibold text-[#285b93]">{row.registration_code}</td><td className="px-3 py-4"><button onClick={() => setSelected(row)} className="block min-w-0 max-w-full text-left"><span className="block break-words font-semibold text-slate-700 hover:text-[#285b93]">{row.full_name}</span><span className="mt-1 block truncate text-xs text-slate-400" title={row.organization || row.email || ""}>{row.organization || row.email || "ไม่ระบุหน่วยงาน"}</span></button></td><td className="whitespace-nowrap px-3 py-4 text-xs text-slate-600">{row.phone}</td><td className="px-3 py-4"><Type value={row.participant_type} /></td><td className="px-3 py-4"><Status value={row.status} /></td><td className="px-3 py-4"><div className="flex items-center gap-1.5">{row.status === "checked_in" ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700"><CheckCircle2 className="h-4 w-4 shrink-0" />เรียบร้อย</span> : row.status === "registered" ? <button disabled={savingId===row.id} onClick={() => void toggleCheckIn(row)} className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-blue-200 px-2.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-50"><UserRoundCheck className="h-3.5 w-3.5 shrink-0" />{savingId===row.id ? "กำลังบันทึก" : "เช็กอิน"}</button> : <span className="text-xs text-slate-400">—</span>}<button onClick={() => setSelected(row)} aria-label={`ดูรายละเอียด ${row.full_name}`} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-[#285b93]"><Eye className="h-4 w-4" /></button><button disabled={deletingId===row.id} onClick={() => void deleteRegistration(row)} aria-label={`ลบผู้สมัคร ${row.full_name}`} title="ลบผู้สมัคร" className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50"><Trash2 className="h-4 w-4" /></button></div></td></tr>)}</tbody></table></div>
        <div className="space-y-3 bg-slate-50/60 p-3 md:hidden">{filtered.map(row => <article key={row.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-start justify-between gap-3"><button onClick={() => setSelected(row)} className="min-w-0 text-left"><span className="block truncate font-semibold text-slate-800">{row.full_name}</span><span className="mt-1 block font-mono text-xs text-[#4777aa]">{row.registration_code}</span></button><Status value={row.status} /></div><div className="mt-3 grid grid-cols-2 gap-3 text-xs"><div><span className="block text-slate-400">ประเภท</span><span className="mt-1 block"><Type value={row.participant_type} /></span></div><div><span className="block text-slate-400">เบอร์โทรศัพท์</span><span className="mt-1 block font-medium text-slate-700">{row.phone}</span></div><div className="col-span-2"><span className="block text-slate-400">หน่วยงาน</span><span className="mt-1 block text-slate-700">{row.organization || "—"}</span></div></div><div className="mt-3 flex gap-2 border-t border-slate-100 pt-3"><button onClick={() => setSelected(row)} className="min-h-9 flex-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600">ดูรายละเอียด</button>{row.status === "registered" && <button disabled={savingId===row.id} onClick={() => void toggleCheckIn(row)} className="min-h-9 flex-1 rounded-lg bg-[#17477b] text-xs font-semibold text-white disabled:opacity-50">{savingId===row.id ? "กำลังบันทึก..." : "เช็กอินผู้เข้าร่วม"}</button>}<button disabled={deletingId===row.id} onClick={() => void deleteRegistration(row)} className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-rose-200 px-3 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"><Trash2 className="h-3.5 w-3.5" />{deletingId===row.id ? "กำลังลบ..." : "ลบ"}</button></div></article>)}</div>
      </>}
      <footer className="flex flex-col gap-2 border-t border-slate-100 px-4 py-3 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-5"><span>แสดง {filtered.length.toLocaleString("th-TH")} จาก {rows.length.toLocaleString("th-TH")} รายการ</span><span>ข้อมูลจากฐานข้อมูลกิจกรรม</span></footer>
    </section>

    {selected && <div className="fixed inset-0 z-[70] flex justify-end" role="dialog" aria-modal="true" aria-label="รายละเอียดผู้ลงทะเบียน"><button onClick={() => setSelected(null)} aria-label="ปิดรายละเอียด" className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px]" /><aside className="relative flex h-full w-full max-w-[460px] flex-col bg-white shadow-2xl"><header className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><p className="text-xs text-slate-400">ข้อมูลผู้ลงทะเบียน</p><h2 className="mt-1 text-lg font-bold text-[#17365f]">รายละเอียดผู้เข้าร่วม</h2></div><button onClick={() => setSelected(null)} aria-label="ปิด" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button></header><div className="flex-1 space-y-5 overflow-y-auto p-5"><div className="flex flex-col items-center border-b border-slate-100 pb-5 text-center"><span className="grid h-16 w-16 place-items-center rounded-full bg-blue-50 text-xl font-bold text-[#285b93]">{selected.full_name.trim().split(/\s+/).slice(0,2).map(x=>x[0]).join("")}</span><h3 className="mt-3 text-base font-bold text-slate-800">{selected.full_name}</h3><span className="mt-1 font-mono text-xs font-semibold text-[#4777aa]">{selected.registration_code}</span></div><div className={`rounded-xl border p-4 ${selected.status==="checked_in" ? "border-blue-100 bg-blue-50/70" : "border-slate-200 bg-slate-50"}`}><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#285b93]"><UserRoundCheck className="h-5 w-5" /></span><div><p className="text-xs text-slate-500">สถานะการเข้าร่วม</p><p className="mt-0.5 text-sm font-bold text-slate-800">{selected.status==="checked_in" ? "เช็กอินเรียบร้อยแล้ว" : selected.status==="cancelled" ? "ยกเลิกการลงทะเบียน" : "ยังไม่ได้เช็กอิน"}</p>{selected.checked_in_at && <p className="mt-0.5 text-xs text-slate-500">{dateText(selected.checked_in_at)}</p>}</div></div></div><section><h4 className="mb-2 text-xs font-bold tracking-wide text-slate-400">ข้อมูลส่วนตัว</h4><dl className="divide-y divide-slate-100 rounded-xl border border-slate-200 px-4"><div className="flex gap-3 py-3"><Phone className="mt-0.5 h-4 w-4 text-slate-400" /><div><dt className="text-xs text-slate-400">เบอร์โทรศัพท์</dt><dd className="mt-1 text-sm text-slate-700">{selected.phone}</dd></div></div><div className="flex gap-3 py-3"><Mail className="mt-0.5 h-4 w-4 text-slate-400" /><div className="min-w-0"><dt className="text-xs text-slate-400">อีเมล</dt><dd className="mt-1 break-all text-sm text-slate-700">{selected.email || "—"}</dd></div></div><div className="flex gap-3 py-3"><MapPin className="mt-0.5 h-4 w-4 text-slate-400" /><div><dt className="text-xs text-slate-400">หน่วยงาน</dt><dd className="mt-1 text-sm text-slate-700">{selected.organization || "—"}</dd></div></div><div className="flex gap-3 py-3"><Users className="mt-0.5 h-4 w-4 text-slate-400" /><div><dt className="text-xs text-slate-400">ตำแหน่ง</dt><dd className="mt-1 text-sm text-slate-700">{selected.position || "—"}</dd></div></div><div className="flex justify-between gap-3 py-3"><div><dt className="text-xs text-slate-400">ประเภทผู้เข้าร่วม</dt><dd className="mt-1"><Type value={selected.participant_type} /></dd></div><div className="text-right"><dt className="text-xs text-slate-400">วันที่ลงทะเบียน</dt><dd className="mt-1 text-xs text-slate-700">{dateText(selected.created_at)}</dd></div></div></dl></section><section><h4 className="mb-2 text-xs font-bold tracking-wide text-slate-400">สถานะและความยินยอม</h4><div className="flex items-center justify-between rounded-t-xl border border-slate-200 px-4 py-3"><span className="text-sm text-slate-600">การลงทะเบียน</span><Status value={selected.status} /></div><div className="flex items-center justify-between rounded-b-xl border-x border-b border-slate-200 px-4 py-3"><span className="text-sm text-slate-600">การยินยอม PDPA</span><div className="text-right"><span className={`text-xs font-semibold ${selected.pdpa_consent === true ? "text-emerald-700" : selected.pdpa_consent === false ? "text-rose-600" : "text-slate-400"}`}>{selected.pdpa_consent === true ? "ยินยอมแล้ว" : selected.pdpa_consent === false ? "ไม่ยินยอม" : "ไม่พบข้อมูล"}</span>{selected.pdpa_consent_at && <p className="mt-1 text-[11px] text-slate-400">{dateText(selected.pdpa_consent_at)}</p>}</div></div></section></div><footer className="flex gap-2 border-t border-slate-100 p-4"><button disabled={deletingId===selected.id} onClick={() => void deleteRegistration(selected)} className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-rose-200 px-3 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"><Trash2 className="h-4 w-4" />{deletingId===selected.id ? "กำลังลบ..." : "ลบผู้สมัคร"}</button><button onClick={() => setSelected(null)} className="min-h-10 flex-1 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600">ปิด</button>{selected.status!=="cancelled" && <button disabled={savingId===selected.id} onClick={() => void toggleCheckIn(selected)} className={`min-h-10 flex-1 rounded-xl px-3 text-sm font-semibold disabled:opacity-50 ${selected.status==="checked_in" ? "border border-amber-200 bg-amber-50 text-amber-800" : "bg-[#17477b] text-white"}`}>{savingId===selected.id ? "กำลังบันทึก..." : selected.status==="checked_in" ? "ยกเลิก Check-in" : "เช็กอินผู้เข้าร่วม"}</button>}</footer></aside></div>}
  </main>;
}
