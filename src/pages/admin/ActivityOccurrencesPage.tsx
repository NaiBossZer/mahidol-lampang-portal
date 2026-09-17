import { useEffect, useState } from "react";
import { CalendarDays, Plus, RefreshCw, Archive, X } from "lucide-react";
import { toast } from "sonner";
import { getAdminActivities, type AdminActivity } from "@/services/api";
import {
  archiveAdminOccurrence,
  createAdminOccurrence,
  getAdminOccurrences,
  type ActivityOccurrence,
} from "@/services/admin-occurrences";
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminTable,
  AdminTableHeader,
  AdminTableRow,
  AdminStatusBadge,
  AdminLoadingState,
  AdminEmptyState,
} from "@/components/admin/ui/AdminPrimitives";

const blank = {
  activityId: "",
  occurrenceNo: 1,
  startAt: "",
  endAt: "",
  status: "scheduled" as ActivityOccurrence["status"],
  participant_count: 0,
  location_type: "center" as NonNullable<ActivityOccurrence["location_type"]>,
  location_detail: "",
};
export function ActivityOccurrencesPage() {
  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [activityId, setActivityId] = useState("");
  const [items, setItems] = useState<ActivityOccurrence[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(blank);
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    try {
      const [a] = await Promise.all([getAdminActivities()]);
      setActivities(a);
      const selected = activityId || a[0]?.id || "";
      if (!activityId) setActivityId(selected);
      setItems(await getAdminOccurrences(selected));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  useEffect(() => {
    if (activityId)
      void getAdminOccurrences(activityId)
        .then(setItems)
        .catch(() => toast.error("โหลดรอบกิจกรรมไม่สำเร็จ"));
  }, [activityId]);
  function add() {
    const next =
      items.filter((x) => x.status !== "cancelled" && x.status !== "archived").length + 1;
    setForm({ ...blank, activityId, occurrenceNo: next });
    setOpen(true);
  }
  async function save() {
    if (!form.activityId || !form.startAt) {
      toast.error("กรุณาระบุกิจกรรมและเวลาเริ่ม");
      return;
    }
    try {
      await createAdminOccurrence(form);
      toast.success("สร้างรอบกิจกรรมแล้ว");
      setOpen(false);
      setItems(await getAdminOccurrences(activityId));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "บันทึกไม่สำเร็จ");
    }
  }
  async function archive(id: string) {
    try {
      await archiveAdminOccurrence(id);
      toast.success("เก็บรอบกิจกรรมแล้ว");
      setItems(await getAdminOccurrences(activityId));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "ดำเนินการไม่สำเร็จ");
    }
  }
  const selectedName = activities.find((a) => a.id === activityId)?.title ?? "กิจกรรม";
  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <AdminPageHeader
        eyebrow="OCCURRENCES"
        title="รอบกิจกรรม"
        description="จัดการการจัดกิจกรรมแต่ละครั้ง โดยไม่สร้าง Activity ซ้ำ"
        actions={
          <>
            <AdminButton variant="secondary" icon={<RefreshCw className="h-4 w-4" />} onClick={() => void load()}>
              รีเฟรช
            </AdminButton>
            <AdminButton variant="primary" icon={<Plus className="h-4 w-4" />} onClick={add} disabled={!activityId}>
              เพิ่มรอบ
            </AdminButton>
          </>
        }
      />
      <AdminCard className="mt-6" title="Activity">
        <select
          value={activityId}
          onChange={(e) => setActivityId(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#002d62] focus:ring-4 focus:ring-[#002d62]/10"
        >
          {activities.map((a) => (
            <option key={a.id} value={a.id}>
              {a.title}
            </option>
          ))}
        </select>
      </AdminCard>
      <AdminTable className="mt-4" minWidth="760px">
        {loading ? (
          <AdminLoadingState label="กำลังโหลด..." />
        ) : items.filter((x) => !["cancelled", "archived"].includes(x.status)).length === 0 ? (
          <AdminEmptyState
            title="ยังไม่มีรอบการจัดกิจกรรม"
            description={`สำหรับ ${selectedName}`}
            action={
              <AdminButton variant="primary" icon={<Plus className="h-4 w-4" />} onClick={add} disabled={!activityId}>
                เพิ่มรอบ
              </AdminButton>
            }
          />
        ) : (
          <>
            <AdminTableHeader>
              <tr>
                <th className="px-5 py-3 text-left">ครั้งที่</th>
                <th className="px-4 py-3 text-left">วันที่</th>
                <th className="px-4 py-3 text-left">สถานที่</th>
                <th className="px-4 py-3 text-center">ผู้เข้าร่วม</th>
                <th className="px-4 py-3 text-center">สถานะ</th>
                <th className="px-5 py-3 text-right">จัดการ</th>
              </tr>
            </AdminTableHeader>
            <tbody className="divide-y divide-slate-100">
              {items
                .filter((x) => !["cancelled", "archived"].includes(x.status))
                .map((x) => (
                  <AdminTableRow key={x.id}>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                        ครั้งที่ {x.occurrence_no}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4 text-slate-400" />
                        {new Date(x.start_at).toLocaleString("th-TH")}
                      </span>
                    </td>
                    <td className="max-w-[180px] truncate px-4 py-4 text-slate-600">
                      {x.location_detail || "ไม่ระบุสถานที่"}
                    </td>
                    <td className="px-4 py-4 text-center font-semibold text-slate-700">
                      {x.participant_count}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <AdminStatusBadge tone={x.status === "scheduled" ? "success" : "warning"}>
                        {x.status}
                      </AdminStatusBadge>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <AdminButton
                        variant="secondary"
                        icon={<Archive className="h-4 w-4" />}
                        onClick={() => void archive(x.id)}
                        className="min-h-9 px-3 text-xs"
                      >
                        เก็บ
                      </AdminButton>
                    </td>
                  </AdminTableRow>
                ))}
            </tbody>
          </>
        )}
      </AdminTable>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <h2 className="text-lg font-bold text-[#002d62]">เพิ่มรอบการจัดกิจกรรม</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="ปิด" className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">
                ครั้งที่
                <input
                  type="number"
                  min="1"
                  value={form.occurrenceNo}
                  onChange={(e) => setForm({ ...form, occurrenceNo: Number(e.target.value) })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#002d62] focus:ring-4 focus:ring-[#002d62]/10"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                เริ่ม
                <input
                  type="datetime-local"
                  value={form.startAt}
                  onChange={(e) => setForm({ ...form, startAt: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#002d62] focus:ring-4 focus:ring-[#002d62]/10"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                สิ้นสุด
                <input
                  type="datetime-local"
                  value={form.endAt}
                  onChange={(e) => setForm({ ...form, endAt: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#002d62] focus:ring-4 focus:ring-[#002d62]/10"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                ผู้เข้าร่วม
                <input
                  type="number"
                  min="0"
                  value={form.participant_count}
                  onChange={(e) => setForm({ ...form, participant_count: Number(e.target.value) })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#002d62] focus:ring-4 focus:ring-[#002d62]/10"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                รูปแบบสถานที่
                <select
                  value={form.location_type}
                  onChange={(e) =>
                    setForm({ ...form, location_type: e.target.value as typeof form.location_type })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#002d62] focus:ring-4 focus:ring-[#002d62]/10"
                >
                  <option value="center">Center</option>
                  <option value="learning_center">Learning Center</option>
                  <option value="external">External</option>
                  <option value="online">Online</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </label>
              <label className="text-sm font-semibold text-slate-700">
                รายละเอียดสถานที่
                <input
                  value={form.location_detail}
                  onChange={(e) => setForm({ ...form, location_detail: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#002d62] focus:ring-4 focus:ring-[#002d62]/10"
                />
              </label>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-200 p-5">
              <AdminButton variant="secondary" onClick={() => setOpen(false)}>
                ยกเลิก
              </AdminButton>
              <AdminButton variant="primary" onClick={() => void save()}>
                บันทึก
              </AdminButton>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
