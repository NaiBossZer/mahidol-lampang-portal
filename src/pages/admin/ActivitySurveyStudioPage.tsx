import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Bot, Calendar, CheckCircle2, FileCheck2, FileText, ImagePlus, Loader2, MapPin, Plus, ShieldCheck, Sparkles, Upload, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { createActivity, type ActivityWriteInput, type AdminActivity } from "@/services/api";
import { analyzeActivityDocument, confirmAiSurvey, generateAiSurvey, uploadActivityDocument, type ActivityDocument, type ExtractedEntity, type GeneratedSurvey } from "@/services/admin-ai-workflow";

const steps = [
  { n: 1, title: "Activity Brief", caption: "ข้อมูลกิจกรรม" },
  { n: 2, title: "AI Analysis", caption: "วิเคราะห์ข้อมูล" },
  { n: 3, title: "AI Survey", caption: "สร้างแบบประเมิน" },
  { n: 4, title: "Admin Review", caption: "ทวนสอบ" },
  { n: 5, title: "Confirm", caption: "ยืนยันและผูกงาน" },
] as const;

function slugify(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9\u0E00-\u0E7F]+/g, "-").replace(/^-+|-+$/g, "");
}

export function ActivitySurveyStudioPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [activity, setActivity] = useState<AdminActivity | null>(null);
  const [form, setForm] = useState<ActivityWriteInput>({
    title: "", slug: "", summary: "", content: "", activityDate: new Date().toISOString().slice(0, 16), location: "", participantCount: 0, objective: "", process: "", outcome: "", impact: "", featuredImage: "", status: "draft",
  });
  const [documents, setDocuments] = useState<ActivityDocument[]>([]);
  const [entities, setEntities] = useState<ExtractedEntity[]>([]);
  const [analysisSummary, setAnalysisSummary] = useState("");
  const [survey, setSurvey] = useState<GeneratedSurvey | null>(null);
  const [executionId, setExecutionId] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [checklist, setChecklist] = useState({ objectives: true, scale: true, audience: true, feedback: true });

  const canAnalyze = Boolean(activity && documents.length);
  const checklistReady = Object.values(checklist).every(Boolean);
  const totalQuestions = useMemo(() => survey?.sections.reduce((sum, section) => sum + section.questions.length, 0) ?? 0, [survey]);

  function setField<K extends keyof ActivityWriteInput>(key: K, value: ActivityWriteInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleCreateActivity() {
    if (!form.title.trim() || !form.activityDate) {
      toast.error("กรุณาระบุชื่อกิจกรรมและวันที่");
      return;
    }
    setSaving(true);
    try {
      const saved = (await createActivity({ ...form, slug: form.slug || slugify(form.title), status: "draft" })) as AdminActivity;
      setActivity(saved);
      toast.success("สร้าง Activity Draft แล้ว");
      setStep(2);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "สร้างกิจกรรมไม่สำเร็จ");
    } finally { setSaving(false); }
  }

  async function handleUpload(file: File) {
    if (!activity) return;
    setUploading(true);
    try {
      const doc = await uploadActivityDocument(activity.id, file);
      setDocuments((current) => [doc, ...current]);
      toast.success(`อัปโหลด ${file.name} แล้ว`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "อัปโหลดเอกสารไม่สำเร็จ");
    } finally { setUploading(false); }
  }

  async function handleAnalysis() {
    if (!activity) return;
    setAnalyzing(true);
    try {
      const result = await analyzeActivityDocument(activity.id);
      setEntities(result.extractedEntities);
      setAnalysisSummary(result.summary);
      toast.success("AI วิเคราะห์ข้อมูลสำเร็จ");
      setStep(3);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "วิเคราะห์ข้อมูลไม่สำเร็จ");
    } finally { setAnalyzing(false); }
  }

  async function handleGenerateSurvey() {
    if (!activity) return;
    setGenerating(true);
    try {
      const result = await generateAiSurvey(activity.id, entities);
      setSurvey(result.survey);
      setExecutionId(result.executionId);
      toast.success("AI สร้างแบบประเมินแล้ว");
      setStep(4);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "สร้างแบบประเมินไม่สำเร็จ");
    } finally { setGenerating(false); }
  }

  async function handleConfirm() {
    if (!executionId || !checklistReady) return;
    setConfirming(true);
    try {
      await confirmAiSurvey(executionId, "approved");
      setConfirmed(true);
      toast.success("ยืนยันแบบประเมินและผูกเข้ากับกิจกรรมแล้ว");
      setStep(5);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ยืนยันแบบประเมินไม่สำเร็จ");
    } finally { setConfirming(false); }
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-[#f8f9ff] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px] space-y-5">
        <header className="overflow-hidden rounded-2xl bg-gradient-to-r from-[#002d62] via-[#0c2340] to-[#00193c] px-5 py-6 text-white shadow-sm sm:px-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-[#d7e2ff]"><Sparkles className="h-3.5 w-3.5 text-sky-300" /> ACTIVITY + AI SURVEY STUDIO</div>
              <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-[30px]">สร้างกิจกรรม & AI Survey</h1>
              <p className="mt-1 text-sm leading-6 text-[#d7e2ff]">Workflow เดียวสำหรับสร้างข้อมูลกิจกรรม → วิเคราะห์ด้วย AI → สร้างแบบประเมิน → ADMIN ทวนสอบ → ยืนยัน</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5"><div className="flex items-center gap-2 text-xs font-semibold"><ShieldCheck className="h-4 w-4 text-[#95f8a7]" /> Human-in-the-loop</div><p className="mt-0.5 text-[11px] text-white/70">RBAC · Approval · Audit</p></div>
              <Link to="/admin/activities" className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/20"><ArrowLeft className="h-4 w-4" /> Activity Data</Link>
            </div>
          </div>
        </header>

        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="grid gap-2 md:grid-cols-5">
            {steps.map((item) => {
              const active = step === item.n;
              const done = step > item.n || (item.n === 5 && confirmed);
              return <button key={item.n} type="button" onClick={() => { if (item.n <= step) setStep(item.n); }} className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-left transition ${active ? "bg-[#002d62] text-white shadow-sm" : done ? "bg-emerald-50 text-emerald-800" : "bg-slate-50 text-slate-500"}`}>
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-black ${active ? "bg-white/15" : done ? "bg-emerald-100" : "bg-white"}`}>{done ? <CheckCircle2 className="h-4 w-4" /> : item.n}</span>
                <span className="min-w-0"><span className="block text-xs font-bold">{item.title}</span><span className={`block text-[10px] ${active ? "text-white/65" : "text-slate-400"}`}>{item.caption}</span></span>
              </button>;
            })}
          </div>
        </div>

        {step === 1 && <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-start gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-700"><Plus className="h-5 w-5" /></div><div><p className="text-xs font-bold uppercase tracking-wider text-violet-600">Step 01 · Activity Brief</p><h2 className="mt-1 text-xl font-bold text-[#002d62]">เริ่มต้นกิจกรรม</h2><p className="mt-1 text-sm text-slate-500">ข้อมูลนี้จะเป็น source of truth ให้ AI workflow ต่อจากนี้</p></div></div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2"><span className="field-label">ชื่อกิจกรรม *</span><input value={form.title} onChange={(e) => { setField("title", e.target.value); if (!form.slug) setField("slug", slugify(e.target.value)); }} className="field-input" placeholder="เช่น โครงการพัฒนาศักยภาพชุมชน" /></label>
              <label><span className="field-label">Slug</span><input value={form.slug} onChange={(e) => setField("slug", e.target.value)} className="field-input" /></label>
              <label><span className="field-label">วันที่ *</span><input type="datetime-local" value={form.activityDate} onChange={(e) => setField("activityDate", e.target.value)} className="field-input" /></label>
              <label><span className="field-label">สถานที่</span><div className="relative"><MapPin className="field-icon" /><input value={form.location ?? ""} onChange={(e) => setField("location", e.target.value)} className="field-input pl-9" placeholder="สถานที่จัดกิจกรรม" /></div></label>
              <label><span className="field-label">ผู้เข้าร่วมเป้าหมาย</span><div className="relative"><Users className="field-icon" /><input type="number" min="0" value={form.participantCount ?? 0} onChange={(e) => setField("participantCount", Number(e.target.value))} className="field-input pl-9" /></div></label>
              <label className="sm:col-span-2"><span className="field-label">วัตถุประสงค์</span><textarea value={form.objective ?? ""} onChange={(e) => setField("objective", e.target.value)} className="field-input min-h-28 py-3" placeholder="ระบุวัตถุประสงค์หลักของกิจกรรม" /></label>
              <label className="sm:col-span-2"><span className="field-label">สรุปกิจกรรม</span><textarea value={form.summary ?? ""} onChange={(e) => setField("summary", e.target.value)} className="field-input min-h-24 py-3" placeholder="ข้อมูลสั้น ๆ สำหรับให้ AI เข้าใจบริบท" /></label>
            </div>
            <div className="mt-6 flex justify-end"><button type="button" disabled={saving} onClick={() => void handleCreateActivity()} className="primary-action">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />} สร้าง Activity Draft และไปต่อ</button></div>
          </div>
          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Studio principle</p><h3 className="mt-2 font-bold text-[#002d62]">AI ช่วย แต่ข้อมูลกิจกรรมยังเป็นของระบบเรา</h3><div className="mt-4 space-y-3 text-xs leading-5 text-slate-600"><p>• ใช้ Activity API / Supabase schema เดิม</p><p>• Activity lifecycle คง Draft / Published / Archived</p><p>• AI สร้างคำแนะนำและแบบประเมิน ไม่แทนสิทธิ์ ADMIN</p><p>• การยืนยันยังผ่าน approval workflow เดิม</p></div></aside>
        </div>}

        {step === 2 && <StudioCard eyebrow="STEP 02 · AI ANALYSIS" title="รวบรวมเอกสารและให้ AI วิเคราะห์" icon={<Bot className="h-5 w-5" />}>
          <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
            <div><label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-6 text-center hover:border-violet-300"><Upload className="h-7 w-7 text-violet-500" /><p className="mt-3 text-sm font-bold text-slate-700">อัปโหลดเอกสารโครงการ</p><p className="mt-1 text-xs text-slate-400">PDF / DOC / รูปภาพ ตามที่ API รองรับ</p><input type="file" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) void handleUpload(file); }} /></label>
              {uploading && <div className="mt-3 flex items-center gap-2 text-xs text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> กำลังอัปโหลด...</div>}
              <div className="mt-4 space-y-2">{documents.map((doc) => <div key={doc.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"><FileText className="h-4 w-4 text-violet-500" /><span className="min-w-0 flex-1 truncate text-xs font-semibold">{doc.original_name}</span><span className="text-[10px] text-slate-400">{Math.round(doc.size_bytes / 1024)} KB</span></div>)}</div>
            </div>
            <div className="rounded-2xl bg-[#f8f9ff] p-5"><p className="text-xs font-bold text-violet-600">AI INPUT</p><p className="mt-2 text-sm font-bold text-[#002d62]">{activity?.title}</p><div className="mt-4 space-y-2 text-xs text-slate-500"><p>เอกสาร: {documents.length} ไฟล์</p><p>วัตถุประสงค์: {form.objective ? "มีข้อมูล" : "ยังไม่มี"}</p><p>สถานที่: {form.location || "—"}</p></div><button type="button" disabled={!canAnalyze || analyzing} onClick={() => void handleAnalysis()} className="primary-action mt-5 w-full justify-center">{analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} วิเคราะห์ด้วย AI</button></div>
          </div>
        </StudioCard>}

        {step === 3 && <StudioCard eyebrow="STEP 03 · AI SURVEY" title="สร้างแบบประเมินจากข้อมูลกิจกรรม" icon={<Sparkles className="h-5 w-5" />}>
          <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
            <div className="rounded-2xl border border-slate-200 p-5"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">AI analysis summary</p><p className="mt-2 text-sm leading-6 text-slate-700">{analysisSummary || "ยังไม่มีผลวิเคราะห์"}</p><div className="mt-5 grid gap-2 sm:grid-cols-2">{entities.map((entity) => <div key={entity.id} className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] font-bold text-violet-600">{entity.categoryLabel}</p><p className="mt-1 text-xs font-semibold text-slate-800">{entity.title}</p><p className="mt-1 text-[11px] text-slate-500">Confidence {Math.round(entity.confidence * 100)}%</p></div>)}</div></div>
            <div className="rounded-2xl bg-[#f8f9ff] p-5"><p className="text-xs font-bold text-violet-600">GENERATIVE WORKFLOW</p><h3 className="mt-2 font-bold text-[#002d62]">AI Survey Generator</h3><p className="mt-2 text-xs leading-5 text-slate-500">สร้างคำถามจาก objective, target group, location, KPI และข้อมูลที่ AI extract ได้ โดยยังรอ ADMIN review</p><button type="button" disabled={generating} onClick={() => void handleGenerateSurvey()} className="primary-action mt-5 w-full justify-center">{generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />} Generate AI Survey</button></div>
          </div>
        </StudioCard>}

        {step === 4 && <StudioCard eyebrow="STEP 04 · ADMIN REVIEW" title="ทวนสอบแบบประเมินก่อนยืนยัน" icon={<FileCheck2 className="h-5 w-5" />}>
          <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
            <div className="space-y-3">{survey?.sections.map((section) => <div key={section.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-center justify-between"><div><p className="text-sm font-bold text-[#002d62]">{section.title}</p><p className="text-xs text-slate-400">{section.description}</p></div><span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-bold text-violet-700">{section.questions.length} questions</span></div><div className="mt-3 space-y-2">{section.questions.map((q) => <div key={q.id} className="rounded-xl bg-slate-50 px-3 py-2.5"><p className="text-xs font-semibold text-slate-700">{q.title}</p><p className="mt-1 text-[10px] text-slate-400">{q.questionType} · source: {q.sourceCiting}</p></div>)}</div></div>)}</div>
            <div className="rounded-2xl bg-[#f8f9ff] p-5"><p className="text-xs font-bold text-violet-600">ADMIN CHECKLIST</p><p className="mt-1 text-2xl font-black text-[#002d62]">{totalQuestions} <span className="text-sm font-semibold text-slate-400">questions</span></p><div className="mt-4 space-y-3">{Object.entries({ objectives: "Objectives covered", scale: "Scale standard", audience: "Target audience match", feedback: "Feedback allowed" }).map(([key, label]) => <label key={key} className="flex items-center gap-2 text-xs font-semibold text-slate-700"><input type="checkbox" checked={checklist[key as keyof typeof checklist]} onChange={(e) => setChecklist((current) => ({ ...current, [key]: e.target.checked }))} />{label}</label>)}</div><button type="button" disabled={!checklistReady} onClick={() => void handleConfirm()} className="primary-action mt-5 w-full justify-center">{confirming ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />} Confirm & Bind</button></div>
          </div>
        </StudioCard>}

        {step === 5 && <StudioCard eyebrow="STEP 05 · CONFIRMED" title="Workflow เสร็จสิ้น" icon={<CheckCircle2 className="h-5 w-5" />}>
          <div className="rounded-2xl bg-emerald-50 p-6"><div className="flex items-start gap-4"><CheckCircle2 className="mt-0.5 h-6 w-6 text-emerald-600" /><div><h3 className="font-bold text-emerald-900">สร้างกิจกรรมและยืนยัน AI Survey แล้ว</h3><p className="mt-1 text-sm leading-6 text-emerald-800">Activity ถูกสร้างเป็น Draft และผลการยืนยันถูกส่งผ่าน approval workflow เดิมของระบบ</p><div className="mt-4 flex flex-wrap gap-2"><Link to="/admin/activities" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-[#002d62] shadow-sm"><ImagePlus className="h-4 w-4" /> ไปจัดการ Activity</Link><Link to="/admin/surveys" className="inline-flex items-center gap-2 rounded-xl bg-[#002d62] px-4 py-2 text-xs font-bold text-white"><FileCheck2 className="h-4 w-4" /> ดู Survey</Link></div></div></div></div>
        </StudioCard>}
      </div>
      <style>{`.field-label{display:block;margin-bottom:.45rem;font-size:.72rem;font-weight:700;color:#475569}.field-input{width:100%;border:1px solid #e2e8f0;border-radius:.75rem;background:#fff;padding:.7rem .8rem;font-size:.8rem;outline:none;transition:.2s}.field-input:focus{border-color:#002d62;box-shadow:0 0 0 4px rgb(0 45 98 / .08)}.field-icon{position:absolute;left:.75rem;top:50%;height:1rem;width:1rem;transform:translateY(-50%);color:#94a3b8}.primary-action{display:inline-flex;align-items:center;gap:.45rem;border-radius:.75rem;background:#002d62;padding:.7rem 1rem;font-size:.75rem;font-weight:800;color:#fff;box-shadow:0 1px 2px rgb(0 0 0 / .08);transition:.2s}.primary-action:hover{background:#0c2340}.primary-action:disabled{cursor:not-allowed;opacity:.5}`}</style>
    </section>
  );
}

function StudioCard({ eyebrow, title, icon, children }: { eyebrow: string; title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><div className="flex items-start gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-700">{icon}</div><div><p className="text-xs font-bold uppercase tracking-wider text-violet-600">{eyebrow}</p><h2 className="mt-1 text-xl font-bold text-[#002d62]">{title}</h2></div></div><div className="mt-6">{children}</div></div>;
}
