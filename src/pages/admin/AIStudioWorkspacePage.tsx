import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Bot,
  Calendar,
  CheckCircle2,
  ChevronRight,
  FileCheck2,
  FileText,
  ImagePlus,
  Loader2,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { getAdminActivities, type AdminActivity } from "@/services/api";
import PredictiveMetricsPanel from "@/components/admin/PredictiveMetricsPanel";
import { getAdminOccurrences } from "@/services/admin-occurrences";
import { getAdminSurveys } from "@/services/admin-surveys";
import {
  analyzeActivityDocument,
  confirmAiSurvey,
  deleteActivityDocument,
  generateAiPostProjectReport,
  generateAiSurvey,
  improveAiSurvey,
  validateAiSurvey,
  getActivityDocuments,
  getPreviousAnalysis,
  getPreviousGeneratedSurvey,
  uploadActivityDocument,
  type ActivityDocument,
  type ExtractedEntity,
  type GeneratedSurvey,
  type PostProjectReport,
} from "@/services/admin-ai-workflow";

const steps = [
  { id: 1, title: "Activity Brief", subtitle: "บริบทกิจกรรม" },
  { id: 2, title: "AI Analysis", subtitle: "วิเคราะห์ข้อมูล" },
  { id: 3, title: "AI Survey", subtitle: "สร้างแบบประเมิน" },
  { id: 4, title: "Admin Review", subtitle: "ทวนสอบ" },
  { id: 5, title: "Confirm", subtitle: "ยืนยันและเผยแพร่" },
];

const statusLabel: Record<string, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};

function StepState({ step, active }: { step: number; active: number }) {
  const done = step < active;
  return (
    <div className="flex min-w-0 items-center gap-2">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${done ? "border-emerald-200 bg-emerald-50 text-emerald-700" : step === active ? "border-[#002d62] bg-[#002d62] text-white shadow-sm" : "border-slate-200 bg-white text-slate-400"}`}>
        {done ? <CheckCircle2 className="h-4 w-4" /> : step}
      </div>
      <div className="min-w-0">
        <p className={`truncate text-xs font-bold ${step === active ? "text-[#002d62]" : "text-slate-600"}`}>{steps[step - 1].title}</p>
        <p className="truncate text-[10px] text-slate-400">{steps[step - 1].subtitle}</p>
      </div>
    </div>
  );
}

function StudioCard({ title, eyebrow, icon, children, className = "" }: { title: string; eyebrow?: string; icon?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          {icon && <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">{icon}</div>}
          <div>
            {eyebrow && <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-500">{eyebrow}</p>}
            <h2 className="text-sm font-bold text-slate-900">{title}</h2>
          </div>
        </div>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

export function AIStudioWorkspacePage() {
  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState("");
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  const [documents, setDocuments] = useState<ActivityDocument[]>([]);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisSummary, setAnalysisSummary] = useState("");
  const [extractedEntities, setExtractedEntities] = useState<ExtractedEntity[]>([]);
  const [surveyLoading, setSurveyLoading] = useState(false);
  const [generatedSurvey, setGeneratedSurvey] = useState<GeneratedSurvey | null>(null);
  const [surveyExecutionId, setSurveyExecutionId] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [confirmedSurveyId, setConfirmedSurveyId] = useState<string | null>(null);
  const [confirmedOccurrenceId, setConfirmedOccurrenceId] = useState<string | null>(null);
  const [postReportLoading, setPostReportLoading] = useState(false);
  const [postReport, setPostReport] = useState<PostProjectReport | null>(null);
  const [reviewChecklist, setReviewChecklist] = useState({ objectivesCovered: true, scaleStandard: true, targetAudienceMatch: true, feedbackAllowed: true });
  const [improveInstruction, setImproveInstruction] = useState("");
  const [improvingSurvey, setImprovingSurvey] = useState(false);
  const [validatingSurvey, setValidatingSurvey] = useState(false);
  const [validationResult, setValidationResult] = useState<{ valid: boolean; errors: string[]; warnings: string[] } | null>(null);

  const selectedActivity = useMemo(() => activities.find((x) => x.id === selectedActivityId) ?? null, [activities, selectedActivityId]);
  const checklistReady = Object.values(reviewChecklist).every(Boolean);
  const analysisReady = Boolean(analysisSummary || extractedEntities.length);
  const surveyReady = Boolean(generatedSurvey && surveyExecutionId);

  async function loadActivities() {
    setLoadingActivities(true);
    try {
      const rows = await getAdminActivities();
      const valid = rows.filter((x) => x.status !== "archived");
      setActivities(valid);
      if (!selectedActivityId && valid[0]?.id) setSelectedActivityId(valid[0].id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "โหลดกิจกรรมไม่สำเร็จ");
    } finally {
      setLoadingActivities(false);
    }
  }

  async function loadActivityData(activityId: string) {
    if (!activityId) return;
    try {
      const [docs, previousAnalysis, previousSurvey] = await Promise.all([
        getActivityDocuments(activityId),
        getPreviousAnalysis(activityId),
        getPreviousGeneratedSurvey(activityId),
      ]);
      setDocuments(docs);
      setAnalysisSummary(previousAnalysis?.output?.summary ?? "");
      setExtractedEntities(previousAnalysis?.output?.extractedEntities ?? []);
      setGeneratedSurvey(previousSurvey?.survey ?? null);
      setSurveyExecutionId(previousSurvey?.id ?? "");

      // The survey-generation execution id is not the persisted occurrence_surveys id.
      // Resolve the confirmed survey through the same first-occurrence binding used by the approval workflow.
      if (previousSurvey?.status === "completed") {
        const occurrences = await getAdminOccurrences(activityId);
        const firstOccurrence = occurrences[0];
        if (firstOccurrence) {
          const surveys = await getAdminSurveys(firstOccurrence.id);
          const boundSurvey = surveys[0] ?? null;
          setConfirmedSurveyId(boundSurvey?.id ?? null);
          setConfirmedOccurrenceId(boundSurvey?.occurrence_id ?? firstOccurrence.id);
        } else {
          setConfirmedSurveyId(null);
          setConfirmedOccurrenceId(null);
        }
      } else {
        setConfirmedSurveyId(null);
        setConfirmedOccurrenceId(null);
      }
      setPostReport(null);
    } catch (error) {
      console.error("Failed to load AI Studio data", error);
    }
  }

  useEffect(() => { void loadActivities(); }, []);
  useEffect(() => { if (selectedActivityId) void loadActivityData(selectedActivityId); }, [selectedActivityId]);

  async function handleFileUpload(file: File) {
    if (!selectedActivityId) return;
    setUploadingDoc(true);
    try {
      const uploaded = await uploadActivityDocument(selectedActivityId, file);
      setDocuments((prev) => [uploaded, ...prev]);
      toast.success(`อัปโหลด "${file.name}" สำเร็จ`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "อัปโหลดไฟล์ไม่สำเร็จ");
    } finally { setUploadingDoc(false); }
  }

  async function handleDeleteDocument(id: string) {
    try {
      await deleteActivityDocument(id);
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      toast.success("ลบเอกสารแล้ว");
    } catch (error) { toast.error(error instanceof Error ? error.message : "ลบเอกสารไม่สำเร็จ"); }
  }

  async function handleRunAnalysis() {
    if (!selectedActivityId) return;
    setAnalysisLoading(true);
    setAnalysisProgress(15);
    const timer = window.setInterval(() => setAnalysisProgress((value) => Math.min(value + 20, 90)), 450);
    try {
      const result = await analyzeActivityDocument(selectedActivityId);
      setAnalysisSummary(result.summary);
      setExtractedEntities(result.extractedEntities);
      setAnalysisProgress(100);
      toast.success("AI วิเคราะห์ข้อมูลกิจกรรมสำเร็จ");
    } catch (error) { toast.error(error instanceof Error ? error.message : "การวิเคราะห์โดย AI ล้มเหลว"); }
    finally { window.clearInterval(timer); setAnalysisLoading(false); }
  }

  async function handleRunSurveyGeneration() {
    if (!selectedActivityId) return;
    setSurveyLoading(true);
    try {
      const result = await generateAiSurvey(selectedActivityId, extractedEntities);
      setGeneratedSurvey(result.survey);
      setSurveyExecutionId(result.executionId);
      toast.success("AI สร้างแบบประเมินสำเร็จ พร้อมให้ ADMIN ทวนสอบ");
    } catch (error) { toast.error(error instanceof Error ? error.message : "สร้างแบบประเมินไม่สำเร็จ"); }
    finally { setSurveyLoading(false); }
  }

  function updateSurveyQuestion(sectionId: string, questionId: string, patch: Partial<GeneratedSurvey["sections"][number]["questions"][number]>) {
    setGeneratedSurvey((current) => current ? {
      ...current,
      sections: current.sections.map((section) => section.id !== sectionId ? section : {
        ...section,
        questions: section.questions.map((question) => question.id !== questionId ? question : { ...question, ...patch }),
      }),
    } : current);
    setValidationResult(null);
  }

  async function handleValidateSurvey() {
    if (!surveyExecutionId || !generatedSurvey) return;
    setValidatingSurvey(true);
    try {
      const result = await validateAiSurvey(surveyExecutionId, generatedSurvey);
      setValidationResult(result.validation);
      toast.success(result.validation.valid ? "Survey validation ผ่าน" : "พบรายการที่ต้องแก้ไข");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ตรวจสอบ Survey ไม่สำเร็จ");
    } finally { setValidatingSurvey(false); }
  }

  async function handleImproveSurvey() {
    if (!selectedActivityId || !surveyExecutionId || !generatedSurvey || !improveInstruction.trim()) return;
    setImprovingSurvey(true);
    try {
      const result = await improveAiSurvey(selectedActivityId, surveyExecutionId, generatedSurvey, improveInstruction.trim());
      setGeneratedSurvey(result.survey);
      setSurveyExecutionId(result.executionId);
      setValidationResult(result.validation);
      setImproveInstruction("");
      toast.success("Pathumma สร้าง Survey ฉบับปรับปรุงแล้ว ต้องตรวจสอบอีกครั้ง");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "AI Improve ไม่สำเร็จ");
    } finally { setImprovingSurvey(false); }
  }

  async function handleConfirmSurvey() {
    if (!surveyExecutionId || !checklistReady || !generatedSurvey) return;
    setConfirming(true);
    try {
      if (!validationResult?.valid) {
        const result = await validateAiSurvey(surveyExecutionId, generatedSurvey);
        setValidationResult(result.validation);
        if (!result.validation.valid) {
          toast.error("กรุณาแก้ Survey ให้ผ่าน validation ก่อน Confirm");
          return;
        }
      }
      const result = await confirmAiSurvey(surveyExecutionId, "approved");
      setConfirmedSurveyId(result.surveyId ?? null);
      setConfirmedOccurrenceId(result.occurrenceId ?? null);
      toast.success("ยืนยันแบบประเมินและผูกเข้ากับกิจกรรมแล้ว");
    } catch (error) { toast.error(error instanceof Error ? error.message : "การยืนยันล้มเหลว"); }
    finally { setConfirming(false); }
  }

  async function handleGeneratePostReport() {
    if (!selectedActivityId) return;
    setPostReportLoading(true);
    try {
      const result = await generateAiPostProjectReport(selectedActivityId);
      setPostReport(result.report);
      toast.success("สร้าง Post-project report สำเร็จ");
    } catch (error) { toast.error(error instanceof Error ? error.message : "สร้างรายงานไม่สำเร็จ"); }
    finally { setPostReportLoading(false); }
  }

  function goNext() {
    if (activeStep === 1) setActiveStep(2);
    else if (activeStep === 2 && analysisReady) setActiveStep(3);
    else if (activeStep === 3 && surveyReady) setActiveStep(4);
    else if (activeStep === 4 && checklistReady) setActiveStep(5);
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-[#f8f9ff] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px] space-y-5">
        <header className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#002d62] via-[#0c2340] to-[#00152f] text-white shadow-sm">
          <div className="px-5 py-6 sm:px-7 sm:py-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-4xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-sky-100">
                  <Sparkles className="h-3.5 w-3.5 text-sky-300" /> AI STUDIO WORKSPACE
                </div>
                <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">AI Studio Workspace</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-blue-100">
                  พื้นที่ทำงานแบบครบวงจรสำหรับสร้างกิจกรรม วิเคราะห์เอกสาร สร้างแบบประเมิน ตรวจสอบโดย ADMIN และยืนยันผลแบบมี Governance
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] sm:flex sm:flex-wrap">
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2"><ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-emerald-300" />RBAC</div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2"><FileCheck2 className="mr-1 inline h-3.5 w-3.5 text-sky-300" />Approval</div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2"><Bot className="mr-1 inline h-3.5 w-3.5 text-violet-300" />AI Execution</div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2"><ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-amber-300" />Audit Trail</div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-3 sm:p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-100"><Activity className="h-4 w-4 text-sky-300" />Target Activity</div>
                <div className="flex flex-1 gap-2">
                  {loadingActivities ? <div className="py-2 text-xs text-white/60">กำลังโหลดกิจกรรม...</div> : (
                    <select value={selectedActivityId} onChange={(e) => { setSelectedActivityId(e.target.value); setActiveStep(1); }} className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-xs font-semibold text-white outline-none focus:border-sky-300 focus:bg-[#00193c]">
                      {activities.length === 0 ? <option className="bg-[#002d62]">ยังไม่มีกิจกรรม</option> : activities.map((activity) => <option key={activity.id} value={activity.id} className="bg-[#002d62]">{activity.title} · {statusLabel[activity.status] ?? activity.status}</option>)}
                    </select>
                  )}
                  <button type="button" onClick={() => void loadActivities()} className="rounded-xl border border-white/15 bg-white/10 px-3 text-white hover:bg-white/20" title="รีเฟรช"><RefreshCw className="h-4 w-4" /></button>
                </div>
                <Link to="/admin/activities" className="inline-flex items-center justify-center gap-1 rounded-xl bg-white px-3 py-2.5 text-xs font-bold text-[#002d62] hover:bg-blue-50">จัดการกิจกรรม <ChevronRight className="h-3.5 w-3.5" /></Link>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 bg-white/5 px-5 py-4 sm:px-7">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {steps.map((step, index) => <div key={step.id} className="flex items-center gap-2"><StepState step={step.id} active={activeStep} />{index < steps.length - 1 && <div className="hidden h-px flex-1 bg-white/15 lg:block" />}</div>)}
            </div>
          </div>
        </header>

        {selectedActivity && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Activity</p><p className="mt-1 truncate text-sm font-bold text-[#002d62]">{selectedActivity.title}</p><p className="mt-0.5 text-[11px] text-slate-500">/{selectedActivity.slug}</p></div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Schedule</p><p className="mt-1 text-xs font-semibold text-slate-700"><Calendar className="mr-1 inline h-3.5 w-3.5 text-slate-400" />{new Date(selectedActivity.activityDate).toLocaleDateString("th-TH")}</p></div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Location</p><p className="mt-1 truncate text-xs font-semibold text-slate-700"><MapPin className="mr-1 inline h-3.5 w-3.5 text-slate-400" />{selectedActivity.location || "วิทยาเขตลำปาง"}</p></div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Participants</p><p className="mt-1 text-xs font-semibold text-slate-700"><Users className="mr-1 inline h-3.5 w-3.5 text-slate-400" />{selectedActivity.participantCount ?? 0} คน</p></div>
          </div>
        )}

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-5">
            {activeStep === 1 && (
              <StudioCard eyebrow="01 · CONTEXT" title="Activity Brief & Source Documents" icon={<FileText className="h-4 w-4" />}>
                <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
                  <div className="space-y-4">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-bold text-slate-700">AI Context</p><p className="mt-1 text-xs leading-5 text-slate-500">AI จะใช้ข้อมูลกิจกรรมจากระบบและเอกสารที่ ADMIN แนบเป็นบริบทหลัก โดยไม่เขียนทับข้อมูลกิจกรรมอัตโนมัติ</p></div>
                    <div className="rounded-xl border-2 border-dashed border-slate-200 p-5 text-center hover:border-violet-300">
                      <Upload className="mx-auto h-6 w-6 text-violet-500" />
                      <p className="mt-2 text-sm font-bold text-slate-700">แนบเอกสารโครงการ</p>
                      <p className="mt-1 text-[11px] text-slate-500">PDF, DOCX หรือเอกสารประกอบที่ใช้เป็น source</p>
                      <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#002d62] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#0c2340]">
                        {uploadingDoc ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} เลือกไฟล์
                        <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.webp" disabled={uploadingDoc} onChange={(e) => { const file = e.target.files?.[0]; if (file) void handleFileUpload(file); e.currentTarget.value = ""; }} />
                      </label>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-700">Source Library <span className="font-normal text-slate-400">{documents.length} files</span></p>
                    {documents.length === 0 ? <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center text-xs text-slate-400">ยังไม่มีเอกสารสำหรับกิจกรรมนี้</div> : documents.map((doc) => <div key={doc.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"><FileText className="h-4 w-4 shrink-0 text-violet-500" /><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold text-slate-700">{doc.original_name}</p><p className="text-[10px] text-slate-400">{Math.max(1, Math.round(doc.size_bytes / 1024))} KB</p></div><button type="button" onClick={() => void handleDeleteDocument(doc.id)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" title="ลบเอกสาร"><Trash2 className="h-4 w-4" /></button></div>)}
                  </div>
                </div>
              </StudioCard>
            )}

            {activeStep === 2 && (
              <StudioCard eyebrow="02 · INTELLIGENCE" title="AI Analysis Canvas" icon={<Bot className="h-4 w-4" />}>
                <div className="space-y-5">
                  <div className="flex flex-col gap-3 rounded-xl border border-violet-100 bg-violet-50/60 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold text-violet-900">วิเคราะห์วัตถุประสงค์ · กลุ่มเป้าหมาย · สถานที่ · KPI · กำหนดการ</p><p className="mt-1 text-[11px] text-violet-700/70">ผลลัพธ์เป็นข้อเสนอของ AI สำหรับให้ ADMIN ตรวจสอบ</p></div><button type="button" onClick={() => void handleRunAnalysis()} disabled={analysisLoading || !selectedActivityId} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#002d62] px-4 py-2.5 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{analysisLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} {analysisLoading ? "กำลังวิเคราะห์..." : "Run AI Analysis"}</button></div>
                  {analysisLoading && <div><div className="mb-1 flex justify-between text-[10px] font-bold text-slate-500"><span>AI execution progress</span><span>{analysisProgress}%</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: `${analysisProgress}%` }} /></div></div>}
                  {analysisSummary ? <div className="rounded-xl border border-slate-200 p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">AI Summary</p><p className="mt-2 text-sm leading-6 text-slate-700">{analysisSummary}</p></div> : <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">กด Run AI Analysis เพื่อสร้างผลวิเคราะห์จาก source data</div>}
                  {extractedEntities.length > 0 && <div><p className="mb-3 text-xs font-bold text-slate-700">Extracted Entities <span className="font-normal text-slate-400">{extractedEntities.length}</span></p><div className="grid gap-3 sm:grid-cols-2">{extractedEntities.map((entity) => <div key={entity.id} className="rounded-xl border border-slate-200 p-3"><div className="flex items-center justify-between gap-2"><span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">{entity.categoryLabel}</span><span className="text-[10px] font-bold text-emerald-600">{Math.round(entity.confidence * 100)}%</span></div><p className="mt-2 text-xs font-bold text-slate-700">{entity.title}</p><p className="mt-1 text-[11px] leading-5 text-slate-500">{entity.text}</p><p className="mt-2 text-[10px] text-slate-400">Source: {entity.sourceDoc} · p.{entity.page}</p></div>)}</div></div>}
                </div>
              </StudioCard>
            )}

            {activeStep === 3 && (
              <StudioCard eyebrow="03 · GENERATION" title="AI Survey Composer" icon={<Sparkles className="h-4 w-4" />}>
                <div className="space-y-5">
                  <div className="flex flex-col gap-3 rounded-xl border border-sky-100 bg-sky-50/70 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold text-sky-900">สร้างแบบประเมินจาก objective และ evidence ที่ผ่านการวิเคราะห์</p><p className="mt-1 text-[11px] text-sky-700/70">AI ไม่เผยแพร่แบบสอบถามจนกว่า ADMIN จะยืนยัน</p></div><button type="button" onClick={() => void handleRunSurveyGeneration()} disabled={surveyLoading || !analysisReady} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#002d62] px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50">{surveyLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} {surveyLoading ? "กำลังสร้าง..." : "Generate AI Survey"}</button></div>
                  {!generatedSurvey ? <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">ต้องมีผล AI Analysis ก่อนจึงจะสร้างแบบประเมินได้</div> : <>
                    <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-400">Survey</p><p className="mt-1 text-xs font-bold text-slate-700">{generatedSurvey.surveyTitle}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-400">Scale</p><p className="mt-1 text-xs font-bold text-slate-700">{generatedSurvey.scaleType}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-400">Provider</p><p className="mt-1 text-xs font-bold text-emerald-600">Pathumma</p></div></div>
                    <div className="space-y-3">{generatedSurvey.sections.map((section) => <div key={section.id} className="rounded-xl border border-slate-200"><div className="border-b border-slate-100 px-4 py-3"><p className="text-xs font-bold text-[#002d62]">{section.title}</p><p className="mt-1 text-[11px] text-slate-500">{section.description}</p></div><div className="divide-y divide-slate-100">{section.questions.map((question, index) => <div key={question.id} className="p-4"><div className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-[10px] font-bold text-violet-600">{index + 1}</span><div className="min-w-0 flex-1"><p className="text-xs font-semibold text-slate-700">{question.title}</p><p className="mt-1 text-[10px] text-slate-400">{question.questionType} · {question.required === false ? "optional" : "required"}</p><p className="mt-2 text-[10px] text-slate-500">Evidence: {question.sourceCiting} · {question.sourceDocName}</p></div></div></div>)}</div></div>)}</div>
                  </>}
                </div>
              </StudioCard>
            )}

            {activeStep === 4 && (
              <StudioCard eyebrow="04 · HUMAN IN THE LOOP" title="Admin Review Canvas" icon={<ShieldCheck className="h-4 w-4" />}>
                <div className="space-y-5">
                  <div className="rounded-xl border border-amber-100 bg-amber-50 p-4"><p className="text-xs font-bold text-amber-900">ADMIN approval required</p><p className="mt-1 text-[11px] leading-5 text-amber-800/80">ตรวจสอบความสอดคล้องของคำถามกับกิจกรรมก่อนส่งต่อไปยังขั้น Confirm ระบบจะบันทึก execution และ approval ตาม workflow ที่มีอยู่</p></div>
                  <div className="grid gap-3 sm:grid-cols-2">{Object.entries({ objectivesCovered: "คำถามครอบคลุมวัตถุประสงค์", scaleStandard: "มาตราส่วนและรูปแบบคำถามเป็นมาตรฐาน", targetAudienceMatch: "เหมาะกับกลุ่มเป้าหมาย", feedbackAllowed: "เปิดพื้นที่สำหรับข้อเสนอแนะ" }).map(([key, label]) => { const checked = reviewChecklist[key as keyof typeof reviewChecklist]; return <label key={key} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${checked ? "border-emerald-200 bg-emerald-50/40" : "border-slate-200 bg-white"}`}><input type="checkbox" checked={checked} onChange={(e) => setReviewChecklist((prev) => ({ ...prev, [key]: e.target.checked }))} className="mt-0.5 h-4 w-4 accent-[#002d62]" /><span><span className="block text-xs font-bold text-slate-700">{label}</span><span className="mt-1 block text-[10px] text-slate-400">ADMIN review checkpoint</span></span></label>; })}</div>
                  {generatedSurvey && <div className="space-y-4">
                    <div className="rounded-xl border border-slate-200 p-4">
                      <p className="text-xs font-bold text-slate-700">Review target</p>
                      <input value={generatedSurvey.surveyTitle} onChange={(e) => setGeneratedSurvey((current) => current ? { ...current, surveyTitle: e.target.value } : current)} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-[#002d62]" />
                      <p className="mt-2 text-[11px] text-slate-500">{generatedSurvey.sections.reduce((sum, section) => sum + section.questions.length, 0)} questions · Provider: Pathumma</p>
                    </div>
                    <div className="space-y-3">
                      {generatedSurvey.sections.map((section) => <div key={section.id} className="rounded-xl border border-slate-200">
                        <div className="border-b border-slate-100 px-4 py-3"><p className="text-xs font-bold text-[#002d62]">{section.title}</p><p className="mt-1 text-[11px] text-slate-500">{section.description}</p></div>
                        <div className="divide-y divide-slate-100">
                          {section.questions.map((question, index) => <div key={question.id} className="p-4">
                            <div className="flex gap-3">
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-[10px] font-bold text-violet-600">{index + 1}</span>
                              <div className="min-w-0 flex-1">
                                <textarea value={question.title} onChange={(e) => updateSurveyQuestion(section.id, question.id, { title: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700" rows={2} />
                                <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-slate-400">
                                  <span>{question.questionType}</span>
                                  <label className="inline-flex items-center gap-1"><input type="checkbox" checked={question.required !== false} onChange={(e) => updateSurveyQuestion(section.id, question.id, { required: e.target.checked })} /> required</label>
                                </div>
                                <p className="mt-2 text-[10px] text-slate-500">Evidence: {question.sourceCiting} · {question.sourceDocName}</p>
                              </div>
                            </div>
                          </div>)}
                        </div>
                      </div>)}
                    </div>
                    <div className="rounded-xl border border-violet-100 bg-violet-50/50 p-4">
                      <p className="text-xs font-bold text-violet-900">AI Improve</p>
                      <p className="mt-1 text-[10px] text-violet-700/70">ตัวอย่าง: ลดคำถามซ้ำ · ปรับภาษาให้เป็นทางการ · เหมาะกับนักเรียนระดับมัธยม · ลดเหลือ 10 ข้อ</p>
                      <div className="mt-3 flex gap-2">
                        <input value={improveInstruction} onChange={(e) => setImproveInstruction(e.target.value)} className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs" placeholder="คำสั่งที่ต้องการให้ Pathumma ปรับปรุง" />
                        <button type="button" onClick={() => void handleImproveSurvey()} disabled={improvingSurvey || !improveInstruction.trim()} className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50">{improvingSurvey ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />} Improve</button>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button type="button" onClick={() => void handleValidateSurvey()} disabled={validatingSurvey} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 disabled:opacity-50">{validatingSurvey ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />} Validate Survey</button>
                      {validationResult && <span className={`text-xs font-bold ${validationResult.valid ? "text-emerald-600" : "text-rose-600"}`}>{validationResult.valid ? "Validation Passed" : `Needs Fix (${validationResult.errors.length})`}</span>}
                    </div>
                    {validationResult?.warnings.length ? <div className="rounded-lg bg-amber-50 p-3 text-[10px] text-amber-800">{validationResult.warnings.join(" · ")}</div> : null}
                  </div>}
                </div>
              </StudioCard>
            )}

            {activeStep === 5 && (
              <StudioCard eyebrow="05 · CONTROLLED RELEASE" title="Confirm & Bind Survey" icon={<FileCheck2 className="h-4 w-4" />}>
                <div className="space-y-5">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" /><div><p className="text-sm font-bold text-emerald-900">Ready for controlled confirmation</p><p className="mt-1 text-xs leading-5 text-emerald-800/80">เมื่อยืนยันแล้ว ระบบจะเรียก approval workflow และผูกแบบประเมินกับ occurrence ตามข้อมูลจริงของกิจกรรม</p></div></div></div>
                  <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-slate-200 p-4"><p className="text-[10px] text-slate-400">Execution ID</p><p className="mt-1 break-all text-xs font-mono text-slate-700">{surveyExecutionId || "—"}</p></div><div className="rounded-xl border border-slate-200 p-4"><p className="text-[10px] text-slate-400">Survey ID</p><p className="mt-1 break-all text-xs font-mono text-slate-700">{confirmedSurveyId || "pending approval"}</p></div></div>
                  <button type="button" onClick={() => void handleConfirmSurvey()} disabled={confirming || !surveyReady || !checklistReady || Boolean(confirmedSurveyId)} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#002d62] px-4 py-3 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{confirming ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />} {confirmedSurveyId ? "Confirmed & Bound" : "Confirm with Admin Approval"}</button>
                  {confirmedSurveyId && <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-400">Confirmed Survey</p><p className="mt-1 break-all text-[11px] font-mono text-slate-700">{confirmedSurveyId}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-400">Occurrence</p><p className="mt-1 break-all text-[11px] font-mono text-slate-700">{confirmedOccurrenceId || "ผูกตาม workflow"}</p></div></div>}
                </div>
              </StudioCard>
            )}
          </div>

          <aside className="space-y-5">
            <StudioCard eyebrow="WORKSPACE" title="Execution State" icon={<Bot className="h-4 w-4" />}>
              <div className="space-y-3 text-xs">
                {[["Source documents", documents.length > 0], ["AI analysis", analysisReady], ["AI survey", surveyReady], ["Admin review", checklistReady], ["Confirmed", Boolean(confirmedSurveyId)]].map(([label, ready]) => <div key={String(label)} className="flex items-center justify-between gap-3"><span className="text-slate-600">{label}</span><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${ready ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>{ready ? "READY" : "PENDING"}</span></div>)}
              </div>
            </StudioCard>

            <StudioCard eyebrow="DECISION SUPPORT" title="Predictive Metrics" icon={<Sparkles className="h-4 w-4" />}>
              <PredictiveMetricsPanel />
            </StudioCard>

            <StudioCard eyebrow="POST-PROJECT" title="Outcome Report" icon={<FileText className="h-4 w-4" />}>
              <p className="text-[11px] leading-5 text-slate-500">หลังมีผลการประเมิน สามารถใช้ AI สรุปผลสัมฤทธิ์และผลกระทบของโครงการเป็นรายงานสำหรับผู้บริหาร</p>
              <button type="button" onClick={() => void handleGeneratePostReport()} disabled={postReportLoading || !selectedActivityId} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#002d62] px-3 py-2.5 text-xs font-bold text-[#002d62] hover:bg-blue-50 disabled:opacity-50">{postReportLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />} {postReportLoading ? "กำลังสรุป..." : "Generate Post-project Report"}</button>
              {postReport && <div className="mt-4 space-y-3 rounded-xl bg-slate-50 p-3"><p className="text-xs font-bold text-[#002d62]">{postReport.title}</p><p className="text-[11px] leading-5 text-slate-600">{postReport.summary}</p><div className="grid grid-cols-2 gap-2 text-[10px]"><div><span className="text-slate-400">Responses</span><p className="font-bold text-slate-700">{postReport.responseCount ?? 0}</p></div><div><span className="text-slate-400">Satisfaction</span><p className="font-bold text-emerald-600">{postReport.satisfactionPercent ?? "—"}%</p></div></div></div>}
            </StudioCard>
          </aside>
        </div>

        <footer className="sticky bottom-3 z-10 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="text-xs font-bold text-slate-700">Step {activeStep} / 5 · {steps[activeStep - 1].title}</p><p className="mt-0.5 text-[10px] text-slate-400">AI proposes · ADMIN verifies · System commits</p></div>
            <div className="flex items-center gap-2"><button type="button" onClick={() => setActiveStep((value) => Math.max(1, value - 1) as 1 | 2 | 3 | 4 | 5)} disabled={activeStep === 1} className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-600 disabled:opacity-40"><ArrowLeft className="h-4 w-4" />Back</button><button type="button" onClick={goNext} disabled={(activeStep === 2 && !analysisReady) || (activeStep === 3 && !surveyReady) || (activeStep === 4 && !checklistReady) || activeStep === 5} className="inline-flex items-center gap-1 rounded-xl bg-[#002d62] px-4 py-2.5 text-xs font-bold text-white disabled:opacity-40">Continue <ArrowRight className="h-4 w-4" /></button></div>
          </div>
        </footer>
      </div>
    </section>
  );
}
