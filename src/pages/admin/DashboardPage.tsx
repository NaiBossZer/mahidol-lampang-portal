import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Activity, BarChart3, Filter, RefreshCw, Search, Users } from "lucide-react";
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
  { key: "event", label: "การจัดงาน", fields: SCORE_FIELDS.slice(0, 5) },
  { key: "learning", label: "เนื้อหา / การเรียนรู้", fields: SCORE_FIELDS.slice(5, 10) },
  { key: "impact", label: "ผลกระทบ", fields: SCORE_FIELDS.slice(10) },
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

  useEffect(() => {
    void load();
    const refresh = () => void load();
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
        item.occurrence_id ? occurrenceIds.has(item.occurrence_id) : activityIds.has(item.activity_id),
      )
      .filter(
        (item) =>
          organization === "ALL" || item.participant_organization_id === organization,
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
          responses.map((item) => numericScore(item[field])).filter((value): value is number => value !== null),
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
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#f8f9ff] text-sm text-slate-500">
        กำลังโหลด Dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl p-8">
        <div className="border border-red-200 bg-red-50 p-6">
          <h1 className="text-lg font-bold text-red-800">ไม่สามารถโหลด Dashboard</h1>
          <p className="mt-2 text-sm text-red-700">{error}</p>
          <button
            type="button"
            onClick={() => void load()}
            className="mt-4 inline-flex items-center gap-2 bg-[#002d62] px-4 py-2.5 text-sm font-semibold text-white"
          >
            <RefreshCw className="h-4 w-4" />
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f8f9ff] text-[#0b1c30]">
      <main className="mx-auto max-w-[1440px] px-6 py-5 xl:px-8">
        <header className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#3f5f8f]">
              CORE OVERVIEW
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#00193c]">
              ภาพรวมระบบ
            </h1>
            <p className="mt-1 text-sm text-[#43474f]">
              ติดตามกิจกรรม ผลการประเมิน และผลลัพธ์จากการดำเนินงาน
            </p>
          </div>
          <div className="hidden items-center gap-2 text-xs text-[#43474f] sm:flex">
            <span className="h-2 w-2 rounded-full bg-[#2e7d32]" />ข้อมูลพร้อมใช้งาน
          </div>
        </header>

        <section className="mb-4 flex flex-wrap items-center gap-2 border-y border-[#dce9ff] bg-white px-3 py-2">
          <Filter className="h-4 w-4 text-[#3f5f8f]" />
          <select value={period} onChange={(event) => setPeriod(event.target.value as Period)} className="h-9 bg-[#eff4ff] px-3 text-xs font-semibold outline-none">
            <option value="ALL">ทุกช่วงเวลา</option>
            <option value="YEAR">รายปี</option>
            <option value="QUARTER">รายไตรมาส</option>
            <option value="MONTH">รายเดือน</option>
            <option value="CUSTOM">กำหนดช่วงวันที่</option>
          </select>
          {period === "YEAR" && (
            <select value={year} onChange={(event) => setYear(event.target.value)} className="h-9 bg-[#eff4ff] px-3 text-xs">
              <option value="ALL">ทุกปี</option>
              {years.map((value) => <option key={value} value={value}>{value + 543}</option>)}
            </select>
          )}
          {period === "QUARTER" && (
            <select value={quarter} onChange={(event) => setQuarter(event.target.value)} className="h-9 bg-[#eff4ff] px-3 text-xs">
              <option value="">ทุกไตรมาส</option>
              {years.flatMap((value) => [1, 2, 3, 4].map((quarterValue) => (
                <option key={`${value}-${quarterValue}`} value={`${value}-Q${quarterValue}`}>
                  ไตรมาส {quarterValue}/{value + 543}
                </option>
              )))}
            </select>
          )}
          {period === "MONTH" && <input type="month" value={month} onChange={(event) => setMonth(event.target.value)} className="h-9 bg-[#eff4ff] px-3 text-xs" />}
          {period === "CUSTOM" && (
            <>
              <input type="date" value={from} onChange={(event) => setFrom(event.target.value)} className="h-9 bg-[#eff4ff] px-3 text-xs" />
              <input type="date" value={to} onChange={(event) => setTo(event.target.value)} className="h-9 bg-[#eff4ff] px-3 text-xs" />
            </>
          )}
          <select value={center} onChange={(event) => setCenter(event.target.value)} className="h-9 bg-[#eff4ff] px-3 text-xs">
            <option value="ALL">ทุก Learning Center</option>
            {data?.learningCenters.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <select value={organization} onChange={(event) => setOrganization(event.target.value)} className="h-9 bg-[#eff4ff] px-3 text-xs">
            <option value="ALL">ทุกหน่วยงาน</option>
            {data?.organizations.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <select value={activity} onChange={(event) => setActivity(event.target.value)} className="h-9 bg-[#eff4ff] px-3 text-xs">
            <option value="ALL">ทุกกิจกรรม</option>
            {data?.activities.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
          <div className="relative ml-auto min-w-[190px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ค้นหากิจกรรม..." className="h-9 w-full bg-[#eff4ff] pl-9 pr-3 text-xs outline-none focus:ring-1 focus:ring-[#002d62]" />
          </div>
          <button type="button" onClick={reset} className="h-9 px-3 text-xs font-semibold text-[#002d62] hover:bg-[#eff4ff]">รีเซ็ต</button>
        </section>

        <section className="mb-4 grid grid-cols-2 gap-px bg-[#c4c6d1] lg:grid-cols-5">
          <Metric icon={<Activity />} label="กิจกรรมที่จัดจริง" value={filteredOccurrences.length.toLocaleString()} />
          <Metric icon={<BarChart3 />} label="กิจกรรมที่มีผลประเมิน" value={evaluatedActivities.toLocaleString()} />
          <Metric icon={<Users />} label="ผู้ตอบแบบสอบถาม" value={responses.length.toLocaleString()} />
          <Metric label="คะแนนเฉลี่ย" value={satisfaction.average === null ? "—" : satisfaction.average.toFixed(2)} suffix="/ 5" />
          <Metric label="ความพึงพอใจ" value={satisfaction.percent === null ? "—" : `${satisfaction.percent.toFixed(2)}%`} />
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr_1.25fr]">
          <Panel title="ความพึงพอใจรายด้าน" subtitle="Average score by topic">
            <div className="space-y-5">
              {topicScores.map((item) => (
                <div key={item.key}>
                  <div className="mb-1 flex items-baseline justify-between">
                    <span className="text-sm font-semibold text-[#0b1c30]">{item.label}</span>
                    <span className="text-sm font-semibold text-[#002d62]">{item.average === null ? "—" : `${item.average.toFixed(2)} / 5`}</span>
                  </div>
                  <div className="h-2 bg-[#dce9ff]"><div className="h-full bg-[#002d62]" style={{ width: `${item.percent ?? 0}%` }} /></div>
                  <div className="mt-1 text-[10px] text-[#747781]">{item.percent === null ? "ไม่มีข้อมูล" : `${item.percent.toFixed(1)}% ของคะแนนเต็ม`}</div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="ผู้ตอบแบบประเมิน" subtitle="ตามหน่วยงาน">
            <RespondentChart organizations={data?.organizations ?? []} responses={responses} />
            <div className="mt-4 border-t border-[#dce9ff] pt-3 text-xs text-[#43474f]">
              Response rate <strong className="text-[#002d62]">{responseRate === null ? "—" : `${responseRate.toFixed(1)}%`}</strong>
            </div>
          </Panel>

          <Panel title="ภาพกิจกรรม" subtitle="ภาพถ่ายหลังเสร็จสิ้นกิจกรรม">
            {photos.length ? (
              <div className="grid grid-cols-2 gap-2">
                {photos.map((item) => (
                  <figure key={item.id} className="overflow-hidden bg-[#eff4ff]">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={item.featured_image ?? ""} alt={item.title} className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]" />
                    </div>
                    <figcaption className="truncate px-2 py-2 text-xs font-medium text-[#0b1c30]">{item.title}</figcaption>
                  </figure>
                ))}
              </div>
            ) : <Empty text="ยังไม่มีภาพถ่ายกิจกรรม" />}
          </Panel>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <Panel title="กิจกรรมล่าสุด" subtitle="Recent completed activity occurrences">
            {recent.length ? (
              <div className="divide-y divide-[#e5e9f0]">
                {recent.map((item) => {
                  const activityItem = data?.activities.find((candidate) => candidate.id === item.activity_id);
                  return (
                    <div key={item.id} className="grid grid-cols-[1fr_auto] gap-4 py-3 first:pt-0 last:pb-0">
                      <div className="min-w-0"><p className="truncate text-sm font-semibold text-[#0b1c30]">{activityItem?.title ?? "กิจกรรม"}</p><p className="mt-1 text-xs text-[#747781]">ครั้งที่ {item.occurrence_no} · {new Intl.DateTimeFormat("th-TH", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(item.start_at))}</p></div>
                      <span className="text-xs font-medium text-[#3f5f8f]">{item.location_detail || "ไม่ระบุสถานที่"}</span>
                    </div>
                  );
                })}
              </div>
            ) : <Empty text="ยังไม่มีข้อมูลกิจกรรม" />}
          </Panel>
          <Panel title="สถานะการดำเนินงาน" subtitle="Operational snapshot">
            <div className="grid grid-cols-2 gap-2">
              <MiniStat label="จัดจริง" value={filteredOccurrences.length} />
              <MiniStat label="มีผลประเมิน" value={evaluatedActivities} />
              <MiniStat label="ผู้เข้าร่วม" value={participants} />
              <MiniStat label="ผู้ตอบ" value={responses.length} />
            </div>
          </Panel>
        </section>
      </main>
    </div>
  );
}

function Metric({ icon, label, value, suffix }: { icon?: ReactNode; label: string; value: string; suffix?: string }) {
  return <div className="bg-white px-4 py-4"><div className="flex items-center gap-2 text-xs font-medium text-[#747781]">{icon ? <span className="text-[#002d62] [&>svg]:h-4 [&>svg]:w-4">{icon}</span> : null}{label}</div><div className="mt-2 text-2xl font-semibold tracking-tight text-[#00193c]">{value} <span className="text-xs font-medium text-[#747781]">{suffix}</span></div></div>;
}

function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return <section className="bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"><header className="mb-5 border-b border-[#e5e9f0] pb-3"><h2 className="text-sm font-semibold text-[#00193c]">{title}</h2><p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[#747781]">{subtitle}</p></header>{children}</section>;
}

function Empty({ text }: { text: string }) {
  return <div className="flex min-h-32 items-center justify-center border border-dashed border-[#cfd8e6] text-xs text-[#747781]">{text}</div>;
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return <div className="border border-[#dce9ff] bg-[#f8f9ff] px-3 py-4"><p className="text-[10px] uppercase tracking-wide text-[#747781]">{label}</p><p className="mt-1 text-xl font-semibold text-[#002d62]">{value.toLocaleString()}</p></div>;
}

function RespondentChart({ organizations, responses }: { organizations: AdminDashboardData["organizations"]; responses: DashboardResponse[] }) {
  const counts = organizations.map((organization) => ({ organization, count: responses.filter((response) => response.participant_organization_id === organization.id).length })).filter((item) => item.count > 0).sort((a, b) => b.count - a.count);
  const max = Math.max(1, ...counts.map((item) => item.count));
  if (!counts.length) return <Empty text="ยังไม่มีข้อมูลผู้ตอบแบบประเมิน" />;
  return <div className="space-y-3">{counts.slice(0, 6).map((item) => <div key={item.organization.id}><div className="mb-1 flex justify-between gap-2 text-xs"><span className="truncate font-medium text-[#0b1c30]">{item.organization.name}</span><span className="font-semibold text-[#002d62]">{item.count}</span></div><div className="h-2 bg-[#e7edf7]"><div className="h-full bg-[#002d62]" style={{ width: `${(item.count / max) * 100}%` }} /></div></div>)}</div>;
}
