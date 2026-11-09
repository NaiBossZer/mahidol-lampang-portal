import { useEffect, useMemo, useState } from "react";
import {
  Building2, CheckCircle2, Clock3, Download, Eye, Filter, Mail,
  Phone, RotateCcw, Search, UserCheck, Users, X,
} from "lucide-react";

type ActivityOption = { id: string; title: string; slug: string };
type Registration = {
  id: string; registration_code: string; full_name: string; phone: string;
  email: string | null; organization: string | null; position: string | null;
  participant_type: string; status: string; created_at: string;
  checked_in_at: string | null;
};

const participantLabels: Record<string, string> = {
  general: "บุคคลทั่วไป", community: "ชุมชน", student: "นักศึกษา",
  staff: "บุคลากร", partner: "หน่วยงานภาคี",
};

const dateLabel = (value: string) => new Date(value).toLocaleDateString("th-TH", {
  day: "numeric", month: "short", year: "numeric",
});

export function ActivityRegistrationsPage() {
  const [activityId, setActivityId] = useState("");
  const [activities, setActivities] = useState<ActivityOption[]>([]);
  const [rows, setRows] = useState<Registration[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selected, setSelected] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
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
    if (!activityId) { setRows([]); return; }
    setLoading(true);
    setError("");
    fetch(`/api/registrations?activityId=${encodeURIComponent(activityId)}`, { credentials: "include" })
      .then(async (r) => {
        const body = await r.json();
        if (!r.ok) throw new Error(body.error || "โหลดรายชื่อไม่สำเร็จ");
        setRows(body.data ?? []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "โหลดรายชื่อไม่สำเร็จ"))
      .finally(() => setLoading(false));
  }, [activityId]);

  const stats = useMemo(() => ({
    total: rows.filter((r) => r.status !== "cancelled").length,
    checked: rows.filter((r) => r.status === "checked_in").length,
    pending: rows.filter((r) => r.status === "registered").length,
    cancelled: rows.filter((r) => r.status === "cancelled").length,
  }), [rows]);

  const filtered = useMemo(() => rows.filter((row) => {
    const matchesQuery = [row.full_name, row.phone, row.email, row.organization, row.registration_code]
      .join(" ").toLowerCase().includes(query.trim().toLowerCase());
    const matchesStatus = statusFilter === "all" || row.status === statusFilter;
    const matchesType = typeFilter === "all" || row.participant_type === typeFilter;
    return matchesQuery && matchesStatus && matchesType;
  }), [rows, query, statusFilter, typeFilter]);

  async function checkIn(row: Registration) {
    setUpdatingId(row.id);
    setError("");
    try {
      const nextStatus = row.status === "checked_in" ? "registered" : "checked_in";
      const response = await fetch("/api/registrations", {
        method: "PATCH", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row.id, status: nextStatus }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "ปรับสถานะไม่สำเร็จ");
      const updated = {
        ...row, status: body.data.status,
        checked_in_at: body.data.status === "checked_in" ? new Date().toISOString() : null,
      };
      setRows((current) => current.map((item) => item.id === row.id ? updated : item));
      setSelected((current) => current?.id === row.id ? updated : current);
    } catch (e) {
      setError(e instanceof Error ? e.message : "ปรับสถานะไม่สำเร็จ");
    } finally {
      setUpdatingId("");
    }
  }

  function exportCsv() {
    const fields = ["registration_code", "full_name", "phone", "email", "organization", "position", "participant_type", "status", "created_at"];
    const escape = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const csv = "\uFEFF" + [
      fields.join(","),
      ...filtered.map((row) => fields.map((field) => escape((row as unknown as Record<string, unknown>)[field])).join(",")),
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = "activity-registrations.csv"; anchor.click();
    URL.revokeObjectURL(url);
  }

  const selectedActivity = activities.find((item) => item.id === activityId);

  return (
    <main className="mx-auto w-full max-w-[1440px] space-y-6 pb-8">
      <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-blue">
            <span className="h-2 w-2 rounded-full bg-brand-blue" /> Activity operations
          </div>
          <h1 className="text-2xl font-black tracking-tight text-brand-navy sm:text-3xl">ลงทะเบียนผู้เข้าร่วม</h1>
          <p className="mt-2 text-sm text-slate-500">จัดการรายชื่อผู้สมัคร ติดตามการเข้าร่วม และตรวจสอบข้อมูลในแต่ละกิจกรรม</p>
        </div>
        <button onClick={exportCsv} disabled={!filtered.length} className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl bg-brand-navy px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 lg:self-auto">
          <Download className="h-4 w-4" /> ส่งออก CSV
        </button>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-brand-navy">
          <Filter className="h-4 w-4 text-brand-blue" /> กิจกรรมที่กำลังจัดการ
        </div>
        <select value={activityId} onChange={(e) => setActivityId(e.target.value)} className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-800 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10">
          <option value="">เลือกกิจกรรม</option>
          {activities.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
        </select>
        {selectedActivity && <p className="mt-2 text-xs text-slate-400">กำลังแสดงข้อมูลของกิจกรรมที่เลือก · เปลี่ยนกิจกรรมเพื่อดูรายชื่อชุดอื่น</p>}
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={<Users className="h-5 w-5" />} label="ผู้ลงทะเบียนทั้งหมด" value={stats.total} detail="ไม่นับรายการที่ยกเลิก" tone="blue" />
        <Stat icon={<CheckCircle2 className="h-5 w-5" />} label="เช็กอินแล้ว" value={stats.checked} detail={stats.total ? `${Math.round(stats.checked / stats.total * 100)}% ของผู้ลงทะเบียน` : "ยังไม่มีผู้เช็กอิน"} tone="green" />
        <Stat icon={<Clock3 className="h-5 w-5" />} label="รอเช็กอิน" value={stats.pending} detail="ลงทะเบียนแล้ว แต่ยังไม่มาถึง" tone="amber" />
        <Stat icon={<RotateCcw className="h-5 w-5" />} label="ยกเลิก" value={stats.cancelled} detail="รายการที่ถูกยกเลิก" tone="slate" />
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-4 sm:p-5">
          <div className="flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
            <div>
              <h2 className="text-base font-extrabold text-brand-navy">รายชื่อผู้ลงทะเบียน</h2>
              <p className="mt-1 text-xs text-slate-500">แสดง {filtered.length.toLocaleString("th-TH")} จาก {rows.length.toLocaleString("th-TH")} รายการ</p>
            </div>
            <label className="relative block w-full xl:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ค้นหาชื่อ เบอร์โทร อีเมล หรือรหัสลงทะเบียน" className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/10" />
            </label>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <select aria-label="กรองตามสถานะ" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="min-h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-brand-blue">
              <option value="all">ทุกสถานะ</option>
              <option value="registered">รอเช็กอิน</option>
              <option value="checked_in">เช็กอินแล้ว</option>
              <option value="cancelled">ยกเลิก</option>
            </select>
            <select aria-label="กรองตามประเภทผู้เข้าร่วม" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="min-h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-brand-blue">
              <option value="all">ผู้เข้าร่วมทุกประเภท</option>
              {Object.entries(participantLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
        </div>

        {error && <div role="alert" className="mx-4 mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-16 text-sm text-slate-500"><span className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-brand-blue" />กำลังโหลดรายชื่อผู้ลงทะเบียน...</div>
        ) : !activityId ? (
          <div className="py-16 text-center text-sm text-slate-500">เลือกกิจกรรมเพื่อดูรายชื่อผู้ลงทะเบียน</div>
        ) : !filtered.length ? (
          <div className="flex flex-col items-center px-4 py-16 text-center">
            <div className="mb-3 rounded-2xl bg-slate-100 p-4 text-slate-400"><Users className="h-7 w-7" /></div>
            <p className="font-bold text-slate-700">{rows.length ? "ไม่พบรายการที่ตรงกับตัวกรอง" : "ยังไม่มีผู้ลงทะเบียน"}</p>
            <p className="mt-1 text-sm text-slate-400">{rows.length ? "ลองเปลี่ยนคำค้นหาหรือตัวกรอง" : "เมื่อมีผู้สมัคร รายชื่อจะแสดงในส่วนนี้"}</p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  <tr>{["รหัสลงทะเบียน", "ผู้เข้าร่วม", "เบอร์โทรศัพท์", "ประเภท", "วันที่สมัคร", "สถานะ", "ดำเนินการ"].map((v) => <th key={v} className="px-4 py-3.5">{v}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((row) => <tr key={row.id} className="transition hover:bg-slate-50/70">
                    <td className="whitespace-nowrap px-4 py-4 font-mono text-xs font-bold text-brand-blue">{row.registration_code}</td>
                    <td className="px-4 py-4"><p className="font-bold text-slate-800">{row.full_name}</p><p className="mt-0.5 max-w-[220px] truncate text-xs text-slate-400">{row.organization || row.email || "ไม่ระบุหน่วยงาน"}</p></td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-600">{row.phone}</td>
                    <td className="px-4 py-4 text-slate-600">{participantLabels[row.participant_type] || row.participant_type}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-500">{dateLabel(row.created_at)}</td>
                    <td className="px-4 py-4"><Status status={row.status} /></td>
                    <td className="px-4 py-4"><div className="flex items-center gap-2">
                      <button onClick={() => setSelected(row)} title="ดูรายละเอียด" className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-brand-blue hover:text-brand-blue"><Eye className="h-4 w-4" /></button>
                      {row.status !== "cancelled" && <button onClick={() => void checkIn(row)} disabled={updatingId === row.id} className={`rounded-lg px-3 py-2 text-xs font-bold transition disabled:opacity-50 ${row.status === "checked_in" ? "border border-slate-200 text-slate-600 hover:bg-slate-100" : "bg-brand-blue text-white hover:opacity-90"}`}>{updatingId === row.id ? "กำลังบันทึก" : row.status === "checked_in" ? "ยกเลิกเช็กอิน" : "เช็กอิน"}</button>}
                    </div></td>
                  </tr>)}
                </tbody>
              </table>
            </div>
            <div className="divide-y divide-slate-100 md:hidden">
              {filtered.map((row) => <article key={row.id} className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0"><p className="font-bold text-slate-800">{row.full_name}</p><p className="mt-1 font-mono text-xs text-brand-blue">{row.registration_code}</p></div>
                  <Status status={row.status} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{row.phone}</span>
                  <span className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" />{participantLabels[row.participant_type] || row.participant_type}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <button onClick={() => setSelected(row)} className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue"><Eye className="h-4 w-4" /> ดูรายละเอียด</button>
                  {row.status !== "cancelled" && <button onClick={() => void checkIn(row)} disabled={updatingId === row.id} className={`rounded-lg px-3 py-2 text-xs font-bold disabled:opacity-50 ${row.status === "checked_in" ? "border border-slate-200 text-slate-600" : "bg-brand-blue text-white"}`}>{updatingId === row.id ? "กำลังบันทึก" : row.status === "checked_in" ? "ยกเลิกเช็กอิน" : "เช็กอิน"}</button>}
                </div>
              </article>)}
            </div>
          </>
        )}
        <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-3 text-xs text-slate-400">ข้อมูลอัปเดตจากระบบลงทะเบียน · ส่งออกเฉพาะรายการที่ผ่านตัวกรอง</div>
      </section>

      {selected && <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) setSelected(null); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="registration-detail-title" className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div><p className="text-xs font-bold uppercase tracking-widest text-brand-blue">Registration detail</p><h2 id="registration-detail-title" className="mt-1 text-xl font-black text-brand-navy">ข้อมูลผู้ลงทะเบียน</h2></div>
            <button onClick={() => setSelected(null)} aria-label="ปิด" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
          </div>
          <div className="mt-5 rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-400">รหัสลงทะเบียน</p><p className="mt-1 font-mono text-lg font-bold text-brand-blue">{selected.registration_code}</p><div className="mt-3"><Status status={selected.status} /></div></div>
          <div className="mt-5 space-y-4">
            <Detail label="ชื่อ–นามสกุล" value={selected.full_name} />
            <Detail label="เบอร์โทรศัพท์" value={selected.phone} icon={<Phone className="h-4 w-4" />} />
            <Detail label="อีเมล" value={selected.email || "ไม่ระบุ"} icon={<Mail className="h-4 w-4" />} />
            <Detail label="หน่วยงาน" value={selected.organization || "ไม่ระบุ"} icon={<Building2 className="h-4 w-4" />} />
            <Detail label="ตำแหน่ง" value={selected.position || "ไม่ระบุ"} />
            <Detail label="ประเภทผู้เข้าร่วม" value={participantLabels[selected.participant_type] || selected.participant_type} />
            <Detail label="วันที่ลงทะเบียน" value={dateLabel(selected.created_at)} />
            {selected.checked_in_at && <Detail label="เวลาเช็กอิน" value={new Date(selected.checked_in_at).toLocaleString("th-TH")} />}
          </div>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button onClick={() => setSelected(null)} className="min-h-11 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-600">ปิด</button>
            {selected.status !== "cancelled" && <button onClick={() => void checkIn(selected)} disabled={updatingId === selected.id} className="min-h-11 rounded-xl bg-brand-blue px-4 text-sm font-bold text-white disabled:opacity-50">{selected.status === "checked_in" ? "ยกเลิกเช็กอิน" : "ยืนยันเช็กอิน"}</button>}
          </div>
        </section>
      </div>}
    </main>
  );
}

function Stat({ icon, label, value, detail, tone }: { icon: React.ReactNode; label: string; value: number; detail: string; tone: "blue" | "green" | "amber" | "slate" }) {
  const styles = {
    blue: "bg-blue-50 text-blue-700", green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700", slate: "bg-slate-100 text-slate-600",
  };
  return <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
    <div className="flex items-center justify-between gap-3"><span className="text-sm font-semibold text-slate-500">{label}</span><span className={`rounded-xl p-2.5 ${styles[tone]}`}>{icon}</span></div>
    <p className="mt-3 text-3xl font-black tracking-tight text-brand-navy">{value.toLocaleString("th-TH")}</p>
    <p className="mt-1 text-xs text-slate-400">{detail}</p>
  </div>;
}

function Status({ status }: { status: string }) {
  if (status === "checked_in") return <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" /> เช็กอินแล้ว</span>;
  if (status === "cancelled") return <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500">ยกเลิก</span>;
  return <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700"><Clock3 className="h-3.5 w-3.5" /> รอเช็กอิน</span>;
}

function Detail({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0">
    <span className="flex items-center gap-2 text-xs text-slate-400">{icon}{label}</span>
    <span className="max-w-[65%] text-right text-sm font-semibold text-slate-700">{value}</span>
  </div>;
}
