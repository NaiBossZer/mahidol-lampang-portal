import { useEffect, useMemo, useState } from "react";
import {
  Zap,
  Download,
  Calendar,
  Building2,
  Leaf,
  SunMedium,
  CheckCircle2,
  FileText,
  RefreshCw,
  TrendingDown,
  Info,
  Sparkles,
  Upload,
  Play,
  Pencil,
  Trash2,
  Plus,
  Database,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { ElectricitySourceUploadCard } from "@/components/admin/electricity/ElectricitySourceUploadCard";
import { cn } from "@/lib/utils";
import {
  buildElectricityReportModel,
  canGenerateElectricityReport,
  downloadBlob,
  electricityReportFilename,
  generateElectricityPdf,
  generateElectricityPptx,
} from "@/lib/electricityReportGenerator";

type ReportStatus = "draft" | "processing" | "needs_review" | "approved" | "published" | "failed";
const REPORT_EDITABLE_STATUSES = new Set<ReportStatus>(["draft", "processing", "needs_review", "failed"]);
type SourceStatus = "uploaded" | "queued" | "processing" | "processed" | "needs_review" | "failed";
type SourceType = "pea_bill" | "solar_excel" | "report_pdf" | "report_pptx" | "other";

interface MonthlyReport {
  id: string;
  report_month: string;
  sobprab_kwh: number;
  sobprab_amount_thb: number;
  phalaad_kwh: number;
  phalaad_amount_thb: number;
  solar_yield_kwh: number;
  total_pea_kwh: number;
  total_amount_thb: number;
  solar_ratio_pct: number;
  co2_avoided_ton: number | null;
  coal_saved_ton: number | null;
  status: ReportStatus;
  processed_at: string | null;
  calculation_version: string | null;
}

interface SourceDocument {
  id: string;
  site_id: string | null;
  source_type: SourceType;
  billing_period: string | null;
  filename: string;
  storage_bucket: string;
  mime_type: string;
  file_size: number | null;
  sha256: string | null;
  status: SourceStatus;
  parser_version: string | null;
  validation_errors: string[] | null;
  error_message: string | null;
  uploaded_at: string;
  processed_at: string | null;
  site?: { code?: string; name?: string } | null;
}

interface ProcessingRun {
  id: string;
  status: string;
  agent_name: string;
  agent_version: string | null;
  trigger_source: string;
  started_at: string;
  finished_at: string | null;
  output_report_id: string | null;
  metrics: Record<string, unknown>;
  error_message: string | null;
}

interface DashboardPayload {
  reports: MonthlyReport[];
  sources: SourceDocument[];
  runs: ProcessingRun[];
}

interface ReportDraft {
  report_month: string;
  sobprab_kwh: string;
  sobprab_amount_thb: string;
  phalaad_kwh: string;
  phalaad_amount_thb: string;
  solar_yield_kwh: string;
  co2_avoided_ton: string;
  coal_saved_ton: string;
  status: ReportStatus;
}

const SOURCE_TYPE_LABEL: Record<SourceType, string> = {
  pea_bill: "PEA Bill / PDF",
  solar_excel: "Solar Excel",
  report_pdf: "Report PDF",
  report_pptx: "Report PPTX",
  other: "เอกสารอื่น",
};

const STATUS_META: Record<string, { label: string; className: string }> = {
  uploaded: { label: "รอประมวลผล", className: "bg-slate-100 text-slate-700" },
  queued: { label: "เข้าคิว", className: "bg-blue-100 text-blue-700" },
  processing: { label: "กำลังประมวลผล", className: "bg-amber-100 text-amber-800" },
  processed: { label: "ประมวลผลแล้ว", className: "bg-emerald-100 text-emerald-800" },
  needs_review: { label: "รอตรวจสอบ", className: "bg-orange-100 text-orange-800" },
  failed: { label: "ผิดพลาด", className: "bg-rose-100 text-rose-700" },
  draft: { label: "Draft", className: "bg-slate-100 text-slate-700" },
  approved: { label: "อนุมัติแล้ว", className: "bg-emerald-100 text-emerald-800" },
  published: { label: "เผยแพร่แล้ว", className: "bg-violet-100 text-violet-800" },
};

const THAI_MONTHS = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

function monthLabel(value: string | null | undefined) {
  if (!value) return "—";
  const [year, month] = value.slice(0, 7).split("-").map(Number);
  if (!year || !month) return value;
  return THAI_MONTHS[month - 1] + " " + (year + 543);
}

function monthInput(value: string | null | undefined) {
  return value ? value.slice(0, 7) : "";
}

function formatNumber(value: number | null | undefined, digits = 1) {
  if (value == null || !Number.isFinite(value)) return "—";
  return value.toLocaleString("th-TH", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function formatMoney(value: number | null | undefined) {
  if (value == null || !Number.isFinite(value)) return "—";
  return value.toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function emptyDraft(): ReportDraft {
  const now = new Date();
  const month = now.getUTCFullYear() + "-" + String(now.getUTCMonth() + 1).padStart(2, "0");
  return {
    report_month: month,
    sobprab_kwh: "0",
    sobprab_amount_thb: "0",
    phalaad_kwh: "0",
    phalaad_amount_thb: "0",
    solar_yield_kwh: "0",
    co2_avoided_ton: "",
    coal_saved_ton: "",
    status: "draft",
  };
}

function draftFromReport(report: MonthlyReport): ReportDraft {
  return {
    report_month: monthInput(report.report_month),
    sobprab_kwh: String(report.sobprab_kwh ?? 0),
    sobprab_amount_thb: String(report.sobprab_amount_thb ?? 0),
    phalaad_kwh: String(report.phalaad_kwh ?? 0),
    phalaad_amount_thb: String(report.phalaad_amount_thb ?? 0),
    solar_yield_kwh: String(report.solar_yield_kwh ?? 0),
    co2_avoided_ton: report.co2_avoided_ton == null ? "" : String(report.co2_avoided_ton),
    coal_saved_ton: report.coal_saved_ton == null ? "" : String(report.coal_saved_ton),
    status: report.status,
  };
}

async function apiRequest<T = unknown>(url: string, init: RequestInit = {}) {
  const response = await fetch(url, {
    credentials: "include",
    ...init,
  });
  const body = (await response.json().catch(() => null)) as
    | { success?: boolean; data?: T; error?: string }
    | null;
  if (!response.ok || !body?.success) {
    throw new Error(body?.error || "เกิดข้อผิดพลาดจากระบบ");
  }
  return body.data as T;
}

export function ElectricityReportsPage() {
  const [reports, setReports] = useState<MonthlyReport[]>([]);
  const [sources, setSources] = useState<SourceDocument[]>([]);
  const [runs, setRuns] = useState<ProcessingRun[]>([]);
  const [selectedReportId, setSelectedReportId] = useState("");
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [draft, setDraft] = useState<ReportDraft>(emptyDraft());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [exporting, setExporting] = useState<"pptx" | "pdf" | null>(null);

  const loadDashboard = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const data = await apiRequest<DashboardPayload>("/api/admin/electricity?resource=dashboard");
      setReports(data.reports ?? []);
      setSources(data.sources ?? []);
      setRuns(data.runs ?? []);
      setSelectedReportId((current) => {
        if (current && data.reports.some((item) => item.id === current)) return current;
        return data.reports[0]?.id ?? "";
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "โหลดข้อมูลระบบรายงานค่าไฟฟ้าไม่สำเร็จ");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  const activeReport = useMemo(
    () => reports.find((item) => item.id === selectedReportId) ?? reports[0] ?? null,
    [reports, selectedReportId],
  );

  const selectedMonthSources = useMemo(() => {
    if (!activeReport) return sources;
    return sources.filter(
      (item) =>
        !item.billing_period ||
        item.billing_period.slice(0, 7) === activeReport.report_month.slice(0, 7),
    );
  }, [activeReport, sources]);

  const latestRun = runs[0];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboard(true);
    toast.success("โหลดข้อมูลจาก Supabase ล่าสุดแล้ว");
  };

  const handleDownloadSource = async (sourceId: string) => {
    try {
      window.location.href = "/api/admin/electricity?action=file&id=" + encodeURIComponent(sourceId);
    } catch {
      toast.error("ไม่สามารถเปิดเอกสารต้นฉบับได้");
    }
  };

  const toggleSource = (id: string) => {
    setSelectedSourceIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  };

  const handleProcess = async (ids = selectedSourceIds) => {
    if (!ids.length) {
      toast.error("เลือกเอกสารต้นทางอย่างน้อย 1 รายการ");
      return;
    }
    setIsProcessing(true);
    try {
      await apiRequest("/api/admin/electricity?action=process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceDocumentIds: ids }),
      });
      setSelectedSourceIds([]);
      toast.success("AI Agent ประมวลผลแล้ว และสร้าง Monthly Report ในสถานะรอตรวจสอบ");
      await loadDashboard(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "AI Agent ประมวลผลไม่สำเร็จ");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = async (extension: "pptx" | "pdf") => {
    if (!activeReport) {
      toast.error("ยังไม่มี Monthly Report สำหรับสร้างไฟล์รายงาน");
      return;
    }
    if (!canGenerateElectricityReport(activeReport)) {
      toast.error("ต้องตรวจสอบและอนุมัติ Monthly Report ก่อนจึงจะส่งออกได้");
      return;
    }

    setExporting(extension);
    try {
      const model = buildElectricityReportModel(reports, activeReport);
      const blob =
        extension === "pptx"
          ? await generateElectricityPptx(model)
          : await generateElectricityPdf(model);
      downloadBlob(blob, electricityReportFilename(model, extension));
      toast.success(extension === "pptx" ? "สร้างไฟล์ PPTX ที่แก้ไขได้แล้ว" : "สร้างไฟล์ PDF ตามรูปแบบรายงานแล้ว");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "สร้างไฟล์รายงานไม่สำเร็จ");
    } finally {
      setExporting(null);
    }
  };

  const startNewReport = () => {
    setEditingId(null);
    setDraft(emptyDraft());
    setShowEditor(true);
  };

  const startEditReport = (report: MonthlyReport) => {
    setEditingId(report.id);
    setDraft(draftFromReport(report));
    setShowEditor(true);
  };

  const transitionReport = async (report: MonthlyReport, action: "approve" | "publish") => {
    const message =
      action === "approve"
        ? "ยืนยันการตรวจสอบและอนุมัติ Monthly Report นี้หรือไม่?"
        : "ยืนยันการเผยแพร่ Monthly Report ที่อนุมัติแล้วหรือไม่?";
    if (!window.confirm(message)) return;

    try {
      await apiRequest(
        "/api/admin/electricity?action=" + action + "&id=" + encodeURIComponent(report.id),
        { method: "PATCH" },
      );
      toast.success(action === "approve" ? "อนุมัติ Monthly Report แล้ว" : "เผยแพร่ Monthly Report แล้ว");
      await loadDashboard(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "เปลี่ยนสถานะรายงานไม่สำเร็จ");
    }
  };

  const saveReport = async () => {
    try {
      const payload = {
        report_month: draft.report_month + "-01",
        sobprab_kwh: draft.sobprab_kwh,
        sobprab_amount_thb: draft.sobprab_amount_thb,
        phalaad_kwh: draft.phalaad_kwh,
        phalaad_amount_thb: draft.phalaad_amount_thb,
        solar_yield_kwh: draft.solar_yield_kwh,
        co2_avoided_ton: draft.co2_avoided_ton || null,
        coal_saved_ton: draft.coal_saved_ton || null,
        status: REPORT_EDITABLE_STATUSES.has(draft.status) ? draft.status : "needs_review",
      };

      if (editingId) {
        await apiRequest("/api/admin/electricity?action=report&id=" + encodeURIComponent(editingId), {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        toast.success("แก้ไขรายงานเรียบร้อย");
      } else {
        await apiRequest("/api/admin/electricity?action=report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        toast.success("สร้างรายงานรายเดือนเรียบร้อย");
      }

      setShowEditor(false);
      setEditingId(null);
      await loadDashboard(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "บันทึกรายงานไม่สำเร็จ");
    }
  };

  const deleteReport = async (report: MonthlyReport) => {
    const confirmed = window.confirm(
      "ลบรายงาน " + monthLabel(report.report_month) + " หรือไม่? เอกสารต้นทางจะไม่ถูกลบ",
    );
    if (!confirmed) return;

    try {
      await apiRequest("/api/admin/electricity?action=report&id=" + encodeURIComponent(report.id), {
        method: "DELETE",
      });
      toast.success("ลบรายงานเรียบร้อย");
      await loadDashboard(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ลบรายงานไม่สำเร็จ");
    }
  };

  const setDraftField = (field: keyof ReportDraft, value: string) =>
    setDraft((current) => ({ ...current, [field]: value }));

  if (loading) {
    return (
      <section className="min-h-[calc(100vh-4rem)] bg-slate-50/60 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 text-sm font-semibold text-slate-500 shadow-xs">
          กำลังโหลดข้อมูลรายงานค่าไฟฟ้าจาก Supabase…
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-slate-50/60 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                <Zap className="h-3.5 w-3.5 fill-amber-500 text-amber-600" />
                Engineering & Energy Agent Hub
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                <Database className="h-3 w-3" />
                Supabase Source of Truth
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#0c2340]">
              ระบบรายงานสรุปการใช้ไฟฟ้าและพลังงานหมุนเวียน (EE Report)
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              ข้อมูลจริงจากเอกสารต้นทาง → AI extraction → validation → Monthly Report → Dashboard
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void handleRefresh()}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50"
            >
              <RefreshCw className={cn("h-3.5 w-3.5 text-slate-500", isRefreshing && "animate-spin")} />
              รีเฟรช
            </button>
            <button
              type="button"
              onClick={startNewReport}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#002d62] bg-white px-3.5 py-2 text-xs font-bold text-[#002d62] shadow-xs hover:bg-blue-50"
            >
              <Plus className="h-3.5 w-3.5" />
              สร้างรายงานด้วยมือ
            </button>
            <button
              type="button"
              onClick={() => void handleExport("pptx")}
              disabled={!canGenerateElectricityReport(activeReport) || exporting !== null}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#002d62] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#163a66] disabled:cursor-not-allowed disabled:opacity-45"
              title="ส่งออก PowerPoint แบบแก้ไขได้"
            >
              <FileText className="h-3.5 w-3.5" />
              {exporting === "pptx" ? "กำลังสร้าง PPTX…" : "PPTX"}
            </button>
            <button
              type="button"
              onClick={() => void handleExport("pdf")}
              disabled={!canGenerateElectricityReport(activeReport) || exporting !== null}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#002d62] bg-white px-3.5 py-2 text-xs font-bold text-[#002d62] shadow-xs hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-45"
              title="ส่งออก PDF ตามรูปแบบเดียวกับ PPTX"
            >
              <Download className="h-3.5 w-3.5" />
              {exporting === "pdf" ? "กำลังสร้าง PDF…" : "PDF"}
            </button>
          </div>
        </div>

        <ElectricitySourceUploadCard onUploaded={() => loadDashboard(true)} />

        {!reports.length && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="font-bold">ยังไม่มี Monthly Report ในฐานข้อมูล</p>
                <p className="mt-1 text-xs">
                  อัปโหลด PDF ค่าไฟสบปราบ/ผาลาด หรือ Excel Solar ที่ส่วนอัปโหลดด้านบน แล้วเลือกเอกสารต้นทางเพื่อสั่ง AI Agent ประมวลผล
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#002d62]" />
            <span className="text-xs font-bold text-slate-700">เลือกรอบเดือน:</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {reports.map((report) => (
              <button
                key={report.id}
                type="button"
                onClick={() => setSelectedReportId(report.id)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
                  selectedReportId === report.id
                    ? "bg-[#0c2340] text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100",
                )}
              >
                {monthLabel(report.report_month)}
              </button>
            ))}
          </div>
        </div>

        {activeReport && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold uppercase tracking-wide">ค่าไฟฟ้ารวม (กฟภ.)</span>
                  <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
                    <Zap className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-black text-[#0c2340]">
                    ฿{formatMoney(activeReport.total_amount_thb)}
                  </span>
                </div>
                <p className="mt-2 flex items-center text-xs text-slate-500">
                  <TrendingDown className="mr-1 h-3.5 w-3.5 text-emerald-600" />
                  หน่วยไฟรวม {formatNumber(activeReport.total_pea_kwh)} kWh
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold uppercase tracking-wide">กฟภ. สถานีสบปราบ</span>
                  <div className="rounded-lg bg-amber-50 p-2 text-amber-700">
                    <Building2 className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-black text-[#0c2340]">
                    {formatNumber(activeReport.sobprab_kwh)}
                  </span>
                  <span className="ml-1 text-xs text-slate-500">kWh</span>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  ยอดเงิน: ฿{formatMoney(activeReport.sobprab_amount_thb)} บาท
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold uppercase tracking-wide">การผลิต Solar Cell</span>
                  <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                    <SunMedium className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-black text-amber-700">
                    {formatNumber(activeReport.solar_yield_kwh)}
                  </span>
                  <span className="ml-1 text-xs text-slate-500">kWh Yield</span>
                </div>
                <p className="mt-2 text-xs font-semibold text-emerald-600">
                  {formatNumber(activeReport.solar_ratio_pct, 2)}% ของการใช้รวมที่รายงาน
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold uppercase tracking-wide">ลดคาร์บอน</span>
                  <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
                    <Leaf className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-black text-emerald-700">
                    {formatNumber(activeReport.co2_avoided_ton, 3)}
                  </span>
                  <span className="ml-1 text-xs text-slate-500">ตัน CO₂</span>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  ถ่านหินเทียบเท่า {formatNumber(activeReport.coal_saved_ton, 3)} ตัน
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-base font-bold text-[#0c2340]">
                      Monthly Report — {monthLabel(activeReport.report_month)}
                    </h2>
                    <p className="text-xs text-slate-500">
                      ค่า Total เป็น generated column จากข้อมูล PEA ไม่ใช่ตัวเลขที่หน้าเว็บคำนวณเอง
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      ปุ่ม PPTX / PDF จะเปิดใช้งานหลังรายงานอยู่ในสถานะอนุมัติหรือเผยแพร่แล้ว เพื่อป้องกันการส่งออกข้อมูลที่ยังไม่ผ่านการตรวจสอบ
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[10px] font-black",
                        STATUS_META[activeReport.status]?.className ?? "bg-slate-100 text-slate-700",
                      )}
                    >
                      {STATUS_META[activeReport.status]?.label ?? activeReport.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => startEditReport(activeReport)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      แก้ไข
                    </button>
                    {activeReport.status === "needs_review" ? (
                      <button
                        type="button"
                        onClick={() => void transitionReport(activeReport, "approve")}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        อนุมัติ
                      </button>
                    ) : null}
                    {activeReport.status === "approved" ? (
                      <button
                        type="button"
                        onClick={() => void transitionReport(activeReport, "publish")}
                        className="inline-flex items-center gap-1 rounded-lg bg-violet-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-violet-700"
                      >
                        เผยแพร่
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => void deleteReport(activeReport)}
                      className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      ลบ
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div className="text-[10px] font-black uppercase text-slate-500">สบปราบ</div>
                    <div className="mt-1 text-xl font-black text-[#0c2340]">
                      {formatNumber(activeReport.sobprab_kwh)} <span className="text-xs font-semibold">kWh</span>
                    </div>
                    <div className="mt-1 text-xs text-slate-500">฿{formatMoney(activeReport.sobprab_amount_thb)}</div>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div className="text-[10px] font-black uppercase text-slate-500">ผาลาด</div>
                    <div className="mt-1 text-xl font-black text-[#0c2340]">
                      {formatNumber(activeReport.phalaad_kwh)} <span className="text-xs font-semibold">kWh</span>
                    </div>
                    <div className="mt-1 text-xs text-slate-500">฿{formatMoney(activeReport.phalaad_amount_thb)}</div>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div className="text-[10px] font-black uppercase text-slate-500">Solar</div>
                    <div className="mt-1 text-xl font-black text-amber-700">
                      {formatNumber(activeReport.solar_yield_kwh)} <span className="text-xs font-semibold">kWh</span>
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      ประมวลผล {formatDateTime(activeReport.processed_at)}
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <h3 className="mb-3 text-sm font-bold text-[#0c2340]">เอกสารที่เป็น Source of Truth</h3>
                  <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200">
                    {selectedMonthSources.length ? (
                      selectedMonthSources.map((source) => {
                        const status = STATUS_META[source.status] ?? STATUS_META.uploaded;
                        return (
                          <div key={source.id} className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="truncate text-sm font-semibold text-slate-800">{source.filename}</span>
                                <span className={cn("shrink-0 rounded px-2 py-0.5 text-[9px] font-bold", status.className)}>
                                  {status.label}
                                </span>
                              </div>
                              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
                                <span>{SOURCE_TYPE_LABEL[source.source_type]}</span>
                                <span>{source.site?.name ?? "ไม่ระบุ site"}</span>
                                <span>{source.billing_period ? monthLabel(source.billing_period) : "ไม่ระบุเดือน"}</span>
                                {source.sha256 && <span>SHA-256 {source.sha256.slice(0, 12)}…</span>}
                              </div>
                              {source.validation_errors?.length ? (
                                <p className="mt-1 text-[11px] font-medium text-orange-700">
                                  ต้องตรวจ: {source.validation_errors.join(" / ")}
                                </p>
                              ) : null}
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                              {source.source_type === "pea_bill" || source.source_type === "solar_excel" ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedSourceIds((current) =>
                                      current.includes(source.id)
                                        ? current.filter((value) => value !== source.id)
                                        : [...current, source.id],
                                    );
                                  }}
                                  className={cn(
                                    "rounded-lg border px-2.5 py-1.5 text-xs font-semibold",
                                    selectedSourceIds.includes(source.id)
                                      ? "border-[#002d62] bg-blue-50 text-[#002d62]"
                                      : "border-slate-200 text-slate-600 hover:bg-slate-50",
                                  )}
                                >
                                  {selectedSourceIds.includes(source.id) ? "เลือกแล้ว" : "เลือก"}
                                </button>
                              ) : null}
                              <button
                                type="button"
                                onClick={() => void handleDownloadSource(source.id)}
                                className="inline-flex items-center gap-1 rounded-lg bg-[#0c2340] px-2.5 py-1.5 text-xs font-bold text-white hover:bg-[#163a66]"
                              >
                                <Download className="h-3.5 w-3.5" />
                                เปิดไฟล์
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-6 text-center text-xs text-slate-500">
                        ยังไม่มีเอกสารต้นทางสำหรับเดือนนี้
                      </div>
                    )}
                  </div>

                  {selectedSourceIds.length > 0 && (
                    <div className="mt-3 flex flex-col gap-2 rounded-xl border border-blue-200 bg-blue-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-xs text-blue-900">
                        เลือกเอกสาร {selectedSourceIds.length} รายการสำหรับ AI Agent
                      </div>
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => void handleProcess()}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#002d62] px-3 py-2 text-xs font-bold text-white disabled:opacity-60"
                      >
                        <Play className="h-3.5 w-3.5" />
                        {isProcessing ? "กำลังประมวลผล…" : "ประมวลผลด้วย AI Agent"}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      <h3 className="text-sm font-bold text-[#0c2340]">AI Agent Pipeline</h3>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400">
                      อัปโหลดไฟล์จากส่วน Source of Truth ด้านบน
                    </span>
                  </div>
                  <div className="mt-4 space-y-3 text-xs">
                    <div className="flex items-start gap-2">
                      <Upload className="mt-0.5 h-3.5 w-3.5 text-blue-600" />
                      <div>
                        <div className="font-bold text-slate-800">1. Ingest</div>
                        <p className="text-slate-500">อัปโหลดจากหน้า Admin → private Supabase Storage พร้อม SHA-256</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Sparkles className="mt-0.5 h-3.5 w-3.5 text-purple-600" />
                      <div>
                        <div className="font-bold text-slate-800">2. Extract</div>
                        <p className="text-slate-500">Responses API อ่าน PDF/Excel และคืน structured JSON</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <ShieldCheck className="mt-0.5 h-3.5 w-3.5 text-emerald-600" />
                      <div>
                        <div className="font-bold text-slate-800">3. Validate</div>
                        <p className="text-slate-500">เทียบ site/month และตั้ง confidence + needs_review</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Database className="mt-0.5 h-3.5 w-3.5 text-slate-600" />
                      <div>
                        <div className="font-bold text-slate-800">4. Persist</div>
                        <p className="text-slate-500">เขียน reading + Monthly Report และผูก source document</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="text-[10px] font-black uppercase text-slate-500">Last run</div>
                    <div className="mt-1 text-xs font-semibold text-slate-700">
                      {latestRun ? formatDateTime(latestRun.finished_at ?? latestRun.started_at) : "ยังไม่มีการประมวลผล"}
                    </div>
                    {latestRun?.error_message ? (
                      <p className="mt-1 text-[11px] text-rose-700">{latestRun.error_message}</p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex flex-col gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#0c2340]">ประวัติ Monthly Reports</h2>
                  <p className="text-xs text-slate-500">
                    CRUD ใช้ Supabase RLS + Facility Admin permission; เอกสารต้นทางไม่ถูกลบพร้อม Report
                  </p>
                </div>
                <div className="text-xs font-semibold text-slate-400">ทั้งหมด {reports.length} รายการ</div>
              </div>

              <div className="mt-4 divide-y divide-slate-100">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="flex flex-col gap-3 rounded-lg p-2.5 transition-colors hover:bg-slate-50/70 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedReportId(report.id)}
                      className="min-w-0 text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-800">{monthLabel(report.report_month)}</span>
                        <span
                          className={cn(
                            "rounded px-2 py-0.5 text-[10px] font-bold",
                            STATUS_META[report.status]?.className ?? "bg-slate-100 text-slate-700",
                          )}
                        >
                          {STATUS_META[report.status]?.label ?? report.status}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-3 text-[11px] text-slate-500">
                        <span>สบปราบ {formatNumber(report.sobprab_kwh)} kWh</span>
                        <span>ผาลาด {formatNumber(report.phalaad_kwh)} kWh</span>
                        <span>Solar {formatNumber(report.solar_yield_kwh)} kWh</span>
                        <span>รวม ฿{formatMoney(report.total_amount_thb)}</span>
                      </div>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEditReport(report)}
                        className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        แก้ไข
                      </button>
                      <button
                        type="button"
                        onClick={() => void deleteReport(report)}
                        className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        ลบ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                <div className="text-xs text-slate-600">
                  <div className="font-bold text-slate-800">ข้อกำกับข้อมูล</div>
                  <p className="mt-1">
                    AI Agent ไม่คำนวณ CO₂ หรือถ่านหินจากตัวเลขที่เดาเอง ค่าเหล่านี้ต้องมาจาก calculation factor ที่ได้รับอนุมัติหรือการกรอกโดยผู้รับผิดชอบ
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {showEditor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-black text-[#0c2340]">
                    {editingId ? "แก้ไข Monthly Report" : "สร้าง Monthly Report"}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">ใช้สำหรับแก้ไข/รับรองข้อมูลจาก AI extraction</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEditor(false)}
                  className="rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-100"
                >
                  ✕
                </button>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="text-[11px] font-bold text-slate-600">
                  รอบเดือน
                  <input
                    type="month"
                    value={draft.report_month}
                    onChange={(event) => setDraftField("report_month", event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                  />
                </label>

                <label className="text-[11px] font-bold text-slate-600">
                  สถานะ
                  <select
                    value={draft.status}
                    onChange={(event) => setDraftField("status", event.target.value as ReportStatus)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                  >
                    <option value="draft">Draft</option>
                    <option value="processing">Processing</option>
                    <option value="needs_review">Needs Review</option>
                    <option value="failed">Failed</option>
                  </select>
                </label>

                {[
                  ["sobprab_kwh", "สบปราบ kWh"],
                  ["sobprab_amount_thb", "สบปราบ บาท"],
                  ["phalaad_kwh", "ผาลาด kWh"],
                  ["phalaad_amount_thb", "ผาลาด บาท"],
                  ["solar_yield_kwh", "Solar kWh"],
                  ["co2_avoided_ton", "CO₂ Avoided ton"],
                  ["coal_saved_ton", "Coal Saved ton"],
                ].map(([field, label]) => (
                  <label key={field} className="text-[11px] font-bold text-slate-600">
                    {label}
                    <input
                      type="number"
                      min="0"
                      step="0.001"
                      value={draft[field as keyof ReportDraft]}
                      onChange={(event) =>
                        setDraftField(field as keyof ReportDraft, event.target.value)
                      }
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                    />
                  </label>
                ))}
              </div>

              <div className="mt-5 rounded-lg bg-slate-50 p-3 text-[11px] text-slate-500">
                Total kWh / Total Amount / Solar Ratio จะถูกคำนวณโดย PostgreSQL generated columns
                หลังบันทึก
              </div>

              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditor(false)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={() => void saveReport()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#002d62] px-4 py-2 text-xs font-bold text-white"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
