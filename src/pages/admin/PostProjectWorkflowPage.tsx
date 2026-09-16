import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ImagePlus, Newspaper, Rocket, Upload, X } from "lucide-react";
import { toast } from "sonner";
import {
  getAdminActivities,
  updateActivity,
  type AdminActivity,
} from "@/services/api";

type ActivityMedia = {
  id: string;
  public_url: string;
  caption?: string | null;
  is_post_event?: boolean;
  status?: string;
};

async function getMedia(activityId: string): Promise<ActivityMedia[]> {
  const response = await fetch(`/api/admin/activity-media?activityId=${encodeURIComponent(activityId)}`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error || "โหลดรูปภาพไม่สำเร็จ");
  return Array.isArray(body.data) ? body.data : [];
}

async function uploadMedia(activityId: string, file: File): Promise<ActivityMedia> {
  const form = new FormData();
  form.set("activityId", activityId);
  form.set("file", file);
  form.set("isPostEvent", "true");
  const response = await fetch("/api/admin/activity-media", {
    method: "POST",
    credentials: "include",
    body: form,
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error || "อัปโหลดรูปภาพไม่สำเร็จ");
  return body.data as ActivityMedia;
}

export function PostProjectWorkflowPage() {
  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [media, setMedia] = useState<ActivityMedia[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [form, setForm] = useState({ summary: "", content: "", outcome: "", impact: "", featuredImage: "" });

  async function load() {
    setLoading(true);
    try {
      const rows = await getAdminActivities();
      setActivities(rows);
      if (!selectedId && rows[0]?.id) setSelectedId(rows[0].id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "โหลดกิจกรรมไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  const completedActivities = useMemo(
    () => activities.filter((x) => x.status === "completed" || x.status === "published"),
    [activities],
  );

  const selected = completedActivities.find((x) => x.id === selectedId) ?? null;

  useEffect(() => {
    if (!selected) return;
    setForm({
      summary: selected.summary ?? "",
      content: selected.content ?? "",
      outcome: selected.outcome ?? "",
      impact: selected.impact ?? "",
      featuredImage: selected.featuredImage ?? "",
    });
    void getMedia(selected.id).then(setMedia).catch(() => setMedia([]));
    setFiles([]);
  }, [selected?.id]);

  async function markCompleted() {
    if (!selected) return;
    if (selected.status === "completed") return;
    setSaving(true);
    try {
      await updateActivity({ id: selected.id, title: selected.title, slug: selected.slug, activityDate: selected.activityDate, status: "completed" });
      toast.success("บันทึกสถานะเสร็จสิ้นโครงการแล้ว");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "เปลี่ยนสถานะไม่สำเร็จ");
    } finally { setSaving(false); }
  }

  async function saveReport() {
    if (!selected) return;
    setSaving(true);
    try {
      await updateActivity({
        id: selected.id,
        title: selected.title,
        slug: selected.slug,
        activityDate: selected.activityDate,
        status: selected.status === "published" ? "published" : "completed",
        summary: form.summary,
        content: form.content,
        outcome: form.outcome,
        impact: form.impact,
        featuredImage: form.featuredImage,
      });
      if (files.length) {
        const uploaded: ActivityMedia[] = [];
        for (const file of files) uploaded.push(await uploadMedia(selected.id, file));
        setMedia((current) => [...uploaded, ...current]);
        if (!form.featuredImage && uploaded[0]?.public_url) {
          setForm((current) => ({ ...current, featuredImage: uploaded[0].public_url }));
          await updateActivity({ id: selected.id, title: selected.title, slug: selected.slug, activityDate: selected.activityDate, status: selected.status === "published" ? "published" : "completed", featuredImage: uploaded[0].public_url });
        }
        setFiles([]);
      }
      toast.success("บันทึกรายงานและรูปภาพแล้ว");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "บันทึกรายงานไม่สำเร็จ");
    } finally { setSaving(false); }
  }

  async function publish() {
    if (!selected) return;
    if (!form.content.trim()) {
      toast.error("กรุณาเขียนรายงาน/ข่าวก่อนเผยแพร่");
      return;
    }
    setPublishing(true);
    try {
      await updateActivity({
        id: selected.id,
        title: selected.title,
        slug: selected.slug,
        activityDate: selected.activityDate,
        status: "published",
        summary: form.summary,
        content: form.content,
        outcome: form.outcome,
        impact: form.impact,
        featuredImage: form.featuredImage,
      });
      toast.success("เผยแพร่กิจกรรมขึ้นเว็บไซต์แล้ว");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "เผยแพร่ไม่สำเร็จ");
    } finally { setPublishing(false); }
  }

  if (loading) return <div className="p-10 text-center text-sm text-slate-500">กำลังโหลดกิจกรรม...</div>;

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">Post-Project Workflow</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-brand-navy lg:text-3xl">ปิดโครงการและเผยแพร่กิจกรรม</h1>
          <p className="mt-1 text-sm text-slate-600">เสร็จสิ้นโครงการ → รูปภาพ → รายงาน/ข่าว → ตรวจสอบ → เผยแพร่เว็บไซต์</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <label className="text-sm font-semibold text-slate-700">กิจกรรมที่เสร็จสิ้น</label>
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className="dashboard-control mt-2 w-full">
            <option value="">เลือกกิจกรรม</option>
            {completedActivities.map((x) => <option key={x.id} value={x.id}>{x.title}</option>)}
          </select>
          {selected && <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">สถานะปัจจุบัน: <strong>{selected.status === "published" ? "เผยแพร่แล้ว" : "เสร็จสิ้นโครงการ"}</strong></div>}
        </aside>

        {!selected ? (
          <div className="grid min-h-[360px] place-items-center rounded-2xl border border-dashed border-slate-300 bg-white text-sm text-slate-500">เลือกกิจกรรมเพื่อเริ่มขั้นตอนหลังจบโครงการ</div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><h2 className="text-lg font-bold text-brand-navy">{selected.title}</h2><p className="text-sm text-slate-500">{new Date(selected.activityDate).toLocaleDateString("th-TH")}</p></div>
                <button type="button" onClick={() => void markCompleted()} disabled={saving || selected.status === "completed" || selected.status === "published"} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"><CheckCircle2 className="h-4 w-4" />{selected.status === "completed" || selected.status === "published" ? "เสร็จสิ้นแล้ว" : "เสร็จสิ้นโครงการ"}</button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2"><ImagePlus className="h-5 w-5 text-emerald-600" /><h2 className="font-bold text-brand-navy">2. บันทึกรูปภาพกิจกรรม</h2></div>
              <p className="mt-1 text-xs text-slate-500">มีรูปภาพให้อัปโหลดได้ หากไม่มีสามารถข้ามขั้นตอนนี้ได้</p>
              <label className="mt-4 flex min-h-28 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-sm font-semibold text-slate-600 hover:bg-slate-100"><Upload className="mr-2 h-5 w-5" />เพิ่มรูปภาพ<input type="file" accept="image/*" multiple className="hidden" onChange={(e) => setFiles(Array.from(e.target.files ?? []))} /></label>
              {files.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{files.map((file) => <span key={file.name} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs">{file.name}<button type="button" onClick={() => setFiles((x) => x.filter((f) => f !== file))}><X className="h-3 w-3" /></button></span>)}</div>}
              {media.length > 0 && <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{media.map((image) => <img key={image.id} src={image.public_url} alt={image.caption || "รูปกิจกรรม"} className="aspect-[4/3] w-full rounded-xl object-cover" />)}</div>}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2"><Newspaper className="h-5 w-5 text-sky-600" /><h2 className="font-bold text-brand-navy">3. เขียนรายงาน / ข่าวเกี่ยวกับกิจกรรม</h2></div>
              <div className="mt-4 grid gap-4">
                <label className="text-sm font-semibold text-slate-700">สรุปข่าว<textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} rows={2} className="dashboard-control mt-1 w-full" placeholder="สรุปสาระสำคัญของกิจกรรม" /></label>
                <label className="text-sm font-semibold text-slate-700">รายงาน / เนื้อหาข่าว<textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} className="dashboard-control mt-1 w-full" placeholder="เขียนรายงานหรือข่าวเกี่ยวกับกิจกรรม" /></label>
                <div className="grid gap-4 md:grid-cols-2"><label className="text-sm font-semibold text-slate-700">ผลการดำเนินงาน<textarea value={form.outcome} onChange={(e) => setForm({ ...form, outcome: e.target.value })} rows={4} className="dashboard-control mt-1 w-full" /></label><label className="text-sm font-semibold text-slate-700">ผลกระทบ<textarea value={form.impact} onChange={(e) => setForm({ ...form, impact: e.target.value })} rows={4} className="dashboard-control mt-1 w-full" /></label></div>
              </div>
              <div className="mt-4 flex justify-end"><button type="button" onClick={() => void saveReport()} disabled={saving || publishing} className="min-h-10 rounded-xl border border-slate-200 px-4 text-sm font-bold text-brand-navy">บันทึกข้อมูล</button></div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2"><Rocket className="h-5 w-5 text-emerald-600" /><h2 className="font-bold text-brand-navy">4. ลงเว็บไซต์</h2></div>
              <p className="mt-1 text-sm text-slate-500">ตรวจสอบข้อมูลและรูปภาพให้เรียบร้อยก่อนเผยแพร่</p>
              <div className="mt-4 flex justify-end"><button type="button" onClick={() => void publish()} disabled={publishing || saving || selected.status === "published"} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-navy px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"><Rocket className="h-4 w-4" />{selected.status === "published" ? "เผยแพร่แล้ว" : publishing ? "กำลังเผยแพร่..." : "เผยแพร่เว็บไซต์"}</button></div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
