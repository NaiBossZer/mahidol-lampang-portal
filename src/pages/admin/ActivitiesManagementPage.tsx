import { useEffect, useMemo, useState, type ReactNode } from "react";
import { CalendarDays, CheckCircle2, Copy, ExternalLink, ImagePlus, Lightbulb, Pencil, Plus, RefreshCw, Settings2, Star, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import {
  createActivity,
  deleteActivity,
  getAdminActivities,
  updateActivity,
  type ActivityStatus,
  type ActivityWriteInput,
  type AdminActivity,
} from "@/services/api";
import { getAdminLearningCenters, type LearningCenter } from "@/services/admin-learning-centers";
import AIRecommendationsSidebar from "@/components/admin/AIRecommendationsSidebar";
import GoogleDriveImagePicker from "@/components/admin/GoogleDriveImagePicker";
import {
  AdminPageHeader,
  AdminButton,
  AdminFilterBar,
  AdminTable,
  AdminTableHeader,
  AdminTableRow,
  AdminStatusBadge,
  AdminLoadingState,
  AdminEmptyState,
} from "@/components/admin/ui/AdminPrimitives";

type ActivityMedia = {
  id: string;
  public_url: string;
  caption?: string | null;
  is_post_event?: boolean;
  status?: string;
};

type RegistrationSettings = {
  enabled: boolean;
  opensAt: string;
  closesAt: string;
  capacity: string;
  formFields: { email: boolean; organization: boolean; position: boolean; participantType: boolean };
  confirmationMessage: string;
};
const defaultRegistrationSettings: RegistrationSettings = {
  enabled: true, opensAt: "", closesAt: "", capacity: "",
  formFields: { email: true, organization: true, position: true, participantType: true },
  confirmationMessage: "ลงทะเบียนสำเร็จ ขอบคุณที่สนใจเข้าร่วมกิจกรรม",
};
function toDateTimeLocal(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}
type RelationState = {
  learningCenterIds: string[];
  organizations: Array<{ organizationId: string; organizerRole?: "primary" | "co" }>;
};

const blankActivity: ActivityWriteInput = {
  title: "",
  slug: "",
  summary: "",
  content: "",
  activityDate: new Date().toISOString().slice(0, 10),
  location: "",
  participantCount: 0,
  objective: "",
  process: "",
  outcome: "",
  impact: "",
  featuredImage: "",
  status: "draft",
};

const statusLabel: Record<ActivityStatus, string> = {
  draft: "ร่าง",
  published: "เผยแพร่",
  archived: "เก็บถาวร",
};

function statusTone(status: ActivityStatus): "success" | "warning" | "neutral" {
  return status === "published" ? "success" : status === "archived" ? "neutral" : "warning";
}

async function getRelations(activityId: string): Promise<RelationState> {
  const response = await fetch(
    `/api/admin/activity-relations?activityId=${encodeURIComponent(activityId)}`,
    { credentials: "include", headers: { Accept: "application/json" } },
  );
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error || "โหลดข้อมูลที่เกี่ยวข้องไม่สำเร็จ");
  return body.data as RelationState;
}

async function saveRelations(activityId: string, relation: RelationState) {
  const response = await fetch(
    `/api/admin/activity-relations?activityId=${encodeURIComponent(activityId)}`,
    {
      method: "PUT",
      credentials: "include",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(relation),
    },
  );
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error || "บันทึกข้อมูลที่เกี่ยวข้องไม่สำเร็จ");
}

async function getMedia(activityId: string): Promise<ActivityMedia[]> {
  const response = await fetch(
    `/api/admin/activity-media?activityId=${encodeURIComponent(activityId)}`,
    { credentials: "include", headers: { Accept: "application/json" } },
  );
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error || "โหลดรูปภาพไม่สำเร็จ");
  return Array.isArray(body?.data) ? body.data : [];
}

async function uploadMedia(activityId: string, file: File) {
  const form = new FormData();
  form.set("activityId", activityId);
  form.set("file", file);
  const response = await fetch("/api/admin/activity-media", {
    method: "POST",
    credentials: "include",
    body: form,
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error || "อัปโหลดรูปภาพไม่สำเร็จ");
  return body.data as ActivityMedia;
}

async function deleteMedia(id: string) {
  const response = await fetch(`/api/admin/activity-media?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error || "ลบรูปภาพไม่สำเร็จ");
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      <span>{label}{required ? <span className="ml-1 text-red-500">*</span> : null}</span>
      {children}
    </label>
  );
}

export function ActivitiesManagementPage() {
  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [centers, setCenters] = useState<LearningCenter[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | ActivityStatus>("all");
  const [edit, setEdit] = useState<AdminActivity | null>(null);
  const [form, setForm] = useState<ActivityWriteInput>(blankActivity);
  const [selectedCenters, setSelectedCenters] = useState<string[]>([]);
  const [organizers, setOrganizers] = useState<RelationState["organizations"]>([]);
  const [media, setMedia] = useState<ActivityMedia[]>([]);
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>([]);
  const [coverMediaId, setCoverMediaId] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingMedia, setDeletingMedia] = useState(false);
  const [recommendationActivity, setRecommendationActivity] = useState<AdminActivity | null>(null);
  const [registrationActivity, setRegistrationActivity] = useState<AdminActivity | null>(null);
  const [registrationSettings, setRegistrationSettings] = useState<RegistrationSettings>(defaultRegistrationSettings);
  const [registrationSettingsLoading, setRegistrationSettingsLoading] = useState(false);
  const [registrationSettingsSaving, setRegistrationSettingsSaving] = useState(false);

  async function openRegistrationSettings(activity: AdminActivity) {
    setRegistrationActivity(activity);
    setRegistrationSettings(defaultRegistrationSettings);
    setRegistrationSettingsLoading(true);
    try {
      const response = await fetch(`/api/admin/registration-settings?activityId=${encodeURIComponent(activity.id)}`, {
        credentials: "include", headers: { Accept: "application/json" },
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.error || "โหลดการตั้งค่าการลงทะเบียนไม่สำเร็จ");
      const data = body.data ?? {};
      setRegistrationSettings({
        enabled: data.enabled !== false,
        opensAt: toDateTimeLocal(data.opens_at),
        closesAt: toDateTimeLocal(data.closes_at),
        capacity: data.capacity == null ? "" : String(data.capacity),
        formFields: {
          email: data.form_fields?.email !== false,
          organization: data.form_fields?.organization !== false,
          position: data.form_fields?.position !== false,
          participantType: data.form_fields?.participantType !== false,
        },
        confirmationMessage: String(data.confirmation_message ?? defaultRegistrationSettings.confirmationMessage),
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "โหลดการตั้งค่าไม่สำเร็จ");
      setRegistrationActivity(null);
    } finally {
      setRegistrationSettingsLoading(false);
    }
  }

  async function saveRegistrationSettings() {
    if (!registrationActivity || registrationSettingsSaving) return;
    if (registrationSettings.opensAt && registrationSettings.closesAt &&
        new Date(registrationSettings.opensAt) >= new Date(registrationSettings.closesAt)) {
      toast.error("วันปิดรับสมัครต้องอยู่หลังวันเปิดรับสมัคร");
      return;
    }
    if (registrationSettings.capacity && (!Number.isInteger(Number(registrationSettings.capacity)) || Number(registrationSettings.capacity) < 1)) {
      toast.error("จำนวนรับสมัครต้องเป็นจำนวนเต็มตั้งแต่ 1 คนขึ้นไป");
      return;
    }
    setRegistrationSettingsSaving(true);
    try {
      const response = await fetch(`/api/admin/registration-settings?activityId=${encodeURIComponent(registrationActivity.id)}`, {
        method: "PUT", credentials: "include",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          enabled: registrationSettings.enabled,
          opensAt: registrationSettings.opensAt ? new Date(registrationSettings.opensAt).toISOString() : null,
          closesAt: registrationSettings.closesAt ? new Date(registrationSettings.closesAt).toISOString() : null,
          capacity: registrationSettings.capacity || null,
          formFields: registrationSettings.formFields,
          confirmationMessage: registrationSettings.confirmationMessage,
        }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.error || "บันทึกการตั้งค่าไม่สำเร็จ");
      toast.success("บันทึกการตั้งค่าการลงทะเบียนแล้ว");
      setRegistrationActivity(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "บันทึกการตั้งค่าไม่สำเร็จ");
    } finally {
      setRegistrationSettingsSaving(false);
    }
  }

  async function load() {
    setLoading(true);
    try {
      const rows = await getAdminActivities();
      setActivities(rows);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "โหลดกิจกรรมไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    void getAdminLearningCenters().then(setCenters).catch(() => setCenters([]));
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return activities.filter(
      (activity) =>
        (status === "all" || activity.status === status) &&
        (!needle || `${activity.title} ${activity.slug} ${activity.location ?? ""}`.toLowerCase().includes(needle)),
    );
  }, [activities, q, status]);

  function create() {
    setEdit(null);
    setForm({ ...blankActivity, activityDate: new Date().toISOString().slice(0, 10) });
    setSelectedCenters([]);
    setOrganizers([]);
    setMedia([]);
    setSelectedMediaIds([]);
    setCoverMediaId(null);
    setFiles([]);
    setOpen(true);
  }

  async function openEdit(activity: AdminActivity) {
    setEdit(activity);
    setForm({ ...activity, activityDate: activity.activityDate.slice(0, 10) });
    setFiles([]);
    setSelectedMediaIds([]);
    setCoverMediaId(null);
    setOpen(true);
    try {
      const [relation, images] = await Promise.all([getRelations(activity.id), getMedia(activity.id)]);
      setSelectedCenters(relation.learningCenterIds ?? []);
      setOrganizers(relation.organizations ?? []);
      setMedia(images);
      setCoverMediaId(
        activity.featuredImage
          ? images.find((image) => image.public_url === activity.featuredImage)?.id ?? null
          : null,
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "โหลดข้อมูลกิจกรรมเพิ่มเติมไม่สำเร็จ");
      setSelectedCenters([]);
      setOrganizers([]);
      setMedia([]);
    }
  }

  function close() {
    if (saving || uploading || deletingMedia) return;
    setOpen(false);
    setEdit(null);
    setFiles([]);
    setSelectedMediaIds([]);
    setCoverMediaId(null);
  }

  async function deleteSelectedMedia() {
    if (!selectedMediaIds.length || deletingMedia) return;
    if (!window.confirm(`ต้องการลบรูปภาพที่เลือก ${selectedMediaIds.length} รูปใช่หรือไม่?`)) return;
    setDeletingMedia(true);
    const ids = [...selectedMediaIds];
    const results = await Promise.allSettled(ids.map((id) => deleteMedia(id)));
    const failed = results.filter((result) => result.status === "rejected").length;
    const deleted = ids.length - failed;
    const failedIds = ids.filter((_, index) => results[index]?.status === "rejected");
    setMedia((current) => current.filter((image) => !ids.includes(image.id) || failedIds.includes(image.id)));
    if (coverMediaId && ids.includes(coverMediaId) && !failedIds.includes(coverMediaId)) {
      setCoverMediaId(null);
      setForm((current) => ({ ...current, featuredImage: "" }));
    }
    setSelectedMediaIds(failedIds);
    if (deleted) toast.success(`ลบรูปภาพสำเร็จ ${deleted} รูป`);
    if (failed) toast.error(`ลบรูปภาพไม่สำเร็จ ${failed} รูป`);
    setDeletingMedia(false);
  }

  async function removeActivity(activity: AdminActivity) {
    if (deletingId) return;
    const confirmed = window.confirm(
      `ยืนยันการลบกิจกรรม

"${activity.title}"

การดำเนินการนี้เป็นการลบถาวร ไม่ใช่การเก็บถาวร และจะลบข้อมูล/สื่อที่เกี่ยวข้องด้วย

ต้องการดำเนินการต่อหรือไม่?`,
    );
    if (!confirmed) return;

    setDeletingId(activity.id);
    try {
      await deleteActivity(activity.id);
      setActivities((current) => current.filter((item) => item.id !== activity.id));
      if (edit?.id === activity.id) close();
      toast.success("ลบกิจกรรมถาวรสำเร็จ");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ลบกิจกรรมไม่สำเร็จ");
    } finally {
      setDeletingId(null);
    }
  }

  async function save() {
    const title = form.title.trim();
    const activityDate = form.activityDate.slice(0, 10);
    if (!title || !/^\d{4}-\d{2}-\d{2}$/.test(activityDate)) {
      toast.error("กรุณาระบุชื่อกิจกรรมและวันที่ให้ถูกต้อง");
      return;
    }

    const participantCount = Math.max(0, Math.trunc(Number(form.participantCount ?? 0)));
    setSaving(true);
    const warnings: string[] = [];

    try {
      const payload: ActivityWriteInput = {
        ...form,
        title,
        activityDate,
        participantCount,
      };

      const saved = edit
        ? await updateActivity({ ...payload, id: edit.id })
        : await createActivity(payload);
      const activity = saved as AdminActivity;
      if (!activity?.id) throw new Error("ไม่พบรหัสกิจกรรมหลังบันทึก");

      if (edit || selectedCenters.length || organizers.length) {
        try {
          await saveRelations(activity.id, {
            learningCenterIds: selectedCenters,
            organizations: organizers,
          });
        } catch (error) {
          warnings.push(error instanceof Error ? `ข้อมูลความสัมพันธ์: ${error.message}` : "ข้อมูลความสัมพันธ์บันทึกไม่สำเร็จ");
        }
      }

      if (files.length) {
        setUploading(true);
        const results = await Promise.allSettled(files.map((file) => uploadMedia(activity.id, file)));
        const uploaded = results.flatMap((result) => result.status === "fulfilled" ? [result.value] : []);
        const failed = results.filter((result) => result.status === "rejected").length;
        if (uploaded.length) setMedia((current) => [...uploaded, ...current]);
        if (failed) warnings.push(`รูปภาพ: อัปโหลดไม่สำเร็จ ${failed} ไฟล์`);

        setFiles([]);
      }

      const refreshed = await getAdminActivities();
      setActivities(refreshed);
      const verified = refreshed.some((row) => row.id === activity.id);
      if (!verified) throw new Error("บันทึกแล้วแต่ Reload & Verify ไม่พบกิจกรรมที่เพิ่งบันทึก");

      setOpen(false);
      setEdit(null);
      setFiles([]);
      setSelectedMediaIds([]);
      setCoverMediaId(null);
      if (warnings.length) {
        toast.warning(`บันทึกกิจกรรมแล้ว แต่มีรายการย่อยที่ต้องตรวจสอบ ${warnings.length} รายการ`, {
          description: warnings.join(" | "),
        });
      } else {
        toast.success(edit ? "อัปเดตกิจกรรมสำเร็จ · Reload & Verify ผ่าน" : "สร้างกิจกรรมสำเร็จ · Reload & Verify ผ่าน");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "บันทึกกิจกรรมไม่สำเร็จ");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <AdminPageHeader
        eyebrow="ACTIVITIES"
        title="จัดการกิจกรรม"
        description="สร้างและแก้ไขกิจกรรมด้วยข้อมูลจริงจากแบบฟอร์มเดียว พร้อมตรวจสอบการบันทึกกลับจากเซิร์ฟเวอร์"
        actions={
          <>
            <AdminButton variant="secondary" icon={<RefreshCw className="h-4 w-4" />} onClick={() => void load()}>
              รีเฟรช
            </AdminButton>
            <AdminButton variant="primary" icon={<Plus className="h-4 w-4" />} onClick={create}>
              เพิ่มกิจกรรม
            </AdminButton>
          </>
        }
      />


      <AdminFilterBar search={q} onSearchChange={setQ} placeholder="ค้นหาชื่อกิจกรรม, รหัส URL หรือสถานที่">
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as typeof status)}
          className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-[#002d62] focus:ring-4 focus:ring-[#002d62]/10"
        >
          <option value="all">ทุกสถานะ</option>
          <option value="draft">ร่าง</option>
          <option value="published">เผยแพร่</option>
          <option value="archived">เก็บถาวร</option>
        </select>
      </AdminFilterBar>

      <AdminTable minWidth="820px">
        {loading ? (
          <AdminLoadingState label="กำลังโหลดกิจกรรม..." />
        ) : filtered.length === 0 ? (
          <AdminEmptyState
            title="ไม่พบกิจกรรมตามเงื่อนไข"
            description="ลองปรับเงื่อนไขการค้นหาหรือเพิ่มกิจกรรมใหม่"
            action={<AdminButton variant="primary" icon={<Plus className="h-4 w-4" />} onClick={create}>เพิ่มกิจกรรม</AdminButton>}
          />
        ) : (
          <>
            <AdminTableHeader>
              <tr>
                <th className="px-5 py-3 text-left">กิจกรรม</th>
                <th className="px-4 py-3 text-left">วันที่</th>
                <th className="px-4 py-3 text-left">สถานที่</th>
                <th className="px-4 py-3 text-center">ผู้เข้าร่วม</th>
                <th className="px-4 py-3 text-center">สถานะ</th>
                <th className="px-5 py-3 text-right">จัดการ</th>
              </tr>
            </AdminTableHeader>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((activity) => (
                <AdminTableRow key={activity.id}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {activity.featuredImage ? (
                        <img src={activity.featuredImage} alt="" className="h-12 w-16 rounded-lg object-cover" />
                      ) : (
                        <div className="grid h-12 w-16 place-items-center rounded-lg bg-slate-100 text-slate-400"><ImagePlus className="h-5 w-5" /></div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900">{activity.title}</p>
                        <p className="mt-0.5 truncate text-xs text-slate-400">/{activity.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                    <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-slate-400" />{new Date(activity.activityDate).toLocaleDateString("th-TH")}</span>
                  </td>
                  <td className="max-w-[180px] truncate px-4 py-4 text-slate-600">{activity.location || "—"}</td>
                  <td className="px-4 py-4 text-center font-semibold text-slate-700">{activity.participantCount ?? 0}</td>
                  <td className="px-4 py-4 text-center"><AdminStatusBadge tone={statusTone(activity.status)}>{statusLabel[activity.status]}</AdminStatusBadge></td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button type="button" onClick={() => void openRegistrationSettings(activity)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 text-xs font-semibold text-blue-800 transition-colors hover:bg-blue-100" title="ตั้งค่าการลงทะเบียน">
                        <Settings2 className="h-3.5 w-3.5" /><span className="hidden xl:inline">ตั้งค่าลงทะเบียน</span>
                      </button>
                      <button type="button" onClick={() => setRecommendationActivity(activity)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-2.5 text-xs font-semibold text-violet-700 transition-colors hover:bg-violet-100" title="ดูคำแนะนำจาก AI">
                        <Lightbulb className="h-3.5 w-3.5 text-amber-500" /><span className="hidden sm:inline">AI Advice</span>
                      </button>
                      <AdminButton variant="secondary" icon={<Pencil className="h-3.5 w-3.5" />} onClick={() => void openEdit(activity)} className="min-h-9 px-3 text-xs">แก้ไข</AdminButton>
                      <AdminButton
                        variant="danger"
                        icon={<Trash2 className="h-3.5 w-3.5" />}
                        onClick={() => void removeActivity(activity)}
                        disabled={deletingId === activity.id || !!deletingId}
                        className="min-h-9 px-3 text-xs"
                        title="ลบกิจกรรมถาวร"
                      >
                        {deletingId === activity.id ? "กำลังลบ..." : "ลบ"}
                      </AdminButton>
                    </div>
                  </td>
                </AdminTableRow>
              ))}
            </tbody>
          </>
        )}
      </AdminTable>

      {registrationActivity && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="registration-settings-title">
          <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div><p className="text-[10px] font-bold tracking-[0.16em] text-slate-400">REGISTRATION SETTINGS</p><h2 id="registration-settings-title" className="text-lg font-bold text-[#002d62]">ตั้งค่าการลงทะเบียน</h2><p className="mt-1 max-w-xl truncate text-xs text-slate-500">{registrationActivity.title}</p></div>
              <button type="button" onClick={() => setRegistrationActivity(null)} aria-label="ปิด" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            {registrationSettingsLoading ? <div className="grid min-h-56 place-items-center text-sm text-slate-500">กำลังโหลดการตั้งค่า...</div> : <>
              <div className="space-y-5 overflow-y-auto p-5">
                <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
                  <span><span className="block text-sm font-bold text-slate-800">เปิดรับลงทะเบียน</span><span className="mt-1 block text-xs text-slate-500">ปิดแล้วผู้เข้าร่วมจะไม่สามารถส่งแบบฟอร์มได้</span></span>
                  <input type="checkbox" checked={registrationSettings.enabled} onChange={(e) => setRegistrationSettings((s) => ({ ...s, enabled: e.target.checked }))} className="h-5 w-5 accent-[#12345b]" />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="วันและเวลาเริ่มรับสมัคร"><input type="datetime-local" value={registrationSettings.opensAt} onChange={(e) => setRegistrationSettings((s) => ({ ...s, opensAt: e.target.value }))} className="dashboard-control mt-1 w-full" /></Field>
                  <Field label="วันและเวลาปิดรับสมัคร"><input type="datetime-local" value={registrationSettings.closesAt} onChange={(e) => setRegistrationSettings((s) => ({ ...s, closesAt: e.target.value }))} className="dashboard-control mt-1 w-full" /></Field>
                  <Field label="จำนวนผู้สมัครสูงสุด"><input type="number" min="1" step="1" value={registrationSettings.capacity} onChange={(e) => setRegistrationSettings((s) => ({ ...s, capacity: e.target.value }))} className="dashboard-control mt-1 w-full" placeholder="ไม่จำกัดจำนวน" /></Field>
                </div>
                <div className="rounded-xl border border-slate-200 p-4">
                  <h3 className="text-sm font-bold text-slate-800">ช่องข้อมูลในแบบฟอร์ม</h3><p className="mt-1 text-xs text-slate-500">ชื่อ–นามสกุล เบอร์โทรศัพท์ และความยินยอม PDPA เป็นข้อมูลบังคับเสมอ</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {([{key:"email",label:"อีเมล"},{key:"organization",label:"หน่วยงาน / สังกัด"},{key:"position",label:"ตำแหน่ง / บทบาท"},{key:"participantType",label:"ประเภทผู้เข้าร่วม"}] as const).map((item) => (
                      <label key={item.key} className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={registrationSettings.formFields[item.key]} onChange={(e) => setRegistrationSettings((s) => ({ ...s, formFields: { ...s.formFields, [item.key]: e.target.checked } }))} className="h-4 w-4 accent-[#12345b]" />{item.label}</label>
                    ))}
                  </div>
                </div>
                <Field label="ข้อความหลังลงทะเบียนสำเร็จ"><textarea rows={3} maxLength={500} value={registrationSettings.confirmationMessage} onChange={(e) => setRegistrationSettings((s) => ({ ...s, confirmationMessage: e.target.value }))} className="dashboard-control mt-1 w-full" /></Field>
                <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                  <p className="text-xs font-bold text-blue-900">ลิงก์ลงทะเบียนสาธารณะ</p>
                  <p className="mt-1 break-all text-xs text-blue-800">{`${window.location.origin}/register/${registrationActivity.slug}`}</p>
                  <button type="button" onClick={() => { void navigator.clipboard.writeText(`${window.location.origin}/register/${registrationActivity.slug}`).then(() => toast.success("คัดลอกลิงก์แล้ว")).catch(() => toast.error("คัดลอกลิงก์ไม่สำเร็จ")); }} className="mt-3 inline-flex min-h-9 items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 text-xs font-semibold text-blue-800 hover:bg-blue-50"><Copy className="h-3.5 w-3.5" />คัดลอกลิงก์</button>
                  <a href={`/register/${registrationActivity.slug}`} target="_blank" rel="noreferrer" className="ml-2 inline-flex min-h-9 items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 text-xs font-semibold text-blue-800 hover:bg-blue-50"><ExternalLink className="h-3.5 w-3.5" />เปิดหน้าลงทะเบียน</a>
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4">
                <AdminButton variant="secondary" onClick={() => setRegistrationActivity(null)}>ยกเลิก</AdminButton>
                <AdminButton variant="primary" onClick={() => void saveRegistrationSettings()} disabled={registrationSettingsSaving}>{registrationSettingsSaving ? "กำลังบันทึก..." : "บันทึกการตั้งค่า"}</AdminButton>
              </div>
            </>}
          </div>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" role="dialog" aria-modal="true">
          <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">MANUAL ACTIVITY</p>
                <h2 className="text-lg font-bold text-[#002d62]">{edit ? "แก้ไขกิจกรรม" : "เพิ่มกิจกรรม"}</h2>
              </div>
              <button type="button" onClick={close} aria-label="ปิด" className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>

            <div className="overflow-y-auto p-5">
              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 text-xs leading-5 text-blue-900">
                กรอกข้อมูลหลักแล้วกดบันทึกได้ทันที ระบบจะบันทึกกิจกรรมก่อน แล้ว Reload & Verify จาก API อีกครั้ง เพื่อลดปัญหาการบันทึกบางส่วนล้มเหลว
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <Field label="ชื่อกิจกรรม" required>
                  <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="dashboard-control mt-1 w-full" placeholder="เช่น โครงการอบรมการจัดการสิ่งแวดล้อม" autoFocus />
                </Field>
                <Field label="รหัส URL ของกิจกรรม">
                  <input value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} className="dashboard-control mt-1 w-full" placeholder="เว้นว่างได้ ระบบสร้างรหัส URL ให้อัตโนมัติ" />
                  <p className="mt-1 text-xs font-normal text-slate-400">ใช้สำหรับสร้าง URL ของหน้ากิจกรรม ไม่ใช่สถานะหรือรหัสฐานข้อมูล</p>
                </Field>
                <Field label="วันที่" required>
                  <input type="date" value={form.activityDate.slice(0, 10)} onChange={(event) => setForm((current) => ({ ...current, activityDate: event.target.value }))} className="dashboard-control mt-1 w-full" />
                </Field>
                <Field label="สถานที่">
                  <input value={form.location ?? ""} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} className="dashboard-control mt-1 w-full" placeholder="เช่น ศูนย์มหิดล ลำปาง" />
                </Field>
                <Field label="จำนวนผู้เข้าร่วมจริง">
                  <input type="number" min="0" step="1" value={form.participantCount || ""} onChange={(event) => setForm((current) => ({ ...current, participantCount: Math.max(0, Math.trunc(Number(event.target.value) || 0)) }))} className="dashboard-control mt-1 w-full" placeholder="0" />
                </Field>
                <Field label="สถานะ">
                  <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as ActivityStatus }))} className="dashboard-control mt-1 w-full">
                    <option value="draft">ร่าง</option>
                    <option value="published">เผยแพร่</option>
                    <option value="archived">เก็บถาวร</option>
                  </select>
                </Field>
                <Field label="รูปภาพหน้าปกกิจกรรม">
                  <GoogleDriveImagePicker
                    value={form.featuredImage}
                    onChange={(url) => {
                      setCoverMediaId(null);
                      setForm((current) => ({ ...current, featuredImage: url }));
                    }}
                  />
                  <p className="mt-1.5 text-xs font-normal text-slate-500">
                    รูปปกต้องเลือกเองจาก Google Drive / URL หรือกด “ใช้เป็นรูปปก” จากรูปภาพกิจกรรมด้านล่าง
                    ระบบจะไม่เลือกรูปแรกให้อัตโนมัติ
                  </p>
                  {form.featuredImage ? (
                    <button
                      type="button"
                      onClick={() => {
                        setCoverMediaId(null);
                        setForm((current) => ({ ...current, featuredImage: "" }));
                      }}
                      className="mt-2 inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      <X className="h-3.5 w-3.5" />
                      ไม่ใช้รูปปก
                    </button>
                  ) : null}
                </Field>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {([
                  ["summary", "สรุปกิจกรรม", 3],
                  ["objective", "วัตถุประสงค์", 3],
                  ["process", "กระบวนการ / กิจกรรมที่ดำเนินการ", 4],
                  ["outcome", "ผลลัพธ์", 3],
                  ["impact", "ผลกระทบ / ประโยชน์", 3],
                  ["content", "รายละเอียดกิจกรรม", 6],
                ] as const).map(([key, label, rows]) => (
                  <Field key={key} label={label}>
                    <textarea rows={rows} value={String(form[key] ?? "")} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} className="dashboard-control mt-1 w-full" />
                  </Field>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-bold text-[#002d62]">ศูนย์การเรียนรู้ที่เกี่ยวข้อง</h3>
                <p className="mt-1 text-xs text-slate-500">เลือกจาก Master Data ได้ทันที หากไม่มีข้อมูลสามารถข้ามส่วนนี้ได้</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {centers.length ? centers.map((center) => (
                    <label key={center.id} className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                      <input type="checkbox" checked={selectedCenters.includes(center.id)} onChange={(event) => setSelectedCenters((current) => event.target.checked ? [...new Set([...current, center.id])] : current.filter((id) => id !== center.id))} />
                      {center.name}
                    </label>
                  )) : <p className="text-sm text-slate-500">ยังไม่มีข้อมูลศูนย์การเรียนรู้</p>}
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#002d62]">รูปภาพกิจกรรม</h3>
                    <p className="mt-1 text-xs text-slate-500">JPEG, PNG หรือ WebP ไม่เกิน 10MB/ไฟล์ · เลือกรูปที่ต้องการลบได้จากภาพด้านล่าง</p>
                  </div>
                  <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-[#002d62] transition-colors hover:bg-slate-50">
                    <Upload className="h-4 w-4" />เพิ่มรูป
                    <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" onChange={(event) => setFiles(Array.from(event.target.files ?? []))} />
                  </label>
                </div>
                {files.length > 0 && <p className="mt-3 text-xs font-medium text-emerald-700">เตรียมอัปโหลด {files.length} ไฟล์เมื่อกดบันทึก</p>}
                {media.length > 0 && (
                  <>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                      <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          checked={media.length > 0 && selectedMediaIds.length === media.length}
                          onChange={(event) => setSelectedMediaIds(event.target.checked ? media.map((image) => image.id) : [])}
                        />
                        เลือกทั้งหมด
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">เลือกแล้ว {selectedMediaIds.length} รูป</span>
                        <button
                          type="button"
                          disabled={!selectedMediaIds.length || deletingMedia}
                          onClick={() => void deleteSelectedMedia()}
                          className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          {deletingMedia ? "กำลังลบ..." : "ลบที่เลือก"}
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                      {media.map((image) => {
                        const selected = selectedMediaIds.includes(image.id);
                        const isCover = coverMediaId === image.id;
                        return (
                          <div
                            key={image.id}
                            className={`relative overflow-hidden rounded-xl border-2 bg-white transition ${selected ? "border-red-400 ring-2 ring-red-100" : isCover ? "border-amber-400 ring-2 ring-amber-100" : "border-slate-200 hover:border-slate-300"}`}
                          >
                            <img src={image.public_url} alt={image.caption ?? "ภาพกิจกรรม"} className="aspect-[4/3] w-full object-cover" />
                            <label className="absolute left-2 top-2 rounded-md bg-white/95 p-1.5 shadow-sm">
                              <input
                                type="checkbox"
                                checked={selected}
                                onChange={(event) =>
                                  setSelectedMediaIds((current) =>
                                    event.target.checked
                                      ? [...new Set([...current, image.id])]
                                      : current.filter((id) => id !== image.id),
                                  )
                                }
                                aria-label="เลือกรูปภาพเพื่อจัดการ"
                              />
                            </label>
                            {isCover ? (
                              <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-amber-500 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
                                <CheckCircle2 className="h-3 w-3" />
                                รูปปก
                              </span>
                            ) : null}
                            {selected && !isCover ? (
                              <span className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white">
                                <Trash2 className="h-3 w-3" />
                              </span>
                            ) : null}
                            <div className="border-t border-slate-100 bg-white p-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setCoverMediaId(image.id);
                                  setForm((current) => ({ ...current, featuredImage: image.public_url }));
                                }}
                                disabled={isCover || saving || deletingMedia}
                                className="inline-flex min-h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1.5 text-xs font-semibold text-amber-800 transition-colors hover:bg-amber-100 disabled:cursor-default disabled:opacity-70"
                              >
                                <Star className="h-3.5 w-3.5" />
                                {isCover ? "ใช้เป็นรูปปกแล้ว" : "ใช้เป็นรูปปก"}
                              </button>
                              {image.caption ? (
                                <p className="mt-1.5 truncate text-xs text-slate-500">{image.caption}</p>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-400">* ชื่อกิจกรรมและวันที่เป็นข้อมูลจำเป็น</p>
              <div className="flex justify-end gap-2">
                <AdminButton variant="secondary" onClick={close} disabled={saving || uploading || deletingMedia}>ยกเลิก</AdminButton>
                <AdminButton variant="primary" onClick={() => void save()} disabled={saving || uploading || deletingMedia}>
                  {uploading ? "กำลังอัปโหลดรูป..." : saving ? "กำลังบันทึกและตรวจสอบ..." : edit ? "บันทึกการแก้ไข" : "บันทึกกิจกรรม"}
                </AdminButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {recommendationActivity && (
        <AIRecommendationsSidebar
          isOpen={!!recommendationActivity}
          onClose={() => setRecommendationActivity(null)}
          activityId={recommendationActivity.id}
          activityTitle={recommendationActivity.title}
        />
      )}
    </section>
  );
}
