import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Activity, AlertTriangle, Calendar, CheckCircle2, Filter, Image as ImageIcon, MapPin, MessageSquareQuote, RefreshCw, RotateCcw, Star, Trophy, Users, Megaphone } from "lucide-react";
import { getAdminDashboardData, type AdminDashboardData } from "@/services/api";

type Period = "ALL" | "YEAR" | "QUARTER" | "MONTH" | "CUSTOM";
type Dimension = "age_group" | "affiliation" | "organization";
type DashboardResponseWithChannels = AdminDashboardData["responses"][number] & { channels?: string | null };

const SCORE_FIELDS = [
  "p2_location", "p2_schedule", "p2_readiness", "p2_reception", "p2_overall",
  "p3_interest", "p3_content", "p3_clarity", "p3_benefit", "p3_application",
  "p4_knowledge", "p4_inspiration", "p4_community_resource", "p4_future_return",
] as const;
const LABELS = [
  "สถานที่", "กำหนดการ", "ความพร้อม", "การต้อนรับ", "ภาพรวมกิจกรรม", "ความน่าสนใจ", "เนื้อหา",
  "ความชัดเจน", "ประโยชน์", "การนำไปใช้", "ความรู้ที่ได้รับ", "แรงบันดาลใจ", "ทรัพยากรชุมชน", "การกลับมาใช้บริการ",
];
const COLORS = ["#123F82", "#2F80ED", "#16A085", "#F59E0B", "#8B5CF6", "#94A3B8"];
const score = (value: unknown) => { const n = Number(value); return Number.isFinite(n) && n >= 1 && n <= 5 ? n : null; };
const average = (values: number[]) => values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
const formatDate = (value?: string | null) => { if (!value) return "-"; const d = new Date(value); return Number.isNaN(d.getTime()) ? "-" : new Intl.DateTimeFormat("th-TH", { day: "numeric", month: "short", year: "numeric" }).format(d); };

function matchesDate(value: string, period: Period, year: string, month: string, quarter: string, from: string, to: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return false;
  if (period === "ALL") return true;
  if (period === "YEAR") return year === "ALL" || String(d.getFullYear()) === year;
  if (period === "MONTH") return !month || value.slice(0, 7) === month;
  if (period === "QUARTER") return !quarter || `${d.getFullYear()}-Q${Math.floor(d.getMonth() / 3) + 1}` === quarter;
  const day = value.slice(0, 10);
  return (!from || day >= from) && (!to || day <= to);
}

function Card({ title, right, children }: { title: string; right?: ReactNode; children: ReactNode }) {
  return <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex min-h-12 items-center justify-between gap-3 border-b border-slate-100 px-4 py-3"><div className="flex min-w-0 items-center gap-2"><span className="h-5 w-1 rounded-full bg-brand-blue" /><h2 className="truncate text-sm font-extrabold text-brand-navy">{title}</h2></div>{right}</div>{children}</section>;
}
function Kpi({ icon, label, value, suffix, tone = "blue", note }: { icon: ReactNode; label: string; value: string; suffix?: string; tone?: "blue" | "green" | "amber" | "navy"; note?: string }) {
  const tones = { blue: "bg-blue-50 text-blue-700", green: "bg-emerald-50 text-emerald-700", amber: "bg-amber-50 text-amber-700", navy: "bg-slate-100 text-brand-navy" };
  return <article className="flex min-w-0 items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><div className="min-w-0"><p className="text-xs font-bold text-slate-500">{label}</p><div className="mt-2 flex items-baseline gap-1.5"><span className="text-2xl font-black text-brand-navy">{value}</span>{suffix && <span className="text-xs font-bold text-slate-400">{suffix}</span>}</div>{note && <p className="mt-1 text-[11px] font-semibold text-slate-400">{note}</p>}</div><div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${tones[tone]}`}>{icon}</div></article>;
}

export function ExecutiveDashboardPage() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const [activity, setActivity] = useState(params.get("activity") || "ALL");
  const [period, setPeriod] = useState<Period>("ALL");
  const [year, setYear] = useState("ALL");
  const [month, setMonth] = useState("");
  const [quarter, setQuarter] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [dimension, setDimension] = useState<Dimension>("age_group");

  const load = async (silent = false) => {
    if (silent) setRefreshing(true); else setLoading(true);
    setError("");
    try { setData(await getAdminDashboardData()); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "ไม่สามารถโหลด Dashboard ได้"); }
    finally { setLoading(false); setRefreshing(false); }
  };
  useEffect(() => { void load(); }, []);

  const years = useMemo(() => [...new Set((data?.occurrences ?? []).map((x) => new Date(x.start_at).getFullYear()))].filter(Number.isFinite).sort((a, b) => b - a), [data]);
  const occurrencePool = useMemo(() => (data?.occurrences ?? []).filter((x) => !["cancelled", "archived"].includes(x.status) && matchesDate(x.start_at, period, year, month, quarter, from, to)), [data, period, year, month, quarter, from, to]);
  const activities = useMemo(() => (data?.activities ?? []).filter((x) => occurrencePool.some((o) => o.activity_id === x.id)), [data, occurrencePool]);
  const activityIds = useMemo(() => new Set((activity === "ALL" ? activities : activities.filter((x) => x.id === activity)).map((x) => x.id)), [activities, activity]);
  const occurrences = useMemo(() => occurrencePool.filter((x) => activityIds.has(x.activity_id)), [occurrencePool, activityIds]);
  const responses = useMemo(() => { const ids = new Set(occurrences.map((x) => x.id)); return (data?.responses ?? []).filter((r) => r.occurrence_id ? ids.has(r.occurrence_id) : activityIds.has(r.activity_id)); }, [data, occurrences, activityIds]);
  const selected = activity === "ALL" ? undefined : data?.activities.find((x) => x.id === activity);
  const participants = occurrences.reduce((s, x) => s + Math.max(0, Number(x.participant_count || 0)), 0);
  const responseCount = responses.length;
  const pending = Math.max(0, participants - responseCount);
  const responseRate = participants ? Math.min((responseCount / participants) * 100, 100) : null;
  const dataMismatch = responseCount > participants;

  const questionScores = SCORE_FIELDS.map((field, index) => { const values = responses.map((r) => score(r[field])).filter((x): x is number => x !== null); return { field, label: LABELS[index], value: average(values), respondentCount: values.length }; }).filter((x) => x.value !== null) as { field: (typeof SCORE_FIELDS)[number]; label: string; value: number; respondentCount: number }[];
  const overall = average(responses.flatMap((r) => SCORE_FIELDS.map((field) => score(r[field])).filter((x): x is number => x !== null)));
  const highest = [...questionScores].sort((a, b) => b.value - a.value)[0];
  const lowest = [...questionScores].sort((a, b) => a.value - b.value)[0];

  const dimensionOptions = useMemo(() => [
    { key: "age_group" as const, label: "ช่วงอายุ", available: responses.some((r) => Boolean(r.age_group)) },
    { key: "affiliation" as const, label: "ประเภทผู้ตอบ", available: responses.some((r) => Boolean(r.affiliation)) },
    { key: "organization" as const, label: "หน่วยงาน", available: responses.some((r) => Boolean(r.participant_organization_id)) && Boolean(data?.organizations.length) },
  ].filter((x) => x.available), [responses, data]);
  useEffect(() => { if (dimensionOptions.length && !dimensionOptions.some((x) => x.key === dimension)) setDimension(dimensionOptions[0].key); }, [dimensionOptions, dimension]);

  const respondentDistribution = useMemo(() => { const counts = new Map<string, number>(); for (const r of responses) { const raw = dimension === "age_group" ? r.age_group : dimension === "affiliation" ? r.affiliation : data?.organizations.find((o) => o.id === r.participant_organization_id)?.name; const v = raw?.trim(); if (v) counts.set(v, (counts.get(v) ?? 0) + 1); } return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6); }, [responses, dimension, data]);
  const scoreDistribution = useMemo(() => { const total = responses.reduce((s, r) => s + SCORE_FIELDS.filter((f) => score(r[f]) !== null).length, 0); return [5, 4, 3, 2, 1].map((value) => { const count = responses.reduce((s, r) => s + SCORE_FIELDS.filter((f) => score(r[f]) === value).length, 0); return { value, count, percent: total ? count / total * 100 : 0 }; }); }, [responses]);

  const channelDistribution = useMemo(() => {
    const counts = new Map<string, number>();
    for (const response of responses as DashboardResponseWithChannels[]) {
      const raw = response.channels?.trim();
      if (!raw || raw === "-") continue;
      const categories = new Set<string>();
      for (const part of raw.split(",").map((x) => x.trim()).filter(Boolean)) {
        const upper = part.toUpperCase();
        if (upper.includes("FACEBOOK")) categories.add("FACEBOOK");
        else if (upper === "LINE" || upper.includes("LINE")) categories.add("LINE");
        else if (upper.includes("WEBSITE")) categories.add("WEBSITE");
        else categories.add("อื่นๆ");
      }
      for (const category of categories) counts.set(category, (counts.get(category) ?? 0) + 1);
    }
    return ["FACEBOOK", "LINE", "WEBSITE", "อื่นๆ"].map((label) => ({ label, count: counts.get(label) ?? 0 })).filter((x) => x.count > 0);
  }, [responses]);
  const channelTotal = channelDistribution.reduce((s, x) => s + x.count, 0);
  const channelMultiple = channelTotal > responses.length;
  const channelMeta = useMemo(() => ({ FACEBOOK: "facebook", LINE: "L", WEBSITE: "language", "อื่นๆ": "more_horiz" }) as Record<string, string>, []);

  const comments = responses.map((r) => r.feedback?.trim()).filter((x): x is string => Boolean(x)).slice(0, 4);
  const photos = useMemo(() => {
    if (activity !== "ALL") {
      const media = (data?.activityMedia ?? []).filter((x) => x.activity_id === activity).sort((a, b) => a.display_order - b.display_order).map((x) => ({ id: x.id, image: x.public_url, title: x.caption || selected?.title || "กิจกรรม" }));
      return [...(selected?.featured_image ? [{ id: "featured", image: selected.featured_image, title: selected.title }] : []), ...media].slice(0, 6);
    }
    return (data?.activities ?? []).filter((x) => x.featured_image).slice(0, 6).map((x) => ({ id: x.id, image: x.featured_image as string, title: x.title }));
  }, [data, activity, selected]);
  const recentActivities = useMemo(() => {
    if (!data) return [] as Array<{ item: AdminDashboardData["activities"][number]; occurrence: AdminDashboardData["occurrences"][number] }>;
    return data.activities.map((item) => { const occurrence = occurrencePool.filter((x) => x.activity_id === item.id).sort((a, b) => new Date(b.start_at).getTime() - new Date(a.start_at).getTime())[0]; return occurrence ? { item, occurrence } : null; }).filter((x): x is { item: AdminDashboardData["activities"][number]; occurrence: AdminDashboardData["occurrences"][number] } => Boolean(x)).sort((a, b) => new Date(b.occurrence.start_at).getTime() - new Date(a.occurrence.start_at).getTime()).slice(0, 4);
  }, [data, occurrencePool]);

  const reset = () => { setActivity("ALL"); setPeriod("ALL"); setYear("ALL"); setMonth(""); setQuarter(""); setFrom(""); setTo(""); };
  useEffect(() => { const url = new URL(window.location.href); if (activity === "ALL") url.searchParams.delete("activity"); else url.searchParams.set("activity", activity); window.history.replaceState({}, "", url); }, [activity]);
  if (loading) return <div className="grid min-h-[calc(100dvh-4rem)] place-items-center text-sm font-semibold text-slate-500">กำลังโหลดผลการดำเนินงาน...</div>;
  if (error) return <div className="grid min-h-[calc(100dvh-4rem)] place-items-center"><div className="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center"><p className="font-bold text-rose-800">ไม่สามารถโหลด Dashboard ได้</p><p className="mt-2 text-sm text-rose-600">{error}</p><button onClick={() => void load()} className="mt-4 rounded-lg bg-brand-navy px-4 py-2 text-sm font-bold text-white">ลองใหม่</button></div></div>;

  const title = selected?.title || "ภาพรวมผลการดำเนินงาน";
  const image = selected?.featured_image || photos[0]?.image;
  const level = overall === null ? "-" : overall >= 4.5 ? "มากที่สุด" : overall >= 3.5 ? "มาก" : overall >= 2.5 ? "ปานกลาง" : "ควรปรับปรุง";
  const overallPercent = overall === null ? 0 : Math.min(100, overall / 5 * 100);

  return <div className="min-h-[calc(100dvh-4rem)] bg-slate-50"><main className="mx-auto max-w-[1440px] space-y-5 px-4 py-5 sm:px-6 xl:px-8">
    <header className="flex flex-col gap-4 border-b border-slate-200 pb-4 lg:flex-row lg:items-end lg:justify-between"><div><div className="mb-2 text-xs font-bold text-brand-blue">Executive Dashboard</div><h1 className="text-2xl font-black tracking-tight text-brand-navy sm:text-3xl">รายงานผลสัมฤทธิ์และแบบประเมินความพึงพอใจ</h1><p className="mt-1 text-sm text-slate-500">Faculty of Environment and Resource Studies, Mahidol University</p></div><div className="flex items-center gap-3 text-xs text-slate-500"><span>อัปเดตล่าสุด: {formatDate(new Date().toISOString())}</span><button onClick={() => void load(true)} disabled={refreshing} className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 font-bold shadow-sm"><RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />รีเฟรช</button></div></header>
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><div className="mb-4 flex flex-wrap items-center gap-2"><span className="inline-flex items-center gap-2 rounded-lg bg-brand-navy px-3 py-2 text-xs font-extrabold text-white"><Filter className="h-4 w-4" />Activity Mode</span><span className="text-xs font-semibold text-slate-400">ผลสัมฤทธิ์รายกิจกรรม</span></div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(260px,2fr)_150px_150px_150px_auto]"><label><span className="mb-1 block text-xs font-bold text-slate-500">กิจกรรม</span><select value={activity} onChange={(e) => setActivity(e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold"><option value="ALL">ทุกกิจกรรม</option>{activities.map((x) => <option key={x.id} value={x.id}>{x.title}</option>)}</select></label><label><span className="mb-1 block text-xs font-bold text-slate-500">ช่วงเวลา</span><select value={period} onChange={(e) => setPeriod(e.target.value as Period)} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold"><option value="ALL">ทั้งหมด</option><option value="YEAR">รายปี</option><option value="QUARTER">ไตรมาส</option><option value="MONTH">รายเดือน</option><option value="CUSTOM">กำหนดเอง</option></select></label>{period === "YEAR" && <label><span className="mb-1 block text-xs font-bold text-slate-500">ปี</span><select value={year} onChange={(e) => setYear(e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"><option value="ALL">ทุกปี</option>{years.map((x) => <option key={x} value={x}>{x + 543}</option>)}</select></label>}{period === "MONTH" && <label><span className="mb-1 block text-xs font-bold text-slate-500">เดือน</span><input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 px-3" /></label>}{period === "QUARTER" && <label><span className="mb-1 block text-xs font-bold text-slate-500">ไตรมาส</span><select value={quarter} onChange={(e) => setQuarter(e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"><option value="">ทุกไตรมาส</option>{years.flatMap((x) => [1,2,3,4].map((q) => <option key={`${x}-Q${q}`} value={`${x}-Q${q}`}>{x + 543} / Q{q}</option>))}</select></label>}{period === "CUSTOM" && <div className="md:col-span-2"><span className="mb-1 block text-xs font-bold text-slate-500">กำหนดช่วงวันที่</span><div className="flex gap-2"><input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 px-3" /><input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 px-3" /></div></div>}<div className="flex items-end justify-end"><button onClick={reset} className="inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-bold text-slate-500 hover:bg-slate-50"><RotateCcw className="h-4 w-4" />ล้างตัวกรอง</button></div></div></section>
    <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[minmax(0,1fr)_300px]"><div className="flex min-w-0 flex-col sm:flex-row sm:items-center">{image ? <img src={image} alt="" className="h-36 w-full rounded-lg object-cover sm:h-28 sm:w-44" /> : <div className="grid h-36 w-full place-items-center rounded-lg bg-slate-100 text-slate-400 sm:h-28 sm:w-44"><Activity /></div>}<div className="mt-4 min-w-0 sm:ml-5 sm:mt-0"><p className="text-xs font-bold text-brand-blue">กิจกรรมที่กำลังแสดง</p><h2 className="mt-1 text-xl font-black text-brand-navy">{title}</h2><div className="mt-3 flex flex-wrap gap-4 text-sm font-semibold text-slate-500"><span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" />{selected ? formatDate(selected.activity_date) : `${activities.length} กิจกรรม`}</span><span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" />{selected ? "กิจกรรมที่เลือก" : "ภาพรวมทุกกิจกรรม"}</span></div></div></div><div className="rounded-lg bg-slate-50 p-4"><p className="text-xs font-bold text-slate-400">ผู้ตอบแบบประเมิน / ผู้เข้าร่วม</p><p className="mt-1 text-3xl font-black text-brand-navy">{responseCount.toLocaleString("th-TH")} <span className="text-sm text-slate-400">/ {participants.toLocaleString("th-TH")} คน</span></p>{dataMismatch && <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-700"><AlertTriangle className="h-3.5 w-3.5" />ข้อมูลไม่สอดคล้อง: ผู้ตอบมากกว่าผู้เข้าร่วม</p>}</div></section>
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"><Kpi icon={<Users className="h-5 w-5" />} label="ผู้เข้าร่วมกิจกรรมทั้งหมด" value={participants.toLocaleString("th-TH")} suffix="คน" /><Kpi icon={<CheckCircle2 className="h-5 w-5" />} label="ผู้ตอบแบบประเมิน" value={responseCount.toLocaleString("th-TH")} suffix="ชุด" tone="navy" /><Kpi icon={<Users className="h-5 w-5" />} label="จำนวนที่ยังไม่ได้ตอบ" value={pending.toLocaleString("th-TH")} suffix="คน" tone="amber" note={dataMismatch ? "ตรวจสอบจำนวนผู้ตอบกับผู้เข้าร่วม" : undefined} /><Kpi icon={<CheckCircle2 className="h-5 w-5" />} label="อัตราการตอบกลับ" value={responseRate === null ? "-" : responseRate.toFixed(1)} suffix="%" tone="green" /><Kpi icon={<Star className="h-5 w-5" />} label="คะแนนเฉลี่ยความพึงพอใจ" value={overall === null ? "-" : overall.toFixed(2)} suffix="/ 5.00" tone="amber" note={`ระดับ: ${level}`} /></section>
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1.45fr)_minmax(260px,.8fr)]"><div className="space-y-5"><Card title="ผลการประเมินภาพรวม" right={<span className="text-xs font-semibold text-slate-400">มาตราส่วน 1–5</span>}><div className="flex min-h-[250px] items-center justify-center gap-6 p-5"><div className="relative grid h-40 w-40 shrink-0 place-items-center rounded-full" style={{background:`conic-gradient(#0c6fb6 ${overallPercent}%, #e9eef5 0)`}}><div className="grid h-28 w-28 place-items-center rounded-full bg-white text-center"><span className="text-3xl font-black text-brand-navy">{overall === null ? "-" : overall.toFixed(2)}</span><span className="text-xs font-bold text-slate-400">/ 5.00</span></div></div><div className="space-y-3 text-sm"><div><p className="text-xs font-semibold text-slate-400">ผู้ตอบแบบประเมิน</p><p className="text-lg font-black text-brand-navy">{responseCount.toLocaleString("th-TH")} คน</p></div><div><p className="text-xs font-semibold text-slate-400">ผู้เข้าร่วมกิจกรรม</p><p className="text-lg font-black text-brand-navy">{participants.toLocaleString("th-TH")} คน</p></div><div><p className="text-xs font-semibold text-slate-400">Response Rate</p><p className="text-lg font-black text-brand-navy">{responseRate === null ? "-" : `${responseRate.toFixed(1)}%`}</p></div><span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700">{level}</span></div></div></Card><Card title="ข้อมูลทั่วไปของผู้ตอบแบบสอบถาม" right={dimensionOptions.length ? <select value={dimension} onChange={(e) => setDimension(e.target.value as Dimension)} className="h-9 rounded-lg border border-slate-200 px-2 text-xs font-bold">{dimensionOptions.map((x) => <option key={x.key} value={x.key}>{x.label}</option>)}</select> : null}><div className="flex min-h-[250px] flex-col items-center justify-center gap-5 p-5 sm:flex-row">{respondentDistribution.length ? <div className="relative grid h-36 w-36 shrink-0 place-items-center rounded-full" style={{background:`conic-gradient(${respondentDistribution.map(([,count],index)=>{const total=respondentDistribution.reduce((s,[,v])=>s+v,0)||1;const start=respondentDistribution.slice(0,index).reduce((s,[,v])=>s+v,0)/total*100;const end=respondentDistribution.slice(0,index+1).reduce((s,[,v])=>s+v,0)/total*100;return `${COLORS[index]} ${start}% ${end}%`;}).join(", ")}`}}><div className="grid h-24 w-24 place-items-center rounded-full bg-white text-center"><b className="text-xl text-brand-navy">{responses.length}</b><span className="text-[10px] text-slate-400">ผู้ตอบ</span></div></div> : <div className="text-sm text-slate-400">ยังไม่มีข้อมูลทั่วไปของผู้ตอบ</div>}<div className="min-w-0 flex-1 space-y-2.5">{respondentDistribution.map(([label,count],index)=><div key={label} className="flex items-center gap-2 text-xs"><span className="h-3 w-3 shrink-0 rounded-sm" style={{background:COLORS[index]}} /><span className="min-w-0 flex-1 truncate text-slate-600">{label}</span><b className="text-brand-navy">{(count/Math.max(responses.length,1)*100).toFixed(0)}% ({count})</b></div>)}</div></div></Card><Card title="ภาพกิจกรรมล่าสุด" right={<span className="text-xs text-slate-400"><ImageIcon className="mr-1 inline h-3.5 w-3.5" />Activity Media</span>}><div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3">{photos.length ? photos.map((photo)=><figure key={photo.id} className="min-w-0"><img src={photo.image} alt={photo.title} className="aspect-[4/3] w-full rounded-lg object-cover" /><figcaption className="mt-2 truncate text-xs font-bold text-slate-600">{photo.title}</figcaption></figure>) : <p className="col-span-full py-8 text-center text-sm text-slate-400">ยังไม่มีภาพกิจกรรม</p>}</div></Card><Card title="กิจกรรมล่าสุด" right={<span className="text-xs text-slate-400">ล่าสุดจากข้อมูลที่กรอง</span>}><div className="divide-y divide-slate-100">{recentActivities.length ? recentActivities.map(({item,occurrence})=><div key={item.id} className="grid grid-cols-[1fr_auto_auto] gap-3 px-5 py-3 text-xs"><span className="min-w-0 truncate font-bold text-slate-700">{item.title}</span><span className="whitespace-nowrap text-slate-400">{formatDate(occurrence.start_at)}</span><span className="whitespace-nowrap font-black text-brand-navy">{Number(occurrence.participant_count || 0).toLocaleString("th-TH")} คน</span></div>) : <p className="px-5 py-8 text-center text-sm text-slate-400">ยังไม่มีกิจกรรม</p>}</div></Card></div>
      <div className="space-y-5"><Card title="คะแนนประเมินรายด้าน" right={<div className="text-right"><span className="block text-xs font-semibold text-slate-400">มาตราส่วน 1–5</span><span className="block text-[10px] text-slate-400">ค่าเฉลี่ย + จำนวนผู้ตอบของแต่ละข้อ</span></div>}><div className="space-y-3 p-4">{questionScores.map((q,index)=><div key={q.field}><div className="mb-1 flex items-center justify-between gap-3 text-xs"><span className="min-w-0 truncate font-semibold text-slate-600">{index+1}. {q.label}</span><span className="shrink-0 font-black text-brand-navy">{q.value.toFixed(2)} <span className="font-semibold text-slate-400">/ 5.00</span></span></div><div className="h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand-blue" style={{width:`${Math.min(100,q.value/5*100)}%`}} /></div></div>)}{!questionScores.length && <p className="py-8 text-center text-sm text-slate-400">ยังไม่มีข้อมูลคะแนน</p>}</div></Card><Card title="กลุ่มผู้ตอบแบบประเมิน"><div className="space-y-3 p-4">{respondentDistribution.length ? respondentDistribution.map(([label,count])=><div key={label}><div className="mb-1 flex justify-between gap-3 text-xs"><span className="truncate text-slate-600">{label}</span><b className="text-brand-navy">{count.toLocaleString("th-TH")} คน</b></div><div className="h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand-blue" style={{width:`${Math.min(100,count/Math.max(responses.length,1)*100)}%`}} /></div></div>) : <p className="py-8 text-center text-sm text-slate-400">ยังไม่มีข้อมูลกลุ่มผู้ตอบ</p>}</div></Card><Card title="ช่องทางการรับรู้กิจกรรม" right={<div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400"><Megaphone className="h-3.5 w-3.5" />{channelMultiple ? "อาจเลือกได้หลายช่องทาง" : "จากข้อมูลแบบประเมิน"}</div>}><div className="space-y-3 p-4">{channelDistribution.length ? channelDistribution.map((item) => <div key={item.label} className="grid grid-cols-[20px_68px_1fr_58px] items-center gap-2 text-xs"><span className="grid h-5 w-5 place-items-center rounded-full bg-slate-100 text-[10px] font-black text-brand-blue"><span>{channelMeta[item.label]}</span></span><span className="font-semibold text-slate-600">{item.label}</span><div className="h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand-blue" style={{width:`${Math.min(100,channelTotal?item.count/channelTotal*100:0)}%`}} /></div><span className="text-right font-bold text-slate-500">{item.count} <span className="text-[10px]">({(item.count/Math.max(channelTotal,1)*100).toFixed(1)}%)</span></span></div>) : <p className="py-8 text-center text-sm text-slate-400">ยังไม่มีข้อมูลช่องทางการรับรู้</p>}</div></Card></div>
      <div className="space-y-5"><Card title="การกระจายคะแนน"><div className="space-y-4 p-4">{scoreDistribution.map((item)=><div key={item.value} className="grid grid-cols-[22px_1fr_72px] items-center gap-3 text-xs"><b className="text-brand-navy">{item.value}</b><div className="h-3 rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand-blue" style={{width:`${item.percent}%`}} /></div><span className="text-right font-bold text-slate-500">{item.count} ({item.percent.toFixed(1)}%)</span></div>)}{!responseCount && <p className="py-2 text-center text-[11px] text-slate-400">ยังไม่มีผลประเมิน</p>}</div></Card><Card title="Executive Highlights"><div className="space-y-3 p-4"><div className="rounded-lg border border-emerald-100 bg-emerald-50/60 p-3"><div className="flex items-center gap-2 text-xs font-bold text-emerald-700"><Trophy className="h-4 w-4" />หัวข้อคะแนนสูงสุด</div><p className="mt-2 text-sm font-black text-emerald-800">{highest ? `${highest.label} · ${highest.value.toFixed(2)} / 5.00` : "-"}</p></div><div className="rounded-lg border border-amber-100 bg-amber-50/70 p-3"><div className="flex items-center gap-2 text-xs font-bold text-amber-700"><AlertTriangle className="h-4 w-4" />หัวข้อที่ควรติดตาม</div><p className="mt-2 text-sm font-black text-amber-800">{lowest ? `${lowest.label} · ${lowest.value.toFixed(2)} / 5.00` : "-"}</p></div><div className="grid grid-cols-2 gap-2"><div className="rounded-lg bg-slate-50 p-3"><p className="text-xs font-bold text-slate-400">ผู้ตอบ</p><p className="mt-1 text-lg font-black text-brand-navy">{responseCount.toLocaleString("th-TH")} คน</p></div><div className="rounded-lg bg-slate-50 p-3"><p className="text-xs font-bold text-slate-400">Response Rate</p><p className="mt-1 text-lg font-black text-brand-navy">{responseRate === null ? "-" : `${responseRate.toFixed(1)}%`}</p></div></div></div></Card><Card title="ความคิดเห็นจากผู้ตอบ" right={<MessageSquareQuote className="h-4 w-4 text-slate-400" />}><div className="space-y-3 p-4">{comments.length ? comments.map((comment,index)=><blockquote key={`${comment}-${index}`} className="rounded-lg border-l-4 border-brand-blue bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600">“{comment}”</blockquote>) : <p className="py-8 text-center text-sm text-slate-400">ยังไม่มีความคิดเห็น</p>}</div></Card></div>
    </section>
  </main></div>;
}
