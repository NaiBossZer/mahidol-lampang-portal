import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ClipboardList, Copy, Download, ExternalLink, Eye, FileText, Plus, QrCode, RefreshCw, Save, Sparkles, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { type ActivityOccurrence } from "@/services/admin-occurrences";
import {
  createAdminQuestion,
  createAdminSurvey,
  getSurveyWorkspaceData,
  getSurveyTestResponses,
  deleteSurveyTestResponse,
  updateAdminQuestion,
  updateAdminSurvey,
  type SurveyTestResponse,
  type AdminSurvey,
  type SurveyQuestion,
} from "@/services/admin-surveys";
import {
  AdminButton,
  AdminCard,
  AdminEmptyState,
  AdminFilterBar,
  AdminLoadingState,
  AdminPageHeader,
  AdminSearchInput,
  AdminStatusBadge,
  AdminTable,
  AdminTableHeader,
  AdminTableRow,
} from "@/components/admin/ui/AdminPrimitives";

const emptyDraft: Partial<SurveyQuestion> = {
  question_type: "rating",
  required: true,
  section_key: "general",
  scale_min: 1,
  scale_max: 5,
  options: [],
};

function surveyAvailability(survey: AdminSurvey) {
  if (!survey.enabled) return { label: "ปิดใช้งาน", tone: "neutral" as const };
  const now = Date.now();
  if (survey.open_at && now < Date.parse(survey.open_at))
    return { label: "รอเปิดรับคำตอบ", tone: "neutral" as const };
  if (survey.close_at && now > Date.parse(survey.close_at))
    return { label: "ปิดรับคำตอบแล้ว", tone: "neutral" as const };
  return { label: "เปิดรับคำตอบ", tone: "success" as const };
}

function toLocalDateTimeInput(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16);
}

function fromLocalDateTimeInput(value: string) {
  return value ? new Date(value).toISOString() : null;
}

export function SurveyManagementPage() {
  const [occurrences, setOccurrences] = useState<ActivityOccurrence[]>([]);
  const [surveys, setSurveys] = useState<AdminSurvey[]>([]);
  const [selected, setSelected] = useState<AdminSurvey | null>(null);
  const [draft, setDraft] = useState<Partial<SurveyQuestion>>(emptyDraft);
  const [search, setSearch] = useState("");
  const [activityFilter, setActivityFilter] = useState("");
  const [activityTitles, setActivityTitles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [surveyTitleDraft, setSurveyTitleDraft] = useState("");
  const [surveyTitleSaving, setSurveyTitleSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"list" | "builder">("list");
  const [previewSurvey, setPreviewSurvey] = useState<AdminSurvey | null>(null);
  const [testResponsesSurvey, setTestResponsesSurvey] = useState<AdminSurvey | null>(null);
  const [qrSurvey, setQrSurvey] = useState<AdminSurvey | null>(null);
  const [qrDownloading, setQrDownloading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const workspace = await getSurveyWorkspaceData();
      setActivityTitles(workspace.activityTitles);
      setOccurrences(workspace.occurrences);
      setSurveys(workspace.surveys);

      const requestedActivityId =
        new URLSearchParams(window.location.search).get("activity") ??
        new URLSearchParams(window.location.search).get("activityId") ??
        "";
      if (requestedActivityId) setActivityFilter(requestedActivityId);
      if (selected) {
        setSelected(workspace.surveys.find((x) => x.id === selected.id) ?? null);
      } else if (requestedActivityId) {
        const matched = workspace.surveys.find((survey) =>
          workspace.occurrences.some(
            (occurrence) =>
              occurrence.id === survey.occurrence_id &&
              occurrence.activity_id === requestedActivityId,
          ),
        );
        setSelected(matched ?? null);
      } else {
        setSelected(null);
      }
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
    setSurveyTitleDraft(selected?.title ?? "");
  }, [selected?.id, selected?.title]);

  const filteredSurveys = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return surveys.filter((survey) => {
      const occurrence = occurrences.find((item) => item.id === survey.occurrence_id);
      if (activityFilter && occurrence?.activity_id !== activityFilter) return false;
      const activityTitle = occurrence ? (activityTitles[occurrence.activity_id] ?? "") : "";
      const searchText =
        `${activityTitle} ${survey.id} ${survey.anonymous ? "anonymous" : "identified"} ${survey.questions.length}`.toLowerCase();
      return !needle || searchText.includes(needle);
    });
  }, [activityFilter, activityTitles, occurrences, search, surveys]);

  function resetDraft() {
    setDraft({ ...emptyDraft });
  }

  function selectSurvey(survey: AdminSurvey) {
    setSelected(survey);
    resetDraft();
    setActiveTab("builder");
  }

  async function createSurvey() {
    if (!activityFilter) {
      toast.error("กรุณาเลือกกิจกรรม");
      return;
    }

    const occurrence = occurrences
      .filter(
        (item) =>
          item.activity_id === activityFilter && !["cancelled", "archived"].includes(item.status),
      )
      .sort((a, b) => a.occurrence_no - b.occurrence_no)[0];

    if (!occurrence) {
      toast.error("กิจกรรมนี้ยังไม่มีข้อมูลสำหรับสร้างแบบประเมิน");
      return;
    }

    try {
      const created = await createAdminSurvey({
        occurrenceId: occurrence.id,
        title: activityTitles[activityFilter]?.trim() || "แบบประเมินกิจกรรม",
        enabled: false,
        anonymous: false,
        openAt: null,
        closeAt: null,
        welcomeText: "ขอความร่วมมือประเมินกิจกรรม",
      });
      setSurveys((items) => [created, ...items]);
      setSelected(created);
      resetDraft();
      setActiveTab("builder");
      toast.success("สร้างแบบประเมินแล้ว กรุณาเปิดใช้งานเมื่อพร้อมรับคำตอบ");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "สร้างแบบประเมินไม่สำเร็จ");
    }
  }

  async function saveSurveyTitle() {
    if (!selected) return;
    const title = surveyTitleDraft.trim();
    if (!title) {
      toast.error("กรุณาระบุชื่อแบบประเมิน");
      return;
    }

    setSurveyTitleSaving(true);
    try {
      const updated = await updateAdminSurvey(selected.id, { title });
      setSelected({ ...selected, ...updated });
      setSurveys((items) =>
        items.map((item) => (item.id === selected.id ? { ...item, ...updated } : item)),
      );
      setSurveyTitleDraft(updated.title ?? title);
      toast.success("บันทึกชื่อแบบประเมินแล้ว");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "บันทึกชื่อแบบประเมินไม่สำเร็จ");
    } finally {
      setSurveyTitleSaving(false);
    }
  }

  async function saveQuestion() {
    if (!selected || !String(draft.question_text ?? "").trim()) {
      toast.error("กรุณาระบุคำถาม");
      return;
    }

    const question: SurveyQuestion = {
      id: String(draft.id ?? ""),
      survey_id: selected.id,
      section_key: String(draft.section_key ?? "general"),
      question_text: String(draft.question_text).trim(),
      question_type: (draft.question_type ?? "rating") as SurveyQuestion["question_type"],
      required: draft.required !== false,
      order_index: Number(draft.order_index ?? selected.questions.length),
      options: Array.isArray(draft.options) ? draft.options : [],
      scale_min: Number(draft.scale_min ?? 1),
      scale_max: Number(draft.scale_max ?? 5),
      active: draft.active !== false,
    };

    try {
      const saved = question.id
        ? await updateAdminQuestion(question)
        : await createAdminQuestion(question);
      setSelected({
        ...selected,
        questions: question.id
          ? selected.questions.map((item) => (item.id === saved.id ? saved : item))
          : [...selected.questions, saved],
      });
      setSurveys((items) =>
        items.map((item) =>
          item.id === selected.id
            ? {
                ...item,
                questions: question.id
                  ? item.questions.map((q) => (q.id === saved.id ? saved : q))
                  : [...item.questions, saved],
              }
            : item,
        ),
      );
      resetDraft();
      toast.success(question.id ? "บันทึกคำถามแล้ว" : "เพิ่มคำถามแล้ว");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "บันทึกคำถามไม่สำเร็จ");
    }
  }

  async function deactivate(question: SurveyQuestion) {
    if (!selected) return;
    try {
      const saved = await updateAdminQuestion({ ...question, active: false });
      setSelected({
        ...selected,
        questions: selected.questions.filter((item) => item.id !== saved.id),
      });
      setSurveys((items) =>
        items.map((item) =>
          item.id === selected.id
            ? { ...item, questions: item.questions.filter((q) => q.id !== saved.id) }
            : item,
        ),
      );
      toast.success("ปิดใช้งานคำถามแล้ว");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "ปิดใช้งานไม่สำเร็จ");
    }
  }

  const selectedOccurrence = selected
    ? occurrences.find((item) => item.id === selected.occurrence_id)
    : null;
  const enabledCount = surveys.filter((survey) => survey.enabled).length;
  const disabledCount = surveys.length - enabledCount;
  const totalQuestions = surveys.reduce((sum, survey) => sum + survey.questions.length, 0);
  const publicSurveyUrl = (surveyId: string) =>
    `${window.location.origin}/survey?surveyId=${encodeURIComponent(surveyId)}`;
  const qrImageUrl = qrSurvey
    ? `https://api.qrserver.com/v1/create-qr-code/?size=640x640&format=png&margin=16&data=${encodeURIComponent(publicSurveyUrl(qrSurvey.id))}`
    : "";

  async function copySurveyLink(survey: AdminSurvey) {
    try {
      await navigator.clipboard.writeText(publicSurveyUrl(survey.id));
      toast.success("คัดลอกลิงก์แบบประเมินแล้ว");
    } catch {
      toast.error("ไม่สามารถคัดลอกลิงก์ได้ กรุณาคัดลอกจากช่อง URL");
    }
  }

  async function downloadSurveyQr() {
    if (!qrSurvey || !qrImageUrl) return;
    setQrDownloading(true);
    try {
      const response = await fetch(qrImageUrl);
      if (!response.ok) throw new Error("QR service unavailable");
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = `survey-${qrSurvey.id}-qr.png`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);
      toast.success("ดาวน์โหลดคิวอาร์โค้ดแล้ว");
    } catch {
      window.open(qrImageUrl, "_blank", "noopener,noreferrer");
      toast.info("เปิดคิวอาร์โค้ดในแท็บใหม่แล้ว สามารถบันทึกรูปภาพได้");
    } finally {
      setQrDownloading(false);
    }
  }

  function openSurveyQr(survey: AdminSurvey) {
    if (!survey.enabled) {
      toast.error("กรุณาเปิดใช้งานแบบประเมินก่อนสร้างคิวอาร์โค้ด");
      return;
    }
    const now = Date.now();
    if (survey.open_at && now < Date.parse(survey.open_at)) {
      toast.error("แบบประเมินยังไม่ถึงเวลาเปิดรับคำตอบ");
      return;
    }
    if (survey.close_at && now > Date.parse(survey.close_at)) {
      toast.error("แบบประเมินปิดรับคำตอบแล้ว");
      return;
    }
    setQrSurvey(survey);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <AdminPageHeader
        eyebrow="แบบประเมิน"
        title="จัดการแบบประเมิน"
        description="จัดการรายการแบบประเมิน และสร้าง แก้ไขและปรับปรุงแบบสอบถาม"
        actions={
          <>
            <Link
              to="/admin/ai"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 text-sm font-semibold text-violet-800 hover:bg-violet-100"
            >
              <Sparkles className="h-4 w-4" />
              เครื่องมือ AI
            </Link>
            <AdminButton
              variant="secondary"
              icon={<RefreshCw className="h-4 w-4" />}
              onClick={() => void load()}
            >
              รีเฟรช
            </AdminButton>
          </>
        }
      />

      <div className="mt-5">
        <div role="tablist" aria-label="ส่วนจัดการแบบประเมิน" className="mb-5 flex gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-100/80 p-1.5">
          <button type="button" role="tab" aria-selected={activeTab === "list"} onClick={() => setActiveTab("list")} className={"inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all " + (activeTab === "list" ? "bg-white text-[#1455a0] shadow-sm ring-1 ring-slate-200/70" : "text-slate-500 hover:bg-white/70 hover:text-[#1455a0]")}><FileText className="h-4 w-4" />รายการแบบประเมิน<span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] text-[#1455a0]">{surveys.length}</span></button>
          <button type="button" role="tab" aria-selected={activeTab === "builder"} onClick={() => setActiveTab("builder")} className={"inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all " + (activeTab === "builder" ? "bg-white text-[#1455a0] shadow-sm ring-1 ring-slate-200/70" : "text-slate-500 hover:bg-white/70 hover:text-[#1455a0]")}><ClipboardList className="h-4 w-4" />สร้าง แก้ไขและปรับปรุงแบบสอบถาม</button>
        </div>
        {activeTab === "list" && <>
          <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-[#1455a0]"><ClipboardList className="h-5 w-5" /></span><div><p className="text-xs font-semibold text-slate-500">แบบประเมินทั้งหมด</p><p className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900">{surveys.length}</p><p className="text-[11px] text-slate-400">{totalQuestions} คำถามในระบบ</p></div></div>
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700"><CheckCircle2 className="h-5 w-5" /></span><div><p className="text-xs font-semibold text-slate-500">เปิดใช้งาน</p><p className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900">{enabledCount}</p><p className="text-[11px] text-slate-400">อนุญาตให้รับคำตอบตามช่วงเวลา</p></div></div>
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 xl:col-span-1"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 text-amber-700"><FileText className="h-5 w-5" /></span><div><p className="text-xs font-semibold text-slate-500">ปิดใช้งาน</p><p className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900">{disabledCount}</p><p className="text-[11px] text-slate-400">ไม่อนุญาตให้ส่งคำตอบ</p></div></div>
          </div>
      <AdminFilterBar>
        <AdminSearchInput
          value={search}
          onChange={setSearch}
          placeholder="ค้นหาชื่อกิจกรรมหรือแบบประเมิน"
        />
        <div className="flex min-w-[260px] flex-1 items-end gap-2 xl:max-w-3xl">
          <label className="min-w-0 flex-1">
            <span className="mb-1 block text-xs font-semibold text-slate-600">กิจกรรม</span>
            <select
              value={activityFilter}
              onChange={(event) => {
                setActivityFilter(event.target.value);
                setSelected(null);
                resetDraft();
              }}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-[#002d62] focus:ring-4 focus:ring-[#002d62]/10"
            >
              <option value="">เลือกกิจกรรม</option>
              {Object.entries(activityTitles)
                .sort(([, a], [, b]) => a.localeCompare(b, "th"))
                .map(([id, title]) => (
                  <option key={id} value={id}>
                    {title || id}
                  </option>
                ))}
            </select>
          </label>
          <AdminButton
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => void createSurvey()}
            disabled={!activityFilter}
          >
            สร้างแบบประเมิน
          </AdminButton>
        </div>
      </AdminFilterBar>
        </>}

      {activeTab === "list" && <div className="mt-4">
        <AdminCard className="overflow-hidden rounded-2xl border-slate-200 shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[#002d62]">รายการแบบประเมิน</h2>
                <p className="mt-0.5 text-xs text-slate-500">เลือกแบบประเมินเพื่อจัดการคำถาม</p>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                {filteredSurveys.length} รายการ
              </span>
            </div>
          </div>
          {loading ? (
            <AdminLoadingState label="กำลังโหลดแบบประเมิน..." />
          ) : filteredSurveys.length === 0 ? (
            <AdminEmptyState
              title={surveys.length ? "ไม่พบแบบประเมินตามคำค้น" : "ยังไม่มีแบบประเมิน"}
              description={
                surveys.length
                  ? "ลองเปลี่ยนคำค้นหาหรือเลือกรอบกิจกรรมใหม่"
                  : "เลือกรอบกิจกรรมด้านบนแล้วสร้างแบบประเมินได้ทันที"
              }
            />
          ) : (
            <AdminTable minWidth="820px" className="mt-0 rounded-none border-0 shadow-none">
              <AdminTableHeader>
                <tr>
                  <th className="px-5 py-3 text-left">แบบประเมิน</th>
                  <th className="px-4 py-3 text-center">คำถาม</th>
                  <th className="px-4 py-3 text-center">สถานะ</th>
                  <th className="px-4 py-3 text-center">โหมด</th>
                  <th className="px-4 py-3 text-center">เครื่องมือ</th>
                </tr>
              </AdminTableHeader>
              <tbody>
                {filteredSurveys.map((survey) => {
                  const occurrence = occurrences.find((item) => item.id === survey.occurrence_id);
                  const active = selected?.id === survey.id;
                  return (
                    <AdminTableRow key={survey.id}>
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => selectSurvey(survey)}
                          className="w-full text-left"
                        >
                          <p
                            className={`font-semibold ${active ? "text-[#002d62]" : "text-slate-900"}`}
                          >
                            {survey.title ||
                              (occurrence
                                ? activityTitles[occurrence.activity_id] || occurrence.activity_id
                                : "แบบประเมิน")}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {occurrence
                              ? activityTitles[occurrence.activity_id] || occurrence.activity_id
                              : "ไม่พบกิจกรรม"}
                          </p>
                          <p className="mt-1 font-mono text-[10px] text-slate-400">
                            Survey ID: {survey.id}
                          </p>
                        </button>
                      </td>
                      <td className="px-4 py-4 text-center font-semibold text-slate-700">
                        {survey.questions.length}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <AdminStatusBadge tone={surveyAvailability(survey).tone}>
                          {surveyAvailability(survey).label}
                        </AdminStatusBadge>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <AdminStatusBadge tone={survey.anonymous ? "neutral" : "success"}>
                          {survey.anonymous ? "ไม่ระบุตัวตน" : "ระบุตัวตน"}
                        </AdminStatusBadge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <button type="button" onClick={() => setPreviewSurvey(survey)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-xs font-semibold text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-[#1455a0]">
                            <Eye className="h-3.5 w-3.5" /> ดูตัวอย่าง
                          </button>
                          <button type="button" onClick={() => openSurveyQr(survey)} disabled={!survey.enabled} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-xs font-semibold text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-[#1455a0] disabled:cursor-not-allowed disabled:opacity-40">
                            <QrCode className="h-3.5 w-3.5" /> คิวอาร์โค้ด
                          </button>
                        </div>
                      </td>
                    </AdminTableRow>
                  );
                })}
              </tbody>
            </AdminTable>
          )}
        </AdminCard>
      </div>}

      {activeTab === "builder" && <div className="mt-4 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={() => setActiveTab("list")} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#1455a0]"><ArrowLeft className="h-4 w-4" />กลับไปยังรายการแบบประเมิน</button>
          {selected && <span className="text-xs font-medium text-slate-400">รหัสแบบประเมิน: {selected.id}</span>}
        </div>
        <AdminCard className="overflow-hidden rounded-2xl border-slate-200 shadow-sm">
          {selected ? (
            <>
              <div className="border-b border-slate-100 bg-white px-5 py-6 sm:px-6">
                <div className="flex flex-col gap-5">
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#1455a0]">
                      สร้าง แก้ไขและปรับปรุงแบบสอบถาม
                    </p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      {selectedOccurrence
                        ? activityTitles[selectedOccurrence.activity_id] ||
                          selectedOccurrence.activity_id
                        : "ไม่พบกิจกรรม"}
                    </p>
                    <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end">
                      <label className="min-w-0 flex-1">
                        <span className="mb-1 block text-xs font-semibold text-slate-600">
                          ชื่อแบบประเมิน
                        </span>
                        <input
                          value={surveyTitleDraft}
                          onChange={(event) => setSurveyTitleDraft(event.target.value)}
                          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-base font-bold text-[#002d62] outline-none transition focus:border-[#002d62] focus:ring-4 focus:ring-[#002d62]/10"
                          placeholder="ระบุชื่อแบบประเมิน"
                        />
                      </label>
                      <AdminButton
                        variant="secondary"
                        icon={<Save className="h-4 w-4" />}
                        onClick={() => void saveSurveyTitle()}
                        disabled={surveyTitleSaving || !surveyTitleDraft.trim()}
                      >
                        {surveyTitleSaving ? "กำลังบันทึก..." : "บันทึกชื่อ"}
                      </AdminButton>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      ชื่อนี้จะถูกส่งไปยังระบบแบบประเมิน (RAC) โดยไม่เปลี่ยนชื่อกิจกรรม
                    </p>
                    {selectedOccurrence && (
                      <p className="mt-1 font-mono text-[10px] text-slate-400">
                        รหัสกิจกรรม: {selectedOccurrence.activity_id} · รหัสแบบประเมิน: {selected?.id}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
                    <AdminButton variant="secondary" icon={<Eye className="h-4 w-4" />} onClick={() => setPreviewSurvey(selected)}>ดูตัวอย่าง</AdminButton>
                    <AdminButton variant="secondary" onClick={() => window.open(`/survey?surveyId=${encodeURIComponent(selected.id)}&mode=test`, "_blank", "noopener,noreferrer")}>ทดสอบและบันทึก</AdminButton>
                    <AdminButton variant="secondary" onClick={() => setTestResponsesSurvey(selected)}>ผลทดสอบ</AdminButton>
                    <AdminButton variant="secondary" icon={<QrCode className="h-4 w-4" />} onClick={() => openSurveyQr(selected)} disabled={!selected.enabled}>คิวอาร์โค้ด</AdminButton>
                    <AdminStatusBadge tone={surveyAvailability(selected).tone}>
                      {surveyAvailability(selected).label}
                    </AdminStatusBadge>
                    <AdminButton
                      variant={selected.enabled ? "secondary" : "primary"}
                      onClick={() =>
                        void updateAdminSurvey(selected.id, { enabled: !selected.enabled })
                          .then((updated) => {
                            setSelected({ ...selected, ...updated });
                            setSurveys((items) =>
                              items.map((item) =>
                                item.id === selected.id ? { ...item, ...updated } : item,
                              ),
                            );
                            toast.success(
                              updated.enabled ? "เปิดใช้งานแบบประเมินแล้ว" : "ปิดใช้งานแบบประเมินแล้ว",
                            );
                          })
                          .catch((e) =>
                            toast.error(e instanceof Error ? e.message : "บันทึกสถานะไม่สำเร็จ"),
                          )
                      }
                    >
                      {selected.enabled ? "ปิดใช้งาน" : "เปิดใช้งาน"}
                    </AdminButton>
                    <AdminButton
                      variant="secondary"
                      onClick={() =>
                        void updateAdminSurvey(selected.id, { anonymous: !selected.anonymous })
                          .then((updated) => {
                            setSelected({ ...selected, ...updated });
                            setSurveys((items) =>
                              items.map((item) =>
                                item.id === selected.id ? { ...item, ...updated } : item,
                              ),
                            );
                          })
                          .catch((e) =>
                            toast.error(e instanceof Error ? e.message : "บันทึกไม่สำเร็จ"),
                          )
                      }
                    >
                      {selected.anonymous ? "เปลี่ยนเป็นระบุตัวตน" : "เปลี่ยนเป็นไม่ระบุตัวตน"}
                    </AdminButton>
                  </div>
                </div>
                <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3">
                  <p className="text-xs font-semibold text-blue-900">การเปิดรับคำตอบ</p>
                  <p className="mt-1 text-xs leading-5 text-blue-800/80">
                    แยกจากสถานะกิจกรรมโดยอิสระ หากไม่กำหนดวันและเวลา ระบบจะเปิดรับคำตอบต่อเนื่องจนกว่าจะปิดใช้งาน
                  </p>
                </div>
              </div>
              <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-5 sm:px-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-slate-600">เปิดรับ</span>
                    <input
                      type="datetime-local"
                      value={toLocalDateTimeInput(selected.open_at)}
                      onChange={(event) => {
                        const value = event.target.value;
                        const openAt = fromLocalDateTimeInput(value);
                        if (openAt && selected.close_at && Date.parse(openAt) > Date.parse(selected.close_at)) {
                          toast.error("เวลาเริ่มเปิดรับต้องไม่อยู่หลังเวลาปิดรับ");
                          return;
                        }
                        void updateAdminSurvey(selected.id, {
                          open_at: openAt,
                        })
                          .then((updated) => {
                            setSelected({ ...selected, ...updated });
                            setSurveys((items) =>
                              items.map((item) =>
                                item.id === selected.id ? { ...item, ...updated } : item,
                              ),
                            );
                          })
                          .catch((e) =>
                            toast.error(e instanceof Error ? e.message : "บันทึกเวลาเปิดไม่สำเร็จ"),
                          );
                      }}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-slate-600">ปิดรับ</span>
                    <input
                      type="datetime-local"
                      value={toLocalDateTimeInput(selected.close_at)}
                      onChange={(event) => {
                        const value = event.target.value;
                        const closeAt = fromLocalDateTimeInput(value);
                        if (closeAt && selected.open_at && Date.parse(closeAt) < Date.parse(selected.open_at)) {
                          toast.error("เวลาปิดรับต้องไม่อยู่ก่อนเวลาเริ่มเปิดรับ");
                          return;
                        }
                        void updateAdminSurvey(selected.id, {
                          close_at: closeAt,
                        })
                          .then((updated) => {
                            setSelected({ ...selected, ...updated });
                            setSurveys((items) =>
                              items.map((item) =>
                                item.id === selected.id ? { ...item, ...updated } : item,
                              ),
                            );
                          })
                          .catch((e) =>
                            toast.error(e instanceof Error ? e.message : "บันทึกเวลาปิดไม่สำเร็จ"),
                          );
                      }}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                    />
                  </label>
                </div>
              </div>

              <div className="grid items-start gap-5 p-5 sm:p-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)]">
                <div className="order-2 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 xl:order-2">
                  <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_160px_auto]">
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold text-slate-600">คำถาม</span>
                      <input
                        value={String(draft.question_text ?? "")}
                        onChange={(event) =>
                          setDraft((current) => ({ ...current, question_text: event.target.value }))
                        }
                        placeholder="ระบุคำถาม"
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-[#002d62] focus:ring-4 focus:ring-[#002d62]/10"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold text-slate-600">
                        ประเภท
                      </span>
                      <select
                        value={String(draft.question_type ?? "rating")}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            question_type: event.target.value as SurveyQuestion["question_type"],
                          }))
                        }
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-[#002d62] focus:ring-4 focus:ring-[#002d62]/10"
                      >
                        <option value="rating">Rating 1–5</option>
                        <option value="text">Text</option>
                        <option value="single_choice">Single choice</option>
                        <option value="multi_choice">Multi choice</option>
                      </select>
                    </label>
                    <AdminButton
                      variant="primary"
                      icon={<Save className="h-4 w-4" />}
                      className="self-end"
                      onClick={() => void saveQuestion()}
                    >
                      บันทึกคำถาม
                    </AdminButton>
                  </div>
                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold text-slate-600">
                        Section key
                      </span>
                      <input
                        value={String(draft.section_key ?? "general")}
                        onChange={(event) =>
                          setDraft((current) => ({ ...current, section_key: event.target.value }))
                        }
                        placeholder="general / opening / learning"
                        className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-[#002d62] focus:ring-4 focus:ring-[#002d62]/10"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold text-slate-600">
                        Rating scale
                      </span>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min={1}
                          value={Number(draft.scale_min ?? 1)}
                          onChange={(event) =>
                            setDraft((current) => ({
                              ...current,
                              scale_min: Number(event.target.value),
                            }))
                          }
                          className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                          aria-label="Rating scale minimum"
                        />
                        <input
                          type="number"
                          min={2}
                          value={Number(draft.scale_max ?? 5)}
                          onChange={(event) =>
                            setDraft((current) => ({
                              ...current,
                              scale_max: Number(event.target.value),
                            }))
                          }
                          className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                          aria-label="Rating scale maximum"
                        />
                      </div>
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold text-slate-600">
                        Choice options
                      </span>
                      <input
                        value={Array.isArray(draft.options) ? draft.options.join(", ") : ""}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            options: event.target.value
                              .split(",")
                              .map((item) => item.trim())
                              .filter(Boolean),
                          }))
                        }
                        placeholder="ตัวเลือก A, ตัวเลือก B"
                        className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                        disabled={
                          !["single_choice", "multi_choice"].includes(String(draft.question_type))
                        }
                      />
                    </label>
                  </div>

                  <label className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-slate-600">
                    <input
                      type="checkbox"
                      checked={draft.required !== false}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, required: event.target.checked }))
                      }
                    />
                    คำถามบังคับ
                  </label>
                </div>

                <div className="order-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:order-1">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">รายการคำถาม</h3>
                    <p className="mt-0.5 text-xs text-slate-500">คลิกคำถามเพื่อแก้ไข</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">
                    {selected.questions.length} ข้อ
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  {selected.questions.length === 0 ? (
                    <AdminEmptyState
                      title="ยังไม่มีคำถาม"
                      description="เพิ่มคำถามแรกของแบบประเมินนี้จากช่องด้านบน"
                    />
                  ) : (
                    selected.questions.map((question, index) => (
                      <div
                        key={question.id}
                        className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                      >
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() => setDraft(question)}
                            className="flex min-w-0 flex-1 gap-3 text-left"
                          >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                              {index + 1}
                            </span>
                            <span className="min-w-0">
                              <span className="block font-semibold text-slate-900">
                                {question.question_text}
                              </span>
                              <span className="mt-1 block text-xs text-slate-500">
                                {question.question_type} ·{" "}
                                {question.required ? "จำเป็น" : "ไม่จำเป็น"}
                                {question.question_type === "rating"
                                  ? ` · ${question.scale_min}–${question.scale_max}`
                                  : ""}
                              </span>
                              <span className="mt-1 block font-mono text-[10px] text-slate-400">
                                Question ID: {question.id}
                              </span>
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => void deactivate(question)}
                            aria-label="ปิดใช้งานคำถาม"
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                </div>
              </div>
            </>
          ) : (
            <div className="grid min-h-[520px] place-items-center p-8">
              <AdminEmptyState
                title="เลือกแบบประเมิน"
                description="เลือกแบบประเมินจากรายการด้านซ้ายเพื่อเริ่มจัดการคำถาม"
              />
            </div>
          )}
        </AdminCard>
      </div>}
    </div>
      {previewSurvey && (
        <SurveyPreviewModal survey={previewSurvey} onClose={() => setPreviewSurvey(null)} />
      )}
      {qrSurvey && (
        <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-labelledby="survey-qr-title">
          <div className="my-8 w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#1455a0]">แบบประเมินสาธารณะ</p>
                <h2 id="survey-qr-title" className="mt-1 text-xl font-bold text-[#002d62]">คิวอาร์โค้ดแบบประเมิน</h2>
                <p className="mt-1 text-sm text-slate-600">{qrSurvey.title || "แบบประเมินกิจกรรม"}</p>
              </div>
              <button type="button" onClick={() => setQrSurvey(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="ปิดคิวอาร์โค้ด"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-5 grid place-items-center rounded-2xl border border-slate-200 bg-white p-5">
              <img src={qrImageUrl} alt="คิวอาร์โค้ดสำหรับเปิดแบบประเมิน" className="h-64 w-64 max-w-full object-contain" />
              <p className="mt-3 text-center text-sm font-semibold text-slate-800">สแกนเพื่อเปิดแบบประเมิน</p>
              <p className="mt-1 text-center text-xs text-slate-500">ผู้ตอบสามารถส่งคำตอบได้โดยไม่ต้องเข้าสู่ระบบ</p>
            </div>
            <label className="mt-4 block">
              <span className="mb-1 block text-xs font-semibold text-slate-600">ลิงก์สาธารณะ</span>
              <input readOnly value={publicSurveyUrl(qrSurvey.id)} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-700" onFocus={(event) => event.currentTarget.select()} />
            </label>
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <AdminButton variant="secondary" icon={<Copy className="h-4 w-4" />} onClick={() => void copySurveyLink(qrSurvey)}>คัดลอกลิงก์</AdminButton>
              <AdminButton variant="secondary" icon={<ExternalLink className="h-4 w-4" />} onClick={() => window.open(publicSurveyUrl(qrSurvey.id), "_blank", "noopener,noreferrer")}>เปิดหน้าแบบประเมิน</AdminButton>
              <AdminButton variant="primary" icon={<Download className="h-4 w-4" />} onClick={() => void downloadSurveyQr()} disabled={qrDownloading}>{qrDownloading ? "กำลังดาวน์โหลด..." : "ดาวน์โหลดไฟล์ PNG"}</AdminButton>
            </div>
            <p className="mt-3 text-[11px] leading-5 text-slate-400">คิวอาร์โค้ดสร้างจากลิงก์สาธารณะของแบบประเมินที่เปิดใช้งาน</p>
          </div>
        </div>
      )}
    </section>
  );
}

function SurveyPreviewModal({ survey, onClose }: { survey: AdminSurvey; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-labelledby="survey-preview-title">
      <div className="my-8 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-slate-50 shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#1455a0]">โหมดดูตัวอย่าง</p>
            <h2 id="survey-preview-title" className="mt-1 text-lg font-bold text-[#002d62]">{survey.title || "แบบประเมินกิจกรรม"}</h2>
            <p className="mt-1 text-xs text-slate-500">ตัวอย่างมุมมองผู้ตอบ · ไม่ส่งหรือบันทึกคำตอบ</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="ปิดหน้าตัวอย่าง"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-3 p-4 sm:p-6">
          <header className="rounded-2xl bg-[#002d62] p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">มหาวิทยาลัยมหิดล วิทยาเขตลำปาง · แบบประเมิน</p>
            <h3 className="mt-2 text-2xl font-bold">{survey.title || "แบบประเมินกิจกรรม"}</h3>
            <p className="mt-2 text-sm text-white/80">{survey.welcome_text || "ขอความร่วมมือประเมินกิจกรรม"}</p>
          </header>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-500">
            รูปแบบการเก็บข้อมูล: {survey.anonymous ? "ไม่ระบุตัวตน" : "ระบุตัวตน"} · {survey.questions.length} คำถาม
          </div>
          {survey.questions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">ยังไม่มีคำถามในแบบประเมินนี้</div>
          ) : survey.questions.map((question, index) => (
            <section key={question.id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold text-slate-800">{index + 1}. {question.question_text}{question.required && <span className="ml-1 text-red-600">*</span>}</p>
              {question.question_type === "rating" && <div className="mt-4 flex flex-wrap gap-2">{Array.from({length: Math.max(0, question.scale_max - question.scale_min + 1)}, (_, i) => question.scale_min + i).map((score) => <span key={score} className="grid h-10 min-w-10 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-sm">{score}</span>)}</div>}
              {question.question_type === "text" && <textarea disabled rows={3} placeholder="พิมพ์คำตอบของคุณ..." className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm" />}
              {(question.question_type === "single_choice" || question.question_type === "multi_choice") && <div className="mt-3 space-y-2">{(Array.isArray(question.options) ? question.options : []).map((option, i) => <label key={i} className="flex items-center gap-2 text-sm text-slate-700"><input type={question.question_type === "multi_choice" ? "checkbox" : "radio"} disabled />{String(option)}</label>)}</div>}
            </section>
          ))}
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs text-blue-800">นี่เป็นเพียงหน้าตัวอย่าง ปุ่มส่งคำตอบถูกปิดไว้และไม่มีการบันทึกข้อมูล</div>
        </div>
      </div>
    </div>
  );
}


function SurveyTestResponsesModal({ survey, onClose }: { survey: AdminSurvey; onClose: () => void }) {
  const [rows, setRows] = useState<SurveyTestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    getSurveyTestResponses(survey.id)
      .then((data) => { if (active) setRows(data); })
      .catch((e) => { if (active) setError(e instanceof Error ? e.message : "โหลดผลทดสอบไม่สำเร็จ"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [survey.id]);

  async function remove(row: SurveyTestResponse) {
    if (!window.confirm("ยืนยันลบคำตอบทดสอบรายการนี้?")) return;
    setDeletingId(row.id);
    try {
      await deleteSurveyTestResponse(survey.id, row.id);
      setRows((items) => items.filter((item) => item.id !== row.id));
      toast.success("ลบคำตอบทดสอบแล้ว");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "ลบคำตอบทดสอบไม่สำเร็จ");
    } finally {
      setDeletingId("");
    }
  }

  return (
    <div className="fixed inset-0 z-[110] grid place-items-center overflow-y-auto bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-labelledby="survey-test-responses-title">
      <div className="my-8 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-700">ข้อมูลแยกจากผลจริง</p>
            <h2 id="survey-test-responses-title" className="mt-1 text-xl font-bold text-[#002d62]">ผลการทดสอบแบบประเมิน</h2>
            <p className="mt-1 text-sm text-slate-600">{survey.title || "แบบประเมินกิจกรรม"}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="ปิด"><X className="h-5 w-5" /></button>
        </div>
        {loading ? <p className="py-10 text-center text-sm text-slate-500">กำลังโหลด...</p> : error ? <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p> : rows.length === 0 ? <p className="mt-5 rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">ยังไม่มีคำตอบทดสอบ</p> : (
          <div className="mt-5 space-y-3">
            {rows.map((row, index) => (
              <article key={row.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">รายการทดสอบ #{rows.length - index}</p>
                    <p className="mt-1 text-xs text-slate-500">{new Date(row.created_at).toLocaleString("th-TH")} · {row.answers.length} คำตอบ</p>
                  </div>
                  <button type="button" disabled={deletingId === row.id} onClick={() => void remove(row)} className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"><Trash2 className="h-3.5 w-3.5" />{deletingId === row.id ? "กำลังลบ..." : "ลบข้อมูลทดสอบ"}</button>
                </div>
                <div className="mt-3 space-y-2">
                  {row.answers.map((answer, answerIndex) => {
                    const question = survey.questions.find((item) => item.id === answer.questionId);
                    const value = typeof answer.number === "number" ? String(answer.number) : Array.isArray(answer.options) ? answer.options.join(", ") : String(answer.text ?? "");
                    return <div key={answer.questionId} className="rounded-lg bg-slate-50 px-3 py-2 text-xs"><p className="font-semibold text-slate-700">{answerIndex + 1}. {question?.question_text ?? "คำถามที่ถูกปิดใช้งาน"}</p><p className="mt-1 whitespace-pre-wrap text-slate-600">{value || "—"}</p></div>;
                  })}
                </div>
              </article>
            ))}
          </div>
        )}
        <div className="mt-5 flex justify-end"><AdminButton variant="secondary" onClick={onClose}>ปิดหน้าต่าง</AdminButton></div>
      </div>
    </div>
  );
}
