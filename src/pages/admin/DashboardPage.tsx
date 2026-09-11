import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronRight, Filter, RefreshCw, Search, ShieldCheck, Users } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { getAdminDashboardData, type AdminDashboardData, type DashboardOccurrence, type DashboardResponse } from "@/services/api";

const SCORE_FIELDS = [
  "p2_location", "p2_schedule", "p2_readiness", "p2_reception", "p2_overall",
  "p3_interest", "p3_content", "p3_clarity", "p3_benefit", "p3_application",
  "p4_knowledge", "p4_inspiration", "p4_community_resource", "p4_future_return",
] as const;
type ScoreField = (typeof SCORE_FIELDS)[number];
const TOPICS: Record<string, { label: string; fields: ScoreField[] }> = {
  "การจัดงาน": ["p2_location", "p2_schedule", "p2_readiness", "p2_reception", "p2_overall"],
  "เนื้อหา/การเรียนรู้": ["p3_interest", "p3_content", "p3_clarity", "p3_benefit", "p3_application"],
  "ผลกระทบ": ["p4_knowledge", "p4_inspiration", "p4_community_resource", "p4_future_return"],
};
const QUESTION_LABELS: Record<ScoreField, string> = {
  p2_location: "ความเหมาะสมของสถานที่", p2_schedule: "ความเหมาะสมของระยะเวลา", p2_readiness: "ความพร้อมของอุปกรณ์/สื่อ", p2_reception: "การต้อนรับและการอำนวยความสะดวก", p2_overall: "ภาพรวมการจัดกิจกรรม",
  p3_interest: "ความน่าสนใจของเนื้อหา", p3_content: "ความสมบูรณ์ครบถ้วนของเนื้อหา", p3_clarity: "ความชัดเจนในการถ่ายทอด", p3_benefit: "ประโยชน์ที่ได้รับ", p3_application: "การนำไปประยุกต์ใช้",
  p4_knowledge: "ความรู้ความเข้าใจที่เพิ่มขึ้น", p4_inspiration: "แรงบันดาลใจในการต่อยอด", p4_community_resource: "การเป็นแหล่งเรียนรู้ของชุมชน", p4_future_return: "ความสนใจเข้าร่วมอีกในอนาคต",
};

type Period = "ALL" | "MONTH" | "QUARTER" | "YEAR" | "CUSTOM";
type CalendarView = "month" | "week" | "list";

function score(value: unknown) { const n = Number(value); return Number.isFinite(n) && n >= 1 && n <= 5 ? n : null; }
function formatDate(value?: string | null) { if (!value) return "-"; const d = new Date(value); return Number.isNaN(d.getTime()) ? "-" : new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(d); }
function monthKey(value: string) { const d = new Date(value); return Number.isNaN(d.getTime()) ? "" : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; }
function inPeriod(value: string, period: Period, month: string, quarter: string, year: string, from: string, to: string) {
  const d = new Date(value); if (Number.isNaN(d.getTime())) return false;
  if (period === "ALL") return true;
  if (period === "YEAR") return String(d.getFullYear()) === year;
  if (period === "MONTH") return month ? monthKey(value) === month : true;
  if (period === "QUARTER") return `${d.getFullYear()}-Q${Math.floor(d.getMonth() / 3) + 1}` === quarter;
  return (!from || value.slice(0, 10) >= from) && (!to || value.slice(0, 10) <= to);
}
function calculateSatisfaction(responses: DashboardResponse[]) {
  let sum = 0; let count = 0;
  responses.forEach((r) => SCORE_FIELDS.forEach((field) => { const n = score(r[field]); if (n !== null) { sum += n; count++; } }));
  return { sum, count, avg: count ? sum / count : null, percent: count ? (sum / (count * 5)) * 100 : null };
}

export function DashboardPage() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState<Period>("ALL");
  const [year, setYear] = useState("ALL");
  const [month, setMonth] = useState("");
  const [quarter, setQuarter] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [center, setCenter] = useState("ALL");
  const [organization, setOrganization] = useState("ALL");
  const [activity, setActivity] = useState("ALL");
  const [surveyStatus, setSurveyStatus] = useState("ALL");
  const [calendarView, setCalendarView] = useState<CalendarView>("list");
  const [selectedOccurrenceId, setSelectedOccurrenceId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const load = async () => { setLoading(true); setError(""); try { setData(await getAdminDashboardData()); } catch (e) { setError(e instanceof Error ? e.message : "ไม่สามารถโหลด Dashboard ได้"); } finally { setLoading(false); } };
  useEffect(() => { void load(); }, []);

  const years = useMemo(() => [...new Set((data?.occurrences ?? []).map((o) => new Date(o.start_at).getFullYear()).filter((n) => Number.isFinite(n)))].sort((a, b) => b - a), [data]);
  const activeOccurrences = useMemo(() => (data?.occurrences ?? []).filter((o) => o.status !== "cancelled" && o.status !== "archived" && inPeriod(o.start_at, period, month, quarter, year === "ALL" ? "" : year, from, to)), [data, period, month, quarter, year, from, to]);
  const visibleActivities = useMemo(() => (data?.activities ?? []).filter((a) => activeOccurrences.some((o) => o.activity_id === a.id)).filter((a) => activity === "ALL" || a.id === activity).filter((a) => `${a.title} ${a.category ?? ""}`.toLowerCase().includes(query.toLowerCase())), [data, activeOccurrences, activity, query]);
  const centerActivityIds = useMemo(() => new Set((data?.activityLearningCenters ?? []).filter((r) => center === "ALL" || r.learning_center_id === center).map((r) => r.activity_id)), [data, center]);
  const filteredActivityIds = useMemo(() => new Set(visibleActivities.filter((a) => center === "ALL" || centerActivityIds.has(a.id)).map((a) => a.id)), [visibleActivities, center, centerActivityIds]);
  const filteredOccurrences = useMemo(() => activeOccurrences.filter((o) => filteredActivityIds.has(o.activity_id)).filter((o) => { const survey = data?.surveys.find((s) => s.occurrence_id === o.id); return surveyStatus === "ALL" || (surveyStatus === "none" ? !survey : surveyStatus === "enabled" ? survey?.enabled === true : surveyStatus === "closed" ? Boolean(survey?.close_at && new Date(survey.close_at) < new Date()) : survey?.enabled === false); }), [activeOccurrences, filteredActivityIds, data, surveyStatus]);
  const responseScope = useMemo(() => { const ids = new Set(filteredOccurrences.map((o) => o.id)); return (data?.responses ?? []).filter((r) => r.occurrence_id ? ids.has(r.occurrence_id) : filteredActivityIds.has(r.activity_id)).filter((r) => organization === "ALL" || r.participant_organization_id === organization); }, [data, filteredOccurrences, filteredActivityIds, organization]);
  const satisfaction = useMemo(() => calculateSatisfaction(responseScope), [responseScope]);
  const evaluatedOccurrences = useMemo(() => new Set(responseScope.map((r) => r.occurrence_id).filter(Boolean)).size, [responseScope]);
  const responseCount = responseScope.length;
  const responseRate = useMemo(() => { const participants = filteredOccurrences.reduce((sum, o) => sum + Number(o.participant_count || 0), 0); return participants > 0 ? (responseCount / participants) * 100 : null; }, [filteredOccurrences, responseCount]);
  const selectedOccurrence = selectedOccurrenceId ? data?.occurrences.find((o) => o.id === selectedOccurrenceId) : null;
  const selectedSurvey = selectedOccurrence ? data?.surveys.find((s) => s.occurrence_id === selectedOccurrence.id) : null;
  const selectedResponses = selectedOccurrence ? responseScope.filter((r) => r.occurrence_id === selectedOccurrence.id) : [];

  const topicScores = useMemo(() => Object.entries(TOPICS).map(([key, topic]) => { const values = responseScope.flatMap((r) => topic.fields.map((f) => score(r[f])).filter((v): v is number => v !== null)); const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : null; return { key, label: topic.label, avg, percent: avg === null ? null : (avg / 5) * 100 }; }), [responseScope]);
  const trend = useMemo(() => { const map = new Map<string, DashboardResponse[]>(); responseScope.forEach((r) => { const key = monthKey(r.submitted_at); if (key) map.set(key, [...(map.get(key) ?? []), r]); }); return [...map.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([key, values]) => ({ key, ...calculateSatisfaction(values) })); }, [responseScope]);
  const learningCenters = useMemo(() => (data?.learningCenters ?? []).filter((lc) => center === "ALL" || lc.id === center).filter((lc) => (data?.activityLearningCenters ?? []).some((r) => r.learning_center_id === lc.id && filteredActivityIds.has(r.activity_id))), [data, center, filteredActivityIds]);

  const reset = () => { setPeriod("ALL"); setYear("ALL"); setMonth(""); setQuarter(""); setFrom(""); setTo(""); setCenter("ALL"); setOrganization("ALL"); setActivity("ALL"); setSurveyStatus("ALL"); setQuery(""); setSelectedOccurrenceId(null); };

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center text-sm text-slate-500">กำลังโหลด Dashboard...</div>;
  if (error) return <div className="mx-auto max-w-3xl p-8"><div className="rounded-2xl border border-red-200 bg-red-50 p-6"><h1 className="text-lg font-bold text-red-800">ไม่สามารถโหลด Dashboard</h1><p className="mt-2 text-sm text-red-700">{error}</p><button onClick={() => void load()} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-navy px-4 text-sm font-semibold text-white"><RefreshCw className="h-4 w-4" />ลองใหม่</button></div></div>;

  return <div className="min-h-screen bg-slate-50">
    <section className="border-b border-slate-200 bg-white"><div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-xs font-semibold tracking-[0.12em] text-emerald-700">EXECUTIVE ANALYTICS & SATISFACTION INSIGHT</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-brand-navy lg:text-3xl">Dashboard ภาพรวมกิจกรรมและความพึงพอใจ</h1><p className="mt-1 text-sm text-slate-600">ดูภาพรวมกิจกรรมที่จัดจริง พร้อม Drill-down ถึง Learning Center, Activity, Occurrence และ Survey Audit</p></div><button onClick={() => void load()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-brand-navy hover:bg-slate-50"><RefreshCw className="h-4 w-4" />รีเฟรชข้อมูล</button></div>
    </div></section>

    <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="mb-3 flex items-center gap-2 text-sm font-semibold text-brand-navy"><Filter className="h-4 w-4" />ตัวกรองข้อมูล</div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <select value={period} onChange={(e) => setPeriod(e.target.value as Period)} className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm"><option value="ALL">ทั้งหมด</option><option value="YEAR">รายปี</option><option value="QUARTER">รายไตรมาส</option><option value="MONTH">รายเดือน</option><option value="CUSTOM">กำหนดช่วงวันที่</option></select>
        {period === "YEAR" && <select value={year} onChange={(e) => setYear(e.target.value)} className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm"><option value="ALL">ทุกปี</option>{years.map((y) => <option key={y} value={y}>{y + 543}</option>)}</select>}
        {period === "QUARTER" && <select value={quarter} onChange={(e) => setQuarter(e.target.value)} className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm"><option value="">ทุกไตรมาส</option>{years.flatMap((y) => [1,2,3,4].map((q) => <option key={`${y}-${q}`} value={`${y}-Q${q}`}>ไตรมาส {q}/{y + 543}</option>))}</select>}
        {period === "MONTH" && <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm" />}
        {period === "CUSTOM" && <><input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm" /><input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm" /></>}
        <select value={center} onChange={(e) => setCenter(e.target.value)} className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm"><option value="ALL">ทุก Learning Center</option>{data?.learningCenters.map((lc) => <option key={lc.id} value={lc.id}>{lc.name}</option>)}</select>
        <select value={organization} onChange={(e) => setOrganization(e.target.value)} className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm"><option value="ALL">ทุกหน่วยงาน</option>{data?.organizations.map((org) => <option key={org.id} value={org.id}>{org.name}</option>)}</select>
        <select value={activity} onChange={(e) => setActivity(e.target.value)} className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm"><option value="ALL">ทุกกิจกรรม</option>{data?.activities.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}</select>
        <select value={surveyStatus} onChange={(e) => setSurveyStatus(e.target.value)} className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm"><option value="ALL">ทุกสถานะ Survey</option><option value="enabled">เปิด Survey</option><option value="closed">ปิด Survey</option><option value="none">ไม่มี Survey</option><option value="disabled">ปิดใช้งาน Survey</option></select>
      </div><div className="mt-3 flex flex-wrap items-center justify-between gap-3"><div className="relative w-full max-w-sm"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ค้นหากิจกรรม..." className="min-h-11 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm" /></div><button onClick={reset} className="text-sm font-semibold text-brand-navy underline">Reset ตัวกรอง</button></div></section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Kpi label="กิจกรรมที่จัดจริง" value={String(filteredOccurrences.length)} note="ไม่รวม Cancelled" />
        <Kpi label="กิจกรรมที่มีผลประเมิน" value={String(evaluatedOccurrences)} note="มี Response อย่างน้อย 1 รายการ" />
        <Kpi label="ผู้ตอบแบบสอบถาม" value={responseCount.toLocaleString()} note="Response จริง" />
        <Kpi label="Response Rate" value={responseRate === null ? "—" : `${responseRate.toFixed(2)}%`} note="เทียบกับผู้เข้าร่วมที่บันทึกไว้" />
        <Kpi label="Satisfaction" value={satisfaction.percent === null ? "—" : `${satisfaction.percent.toFixed(2)}%`} note={satisfaction.avg === null ? "ยังไม่มีข้อมูล" : `${satisfaction.avg.toFixed(2)} / 5.00`} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]"><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><SectionTitle title="ความพึงพอใจตามหัวข้อ" /><div className="mt-5 space-y-5">{topicScores.map((item) => <div key={item.key}><div className="flex justify-between text-sm"><span className="font-medium text-slate-700">{item.label}</span><span className="font-semibold text-brand-navy">{item.avg === null ? "ไม่มีข้อมูล" : `${item.avg.toFixed(2)} / 5.00`}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-600" style={{ width: `${item.percent ?? 0}%` }} /></div></div>)}</div></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><SectionTitle title="แนวโน้ม Satisfaction" /><div className="mt-4 space-y-3">{trend.length ? trend.map((item) => <div key={item.key} className="flex items-center gap-3"><span className="w-20 text-xs text-slate-500">{item.key}</span><div className="h-2 flex-1 rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand-navy" style={{ width: `${item.percent ?? 0}%` }} /></div><span className="w-16 text-right text-xs font-semibold">{item.percent === null ? "—" : `${item.percent.toFixed(2)}%`}</span></div>) : <Empty text="ยังไม่มี Response ในช่วงที่เลือก" />}</div></div></section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><SectionTitle title="Learning Centers" subtitle="รายการสำหรับ Drill-down — ไม่มีการจัดอันดับหรือเปรียบเทียบ" /><span className="text-xs text-slate-500">{learningCenters.length} รายการ</span></div><div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">{learningCenters.map((lc) => { const ids = new Set((data?.activityLearningCenters ?? []).filter((r) => r.learning_center_id === lc.id).map((r) => r.activity_id)); const count = filteredOccurrences.filter((o) => ids.has(o.activity_id)).length; return <button key={lc.id} onClick={() => setCenter(lc.id)} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 text-left hover:border-slate-300"><div><p className="font-semibold text-brand-navy">{lc.name}</p><p className="mt-1 text-xs text-slate-500">{count} Occurrence ที่จัดจริง</p></div><ChevronRight className="h-4 w-4 text-slate-400" /></button>; })}{learningCenters.length === 0 && <Empty text="ไม่มี Learning Center ในเงื่อนไขที่เลือก" />}</div></section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><SectionTitle title="Activity Timeline / Calendar" subtitle="กิจกรรมที่จัดแล้วและกิจกรรมที่กำหนดไว้จะแยกตามสถานะ; Cancelled ไม่แสดง" /><div className="flex rounded-xl bg-slate-100 p-1">{(["month","week","list"] as const).map((v) => <button key={v} onClick={() => setCalendarView(v)} className={`rounded-lg px-3 py-2 text-xs font-semibold ${calendarView === v ? "bg-white text-brand-navy shadow-sm" : "text-slate-500"}`}>{v === "month" ? "Month" : v === "week" ? "Week" : "List / Agenda"}</button>)}</div></div><div className="mt-4 space-y-2">{filteredOccurrences.slice(0, calendarView === "list" ? 100 : 31).map((o) => { const a = data?.activities.find((x) => x.id === o.activity_id); const s = data?.surveys.find((x) => x.occurrence_id === o.id); const responses = responseScope.filter((r) => r.occurrence_id === o.id).length; return <button key={o.id} onClick={() => setSelectedOccurrenceId(o.id)} className="grid w-full gap-2 rounded-xl border border-slate-200 p-4 text-left hover:bg-slate-50 sm:grid-cols-[8rem_1fr_auto] sm:items-center"><div className="text-xs text-slate-500"><CalendarDays className="mr-1 inline h-4 w-4" />{formatDate(o.start_at)}</div><div><p className="font-semibold text-brand-navy">{a?.title ?? "กิจกรรม"}</p><p className="mt-1 text-xs text-slate-500">ครั้งที่ {o.occurrence_no} · {o.location_detail || o.location_type || "ไม่ระบุสถานที่"}</p></div><div className="flex flex-wrap gap-2 text-xs"><Badge text={o.status} /><Badge text={s ? (s.enabled ? "Survey เปิดใช้" : "Survey ปิด") : "ไม่มี Survey"} /><Badge text={`${responses} Response`} /></div></button>); })}{filteredOccurrences.length === 0 && <Empty text="ไม่มีกิจกรรมในช่วงที่เลือก" />}</div></section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><SectionTitle title="Survey Audit" subtitle="Analytics และ review ระดับ Occurrence — ผู้ที่ไม่ใช่ Admin ไม่สามารถเข้าถึงข้อมูลนี้" /><ShieldCheck className="h-5 w-5 text-emerald-700" /></div>{selectedOccurrence && selectedSurvey ? <AuditPanel occurrence={selectedOccurrence} survey={selectedSurvey} activityTitle={data?.activities.find((a) => a.id === selectedOccurrence.activity_id)?.title ?? "กิจกรรม"} responses={selectedResponses} /> : <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">เลือก Occurrence จาก Timeline เพื่อดู Survey Audit</div>}</section>
    </main>
  </div>;
}

function Kpi({ label, value, note }: { label: string; value: string; note: string }) { return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold tracking-tight text-brand-navy">{value}</p><p className="mt-1 text-xs text-slate-500">{note}</p></div>; }
function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) { return <div><h2 className="text-lg font-semibold text-brand-navy">{title}</h2>{subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}</div>; }
function Empty({ text }: { text: string }) { return <div className="w-full rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">{text}</div>; }
function Badge({ text }: { text: string }) { return <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">{text}</span>; }
function AuditPanel({ occurrence, survey, activityTitle, responses }: { occurrence: DashboardOccurrence; survey: { anonymous: boolean; enabled: boolean; open_at?: string | null; close_at?: string | null }; activityTitle: string; responses: DashboardResponse[] }) {
  const satisfaction = calculateSatisfaction(responses);
  const participants = occurrence.participant_count || 0;
  const rate = participants ? (responses.length / participants) * 100 : null;
  const topicScores = Object.entries(TOPICS).map(([key, topic]) => { const values = responses.flatMap((r) => topic.fields.map((f) => score(r[f])).filter((v): v is number => v !== null)); const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : null; return { key, label: topic.label, avg }; });
  return <div className="mt-5 space-y-5"><div className="rounded-xl bg-slate-50 p-4"><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-brand-navy">{activityTitle}</h3><Badge text={`ครั้งที่ ${occurrence.occurrence_no}`} /><Badge text={survey.anonymous ? "Anonymous" : "Identified"} /></div><p className="mt-2 text-sm text-slate-500">{formatDate(occurrence.start_at)} · {occurrence.location_detail || occurrence.location_type || "ไม่ระบุสถานที่"}</p><p className="mt-1 text-xs text-slate-500">Survey: {survey.enabled ? "เปิดใช้งาน" : "ปิดใช้งาน"} · เปิด {formatDate(survey.open_at)} · ปิด {formatDate(survey.close_at)}</p></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"><Kpi label="ผู้เข้าร่วม" value={participants.toLocaleString()} note="ตาม Occurrence" /><Kpi label="ผู้ตอบ" value={responses.length.toLocaleString()} note="Response จริง" /><Kpi label="Response Rate" value={rate === null ? "—" : `${rate.toFixed(2)}%`} note="เทียบผู้เข้าร่วม" /><Kpi label="Average Score" value={satisfaction.avg === null ? "—" : `${satisfaction.avg.toFixed(2)} / 5.00`} note="14 ข้อที่มีข้อมูล" /><Kpi label="Satisfaction" value={satisfaction.percent === null ? "—" : `${satisfaction.percent.toFixed(2)}%`} note="Weighted จาก Response" /></div><div className="grid gap-5 lg:grid-cols-2"><div className="rounded-xl border border-slate-200 p-4"><h4 className="font-semibold text-brand-navy">คะแนนตามหัวข้อ</h4><div className="mt-4 space-y-3">{topicScores.map((t) => <div key={t.key} className="flex items-center justify-between text-sm"><span className="text-slate-600">{t.label}</span><strong className="text-brand-navy">{t.avg === null ? "—" : `${t.avg.toFixed(2)} / 5.00`}</strong></div>)}</div></div><div className="rounded-xl border border-slate-200 p-4"><h4 className="font-semibold text-brand-navy">Comments / Feedback</h4><div className="mt-3 max-h-56 space-y-2 overflow-auto">{responses.filter((r) => r.feedback?.trim()).map((r) => <div key={r.id} className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">{r.feedback}</div>)}{!responses.some((r) => r.feedback?.trim()) && <p className="text-sm text-slate-500">ไม่มีความคิดเห็น</p>}</div></div></div><div className="rounded-xl border border-slate-200 p-4"><div className="flex items-center gap-2"><Users className="h-4 w-4 text-slate-500" /><h4 className="font-semibold text-brand-navy">Response Detail</h4></div><p className="mt-1 text-xs text-slate-500">{survey.anonymous ? "Survey นี้เป็น Anonymous จึงไม่เปิดเผยตัวตนของผู้ตอบ" : "แสดงข้อมูลผู้ตอบเท่าที่ระบบมีอยู่จริง"}</p><div className="mt-3 overflow-x-auto"><table className="w-full min-w-[600px] text-left text-xs"><thead className="border-b text-slate-500"><tr><th className="p-2">วันที่ตอบ</th><th className="p-2">หน่วยงาน</th><th className="p-2">คะแนนเฉลี่ย</th><th className="p-2">Feedback</th></tr></thead><tbody>{responses.map((r) => { const s = calculateSatisfaction([r]); const org = r.participant_organization_id; return <tr key={r.id} className="border-b last:border-0"><td className="p-2">{formatDate(r.submitted_at)}</td><td className="p-2">{survey.anonymous ? "Anonymous" : org || r.affiliation || "ไม่ระบุ"}</td><td className="p-2">{s.avg === null ? "—" : s.avg.toFixed(2)}</td><td className="max-w-xs truncate p-2">{r.feedback || "-"}</td></tr>; })}</tbody></table></div></div></div>;
}
