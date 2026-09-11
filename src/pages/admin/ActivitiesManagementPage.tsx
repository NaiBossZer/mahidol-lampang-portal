import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ImagePlus, Pencil, Plus, RefreshCw, Search, X } from "lucide-react";
import { toast } from "sonner";
import {
  createActivity,
  getAdminActivities,
  updateActivity,
  type ActivityWriteInput,
  type AdminActivity,
} from "@/services/api";

const blankActivity: ActivityWriteInput = {
  title: "",
  slug: "",
  summary: "",
  content: "",
  activityDate: new Date().toISOString().slice(0, 16),
  location: "",
  participantCount: 0,
  objective: "",
  process: "",
  outcome: "",
  impact: "",
  featuredImage: "",
  status: "draft",
};

const statusLabel: Record<ActivityWriteInput["status"], string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};

function statusClass(status: ActivityWriteInput["status"]) {
  if (status === "published") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === "archived") return "bg-slate-100 text-slate-600 border-slate-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
}

export function ActivitiesManagementPage() {
  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | ActivityWriteInput["status"]>("all");
  const [editing, setEditing] = useState<AdminActivity | null>(null);
  const [form, setForm] = useState<ActivityWriteInput>(blankActivity);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setActivities(await getAdminActivities());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "โหลดกิจกรรมไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return activities.filter((item) => {
      const matchesStatus = status === "all" || item.status === status;
      const matchesQuery = !normalized || `${item.title} ${item.slug} ${item.location ?? ""}`.toLowerCase().includes(normalized);
      return matchesStatus && matchesQuery;
    });
  }, [activities, query, status]);

  function openCreate() {
    setEditing(null);
    setForm({ ...blankActivity, activityDate: new Date().toISOString().slice(0, 16) });
    setOpen(true);
  }

  function openEdit(item: AdminActivity) {
    setEditing(item);
    setForm({ ...item });
    setOpen(true);
  }

  async function save() {
    if (!form.title.trim() || !form.slug.trim() || !form.activityDate) {
      toast.error("กรุณาระบุชื่อกิจกรรม, slug และวันที่");
      return;
    }
    setSaving(true);
    try {
      if (editing) await updateActivity({ ...form, id: editing.id });
      else await createActivity(form);
      toast.success(editing ? "อัปเดตกิจกรรมแล้ว" : "สร้างกิจกรรมแล้ว");
      setOpen(false);
      setEditing(null);
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "บันทึกกิจกรรมไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">Activity Management</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-brand-navy lg:text-3xl">จัดการกิจกรรม</h1>
          <p className="mt-1 text-sm text-slate-600">จัดการข้อมูลกิจกรรมหลัก ก่อนเชื่อมต่อรอบการจัดกิจกรรม (Occurrence)</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => void load()} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-brand-navy hover:bg-slate-50">
            <RefreshCw className="h-4 w-4" /> รีเฟรช
          </button>
          <button type="button" onClick={openCreate} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-navy px-4 text-sm font-bold text-white hover:opacity-95">
            <Plus className="h-4 w-4" /> เพิ่มกิจกรรม
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_180px]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <span className="sr-only">ค้นหากิจกรรม</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ค้นหาชื่อกิจกรรม, slug หรือสถานที่" className="dashboard-control w-full pl-10" />
        </label>
        <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="dashboard-control">
          <option value="all">ทุกสถานะ</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">กำลังโหลดกิจกรรม...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">ไม่พบกิจกรรมตามเงื่อนไข</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500">
                <tr>
                  <th className="px-5 py-3 text-left">กิจกรรม</th>
                  <th className="px-4 py-3 text-left">วันที่</th>
                  <th className="px-4 py-3 text-left">สถานที่</th>
                  <th className="px-4 py-3 text-center">ผู้เข้าร่วม</th>
                  <th className="px-4 py-3 text-center">สถานะ</th>
                  <th className="px-5 py-3 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {item.featuredImage ? <img src={item.featuredImage} alt="" className="h-12 w-16 rounded-lg object-cover" /> : <div className="grid h-12 w-16 place-items-center rounded-lg bg-slate-100 text-slate-400"><ImagePlus className="h-5 w-5" /></div>}
                        <div className="min-w-0"><p className="font-semibold text-slate-900">{item.title}</p><p className="mt-0.5 truncate text-xs text-slate-400">/{item.slug}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-slate-600"><span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-slate-400" />{new Date(item.activityDate).toLocaleDateString("th-TH")}</span></td>
                    <td className="max-w-[180px] truncate px-4 py-4 text-slate-600">{item.location || "—"}</td>
                    <td className="px-4 py-4 text-center font-semibold text-slate-700">{item.participantCount ?? 0}</td>
                    <td className="px-4 py-4 text-center"><span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass(item.status)}`}>{statusLabel[item.status]}</span></td>
                    <td className="px-5 py-4 text-right"><button type="button" onClick={() => openEdit(item)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-brand-navy hover:bg-slate-50"><Pencil className="h-3.5 w-3.5" />แก้ไข</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" role="dialog" aria-modal="true" aria-label={editing ? "แก้ไขกิจกรรม" : "เพิ่มกิจกรรม"}>
        <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><div><h2 className="text-lg font-bold text-brand-navy">{editing ? "แก้ไขกิจกรรม" : "เพิ่มกิจกรรม"}</h2><p className="text-xs text-slate-500">ข้อมูลกิจกรรมหลัก · ไม่รวม Occurrence</p></div><button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="ปิด"><X className="h-5 w-5" /></button></div>
          <div className="overflow-y-auto p-5">
            <div className="grid gap-4 md:grid-cols-2">
              {([
                ["title", "ชื่อกิจกรรม", "text"], ["slug", "Slug", "text"], ["activityDate", "วันที่และเวลา", "datetime-local"], ["location", "สถานที่", "text"], ["participantCount", "จำนวนผู้เข้าร่วม", "number"], ["featuredImage", "URL รูปภาพหลัก", "text"],
              ] as const).map(([key, label, type]) => <label key={key} className="block text-sm font-semibold text-slate-700">{label}<input type={type} value={String(form[key] ?? "").slice(0, type === "datetime-local" ? 16 : undefined)} onChange={(e) => setForm((current) => ({ ...current, [key]: key === "participantCount" ? Number(e.target.value) : e.target.value }))} className="dashboard-control mt-1 w-full" /></label>)}
              <label className="block text-sm font-semibold text-slate-700">สถานะ<select value={form.status} onChange={(e) => setForm((current) => ({ ...current, status: e.target.value as ActivityWriteInput["status"] }))} className="dashboard-control mt-1 w-full"><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {([
                ["summary", "สรุปกิจกรรม"], ["objective", "วัตถุประสงค์"], ["process", "กระบวนการ / กิจกรรมที่ดำเนินการ"], ["outcome", "ผลลัพธ์"], ["impact", "ผลกระทบ / ประโยชน์"], ["content", "รายละเอียดกิจกรรม"],
              ] as const).map(([key, label]) => <label key={key} className="block text-sm font-semibold text-slate-700 md:col-span-1">{label}<textarea rows={key === "content" ? 5 : 3} value={String(form[key] ?? "")} onChange={(e) => setForm((current) => ({ ...current, [key]: e.target.value }))} className="dashboard-control mt-1 w-full" /></label>)}
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4"><button type="button" onClick={() => setOpen(false)} className="min-h-11 rounded-xl border border-slate-200 px-4 text-sm font-semibold">ยกเลิก</button><button type="button" disabled={saving} onClick={() => void save()} className="min-h-11 rounded-xl bg-brand-navy px-5 text-sm font-bold text-white disabled:opacity-60">{saving ? "กำลังบันทึก..." : "บันทึกกิจกรรม"}</button></div>
        </div>
      </div>}
    </section>
  );
}
