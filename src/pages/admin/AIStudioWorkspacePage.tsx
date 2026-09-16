import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Bot,
  Calendar,
  CheckCircle2,
  FileCheck2,
  FileText,
  HelpCircle,
  ImagePlus,
  Info,
  Loader2,
  MapPin,
  Newspaper,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getAdminActivities, type AdminActivity } from "@/services/api";
import {
  analyzeActivityDocument,
  confirmAiSurvey,
  deleteActivityDocument,
  generateAiSurvey,
  getActivityDocuments,
  getPreviousAnalysis,
  getPreviousGeneratedSurvey,
  uploadActivityDocument,
  type ActivityDocument,
  type ExtractedEntity,
  type GeneratedSurvey,
} from "@/services/admin-ai-workflow";

const statusLabel: Record<string, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};

export function AIStudioWorkspacePage() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState<string>("");
  const [loadingActivities, setLoadingActivities] = useState(true);

  // Stepper state (Step 1 to Step 5)
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Documents state (Step 1)
  const [documents, setDocuments] = useState<ActivityDocument[]>([]);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  // AI Analysis state (Step 2)
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisSummary, setAnalysisSummary] = useState("");
  const [extractedEntities, setExtractedEntities] = useState<ExtractedEntity[]>([]);

  // AI Survey state (Step 3)
  const [surveyLoading, setSurveyLoading] = useState(false);
  const [generatedSurvey, setGeneratedSurvey] = useState<GeneratedSurvey | null>(null);
  const [surveyExecutionId, setSurveyExecutionId] = useState("");

  // Admin Review Checklist (Step 4)
  const [reviewChecklist, setReviewChecklist] = useState({
    objectivesCovered: true,
    scaleStandard: true,
    targetAudienceMatch: true,
    feedbackAllowed: true,
  });

  // Admin Confirm state (Step 5)
  const [confirming, setConfirming] = useState(false);
  const [confirmedSurveyId, setConfirmedSurveyId] = useState<string | null>(null);
  const [confirmedOccurrenceId, setConfirmedOccurrenceId] = useState<string | null>(null);

  // Load activities
  async function loadActivities() {
    setLoadingActivities(true);
    try {
      const rows = await getAdminActivities();
      const valid = rows.filter((x) => x.status !== "archived");
      setActivities(valid);
      if (!selectedActivityId && valid[0]?.id) {
        setSelectedActivityId(valid[0].id);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "โหลดกิจกรรมไม่สำเร็จ");
    } finally {
      setLoadingActivities(false);
    }
  }

  useEffect(() => {
    void loadActivities();
  }, []);

  const selectedActivity = useMemo(
    () => activities.find((x) => x.id === selectedActivityId) ?? null,
    [activities, selectedActivityId],
  );

  // Load activity-specific data when selectedActivity changes
  async function loadActivityData(activityId: string) {
    if (!activityId) return;
    try {
      const [docs, prevAnalysis, prevSurvey] = await Promise.all([
        getActivityDocuments(activityId),
        getPreviousAnalysis(activityId),
        getPreviousGeneratedSurvey(activityId),
      ]);
      setDocuments(docs);
      if (prevAnalysis?.output?.extractedEntities?.length) {
        setExtractedEntities(prevAnalysis.output.extractedEntities);
        setAnalysisSummary(prevAnalysis.output.summary || "");
      } else {
        setExtractedEntities([]);
        setAnalysisSummary("");
      }
      if (prevSurvey?.survey) {
        setGeneratedSurvey(prevSurvey.survey);
        setSurveyExecutionId(prevSurvey.id);
        if (prevSurvey.status === "completed") {
          setConfirmedSurveyId(prevSurvey.id);
        }
      } else {
        setGeneratedSurvey(null);
        setSurveyExecutionId("");
        setConfirmedSurveyId(null);
      }
    } catch (error) {
      console.error("Failed to load activity details", error);
    }
  }

  useEffect(() => {
    if (selectedActivityId) {
      void loadActivityData(selectedActivityId);
    }
  }, [selectedActivityId]);

  // Document Upload
  async function handleFileUpload(file: File) {
    if (!selectedActivityId) return;
    setUploadingDoc(true);
    try {
      const uploaded = await uploadActivityDocument(selectedActivityId, file);
      setDocuments((prev) => [uploaded, ...prev]);
      toast.success(`อัปโหลด "${file.name}" สำเร็จ`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "อัปโหลดไฟล์ไม่สำเร็จ");
    } finally {
      setUploadingDoc(false);
    }
  }

  // Document Delete
  async function handleDeleteDocument(id: string) {
    try {
      await deleteActivityDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      toast.success("ลบเอกสารแล้ว");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ลบเอกสารไม่สำเร็จ");
    }
  }

  // Trigger AI Document Analysis (Step 2)
  async function handleRunAnalysis() {
    if (!selectedActivityId) return;
    setAnalysisLoading(true);
    setAnalysisProgress(20);
    try {
      const progressTimer = setInterval(() => {
        setAnalysisProgress((prev) => (prev < 90 ? prev + 25 : prev));
      }, 500);

      const res = await analyzeActivityDocument(selectedActivityId);
      clearInterval(progressTimer);
      setAnalysisProgress(100);
      setExtractedEntities(res.extractedEntities);
      setAnalysisSummary(res.summary);
      toast.success("AI วิเคราะห์เอกสารและข้อมูลโครงการสำเร็จ");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "การวิเคราะห์โดย AI ล้มเหลว");
    } finally {
      setAnalysisLoading(false);
    }
  }

  // Trigger AI Survey Generation (Step 3)
  async function handleRunSurveyGeneration() {
    if (!selectedActivityId) return;
    setSurveyLoading(true);
    try {
      const res = await generateAiSurvey(selectedActivityId, extractedEntities);
      setGeneratedSurvey(res.survey);
      setSurveyExecutionId(res.executionId);
      toast.success("AI จัดทำแบบสอบถามสำเร็จ พร้อมให้ ADMIN ทวนสอบ");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "สร้างแบบสอบถามไม่สำเร็จ");
    } finally {
      setSurveyLoading(false);
    }
  }

  // Admin Confirmation & Survey Binding (Step 5)
  async function handleConfirmSurvey() {
    if (!surveyExecutionId) {
      toast.error("ไม่พบรหัสงานที่รอการอนุมัติ");
      return;
    }
    setConfirming(true);
    try {
      const res = await confirmAiSurvey(surveyExecutionId, "approved");
      setConfirmedSurveyId(res.surveyId || surveyExecutionId);
      setConfirmedOccurrenceId(res.occurrenceId || null);
      toast.success("ยืนยันแบบสอบถามและผูกเข้ากับกิจกรรมเรียบร้อยแล้ว");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "การยืนยันล้มเหลว");
    } finally {
      setConfirming(false);
    }
  }

  const allChecklistApproved = Object.values(reviewChecklist).every(Boolean);

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-[#f8f9ff] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px] space-y-5">
        {/* Header Hero Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#002d62] via-[#0c2340] to-[#00193c] px-5 py-6 text-white shadow-sm sm:px-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold tracking-wider text-[#d7e2ff]">
                <Sparkles className="h-3.5 w-3.5 text-sky-300" /> AI ASSISTANT STUDIO
              </div>
              <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-[30px]">
                AI Studio Workspace
              </h1>
              <p className="mt-1 text-sm leading-6 text-[#d7e2ff]">
                ศูนย์กลาง Workflow กิจกรรมและแบบประเมินผลสัมฤทธิ์ ขับเคลื่อนด้วย AI อัจฉริยะ ภายใต้การควบคุมของ ADMIN (Human-in-the-loop)
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <ShieldCheck className="h-4 w-4 text-[#95f8a7]" /> Governed AI Pipeline
                </div>
                <p className="mt-0.5 text-[11px] text-white/70">RBAC · Approval · Audit Logs</p>
              </div>
              <Link
                to="/admin/activities"
                className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-2 text-xs font-bold text-white hover:bg-white/25"
              >
                <Plus className="h-4 w-4" /> จัดการกิจกรรม
              </Link>
            </div>
          </div>

          {/* Activity Selector Bar */}
          <div className="mt-5 flex flex-col gap-3 rounded-xl bg-black/25 p-3.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              <Activity className="h-4 w-4 text-sky-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                เลือกกิจกรรมเป้าหมาย:
              </span>
            </div>
            <div className="flex flex-1 items-center gap-2 sm:max-w-xl">
              {loadingActivities ? (
                <div className="text-xs text-slate-400">กำลังโหลดรายการกิจกรรม...</div>
              ) : activities.length === 0 ? (
                <div className="text-xs text-amber-300">ยังไม่มีกิจกรรมในระบบ กรุณาสร้างกิจกรรมก่อน</div>
              ) : (
                <select
                  value={selectedActivityId}
                  onChange={(e) => {
                    setSelectedActivityId(e.target.value);
                    setActiveStep(1);
                  }}
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm focus:bg-[#00193c] focus:outline-none"
                >
                  {activities.map((a) => (
                    <option key={a.id} value={a.id} className="bg-[#002d62] text-white">
                      {a.title} ({statusLabel[a.status] ?? a.status})
                    </option>
                  ))}
                </select>
              )}
              <button
                type="button"
                onClick={() => void loadActivities()}
                title="รีเฟรชข้อมูล"
                className="rounded-lg border border-white/20 bg-white/10 p-2 text-white hover:bg-white/20"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Selected Activity Meta Card */}
        {selectedActivity && (
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">กิจกรรม</span>
              <p className="mt-1 truncate text-sm font-bold text-[#002d62]">{selectedActivity.title}</p>
              <p className="text-[11px] text-slate-500 truncate">/{selectedActivity.slug}</p>
            </div>
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">กำหนดการ</span>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                {new Date(selectedActivity.activityDate).toLocaleDateString("th-TH")}
              </p>
            </div>
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">สถานที่</span>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-700 truncate">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                {selectedActivity.location || "วิทยาเขตลำปาง"}
              </p>
            </div>
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ผู้เข้าร่วมเป้าหมาย</span>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <Users className="h-3.5 w-3.5 text-slate-400" />
                {selectedActivity.participantCount ?? 0} คน
              </p>
            </div>
          </div>
        )}

        {/* 5-Step Workflow Stepper */}
        <div className="rounded-2xl border bg-white p-4 shadow-sm sm:p-5">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {[
              { step: 1, label: "01 ข้อมูล & เอกสาร", desc: "Activity & Docs", icon: FileText },
              { step: 2, label: "02 AI วิเคราะห์เอกสาร", desc: "Document Analysis", icon: Bot },
              { step: 3, label: "03 AI สร้าง Survey", desc: "Survey Generation", icon: Sparkles },
              { step: 4, label: "04 ADMIN ทวนสอบ", desc: "Admin Review", icon: ShieldCheck },
              { step: 5, label: "05 ยืนยัน & ผูกกิจกรรม", desc: "Confirm & Bind", icon: CheckCircle2 },
            ].map((s) => {
              const Icon = s.icon;
              const isActive = activeStep === s.step;
              const isPast = activeStep > s.step;
              return (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => setActiveStep(s.step as typeof activeStep)}
                  className={`flex flex-col items-start rounded-xl border p-3 text-left transition ${
                    isActive
                      ? "border-[#002d62] bg-[#002d62] text-white shadow-sm"
                      : isPast
                        ? "border-emerald-200 bg-emerald-50/50 text-emerald-800"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider ${
                        isActive ? "text-sky-200" : isPast ? "text-emerald-700" : "text-slate-400"
                      }`}
                    >
                      STEP 0{s.step}
                    </span>
                    <Icon className={`h-4 w-4 ${isActive ? "text-white" : isPast ? "text-emerald-600" : "text-slate-400"}`} />
                  </div>
                  <p className={`mt-2 text-xs font-bold ${isActive ? "text-white" : "text-slate-900"}`}>{s.label}</p>
                  <p className={`text-[10px] ${isActive ? "text-slate-200" : "text-slate-400"}`}>{s.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 1: Activity Info & Document Upload */}
        {activeStep === 1 && (
          <div className="space-y-4">
            <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    STEP 1: ACTIVITY CONTEXT & OFFICIAL DOCUMENTS
                  </span>
                  <h2 className="mt-1 text-lg font-bold text-[#002d62]">
                    เอกสารราชการและบริบทกิจกรรม
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    อัปโหลดเอกสารขออนุมัติโครงการ กำหนดการ หรือบันทึกข้อความ (PDF/DOCX) เพื่อให้ AI ใช้เป็นฐานข้อมูลในการวิเคราะห์
                  </p>
                </div>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#002d62] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#00244f]">
                  <Upload className="h-4 w-4" />
                  <span>{uploadingDoc ? "กำลังอัปโหลด..." : "อัปโหลดเอกสาร"}</span>
                  <input
                    type="file"
                    accept="application/pdf,image/jpeg,image/png,image/webp"
                    disabled={uploadingDoc}
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleFileUpload(file);
                    }}
                  />
                </label>
              </div>

              {/* Uploaded Documents List */}
              <div className="mt-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  เอกสารที่อัปโหลดแล้วในระบบ ({documents.length})
                </h3>
                {documents.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
                    <FileText className="mx-auto h-8 w-8 text-slate-300" />
                    <p className="mt-2 text-xs font-semibold text-slate-600">ยังไม่มีเอกสารแนบสำหรับกิจกรรมนี้</p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      คุณสามารถอัปโหลดไฟล์ PDF หรือกดดำเนินการต่อเพื่อให้ AI ดึงข้อมูลจากฐานข้อมูลกิจกรรมที่มีอยู่
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-3.5"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="grid h-8 w-8 place-items-center rounded-lg bg-red-50 text-red-600 shrink-0">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-bold text-slate-800">{doc.original_name}</p>
                            <p className="text-[10px] text-slate-400">
                              {(doc.size_bytes / (1024 * 1024)).toFixed(2)} MB · {doc.created_at ? new Date(doc.created_at).toLocaleDateString("th-TH") : "พร้อมใช้งาน"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <a
                            href={doc.public_url}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg border bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
                          >
                            เปิดดู
                          </a>
                          <button
                            type="button"
                            onClick={() => void handleDeleteDocument(doc.id)}
                            className="rounded-lg p-1 text-slate-400 hover:text-red-600"
                            title="ลบเอกสาร"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Nav */}
              <div className="mt-6 flex justify-end border-t pt-4">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#002d62] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#00244f]"
                >
                  <span>ต่อไป: AI วิเคราะห์เอกสาร</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: AI Document Analysis */}
        {activeStep === 2 && (
          <div className="space-y-4">
            <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                    STEP 2: AI PROCESSING & EXTRACTION
                  </span>
                  <h2 className="mt-1 text-lg font-bold text-[#002d62]">
                    AI วิเคราะห์เอกสารราชการและสกัดสาระสำคัญ
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    AI ดึงข้อมูลวัตถุประสงค์ กลุ่มเป้าหมาย สถานที่ KPI และกำหนดการ เพื่อเตรียมสร้างแบบสอบถาม
                  </p>
                </div>
                <button
                  type="button"
                  disabled={analysisLoading}
                  onClick={() => void handleRunAnalysis()}
                  className="inline-flex items-center gap-2 rounded-xl bg-purple-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-purple-800 disabled:opacity-50"
                >
                  {analysisLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  <span>{extractedEntities.length > 0 ? "วิเคราะห์ใหม่ (Retry)" : "เริ่มให้ AI วิเคราะห์"}</span>
                </button>
              </div>

              {/* Live progress if running */}
              {analysisLoading && (
                <div className="mt-5 rounded-xl border border-purple-200 bg-purple-50/50 p-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-900">กำลังประมวลผลข้อมูลเอกสารด้วย AI...</span>
                    <span className="font-black text-purple-700">{analysisProgress}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-purple-200">
                    <div
                      className="h-full bg-purple-600 transition-all duration-500"
                      style={{ width: `${analysisProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Analysis Summary */}
              {analysisSummary && (
                <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-950">
                    <Bot className="h-4 w-4 text-indigo-600" /> สรุปผลการวิเคราะห์ภาพรวม
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-indigo-900/80">{analysisSummary}</p>
                </div>
              )}

              {/* Extracted Entities Grid */}
              <div className="mt-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  สาระสำคัญที่สกัดได้ ({extractedEntities.length} หมวดหมู่)
                </h3>
                {extractedEntities.length === 0 && !analysisLoading ? (
                  <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
                    <Bot className="mx-auto h-8 w-8 text-slate-300" />
                    <p className="mt-2 text-xs font-semibold text-slate-600">ยังไม่ได้เริ่มการวิเคราะห์</p>
                    <button
                      type="button"
                      onClick={() => void handleRunAnalysis()}
                      className="mt-3 inline-flex rounded-lg bg-purple-700 px-4 py-2 text-xs font-bold text-white"
                    >
                      กดเริ่มให้ AI วิเคราะห์ตอนนี้
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {extractedEntities.map((ent) => (
                      <div key={ent.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold text-purple-800">
                            {ent.categoryLabel || ent.category}
                          </span>
                          <span className="text-[10px] font-semibold text-emerald-700">
                            ความเชื่อมั่น {ent.confidence}%
                          </span>
                        </div>
                        <h4 className="mt-2 text-sm font-bold text-slate-900">{ent.title}</h4>
                        <p className="mt-1 text-xs leading-relaxed text-slate-600">{ent.text}</p>
                        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400">
                          <Info className="h-3 w-3" />
                          <span>อ้างอิง: {ent.sourceDoc} ({ent.page})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Stepper Nav */}
              <div className="mt-6 flex justify-between border-t pt-4">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <ArrowLeft className="h-4 w-4" /> ย้อนกลับ
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  disabled={extractedEntities.length === 0}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#002d62] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#00244f] disabled:opacity-50"
                >
                  <span>ต่อไป: AI สร้างแบบสอบถาม</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: AI Survey Generation */}
        {activeStep === 3 && (
          <div className="space-y-4">
            <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                    STEP 3: AI SURVEY GENERATION
                  </span>
                  <h2 className="mt-1 text-lg font-bold text-[#002d62]">
                    AI จัดทำแบบสอบถามประเมินผลสัมฤทธิ์
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    แปลงผลการวิเคราะห์และวัตถุประสงค์เป็นข้อคำถามมาตรฐาน Likert 5 ระดับ และข้อเสนอแนะ
                  </p>
                </div>
                <button
                  type="button"
                  disabled={surveyLoading}
                  onClick={() => void handleRunSurveyGeneration()}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-800 disabled:opacity-50"
                >
                  {surveyLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  <span>{generatedSurvey ? "สร้างใหม่ (Regenerate)" : "เริ่มสร้างแบบสอบถาม"}</span>
                </button>
              </div>

              {/* Survey Content */}
              {!generatedSurvey && !surveyLoading ? (
                <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center">
                  <Sparkles className="mx-auto h-8 w-8 text-slate-300" />
                  <p className="mt-2 text-xs font-semibold text-slate-600">ยังไม่มีแบบสอบถามที่สร้างโดย AI</p>
                  <button
                    type="button"
                    onClick={() => void handleRunSurveyGeneration()}
                    className="mt-3 inline-flex rounded-lg bg-indigo-700 px-4 py-2 text-xs font-bold text-white"
                  >
                    เริ่มสร้างแบบสอบถามทันที
                  </button>
                </div>
              ) : generatedSurvey ? (
                <div className="mt-5 space-y-4">
                  <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-indigo-950">{generatedSurvey.surveyTitle}</h4>
                        <p className="mt-0.5 text-xs text-indigo-800/80">{generatedSurvey.scaleType}</p>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-800">
                        AI Confidence: {generatedSurvey.aiConfidenceScore}%
                      </span>
                    </div>
                  </div>

                  {/* Sections and Questions */}
                  <div className="space-y-4">
                    {generatedSurvey.sections.map((section, sIdx) => (
                      <div key={section.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                        <div className="border-b pb-2">
                          <h4 className="text-xs font-bold text-slate-900">{section.title}</h4>
                          <p className="text-[11px] text-slate-500">{section.description}</p>
                        </div>
                        <div className="mt-3 divide-y">
                          {section.questions.map((q, qIdx) => (
                            <div key={q.id} className="py-2.5 text-xs">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="font-semibold text-slate-800">
                                    {q.title}
                                  </p>
                                  <p className="mt-0.5 text-[10px] text-slate-400">
                                    ประเภท: {q.questionType === "likert5" ? "สเกล 1-5" : q.questionType} · อ้างอิง: {q.sourceCiting}
                                  </p>
                                </div>
                                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 shrink-0">
                                  {q.required ? "จำเป็น" : "ไม่บังคับ"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Stepper Nav */}
              <div className="mt-6 flex justify-between border-t pt-4">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <ArrowLeft className="h-4 w-4" /> ย้อนกลับ
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(4)}
                  disabled={!generatedSurvey}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#002d62] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#00244f] disabled:opacity-50"
                >
                  <span>ส่งต่อให้ ADMIN ทวนสอบ</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Admin Review (Human-in-the-loop) */}
        {activeStep === 4 && (
          <div className="space-y-4">
            <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
              <div className="border-b pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                  STEP 4: ADMIN REVIEW (HUMAN-IN-THE-LOOP)
                </span>
                <h2 className="mt-1 text-lg font-bold text-[#002d62]">
                  ADMIN ทวนแบบสอบถามก่อนยืนยัน
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  ตรวจสอบความถูกต้อง ความสอดคล้องตามเกณฑ์มาตรฐาน โดยไม่แก้ไขแบบสอบถามโดยตรง
                </p>
              </div>

              {/* Review Checklist */}
              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50/40 p-4">
                <h3 className="text-xs font-bold text-amber-950 flex items-center gap-2">
                  <FileCheck2 className="h-4 w-4 text-amber-700" /> รายการตรวจสอบคุณภาพของ ADMIN
                </h3>
                <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={reviewChecklist.objectivesCovered}
                      onChange={(e) =>
                        setReviewChecklist((prev) => ({ ...prev, objectivesCovered: e.target.checked }))
                      }
                      className="h-4 w-4 rounded border-slate-300 text-[#002d62]"
                    />
                    <span>วัตถุประสงค์โครงการครอบคลุมในแบบประเมิน</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={reviewChecklist.scaleStandard}
                      onChange={(e) =>
                        setReviewChecklist((prev) => ({ ...prev, scaleStandard: e.target.checked }))
                      }
                      className="h-4 w-4 rounded border-slate-300 text-[#002d62]"
                    />
                    <span>สเกลการประเมินเป็นมาตรฐาน Likert 5 ระดับ</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={reviewChecklist.targetAudienceMatch}
                      onChange={(e) =>
                        setReviewChecklist((prev) => ({ ...prev, targetAudienceMatch: e.target.checked }))
                      }
                      className="h-4 w-4 rounded border-slate-300 text-[#002d62]"
                    />
                    <span>กลุ่มเป้าหมายสอดคล้องกับเอกสารโครงการ</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={reviewChecklist.feedbackAllowed}
                      onChange={(e) =>
                        setReviewChecklist((prev) => ({ ...prev, feedbackAllowed: e.target.checked }))
                      }
                      className="h-4 w-4 rounded border-slate-300 text-[#002d62]"
                    />
                    <span>มีช่องทางรับฟังความคิดเห็นและข้อเสนอแนะ</span>
                  </label>
                </div>
              </div>

              {/* Preview of Questions being reviewed */}
              {generatedSurvey && (
                <div className="mt-5 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    สรุปคำถามที่ทวนสอบ ({generatedSurvey.sections.reduce((acc, s) => acc + s.questions.length, 0)} ข้อ)
                  </h3>
                  <div className="max-h-80 overflow-y-auto rounded-xl border border-slate-200 divide-y bg-slate-50/40">
                    {generatedSurvey.sections.flatMap((s) => s.questions).map((q, i) => (
                      <div key={q.id} className="p-3 text-xs flex items-center justify-between gap-3">
                        <span className="font-semibold text-slate-800">{i + 1}. {q.title}</span>
                        <span className="text-[10px] text-emerald-700 font-bold shrink-0">✓ ผ่านเกณฑ์</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stepper Nav */}
              <div className="mt-6 flex justify-between border-t pt-4">
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <ArrowLeft className="h-4 w-4" /> ย้อนกลับ
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(5)}
                  disabled={!allChecklistApproved}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 disabled:opacity-50"
                >
                  <span>ผ่านการทวนสอบ → ไปขั้นตอนยืนยัน</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Admin Confirm & Survey Binding */}
        {activeStep === 5 && (
          <div className="space-y-4">
            <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
              <div className="border-b pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  STEP 5: ADMIN CONFIRMATION & BINDING
                </span>
                <h2 className="mt-1 text-lg font-bold text-[#002d62]">
                  ยืนยันและนำแบบสอบถามไปผูกกับกิจกรรม
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  บันทึกแบบสอบถามที่ผ่านการทวนสอบลงสู่ Production Database และผูกเข้ากับกิจกรรมเป้าหมายโดยตรง
                </p>
              </div>

              {confirmedSurveyId ? (
                /* Confirmed Success State */
                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 text-emerald-950">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white shadow-sm shrink-0">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-emerald-900">
                          แบบสอบถามถูกผูกเข้ากับกิจกรรมเรียบร้อยแล้ว
                        </h3>
                        <p className="text-xs text-emerald-800">
                          ระบบได้บันทึกคำถามลงในฐานข้อมูลกลาง และเปิดให้รับคำตอบผ่านลิงก์สาธารณะแล้ว
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-2 rounded-xl bg-white p-3.5 text-xs text-slate-700 sm:grid-cols-2">
                      <div>
                        <span className="text-slate-400">กิจกรรม:</span>{" "}
                        <span className="font-bold text-slate-900">{selectedActivity?.title}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">รหัสแบบสอบถาม (Survey ID):</span>{" "}
                        <span className="font-mono font-semibold text-slate-900">{confirmedSurveyId}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      to="/survey"
                      target="_blank"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#002d62] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#00244f]"
                    >
                      <HelpCircle className="h-4 w-4" /> เปิดดูหน้าตอบแบบสอบถาม (Public Survey)
                    </Link>
                    <Link
                      to={`/admin/post-project`}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-800"
                    >
                      <Newspaper className="h-4 w-4" /> ไปต่อยัง Post-Project Workflow (เสร็จสิ้นโครงการ / รายงานผล)
                    </Link>
                  </div>
                </div>
              ) : (
                /* Pre-Confirmation Summary Card */
                <div className="mt-5 space-y-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      สรุปข้อมูลก่อนยืนยัน
                    </h3>
                    <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
                      <div>
                        <dt className="text-slate-400">กิจกรรมเป้าหมาย:</dt>
                        <dd className="font-bold text-slate-800">{selectedActivity?.title}</dd>
                      </div>
                      <div>
                        <dt className="text-slate-400">วันที่จัด:</dt>
                        <dd className="font-semibold text-slate-800">
                          {selectedActivity?.activityDate ? new Date(selectedActivity.activityDate).toLocaleDateString("th-TH") : "-"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-slate-400">จำนวนเอกสารแนบ:</dt>
                        <dd className="font-semibold text-slate-800">{documents.length} ฉบับ</dd>
                      </div>
                      <div>
                        <dt className="text-slate-400">จำนวนข้อคำถามที่สร้าง:</dt>
                        <dd className="font-semibold text-slate-800">
                          {generatedSurvey?.sections.reduce((acc, s) => acc + s.questions.length, 0) ?? 0} ข้อ
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="flex items-center justify-between border-t pt-4">
                    <button
                      type="button"
                      onClick={() => setActiveStep(4)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <ArrowLeft className="h-4 w-4" /> ย้อนกลับ
                    </button>
                    <button
                      type="button"
                      disabled={confirming}
                      onClick={() => void handleConfirmSurvey()}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-800 disabled:opacity-50"
                    >
                      {confirming ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                      <span>ยืนยันและนำแบบสอบถามไปผูกกับกิจกรรม</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
