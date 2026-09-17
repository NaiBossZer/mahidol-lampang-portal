import { useEffect, useMemo, useState } from "react";
import { Download, Eye, Printer, Search, X } from "lucide-react";
import { getAdminDashboardData, type AdminDashboardData } from "@/services/api";

type ScoreField = keyof Pick<AdminDashboardData["responses"][number],
  "p2_location" | "p2_schedule" | "p2_readiness" | "p2_reception" | "p2_overall" |
  "p3_interest" | "p3_content" | "p3_clarity" | "p3_benefit" | "p3_application" |
  "p4_knowledge" | "p4_inspiration" | "p4_community_resource" | "p4_future_return">;

type ReportRow = {
  id: string;
  activity: string;
  date: string;
  participants: number;
  respondents: number;
  responseRate: number | null;
  averageScore: number | null;
};

const SCORE_FIELDS: ScoreField[] = [
  "p2_location", "p2_schedule", "p2_readiness", "p2_reception", "p2_overall",
  "p3_interest", "p3_content", "p3_clarity", "p3_benefit", "p3_application",
  "p4_knowledge", "p4_inspiration", "p4_community_resource", "p4_future_return",
];

const score = (value: unknown) => {
  const n = Number(value);
  return Number.isFinite(n) && n >= 1 && n <= 5 ? n : null;
};

const formatNumber = (value: number) => new Intl.NumberFormat("th-TH").format(value);
const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "-" : new Intl.DateTimeFormat("th-TH", { day: "numeric", month: "short", year: "numeric" }).format(d);
};
const csvCell = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const printCell = (value: unknown) => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

function buildRows(data: AdminDashboardData): ReportRow[] {
  const activityMap = new Map(data.activities.map((a) => [a.id, a]));
  const occurrenceMap = new Map(data.occurrences.map((o) => [o.id, o]));
  const grouped = new Map<string, { participants: number; responses: typeof data.responses; latestDate: string }>();

  for (const occurrence of data.occurrences) {
    if (["cancelled", "archived"].includes(occurrence.status)) continue;
    const current = grouped.get(occurrence.activity_id) ?? { participants: 0, responses: [], latestDate: "" };
    current.participants += Math.max(0, Number(occurrence.participant_count || 0));
    if (!current.latestDate || new Date(occurrence.start_at).getTime() > new Date(current.latestDate).getTime()) current.latestDate = occurrence.start_at;
    grouped.set(occurrence.activity_id, current);
  }

  for (const response of data.responses) {
    const activityId = response.activity_id || (response.occurrence_id ? occurrenceMap.get(response.occurrence_id)?.activity_id : undefined);
    if (!activityId) continue;
    const current = grouped.get(activityId) ?? { participants: 0, responses: [], latestDate: "" };
    current.responses.push(response);
    grouped.set(activityId, current);
  }

  return [...grouped.entries()]
    .map(([id, group]) => {
      const values = group.responses.flatMap((response) => SCORE_FIELDS.map((field) => score(response[field])).filter((v): v is number => v !== null));
      const activity = activityMap.get(id);
      const respondents = group.responses.length;
      return {
        id,
        activity: activity?.title || "-",
        date: group.latestDate || activity?.activity_date || "",
        participants: group.participants,
        respondents,
        responseRate: group.participants > 0 ? Math.min(100, respondents / group.participants * 100) : null,
        averageScore: values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function ExecutiveReportOverride() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (window.location.pathname !== "/dashboard") return;
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest("button");
      if (!button || !button.textContent?.includes("ดูรายงานทั้งหมด")) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      setOpen(true);
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  useEffect(() => {
    if (!open) return;
    let active = true;
    setLoading(true);
    setError("");
    void getAdminDashboardData()
      .then((data) => { if (active) setRows(buildRows(data)); })
      .catch((e) => { if (active) setError(e instanceof Error ? e.message : "ไม่สามารถโหลดรายงานได้"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [open]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? rows.filter((row) => row.activity.toLowerCase().includes(q)) : rows;
  }, [rows, search]);

  const exportCSV = () => {
    const headers = ["กิจกรรม", "วันที่จัด", "ผู้เข้าร่วม", "ผู้ตอบ", "Response Rate", "คะแนนเฉลี่ย"];
    const body = filteredRows.map((row) => [row.activity, formatDate(row.date), row.participants, row.respondents, row.responseRate === null ? "-" : `${row.responseRate.toFixed(1)}%`, row.averageScore === null ? "-" : row.averageScore.toFixed(2)]);
    const csv = "\uFEFF" + [headers, ...body].map((line) => line.map(csvCell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "Mahidol_Lampang_Executive_Report_2568.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    const printWindow = window.open("", "_blank", "noopener,noreferrer,width=1400,height=900");
    if (!printWindow) { window.print(); return; }
    const headers = ["กิจกรรม", "วันที่จัด", "ผู้เข้าร่วม", "ผู้ตอบ", "Response Rate", "คะแนนเฉลี่ย"];
    const body = filteredRows.map((row) => `<tr><td>${printCell(row.activity)}</td><td>${printCell(formatDate(row.date))}</td><td class="num">${row.participants.toLocaleString("th-TH")}</td><td class="num">${row.respondents.toLocaleString("th-TH")}</td><td class="center">${printCell(row.responseRate === null ? "-" : `${row.responseRate.toFixed(1)}%`)}</td><td class="center">${printCell(row.averageScore === null ? "-" : `★ ${row.averageScore.toFixed(2)}`)}</td></tr>`).join("");
    printWindow.document.write(`<!doctype html><html lang="th"><head><meta charset="utf-8"><title>Mahidol Lampang Executive Report</title><style>@page{size:A4 landscape;margin:12mm}*{box-sizing:border-box}body{font-family:Arial,'Noto Sans Thai',sans-serif;color:#0f172a;font-size:11px;margin:0}h1{font-size:18px;margin:0 0 4px}p{margin:0 0 12px;color:#64748b}.sheet{border-collapse:separate;border-spacing:0;width:100%;border:1px solid #dbe3ea;border-radius:10px;overflow:hidden}th,td{border-right:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;padding:8px 10px;vertical-align:middle}th:last-child,td:last-child{border-right:0}tr:last-child td{border-bottom:0}th{background:#f0fdf4;color:#166534;text-align:left;font-weight:700}.num{text-align:right}.center{text-align:center}.footer{margin-top:10px;color:#64748b}@media print{th{background:#f0fdf4!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body><h1>รายงานผลสัมฤทธิ์รวมทุกกิจกรรม (Executive Summary)</h1><p>คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ งานพันธกิจเพื่อสังคม คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล</p><table class="sheet"><thead><tr>${headers.map((h) => `<th>${printCell(h)}</th>`).join("")}</tr></thead><tbody>${body || `<tr><td colspan="6">ไม่พบข้อมูล</td></tr>`}</tbody></table><div class="footer">รวมกิจกรรมทั้งหมด: ${filteredRows.length.toLocaleString("th-TH")} รายการ</div></body></html>`);
    printWindow.document.close();
    printWindow.focus();
    window.setTimeout(() => { printWindow.print(); printWindow.close(); }, 300);
  };

  if (!open) return null;

  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm" onClick={() => setOpen(false)}>
    <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
        <div><h2 className="text-[18px] font-bold tracking-tight text-slate-900">รายงานผลสัมฤทธิ์รวมทุกกิจกรรม (Executive Summary)</h2><p className="mt-1 text-[12px] text-slate-500">คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ งานพันธกิจเพื่อสังคม คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล</p></div>
        <button type="button" onClick={() => { setOpen(false); setSearch(""); }} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label="ปิดรายงาน"><X className="h-5 w-5" /></button>
      </div>
      <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/70 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ค้นหากิจกรรม..." className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-[12px] outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100" /></div>
        <div className="flex gap-2"><button type="button" onClick={exportCSV} disabled={!filteredRows.length || loading} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-[12px] font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"><Download className="h-4 w-4" />ส่งออก CSV</button><button type="button" onClick={printReport} disabled={!filteredRows.length || loading} className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-white px-3 py-2 text-[12px] font-semibold text-sky-700 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-40"><Printer className="h-4 w-4" />พิมพ์รายงาน</button></div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto px-5 py-4">
        {loading ? <div className="grid min-h-48 place-items-center text-sm font-medium text-slate-400">กำลังโหลดข้อมูลจาก Supabase...</div> : error ? <div className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">ไม่สามารถโหลดรายงานได้: {error}</div> : <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full min-w-[820px] border-collapse text-[12px]"><thead><tr className="bg-emerald-50/70 text-left text-[11px] font-bold text-emerald-800"><th className="px-4 py-3">กิจกรรม</th><th className="px-4 py-3">วันที่จัด</th><th className="px-4 py-3 text-right">ผู้เข้าร่วม</th><th className="px-4 py-3 text-right">ผู้ตอบ</th><th className="px-4 py-3 text-center">Response Rate</th><th className="px-4 py-3 text-center">คะแนนเฉลี่ย</th><th className="px-4 py-3 text-center">การจัดการ</th></tr></thead>
            <tbody className="divide-y divide-slate-100 bg-white">{filteredRows.map((row) => <tr key={row.id} className="transition hover:bg-slate-50"><td className="max-w-[300px] px-4 py-3.5 font-semibold text-slate-800">{row.activity}</td><td className="whitespace-nowrap px-4 py-3.5 text-slate-600">{formatDate(row.date)}</td><td className="px-4 py-3.5 text-right font-medium text-slate-700">{formatNumber(row.participants)}</td><td className="px-4 py-3.5 text-right font-medium text-slate-700">{formatNumber(row.respondents)}</td><td className="px-4 py-3.5 text-center">{row.responseRate === null ? <span className="text-slate-400">-</span> : <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold ${row.responseRate >= 80 ? "border-emerald-200 bg-emerald-50 text-emerald-700" : row.responseRate >= 60 ? "border-sky-200 bg-sky-50 text-sky-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>{row.responseRate.toFixed(1)}%</span>}</td><td className="px-4 py-3.5 text-center">{row.averageScore === null ? <span className="text-slate-400">-</span> : <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 font-bold text-amber-700"><span>★</span>{row.averageScore.toFixed(2)}</span>}</td><td className="px-4 py-3.5 text-center"><button type="button" onClick={() => { setOpen(false); setSearch(""); window.dispatchEvent(new CustomEvent("mahidol-dashboard-select-activity", { detail: row.id })); }} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"><Eye className="h-3.5 w-3.5" />ดูรายละเอียด</button></td></tr>)}</tbody></table>
          {!filteredRows.length && <div className="px-4 py-12 text-center text-sm text-slate-400">ไม่พบกิจกรรมที่ค้นหา</div>}
        </div>}
      </div>
      <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-3 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between"><span>รวมกิจกรรมทั้งหมด: <strong className="text-slate-700">{formatNumber(filteredRows.length)}</strong> รายการ</span><button type="button" onClick={() => { setOpen(false); setSearch(""); }} className="self-end rounded-lg bg-slate-100 px-3 py-1.5 font-semibold text-slate-600 transition hover:bg-slate-200 sm:self-auto">ปิดหน้าต่าง</button></div>
    </div>
  </div>;
}
