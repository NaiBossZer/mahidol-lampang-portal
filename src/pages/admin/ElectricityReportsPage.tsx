import { useState } from "react";
import {
  Zap,
  Download,
  Calendar,
  Building2,
  Leaf,
  SunMedium,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  RefreshCw,
  TrendingDown,
  Info,
  Clock,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MonthlyReport {
  id: string;
  month: string;
  yearBce: number;
  sobprabKwh: number;
  sobprabAmount: number;
  phalaadKwh: number;
  phalaadAmount: number;
  solarYieldKwh: number;
  co2AvoidedTon: number;
  coalSavedTon: number;
  totalPeaKwh: number;
  totalAmountThb: number;
  solarRatioPct: number;
  processedAt: string;
  pptxFilename: string;
  pdfFilename: string;
  status: "completed" | "processing" | "pending";
}

const INITIAL_REPORTS: MonthlyReport[] = [
  {
    id: "rep-2569-09",
    month: "กันยายน",
    yearBce: 2569,
    sobprabKwh: 3680.0,
    sobprabAmount: 18230.5,
    phalaadKwh: 310.0,
    phalaadAmount: 1720.25,
    solarYieldKwh: 1945.5,
    co2AvoidedTon: 0.973,
    coalSavedTon: 0.603,
    totalPeaKwh: 3990.0,
    totalAmountThb: 19950.75,
    solarRatioPct: 32.78,
    processedAt: "2026-09-29 19:30",
    pptxFilename: "8.สรุปการใช้ไฟฟ้าและ Solar Cell (ลำปาง)_02092569.pptx",
    pdfFilename: "8.สรุปการใช้ไฟฟ้าและ Solar Cell (ลำปาง)_02092569.pdf",
    status: "completed",
  },
  {
    id: "rep-2569-08",
    month: "สิงหาคม",
    yearBce: 2569,
    sobprabKwh: 3840.0,
    sobprabAmount: 19120.4,
    phalaadKwh: 340.0,
    phalaadAmount: 1890.1,
    solarYieldKwh: 1880.2,
    co2AvoidedTon: 0.94,
    coalSavedTon: 0.583,
    totalPeaKwh: 4180.0,
    totalAmountThb: 21010.5,
    solarRatioPct: 31.02,
    processedAt: "2026-08-30 14:15",
    pptxFilename: "8.สรุปการใช้ไฟฟ้าและ Solar Cell (ลำปาง)_สิงหาคม2569.pptx",
    pdfFilename: "8.สรุปการใช้ไฟฟ้าและ Solar Cell (ลำปาง)_สิงหาคม2569.pdf",
    status: "completed",
  },
];

export function ElectricityReportsPage() {
  const [reports, setReports] = useState<MonthlyReport[]>(INITIAL_REPORTS);
  const [selectedReportId, setSelectedReportId] = useState<string>("rep-2569-09");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const activeReport = reports.find((r) => r.id === selectedReportId) ?? reports[0];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("อัปเดตข้อมูลรายงานค่าไฟฟ้าล่าสุดเรียบร้อยแล้ว");
    }, 600);
  };

  const handleDownload = (filename: string, filetype: "PDF" | "PPTX") => {
    toast.info(`กำลังเริ่มดาวน์โหลดเอกสาร ${filetype}: ${filename}`);
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-slate-50/60 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                <Zap className="h-3.5 w-3.5 fill-amber-500 text-amber-600" />
                Engineering & Energy Agent Hub
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" /> AI Agent Live
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#0c2340]">
              ระบบรายงานสรุปการใช้ไฟฟ้าและพลังงานหมุนเวียน (EE Report)
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              งานพันธกิจเพื่อสังคม คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล จังหวัดลำปาง
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className={cn("h-3.5 w-3.5 text-slate-500", isRefreshing && "animate-spin")} />
              รีเฟรช
            </button>
            <button
              type="button"
              onClick={() => handleDownload(activeReport.pdfFilename, "PDF")}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#002d62] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#00224b] transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              ดาวน์โหลดสรุป PDF ประจำเดือน
            </button>
          </div>
        </div>

        {/* Selected Month Selector Ribbon */}
        <div className="flex items-center justify-between rounded-xl bg-white p-3 shadow-xs border border-slate-200">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#002d62]" />
            <span className="text-xs font-bold text-slate-700">เลือกรอบเดือนที่แสดงผล:</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {reports.map((rep) => (
              <button
                key={rep.id}
                type="button"
                onClick={() => setSelectedReportId(rep.id)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
                  selectedReportId === rep.id
                    ? "bg-[#0c2340] text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                {rep.month} {rep.yearBce}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Total Electric Bill */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold tracking-wide uppercase">ค่าไฟฟ้ารวม (กฟภ.)</span>
              <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
                <Zap className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-[#0c2340]">
                ฿{activeReport.totalAmountThb.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
              </span>
              <span className="ml-1 text-xs text-slate-500">บาท</span>
            </div>
            <p className="mt-2 flex items-center text-xs text-slate-500">
              <TrendingDown className="mr-1 h-3.5 w-3.5 text-emerald-600" />
              หน่วยไฟรวม {activeReport.totalPeaKwh.toLocaleString()} kWh
            </p>
          </div>

          {/* Card 2: PEA Sobprab Station */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold tracking-wide uppercase">กฟภ. สถานีสบปราบ</span>
              <div className="rounded-lg bg-amber-50 p-2 text-amber-700">
                <Building2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-[#0c2340]">
                {activeReport.sobprabKwh.toLocaleString("th-TH", { minimumFractionDigits: 1 })}
              </span>
              <span className="ml-1 text-xs text-slate-500">kWh</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              ยอดเงิน: ฿{activeReport.sobprabAmount.toLocaleString("th-TH", { minimumFractionDigits: 2 })} บาท
            </p>
          </div>

          {/* Card 3: Solar Cell Production */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold tracking-wide uppercase">การผลิต Solar Cell</span>
              <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                <SunMedium className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-amber-700">
                {activeReport.solarYieldKwh.toLocaleString("th-TH", { minimumFractionDigits: 1 })}
              </span>
              <span className="ml-1 text-xs text-slate-500">kWh Yield</span>
            </div>
            <p className="mt-2 text-xs font-semibold text-emerald-600">
              ทดแทนพลังงาน {activeReport.solarRatioPct.toFixed(1)}% ของการใช้รวม
            </p>
          </div>

          {/* Card 4: Environmental Savings */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold tracking-wide uppercase">ลดคาร์บอน (CO₂ Avoided)</span>
              <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
                <Leaf className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-emerald-700">
                {activeReport.co2AvoidedTon.toFixed(3)}
              </span>
              <span className="ml-1 text-xs text-slate-500">ตัน CO₂</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              ทดแทนถ่านหินมาตรฐาน {activeReport.coalSavedTon.toFixed(3)} ตัน
            </p>
          </div>
        </div>

        {/* Detailed Breakdown & Download Hub */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Table: Monthly Reports List */}
          <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-[#0c2340]">ประวัติเอกสารรายงานสรุปประจำเดือน</h2>
                <p className="text-xs text-slate-500">เอกสารสรุปผลจัดทำโดย AI Agent อัตโนมัติ</p>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                ทั้งหมด {reports.length} รายการ
              </span>
            </div>

            <div className="mt-4 divide-y divide-slate-100">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50/70 p-2 rounded-lg transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-800">
                        ประจำเดือน {rep.month} {rep.yearBce}
                      </span>
                      <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        สมบูรณ์
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 text-xs text-slate-500">
                      <span>สบปราบ: {rep.sobprabKwh.toLocaleString()} kWh</span>
                      <span>ผาลาด: {rep.phalaadKwh.toLocaleString()} kWh</span>
                      <span>Solar: {rep.solarYieldKwh.toLocaleString()} kWh</span>
                      <span className="font-semibold text-slate-700">
                        รวม: ฿{rep.totalAmountThb.toLocaleString()} บ.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDownload(rep.pptxFilename, "PPTX")}
                      className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      title="ดาวน์โหลดไฟล์ PowerPoint"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5 text-orange-600" />
                      PPTX
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownload(rep.pdfFilename, "PDF")}
                      className="inline-flex items-center gap-1 rounded-md bg-[#0c2340] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#163a66]"
                      title="ดาวน์โหลดไฟล์ PDF"
                    >
                      <FileText className="h-3.5 w-3.5 text-rose-300" />
                      PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar / Info Box: AI Agent Pipeline Info */}
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <h3 className="text-sm font-bold text-[#0c2340]">สถานะ AI Agent อัตโนมัติ</h3>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 rounded-full bg-emerald-500 h-2 w-2 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800">โหมดการประมวลผล:</span>
                    <p className="text-slate-500">100% Offline Multi-Bill Processing Pipeline</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800">เวลาประมวลผลล่าสุด:</span>
                    <p className="text-slate-500">{activeReport.processedAt} น.</p>
                  </div>
                </div>

                <div className="rounded-lg bg-slate-50 p-3 border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    <Info className="h-3.5 w-3.5 text-blue-600" />
                    <span>โฟลเดอร์นำเข้าข้อมูล (Data Inbox):</span>
                  </div>
                  <p className="font-mono text-[11px] text-slate-600 break-all">
                    data/inbox/
                  </p>
                  <p className="text-[11px] text-slate-500">
                    วางไฟล์ PDF สบปราบ, ผาลาด และ Excel Solar เพื่อให้ AI ประมวลผลรอบใหม่อัตโนมัติ
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Contact & Dispatch Notice */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs text-xs space-y-2">
              <span className="font-bold text-[#0c2340]">การจัดส่งรายงานอัตโนมัติ:</span>
              <p className="text-slate-500">
                ระบบเชื่อมต่อการส่งไฟล์รายงานสรุปผ่าน Gmail SMTP ไปยังวิศวกรผู้ดูแล และแจ้งเตือนสรุปผลรายเดือนผ่าน Telegram Bot ของศูนย์ฯ
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
