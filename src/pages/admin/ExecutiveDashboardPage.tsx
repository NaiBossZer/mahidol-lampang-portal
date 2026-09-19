import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Activity as ActivityIcon, Calendar, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight,
  Download, ExternalLink, Filter, Globe2, Image as ImageIcon, Printer, RefreshCw, RotateCcw,
  Search, Star, Users, X,
} from "lucide-react";
import { getAdminDashboardData, type AdminDashboardData } from "@/services/api";
import { ActivityGalleryModal } from "@/components/dashboard/ActivityGalleryModal";

type Period = "ALL" | "YEAR" | "QUARTER" | "MONTH" | "CUSTOM";
type Dimension = "age_group" | "affiliation" | "organization";
type ResponseWithChannels = AdminDashboardData["responses"][number] & { channels?: string | null };
type ScoreField = keyof Pick<AdminDashboardData["responses"][number],
  "p2_location" | "p2_schedule" | "p2_readiness" | "p2_reception" | "p2_overall" |
  "p3_interest" | "p3_content" | "p3_clarity" | "p3_benefit" | "p3_application" |
  "p4_knowledge" | "p4_inspiration" | "p4_community_resource" | "p4_future_return">;
type ScoreItem = { field: ScoreField; label: string; value: number; respondentCount: number };
type ReportRow = { id: string; activity: string; date: string; submittedAt: string; ageGroup: string; affiliation: string; organization: string; scores: Record<ScoreField, string>; feedback: string; channels: string };
type ReportDetailRow = { respondentId: string; activity: string; date: string; submittedAt: string; ageGroup: string; affiliation: string; organization: string; group: string; question: string; score: string; feedback: string; channels: string };

const SCORE_GROUPS: { key: string; title: string; fields: ScoreField[] }[] = [
  { key: "opening", title: "การจัดกิจกรรม (Activity Organization)", fields: ["p2_location", "p2_schedule", "p2_readiness", "p2_reception", "p2_overall"] },
  { key: "learning", title: "เนื้อหาและการเรียนรู้ (Content & Learning)", fields: ["p3_interest", "p3_content", "p3_clarity", "p3_benefit", "p3_application"] },
  { key: "outcome", title: "ผลลัพธ์และประโยชน์ (Outcomes & Benefits)", fields: ["p4_knowledge", "p4_inspiration", "p4_community_resource", "p4_future_return"] },
];
const SCORE_LABELS: Record<ScoreField, string> = {
  p2_location: "สถานที่", p2_schedule: "กำหนดการ", p2_readiness: "ความพร้อม", p2_reception: "การต้อนรับ", p2_overall: "ภาพรวมกิจกรรม",
  p3_interest: "ความน่าสนใจ", p3_content: "เนื้อหา", p3_clarity: "ความชัดเจน", p3_benefit: "ประโยชน์", p3_application: "การนำไปใช้",
  p4_knowledge: "ความรู้ที่ได้รับ", p4_inspiration: "แรงบันดาลใจ", p4_community_resource: "ทรัพยากรชุมชน", p4_future_return: "การกลับมาใช้บริการ",
};
const ALL_SCORE_FIELDS = Object.keys(SCORE_LABELS) as ScoreField[];
const CHART_COLORS = ["#10B981", "#0EA5E9", "#F59E0B", "#A855F7", "#FB7185", "#CBD5E1"];
const CHANNEL_BRAND_COLORS: Record<string, string> = { FACEBOOK: "#1877F2", LINE: "#06C755", WEBSITE: "#123B6D", อื่นๆ: "#6B7280" };
const score = (value: unknown): number | null => { const n = Number(value); return Number.isFinite(n) && n >= 1 && n <= 5 ? n : null; };
const average = (values: number[]): number | null => values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
const formatNumber = (value: number) => new Intl.NumberFormat("th-TH").format(value);
const formatDate = (value?: string | null) => { if (!value) return "-"; const d = new Date(value); return Number.isNaN(d.getTime()) ? "-" : new Intl.DateTimeFormat("th-TH", { day: "numeric", month: "short", year: "numeric" }).format(d); };
const formatDateTime = (value?: string | null) => { if (!value) return "-"; const d = new Date(value); return Number.isNaN(d.getTime()) ? "-" : new Intl.DateTimeFormat("th-TH", { dateStyle: "medium", timeStyle: "short" }).format(d); };
const matchesDate = (value: string, period: Period, year: string, quarter: string, month: string, from: string, to: string) => { const d = new Date(value); if (Number.isNaN(d.getTime())) return false; if (period === "ALL") return true; if (period === "YEAR") return year === "ALL" || String(d.getFullYear()) === year; if (period === "QUARTER") return !quarter || `${d.getFullYear()}-Q${Math.floor(d.getMonth() / 3) + 1}` === quarter; if (period === "MONTH") return !month || value.slice(0, 7) === month; const day = value.slice(0, 10); return (!from || day >= from) && (!to || day <= to); };
const csvCell = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const printCell = (value: unknown) => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

function Card({ title, right, children }: { title: string; right?: ReactNode; children: ReactNode }) {
  return <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs"><div className="flex min-h-12 items-center justify-between gap-3 px-3.5 pt-3.5"><h2 className="truncate text-[14px] font-bold text-slate-900">{title}</h2>{right}</div>{children}</section>;
}
function Modal({ title, children, onClose, wide = false, dark = false }: { title: string; children: ReactNode; onClose: () => void; wide?: boolean; dark?: boolean }) {
  return <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${dark ? "bg-black/80" : "bg-black/60 backdrop-blur-sm"}`} onClick={onClose}><div className={`relative flex max-h-[92vh] w-full ${wide ? "max-w-7xl" : "max-w-2xl"} flex-col overflow-hidden rounded-2xl ${dark ? "bg-[#0c2340] text-white" : "bg-white text-slate-800"} shadow-2xl`} onClick={e => e.stopPropagation()}><div className={`flex items-center justify-between border-b px-5 py-3.5 ${dark ? "border-white/10" : "border-slate-100 bg-white"}`}><h2 className="truncate text-[15px] font-bold">{title}</h2><button type="button" onClick={onClose} className={`rounded-lg p-1 transition ${dark ? "text-white/60 hover:bg-white/10 hover:text-white" : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"}`}><X className="h-5 w-5" /></button></div>{children}</div></div>;
}
function DonutChart({ items, centerLabel, centerValue, size = 112 }: { items: { label: string; count: number; percentage: number; color: string }[]; centerLabel: string; centerValue: string; size?: number }) {
  let cumulative = 0;
  return <div className="relative shrink-0" style={{ width: size, height: size }}><svg className="h-full w-full -rotate-90" viewBox="0 0 36 36"><path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#d6d6d6" strokeWidth="4" />{items.map((item, idx) => { if (item.percentage <= 0) return null; const offset = -cumulative; cumulative += item.percentage; return <path key={`${item.label}-${idx}`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={item.color} strokeWidth="4" strokeDasharray={`${item.percentage.toFixed(1)},100`} strokeDashoffset={offset.toFixed(1)} />; })}</svg><div className="absolute inset-0 flex flex-col items-center justify-center text-center"><span className="text-[10px] leading-tight text-slate-400">{centerLabel}</span><span className="text-[13px] font-bold leading-tight text-slate-900">{centerValue}</span></div></div>;
}
function OverallGauge({ scoreValue, respondents, participants, responseRate, level }: { scoreValue: number | null; respondents: number; participants: number; responseRate: number | null; level: string }) {
  const percentage = scoreValue === null ? 0 : Math.min(100, scoreValue / 5 * 100);
  return <Card title="ผลการประเมินภาพรวม (Overall Evaluation)"><div className="flex items-center justify-between gap-4 p-3.5"><div className="relative h-36 w-36 shrink-0"><svg className="h-full w-full -rotate-90" viewBox="0 0 36 36"><path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#d6d6d6" strokeWidth="3.6" /><path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#0EA5E9" strokeDasharray={`${percentage.toFixed(1)},100`} strokeLinecap="round" strokeWidth="3.6" className="transition-all duration-700 ease-out" /></svg><div className="absolute inset-0 flex flex-col items-center justify-center text-center"><div className="text-[22px] font-bold leading-tight text-slate-900">{scoreValue === null ? "-" : scoreValue.toFixed(2)}</div><div className="text-[10px] leading-none text-slate-400">/ 5.00</div><span className="mt-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">{level}</span></div></div><div className="flex-1 space-y-3 text-[12px]"><Metric icon="person" label="ผู้ตอบแบบประเมิน" value={`${formatNumber(respondents)} คน`} /><Metric icon="groups" label="ผู้เข้าร่วมกิจกรรม" value={`${formatNumber(participants)} คน`} /><Metric icon="sync" label="Response Rate" value={responseRate === null ? "-" : `${Math.min(100, responseRate).toFixed(1)}%`} /></div></div></Card>;
}
function Metric({ icon, label, value }: { icon: string; label: string; value: string }) { return <div className="flex items-center gap-2.5"><div className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-slate-50 text-slate-500"><span className="material-symbols-outlined text-[18px]">{icon}</span></div><div><div className="text-[11px] text-slate-500">{label}</div><div className="font-bold text-slate-900">{value}</div></div></div>; }
function ChannelBrandIcon({ channel }: { channel: string }) {
  if (channel === "FACEBOOK") return <span aria-label="Facebook" title="Facebook" className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#1877F2] text-[16px] font-black leading-none text-white">f</span>;
  if (channel === "LINE") return <span aria-label="LINE" title="LINE" className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#06C755] text-[8px] font-black leading-none text-white">LINE</span>;
  if (channel === "WEBSITE") return <span aria-label="Website" title="Website" className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600"><Globe2 className="h-3.5 w-3.5" /></span>;
  return <span aria-label="Other" title="อื่นๆ" className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-500">•••</span>;
}
function KpiCard({ icon, label, value, suffix, onClick, iconClass }: { icon: ReactNode; label: string; value: string; suffix?: string; onClick?: () => void; iconClass: string }) {
  return <button type="button" onClick={onClick} className="group flex w-full min-w-0 flex-col justify-between rounded-xl border border-slate-200 bg-white p-3.5 text-left shadow-xs transition-all hover:border-slate-300 hover:shadow-sm"><div className="flex items-start justify-between gap-2"><div><div className="text-[12px] font-medium text-slate-500">{label}</div><div className="mt-0.5 text-[24px] font-bold leading-none text-slate-900">{value} {suffix && <span className="text-[13px] font-normal text-slate-500">{suffix}</span>}</div></div><div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${iconClass}`}>{icon}</div></div><div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px]"><span className="font-medium text-emerald-600">ข้อมูลจากระบบจริง</span><span className="flex items-center gap-0.5 font-medium text-sky-600 group-hover:text-sky-700">ดูรายละเอียด <span className="material-symbols-outlined text-[12px]">chevron_right</span></span></div></button>;
}

export function ExecutiveDashboardPage() {
  const [data, setData] = useState<AdminDashboardData | null>(null); const [loading, setLoading] = useState(true); const [refreshing, setRefreshing] = useState(false); const [error, setError] = useState("");
  const [activity, setActivity] = useState("ALL"); const [period, setPeriod] = useState<Period>("ALL"); const [year, setYear] = useState("ALL"); const [quarter, setQuarter] = useState(""); const [month, setMonth] = useState(""); const [from, setFrom] = useState(""); const [to, setTo] = useState("");
  const [dimension, setDimension] = useState<Dimension>("age_group"); const [reportsOpen, setReportsOpen] = useState(false); const [commentsOpen, setCommentsOpen] = useState(false); const [kpiMetric, setKpiMetric] = useState<string | null>(null); const [galleryOpen, setGalleryOpen] = useState(false); const [galleryIndex, setGalleryIndex] = useState(0); const [reportSearch, setReportSearch] = useState(""); const [includeReferenceData, setIncludeReferenceData] = useState(false); const [includeRespondentDetails, setIncludeRespondentDetails] = useState(false); const [loadedAt, setLoadedAt] = useState<string | null>(null);
  const load = async (silent = false) => { silent ? setRefreshing(true) : setLoading(true); setError(""); try { setData(await getAdminDashboardData()); setLoadedAt(new Date().toISOString()); } catch (e) { setError(e instanceof Error ? e.message : "ไม่สามารถโหลด Dashboard ได้"); } finally { setLoading(false); setRefreshing(false); } };
  useEffect(() => { void load(); }, []);
  const years = useMemo(() => [...new Set((data?.occurrences ?? []).map(x => new Date(x.start_at).getFullYear()))].filter(Number.isFinite).sort((a, b) => b - a), [data]);
  const months = useMemo(() => [...new Set((data?.occurrences ?? []).map(x => x.start_at.slice(0, 7)))].sort().reverse(), [data]);
  const quarters = useMemo(() => [...new Set((data?.occurrences ?? []).map(x => { const d = new Date(x.start_at); return `${d.getFullYear()}-Q${Math.floor(d.getMonth() / 3) + 1}`; }))].sort().reverse(), [data]);
  const occurrencePool = useMemo(() => (data?.occurrences ?? []).filter(x => !["cancelled", "archived"].includes(x.status) && matchesDate(x.start_at, period, year, quarter, month, from, to)), [data, period, year, quarter, month, from, to]);
  const activities = useMemo(() => (data?.activities ?? []).filter(a => occurrencePool.some(o => o.activity_id === a.id)), [data, occurrencePool]);
  const activityIds = useMemo(() => new Set((activity === "ALL" ? activities : activities.filter(a => a.id === activity)).map(a => a.id)), [activities, activity]);
  const selectedActivity = activity === "ALL" ? undefined : data?.activities.find(a => a.id === activity);
  useEffect(() => { if (activity !== "ALL" && !activityIds.has(activity)) setActivity("ALL"); }, [activity, activityIds]);
  const occurrences = useMemo(() => occurrencePool.filter(o => activityIds.has(o.activity_id)), [occurrencePool, activityIds]);
  const responses = useMemo(() => { const ids = new Set(occurrences.map(o => o.id)); return (data?.responses ?? []).filter(r => r.occurrence_id ? ids.has(r.occurrence_id) : activityIds.has(r.activity_id)); }, [data, occurrences, activityIds]);
  const participants = occurrences.reduce((s, o) => s + Math.max(0, Number(o.participant_count || 0)), 0); const responseCount = responses.length; const pending = Math.max(0, participants - responseCount); const responseRate = participants ? responseCount / participants * 100 : null;
  const questionScores = useMemo<ScoreItem[]>(() => ALL_SCORE_FIELDS.flatMap(field => { const values = responses.map(r => score(r[field])).filter((x): x is number => x !== null); const value = average(values); return value === null ? [] : [{ field, label: SCORE_LABELS[field], value, respondentCount: values.length }]; }), [responses]);
  const scoreGroups = useMemo(() => SCORE_GROUPS.map(g => ({ ...g, items: g.fields.map(f => questionScores.find(x => x.field === f)).filter((x): x is ScoreItem => Boolean(x)) })).filter(g => g.items.length), [questionScores]);
  const overall = useMemo(() => average(responses.flatMap(r => ALL_SCORE_FIELDS.map(f => score(r[f])).filter((x): x is number => x !== null))), [responses]);
  const highest = [...questionScores].sort((a, b) => b.value - a.value)[0]; const lowest = [...questionScores].sort((a, b) => a.value - b.value)[0];
  const dimensionOptions = useMemo(() => [{ key: "age_group" as const, label: "ช่วงอายุ", available: responses.some(r => Boolean(r.age_group)) }, { key: "affiliation" as const, label: "ประเภทผู้ตอบ", available: responses.some(r => Boolean(r.affiliation)) }, { key: "organization" as const, label: "หน่วยงาน", available: responses.some(r => Boolean(r.participant_organization_id)) && Boolean(data?.organizations.length) }].filter(x => x.available), [responses, data]);
  useEffect(() => { if (dimensionOptions.length && !dimensionOptions.some(x => x.key === dimension)) setDimension(dimensionOptions[0].key); }, [dimensionOptions, dimension]);
  const respondentDistribution = useMemo(() => { const m = new Map<string, number>(); for (const r of responses) { const raw = dimension === "age_group" ? r.age_group : dimension === "affiliation" ? r.affiliation : data?.organizations.find(o => o.id === r.participant_organization_id)?.name; const v = raw?.trim(); if (v) m.set(v, (m.get(v) || 0) + 1); } return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([label, count], i) => ({ label, count, percentage: responseCount ? count / responseCount * 100 : 0, color: CHART_COLORS[i % CHART_COLORS.length] })); }, [responses, dimension, data, responseCount]);
  const scoreDistribution = useMemo(() => { const total = responses.reduce((s, r) => s + ALL_SCORE_FIELDS.filter(f => score(r[f]) !== null).length, 0); return [5, 4, 3, 2, 1].map(v => { const count = responses.reduce((s, r) => s + ALL_SCORE_FIELDS.filter(f => score(r[f]) === v).length, 0); return { value: v, count, percent: total ? count / total * 100 : 0 }; }); }, [responses]);
  const channelDistribution = useMemo(() => { const m = new Map<string, number>(); for (const r of responses as ResponseWithChannels[]) { const raw = r.channels?.trim(); if (!raw || raw === "-") continue; for (const p of new Set(raw.split(",").map(x => x.trim()).filter(Boolean))) { const u = p.toUpperCase(); const c = u.includes("FACEBOOK") ? "FACEBOOK" : u.includes("LINE") ? "LINE" : u.includes("WEBSITE") ? "WEBSITE" : "อื่นๆ"; m.set(c, (m.get(c) || 0) + 1); } } return ["FACEBOOK", "LINE", "WEBSITE", "อื่นๆ"].map(label => ({ label, count: m.get(label) || 0, color: CHANNEL_BRAND_COLORS[label] })).filter(x => x.count > 0); }, [responses]);
  const channelTotal = channelDistribution.reduce((s, x) => s + x.count, 0); const comments = useMemo(() => responses.map(r => r.feedback?.trim()).filter((x): x is string => Boolean(x)), [responses]);
  const photos = useMemo(() => { if (activity !== "ALL") { const media = (data?.activityMedia ?? []).filter(x => x.activity_id === activity).sort((a, b) => a.display_order - b.display_order).map(x => ({ id: x.id, image: x.public_url, title: x.caption || selectedActivity?.title || "กิจกรรม" })); return [...(selectedActivity?.featured_image ? [{ id: "featured", image: selectedActivity.featured_image, title: selectedActivity.title }] : []), ...media].slice(0, 12); } return (data?.activities ?? []).filter(x => x.featured_image).slice(0, 12).map(x => ({ id: x.id, image: x.featured_image as string, title: x.title })); }, [data, activity, selectedActivity]);
  const recentActivities = useMemo(() => { if (!data) return []; return data.activities.map(item => { const occurrence = occurrencePool.filter(o => o.activity_id === item.id).sort((a, b) => new Date(b.start_at).getTime() - new Date(a.start_at).getTime())[0]; return occurrence ? { item, occurrence } : null; }).filter((x): x is { item: AdminDashboardData["activities"][number]; occurrence: AdminDashboardData["occurrences"][number] } => Boolean(x)).sort((a, b) => new Date(b.occurrence.start_at).getTime() - new Date(a.occurrence.start_at).getTime()).slice(0, 6); }, [data, occurrencePool]);
  const level = overall === null ? "-" : overall >= 4.5 ? "ดีมาก" : overall >= 3.5 ? "ดี" : overall >= 2.5 ? "ปานกลาง" : "ควรปรับปรุง"; const title = selectedActivity?.title || "รายงานผลสัมฤทธิ์ทั้งหมด"; const heroImage = selectedActivity?.featured_image || photos[0]?.image || "/social-engagement-logo.png";
  const reportRows = useMemo<ReportRow[]>(() => { if (!data) return []; const occurrenceMap = new Map(data.occurrences.map(o => [o.id, o])); const activityMap = new Map(data.activities.map(a => [a.id, a])); const organizationMap = new Map((data.organizations ?? []).map(o => [o.id, o.name])); return responses.map((r, index) => { const occurrence = r.occurrence_id ? occurrenceMap.get(r.occurrence_id) : undefined; const activityId = r.activity_id || occurrence?.activity_id; const activityItem = activityId ? activityMap.get(activityId) : undefined; const scores = Object.fromEntries(ALL_SCORE_FIELDS.map(field => [field, score(r[field])?.toFixed(2) || ""])) as Record<ScoreField, string>; return { id: String(r.id || `${activityId || "row"}-${index}`), activity: activityItem?.title || "-", date: occurrence?.start_at || activityItem?.activity_date || "", submittedAt: r.submitted_at || "", ageGroup: r.age_group || "", affiliation: r.affiliation || "", organization: (r.participant_organization_id ? organizationMap.get(r.participant_organization_id) : "") || "", scores, feedback: r.feedback?.trim() || "", channels: (r as ResponseWithChannels).channels?.trim() || "" }; }).sort((a, b) => new Date(b.submittedAt || b.date).getTime() - new Date(a.submittedAt || a.date).getTime()); }, [data, responses]);
  const filteredReportRows = useMemo(() => { const q = reportSearch.trim().toLowerCase(); if (!q) return reportRows; return reportRows.filter(r => [r.id, r.activity, r.ageGroup, r.affiliation, r.organization, r.feedback, r.channels, ...ALL_SCORE_FIELDS.map(f => r.scores[f])].some(v => v.toLowerCase().includes(q))); }, [reportRows, reportSearch]);
  const resetFilters = () => { setActivity("ALL"); setPeriod("ALL"); setYear("ALL"); setQuarter(""); setMonth(""); setFrom(""); setTo(""); };
  const changePeriod = (v: Period) => { setPeriod(v); if (v !== "YEAR") setYear("ALL"); if (v !== "QUARTER") setQuarter(""); if (v !== "MONTH") setMonth(""); if (v !== "CUSTOM") { setFrom(""); setTo(""); } };
  const openGallery = (index: number) => { if (photos.length) { setGalleryIndex(Math.max(0, Math.min(index, photos.length - 1))); setGalleryOpen(true); } };
  const reportDetailRows = useMemo<ReportDetailRow[]>(() => filteredReportRows.flatMap(r => ALL_SCORE_FIELDS.map(field => ({
    respondentId: r.id,
    activity: r.activity,
    date: r.date,
    submittedAt: r.submittedAt,
    ageGroup: r.ageGroup,
    affiliation: r.affiliation,
    organization: r.organization,
    group: SCORE_GROUPS.find(g => g.fields.includes(field))?.title || "-",
    question: SCORE_LABELS[field],
    score: r.scores[field] || "",
    feedback: r.feedback,
    channels: r.channels,
  }))), [filteredReportRows]);

  const respondentDetailRows = useMemo(() => {
    return reportRows.map(row => {
      const scores = ALL_SCORE_FIELDS.map(field => score(row.scores[field])).filter((value): value is number => value !== null);
      return {
        id: row.id,
        activity: row.activity,
        date: row.date,
        submittedAt: row.submittedAt,
        ageGroup: row.ageGroup,
        affiliation: row.affiliation,
        organization: row.organization,
        averageScore: scores.length ? average(scores) : null,
        feedback: row.feedback,
        channels: row.channels,
      };
    });
  }, [reportRows]);

  const exportCSV = () => {
    const headers = ["รหัสผู้ตอบ", "กิจกรรม", "วันที่กิจกรรม", "วันที่ส่งแบบประเมิน", "ช่วงอายุ", "ประเภทผู้ตอบ", "หน่วยงาน", "หมวดคำถาม", "ข้อคำถาม", "คะแนน (1-5)", "ความคิดเห็น", "ช่องทางการรับรู้"];
    const rows = reportDetailRows.map(r => [r.respondentId, r.activity, formatDate(r.date), formatDateTime(r.submittedAt), r.ageGroup, r.affiliation, r.organization, r.group, r.question, r.score, r.feedback, r.channels]);
    const csv = "\uFEFF" + [headers, ...rows].map(row => row.map(csvCell).join(",")).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" }); const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = url; a.download = `Mahidol_Lampang_Survey_Respondent_Question_Report_${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };
  const printReport = () => {
    if (!selectedActivity) return;

    const printWindow = window.open("", "_blank", "width=1200,height=900");
    if (!printWindow) {
      window.print();
      return;
    }

    const generatedAt = formatDateTime(new Date().toISOString());
    const reportActivity = selectedActivity;
    const reportOccurrences = occurrences
      .filter(item => item.activity_id === reportActivity.id)
      .sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime());

    const dateLabels = [...new Set(reportOccurrences.map(item => formatDate(item.start_at)).filter(Boolean))];
    const locationLabels = [
      ...new Set(
        reportOccurrences
          .map(item => item.location_detail?.trim())
          .filter((value): value is string => Boolean(value)),
      ),
    ];
    const statusLabels: Record<string, string> = {
      completed: "เสร็จสิ้น",
      ongoing: "กำลังดำเนินงาน",
      scheduled: "กำหนดการ",
      draft: "ร่าง",
      cancelled: "ยกเลิก",
      archived: "เก็บถาวร",
      published: "เผยแพร่",
    };
    const statusValues = [
      ...new Set(
        reportOccurrences.map(item => statusLabels[item.status] || item.status).filter(Boolean),
      ),
    ];
    const reportDate = dateLabels.length === 1 ? dateLabels[0] : dateLabels.length > 1 ? "จัดหลายครั้ง" : formatDate(reportActivity.activity_date);
    const reportLocation = locationLabels.length === 1 ? locationLabels[0] : locationLabels.length > 1 ? locationLabels.join(" • ") : "-";
    const reportStatus = statusValues.length === 1 ? statusValues[0] : statusValues.length > 1 ? "หลายสถานะ" : (statusLabels[reportActivity.status] || reportActivity.status || "-");
    const reportSummary = reportActivity.summary?.trim() || "";
    const reportImpact = reportActivity.impact?.trim() || "";
    const reportActivityDetails = [
      { title: "สรุปกิจกรรม (Activity Summary)", value: reportSummary },
      { title: "วัตถุประสงค์ (Objectives)", value: reportActivity.objective?.trim() || "" },
      { title: "กระบวนการ / กิจกรรมที่ดำเนินการ (Process / Activities)", value: reportActivity.process?.trim() || "" },
      { title: "ผลลัพธ์ (Outcomes)", value: reportActivity.outcome?.trim() || "" },
      { title: "ผลกระทบ / ประโยชน์ (Impact / Benefits)", value: reportImpact },
    ];

    const groupSummary = scoreGroups
      .map(group => {
        const value = average(group.items.map(item => item.value));
        return value === null ? null : { title: group.title, value };
      })
      .filter((item): item is { title: string; value: number } => Boolean(item));

    const buildDistribution = (values: string[]) => {
      const counts = new Map<string, number>();
      values.forEach(value => {
        const normalized = value.trim();
        if (normalized) counts.set(normalized, (counts.get(normalized) || 0) + 1);
      });
      return [...counts.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "th"))
        .slice(0, 6)
        .map(([label, count]) => ({
          label,
          count,
          percentage: responseCount ? count / responseCount * 100 : 0,
        }));
    };

    const ageDistribution = buildDistribution(
      responses.map(response => response.age_group || "").filter(Boolean),
    );
    const affiliationDistribution = buildDistribution(
      responses.map(response => response.affiliation || "").filter(Boolean),
    );

    const commentCounts = new Map<string, number>();
    comments.forEach(comment => {
      const normalized = comment.trim();
      if (normalized) commentCounts.set(normalized, (commentCounts.get(normalized) || 0) + 1);
    });
    const topComments = [...commentCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    const photoItems = photos.filter(item => item.image).slice(0, 4);
    const respondentReferenceRows = includeRespondentDetails
      ? respondentDetailRows
          .map(
            row =>
              '<tr><td>' +
              printCell(row.id) +
              '</td><td>' +
              printCell(formatDate(row.date)) +
              '</td><td>' +
              printCell(formatDateTime(row.submittedAt)) +
              '</td><td>' +
              printCell(row.ageGroup) +
              '</td><td>' +
              printCell(row.affiliation) +
              '</td><td>' +
              printCell(row.organization) +
              '</td><td class="score">' +
              (row.averageScore === null ? '-' : row.averageScore.toFixed(2)) +
              '</td><td class="text">' +
              printCell(row.feedback) +
              '</td></tr>',
          )
          .join('')
      : '';

    const referenceBlock = includeReferenceData
      ? '<div class="section reference-section"><h2 class="section-title">6. ข้อมูลอ้างอิง</h2>' +
        '<div class="reference-grid">' +
        '<div><span>Activity ID</span><strong>' +
        printCell(reportActivity.id) +
        '</strong></div>' +
        '<div><span>จำนวนครั้งที่จัด</span><strong>' +
        formatNumber(reportOccurrences.length) +
        ' ครั้ง</strong></div>' +
        '<div><span>ผู้ตอบแบบประเมิน</span><strong>' +
        formatNumber(responseCount) +
        ' คน</strong></div>' +
        '<div><span>ภาพประกอบ</span><strong>' +
        formatNumber(photoItems.length) +
        ' ภาพ</strong></div>' +
        '</div>' +
        '<p class="reference-note">' +
        (includeRespondentDetails
          ? 'แนบข้อมูลรายบุคคลตามตัวเลือกที่ผู้จัดทำรายงานกำหนด'
          : 'รายงานฉบับนี้แนบเฉพาะข้อมูลอ้างอิงระดับกิจกรรม และไม่รวมข้อมูลรายบุคคล') +
        '</p></div>' +
        (includeRespondentDetails
          ? '<div class="section reference-section"><h2 class="section-title">ภาคผนวก: ข้อมูลรายบุคคล</h2><p class="reference-note">จำนวน ' +
            formatNumber(respondentDetailRows.length) +
            ' คน • แสดงข้อมูลตามกิจกรรมที่เลือก</p><table><thead><tr><th>รหัสผู้ตอบ</th><th>วันที่กิจกรรม</th><th>วันที่ส่ง</th><th>ช่วงอายุ</th><th>ประเภทผู้ตอบ</th><th>หน่วยงาน</th><th class="score">คะแนนเฉลี่ย</th><th>ความคิดเห็น</th></tr></thead><tbody>' +
            (respondentReferenceRows || '<tr><td colspan="8">ไม่พบข้อมูลรายบุคคล</td></tr>') +
            '</tbody></table></div>'
          : '')
      : '';


    const logoUrl = new URL("/social-engagement-logo.png", window.location.origin).href;

    const ratingRows = groupSummary
      .map(
        group =>
          '<div class="rating-row">' +
          '<div class="rating-head"><span>' +
          printCell(group.title) +
          '</span><strong>' +
          group.value.toFixed(2) +
          ' / 5.00</strong></div>' +
          '<div class="bar-track"><div class="bar-fill" style="width:' +
          Math.min(100, group.value / 5 * 100).toFixed(1) +
          '%"></div></div>' +
          '</div>',
      )
      .join("");

    const detailedScoreRows = scoreGroups
      .map(group => {
        const items = group.items.length
          ? group.items
              .map(
                item =>
                  '<div class="detail-score-row"><div class="detail-score-head"><span>' +
                  printCell(item.label) +
                  '</span><strong>' +
                  item.value.toFixed(2) +
                  '</strong></div><div class="bar-track"><div class="bar-fill" style="width:' +
                  Math.min(100, item.value / 5 * 100).toFixed(1) +
                  '%"></div></div><small>ผู้ตอบ ' +
                  formatNumber(item.respondentCount) +
                  ' คน</small></div>',
              )
              .join("")
          : '<div class="empty">ไม่พบข้อมูล</div>';
        const groupValue = average(group.items.map(item => item.value));
        return '<div class="score-group-card"><div class="score-group-title"><span>' +
          printCell(group.title) +
          '</span><strong>' +
          (groupValue === null ? "-" : groupValue.toFixed(2) + " / 5") +
          '</strong></div>' +
          items +
          '</div>';
      })
      .join("");

    const scoreDistributionRows = scoreDistribution
      .map(
        item =>
          '<div class="dist-row"><span>' +
          item.value +
          ' คะแนน</span><div class="dist-track"><div class="dist-fill" style="width:' +
          item.percent.toFixed(1) +
          '%"></div></div><strong>' +
          item.percent.toFixed(0) +
          '%</strong></div>',
      )
      .join("");

    const donutMarkup = (items: { label: string; count: number; percentage: number }[], centerLabel: string, centerValue: string) => {
      const palette = ["#123B6D", "#C9A227", "#2F7D4A", "#9CA3AF", "#6B7280", "#D1D5DB"];
      let cumulative = 0;
      const circles = items.map((item, index) => {
        if (item.percentage <= 0) return "";
        const offset = -cumulative;
        cumulative += item.percentage;
        return '<circle cx="18" cy="18" r="15.9155" fill="none" stroke="' +
          palette[index % palette.length] +
          '" stroke-width="4" stroke-dasharray="' +
          item.percentage.toFixed(1) +
          ' 100" stroke-dashoffset="' +
          offset.toFixed(1) +
          '"></circle>';
      }).join("");
      const legend = items.length
        ? items.map((item, index) =>
            '<div class="donut-legend-row"><span class="donut-legend-label"><i style="background:' +
            palette[index % palette.length] +
            '"></i>' + printCell(item.label) +
            '</span><strong>' + formatNumber(item.count) +
            ' คน <small>(' + item.percentage.toFixed(0) + '%)</small></strong></div>'
          ).join("")
        : '<div class="empty">ไม่พบข้อมูล</div>';
      return '<div class="donut-panel"><div class="donut-wrap"><svg viewBox="0 0 36 36" class="report-donut" aria-hidden="true"><circle cx="18" cy="18" r="15.9155" fill="none" stroke="#E5E7EB" stroke-width="4"></circle><g transform="rotate(-90 18 18)">' +
        circles +
        '</g></svg><div class="donut-center"><strong>' + printCell(centerValue) +
        '</strong><span>' + printCell(centerLabel) + '</span></div></div><div class="donut-legend">' +
        legend +
        '</div></div>';
    };

    const ageRows = ageDistribution.map(item => ({
      label: item.label,
      count: item.count,
      percentage: item.percentage,
    }));

    const affiliationRows = affiliationDistribution.map(item => ({
      label: item.label,
      count: item.count,
      percentage: item.percentage,
    }));

    const photoRows = photoItems.length
      ? photoItems
          .map(
            (photo, index) =>
              '<figure class="photo-card"><img src="' +
              printCell(photo.image) +
              '" alt="รูปภาพที่ ' +
              (index + 1) +
              '"><figcaption>รูปภาพที่ ' +
              (index + 1) +
              '</figcaption></figure>',
          )
          .join("")
      : '<div class="photo-empty">ไม่มีภาพประกอบกิจกรรม</div>';

    const filterNote =
      period === "ALL"
        ? ""
        : '<div class="filter-note">ตัวกรองช่วงเวลา: ' +
          printCell(
            period === "YEAR"
              ? "ปี " + (year === "ALL" ? "ทั้งหมด" : Number(year) + 543)
              : period === "QUARTER"
                ? "ไตรมาส " + (quarter || "ทั้งหมด")
                : period === "MONTH"
                  ? "เดือน " + (month || "ทั้งหมด")
                  : (from || "-") + " ถึง " + (to || "-"),
          ) +
          "</div>";

    printWindow.document.write(
      '<!doctype html><html lang="th"><head><meta charset="utf-8"><title>รายงานผลการดำเนินงานและแบบประเมินความพึงพอใจ</title>' +
        '<style>' +
        '@page{size:A4 portrait;margin:5mm 6mm 6mm}' +
        '*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}' +
        'html,body,.report,.report *{font-family:"TH Sarabun New","TH Sarabun New PSK",THSarabunNew,sans-serif!important}.report *{border-color:#111!important}' +
        'body{margin:0;background:#fff;color:#111;font-size:12px;line-height:1.12}' +
        '.report{width:100%;max-width:none;min-height:286mm;display:flex;flex-direction:column;padding-bottom:10mm}.header{display:grid;grid-template-columns:minmax(220px,1fr) minmax(360px,1.35fr);gap:10px;align-items:center;padding:2px 0 5px;border-bottom:3px solid #123B6D}' +
        '.header-brand{display:flex;align-items:center;gap:7px;min-width:0}.logo{width:54px;height:54px;object-fit:contain;flex:0 0 auto}.brand-copy{text-align:left}.eyebrow{font-size:14px;font-weight:800;line-height:1.05;color:#111}.brand-sub{font-size:11px;font-weight:600;line-height:1.15;color:#333;margin-top:2px}.header-copy{text-align:right}.report-title{font-size:19px;line-height:1.08;font-weight:800;margin:0}.project-title{font-size:11px;font-weight:600;line-height:1.15;margin-top:4px}.org{display:none}' +
        '.section{margin-top:3px}.activity-photo-panel{margin-top:7px}.activity-photo-panel .photo-grid-report{grid-template-columns:repeat(2,1fr)}.section-title{font-size:14px;line-height:1.05;font-weight:800;margin:0 0 3px;padding:3px 7px;background:#123B6D;color:#fff;border-left:4px solid #C9A227;border-bottom:0}.meta-line{font-size:11px;margin:0 0 3px;color:#222}.meta-line span{display:inline-block;margin-right:16px}.meta-line strong{font-weight:800}' +
        '.kpis{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid #C9A227;border-top:3px solid #123B6D}.kpi{padding:3px 5px;text-align:center;border-right:1px solid #aaa;background:#fff}.kpi:last-child{border-right:0}.kpi-label{font-size:10px;color:#444}.kpi-value{font-size:16px;font-weight:800;line-height:1.05;color:#123B6D}.kpi-unit{font-size:10px;font-weight:500}' +
        '.narratives{display:grid;grid-template-columns:1fr 1fr;gap:3px;margin-top:3px}.narrative{border:1px solid #C7D5E5;border-left:3px solid #2F7D4A;padding:3px 6px;background:#F7FBF8}.narrative strong{font-size:11px}.narrative p{font-size:10.5px;margin:1px 0 0;line-height:1.14;white-space:pre-line}.activity-details{margin-top:4px;border:1px solid #111;padding:4px;background:#fff}.activity-details-title{font-size:11.5px;font-weight:800;color:#123B6D;margin-bottom:4px;padding-bottom:3px;border-bottom:1px solid #111}.activity-details-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:5px}.activity-detail-card{border:1px solid #111;border-left:2px solid #123B6D;padding:3px 5px;background:#FAFAFA;min-height:0}.activity-detail-card strong{font-size:10.5px;color:#123B6D}.activity-detail-card p{font-size:10px;margin:1px 0 0;line-height:1.12;white-space:pre-line}.activity-detail-card:last-child{grid-column:1 / -1}.filter-note{font-size:9px;color:#555;margin-top:3px}' +
        '.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:8px}.panel{border:1px solid #aaa;padding:6px}.evaluation-overview{display:grid;grid-template-columns:90px 1.7fr 1fr;gap:5px;border:1px solid #aaa;padding:4px}.evaluation-score{display:flex;flex-direction:column;align-items:center;justify-content:center;border-right:1px solid #ccc;padding-right:8px}.evaluation-score span{font-size:10px;color:#555}.evaluation-score strong{font-size:24px;line-height:1;font-weight:800}.evaluation-score small{font-size:10px}.evaluation-note>strong,.evaluation-distribution>strong{font-size:10px;display:block;margin-bottom:3px}.rating-compact .rating-row{margin-bottom:2px}.rating-compact .rating-head{font-size:10px}.rating-compact .rating-head strong{font-size:10px}.rating-compact .bar-track{height:4px}.dist-row{display:grid;grid-template-columns:44px 1fr 25px;gap:4px;align-items:center;font-size:9.5px;margin-bottom:2px}.dist-track{height:4px;background:#e8e8e8}.dist-fill{height:100%;background:#123B6D}.dist-row strong{text-align:right}.score-detail-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;margin-top:4px}.score-group-card{border:1px solid #C7D5E5;border-top:2px solid #2F7D4A;padding:4px;background:#FBFDFC}.score-group-title{display:flex;justify-content:space-between;gap:4px;border-bottom:1px solid #D7DCE2;padding-bottom:2px;margin-bottom:2px;font-size:11px;font-weight:800;color:#123B6D}.score-group-title strong{font-size:10px}.detail-score-row{margin-bottom:2px}.detail-score-head{display:flex;justify-content:space-between;font-size:9.5px;gap:5px}.detail-score-head strong{font-size:9.5px}.detail-score-row .bar-track{height:4px}.detail-score-row small{display:block;font-size:8px;color:#666;margin-top:1px}.rating-row{margin-bottom:6px}.rating-head{display:flex;justify-content:space-between;gap:6px;font-size:14px}.rating-head strong{font-size:14px}.bar-track{height:7px;background:#e5e5e5;margin-top:2px}.bar-fill{height:100%;background:#123B6D}.subhead{font-size:14px;font-weight:800;margin-bottom:2px}.stat-line{display:flex;justify-content:space-between;border-bottom:1px dotted #bbb;padding:2px 0;font-size:13px}.stat-line small{font-size:11px;color:#555}.empty{font-size:13px;color:#777;padding:4px 0}.chart-row{display:grid;grid-template-columns:72px 1fr 48px;align-items:center;gap:5px;margin-bottom:5px;font-size:12px}.chart-label{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.chart-track{height:9px;background:#e8e8e8;border-radius:2px;overflow:hidden}.chart-fill{height:100%;background:#222}.chart-value{text-align:right;font-weight:800}.mini-donut{display:grid;grid-template-columns:92px 1fr;gap:8px;align-items:center}.donut{width:82px;height:82px;border-radius:50%;background:conic-gradient(#222 0 42%,#777 42% 80%,#bbb 80% 100%);position:relative}.donut:after{content:"";position:absolute;inset:18px;border-radius:50%;background:#fff}.legend-item{display:flex;justify-content:space-between;gap:5px;border-bottom:1px dotted #bbb;padding:2px 0;font-size:12px} .respondent-donuts{display:grid;grid-template-columns:1fr 1fr;gap:4px}.donut-card{border:1px solid #B9C7D8;border-top:2px solid #C9A227;padding:4px;background:linear-gradient(135deg,#F4F8FD 0%,#FFFFFF 58%,#F1F8F3 100%)}.donut-card-title{font-size:11px;font-weight:800;color:#123B6D;margin-bottom:5px;border-left:3px solid #2F7D4A;padding-left:6px}.donut-panel{display:grid;grid-template-columns:86px 1fr;gap:5px;align-items:center}.donut-wrap{width:78px;height:78px;position:relative}.report-donut{width:78px;height:78px;display:block}.donut-center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}.donut-center strong{font-size:14px;line-height:1;font-weight:800;color:#123B6D}.donut-center span{font-size:8px;color:#555;margin-top:2px}.donut-legend{min-width:0}.donut-legend-row{display:flex;justify-content:space-between;align-items:center;gap:6px;border-bottom:1px dotted #C7CDD4;padding:2px 0;font-size:12px}.donut-legend-row:last-child{border-bottom:0}.donut-legend-label{display:flex;align-items:center;gap:5px;min-width:0}.donut-legend-label i{display:inline-block;width:8px;height:8px;border-radius:50%;flex:0 0 auto}.donut-legend-row strong{white-space:nowrap}.donut-legend-row small{font-size:10px;color:#666;font-weight:500}.photo-grid-report{display:grid;grid-template-columns:repeat(2,1fr);gap:3px}.photo-inline-title{margin-top:5px;padding-top:3px;border-top:2px solid #C9A227;font-size:14px;font-weight:800;color:#2F7D4A}.respondent-photo-section{background:linear-gradient(135deg,#F8FBFF 0%,#FFFFFF 55%,#F3FAF5 100%)}.photo-card img{height:50px}.comments-photos{display:grid;grid-template-columns:1fr 1.1fr;gap:8px}' +
        '.comments-photos{display:grid;grid-template-columns:1fr 1fr;gap:8px}.comment-item{display:grid;grid-template-columns:22px 1fr;gap:6px;padding:4px 0;border-bottom:1px solid #ddd}.comment-number{width:19px;height:19px;border:1px solid #333;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:11px}.comment-item p{margin:0;font-size:13px;line-height:1.3}.comment-item small{font-size:11px;color:#555}.photos{display:grid;grid-template-columns:1fr 1fr;gap:6px}.photo-card{margin:0}.photo-card img{width:100%;height:92px;object-fit:cover;border:1px solid #aaa;display:block}.photo-card figcaption{font-size:8px;margin-top:2px;text-align:center;color:#444}.photo-empty{height:92px;border:1px dashed #aaa;display:flex;align-items:center;justify-content:center;font-size:12px;color:#777}' +
        '.bottom-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.reference-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px}.reference-grid>div{border:1px solid #bbb;padding:4px 6px}.reference-grid span{display:block;font-size:11px;color:#555}.reference-grid strong{display:block;font-size:13px;word-break:break-word}.reference-note{font-size:12px;color:#555;margin:3px 0 0}.report table{width:100%;border-collapse:collapse;font-size:11px}.report table th,.report table td{border:1px solid #aaa;padding:3px 4px;vertical-align:top}.report table th{background:#eee;font-weight:800}.report table tbody tr:nth-child(even){background:#fafafa}.report table .score{text-align:right}.report table .text{white-space:pre-line}' +
        '.audit-table{width:100%;border-collapse:collapse;font-size:12px}.audit-table th,.audit-table td{border:1px solid #aaa;padding:3px 5px}.audit-table th{background:#eee}.audit-check{text-align:center!important;width:38px}.signature-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:8px}.signature-box{text-align:center;font-size:12px}.signature-line{height:17px;border-bottom:1px solid #333;margin:0 18px 2px}.seal-placeholder{display:inline-flex;width:40px;height:40px;border:1px solid #888;border-radius:50%;align-items:center;justify-content:center;font-size:8px;color:#666;margin-top:3px}.footer{margin-top:auto;padding-top:3px;border-top:1px solid #999;display:flex;justify-content:space-between;font-size:11px;color:#555}.avoid-break{break-inside:avoid;page-break-inside:avoid}@media print{html,body{width:auto;min-width:0;min-height:0;margin:0}.report{width:100%;max-width:none;min-height:0;padding-bottom:10mm}.section,.panel,.comments-photos,.grid-2,.bottom-grid{break-inside:auto;page-break-inside:auto}.photo-card{break-inside:avoid;page-break-inside:avoid}.footer{position:fixed;left:0;right:0;bottom:0;background:#fff;padding:2px 0;border-top:1px solid #111;z-index:10}}' +
        '</style></head><body><div class="report">' +
        '<header class="header"><div class="header-brand"><img class="logo" src="' +
        printCell(logoUrl) +
        '" alt="งานพันธกิจเพื่อสังคม"><div class="brand-copy"><div class="eyebrow">งานพันธกิจเพื่อสังคม</div><div class="brand-sub">คณะสิ่งแวดล้อมและทรัพยากรศาสตร์</div><div class="brand-sub">มหาวิทยาลัยมหิดล</div></div></div><div class="header-copy"><h1 class="report-title">รายงานผลการดำเนินงานและแบบประเมินความพึงพอใจ</h1><div class="project-title">' +
        printCell(reportActivity.title) +
        '</div></div></header>' +

        '<div class="section"><h2 class="section-title">ข้อมูลทั่วไปและสรุปผลการดำเนินงาน (General Information & Performance Summary)</h2><p class="meta-line"><span><strong>วันที่จัด:</strong> ' +
        printCell(reportDate) +
        '</span><span><strong>สถานที่:</strong> ' +
        printCell(reportLocation) +
        '</span><span><strong>สถานะ:</strong> ' +
        printCell(reportStatus) +
        '</span></p><div class="kpis"><div class="kpi"><div class="kpi-label">ผู้เข้าร่วม</div><div class="kpi-value">' +
        formatNumber(participants) +
        ' <span class="kpi-unit">คน</span></div></div><div class="kpi"><div class="kpi-label">ผู้ตอบประเมิน</div><div class="kpi-value">' +
        formatNumber(responseCount) +
        ' <span class="kpi-unit">คน</span></div></div><div class="kpi"><div class="kpi-label">อัตราตอบกลับ</div><div class="kpi-value">' +
        (responseRate === null ? "-" : Math.min(100, responseRate).toFixed(1) + "%") +
        '</div></div><div class="kpi"><div class="kpi-label">คะแนนเฉลี่ยรวม</div><div class="kpi-value">' +
        (overall === null ? "-" : overall.toFixed(2) + ' <span class="kpi-unit">/ 5.00</span>') +
        '</div></div></div><div class="activity-details"><div class="activity-details-title">รายละเอียดกิจกรรม (Activity Details)</div><div class="activity-details-grid">' +
        reportActivityDetails.map(item => '<div class="activity-detail-card"><strong>' + printCell(item.title) + '</strong><p>' + printCell(item.value || "-") + '</p></div>').join("") +
        '</div></div>' +
        filterNote +
        '</div>' +
        '<div class="section"><h2 class="section-title">ผลการประเมินความพึงพอใจ (Satisfaction Evaluation Results)</h2>' +
        '<div class="evaluation-overview"><div class="evaluation-score"><span>คะแนนเฉลี่ยรวม</span><strong>' +
        (overall === null ? "-" : overall.toFixed(2)) +
        '</strong><small>/ 5.00</small></div><div class="evaluation-note"><strong>ผลการประเมินรายด้าน (Evaluation by Category)</strong><div class="rating-compact">' +
        ratingRows +
        '</div></div><div class="evaluation-distribution"><strong>การกระจายคะแนน (Score Distribution)</strong>' +
        scoreDistributionRows +
        '</div></div>' +
        '<div class="score-detail-grid">' +
        detailedScoreRows +
        '</div>' +
        '<div class="section respondent-data-panel"><h2 class="section-title">ข้อมูลผู้ตอบแบบประเมิน (Respondent Profile)</h2><div class="respondent-donuts">' +
        '<div class="donut-card"><div class="donut-card-title">ช่วงอายุ (Age Distribution)</div>' +
        donutMarkup(ageRows, "ผู้ตอบ", formatNumber(responseCount) + " คน") +
        '</div>' +
        '<div class="donut-card"><div class="donut-card-title">ประเภทผู้ตอบ (Respondent Type)</div>' +
        donutMarkup(affiliationRows, "ผู้ตอบ", formatNumber(responseCount) + " คน") +
        '</div></div></div></div>' +

        '<div class="section activity-photo-panel"><h2 class="section-title">ภาพประกอบกิจกรรมหลัก (Activity Photos)</h2><div class="photos photo-grid-report">' +
        photoRows +
        '</div></div></div>' +

        '<footer class="footer"><span>งานพันธกิจเพื่อสังคม คณะสิ่งแวดล้อมและทรัพยากรศาสตร์</span><span>พิมพ์เมื่อ: ' +
        printCell(generatedAt) +
        ' • หน้า 1/1</span></footer></div></body></html>',
    );
    printWindow.document.close();
    printWindow.focus();
    window.setTimeout(() => {
      printWindow.print();
    }, 400);
  };
  if (loading) return <div className="grid min-h-[calc(100dvh-4rem)] place-items-center text-sm font-semibold text-slate-500">กำลังโหลดผลการดำเนินงาน...</div>;
  if (error) return <div className="grid min-h-[calc(100dvh-4rem)] place-items-center px-4"><div className="w-full max-w-md rounded-xl border border-rose-200 bg-rose-50 p-8 text-center"><p className="font-bold text-rose-800">ไม่สามารถโหลด Dashboard ได้</p><p className="mt-2 text-sm text-rose-600">{error}</p><button type="button" onClick={() => void load()} className="mt-4 rounded-lg bg-sky-600 px-4 py-2 text-sm font-bold text-white">ลองใหม่</button></div></div>;
  return <div className="min-h-[calc(100dvh-4rem)] bg-[#ffffff] text-slate-800 antialiased"><main className="mx-auto w-full max-w-[1440px] space-y-2.5 p-4 pb-6">
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><div className="flex items-center gap-2.5"><h1 className="text-[20px] font-bold tracking-tight text-slate-900">รายงานผลสัมฤทธิ์และแบบประเมินความพึงพอใจ (Performance & Satisfaction Dashboard)</h1><span className="rounded-full border border-sky-200 bg-sky-100 px-2.5 py-0.5 text-[11px] font-medium text-sky-700">Executive Dashboard</span></div><p className="mt-0.5 text-[12px] text-slate-500">งานพันธกิจเพื่อสังคม คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล</p></div><div className="flex shrink-0 items-center gap-2"><button type="button" onClick={() => void load(true)} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-xs hover:bg-slate-50" title="รีเฟรชข้อมูล"><RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /></button><div className="hidden text-right text-[10px] text-slate-400 sm:block"><div>อัปเดตล่าสุด</div><div className="font-medium text-slate-600">{loadedAt ? formatDateTime(loadedAt) : "-"}</div></div><button type="button" onClick={() => setReportsOpen(true)} className="flex items-center gap-1.5 rounded-lg border border-sky-600 bg-white px-3.5 py-1.5 text-[12px] font-medium text-sky-700 shadow-xs transition hover:bg-sky-50"><span>รายงานรายกิจกรรม</span><ExternalLink className="h-4 w-4" /></button></div></div>
    <section className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs"><div className="mb-3 flex items-center justify-between"><div className="flex items-center gap-2"><Filter className="h-4 w-4 text-sky-600" /><h2 className="text-[14px] font-bold text-slate-900">ตัวกรองรายงาน (Report Filters)</h2></div><button type="button" onClick={resetFilters} className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800"><RotateCcw className="h-3.5 w-3.5" />ล้างตัวกรอง</button></div><div className="grid grid-cols-1 gap-2.5 text-[12px] sm:grid-cols-2 lg:grid-cols-5"><label className="flex flex-col gap-1"><span className="text-[11px] font-medium text-slate-500">กิจกรรม (Activity)</span><div className="relative"><select value={activity} onChange={e => setActivity(e.target.value)} className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 pr-8 font-medium text-slate-800 outline-none transition focus:border-sky-600 focus:ring-1 focus:ring-sky-600"><option value="ALL">ทุกกิจกรรม</option>{activities.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}</select><ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /></div></label><label className="flex flex-col gap-1"><span className="text-[11px] font-medium text-slate-500">ช่วงเวลา (Period)</span><div className="relative"><select value={period} onChange={e => changePeriod(e.target.value as Period)} className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 pr-8 font-medium text-slate-800 outline-none focus:border-sky-600"><option value="ALL">ทั้งหมด</option><option value="YEAR">รายปี</option><option value="QUARTER">รายไตรมาส</option><option value="MONTH">รายเดือน</option><option value="CUSTOM">กำหนดช่วงวันที่</option></select><ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /></div></label><label className="flex flex-col gap-1"><span className="text-[11px] font-medium text-slate-500">ปี</span><select value={year} disabled={period !== "YEAR"} onChange={e => setYear(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-medium text-slate-800 disabled:opacity-50"><option value="ALL">ทุกปี</option>{years.map(y => <option key={y} value={y}>{y + 543}</option>)}</select></label><label className="flex flex-col gap-1"><span className="text-[11px] font-medium text-slate-500">ไตรมาส / เดือน</span><select value={period === "QUARTER" ? quarter : month} onChange={e => period === "QUARTER" ? setQuarter(e.target.value) : setMonth(e.target.value)} disabled={period !== "QUARTER" && period !== "MONTH"} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-medium text-slate-800 disabled:opacity-50"><option value="">เลือกช่วง</option>{(period === "QUARTER" ? quarters : months).map(x => <option key={x} value={x}>{period === "QUARTER" ? `${x.split("-")[0]} (Q${x.slice(-1)})` : new Intl.DateTimeFormat("th-TH", { month: "long", year: "numeric" }).format(new Date(`${x}-01`))}</option>)}</select></label><div className="grid grid-cols-2 gap-2"><label className="flex flex-col gap-1"><span className="text-[11px] font-medium text-slate-500">ตั้งแต่</span><input type="date" value={from} disabled={period !== "CUSTOM"} onChange={e => setFrom(e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 px-2 text-[11px] disabled:opacity-50" /></label><label className="flex flex-col gap-1"><span className="text-[11px] font-medium text-slate-500">ถึง</span><input type="date" value={to} disabled={period !== "CUSTOM"} onChange={e => setTo(e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 px-2 text-[11px] disabled:opacity-50" /></label></div></div></section>
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs"><div className="flex flex-col md:flex-row"><button type="button" onClick={() => heroImage && openGallery(0)} className="group h-40 w-full shrink-0 overflow-hidden bg-slate-100 md:h-32 md:w-56">{heroImage ? <img src={heroImage} alt={title} className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" /> : <div className="grid h-full place-items-center text-slate-300"><ImageIcon className="h-8 w-8" /></div>}</button><div className="min-w-0 flex-1 p-3.5"><div className="flex flex-wrap items-center gap-1 text-[12px] font-semibold tracking-wide text-sky-700"><span>{selectedActivity?.category || "กิจกรรม"}</span><span className="text-slate-300">|</span><span className="font-normal text-slate-500">งานพันธกิจเพื่อสังคม คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล</span></div><h2 className="mt-1 truncate text-[18px] font-bold tracking-tight text-slate-900">{title}</h2><div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[12px] text-slate-600"><span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4 text-slate-400" />วันที่จัดกิจกรรม: <strong className="font-semibold text-slate-800">{selectedActivity ? formatDate(selectedActivity.activity_date) : "รวมตามตัวกรอง"}</strong></span><span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4 text-slate-400" />ผู้เข้าร่วม: <strong className="font-semibold text-slate-800">{formatNumber(participants)} คน</strong></span></div></div><div className="flex min-w-[180px] flex-col justify-center border-t border-slate-100 bg-slate-50 p-3.5 md:border-l md:border-t-0"><p className="text-[11px] text-slate-500">ภาพรวมคะแนน</p><div className="mt-0.5 flex items-baseline gap-2"><span className="text-2xl font-bold text-slate-900">{overall === null ? "-" : overall.toFixed(2)}</span><span className="text-[11px] text-slate-400">/ 5.00</span></div><span className="mt-0.5 text-[11px] font-medium text-sky-600">ระดับ {level}</span></div></div></section>
    {selectedActivity && (
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-4 py-2.5">
          <div>
            <h2 className="text-[14px] font-bold text-slate-900">รายละเอียดกิจกรรม (Activity Details)</h2>
            <p className="mt-0.5 text-[10px] text-slate-400">ข้อมูลจากกิจกรรมที่เลือกในตัวกรอง</p>
          </div>
          <span className="rounded-full bg-sky-50 px-2 py-1 text-[10px] font-semibold text-sky-700">กิจกรรมที่เลือก</span>
        </div>
        <div className="grid gap-2.5 p-3 md:grid-cols-2">
          {[
            ["สรุปกิจกรรม (Activity Summary)", selectedActivity.summary],
            ["วัตถุประสงค์ (Objectives)", selectedActivity.objective],
            ["กระบวนการ / กิจกรรมที่ดำเนินการ (Process / Activities)", selectedActivity.process],
            ["ผลลัพธ์ (Outcomes)", selectedActivity.outcome],
            ["ผลกระทบ / ประโยชน์ (Impact / Benefits)", selectedActivity.impact],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2.5">
              <p className="text-[10px] font-bold text-sky-700">{label}</p>
              <p className="mt-1 whitespace-pre-line text-[11px] leading-5 text-slate-700">{value?.trim() || "ยังไม่มีข้อมูล"}</p>
            </div>
          ))}
        </div>
      </section>
    )}
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5"><KpiCard icon={<Users className="h-5 w-5" />} label="ผู้เข้าร่วมกิจกรรม" value={formatNumber(participants)} suffix="คน" onClick={() => setKpiMetric("ผู้เข้าร่วมกิจกรรม")} iconClass="bg-sky-50 text-sky-600" /><KpiCard icon={<CheckCircle2 className="h-5 w-5" />} label="ผู้ตอบแบบประเมิน" value={formatNumber(responseCount)} suffix="คน" onClick={() => setKpiMetric("ผู้ตอบแบบประเมิน")} iconClass="bg-indigo-50 text-indigo-600" /><KpiCard icon={<Users className="h-5 w-5" />} label="ยังไม่ได้ตอบ" value={formatNumber(pending)} suffix="คน" onClick={() => setKpiMetric("ยังไม่ได้ตอบ")} iconClass="bg-purple-50 text-purple-600" /><KpiCard icon={<ActivityIcon className="h-5 w-5" />} label="อัตราการตอบกลับ" value={responseRate === null ? "-" : Math.min(100, responseRate).toFixed(1)} suffix="%" onClick={() => setKpiMetric("อัตราการตอบกลับ")} iconClass="bg-teal-50 text-teal-600" /><KpiCard icon={<Star className="h-5 w-5" />} label="คะแนนประเมินเฉลี่ย" value={overall === null ? "-" : overall.toFixed(2)} suffix="/ 5.00" onClick={() => setKpiMetric("คะแนนประเมินเฉลี่ย")} iconClass="bg-amber-50 text-amber-500" /></div>
    {/* AI Insights Panel */}
    <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-12"><div className="space-y-2.5 lg:col-span-4"><OverallGauge scoreValue={overall} respondents={responseCount} participants={participants} responseRate={responseRate} level={level} /><Card title="ข้อมูลทั่วไปของผู้ตอบแบบสอบถาม (Respondent Profile)" right={<div className="relative"><select value={dimension} onChange={e => setDimension(e.target.value as Dimension)} className="h-7 appearance-none rounded-md border border-slate-200 bg-slate-50 py-1 pl-2 pr-6 text-[11px] font-medium text-slate-700 outline-none"><option value="age_group">ช่วงอายุ</option>{dimensionOptions.filter(x => x.key !== "age_group").map(x => <option key={x.key} value={x.key}>{x.label}</option>)}</select><ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" /></div>}><div className="flex items-center gap-4 p-3.5"><DonutChart items={respondentDistribution} centerLabel={dimension === "age_group" ? "ช่วงอายุ" : dimensionOptions.find(x => x.key === dimension)?.label || "ผู้ตอบ"} centerValue={`${responseCount} คน`} size={112} /><div className="flex-1 space-y-1.5 text-[11px]">{respondentDistribution.length ? respondentDistribution.map(item => <div key={item.label} className="flex items-center justify-between gap-2"><div className="flex min-w-0 items-center gap-1.5"><span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: item.color }} /><span className="truncate text-slate-600">{item.label}</span></div><span className="shrink-0 font-medium text-slate-700">{item.count} คน <span className="text-[10px] text-slate-400">({item.percentage.toFixed(1)}%)</span></span></div>) : <p className="py-5 text-center text-slate-400">ไม่มีข้อมูล</p>}</div></div></Card><Card title="ภาพกิจกรรมล่าสุด (Recent Activity Photos)" right={<button type="button" onClick={() => openGallery(0)} className="text-[11px] font-medium text-sky-600 hover:text-sky-700">ดูทั้งหมด</button>}><div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3">{photos.slice(0, 6).map((p, i) => <button key={p.id} type="button" onClick={() => openGallery(i)} className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100"><img src={p.image} alt={p.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" /></button>)}{!photos.length && <p className="col-span-full py-6 text-center text-[11px] text-slate-400">ไม่มีภาพกิจกรรม</p>}</div></Card><Card title="กิจกรรมล่าสุด (Recent Activities)"><div className="space-y-2 p-3">{recentActivities.map(({ item, occurrence }) => <div key={item.id} className="group rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 transition hover:border-sky-100 hover:bg-sky-50/40"><div className="flex items-center gap-2.5"><button type="button" onClick={() => setActivity(item.id)} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-sky-600 shadow-xs ring-1 ring-slate-100 transition group-hover:ring-sky-100" title="เลือกกิจกรรม"><Calendar className="h-4 w-4" /></button><div className="min-w-0 flex-1"><button type="button" onClick={() => setActivity(item.id)} className="block max-w-full truncate text-left text-[11px] font-bold text-slate-800 hover:text-sky-700">{item.title}</button><p className="mt-0.5 text-[10px] text-slate-400">{formatDate(occurrence.start_at)}</p></div></div></div>)}{!recentActivities.length && <div className="rounded-xl border border-dashed border-slate-200 py-7 text-center text-[11px] text-slate-400">ไม่มีกิจกรรมในช่วงที่เลือก</div>}</div></Card></div><div className="space-y-2.5 lg:col-span-5">{scoreGroups.map((g, groupIndex) => <Card key={g.key} title={g.title} right={<span className="text-[11px] font-medium text-slate-400">สเกล 1–5 คะแนน</span>}><div className="space-y-3.5 p-3.5">{g.items.map((item, idx) => <div key={item.field}><div className="mb-1 flex items-center justify-between gap-2"><span className="truncate pr-2 text-[12px] font-medium text-slate-700">{item.label}</span><span className="shrink-0 text-[12px] font-bold text-slate-900">{item.value.toFixed(2)} <span className="text-[11px] font-normal text-slate-400">/ 5.00</span></span></div><div className="h-2 w-full overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${item.value / 5 * 100}%`, backgroundColor: CHART_COLORS[(groupIndex * 2 + idx) % CHART_COLORS.length] }} /></div></div>)}</div></Card>)}<Card title="ช่องทางการรับรู้กิจกรรม (Activity Awareness Channels)" right={<span className="text-[11px] font-medium text-slate-400">{channelTotal} การเลือก</span>}><div className="space-y-3.5 p-3.5">{channelDistribution.length ? channelDistribution.map(c => { const pct = channelTotal ? c.count / channelTotal * 100 : 0; return <div key={c.label} className="flex items-center gap-2.5 text-[11px]"><ChannelBrandIcon channel={c.label} /><span className="w-16 shrink-0 truncate font-medium text-slate-600">{c.label}</span><div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: c.color }} /></div><span className="w-20 text-right font-medium text-slate-700">{c.count} ({pct.toFixed(1)}%)</span></div>; }) : <p className="py-5 text-center text-[11px] text-slate-400">ไม่มีข้อมูลช่องทางการรับรู้</p>}</div></Card></div><div className="space-y-2.5 lg:col-span-3"><Card title="การกระจายคะแนน (Score Distribution)"><div className="space-y-3 p-3.5">{scoreDistribution.map((x, i) => <div key={x.value} className="flex items-center gap-2 text-[11px]"><span className="w-8 shrink-0 font-bold text-slate-700">{x.value} ★</span><div className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full transition-all" style={{ width: `${x.percent}%`, backgroundColor: CHART_COLORS[i] }} /></div><span className="w-20 shrink-0 text-right font-medium text-slate-700">{x.count} ({x.percent.toFixed(1)}%)</span></div>)}</div></Card><Card title="ประเด็นสำคัญ (Key Findings)"><div className="space-y-2.5 p-3.5"><div className="rounded-lg bg-emerald-50 p-3"><p className="text-[10px] font-bold text-emerald-700">คะแนนสูงสุด</p><p className="mt-1 text-[12px] font-bold text-slate-800">{highest?.label || "-"}</p><p className="mt-1 text-lg font-black text-emerald-700">{highest?.value.toFixed(2) || "-"} / 5.00</p></div><div className="rounded-lg bg-amber-50 p-3"><p className="text-[10px] font-bold text-amber-700">ประเด็นที่ควรติดตาม</p><p className="mt-1 text-[12px] font-bold text-slate-800">{lowest?.label || "-"}</p><p className="mt-1 text-lg font-black text-amber-700">{lowest?.value.toFixed(2) || "-"} / 5.00</p></div></div></Card><Card title="ความคิดเห็นจากผู้ตอบ (Respondent Feedback)" right={<button type="button" onClick={() => setCommentsOpen(true)} className="text-[11px] font-medium text-sky-600">ดูทั้งหมด ({comments.length})</button>}><div className="divide-y divide-slate-100">{comments.slice(0, 4).map((c, i) => <div key={`${c}-${i}`} className="p-3.5"><p className="text-[11px] leading-5 text-slate-700">“{c}”</p><p className="mt-1.5 text-[10px] text-slate-400">ผู้ตอบแบบประเมิน</p></div>)}{!comments.length && <p className="py-8 text-center text-[11px] text-slate-400">ไม่มีความคิดเห็น</p>}</div></Card></div></div></main>
    <div>
    <ActivityReportModal
      open={reportsOpen}
      onClose={() => {
        setReportsOpen(false);
        setReportSearch("");
        setIncludeReferenceData(false);
        setIncludeRespondentDetails(false);
      }}
      activity={activity}
      onActivityChange={setActivity}
      activities={activities}
      selectedActivity={selectedActivity}
      reportSearch={reportSearch}
      onReportSearchChange={setReportSearch}
      onPrint={printReport}
      onExportCSV={exportCSV}
      reportDetailRows={reportDetailRows}
      filteredReportRows={filteredReportRows}
      includeReferenceData={includeReferenceData}
      onIncludeReferenceDataChange={value => {
        setIncludeReferenceData(value);
        if (!value) setIncludeRespondentDetails(false);
      }}
      includeRespondentDetails={includeRespondentDetails}
      onIncludeRespondentDetailsChange={setIncludeRespondentDetails}
    />
    {commentsOpen && <Modal title={`ความคิดเห็นและข้อเสนอแนะทั้งหมด • ${comments.length} ความคิดเห็น`} onClose={() => setCommentsOpen(false)}><CommentsContent comments={comments} /></Modal>}
    {kpiMetric && <Modal title={`รายละเอียดตัวชี้วัด: ${kpiMetric}`} onClose={() => setKpiMetric(null)}><div className="space-y-4 p-5"><div className="rounded-xl border border-sky-100 bg-sky-50 p-4"><p className="text-[11px] font-bold text-sky-700">กิจกรรมปัจจุบัน</p><p className="mt-1 text-sm font-black text-slate-900">{title}</p><p className="mt-1 text-xs text-slate-500">{selectedActivity?.category || "รวมตามตัวกรอง"}</p></div><div className="grid grid-cols-2 gap-3"><div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center"><p className="text-[11px] text-slate-400">ผู้เข้าร่วมทั้งหมด</p><p className="mt-1 text-xl font-black">{formatNumber(participants)} คน</p></div><div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center"><p className="text-[11px] text-slate-400">ผู้ตอบแบบประเมิน</p><p className="mt-1 text-xl font-black text-emerald-700">{formatNumber(responseCount)} คน</p></div></div><div className="space-y-2 text-xs text-slate-600"><div className="flex justify-between border-b border-slate-100 py-2"><span>อัตราตอบกลับ</span><b>{responseRate === null ? "-" : `${Math.min(100, responseRate).toFixed(1)}%`}</b></div><div className="flex justify-between border-b border-slate-100 py-2"><span>คะแนนเฉลี่ย</span><b>{overall === null ? "-" : `${overall.toFixed(2)} / 5.00`}</b></div><div className="flex justify-between py-2"><span>ยังไม่ได้ตอบ</span><b>{formatNumber(pending)} คน</b></div></div></div></Modal>}
    <ActivityGalleryModal open={galleryOpen} photos={photos} index={galleryIndex} title={title} onClose={() => setGalleryOpen(false)} onIndexChange={setGalleryIndex} />
    </div>
  </div>
}
function CommentsContent({ comments }: { comments: string[] }) { const [search, setSearch] = useState(""); const filtered = comments.filter(c => c.toLowerCase().includes(search.toLowerCase())); return <><div className="border-b border-slate-100 p-3.5"><div className="relative"><Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="ค้นหาข้อความ..." className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs outline-none focus:bg-white" /></div></div><div className="flex-1 space-y-2.5 overflow-y-auto bg-[#fafafa] p-4">{filtered.length ? filtered.map((c, i) => <div key={`${c}-${i}`} className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs"><p className="text-xs leading-relaxed text-slate-800">“{c}”</p><p className="mt-2 text-[10px] text-slate-400">ผู้ตอบแบบประเมิน</p></div>) : <div className="py-12 text-center text-xs text-slate-400">ไม่พบความคิดเห็นที่ตรงกับการค้นหา</div>}</div></>;
}

type ActivityReportModalProps = {
  open: boolean;
  onClose: () => void;
  activity: string;
  onActivityChange: (value: string) => void;
  activities: AdminDashboardData["activities"];
  selectedActivity: AdminDashboardData["activities"][number] | null;
  reportSearch: string;
  onReportSearchChange: (value: string) => void;
  onPrint: () => void;
  onExportCSV: () => void;
  reportDetailRows: ReportDetailRow[];
  filteredReportRows: ReportRow[];
  includeReferenceData: boolean;
  onIncludeReferenceDataChange: (value: boolean) => void;
  includeRespondentDetails: boolean;
  onIncludeRespondentDetailsChange: (value: boolean) => void;
};

function ActivityReportModal({
  open,
  onClose,
  activity,
  onActivityChange,
  activities,
  selectedActivity,
  reportSearch,
  onReportSearchChange,
  onPrint,
  onExportCSV,
  reportDetailRows,
  filteredReportRows,
  includeReferenceData,
  onIncludeReferenceDataChange,
  includeRespondentDetails,
  onIncludeRespondentDetailsChange,
}: ActivityReportModalProps) {
  if (!open) return null;

  const activityLabel = selectedActivity?.title || "-";

  return (
    <Modal title="รายงานผลรายกิจกรรม" onClose={onClose} wide>
      <div className="border-b border-slate-100 bg-white px-5 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-bold text-slate-800">
              รายงานผลการดำเนินงานและแบบประเมินความพึงพอใจ
            </p>
            <p className="mt-0.5 text-[10px] text-slate-500">
              เลือกกิจกรรม 1 รายการเพื่อดูข้อมูลและส่งออกเป็นรายงานเฉพาะกิจกรรม
            </p>
          </div>
          <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-bold text-sky-700">
            ข้อมูลจากระบบจริง
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 bg-white p-4">
        <div className="flex w-full flex-wrap items-end gap-2.5 lg:flex-1">
          <label className="flex min-w-[260px] flex-1 flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
              กิจกรรมที่ต้องการออกรายงาน
            </span>
            <div className="relative">
              <select
                value={activity}
                onChange={e => onActivityChange(e.target.value)}
                className="h-9 w-full appearance-none rounded-lg border border-sky-200 bg-sky-50 px-3 pr-9 text-xs font-bold text-slate-800 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              >
                <option value="ALL">เลือกกิจกรรม...</option>
                {activities.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-500" />
            </div>
          </label>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={reportSearch}
              onChange={e => onReportSearchChange(e.target.value)}
              placeholder="ค้นหารหัสผู้ตอบ / ข้อคำถาม..."
              className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs outline-none transition focus:bg-white focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

        <div className="flex w-full flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-[10px]">
          <label className="inline-flex cursor-pointer items-center gap-2 font-bold text-slate-700">
            <input
              type="checkbox"
              checked={includeReferenceData}
              onChange={e => onIncludeReferenceDataChange(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            <span>แนบข้อมูลอ้างอิง</span>
          </label>
          <span className="h-4 w-px bg-slate-200" />
          <label className={`inline-flex items-center gap-2 ${includeReferenceData ? "cursor-pointer text-slate-700" : "cursor-not-allowed text-slate-400"}`}>
            <input
              type="checkbox"
              checked={includeRespondentDetails}
              disabled={!includeReferenceData}
              onChange={e => onIncludeRespondentDetailsChange(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 disabled:opacity-50"
            />
            <span>รวมข้อมูลรายบุคคล</span>
          </label>
          <span className="text-slate-400">
            {includeRespondentDetails
              ? "แนบข้อมูลผู้ตอบเป็นรายคนในภาคผนวก"
              : "ไม่แนบข้อมูลรายคน"}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onPrint}
            disabled={!reportDetailRows.length || activity === "ALL"}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#111111] px-3 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#0b3d68] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Printer className="h-4 w-4" />
            ส่งออก PDF / พิมพ์รายงาน
          </button>
          <button
            type="button"
            onClick={onExportCSV}
            disabled={!reportDetailRows.length || activity === "ALL"}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 shadow-xs transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download className="h-4 w-4" />
            ส่งออกข้อมูล CSV
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-[#fafafa] p-4">
        {activity === "ALL" ? (
          <div className="grid min-h-[360px] place-items-center rounded-xl border border-dashed border-sky-200 bg-sky-50/50 p-8 text-center">
            <div>
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white text-sky-600 shadow-sm">
                <ActivityIcon className="h-6 w-6" />
              </div>
              <h3 className="mt-3 text-sm font-black text-slate-800">
                เลือกกิจกรรมก่อนดูรายงาน
              </h3>
              <p className="mt-1 max-w-md text-xs leading-5 text-slate-500">
                รายงานและข้อมูลบนหน้านี้จะแสดงเฉพาะกิจกรรมที่เลือก เพื่อให้สามารถส่งออกเป็นรายกิจกรรมได้อย่างถูกต้อง
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="min-w-[1500px] border-collapse text-[10px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-slate-50 text-slate-700">
                  {["#", "รหัสผู้ตอบ", "กิจกรรม", "วันที่จัด", "วันที่ส่งแบบประเมิน", "ช่วงอายุ", "ประเภทผู้ตอบ", "หน่วยงาน", "หมวดคำถาม", "ข้อคำถาม", "คะแนน (1-5)", "ความคิดเห็น", "ช่องทางการรับรู้"].map(header => (
                    <th
                      key={header}
                      className="whitespace-nowrap border-b border-slate-200 px-2.5 py-2.5 text-center font-bold"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportDetailRows.map((row, index) => (
                  <tr
                    key={`${row.respondentId}-${row.question}-${index}`}
                    className="transition hover:bg-sky-50/60"
                  >
                    {[
                      index + 1,
                      row.respondentId,
                      row.activity,
                      formatDate(row.date),
                      formatDateTime(row.submittedAt),
                      row.ageGroup,
                      row.affiliation,
                      row.organization,
                      row.group,
                      row.question,
                      row.score,
                      row.feedback,
                      row.channels,
                    ].map((value, columnIndex) => (
                      <td
                        key={columnIndex}
                        className={`border-b border-slate-100 px-2.5 py-2 align-top ${columnIndex === 0 || columnIndex === 10 ? "text-center font-semibold text-slate-700" : columnIndex >= 11 ? "min-w-[150px] whitespace-normal text-slate-600" : "whitespace-nowrap text-slate-600"}`}
                      >
                        {value || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
                {!reportDetailRows.length && (
                  <tr>
                    <td colSpan={13} className="py-12 text-center text-xs text-slate-400">
                      ไม่พบข้อมูลตามตัวกรอง
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 bg-white px-5 py-3 text-[11px] text-slate-500">
        <span>
          {activity === "ALL" ? "ยังไม่ได้เลือกกิจกรรม" : "กิจกรรม: " + activityLabel}
          {" • "}ผู้ตอบ {filteredReportRows.length.toLocaleString("th-TH")} คน
          {" • "}รายข้อ {reportDetailRows.length.toLocaleString("th-TH")} รายการ
        </span>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg bg-slate-800 px-4 py-1.5 font-bold text-white hover:bg-slate-700"
        >
          ปิดหน้าต่าง
        </button>
      </div>
    </Modal>
  );
}