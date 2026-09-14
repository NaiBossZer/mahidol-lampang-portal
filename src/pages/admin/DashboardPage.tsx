import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  Calendar,
  CheckCircle2,
  Filter,
  Layers,
  MapPin,
  RefreshCw,
  RotateCcw,
  Search,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  getAdminDashboardData,
  type AdminDashboardData,
  type DashboardResponse,
} from "@/services/api";

type Period = "ALL" | "YEAR" | "QUARTER" | "MONTH" | "CUSTOM";
type ScoreField = keyof Pick<
  DashboardResponse,
  | "p2_location"
  | "p2_schedule"
  | "p2_readiness"
  | "p2_reception"
  | "p2_overall"
  | "p3_interest"
  | "p3_content"
  | "p3_clarity"
  | "p3_benefit"
  | "p3_application"
  | "p4_knowledge"
  | "p4_inspiration"
  | "p4_community_resource"
  | "p4_future_return"
>;

const SCORE_FIELDS: ScoreField[] = [
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
];

const TOPICS = [
  {
    key: "event",
    label: "การจัดงานและสถานที่",
    fields: SCORE_FIELDS.slice(0, 5),
    color: "bg-brand-navy",
  },
  {
    key: "learning",
    label: "เนื้อหาและการเรียนรู้",
    fields: SCORE_FIELDS.slice(5, 10),
    color: "bg-brand-blue",
  },
  {
    key: "impact",
    label: "ผลกระทบและการต่อยอด",
    fields: SCORE_FIELDS.slice(10),
    color: "bg-emerald-600",
  },
] as const;

function numericScore(value: unknown) {
  const valueAsNumber = Number(value);
  return Number.isFinite(valueAsNumber) && valueAsNumber >= 1 && valueAsNumber <= 5
    ? valueAsNumber
    : null;
}

function monthKey(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function inPeriod(
  value: string,
  period: Period,
  month: string,
  quarter: string,
  year: string,
  from: string,
  to: string,
) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  if (period === "ALL") return true;
  if (period === "YEAR") return String(date.getFullYear()) === year;
  if (period === "MONTH") return !month || monthKey(value) === month;
  if (period === "QUARTER") {
    return `${date.getFullYear()}-Q${Math.floor(date.getMonth() / 3) + 1}` === quarter;
  }
  const day = value.slice(0, 10);
  return (!from || day >= from) && (!to || day <= to);
}

function calculateSatisfaction(responses: DashboardResponse[]) {
  let sum = 0;
  let count = 0;
  for (const response of responses) {
    for (const field of SCORE_FIELDS) {
      const value = numericScore(response[field]);
      if (value !== null) {
        sum += value;
        count += 1;
      }
    }
  }
  return {
    average: count ? sum / count : null,
    percent: count ? (sum / (count * 5)) * 100 : null,
  };
}

export function DashboardPage() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
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
  const [query, setQuery] = useState("");

  const load = async (silent = false) => {
    if (!silent) setLoading(true);
    else setIsRefreshing(true);
    setError("");
    try {
      setData(await getAdminDashboardData());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "ไม่สามารถโหลด Dashboard ได้");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    void load();
    const refresh = () => void load(true);
    window.addEventListener("dashboard:refresh", refresh);
    return () => window.removeEventListener("dashboard:refresh", refresh);
  }, []);

  const years = useMemo(
    () =>
      [...new Set((data?.occurrences ?? []).map((item) => new Date(item.start_at).getFullYear()))]
        .filter(Number.isFinite)
        .sort((a, b) => b - a),
    [data],
  );

  const occurrences = useMemo(
    () =>
      (data?.occurrences ?? []).filter(
        (item) =>
          item.status !== "cancelled" &&
          item.status !== "archived" &&
          inPeriod(item.start_at, period, month, quarter, year === "ALL" ? "" : year, from, to),
      ),
    [data, period, month, quarter, year, from, to],
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
        .filter((item) => occurrences.some((occurrence) => occurrence.activity_id === item.id))
        .filter((item) => activity === "ALL" || item.id === activity)
        .filter((item) => center === "ALL" || centerActivityIds.has(item.id))
        .filter((item) =>
          `${item.title} ${item.category ?? ""}`.toLowerCase().includes(query.toLowerCase()),
        ),
    [data, occurrences, activity, center, centerActivityIds, query],
  );

  const activityIds = useMemo(() => new Set(activities.map((item) => item.id)), [activities]);
  const filteredOccurrences = useMemo(
    () => occurrences.filter((item) => activityIds.has(item.activity_id)),
    [occurrences, activityIds],
  );

  const responses = useMemo(() => {
    const occurrenceIds = new Set(filteredOccurrences.map((item) => item.id));
    return (data?.responses ?? [])
      .filter((item) =>
        item.occurrence_id
          ? occurrenceIds.has(item.occurrence_id)
          : activityIds.has(item.activity_id),
      )
      .filter(
        (item) => organization === "ALL" || item.participant_organization_id === organization,
      );
  }, [data, filteredOccurrences, activityIds, organization]);

  const satisfaction = useMemo(() => calculateSatisfaction(responses), [responses]);
  const evaluatedActivities = useMemo(
    () => new Set(responses.map((item) => item.activity_id)).size,
    [responses],
  );

  const topicScores = useMemo(
    () =>
      TOPICS.map((topic) => {
        const values = topic.fields.flatMap((field) =>
          responses
            .map((item) => numericScore(item[field]))
            .filter((value): value is number => value !== null),
        );
        const average = values.length
          ? values.reduce((total, value) => total + value, 0) / values.length
          : null;
        return {
          ...topic,
          average,
          percent: average === null ? null : (average / 5) * 100,
        };
      }),
    [responses],
  );

  const photos = useMemo(
    () => activities.filter((item) => item.featured_image).slice(0, 4),
    [activities],
  );

  const recent = useMemo(
    () =>
      [...filteredOccurrences]
        .sort((a, b) => new Date(b.start_at).getTime() - new Date(a.start_at).getTime())
        .slice(0, 5),
    [filteredOccurrences],
  );

  const participants = filteredOccurrences.reduce(
    (total, item) => total + Number(item.participant_count || 0),
    0,
  );
  const responseRate = participants ? (responses.length / participants) * 100 : null;

  const reset = () => {
    setPeriod("ALL");
    setYear("ALL");
    setMonth("");
    setQuarter("");
    setFrom("");
    setTo("");
    setCenter("ALL");
    setOrganization("ALL");
    setActivity("ALL");
    setQuery("");
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-6 sm:p-8 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-rose-100 text-rose-700">
            <Activity className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-lg font-bold text-rose-900">ไม่สามารถโหลด Dashboard ได้</h1>
          <p className="mt-2 text-sm text-rose-700 max-w-md mx-auto">{error}</p>
          <button
            type="button"
            onClick={() => void load()}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-brand-navy/90 focus-visible:outline-2 focus-visible:outline-brand-blue cursor-pointer transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50/70 text-slate-900">
      <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 xl:px-8">
        {/* Header section */}
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-blue">
                MAHIDOL SOCIAL ENGAGEMENT
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-[11px] font-medium text-slate-500">EXECUTIVE OVERVIEW</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl">
              ภาพรวมผลการดำเนินงาน
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              ติดตามสถิติกิจกรรม ผลการประเมินความพึงพอใจ และผลกระทบต่อชุมชนลำปาง
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200/80 bg-emerald-50/80 px-3 py-1.5 text-xs font-medium text-emerald-800">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
              </span>
              ข้อมูลพร้อมใช้งาน
            </div>
            <button
              type="button"
              onClick={() => void load(true)}
              disabled={isRefreshing}
              title="รีเฟรชข้อมูล"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-xs hover:bg-slate-50 hover:text-brand-navy focus-visible:outline-2 focus-visible:outline-brand-blue disabled:opacity-50 cursor-pointer transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin text-brand-blue" : ""}`} />
            </button>
          </div>
        </header>

        {/* Filter Toolbar */}
        <section className="mb-6 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-navy pr-1">
              <Filter className="h-4 w-4 text-brand-blue" />
              <span>ตัวกรอง:</span>
            </div>

            {/* Period select */}
            <select
              value={period}
              onChange={(event) => setPeriod(event.target.value as Period)}
              className="h-10 rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-xs font-medium text-slate-700 hover:bg-slate-100/60 focus:border-brand-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/15 transition-colors"
            >
              <option value="ALL">ทุกช่วงเวลา</option>
              <option value="YEAR">รายปี</option>
              <option value="QUARTER">รายไตรมาส</option>
              <option value="MONTH">รายเดือน</option>
              <option value="CUSTOM">กำหนดช่วงวันที่</option>
            </select>

            {period === "YEAR" && (
              <select
                value={year}
                onChange={(event) => setYear(event.target.value)}
                className="h-10 rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-xs font-medium text-slate-700 hover:bg-slate-100/60 focus:border-brand-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/15 transition-colors"
              >
                <option value="ALL">ทุกปี</option>
                {years.map((value) => (
                  <option key={value} value={value}>
                    พ.ศ. {value + 543}
                  </option>
                ))}
              </select>
            )}

            {period === "QUARTER" && (
              <select
                value={quarter}
                onChange={(event) => setQuarter(event.target.value)}
                className="h-10 rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-xs font-medium text-slate-700 hover:bg-slate-100/60 focus:border-brand-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/15 transition-colors"
              >
                <option value="">ทุกไตรมาส</option>
                {years.flatMap((value) =>
                  [1, 2, 3, 4].map((quarterValue) => (
                    <option key={`${value}-${quarterValue}`} value={`${value}-Q${quarterValue}`}>
                      ไตรมาส {quarterValue} / {value + 543}
                    </option>
                  )),
                )}
              </select>
            )}

            {period === "MONTH" && (
              <input
                type="month"
                value={month}
                onChange={(event) => setMonth(event.target.value)}
                className="h-10 rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-xs font-medium text-slate-700 hover:bg-slate-100/60 focus:border-brand-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/15 transition-colors"
              />
            )}

            {period === "CUSTOM" && (
              <div className="flex items-center gap-1.5">
                <input
                  type="date"
                  value={from}
                  onChange={(event) => setFrom(event.target.value)}
                  className="h-10 rounded-xl border border-slate-200 bg-slate-50/70 px-2.5 text-xs font-medium text-slate-700 hover:bg-slate-100/60 focus:border-brand-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/15 transition-colors"
                />
                <span className="text-xs text-slate-400">ถึง</span>
                <input
                  type="date"
                  value={to}
                  onChange={(event) => setTo(event.target.value)}
                  className="h-10 rounded-xl border border-slate-200 bg-slate-50/70 px-2.5 text-xs font-medium text-slate-700 hover:bg-slate-100/60 focus:border-brand-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/15 transition-colors"
                />
              </div>
            )}

            {/* Learning Center select */}
            <select
              value={center}
              onChange={(event) => setCenter(event.target.value)}
              className="h-10 max-w-[190px] truncate rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-xs font-medium text-slate-700 hover:bg-slate-100/60 focus:border-brand-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/15 transition-colors"
            >
              <option value="ALL">ทุก Learning Center</option>
              {data?.learningCenters.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            {/* Organization select */}
            <select
              value={organization}
              onChange={(event) => setOrganization(event.target.value)}
              className="h-10 max-w-[180px] truncate rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-xs font-medium text-slate-700 hover:bg-slate-100/60 focus:border-brand-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/15 transition-colors"
            >
              <option value="ALL">ทุกหน่วยงาน</option>
              {data?.organizations.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            {/* Activity select */}
            <select
              value={activity}
              onChange={(event) => setActivity(event.target.value)}
              className="h-10 max-w-[180px] truncate rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-xs font-medium text-slate-700 hover:bg-slate-100/60 focus:border-brand-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/15 transition-colors"
            >
              <option value="ALL">ทุกกิจกรรม</option>
              {data?.activities.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>

            {/* Search Input */}
            <div className="relative ml-auto min-w-[200px] flex-1 sm:flex-initial">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="ค้นหากิจกรรม..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 text-xs font-medium text-slate-700 placeholder:text-slate-400 hover:bg-slate-100/60 focus:border-brand-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/15 transition-colors"
              />
            </div>

            {/* Reset button */}
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-brand-navy focus-visible:outline-2 focus-visible:outline-brand-blue cursor-pointer transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              รีเซ็ต
            </button>
          </div>
        </section>

        {/* 5 KPI Metric Cards */}
        <section className="mb-6 grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
          <MetricCard
            icon={<Calendar className="h-4 w-4 text-brand-navy" />}
            iconBg="bg-brand-navy/8 text-brand-navy"
            label="กิจกรรมที่จัดจริง"
            value={filteredOccurrences.length.toLocaleString()}
            context="รอบจัดกิจกรรม"
          />
          <MetricCard
            icon={<CheckCircle2 className="h-4 w-4 text-brand-blue" />}
            iconBg="bg-brand-blue/10 text-brand-blue"
            label="กิจกรรมที่มีผลประเมิน"
            value={evaluatedActivities.toLocaleString()}
            context="ประเมินแล้ว"
          />
          <MetricCard
            icon={<Users className="h-4 w-4 text-indigo-700" />}
            iconBg="bg-indigo-50 text-indigo-700"
            label="ผู้ตอบแบบประเมิน"
            value={responses.length.toLocaleString()}
            context="แบบสอบถาม"
          />
          <MetricCard
            icon={<Sparkles className="h-4 w-4 text-amber-700" />}
            iconBg="bg-amber-50 text-amber-700"
            label="คะแนนเฉลี่ยรวม"
            value={satisfaction.average === null ? "—" : satisfaction.average.toFixed(2)}
            suffix="/ 5.00"
            context="เกณฑ์ระดับดีมาก"
          />
          <MetricCard
            icon={<TrendingUp className="h-4 w-4 text-emerald-700" />}
            iconBg="bg-emerald-50 text-emerald-700"
            label="ดัชนีความพึงพอใจ"
            value={satisfaction.percent === null ? "—" : `${satisfaction.percent.toFixed(1)}%`}
            context="เทียบเต็ม 100%"
          />
        </section>

        {/* 3 Main Panels */}
        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr_1.25fr]">
          {/* Panel 1: Satisfaction by Topic */}
          <Panel
            title="ความพึงพอใจรายด้าน"
            subtitle="AVERAGE SCORE BY TOPIC"
            badge="คะแนนเต็ม 5.00"
          >
            <div className="space-y-5">
              {topicScores.map((item) => (
                <div key={item.key} className="space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-semibold text-slate-800">{item.label}</span>
                    <span className="inline-flex items-center rounded-lg bg-slate-100 px-2 py-0.5 font-numeric text-xs font-bold text-brand-navy">
                      {item.average === null ? "—" : `${item.average.toFixed(2)} / 5.00`}
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all duration-500`}
                      style={{ width: `${item.percent ?? 0}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>
                      {item.percent === null
                        ? "ไม่มีข้อมูลผลประเมิน"
                        : `${item.percent.toFixed(1)}% ของเกณฑ์คะแนนสูงสุด`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          {/* Panel 2: Respondents by Organization */}
          <Panel
            title="ผู้ตอบแบบประเมิน"
            subtitle="PARTICIPANTS BY ORGANIZATION"
            badge={`${responses.length} ผู้ตอบ`}
          >
            <RespondentChart organizations={data?.organizations ?? []} responses={responses} />
            <div className="mt-5 rounded-xl border border-emerald-200/80 bg-emerald-50/70 p-3.5 text-xs text-emerald-900">
              <div className="flex items-center justify-between">
                <span className="font-medium text-emerald-800">อัตราการตอบกลับ (Response Rate)</span>
                <span className="font-numeric text-sm font-bold text-emerald-800">
                  {responseRate === null ? "—" : `${responseRate.toFixed(1)}%`}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-emerald-700">
                คำนวณจากผู้เข้าร่วมกิจกรรมทั้งหมด {participants.toLocaleString()} คน
              </p>
            </div>
          </Panel>

          {/* Panel 3: Activity Photos */}
          <Panel
            title="ภาพกิจกรรม"
            subtitle="EVENT DOCUMENTATION PHOTOS"
            badge={`${photos.length} ภาพถ่าย`}
          >
            {photos.length ? (
              <div className="grid grid-cols-2 gap-2.5">
                {photos.map((item) => (
                  <figure
                    key={item.id}
                    className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-200/70 bg-slate-100"
                  >
                    <img
                      src={item.featured_image ?? ""}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />
                    <figcaption className="absolute inset-x-0 bottom-0 p-2.5 text-xs font-semibold text-white drop-shadow-xs">
                      <p className="line-clamp-1">{item.title}</p>
                    </figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <Empty text="ยังไม่มีภาพถ่ายบันทึกกิจกรรม" />
            )}
          </Panel>
        </section>

        {/* 2 Lower Panels: Recent Occurrences + Operational Snapshot */}
        <section className="mt-5 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <Panel
            title="กิจกรรมล่าสุด"
            subtitle="RECENT COMPLETED OCCURRENCES"
            badge={`${recent.length} รายการ`}
          >
            {recent.length ? (
              <div className="divide-y divide-slate-100">
                {recent.map((item) => {
                  const activityItem = data?.activities.find(
                    (candidate) => candidate.id === item.activity_id,
                  );
                  return (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-4 py-3.5 first:pt-1 last:pb-1"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center rounded-md bg-brand-navy/8 px-1.5 py-0.5 text-[10px] font-bold text-brand-navy">
                            ครั้งที่ {item.occurrence_no}
                          </span>
                          <p className="truncate text-xs font-bold text-slate-900">
                            {activityItem?.title ?? "กิจกรรม"}
                          </p>
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            {new Intl.DateTimeFormat("th-TH", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }).format(new Date(item.start_at))}
                          </span>
                          <span className="inline-flex items-center gap-1 truncate">
                            <MapPin className="h-3 w-3 text-slate-400" />
                            {item.location_detail || "มหิดล ลำปาง"}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="inline-flex items-center rounded-lg bg-slate-50 border border-slate-200 px-2 py-1 font-numeric text-xs font-semibold text-slate-700">
                          {item.participant_count ? `${item.participant_count} คน` : "—"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <Empty text="ยังไม่มีข้อมูลกิจกรรมที่บันทึก" />
            )}
          </Panel>

          <Panel
            title="สถานะการดำเนินงาน"
            subtitle="OPERATIONAL SNAPSHOT"
            badge="รวมสถิติ"
          >
            <div className="grid grid-cols-2 gap-3">
              <MiniStat
                icon={<Calendar className="h-4 w-4 text-brand-navy" />}
                label="กิจกรรมจัดจริง"
                value={filteredOccurrences.length}
                unit="ครั้ง"
              />
              <MiniStat
                icon={<Layers className="h-4 w-4 text-brand-blue" />}
                label="มีผลประเมิน"
                value={evaluatedActivities}
                unit="กิจกรรม"
              />
              <MiniStat
                icon={<Users className="h-4 w-4 text-indigo-600" />}
                label="ผู้เข้าร่วมรวม"
                value={participants}
                unit="คน"
              />
              <MiniStat
                icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                label="ผู้ตอบแบบสอบถาม"
                value={responses.length}
                unit="ชุด"
              />
            </div>
          </Panel>
        </section>
      </main>
    </div>
  );
}

function MetricCard({
  icon,
  iconBg,
  label,
  value,
  suffix,
  context,
}: {
  icon: ReactNode;
  iconBg: string;
  label: string;
  value: string;
  suffix?: string;
  context?: string;
}) {
  return (
    <div className="group rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs transition-all hover:border-slate-300 hover:shadow-sm">
      <div className="flex items-center justify-between">
        <div className={`grid h-8 w-8 place-items-center rounded-xl ${iconBg}`}>
          {icon}
        </div>
        {context && (
          <span className="text-[10px] font-medium text-slate-500 tracking-tight">
            {context}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="font-numeric text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 group-hover:text-brand-navy transition-colors">
          {value}
        </span>
        {suffix && (
          <span className="text-xs font-semibold text-slate-500">
            {suffix}
          </span>
        )}
      </div>
      <p className="mt-1 text-xs font-semibold text-slate-600 line-clamp-1">
        {label}
      </p>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  badge,
  children,
}: {
  title: string;
  subtitle: string;
  badge?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
      <header className="mb-5 flex items-start justify-between gap-2 border-b border-slate-100 pb-3.5">
        <div>
          <h2 className="text-sm font-bold text-brand-navy">{title}</h2>
          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            {subtitle}
          </p>
        </div>
        {badge && (
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600">
            {badge}
          </span>
        )}
      </header>
      {children}
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="flex min-h-36 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center text-xs text-slate-500">
      <Activity className="h-6 w-6 text-slate-300 mb-2" />
      <span>{text}</span>
    </div>
  );
}

function MiniStat({
  icon,
  label,
  value,
  unit,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  unit: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5 transition-colors hover:bg-slate-100/60">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-600 truncate">{label}</span>
        {icon}
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="font-numeric text-xl font-bold tracking-tight text-brand-navy">
          {value.toLocaleString()}
        </span>
        <span className="text-[10px] font-medium text-slate-500">{unit}</span>
      </div>
    </div>
  );
}

function RespondentChart({
  organizations,
  responses,
}: {
  organizations: AdminDashboardData["organizations"];
  responses: DashboardResponse[];
}) {
  const counts = organizations
    .map((organization) => ({
      organization,
      count: responses.filter(
        (response) => response.participant_organization_id === organization.id,
      ).length,
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);
  const max = Math.max(1, ...counts.map((item) => item.count));
  if (!counts.length) return <Empty text="ยังไม่มีข้อมูลผู้ตอบแบบประเมินตามหน่วยงาน" />;
  return (
    <div className="space-y-3.5">
      {counts.slice(0, 6).map((item) => (
        <div key={item.organization.id} className="space-y-1">
          <div className="flex justify-between gap-2 text-xs">
            <span className="truncate font-medium text-slate-700">{item.organization.name}</span>
            <span className="font-numeric font-bold text-brand-navy">{item.count} ชุด</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-brand-blue transition-all duration-500"
              style={{ width: `${(item.count / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50/70 p-6 animate-pulse">
      <div className="mx-auto max-w-[1440px] space-y-6">
        {/* Header skeleton */}
        <div className="space-y-2">
          <div className="h-3 w-40 rounded-full bg-slate-200" />
          <div className="h-7 w-64 rounded-xl bg-slate-200" />
          <div className="h-4 w-96 rounded-md bg-slate-200" />
        </div>

        {/* Filter bar skeleton */}
        <div className="h-14 rounded-2xl border border-slate-200 bg-white" />

        {/* Metric cards skeleton */}
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-28 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="h-8 w-8 rounded-xl bg-slate-100" />
              <div className="mt-3 h-6 w-20 rounded bg-slate-200" />
              <div className="mt-2 h-3 w-28 rounded bg-slate-100" />
            </div>
          ))}
        </div>

        {/* Main panels skeleton */}
        <div className="grid gap-5 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-72 rounded-2xl border border-slate-200 bg-white p-6">
              <div className="h-4 w-32 rounded bg-slate-200 mb-6" />
              <div className="space-y-4">
                <div className="h-8 rounded bg-slate-100" />
                <div className="h-8 rounded bg-slate-100" />
                <div className="h-8 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
