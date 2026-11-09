import { useState } from "react";
import { CheckCircle2, Database, FileSpreadsheet, FileText, Sparkles, Upload, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useAdminAuth } from "@/components/AdminGuard";
import { apiRequest } from "@/services/api";

interface ElectricitySourceUploadCardProps {
  onUploaded?: () => void | Promise<void>;
}

interface FilePickerProps {
  title: string;
  hint: string;
  accept: string;
  file: File | null;
  onChange: (file: File | null) => void;
  icon: "pdf" | "solar";
}

function FilePicker({ title, hint, accept, file, onChange, icon }: FilePickerProps) {
  return (
    <label className="block rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50/40">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-white p-2 text-[#002d62] shadow-xs">
          {icon === "solar" ? <FileSpreadsheet className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-black text-slate-800">{title}</div>
          <div className="mt-1 text-[11px] leading-5 text-slate-500">{hint}</div>
          {file ? (
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span className="min-w-0 flex-1 truncate text-[11px] font-semibold text-emerald-800">{file.name}</span>
              <button
                type="button"
                aria-label={"ลบไฟล์ " + file.name}
                onClick={(event) => {
                  event.preventDefault();
                  onChange(null);
                }}
                className="rounded-md p-1 text-emerald-700 hover:bg-emerald-100"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <span className="mt-2 inline-flex rounded-md bg-white px-2 py-1 text-[10px] font-bold text-slate-600 shadow-xs">
              เลือกไฟล์
            </span>
          )}
        </div>
      </div>
      <input
        type="file"
        accept={accept}
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        className="sr-only"
      />
    </label>
  );
}

export function ElectricitySourceUploadCard({ onUploaded }: ElectricitySourceUploadCardProps) {
  const { role, permissions } = useAdminAuth();
  const canManage = role === "SUPER_ADMIN" || permissions.includes("facility.manage");
  const [sourceMonth, setSourceMonth] = useState(() => {
    const now = new Date();
    return now.getUTCFullYear() + "-" + String(now.getUTCMonth() + 1).padStart(2, "0");
  });
  const [sobprabFile, setSobprabFile] = useState<File | null>(null);
  const [phalaadFile, setPhalaadFile] = useState<File | null>(null);
  const [solarFile, setSolarFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const allFilesReady = Boolean(sobprabFile && phalaadFile && solarFile);

  const handleUploadSet = async () => {
    if (!allFilesReady || !sobprabFile || !phalaadFile || !solarFile) {
      toast.error("กรุณาเลือกเอกสารให้ครบ 3 ไฟล์ก่อนส่ง");
      return;
    }

    setIsUploading(true);
    try {
      const form = new FormData();
      form.append("billingPeriod", sourceMonth + "-01");
      form.append("sobprabFile", sobprabFile);
      form.append("phalaadFile", phalaadFile);
      form.append("solarFile", solarFile);

      await apiRequest("/api/admin/electricity?action=upload-set", {
        method: "POST",
        body: form,
      });

      setSobprabFile(null);
      setPhalaadFile(null);
      setSolarFile(null);
      toast.success("อัปโหลดครบ 3 เอกสารแล้ว และส่งชุดเอกสารเข้า AI Agent เรียบร้อย");
      await onUploaded?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "อัปโหลดชุดเอกสารไม่สำเร็จ");
      await onUploaded?.();
    } finally {
      setIsUploading(false);
    }
  };

  if (!canManage) return null;

  return (
    <section className="border-b border-slate-200 bg-slate-50/80">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-blue-50 p-2 text-[#002d62]">
                  <Upload className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-[#002d62]">
                    Electricity Source of Truth
                  </p>
                  <h2 className="mt-0.5 text-lg font-black tracking-tight text-brand-navy">
                    อัปโหลดชุดเอกสารประจำเดือน
                  </h2>
                </div>
              </div>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                หนึ่งรอบเดือนต้องส่งพร้อมกัน 3 เอกสาร: PEA สบปราบ, PEA ผาลาด และ Solar 18 kWp แล้วระบบจะส่งทั้งชุดเข้า AI Agent เป็นรอบเดียวกัน
              </p>
            </div>
            <div className="inline-flex shrink-0 items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700">
              <Sparkles className="h-3.5 w-3.5" />
              1 เดือน = 1 ชุดเอกสาร
            </div>
          </div>

          <div className="mt-5">
            <label className="block max-w-[220px] text-[11px] font-bold text-slate-600">
              รอบเดือน
              <input
                type="month"
                value={sourceMonth}
                onChange={(event) => setSourceMonth(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700"
              />
            </label>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
            <FilePicker
              title="1. PEA สบปราบ"
              hint="ใบแจ้งค่าไฟฟ้าต้นฉบับ PDF · site = SOBPRAB"
              accept=".pdf,application/pdf"
              file={sobprabFile}
              onChange={setSobprabFile}
              icon="pdf"
            />
            <FilePicker
              title="2. PEA ผาลาด"
              hint="ใบแจ้งค่าไฟฟ้าต้นฉบับ PDF · site = PHALAAD"
              accept=".pdf,application/pdf"
              file={phalaadFile}
              onChange={setPhalaadFile}
              icon="pdf"
            />
            <FilePicker
              title="3. Solar 18 kWp"
              hint="ไฟล์ Excel ต้นฉบับ XLS/XLSX · site = SOLAR"
              accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              file={solarFile}
              onChange={setSolarFile}
              icon="solar"
            />
          </div>

          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Database className="h-3.5 w-3.5" />
                Private Supabase Storage
              </span>
              <span>SHA-256 ตรวจไฟล์ซ้ำ</span>
              <span>AI validation ตรวจเดือนและสถานที่ทั้งชุด</span>
            </div>
            <button
              type="button"
              onClick={() => void handleUploadSet()}
              disabled={!allFilesReady || isUploading}
              className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-lg bg-[#002d62] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#163a66] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {isUploading ? "กำลังอัปโหลดและประมวลผล…" : "อัปโหลด 3 เอกสาร + ส่ง AI Agent"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
