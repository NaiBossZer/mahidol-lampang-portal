import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, CheckCircle2, ImagePlus, Loader2, Newspaper, Pencil, RefreshCw, Rocket, Save, Sparkles, Trash2, Upload, X } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { getAdminActivities, updateActivity, type AdminActivity } from "@/services/api";
import {
  createActivityOutcome,
  deleteActivityOutcome,
  getAdminActivityOutcomes,
  updateActivityOutcome,
  type ActivityOutcomeMetric,
} from "@/services/admin-activity-outcomes";
import {
  generateAiPostProjectReport,
  type PostProjectReport,
} from "@/services/admin-ai-workflow";

type ActivityMedia = { id: string; public_url: string; caption?: string | null; is_post_event?: boolean; status?: string };

type OutcomeMetricForm = {
  metricName: string;
  value: string;
  unit: string;
  description: string;
};

async function getMedia(activityId: string): Promise<ActivityMedia[]> {
  const response = await fetch(`/api/admin/activity-media?activityId=${encodeURIComponent(activityId)}`, { credentials: "include", headers: { Accept: "application/json" } });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error || "โหลดรูปภาพไม่สำเร็จ");
  return Array.isArray(body?.data) ? body.data : [];
}

async function uploadMedia(activityId: string, file: File): Promise<ActivityMedia> {
  const form = new FormData();
  form.set("activityId", activityId);
  form.set("file", file);
  form.set("isPostEvent", "true");
  const response = await fetch("/api/admin/activity-media", { method: "POST", credentials: "include", body: form });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error || "อัปโหลดรูปภาพไม่สำเร็จ");
  return body.data as ActivityMedia;
}

const steps = [
  [6, "Outcome Capture", "รวบรวมผลลัพธ์"],
  [7, "AI Report", "สังเคราะห์รายงาน"],
  [8, "Publish Review", "ตรวจสอบก่อนเผยแพร่"],
  [9, "Publish & Archive", "เผยแพร่และปิดงาน"],
] as const;

const emptyOutcomeMetric: OutcomeMetricForm = {
  metricName: "",
  value: "",
  unit: "",
  description: "",
};

function StepRail({ active }: { active: number }) {
  return <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{steps.map(([id, title, subtitle]) => <div key={id} className={`flex items-center gap-3 rounded-xl border px-3 py-3 ${active === id ? "border-violet-200 bg-violet-50" : id < active ? "border-emerald-200 bg-emerald-50" : "border-white/10 bg-white/5"}`}><div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${id < active ? "bg-emerald-100 text-emerald-700" : active === id ? "bg-[#002d62] text-white" : "bg-white/10 text-blue-100"}`}>{id < active ? <Check className="h-4 w-4" /> : id}</div><div className="min-w-0"><p className={`truncate text-xs font-bold ${active === id ? "text-[#002d62]" : id < active ? "text-emerald-800" : "text-white"}`}>{title}</p><p className={`truncate text-[10px] ${active === id ? "text-violet-600" : "text-blue-100/60"}`}>{subtitle}</p></div></div>)}</div>;
}

function Card({ title, eyebrow, icon, children }: { title: string; eyebrow: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-6"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">{icon}</div><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-500">{eyebrow}</p><h2 className="text-sm font-bold text-slate-900">{title}</h2></div></div><div className="p-5 sm:p-6">{children}</div></section>;
}

export function AIStudioOutcomeWorkspacePage() {
  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [activeStep, setActiveStep] = useState<6 | 7 | 8 | 9>(6);
  const [media, setMedia] = useState<ActivityMedia[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [outcomes, setOutcomes] = useState<ActivityOutcomeMetric[]>([]);
  const [outcomeMetric, setOutcomeMetric] = useState<OutcomeMetricForm>(emptyOutcomeMetric);
  const [editingOutcomeId, setEditingOutcomeId] = useState<string | null>(null);
  const [outcomeSaving, setOutcomeSaving] = useState(false);
  const [outcomeReloading, setOutcomeReloading] = useState(false);
  const [outcomeSyncedAt, setOutcomeSyncedAt] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [report, setReport] = useState<PostProjectReport | null>(null);
  const [participantCount, setParticipantCount] = useState(0);
  const [form, setForm] = useState({ summary: "", content: "", outcome: "", impact: "", featuredImage: "" });
  const [review, setReview] = useState({ dataVerified: false, narrativeReviewed: false, mediaSelected: false, pdpaChecked: false });

  const selected = useMemo(() => activities.find((x) => x.id === selectedId) ?? null, [activities, selectedId]);
  const reviewReady = Object.values(review).every(Boolean);
  const outcomeReady = participantCount > 0 && outcomes.length > 0;
  const reportReady = Boolean(report || form.content);
  const outcomeSaveReady = Boolean(outcomeMetric.metricName.trim() && outcomeMetric.value.trim());

  async function reloadOutcomes(activityId = selectedId) {
    if (!activityId) return;
    setOutcomeReloading(true);
    try {
      const rows = await getAdminActivityOutcomes(activityId);
      setOutcomes(rows);
      setOutcomeSyncedAt(Date.now());
      return rows;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "โหลด Outcome Metrics ไม่สำเร็จ");
      throw error;
    } finally {
      setOutcomeReloading(false);
    }
  }

  async function load() {
    setLoading(true);
    try {
      const rows = await getAdminActivities();
      const valid = rows.filter((x) => x.status !== "archived");
      setActivities(valid);
      if (!selectedId && valid[0]?.id) setSelectedId(valid[0].id);
    } catch (error) { toast.error(error instanceof Error ? error.message : "โหลดกิจกรรมไม่สำเร็จ"); }
    finally { setLoading(false); }
  }

  useEffect(() => { void load(); }, []);
  useEffect(() => {
    if (!selected) return;
    setParticipantCount(selected.participantCount || 0);
    setForm({ summary: selected.summary ?? "", content: selected.content ?? "", outcome: selected.outcome ?? "", impact: selected.impact ?? "", featuredImage: selected.featuredImage ?? "" });
    setReport(null);
    setReview({ dataVerified: false, narrativeReviewed: false, mediaSelected: false, pdpaChecked: false });
    setOutcomeMetric(emptyOutcomeMetric);
    setEditingOutcomeId(null);
    setOutcomeSyncedAt(null);
    void Promise.all([getMedia(selected.id), getAdminActivityOutcomes(selected.id)])
      .then(([mediaRows, outcomeRows]) => {
        setMedia(mediaRows);
        setOutcomes(outcomeRows);
        setOutcomeSyncedAt(Date.now());
      })
      .catch(() => {
        setMedia([]);
        setOutcomes([]);
      });
  }, [selected?.id]);

  async function captureFiles() {
    if (!selected || !files.length) return;
    setSaving(true);
    try {
      const uploaded: ActivityMedia[] = [];
      for (const file of files) uploaded.push(await uploadMedia(selected.id, file));
      setMedia((current) => [...uploaded, ...current]);
      setFiles([]);
      toast.success("บันทึก Post-event media แล้ว");
    } catch (error) { toast.error(error instanceof Error ? error.message : "อัปโหลดรูปภาพไม่สำเร็จ"); }
    finally { setSaving(false); }
  }

  async function saveOutcomeMetric() {
    if (!selected || !outcomeSaveReady) return;
    setOutcomeSaving(true);
    try {
      const input = {
        activityId: selected.id,
        metricName: outcomeMetric.metricName.trim(),
        value: outcomeMetric.value.trim(),
        unit: outcomeMetric.unit.trim(),
        description: outcomeMetric.description.trim(),
      };
      if (editingOutcomeId) {
        await updateActivityOutcome(editingOutcomeId, input);
        toast.success("อัปเดต Outcome Metric แล้ว");
      } else {
        await createActivityOutcome(input);
        toast.success("บันทึก Outcome Metric แล้ว");
      }
      setOutcomeMetric(emptyOutcomeMetric);
      setEditingOutcomeId(null);
      const rows = await reloadOutcomes(selected.id);
      if (rows) toast.success(`Reload & Verify สำเร็จ · ${rows.length} metrics ที่ยืนยันจากเซิร์ฟเวอร์`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "บันทึก Outcome Metric ไม่สำเร็จ");
    } finally {
      setOutcomeSaving(false);
    }
  }

  function editOutcomeMetric(metric: ActivityOutcomeMetric) {
    setEditingOutcomeId(metric.id);
    setOutcomeMetric({
      metricName: metric.metric_name,
      value: metric.metric_value ?? "",
      unit: metric.unit ?? "",
      description: metric.description ?? "",
    });
  }

  async function removeOutcomeMetric(id: string) {
    if (!selected) return;
    if (!window.confirm("ยืนยันการลบ Outcome Metric นี้หรือไม่?")) return;
    setOutcomeSaving(true);
    try {
      await deleteActivityOutcome(id);
      if (editingOutcomeId === id) {
        setEditingOutcomeId(null);
        setOutcomeMetric(emptyOutcomeMetric);
      }
      const rows = await reloadOutcomes(selected.id);
      toast.success(`ลบ Outcome Metric แล้ว · Reload & Verify เหลือ ${rows?.length ?? 0} metrics`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ลบ Outcome Metric ไม่สำเร็จ");
    } finally {
      setOutcomeSaving(false);
    }
  }

  function cancelOutcomeEdit() {
    setEditingOutcomeId(null);
    setOutcomeMetric(emptyOutcomeMetric);
  }

  async function runReport() {
    if (!selected) return;
    setAiLoading(true);
    try {
      const result = await generateAiPostProjectReport(selected.id);
      const r = result.report;
      setReport(r);
      setForm((prev) => ({ ...prev, summary: r.summary || prev.summary, content: r.content || prev.content, outcome: r.performanceResults || prev.outcome, impact: r.outcomesAndImpact || prev.impact }));
      if (typeof r.responseCount === "number" && r.responseCount > 0) setParticipantCount((current) => current || r.responseCount!);
      toast.success("AI สังเคราะห์รายงานผลสัมฤทธิ์สำเร็จ");
    } catch (error) { toast.error(error instanceof Error ? error.message : "AI สังเคราะห์รายงานไม่สำเร็จ"); }
    finally { setAiLoading(false); }
  }

  async function saveDraft() {
    if (!selected) return;
    setSaving(true);
    try {
      await updateActivity({ id: selected.id, title: selected.title, slug: selected.slug, activityDate: selected.activityDate, status: selected.status === "published" ? "published" : "draft", participantCount: participantCount || undefined, summary: form.summary, content: form.content, outcome: form.outcome, impact: form.impact, featuredImage: form.featuredImage });
      if (files.length) await captureFiles();
      toast.success("บันทึกร่างผลสัมฤทธิ์แล้ว");
      await load();
    } catch (error) { toast.error(error instanceof Error ? error.message : "บันทึกร่างไม่สำเร็จ"); }
    finally { setSaving(false); }
  }

  async function publish() {
    if (!selected || !reviewReady || !form.content.trim()) return;
    setPublishing(true);
    try {
      await updateActivity({ id: selected.id, title: selected.title, slug: selected.slug, activityDate: selected.activityDate, status: "published", participantCount: participantCount || undefined, summary: form.summary, content: form.content, outcome: form.outcome, impact: form.impact, featuredImage: form.featuredImage });
      toast.success("เผยแพร่กิจกรรมและรายงานผลสัมฤทธิ์แล้ว");
      setActiveStep(9); await load();
    } catch (error) { toast.error(error instanceof Error ? error.message : "เผยแพร่ไม่สำเร็จ"); }
    finally { setPublishing(false); }
  }

  if (loading) return <div className="min-h-[40vh] bg-[#f8f9ff] p-10 text-center text-sm text-slate-500">กำลังโหลด AI Studio...</div>;

  return <section className="min-h-[calc(100vh-4rem)] bg-[#f8f9ff] px-4 py-5 sm:px-6 lg:px-8"><div className="mx-auto max-w-[1400px] space-y-5">
    <header className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#002d62] via-[#0c2340] to-[#00152f] text-white shadow-sm"><div className="px-5 py-6 sm:px-7 sm:py-7"><div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-sky-100"><Sparkles className="h-3.5 w-3.5 text-sky-300" /> AI STUDIO WORKSPACE · PHASE 2</div><h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">รายงานผลสัมฤทธิ์ & เผยแพร่</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-blue-100">ต่อเนื่องจาก AI Studio Phase 1: รวบรวมผลจริง → สังเคราะห์รายงานด้วย AI → ตรวจสอบโดย ADMIN → เผยแพร่และปิดโครงการ</p></div><div className="flex flex-wrap gap-2 text-[11px]"><span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">AI Synthesis</span><span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">Human Review</span><span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">Publication</span><span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">Audit Ready</span></div></div><div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-3"><div className="flex flex-col gap-3 sm:flex-row sm:items-center"><span className="text-xs font-bold text-blue-100">Target Activity</span><select value={selectedId} onChange={(e) => { setSelectedId(e.target.value); setActiveStep(6); }} className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-xs font-semibold text-white outline-none"><option value="" className="bg-[#002d62]">เลือกกิจกรรม</option>{activities.map((a) => <option key={a.id} value={a.id} className="bg-[#002d62]">{a.title}</option>)}</select><Link to="/admin/ai-studio-workspace" className="inline-flex items-center justify-center rounded-xl bg-white px-3 py-2.5 text-xs font-bold text-[#002d62]">Phase 1 <ArrowLeft className="ml-1 h-3.5 w-3.5" /></Link></div></div></div><div className="border-t border-white/10 bg-white/5 px-5 py-4 sm:px-7"><StepRail active={activeStep} /></div></header>

    {selected && <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Activity</p><p className="mt-1 truncate text-sm font-bold text-[#002d62]">{selected.title}</p></div><div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Participants</p><p className="mt-1 text-lg font-bold text-slate-800">{participantCount.toLocaleString()} <span className="text-xs font-medium text-slate-400">คน</span></p></div><div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Survey Satisfaction</p><p className="mt-1 text-lg font-bold text-emerald-600">{report?.satisfactionPercent != null ? `${report.satisfactionPercent.toFixed(1)}%` : "—"}</p></div><div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Media</p><p className="mt-1 text-lg font-bold text-slate-800">{media.length} <span className="text-xs font-medium text-slate-400">files</span></p></div></div>}

    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]"><main className="space-y-5">
      {activeStep === 6 && <Card eyebrow="06 · EVIDENCE" title="Outcome Capture & Evidence" icon={<CheckCircle2 className="h-4 w-4" />}><div className="space-y-5"><div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]"><div className="space-y-4"><label className="block text-xs font-bold text-slate-700">จำนวนผู้เข้าร่วมจริง<input type="number" min="0" value={participantCount || ""} onChange={(e) => setParticipantCount(Number(e.target.value) || 0)} className="dashboard-control mt-1 w-full" placeholder="เช่น 45" /></label><div className="rounded-xl border border-violet-100 bg-violet-50/60 p-4 text-xs leading-5 text-violet-800">ข้อมูลผลสัมฤทธิ์ควรอ้างอิงจาก attendance, survey response และหลักฐานหลังดำเนินกิจกรรม ไม่ให้ AI สร้างตัวเลขขึ้นเอง</div><label className="flex min-h-24 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-xs font-bold text-slate-600"><Upload className="mr-2 h-4 w-4" />เพิ่ม Post-event Media<input type="file" accept="image/*" multiple className="hidden" onChange={(e) => setFiles(Array.from(e.target.files ?? []))} /></label>{files.length > 0 && <button type="button" onClick={() => void captureFiles()} disabled={saving} className="w-full rounded-xl bg-[#002d62] px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50">{saving ? "กำลังบันทึก..." : "บันทึกหลักฐาน"}</button>}</div><div className="space-y-4"><div className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-slate-50 p-4"><p className="text-[10px] text-slate-400">Response Count</p><p className="mt-1 text-lg font-bold text-slate-800">{report?.responseCount ?? "—"}</p></div><div className="rounded-xl bg-slate-50 p-4"><p className="text-[10px] text-slate-400">Satisfaction</p><p className="mt-1 text-lg font-bold text-emerald-600">{report?.satisfactionPercent != null ? `${report.satisfactionPercent.toFixed(1)}%` : "—"}</p></div><div className="rounded-xl bg-slate-50 p-4"><p className="text-[10px] text-slate-400">Evidence</p><p className="mt-1 text-lg font-bold text-slate-800">{media.length}</p></div></div>{media.length > 0 && <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{media.map((image) => <img key={image.id} src={image.public_url} alt={image.caption || "รูปกิจกรรม"} className="aspect-[4/3] w-full rounded-xl object-cover" />)}</div>}</div></div>

        <div className="rounded-2xl border border-violet-100 bg-violet-50/50 p-4 sm:p-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-500">OUTCOME METRICS</p><h3 className="mt-1 text-sm font-bold text-slate-900">ตัวชี้วัดผลลัพธ์เชิงโครงสร้าง</h3><p className="mt-1 text-xs leading-5 text-slate-600">Metric Name → Value → Unit → Description · บันทึกลงฐานข้อมูลจริงและ Reload เพื่อตรวจสอบข้อมูลที่ persist แล้ว</p></div><button type="button" onClick={() => void reloadOutcomes()} disabled={outcomeReloading || !selected} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white px-3 py-2 text-xs font-bold text-violet-700 disabled:opacity-50">{outcomeReloading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}{outcomeReloading ? "กำลัง Reload..." : "Reload & Verify"}</button></div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_150px_140px]"><label className="text-xs font-bold text-slate-700">Metric Name<input value={outcomeMetric.metricName} onChange={(e) => setOutcomeMetric((p) => ({ ...p, metricName: e.target.value }))} className="dashboard-control mt-1 w-full" placeholder="เช่น ผู้เข้าร่วมอบรม" /></label><label className="text-xs font-bold text-slate-700">Value<input value={outcomeMetric.value} onChange={(e) => setOutcomeMetric((p) => ({ ...p, value: e.target.value }))} className="dashboard-control mt-1 w-full" placeholder="เช่น 45" /></label><label className="text-xs font-bold text-slate-700">Unit<input value={outcomeMetric.unit} onChange={(e) => setOutcomeMetric((p) => ({ ...p, unit: e.target.value }))} className="dashboard-control mt-1 w-full" placeholder="คน / % / คะแนน" /></label></div>
          <label className="mt-3 block text-xs font-bold text-slate-700">Description<textarea value={outcomeMetric.description} onChange={(e) => setOutcomeMetric((p) => ({ ...p, description: e.target.value }))} className="dashboard-control mt-1 min-h-20 w-full" placeholder="อธิบายความหมาย แหล่งข้อมูล หรือวิธีวัด" /></label>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2 text-[11px] text-slate-500">{editingOutcomeId ? <><Pencil className="h-3.5 w-3.5 text-violet-500" />กำลังแก้ไข Metric</> : <><Save className="h-3.5 w-3.5 text-violet-500" />พร้อมบันทึก Metric ใหม่</>}{outcomeSyncedAt && <span className="text-emerald-600">· Verified {new Date(outcomeSyncedAt).toLocaleTimeString("th-TH")}</span>}</div><div className="flex gap-2">{editingOutcomeId && <button type="button" onClick={cancelOutcomeEdit} disabled={outcomeSaving} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600"><X className="h-3.5 w-3.5" />ยกเลิก</button>}<button type="button" onClick={() => void saveOutcomeMetric()} disabled={!outcomeSaveReady || outcomeSaving || !selected} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white disabled:opacity-40">{outcomeSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}{editingOutcomeId ? "บันทึกการแก้ไข" : "Save Metric"}</button></div></div>

          <div className="mt-5 space-y-2">{outcomes.length > 0 ? outcomes.map((metric, index) => <div key={metric.id} className="rounded-xl border border-slate-200 bg-white p-4"><div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-violet-50 px-2 py-1 text-[10px] font-bold text-violet-700">Metric {index + 1}</span><p className="text-sm font-bold text-slate-900">{metric.metric_name}</p><span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">{metric.metric_value}{metric.unit ? ` ${metric.unit}` : ""}</span></div>{metric.description && <p className="mt-2 text-xs leading-5 text-slate-600">{metric.description}</p>}<p className="mt-2 text-[10px] text-slate-400">Persisted · {metric.created_at ? new Date(metric.created_at).toLocaleString("th-TH") : "—"}</p></div><div className="flex shrink-0 gap-2"><button type="button" onClick={() => editOutcomeMetric(metric)} disabled={outcomeSaving} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-bold text-slate-600"><Pencil className="h-3.5 w-3.5" />Edit</button><button type="button" onClick={() => void removeOutcomeMetric(metric.id)} disabled={outcomeSaving} className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-2 text-[11px] font-bold text-red-600"><Trash2 className="h-3.5 w-3.5" />Delete</button></div></div></div>) : <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center"><p className="text-xs font-bold text-slate-500">ยังไม่มี Outcome Metrics</p><p className="mt-1 text-[11px] text-slate-400">เพิ่มอย่างน้อย 1 metric เพื่อให้ Step 6 มีหลักฐานเชิงโครงสร้างที่ตรวจสอบซ้ำได้</p></div>}</div>

          <div className={`mt-3 flex items-center justify-between rounded-xl border px-4 py-3 text-xs ${outcomeReady ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-800"}`}><span>{outcomeReady ? "Outcome Capture ผ่านเงื่อนไข: participant count + structured metrics พร้อม" : "ยังไม่พร้อม: ต้องมีจำนวนผู้เข้าร่วมจริงมากกว่า 0 และ Outcome Metric ที่ persist แล้วอย่างน้อย 1 รายการ"}</span><span className="font-bold">{outcomes.length} metrics</span></div>
        </div>

        <div className="mt-5 flex justify-end"><button type="button" disabled={!outcomeReady} onClick={() => setActiveStep(7)} className="rounded-xl bg-[#002d62] px-5 py-2.5 text-xs font-bold text-white disabled:opacity-40">ถัดไป: AI Report →</button></div></div></Card>}

      {activeStep === 7 && <Card eyebrow="07 · AI INTELLIGENCE" title="AI Outcome Report Synthesis" icon={<Sparkles className="h-4 w-4" />}><div className="space-y-5"><div className="flex flex-col gap-3 rounded-xl border border-violet-100 bg-violet-50/60 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold text-violet-900">สังเคราะห์รายงานผลสัมฤทธิ์จากข้อมูลกิจกรรมและหลักฐาน</p><p className="mt-1 text-[11px] text-violet-700/70">AI เป็นผู้ช่วยร่าง ไม่ใช่ผู้ตัดสินตัวเลขหรือผลลัพธ์</p></div><button type="button" onClick={() => void runReport()} disabled={aiLoading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50">{aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}{aiLoading ? "กำลังสังเคราะห์..." : "Run AI Synthesis"}</button></div>{reportReady ? <div className="grid gap-4 lg:grid-cols-2"><div className="rounded-xl border border-slate-200 p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Executive Summary</p><p className="mt-2 text-sm leading-6 text-slate-700">{form.summary || "ยังไม่มี summary"}</p></div><div className="rounded-xl border border-slate-200 p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Performance Results</p><p className="mt-2 text-sm leading-6 text-slate-700">{form.outcome || "ยังไม่มีผลสัมฤทธิ์"}</p></div><div className="rounded-xl border border-slate-200 p-4 lg:col-span-2"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Outcomes & Impact</p><p className="mt-2 text-sm leading-6 text-slate-700">{form.impact || "ยังไม่มีข้อมูล"}</p></div></div> : <div className="rounded-xl border border-dashed border-slate-200 p-10 text-center text-xs text-slate-400">กด Run AI Synthesis เพื่อสร้างรายงานจากหลักฐาน</div>}<div className="flex justify-between"><button type="button" onClick={() => setActiveStep(6)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600">← กลับ</button><button type="button" disabled={!reportReady} onClick={() => setActiveStep(8)} className="rounded-xl bg-[#002d62] px-5 py-2.5 text-xs font-bold text-white disabled:opacity-40">ถัดไป: Review →</button></div></div></Card>}

      {activeStep === 8 && <Card eyebrow="08 · HUMAN IN THE LOOP" title="Publish Package Review" icon={<Newspaper className="h-4 w-4" />}><div className="space-y-5"><div className="grid gap-4 lg:grid-cols-2"><label className="text-xs font-bold text-slate-700">Executive Summary<textarea value={form.summary} onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))} className="dashboard-control mt-1 min-h-32 w-full" /></label><label className="text-xs font-bold text-slate-700">Report / News Content<textarea value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} className="dashboard-control mt-1 min-h-32 w-full" /></label><label className="text-xs font-bold text-slate-700">Performance Results<textarea value={form.outcome} onChange={(e) => setForm((p) => ({ ...p, outcome: e.target.value }))} className="dashboard-control mt-1 min-h-28 w-full" /></label><label className="text-xs font-bold text-slate-700">Outcomes & Impact<textarea value={form.impact} onChange={(e) => setForm((p) => ({ ...p, impact: e.target.value }))} className="dashboard-control mt-1 min-h-28 w-full" /></label></div><label className="block text-xs font-bold text-slate-700">Featured Image URL<input value={form.featuredImage} onChange={(e) => setForm((p) => ({ ...p, featuredImage: e.target.value }))} className="dashboard-control mt-1 w-full" placeholder="https://..." /></label><div className="grid gap-3 sm:grid-cols-2">{Object.entries({ dataVerified: "ตรวจสอบตัวเลข/ผู้เข้าร่วม/ผลประเมินแล้ว", narrativeReviewed: "ตรวจทานเนื้อหารายงานและข่าวแล้ว", mediaSelected: "เลือกรูปภาพสำหรับเผยแพร่แล้ว", pdpaChecked: "ตรวจสอบ PDPA / ข้อมูลส่วนบุคคลแล้ว" }).map(([key, label]) => <label key={key} className={`flex items-start gap-3 rounded-xl border p-4 ${review[key as keyof typeof review] ? "border-emerald-200 bg-emerald-50/40" : "border-slate-200"}`}><input type="checkbox" checked={review[key as keyof typeof review]} onChange={(e) => setReview((p) => ({ ...p, [key]: e.target.checked }))} className="mt-0.5 h-4 w-4 accent-[#002d62]" /><span className="text-xs font-semibold text-slate-700">{label}</span></label>)}</div><div className="flex flex-wrap justify-between gap-3"><button type="button" onClick={() => { void saveDraft(); }} disabled={saving} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700">{saving ? "กำลังบันทึก..." : "บันทึก Draft"}</button><div className="flex gap-2"><button type="button" onClick={() => setActiveStep(7)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600">← กลับ</button><button type="button" disabled={!reviewReady || !form.content.trim()} onClick={() => setActiveStep(9)} className="rounded-xl bg-[#002d62] px-5 py-2.5 text-xs font-bold text-white disabled:opacity-40">พร้อมเผยแพร่ →</button></div></div></div></Card>}

      {activeStep === 9 && <Card eyebrow="09 · PUBLICATION" title="Publish & Close Project" icon={<Rocket className="h-4 w-4" />}><div className="space-y-5"><div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5"><div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" /><div><p className="text-sm font-bold text-emerald-900">Publication Package Ready</p><p className="mt-1 text-xs leading-5 text-emerald-800/80">แพ็กเกจผ่านการตรวจสอบโดย ADMIN แล้ว เมื่อกดยืนยัน ระบบจะเปลี่ยนกิจกรรมเป็น Published และเผยแพร่ผ่านหน้าเว็บไซต์</p></div></div></div><div className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-slate-50 p-4"><p className="text-[10px] text-slate-400">Status</p><p className="mt-1 text-xs font-bold text-[#002d62]">{selected?.status === "published" ? "Published" : "Ready to Publish"}</p></div><div className="rounded-xl bg-slate-50 p-4"><p className="text-[10px] text-slate-400">Evidence</p><p className="mt-1 text-xs font-bold text-slate-700">{media.length} media</p></div><div className="rounded-xl bg-slate-50 p-4"><p className="text-[10px] text-slate-400">Governance</p><p className="mt-1 text-xs font-bold text-emerald-700">Admin reviewed</p></div></div>{selected?.status === "published" ? <div className="rounded-xl border border-emerald-200 bg-white p-5"><p className="text-xs font-bold text-emerald-800">เผยแพร่แล้ว</p><p className="mt-1 text-sm text-slate-600">/{selected.slug}</p><Link to={`/activities/${selected.slug}`} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#002d62] px-4 py-2.5 text-xs font-bold text-white">เปิดหน้า Public Activity</Link></div> : <button type="button" onClick={() => void publish()} disabled={publishing || !reviewReady || !form.content.trim()} className="inline-flex items-center gap-2 rounded-xl bg-[#002d62] px-5 py-3 text-xs font-bold text-white disabled:opacity-40">{publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}{publishing ? "กำลังเผยแพร่..." : "Confirm & Publish"}</button>}<div className="flex justify-start"><button type="button" onClick={() => setActiveStep(8)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600">← กลับไป Review</button></div></div></Card>}
    </main>
    <aside className="space-y-4"><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-500">STUDIO CONTROL</p><h3 className="mt-1 text-sm font-bold text-slate-900">Outcome Governance</h3><div className="mt-4 space-y-3 text-xs">{[["Evidence", outcomeReady], ["Metrics", outcomes.length > 0], ["AI Report", reportReady], ["Review", reviewReady], ["Publish", selected?.status === "published"]].map(([label, ready]) => <div key={label as string} className="flex items-center justify-between"><span className="text-slate-600">{label as string}</span>{ready ? <span className="font-bold text-emerald-600">Ready</span> : <span className="font-semibold text-slate-400">Pending</span>}</div>)}</div></div><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">WORKFLOW</p><p className="mt-2 text-xs leading-5 text-slate-600">Phase 2 ใช้ข้อมูลจริงจากกิจกรรมและหลักฐานหลังดำเนินงาน โดย AI ทำหน้าที่สังเคราะห์และ ADMIN เป็นผู้ตรวจสอบก่อนเผยแพร่</p></div><Link to="/admin/activities" className="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700 shadow-sm">กลับรายการกิจกรรม</Link></aside>
    </div>
  </div></section>;
}
