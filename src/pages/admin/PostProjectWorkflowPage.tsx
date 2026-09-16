import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ImagePlus, Loader2, Newspaper, Rocket, Sparkles, Upload, X } from "lucide-react";
import { toast } from "sonner";
import {
  getAdminActivities,
  updateActivity,
  type AdminActivity,
} from "@/services/api";
import { generateAiPostProjectReport } from "@/services/admin-ai-workflow";

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
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [satisfactionScore, setSatisfactionScore] = useState<number | null>(null);
  const [participantCount, setParticipantCount] = useState<number>(0);
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

  const projectActivities = useMemo(
    () => activities.filter((x) => x.status !== "archived"),
    [activities],
  );

  const selected = projectActivities.find((x) => x.id === selectedId) ?? null;

  useEffect(() => {
    if (!selected) return;
    setForm({
      summary: selected.summary ?? "",
      content: selected.content ?? "",
      outcome: selected.outcome ?? "",
      impact: selected.impact ?? "",
      featuredImage: selected.featuredImage ?? "",
    });
    setParticipantCount(selected.participantCount || 0);
    setSatisfactionScore(null);
    void getMedia(selected.id).then(setMedia).catch(() => setMedia([]));
    setFiles([]);
  }, [selected?.id]);

  async function handleAiSynthesize() {
    if (!selected) return;
    setIsAiGenerating(true);
    try {
      const res = await generateAiPostProjectReport(selected.id);
      const r = res.report;
      setForm((prev) => ({
        ...prev,
        summary: r.summary || prev.summary,
        content: r.content || prev.content,
        outcome: r.performanceResults || prev.outcome,
        impact: r.outcomesAndImpact || prev.impact,
      }));
      if (typeof r.satisfactionPercent === "number") {
        setSatisfactionScore(r.satisfactionPercent);
      }
      if (typeof r.responseCount === "number" && r.responseCount > 0 && participantCount === 0) {
        setParticipantCount(r.responseCount);
      }
      toast.success("AI สังเคราะห์ร่างรายงานและข่าวประชาสัมพันธ์สำเร็จ");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "AI สังเคราะห์รายงานไม่สำเร็จ");
    } finally {
      setIsAiGenerating(false);
    }
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
        status: selected.status === "published" ? "published" : "draft",
        participantCount: participantCount || undefined,
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
          await updateActivity({
            id: selected.id,
            title: selected.title,
            slug: selected.slug,
            activityDate: selected.activityDate,
            status: selected.status === "published" ? "published" : "draft",
            featuredImage: uploaded[0].public_url,
          });
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
        participantCount: participantCount || undefined,
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
          <label className="text-sm font-semibold text-slate-700">เลือกกิจกรรม</label>
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className="dashboard-control mt-2 w-full">
            <option value="">เลือกกิจกรรม</option>
            {projectActivities.map((x) => <option key={x.id} value={x.id}>{x.title}</option>)}
          </select>
          {selected && (
            <div className="mt-4 space-y-2">
              <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                สถานะกิจกรรม: <strong className="text-slate-900">{selected.status === "published" ? "เผยแพร่แล้ว (Published)" : "แบบร่าง (Draft)"}</strong>
              </div>
              {satisfactionScore !== null && (
                <div className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-200">
                  คะแนนความพึงพอใจ: <strong className="text-emerald-950 font-bold">{satisfactionScore.toFixed(1)}%</strong>
                </div>
              )}
            </div>
          )}
        </aside>

        {!selected ? (
          <div className="grid min-h-[360px] place-items-center rounded-2xl border border-dashed border-slate-300 bg-white text-sm text-slate-500">เลือกกิจกรรมเพื่อเริ่มขั้นตอนหลังจบโครงการ</div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-brand-navy">{selected.title}</h2>
                  <p className="text-sm text-slate-500">{new Date(selected.activityDate).toLocaleDateString("th-TH")}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${selected.status === "published" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {selected.status === "published" ? "เผยแพร่อยู่บนเว็บไซต์" : "แบบร่างโครงการ"}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2"><ImagePlus className="h-5 w-5 text-emerald-600" /><h2 className="font-bold text-brand-navy">1. รูปภาพกิจกรรม (Post-Event Media)</h2></div>
              <p className="mt-1 text-xs text-slate-500">อัปโหลดภาพบรรยากาศโครงการ ภาพหมู่ หรือกิจกรรมปฏิบัติการ เพื่อนำไปใช้เป็นภาพข่าวและสื่อประชาสัมพันธ์</p>
              <label className="mt-4 flex min-h-28 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-sm font-semibold text-slate-600 hover:bg-slate-100"><Upload className="mr-2 h-5 w-5" />เพิ่มรูปภาพ<input type="file" accept="image/*" multiple className="hidden" onChange={(e) => setFiles(Array.from(e.target.files ?? []))} /></label>
              {files.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{files.map((file) => <span key={file.name} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs">{file.name}<button type="button" onClick={() => setFiles((x) => x.filter((f) => f !== file))}><X className="h-3 w-3" /></button></span>)}</div>}
              {media.length > 0 && <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{media.map((image) => <img key={image.id} src={image.public_url} alt={image.caption || "รูปกิจกรรม"} className="aspect-[4/3] w-full rounded-xl object-cover" />)}</div>}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2"><Newspaper className="h-5 w-5 text-sky-600" /><h2 className="font-bold text-brand-navy">2. สังเคราะห์รายงานและข่าวประชาสัมพันธ์</h2></div>
                <button
                  type="button"
                  onClick={() => void handleAiSynthesize()}
                  disabled={isAiGenerating || saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-violet-700 disabled:opacity-50 transition-colors"
                >
                  {isAiGenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5 text-amber-300" />}
                  {isAiGenerating ? "AI กำลังสังเคราะห์..." : "สังเคราะห์รายงานและข่าวด้วย AI"}
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="text-sm font-semibold text-slate-700">
                  จำนวนผู้เข้าร่วมจริง (คน)
                  <input
                    type="number"
                    min="0"
                    value={participantCount || ""}
                    onChange={(e) => setParticipantCount(parseInt(e.target.value, 10) || 0)}
                    placeholder="เช่น 45"
                    className="dashboard-control mt-1 w-full"
                  />
                </label>
                {satisfactionScore !== null && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs flex flex-col justify-center">
                    <span className="font-semibold text-emerald-800">ผลการประเมินความพึงพอใจเฉลี่ย</span>
                    <span className="text-lg font-black text-emerald-950 mt-0.5">{satisfactionScore.toFixed(1)}% (จากการสำรวจ)</span>
                  </div>
                )}
              </div>

              <div className="mt-4 grid gap-4">
                <label className="text-sm font-semibold text-slate-700">สรุปข่าวประชาสัมพันธ์ (PR Summary)<textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} rows={2} className="dashboard-control mt-1 w-full" placeholder="สรุปสาระสำคัญของกิจกรรมสำหรับเผยแพร่ข่าว" /></label>
                <label className="text-sm font-semibold text-slate-700">รายงาน / เนื้อหาข่าวฉบับสมบูรณ์<textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} className="dashboard-control mt-1 w-full" placeholder="เนื้อหาข่าว กิจกรรมที่เกิดขึ้น และเสียงสะท้อนจากชุมชน" /></label>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="text-sm font-semibold text-slate-700">ผลการดำเนินงาน (Outcome)<textarea value={form.outcome} onChange={(e) => setForm({ ...form, outcome: e.target.value })} rows={4} className="dashboard-control mt-1 w-full" placeholder="ผลผลิตและผลลัพธ์ที่เป็นรูปธรรม เช่น ผู้เข้าร่วมได้รับองค์ความรู้..." /></label>
                  <label className="text-sm font-semibold text-slate-700">ผลกระทบต่อชุมชน (Impact)<textarea value={form.impact} onChange={(e) => setForm({ ...form, impact: e.target.value })} rows={4} className="dashboard-control mt-1 w-full" placeholder="การต่อยอด การสร้างรายได้ หรือการเปลี่ยนแปลงเชิงบวกในพื้นที่" /></label>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button type="button" onClick={() => void saveReport()} disabled={saving || publishing} className="min-h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-brand-navy shadow-sm hover:bg-slate-50">
                  {saving ? "กำลังบันทึก..." : "บันทึกข้อมูลร่าง"}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2"><Rocket className="h-5 w-5 text-emerald-600" /><h2 className="font-bold text-brand-navy">3. เผยแพร่ขึ้นเว็บไซต์</h2></div>
              <p className="mt-1 text-sm text-slate-500">ตรวจสอบข้อมูล รูปภาพ และผลลัพธ์ให้เรียบร้อย เมื่อกดยืนยัน ข่าวสารและผลโครงการจะแสดงผลบนหน้าเว็บไซต์สาธารณะทันที</p>
              <div className="mt-4 flex justify-end">
                <button type="button" onClick={() => void publish()} disabled={publishing || saving || selected.status === "published"} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-navy px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">
                  <Rocket className="h-4 w-4" />
                  {selected.status === "published" ? "เผยแพร่แล้ว (Published)" : publishing ? "กำลังเผยแพร่..." : "เผยแพร่เว็บไซต์"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
