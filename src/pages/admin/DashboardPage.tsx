import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronRight, Filter, RefreshCw, Search, ShieldCheck, Users } from "lucide-react";
import { getAdminDashboardData, type AdminDashboardData, type DashboardOccurrence, type DashboardResponse } from "@/services/api";

type Period = "ALL" | "MONTH" | "QUARTER" | "YEAR" | "CUSTOM";
type CalendarView = "month" | "week" | "list";
type ScoreField = keyof Pick<DashboardResponse, "p2_location" | "p2_schedule" | "p2_readiness" | "p2_reception" | "p2_overall" | "p3_interest" | "p3_content" | "p3_clarity" | "p3_benefit" | "p3_application" | "p4_knowledge" | "p4_inspiration" | "p4_community_resource" | "p4_future_return">;

const SCORE_FIELDS: ScoreField[] = ["p2_location", "p2_schedule", "p2_readiness", "p2_reception", "p2_overall", "p3_interest", "p3_content", "p3_clarity", "p3_benefit", "p3_application", "p4_knowledge", "p4_inspiration", "p4_community_resource", "p4_future_return"];
const TOPICS = [
  { key: "event", label: "การจัดงาน", fields: SCORE_FIELDS.slice(0, 5) },
  { key: "learning", label: "เนื้อหา/การเรียนรู้", fields: SCORE_FIELDS.slice(5, 10) },
  { key: "impact", label: "ผลกระทบ", fields: SCORE_FIELDS.slice(10) },
] as const;

function score(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) && n >= 1 && n <= 5 ? n : null;
}
function formatDate(value?: string | null): string {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(date);
}
function monthKey(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}
function inPeriod(value: string, period: Period, month: string, quarter: string, year: string, from: string, to: string): boolean {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  if (period === "ALL") return true;
  if (period === "YEAR") return String(date.getFullYear()) === year;
  if (period === "MONTH") return month ? monthKey(value) === month : true;
  if (period === "QUARTER") return `${date.getFullYear()}-Q${Math.floor(date.getMonth() / 3) + 1}` === quarter;
  return (!from || value.slice(0, 10) >= from) && (!to || value.slice(0, 10) <= to);
}
function calculateSatisfaction(responses: DashboardResponse[]) {
  let sum = 0;
  let count = 0;
  for (const response of responses) {
    for (const field of SCORE_FIELDS) {
      const value = score(response[field]);
      if (value !== null) {
        sum += value;
        count += 1;
      }
    }
  }
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

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setData(await getAdminDashboardData());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "ไม่สามารถโหลด Dashboard ได้");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { void load(); }, []);

  const years = useMemo(() => [...new Set((data?.occurrences ?? []).map((item) => new Date(item.start_at).getFullYear()).filter(Number.isFinite))].sort((a, b) => b - a), [data]);
  const activeOccurrences = useMemo(() => (data?.occurrences ?? []).filter((item) => item.status !== "cancelled" && item.status !== "archived" && inPeriod(item.start_at, period, month, quarter, year === "ALL" ? "" : year, from, to)), [data, period, month, quarter, year, from, to]);
  const visibleActivities = useMemo(() => (data?.activities ?? []).filter((item) => activeOccurrences.some((occurrence) => occurrence.activity_id === item.id)).filter((item) => activity === "ALL" || item.id === activity).filter((item) => `${item.title} ${item.category ?? ""}`.toLowerCase().includes(query.toLowerCase())), [data, activeOccurrences, activity, query]);
  const centerActivityIds = useMemo(() => new Set((data?.activityLearningCenters ?? []).filter((item) => center === "ALL" || item.learning_center_id === center).map((item) => item.activity_id)), [data, center]);
  const filteredActivityIds = useMemo(() => new Set(visibleActivities.filter((item) => center === "ALL" || centerActivityIds.has(item.id)).map((item) => item.id)), [visibleActivities, center, centerActivityIds]);
  const filteredOccurrences = useMemo(() => activeOccurrences.filter((item) => filteredActivityIds.has(item.activity_id)).filter((item) => {
    const survey = data?.surveys.find((candidate) => candidate.occurrence_id === item.id);
    if (surveyStatus === "ALL") return true;
    if (surveyStatus === "none") return !survey;
    if (surveyStatus === "enabled") return survey?.enabled === true;
    if (surveyStatus === "closed") return Boolean(survey?.close_at && new Date(survey.close_at).getTime() < Date.now());
    return survey?.enabled === false;
  }), [activeOccurrences, filteredActivityIds, data, surveyStatus]);
  const responseScope = useMemo(() => {
    const ids = new Set(filteredOccurrences.map((item) => item.id));
    return (data?.responses ?? []).filter((response) => response.occurrence_id ? ids.has(response.occurrence_id) : filteredActivityIds.has(response.activity_id)).filter((response) => organization === "ALL" || response.participant_organization_id === organization);
  }, [data, filteredOccurrences, filteredActivityIds, organization]);
  const satisfaction = useMemo(() => calculateSatisfaction(responseScope), [responseScope]);
  const evaluatedOccurrences = useMemo(() => new Set(responseScope.map((item) => item.occurrence_id).filter((value): value is string => Boolean(value))).size, [responseScope]);
  const responseRate = useMemo(() => {
    const participants = filteredOccurrences.reduce((total, item) => total + Number(item.participant_count || 0), 0);
    return participants > 0 ? (responseScope.length / participants) * 100 : null;
  }, [filteredOccurrences, responseScope.length]);
  const selectedOccurrence = selectedOccurrenceId ? data?.occurrences.find((item) => item.id === selectedOccurrenceId) : null;
  const selectedSurvey = selectedOccurrence ? data?.surveys.find((item) => item.occurrence_id === selectedOccurrence.id) : null;
  const selectedResponses = selectedOccurrence ? responseScope.filter((item) => item.occurrence_id === selectedOccurrence.id) : [];
  const topicScores = useMemo(() => TOPICS.map((topic) => {
    const values: number[] = [];
    for (const response of responseScope) for (const field of topic.fields) {
      const value = score(response[field]);
      if (value !== null) values.push(value);
    }
    const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
    return { ...topic, avg, percent: avg === null ? null : (avg / 5) * 100 };
  }), [responseScope]);
  const trend = useMemo(() => {
    const groups = new Map<string, DashboardResponse[]>();
    for (const response of responseScope) {
      const key = monthKey(response.submitted_at);
      if (key) groups.set(key, [...(groups.get(key) ?? []), response]);
    }
    return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([key, values]) => ({ key, ...calculateSatisfaction(values) }));
  }, [responseScope]);
  const learningCenters = useMemo(() => (data?.learningCenters ?? []).filter((item) => center === "ALL" || item.id === center).filter((item) => (data?.activityLearningCenters ?? []).some((relation) => relation.learning_center_id === item.id && filteredActivityIds.has(relation.activity_id))), [data, center, filteredActivityIds]);
  const reset = () => { setPeriod("ALL"); setYear("ALL"); setMonth(""); setQuarter(""); setFrom(""); setTo(""); setCenter("ALL"); setOrganization("ALL"); setActivity("ALL"); setSurveyStatus("ALL"); setQuery(""); setSelectedOccurrenceId(null); };

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center text-sm text-slate-500">กำลังโหลด Dashboard...</div>;
  if (error) return <div className="mx-auto max-w-3xl p-8"><div className="rounded-2xl border border-red-200 bg-red-50 p-6"><h1 className="text-lg font-bold text-red-800">ไม่สามารถโหลด Dashboard</h1><p className="mt-2 text-sm text-red-700">{error}</p><button onClick={() => void load()} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-navy px-4 text-sm font-semibold text-white"><RefreshCw className="h-4 w-4" />ลองใหม่</button></div></div>;

  return <div className="min-h-screen bg-slate-50"><section className="border-b border-slate-200 bg-white"><div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"><div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-xs font-semibold tracking-[0.12em] text-emerald-700">EXECUTIVE ANALYTICS & SATISFACTION INSIGHT</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-brand-navy lg:text-3xl">Dashboard ภาพรวมกิจกรรมและความพึงพอใจ</h1><p className="mt-1 text-sm text-slate-600">ภาพรวมกิจกรรมที่จัดจริง พร้อม Drill-down ถึง Learning Center, Activity, Occurrence และ Survey Audit</p></div><button onClick={() => void load()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-brand-navy hover:bg-slate-50"><RefreshCw className="h-4 w-4" />รีเฟรชข้อมูล</button></div></div></section>
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="mb-3 flex items-center gap-2 text-sm font-semibold text-brand-navy"><Filter className="h-4 w-4" />ตัวกรองข้อมูล</div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><select value={period} onChange={(e) => setPeriod(e.target.value as Period)} className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm"><option value="ALL">ทั้งหมด</option><option value="YEAR">รายปี</option><option value="QUARTER">รายไตรมาส</option><option value="MONTH">รายเดือน</option><option value="CUSTOM">กำหนดช่วงวันที่</option></select>{period === "YEAR" && <select value={year} onChange={(e) => setYear(e.target.value)} className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm"><option value="ALL">ทุกปี</option>{years.map((item) => <option key={item} value={item}>{item + 543}</option>)}</select>}{period === "QUARTER" && <select value={quarter} onChange={(e) => setQuarter(e.target.value)} className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm"><option value="">ทุกไตรมาส</option>{years.flatMap((item) => [1, 2, 3, 4].map((q) => <option key={`${item}-${q}`} value={`${item}-Q${q}`}>ไตรมาส {q}/{item + 543}</option>))}</select>}{period === "MONTH" && <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm" />}{period === "CUSTOM" && <><input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm" /><input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm" /></>}<select value={center} onChange={(e) => setCenter(e.target.value)} className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm"><option value="ALL">ทุก Learning Center</option>{data?.learningCenters.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><select value={organization} onChange={(e) => setOrganization(e.target.value)} className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm"><option value="ALL">ทุกหน่วยงาน</option>{data?.organizations.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><select value={activity} onChange={(e) => setActivity(e.target.value)} className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm"><option value="ALL">ทุกกิจกรรม</option>{data?.activities.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select><select value={surveyStatus} onChange={(e) => setSurveyStatus(e.target.value)} className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm"><option value="ALL">ทุกสถานะ Survey</option><option value="enabled">เปิด Survey</option><option value="closed">ปิด Survey</option><option value="none">ไม่มี Survey</option><option value="disabled">ปิดใช้งาน Survey</option></select></div><div className="mt-3 flex flex-wrap items-center justify-between gap-3"><div className="relative w-full max-w-sm"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ค้นหากิจกรรม..." className="min-h-11 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm" /></div><button onClick={reset} className="text-sm font-semibold text-brand-navy underline">Reset ตัวกรอง</button></div></section>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"><Kpi label="กิจกรรมที่จัดจริง" value={String(filteredOccurrences.length)} note="ไม่รวม Cancelled" /><Kpi label="กิจกรรมที่มีผลประเมิน" value={String(evaluatedOccurrences)} note="มี Response อย่างน้อย 1 รายการ" /><Kpi label="ผู้ตอบแบบสอบถาม" value={responseScope.length.toLocaleString()} note="Response จริง" /><Kpi label="Response Rate" value={responseRate === null ? "—" : `${responseRate.toFixed(2)}%`} note="เทียบผู้เข้าร่วมที่บันทึกไว้" /><Kpi label="Satisfaction" value={satisfaction.percent === null ? "—" : `${satisfaction.percent.toFixed(2)}%`} note={satisfaction.avg === null ? "ยังไม่มีข้อมูล" : `${satisfaction.avg.toFixed(2)} / 5.00`} /></section>
      <section className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]"><Panel title="ความพึงพอใจตามหัวข้อ"><div className="space-y-5">{topicScores.map((item) => <div key={item.key}><div className="flex justify-between text-sm"><span className="font-medium text-slate-700">{item.label}</span><span className="font-semibold text-brand-navy">{item.avg === null ? "ไม่มีข้อมูล" : `${item.avg.toFixed(2)} / 5.00`}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-600" style={{ width: `${item.percent ?? 0}%` }} /></div></div>)}</div></Panel><Panel title="แนวโน้ม Satisfaction"><div className="space-y-3">{trend.length ? trend.map((item) => <div key={item.key} className="flex items-center gap-3"><span className="w-20 text-xs text-slate-500">{item.key}</span><div className="h-2 flex-1 rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand-navy" style={{ width: `${item.percent ?? 0}%` }} /></div><span className="w-16 text-right text-xs font-semibold">{item.percent === null ? "—" : `${item.percent.toFixed(2)}%`}</span></div>) : <Empty text="ยังไม่มี Response ในช่วงที่เลือก" />}</div></Panel></section>
      <Panel title="Learning Centers" subtitle="รายการสำหรับ Drill-down — ไม่มีการจัดอันดับหรือเปรียบเทียบ"><div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{learningCenters.map((item) => { const ids = new Set((data?.activityLearningCenters ?? []).filter((relation) => relation.learning_center_id === item.id).map((relation) => relation.activity_id)); const count = filteredOccurrences.filter((occurrence) => ids.has(occurrence.activity_id)).length; return <button key={item.id} onClick={() => setCenter(item.id)} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 text-left hover:border-slate-300"><div><p className="font-semibold text-brand-navy">{item.name}</p><p className="mt-1 text-xs text-slate-500">{count} Occurrence ที่จัดจริง</p></div><ChevronRight className="h-4 w-4 text-slate-400" /></button>; })}{learningCenters.length === 0 && <Empty text="ไม่มี Learning Center ในเงื่อนไขที่เลือก" />}</div></Panel>
      <Panel title="Activity Timeline / Calendar" subtitle="Month / Week / List-Agenda · Cancelled ไม่แสดง"><div className="mb-4 flex rounded-xl bg-slate-100 p-1 w-fit">{(["month", "week", "list"] as const).map((value) => <button key={value} onClick={() => setCalendarView(value)} className={`rounded-lg px-3 py-2 text-xs font-semibold ${calendarView === value ? "bg-white text-brand-navy shadow-sm" : "text-slate-500"}`}>{value === "month" ? "Month" : value === "week" ? "Week" : "List / Agenda"}</button>)}</div><div className="space-y-2">{filteredOccurrences.slice(0, calendarView === "list" ? 100 : 31).map((occurrence) => { const item = data?.activities.find((candidate) => candidate.id === occurrence.activity_id); const survey = data?.surveys.find((candidate) => candidate.occurrence_id === occurrence.id); const responses = responseScope.filter((response) => response.occurrence_id === occurrence.id).length; return <button key={occurrence.id} onClick={() => setSelectedOccurrenceId(occurrence.id)} className="grid w-full gap-2 rounded-xl border border-slate-200 p-4 text-left hover:bg-slate-50 sm:grid-cols-[8rem_1fr_auto] sm:items-center"><div className="text-xs text-slate-500"><CalendarDays className="mr-1 inline h-4 w-4" />{formatDate(occurrence.start_at)}</div><div><p className="font-semibold text-brand-navy">{item?.title ?? "กิจกรรม"}</p><p className="mt-1 text-xs text-slate-500">ครั้งที่ {occurrence.occurrence_no} · {occurrence.location_detail || occurrence.location_type || "ไม่ระบุสถานที่"}</p></div><div className="flex flex-wrap gap-2 text-xs"><Badge text={occurrence.status} /><Badge text={survey ? (survey.enabled ? "Survey เปิดใช้" : "Survey ปิด") : "ไม่มี Survey"} /><Badge text={`${responses} Response`} /></div></button>; })}{filteredOccurrences.length === 0 && <Empty text="ไม่มีกิจกรรมในช่วงที่เลือก" />}</div></Panel>
      <Panel title="Survey Audit" subtitle="เฉพาะ Admin — เลือก Occurrence จาก Timeline เพื่อดูรายละเอียด"><div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-emerald-700" /><span className="text-sm text-slate-600">{selectedOccurrence && selectedSurvey ? `${selectedOccurrence.occurrence_no} · Survey ${selectedSurvey.anonymous ? "Anonymous" : "Identified"}` : "ยังไม่ได้เลือก Occurrence"}</span></div>{selectedOccurrence && selectedSurvey && <AuditPanel occurrence={selectedOccurrence} survey={selectedSurvey} activityTitle={data?.activities.find((item) => item.id === selectedOccurrence.activity_id)?.title ?? "กิจกรรม"} responses={selectedResponses} />}</Panel>
    </main></div>;
}

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) { return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4"><h2 className="text-lg font-semibold text-brand-navy">{title}</h2>{subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}</div>{children}</section>; }
function Empty({ text }: { text: string }) { return <div className="w-full rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">{text}</div>; }
function Badge({ text }: { text: string }) { return <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">{text}</span>; }
function Kpi({ label, value, note }: { label: string; value: string; note: string }) { return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold tracking-tight text-brand-navy">{value}</p><p className="mt-1 text-xs text-slate-500">{note}</p></div>; }
function AuditPanel({ occurrence, survey, activityTitle, responses }: { occurrence: DashboardOccurrence; survey: { anonymous: boolean; enabled: boolean; open_at?: string | null; close_at?: string | null }; activityTitle: string; responses: DashboardResponse[] }) {
  const satisfaction = calculateSatisfaction(responses);
  const participants = occurrence.participant_count || 0;
  const rate = participants ? (responses.length / participants) * 100 : null;
  const topics = TOPICS.map((topic) => { const values: number[] = []; for (const response of responses) for (const field of topic.fields) { const value = score(response[field]); if (value !== null) values.push(value); } return { ...topic, avg: values.length ? values.reduce((a, b) => a + b, 0) / values.length : null }; });
  return <div className="mt-5 space-y-5"><div className="rounded-xl bg-slate-50 p-4"><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-brand-navy">{activityTitle}</h3><Badge text={`ครั้งที่ ${occurrence.occurrence_no}`} /><Badge text={survey.anonymous ? "Anonymous" : "Identified"} /></div><p className="mt-2 text-sm text-slate-500">{formatDate(occurrence.start_at)} · {occurrence.location_detail || occurrence.location_type || "ไม่ระบุสถานที่"}</p><p className="mt-1 text-xs text-slate-500">Survey: {survey.enabled ? "เปิดใช้งาน" : "ปิดใช้งาน"} · เปิด {formatDate(survey.open_at)} · ปิด {formatDate(survey.close_at)}</p></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"><Kpi label="ผู้เข้าร่วม" value={participants.toLocaleString()} note="ตาม Occurrence" /><Kpi label="ผู้ตอบ" value={responses.length.toLocaleString()} note="Response จริง" /><Kpi label="Response Rate" value={rate === null ? "—" : `${rate.toFixed(2)}%`} note="เทียบผู้เข้าร่วม" /><Kpi label="Average Score" value={satisfaction.avg === null ? "—" : `${satisfaction.avg.toFixed(2)} / 5.00`} note="คะแนนที่มีข้อมูล" /><Kpi label="Satisfaction" value={satisfaction.percent === null ? "—" : `${satisfaction.percent.toFixed(2)}%`} note="Weighted จาก Response" /></div><div className="rounded-xl border border-slate-200 p-4"><div className="space-y-3">{topics.map((topic) => <div key={topic.key} className="flex items-center justify-between text-sm"><span className="text-slate-600">{topic.label}</span><strong className="text-brand-navy">{topic.avg === null ? "—" : `${topic.avg.toFixed(2)} / 5.00`}</strong></div>)}</div></div><div className="rounded-xl border border-slate-200 p-4"><div className="flex items-center gap-2"><Users className="h-4 w-4 text-slate-500" /><h4 className="font-semibold text-brand-navy">Response Detail</h4></div><p className="mt-1 text-xs text-slate-500">{survey.anonymous ? "Survey นี้เป็น Anonymous จึงไม่เปิดเผยตัวตนของผู้ตอบ" : "แสดงข้อมูลผู้ตอบเท่าที่ระบบมีอยู่จริง"}</p><div className="mt-3 max-h-64 overflow-auto"><table className="w-full min-w-[620px] text-left text-xs"><thead className="border-b text-slate-500"><tr><th className="p-2">วันที่ตอบ</th><th className="p-2">หน่วยงาน</th><th className="p-2">คะแนนเฉลี่ย</th><th className="p-2">Feedback</th></tr></thead><tbody>{responses.map((response) => { const row = calculateSatisfaction([response]); return <tr key={response.id} className="border-b last:border-0"><td className="p-2">{formatDate(response.submitted_at)}</td><td className="p-2">{survey.anonymous ? "Anonymous" : response.participant_organization_id || response.affiliation || "ไม่ระบุ"}</td><td className="p-2">{row.avg === null ? "—" : row.avg.toFixed(2)}</td><td className="max-w-xs truncate p-2">{response.feedback || "-"}</td></tr>; })}</tbody></table></div></div></div>;
}
