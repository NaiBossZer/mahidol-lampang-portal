import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  Calendar,
  CheckCircle2,
  Filter,
  Image as ImageIcon,
  MapPin,
  RefreshCw,
  RotateCcw,
  Users,
} from "lucide-react";
import {
  getAdminDashboardData,
  type AdminDashboardData,
  type DashboardResponse,
} from "@/services/api";

type Period = "ALL" | "YEAR" | "QUARTER" | "MONTH" | "CUSTOM";
type RespondentDimension = "age_group" | "affiliation" | "organization";

const SCORE_FIELDS = [
  "p2_location",
  "p2_schedule",
  "p2_readiness",
  "p2_reception",
  "p2_overall",
  "p3_interest",
  "p3_content",
  "p3_clarity",
  "p3_benefit",
  "p3_application",
  "p4_knowledge",
  "p4_inspiration",
  "p4_community_resource",
  "p4_future_return",
] as const;

const TOPICS = [
  {
    key: "event",
    label: "การจัดงานและสถานที่",
    fields: SCORE_FIELDS.slice(0, 5),
    tone: "bg-brand-navy",
  },
  {
    key: "learning",
    label: "เนื้อหาและการเรียนรู้",
    fields: SCORE_FIELDS.slice(5, 10),
    tone: "bg-brand-blue",
  },
  {
    key: "impact",
    label: "ผลลัพธ์และการต่อยอด",
    fields: SCORE_FIELDS.slice(10),
    tone: "bg-emerald-500",
  },
] as const;

function score(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 1 && n <= 5 ? n : null;
}

function average(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}

function dateMatches(
  value: string,
  period: Period,
  year: string,
  month: string,
  quarter: string,
  from: string,
  to: string,
) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  if (period === "ALL") return true;
  if (period === "YEAR") return year === "ALL" || date.getFullYear().toString() === year;
  if (period === "MONTH") return !month || value.slice(0, 7) === month;
  if (period === "QUARTER") {
    return (
      !quarter ||
      `${date.getFullYear()}-Q${Math.floor(date.getMonth() / 3) + 1}` === quarter
    );
  }
  const day = value.slice(0, 10);
  return (!from || day >= from) && (!to || day <= to);
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
  const [center, setCenter] = useState("ALL");
  const [organization, setOrganization] = useState("ALL");
  const [respondentDimension, setRespondentDimension] =
    useState<RespondentDimension>("age_group");

  const load = async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      setData(await getAdminDashboardData());
    } catch (e) {
      setError(e instanceof Error ? e.message : "ไม่สามารถโหลด Dashboard ได้");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const years = useMemo(
    () =>
      [...new Set((data?.occurrences ?? []).map((item) => new Date(item.start_at).getFullYear()))]
        .filter(Number.isFinite)
        .sort((a, b) => b - a),
    [data],
  );

  const baseOccurrences = useMemo(
    () =>
      (data?.occurrences ?? []).filter(
        (item) =>
          item.status !== "cancelled" &&
          item.status !== "archived" &&
          dateMatches(item.start_at, period, year, month, quarter, from, to),
      ),
    [data, period, year, month, quarter, from, to],
  );

  const centerActivityIds = useMemo(
    () =>
      new Set(
        (data?.activityLearningCenters ?? [])
          .filter((item) => center === "ALL" || item.learning_center_id === center)
          .map((item) => item.activity_id),
      ),
    [data, center],
  );

  const activities = useMemo(
    () =>
      (data?.activities ?? [])
        .filter((item) => baseOccurrences.some((occurrence) => occurrence.activity_id === item.id))
        .filter((item) => center === "ALL" || centerActivityIds.has(item.id))
        .filter((item) => activity === "ALL" || item.id === activity),
    [data, baseOccurrences, center, centerActivityIds, activity],
  );

  const activityIds = useMemo(() => new Set(activities.map((item) => item.id)), [activities]);

  const occurrences = useMemo(
    () => baseOccurrences.filter((item) => activityIds.has(item.activity_id)),
    [baseOccurrences, activityIds],
  );

  const selectedActivity = useMemo(
    () => data?.activities.find((item) => item.id === activity),
    [data, activity],
  );

  const responses = useMemo(() => {
    const occurrenceIds = new Set(occurrences.map((item) => item.id));
    return (data?.responses ?? [])
      .filter((response) =>
        response.occurrence_id
          ? occurrenceIds.has(response.occurrence_id)
          : activityIds.has(response.activity_id),
      )
      .filter(
        (response) =>
          organization === "ALL" || response.participant_organization_id === organization,
      );
  }, [data, occurrences, activityIds, organization]);

  const participants = useMemo(
    () => occurrences.reduce((sum, item) => sum + Number(item.participant_count || 0), 0),
    [occurrences],
  );

  const responseCount = responses.length;
  const rawRate = participants > 0 ? (responseCount / participants) * 100 : null;
  const responseRate = rawRate === null ? null : Math.min(rawRate, 100);
  const hasDataMismatch = rawRate !== null && rawRate > 100;

  const allScores = responses.flatMap((response) =>
    SCORE_FIELDS.map((field) => score(response[field])).filter(
      (value): value is number => value !== null,
    ),
  );
  const overallAverage = average(allScores);

  const topicScores = TOPICS.map((topic) => {
    const values = topic.fields.flatMap((field) =>
      responses.map((response) => score(response[field])).filter(
        (value): value is number => value !== null,
      ),
    );
    const avg = average(values);
    return { ...topic, avg, percent: avg === null ? 0 : (avg / 5) * 100 };
  });

  const questionScores = SCORE_FIELDS.map((field, index) => {
    const values = responses
      .map((response) => score(response[field]))
      .filter((value): value is number => value !== null);
    return { field, index, avg: average(values) };
  }).filter((item) => item.avg !== null) as { field: string; index: number; avg: number }[];

  const highestScore = questionScores.length
    ? [...questionScores].sort((a, b) => b.avg - a.avg)[0]
    : null;
  const lowestScore = questionScores.length
    ? [...questionScores].sort((a, b) => a.avg - b.avg)[0]
    : null;

  const respondentOptions = useMemo(() => {
    const options: { key: RespondentDimension; label: string; available: boolean }[] = [
      {
        key: "age_group",
        label: "ช่วงอายุ",
        available: responses.some((response) => Boolean(response.age_group)),
      },
      {
        key: "affiliation",
        label: "ประเภทผู้ตอบ",
        available: responses.some((response) => Boolean(response.affiliation)),
      },
      {
        key: "organization",
        label: "หน่วยงาน",
        available:
          responses.some((response) => Boolean(response.participant_organization_id)) &&
          (data?.organizations.length ?? 0) > 0,
      },
    ];
    return options.filter((option) => option.available);
  }, [responses, data]);

  useEffect(() => {
    if (
      respondentOptions.length &&
      !respondentOptions.some((option) => option.key === respondentDimension)
    ) {
      setRespondentDimension(respondentOptions[0].key);
    }
  }, [respondentOptions, respondentDimension]);

  const respondentDistribution = useMemo(() => {
    const counts = new Map<string, number>();
    for (const response of responses) {
      let rawValue: string | null | undefined;
      if (respondentDimension === "age_group") rawValue = response.age_group;
      else if (respondentDimension === "affiliation") rawValue = response.affiliation;
      else {
        rawValue = data?.organizations.find(
          (organizationItem) => organizationItem.id === response.participant_organization_id,
        )?.name;
      }
      const value = rawValue?.trim();
      if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
    }

    const items = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    const visible = items.slice(0, 5);
    const other = items.slice(5).reduce((sum, [, count]) => sum + count, 0);
    if (other > 0) visible.push(["อื่น ๆ", other]);

    const total = visible.reduce((sum, [, count]) => sum + count, 0);
    const colors = ["#123F82", "#2F80ED", "#16A085", "#F59E0B", "#8B5CF6", "#94A3B8"];
    let cursor = 0;
    const segments = visible.map(([label, count], index) => {
      const start = cursor;
      const percent = total ? (count / total) * 100 : 0;
      cursor += percent;
      return { label, count, percent, color: colors[index % colors.length], start, end: cursor };
    });
    return { segments, total };
  }, [responses, respondentDimension, data]);

  const ratingDistribution = useMemo(() => {
    const counts = [5, 4, 3, 2, 1].map((rating) => ({ rating, count: 0 }));
    for (const response of responses) {
      const values = SCORE_FIELDS.map((field) => score(response[field])).filter(
        (value): value is number => value !== null,
      );
      for (const value of values) {
        const row = counts.find((item) => item.rating === value);
        if (row) row.count += 1;
      }
    }
    const total = counts.reduce((sum, item) => sum + item.count, 0);
    return counts.map((item) => ({ ...item, percent: total ? (item.count / total) * 100 : 0 }));
  }, [responses]);

  const photos = useMemo(() => {
    if (activity !== "ALL") {
      const media = (data?.activityMedia ?? [])
        .filter((item) => item.activity_id === activity)
        .sort((a, b) => a.display_order - b.display_order);
      const featured = selectedActivity?.featured_image;
      return [
        ...(featured ? [{ id: `${activity}-featured`, title: selectedActivity?.title || "กิจกรรม", image: featured }] : []),
        ...media.map((item) => ({ id: item.id, title: item.caption || selectedActivity?.title || "กิจกรรม", image: item.public_url })),
      ].slice(0, 4);
    }
    return (data?.activities ?? [])
      .filter((item) => item.featured_image)
      .slice(0, 4)
      .map((item) => ({ id: item.id, title: item.title, image: item.featured_image as string }));
  }, [activity, data, selectedActivity]);

  const recent = [...occurrences]
    .sort((a, b) => new Date(b.start_at).getTime() - new Date(a.start_at).getTime())
    .slice(0, 4);

  const reset = () => {
    setActivity("ALL");
    setPeriod("ALL");
    setYear("ALL");
    setMonth("");
    setQuarter("");
    setFrom("");
    setTo("");
    setCenter("ALL");
    setOrganization("ALL");
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    if (activity === "ALL") url.searchParams.delete("activity");
    else url.searchParams.set("activity", activity);
    window.history.replaceState({}, "", url);
  }, [activity]);

  if (loading) {
    return <div className="grid min-h-[60vh] place-items-center text-sm font-semibold text-slate-500">กำลังโหลดผลการดำเนินงาน...</div>;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
          <Activity className="mx-auto h-8 w-8 text-rose-600" />
          <h1 className="mt-3 font-bold text-rose-900">ไม่สามารถโหลด Dashboard ได้</h1>
          <p className="mt-2 text-sm text-rose-700">{error}</p>
          <button onClick={() => void load()} className="mt-5 rounded-xl bg-brand-navy px-5 py-2 text-sm font-bold text-white">ลองใหม่อีกครั้ง</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50/70 text-slate-900">
      <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 xl:px-8">
        <header className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-brand-blue">
              MAHIDOL SOCIAL ENGAGEMENT <span className="text-slate-300">·</span>
              <span className="font-medium text-slate-500">EXECUTIVE OVERVIEW</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl">
              {activity === "ALL" ? "ภาพรวมผลการดำเนินงาน" : "ผลการดำเนินงานรายกิจกรรม"}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {activity === "ALL" ? "ภาพรวมกิจกรรม แบบประเมิน ผู้ตอบ และผลประเมินของทั้งระบบ" : "ข้อมูลทั้งหมดถูกกรองตามกิจกรรมที่เลือก"}
            </p>
          </div>
          <button onClick={() => void load(true)} disabled={refreshing} className="inline-flex h-9 items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 lg:self-auto">
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />รีเฟรชข้อมูล
          </button>
        </header>

        <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-3 shadow-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-1 text-xs font-bold text-brand-navy"><Filter className="h-4 w-4 text-brand-blue" />ตัวกรอง</span>
            <select value={period} onChange={(e) => setPeriod(e.target.value as Period)} className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs"><option value="ALL">ทุกช่วงเวลา</option><option value="YEAR">รายปี</option><option value="QUARTER">รายไตรมาส</option><option value="MONTH">รายเดือน</option><option value="CUSTOM">กำหนดวันที่</option></select>
            {period === "YEAR" && <select value={year} onChange={(e) => setYear(e.target.value)} className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs"><option value="ALL">ทุกปี</option>{years.map((item) => <option key={item} value={item}>{item + 543}</option>)}</select>}
            {period === "QUARTER" && <select value={quarter} onChange={(e) => setQuarter(e.target.value)} className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs"><option value="">ทุกไตรมาส</option>{years.flatMap((item) => [1, 2, 3, 4].map((q) => <option key={`${item}-Q${q}`} value={`${item}-Q${q}`}>Q{q} / {item + 543}</option>))}</select>}
            {period === "MONTH" && <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs" />}
            {period === "CUSTOM" && <><input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-2 text-xs" /><input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-2 text-xs" /></>}
            <select value={center} onChange={(e) => setCenter(e.target.value)} className="h-10 max-w-[200px] rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs"><option value="ALL">ทุก Learning Center</option>{data?.learningCenters.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
            <select value={activity} onChange={(e) => setActivity(e.target.value)} className="h-10 min-w-[220px] max-w-[320px] rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs"><option value="ALL">ทุกกิจกรรม</option>{data?.activities.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select>
            <select value={organization} onChange={(e) => setOrganization(e.target.value)} className="h-10 max-w-[220px] rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs"><option value="ALL">ทุกหน่วยงานผู้ตอบ</option>{data?.organizations.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
            <button onClick={reset} className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-600"><RotateCcw className="h-3.5 w-3.5" />รีเซ็ต</button>
          </div>
        </section>

        {selectedActivity && (
          <section className="mb-5 overflow-hidden rounded-2xl border border-brand-blue/40 bg-white shadow-xs">
            <div className="grid md:grid-cols-[250px_1fr]">
              {photos[0] ? <img src={photos[0].image} alt={photos[0].title} className="h-40 w-full object-cover md:h-full" /> : <div className="grid min-h-40 place-items-center bg-slate-100 text-xs text-slate-400">ยังไม่มีภาพกิจกรรม</div>}
              <div className="p-5"><div className="text-[10px] font-bold tracking-wider text-brand-blue">SELECTED ACTIVITY</div><h2 className="mt-1 text-xl font-bold text-brand-navy">{selectedActivity.title}</h2><div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500"><span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Intl.DateTimeFormat("th-TH", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(selectedActivity.activity_date))}</span><span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />กิจกรรมที่เลือก</span></div></div>
            </div>
          </section>
        )}

        <section className="mb-5 grid grid-cols-2 gap-3.5 md:grid-cols-4">
          <Metric label="กิจกรรมที่จัดจริง" value={occurrences.length.toLocaleString()} icon={<Calendar className="h-4 w-4" />} />
          <Metric label="ผู้เข้าร่วมกิจกรรม" value={participants.toLocaleString()} icon={<Users className="h-4 w-4" />} />
          <Metric label="ผู้ตอบแบบประเมิน" value={responseCount.toLocaleString()} icon={<CheckCircle2 className="h-4 w-4" />} />
          <Metric label="อัตราการตอบกลับ" value={responseRate === null ? "—" : `${responseRate.toFixed(1)}%`} icon={<Users className="h-4 w-4" />} />
        </section>

        {hasDataMismatch && <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900"><strong>ตรวจสอบข้อมูล:</strong> จำนวนคำตอบ ({responseCount}) มากกว่าจำนวนผู้เข้าร่วม ({participants}) จึงไม่แสดง Response Rate เกิน 100%</div>}

        <section className="mb-5 grid gap-5 lg:grid-cols-[1.05fr_1.25fr_0.9fr]">
          <Panel title="ข้อมูลทั่วไปของผู้ตอบแบบสอบถาม" subtitle="RESPONDENT PROFILE">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500">เลือกข้อมูลที่ต้องการแสดง</span>
              <select value={respondentDimension} onChange={(e) => setRespondentDimension(e.target.value as RespondentDimension)} disabled={!respondentOptions.length} className="h-9 max-w-[150px] rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-[11px] font-semibold text-slate-700">
                {respondentOptions.map((option) => <option key={option.key} value={option.key}>{option.label}</option>)}
              </select>
            </div>
            {respondentDistribution.total ? <div className="grid grid-cols-[150px_1fr] items-center gap-4">
              <div className="relative mx-auto h-36 w-36 rounded-full" style={{ background: `conic-gradient(${respondentDistribution.segments.map((segment) => `${segment.color} ${segment.start}% ${segment.end}%`).join(", ")})` }}>
                <div className="absolute inset-[14px] grid place-items-center rounded-full bg-white text-center shadow-inner"><div><div className="font-numeric text-2xl font-bold text-brand-navy">{respondentDistribution.total.toLocaleString()}</div><div className="text-[10px] text-slate-500">ผู้ตอบ</div></div></div>
              </div>
              <div className="space-y-2.5">{respondentDistribution.segments.map((segment) => <div key={segment.label} className="flex items-start gap-2"><span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: segment.color }} /><div className="min-w-0 flex-1"><div className="flex justify-between gap-2 text-[11px]"><span className="truncate text-slate-600">{segment.label}</span><b className="shrink-0 text-slate-800">{segment.count} คน</b></div><div className="mt-0.5 text-right text-[10px] text-slate-400">{segment.percent.toFixed(1)}%</div></div></div>)}</div>
            </div> : <Empty text={respondentOptions.length ? "ยังไม่มีข้อมูลทั่วไปของผู้ตอบ" : "แบบสอบถามชุดนี้ไม่มีข้อมูลทั่วไปที่ใช้แสดง"} />}
          </Panel>

          <Panel title="คะแนนผลการประเมินรายหัวข้อ" subtitle="EVALUATION BY QUESTION">
            <div className="space-y-4">{topicScores.flatMap((topic) => topic.fields.map((field) => ({ topic, field }))).slice(0, 5).map(({ topic, field }, index) => {
              const values = responses.map((response) => score(response[field])).filter((value): value is number => value !== null);
              const avg = average(values);
              return <div key={field}><div className="flex items-center justify-between gap-3 text-xs font-semibold"><span className="truncate">{index + 1}. {questionLabel(field)}</span><span className="shrink-0 text-brand-navy">{avg === null ? "—" : `${avg.toFixed(2)} / 5.00`}</span></div><div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${topic.tone}`} style={{ width: `${avg === null ? 0 : (avg / 5) * 100}%` }} /></div></div>;
            })}</div>
          </Panel>

          <Panel title="การกระจายคะแนน" subtitle="RATING DISTRIBUTION">
            <div className="space-y-3">{ratingDistribution.map((item) => <div key={item.rating}><div className="flex items-center justify-between text-[11px] font-semibold"><span>{item.rating} คะแนน</span><span>{item.count.toLocaleString()} คน ({item.percent.toFixed(1)}%)</span></div><div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand-blue" style={{ width: `${item.percent}%` }} /></div></div>)}</div>
            <div className="mt-5 rounded-xl bg-emerald-50 p-3"><div className="text-[10px] font-semibold text-emerald-700">คะแนนเฉลี่ยโดยรวม</div><div className="mt-1 font-numeric text-2xl font-bold text-emerald-800">{overallAverage === null ? "—" : `${overallAverage.toFixed(2)} / 5.00`}</div><div className="mt-0.5 text-[10px] text-emerald-700">จากข้อมูลผู้ตอบ {responseCount.toLocaleString()} คน</div></div>
          </Panel>
        </section>

        <section className="mb-5 grid gap-5 lg:grid-cols-[1.2fr_1.2fr_0.8fr]">
          <Panel title="ผลด้านการเรียนรู้และเนื้อหา" subtitle="LEARNING & CONTENT"><ScoreList fields={SCORE_FIELDS.slice(5, 10)} responses={responses} /></Panel>
          <Panel title="ผลที่ได้รับจากกิจกรรม" subtitle="OUTCOME & IMPACT"><ScoreList fields={SCORE_FIELDS.slice(10)} responses={responses} /></Panel>
          <Panel title="จุดเด่นและจุดที่ควรติดตาม" subtitle="EXECUTIVE SNAPSHOT">
            <Mini label="คะแนนสูงสุด" value={highestScore ? `${highestScore.avg.toFixed(2)} / 5.00` : "—"} />
            <Mini label="คะแนนต่ำสุด" value={lowestScore ? `${lowestScore.avg.toFixed(2)} / 5.00` : "—"} />
            <Mini label="ผู้ตอบแบบประเมิน" value={`${responseCount.toLocaleString()} คน`} />
            <Mini label="อัตราการตอบกลับ" value={responseRate === null ? "—" : `${responseRate.toFixed(1)}%`} />
          </Panel>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <Panel title="ความคิดเห็นและข้อเสนอแนะจากผู้ตอบ" subtitle="ANONYMOUS COMMENTS">
            {responses.filter((response) => response.feedback?.trim()).slice(0, 4).length ? <div className="space-y-2.5">{responses.filter((response) => response.feedback?.trim()).slice(0, 4).map((response) => <div key={response.id} className="rounded-xl bg-slate-50 p-3.5 text-xs leading-6 text-slate-700">“{response.feedback?.trim()}”</div>)}</div> : <Empty text="ยังไม่มีความคิดเห็นจากผู้ตอบ" />}
          </Panel>
          <Panel title="คลังภาพบรรยากาศกิจกรรมที่เลือก" subtitle="ACTIVITY DOCUMENTATION" badge={`${photos.length} ภาพ`}>
            {photos.length ? <div className="grid grid-cols-2 gap-2.5">{photos.map((photo) => <figure key={photo.id} className="overflow-hidden rounded-xl border border-slate-200"><img src={photo.image} alt={photo.title} className="aspect-[4/3] w-full object-cover" /><figcaption className="truncate px-2.5 py-2 text-[11px] font-semibold text-slate-700">{photo.title}</figcaption></figure>)}</div> : <Empty text="ยังไม่มีภาพกิจกรรม" />}
          </Panel>
        </section>

        <section className="mt-5"><Panel title="กิจกรรมล่าสุด" subtitle="RECENT OCCURRENCES"><div className="divide-y divide-slate-100">{recent.length ? recent.map((item) => <div key={item.id} className="flex items-center justify-between gap-4 py-3"><div className="min-w-0"><p className="truncate text-xs font-bold">{data?.activities.find((activityItem) => activityItem.id === item.activity_id)?.title || "กิจกรรม"}</p><p className="mt-1 text-[11px] text-slate-500">{new Intl.DateTimeFormat("th-TH", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(item.start_at))} · {item.location_detail || "มหิดล ลำปาง"}</p></div><span className="shrink-0 rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-bold">{item.participant_count.toLocaleString()} คน</span></div>) : <Empty text="ยังไม่มีข้อมูลกิจกรรม" />}</div></Panel></section>
      </main>
    </div>
  );
}

function questionLabel(field: string) {
  const labels: Record<string, string> = {
    p2_location: "ความเหมาะสมของสถานที่จัดงาน",
    p2_schedule: "ความเหมาะสมของกำหนดการและระยะเวลา",
    p2_readiness: "ความพร้อมและความเป็นระเบียบของสถานที่",
    p2_reception: "การต้อนรับและการอำนวยความสะดวก",
    p2_overall: "ความพึงพอใจต่อการจัดกิจกรรมโดยรวม",
    p3_interest: "ความน่าสนใจของเนื้อหาและการเรียนรู้",
    p3_content: "ความเหมาะสมและความครบถ้วนของเนื้อหา",
    p3_clarity: "ความชัดเจนและเข้าใจง่ายของสื่อ",
    p3_benefit: "ประโยชน์ขององค์ความรู้ที่ได้รับ",
    p3_application: "ความสามารถในการนำความรู้ไปต่อยอด",
    p4_knowledge: "ได้รับความรู้และความเข้าใจเพิ่มขึ้น",
    p4_inspiration: "แรงบันดาลใจจากกิจกรรม",
    p4_community_resource: "ประโยชน์ต่อชุมชนและผู้สนใจ",
    p4_future_return: "ความสนใจเข้าร่วมกิจกรรมอีกในอนาคต",
  };
  return labels[field] || field;
}

function ScoreList({ fields, responses }: { fields: readonly string[]; responses: DashboardResponse[] }) {
  return <div className="space-y-4">{fields.map((field, index) => { const values = responses.map((response) => score(response[field as keyof DashboardResponse])).filter((value): value is number => value !== null); const avg = average(values); return <div key={field}><div className="flex justify-between gap-3 text-xs font-semibold"><span className="truncate">{index + 1}. {questionLabel(field)}</span><span className="shrink-0 text-brand-navy">{avg === null ? "—" : `${avg.toFixed(2)} / 5.00`}</span></div><div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand-blue" style={{ width: `${avg === null ? 0 : (avg / 5) * 100}%` }} /></div></div>; })}</div>;
}

function Metric({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs"><span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-blue/10 text-brand-blue">{icon}</span><div className="mt-3 font-numeric text-2xl font-bold tracking-tight text-slate-900">{value}</div><div className="mt-1 text-xs font-semibold text-slate-600">{label}</div></div>;
}

function Panel({ title, subtitle, badge, children }: { title: string; subtitle: string; badge?: string; children: ReactNode }) {
  return <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs"><header className="mb-5 flex items-start justify-between border-b border-slate-100 pb-3"><div><h2 className="text-sm font-bold text-brand-navy">{title}</h2><p className="mt-0.5 text-[10px] font-semibold tracking-wider text-slate-500">{subtitle}</p></div>{badge && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">{badge}</span>}</header>{children}</section>;
}

function Mini({ label, value }: { label: string; value: string }) {
  return <div className="mb-2.5 flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-3"><span className="text-xs text-slate-600">{label}</span><b className="font-numeric text-sm text-brand-navy">{value}</b></div>;
}

function Empty({ text }: { text: string }) {
  return <div className="grid min-h-32 place-items-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-500">{text}</div>;
}
