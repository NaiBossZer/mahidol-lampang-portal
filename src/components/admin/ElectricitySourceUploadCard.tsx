import { useEffect, useState } from "react";
import { Database, FileSpreadsheet, FileText, Upload } from "lucide-react";
import { toast } from "sonner";
import { useAdminAuth } from "@/components/AdminGuard";
import { apiRequest } from "@/services/api";

type SourceType = "pea_bill" | "solar_excel";

interface Site {
  id: string;
  code: string;
  name: string;
  active: boolean;
}

interface DashboardPayload {
  sites?: Site[];
}

function monthInput(value: string) {
  return value.slice(0, 7);
}

export function ElectricitySourceUploadCard() {
  const { role, permissions } = useAdminAuth();
  const canManage = role === "SUPER_ADMIN" || permissions.includes("facility.manage");
  const [sites, setSites] = useState<Site[]>([]);
  const [sourceSite, setSourceSite] = useState("SOBPRAB");
  const [sourceType, setSourceType] = useState<SourceType>("pea_bill");
  const [sourceMonth, setSourceMonth] = useState(monthInput(new Date().toISOString()));
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!canManage) {
      setIsLoading(false);
      return;
    }

    let active = true;
    apiRequest<DashboardPayload>("/api/admin/electricity?resource=dashboard")
      .then((data) => {
        if (!active) return;
        const activeSites = (data.sites ?? []).filter((site) => site.active);
        setSites(activeSites);
        if (activeSites.length && !activeSites.some((site) => site.code === sourceSite)) {
          setSourceSite(activeSites[0].code);
        }
      })
      .catch(() => {
        if (active) toast.error("โหลดรายการสถานที่สำหรับอัปโหลดไม่สำเร็จ");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [canManage]);

  const handleUpload = async () => {
    if (!sourceFile) {
      toast.error("กรุณาเลือกไฟล์ PDF หรือ Excel ก่อน");
      return;
    }

    setIsUploading(true);
    try {
      const form = new FormData();
      form.append("file", sourceFile);
      form.append("siteCode", sourceSite);
      form.append("sourceType", sourceType);
      form.append("billingPeriod", sourceMonth + "-01");

      await apiRequest("/api/admin/electricity?action=upload", {
        method: "POST",
        body: form,
      });

      setSourceFile(null);
      toast.success("อัปโหลด Source of Truth เข้าระบบแล้ว");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "อัปโหลดไม่สำเร็จ");
    } finally {
      setIsUploading(false);
    }
  };

  if (!canManage) return null;

  return (
    <section className="border-b border-slate-200 bg-slate-50/80">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
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
                    อัปโหลดไฟล์ค่าไฟฟ้า / Solar
                  </h2>
                </div>
              </div>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                อัปโหลด PEA PDF หรือ Solar Excel แล้วเก็บเป็น Source of Truth ก่อนนำไปประมวลผลด้วย AI Agent
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-[1.2fr_1.1fr_1fr_1.8fr_auto] md:items-end">
            <label className="text-[11px] font-bold text-slate-600">
              สถานที่
              <select
                value={sourceSite}
                onChange={(event) => setSourceSite(event.target.value)}
                disabled={isLoading || !sites.length}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700"
              >
                {sites.map((site) => (
                  <option key={site.id} value={site.code}>
                    {site.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-[11px] font-bold text-slate-600">
              ประเภทไฟล์
              <select
                value={sourceType}
                onChange={(event) => setSourceType(event.target.value as SourceType)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700"
              >
                <option value="pea_bill">PEA Bill / PDF</option>
                <option value="solar_excel">Solar Excel</option>
              </select>
            </label>

            <label className="text-[11px] font-bold text-slate-600">
              รอบเดือน
              <input
                type="month"
                value={sourceMonth}
                onChange={(event) => setSourceMonth(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700"
              />
            </label>

            <label className="block text-[11px] font-bold text-slate-600">
              ไฟล์ต้นฉบับ
              <div className="mt-1 flex items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2">
                <FileSpreadsheet className="h-4 w-4 shrink-0 text-slate-500" />
                <input
                  type="file"
                  accept=".pdf,.xls,.xlsx,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={(event) => setSourceFile(event.target.files?.[0] ?? null)}
                  className="min-w-0 flex-1 text-xs"
                />
              </div>
              {sourceFile ? (
                <span className="mt-1 block truncate text-[10px] font-medium text-slate-500">
                  {sourceFile.name} · {(sourceFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
              ) : null}
            </label>

            <button
              type="button"
              onClick={() => void handleUpload()}
              disabled={!sourceFile || isUploading || isLoading}
              className="inline-flex h-[42px] items-center justify-center gap-1.5 rounded-lg bg-[#002d62] px-4 text-xs font-bold text-white shadow-xs hover:bg-[#163a66] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Upload className="h-3.5 w-3.5" />
              {isUploading ? "กำลังอัปโหลด…" : "อัปโหลด"}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Database className="h-3.5 w-3.5" />
              Private Supabase Storage
            </span>
            <span className="inline-flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" />
              PDF / XLS / XLSX
            </span>
            <span>หลังอัปโหลด ให้เลือกเอกสารด้านล่างและสั่ง AI Agent ได้ทันที</span>
          </div>
        </div>
      </div>
    </section>
  );
}
