import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Activity as ActivityIcon,
  Calendar,
  CheckCircle2,
  Filter,
  Image as ImageIcon,
  MapPin,
  MessageSquareQuote,
  RefreshCw,
  RotateCcw,
  Star,
  Trophy,
  Users,
  Megaphone,
} from "lucide-react";
import { getAdminDashboardData, type AdminDashboardData } from "@/services/api";

type Period = "ALL" | "YEAR" | "QUARTER" | "MONTH" | "CUSTOM";
type Dimension = "age_group" | "affiliation" | "organization";
type ResponseWithChannels = AdminDashboardData["responses"][number] & {
  channels?: string | null;
};
type ScoreField = keyof Pick<
  AdminDashboardData["responses"][number],
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
type ScoreItem = {
  field: ScoreField;
  label: string;
  value: number;
  respondentCount: number;
};
type ScoreGroup = {
  key: string;
  title: string;
  fields: ScoreField[];
};

const SCORE_GROUPS: ScoreGroup[] = [
  {
    key: "opening",
    title: "พิธีเปิด",
    fields: ["p2_location", "p2_schedule", "p2_readiness", "p2_reception", "p2_overall"],
  },
  {
    key: "learning",
    title: "ห้องเรียนรู้",
    fields: ["p3_interest", "p3_content", "p3_clarity", "p3_benefit", "p3_application"],
  },
  {
    key: "outcome",
    title: "ผลที่ได้รับ",
    fields: ["p4_knowledge", "p4_inspiration", "p4_community_resource", "p4_future_return"],
  },
];

const SCORE_LABELS: Record<ScoreField, string> = {
  p2_location: "สถานที่",
  p2_schedule: "กำหนดการ",
  p2_readiness: "ความพร้อม",
  p2_reception: "การต้อนรับ",
  p2_overall: "ภาพรวมกิจกรรม",
  p3_interest: "ความน่าสนใจ",
  p3_content: "เนื้อหา",
  p3_clarity: "ความชัดเจน",
  p3_benefit: "ประโยชน์",
  p3_application: "การนำไปใช้",
  p4_knowledge: "ความรู้ที่ได้รับ",
  p4_inspiration: "แรงบันดาลใจ",
  p4_community_resource: "ทรัพยากรชุมชน",
  p4_future_return: "การกลับมาใช้บริการ",
};

const ALL_SCORE_FIELDS = Object.keys(SCORE_LABELS) as ScoreField[];

const score = (value: unknown): number | null => {
  const number = Number(value);
  return Number.isFinite(number) && number >= 1 && number <= 5 ? number : null;
};

const average = (values: number[]): number | null =>
  values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatNumber = (value: number) => new Intl.NumberFormat("th-TH").format(value);

const matchesDate = (
  value: string,
  period: Period,
  year: string,
  quarter: string,
  month: string,
  from: string,
  to: string,
) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  if (period === "ALL") return true;
  if (period === "YEAR") return year === "ALL" || String(date.getFullYear()) === year;
  if (period === "QUARTER") {
    const currentQuarter = `${date.getFullYear()}-Q${Math.floor(date.getMonth() / 3) + 1}`;
    return !quarter || currentQuarter === quarter;
  }
  if (period === "MONTH") return !month || value.slice(0, 7) === month;
  const day = value.slice(0, 10);
  return (!from || day >= from) && (!to || day <= to);
};

function Card({
  title,
  right,
  children,
  className = "",
}: {
  title: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      <div className="flex min-h-12 items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="h-5 w-1 shrink-0 rounded-full bg-brand-blue" />
          <h2 className="truncate text-sm font-extrabold text-brand-navy">{title}</h2>
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}

function SelectField({
  label,
  value,
  onChange,
  children,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <label className="min-w-0">
      <span className="mb-1.5 block text-[11px] font-bold text-slate-500">{label}</span>
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
      >
        {children}
      </select>
    </label>
  );
}

function KpiCard({
  icon,
  label,
  value,
  suffix,
  note,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  suffix?: string;
  note?: string;
}) {
  return (
    <article className="flex min-w-0 items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="min-w-0">
        <p className="text-xs font-bold text-slate-500">{label}</p>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-brand-navy">{value}</span>
          {suffix && <span className="text-xs font-bold text-slate-400">{suffix}</span>}
        </div>
        {note && <p className="mt-1 text-[11px] font-semibold text-slate-400">{note}</p>}
      </div>
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-brand-blue">
        {icon}
      </div>
    </article>
  );
}

export function ExecutiveDashboardPage() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [activity, setActivity] = useState("ALL");
  const [period, setPeriod] = useState<Period>("ALL");
  const [year, setYear] = useState("ALL");
  const [quarter, setQuarter] = useState("");
  const [month, setMonth] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [dimension, setDimension] = useState<Dimension>("age_group");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const load = async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      setData(await getAdminDashboardData());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "ไม่สามารถโหลด Dashboard ได้");
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

  const months = useMemo(() => {
    const values = new Set<string>();
    for (const occurrence of data?.occurrences ?? []) {
      const date = new Date(occurrence.start_at);
      if (!Number.isNaN(date.getTime())) values.add(occurrence.start_at.slice(0, 7));
    }
    return [...values].sort().reverse();
  }, [data]);

  const quarters = useMemo(() => {
    const values = new Set<string>();
    for (const occurrence of data?.occurrences ?? []) {
      const date = new Date(occurrence.start_at);
      if (!Number.isNaN(date.getTime())) {
        values.add(`${date.getFullYear()}-Q${Math.floor(date.getMonth() / 3) + 1}`);
      }
    }
    return [...values].sort().reverse();
  }, [data]);

  const occurrencePool = useMemo(
    () =>
      (data?.occurrences ?? []).filter(
        (item) =>
          !["cancelled", "archived"].includes(item.status) &&
          matchesDate(item.start_at, period, year, quarter, month, from, to),
      ),
    [data, period, year, quarter, month, from, to],
  );

  const activities = useMemo(
    () =>
      (data?.activities ?? []).filter((item) =>
        occurrencePool.some((occurrence) => occurrence.activity_id === item.id),
      ),
    [data, occurrencePool],
  );

  const activityIds = useMemo(
    () =>
      new Set(
        (activity === "ALL" ? activities : activities.filter((item) => item.id === activity)).map(
          (item) => item.id,
        ),
      ),
    [activities, activity],
  );

  useEffect(() => {
    if (activity !== "ALL" && !activityIds.has(activity)) setActivity("ALL");
  }, [activity, activityIds]);

  const occurrences = useMemo(
    () => occurrencePool.filter((item) => activityIds.has(item.activity_id)),
    [occurrencePool, activityIds],
  );

  const responses = useMemo(() => {
    const occurrenceIds = new Set(occurrences.map((item) => item.id));
    return (data?.responses ?? []).filter((response) =>
      response.occurrence_id
        ? occurrenceIds.has(response.occurrence_id)
        : activityIds.has(response.activity_id),
    );
  }, [data, occurrences, activityIds]);

  const selectedActivity = activity === "ALL" ? undefined : data?.activities.find((item) => item.id === activity);
  const participants = occurrences.reduce(
    (sum, occurrence) => sum + Math.max(0, Number(occurrence.participant_count || 0)),
    0,
  );
  const responseCount = responses.length;
  const pending = Math.max(0, participants - responseCount);
  const responseRate = participants ? Math.min((responseCount / participants) * 100, 100) : null;
  const dataMismatch = responseCount > participants && participants > 0;

  const questionScores = useMemo<ScoreItem[]>(() => {
    return ALL_SCORE_FIELDS.flatMap((field) => {
      const values = responses
        .map((response) => score(response[field]))
        .filter((value): value is number => value !== null);
      const value = average(values);
      return value === null
        ? []
        : [{ field, label: SCORE_LABELS[field], value, respondentCount: values.length }];
    });
  }, [responses]);

  const scoreGroups = useMemo(
    () =>
      SCORE_GROUPS.map((group) => ({
        ...group,
        items: group.fields
          .map((field) => questionScores.find((item) => item.field === field))
          .filter((item): item is ScoreItem => Boolean(item)),
      })).filter((group) => group.items.length),
    [questionScores],
  );

  const overall = useMemo(
    () =>
      average(
        responses.flatMap((response) =>
          ALL_SCORE_FIELDS.map((field) => score(response[field])).filter(
            (value): value is number => value !== null,
          ),
        ),
      ),
    [responses],
  );

  const highest = [...questionScores].sort((a, b) => b.value - a.value)[0];
  const lowest = [...questionScores].sort((a, b) => a.value - b.value)[0];

  const dimensionOptions = useMemo(
    () =>
      [
        {
          key: "age_group" as const,
          label: "ช่วงอายุ",
          available: responses.some((item) => Boolean(item.age_group)),
        },
        {
          key: "affiliation" as const,
          label: "ประเภทผู้ตอบ",
          available: responses.some((item) => Boolean(item.affiliation)),
        },
        {
          key: "organization" as const,
          label: "หน่วยงาน",
          available:
            responses.some((item) => Boolean(item.participant_organization_id)) &&
            Boolean(data?.organizations.length),
        },
      ].filter((item) => item.available),
    [responses, data],
  );

  useEffect(() => {
    if (dimensionOptions.length && !dimensionOptions.some((item) => item.key === dimension)) {
      setDimension(dimensionOptions[0].key);
    }
  }, [dimensionOptions, dimension]);

  const respondentDistribution = useMemo(() => {
    const counts = new Map<string, number>();
    for (const response of responses) {
      const raw =
        dimension === "age_group"
          ? response.age_group
          : dimension === "affiliation"
            ? response.affiliation
            : data?.organizations.find((organization) => organization.id === response.participant_organization_id)
                ?.name;
      const value = raw?.trim();
      if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [responses, dimension, data]);

  const scoreDistribution = useMemo(() => {
    const total = responses.reduce(
      (sum, response) =>
        sum + ALL_SCORE_FIELDS.filter((field) => score(response[field]) !== null).length,
      0,
    );
    return [5, 4, 3, 2, 1].map((value) => {
      const count = responses.reduce(
        (sum, response) =>
          sum + ALL_SCORE_FIELDS.filter((field) => score(response[field]) === value).length,
        0,
      );
      return { value, count, percent: total ? (count / total) * 100 : 0 };
    });
  }, [responses]);

  const channelDistribution = useMemo(() => {
    const counts = new Map<string, number>();
    for (const response of responses as ResponseWithChannels[]) {
      const raw = response.channels?.trim();
      if (!raw || raw === "-") continue;
      const categories = new Set<string>();
      for (const part of raw.split(",").map((item) => item.trim()).filter(Boolean)) {
        const upper = part.toUpperCase();
        if (upper.includes("FACEBOOK")) categories.add("FACEBOOK");
        else if (upper === "LINE" || upper.includes("LINE")) categories.add("LINE");
        else if (upper.includes("WEBSITE")) categories.add("WEBSITE");
        else categories.add("อื่นๆ");
      }
      for (const category of categories) counts.set(category, (counts.get(category) ?? 0) + 1);
    }
    return ["FACEBOOK", "LINE", "WEBSITE", "อื่นๆ"]
      .map((label) => ({ label, count: counts.get(label) ?? 0 }))
      .filter((item) => item.count > 0);
  }, [responses]);

  const channelTotal = channelDistribution.reduce((sum, item) => sum + item.count, 0);

  const comments = responses
    .map((response) => response.feedback?.trim())
    .filter((value): value is string => Boolean(value))
    .slice(0, 4);

  const photos = useMemo(() => {
    if (activity !== "ALL") {
      const media = (data?.activityMedia ?? [])
        .filter((item) => item.activity_id === activity)
        .sort((a, b) => a.display_order - b.display_order)
        .map((item) => ({
          id: item.id,
          image: item.public_url,
          title: item.caption || selectedActivity?.title || "กิจกรรม",
        }));
      return [
        ...(selectedActivity?.featured_image
          ? [{ id: "featured", image: selectedActivity.featured_image, title: selectedActivity.title }]
          : []),
        ...media,
      ].slice(0, 6);
    }
    return (data?.activities ?? [])
      .filter((item) => item.featured_image)
      .slice(0, 6)
      .map((item) => ({ id: item.id, image: item.featured_image as string, title: item.title }));
  }, [data, activity, selectedActivity]);

  const recentActivities = useMemo(() => {
    if (!data) return [];
    return data.activities
      .map((item) => {
        const occurrence = occurrencePool
          .filter((candidate) => candidate.activity_id === item.id)
          .sort((a, b) => new Date(b.start_at).getTime() - new Date(a.start_at).getTime())[0];
        return occurrence ? { item, occurrence } : null;
      })
      .filter(
        (
          item,
        ): item is {
          item: AdminDashboardData["activities"][number];
          occurrence: AdminDashboardData["occurrences"][number];
        } => Boolean(item),
      )
      .sort(
        (a, b) =>
          new Date(b.occurrence.start_at).getTime() - new Date(a.occurrence.start_at).getTime(),
      )
      .slice(0, 4);
  }, [data, occurrencePool]);

  const resetFilters = () => {
    setActivity("ALL");
    setPeriod("ALL");
    setYear("ALL");
    setQuarter("");
    setMonth("");
    setFrom("");
    setTo("");
  };

  const setPeriodAndClearChildren = (value: Period) => {
    setPeriod(value);
    if (value !== "YEAR") setYear("ALL");
    if (value !== "QUARTER") setQuarter("");
    if (value !== "MONTH") setMonth("");
    if (value !== "CUSTOM") {
      setFrom("");
      setTo("");
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-[calc(100dvh-4rem)] place-items-center text-sm font-semibold text-slate-500">
        กำลังโหลดผลการดำเนินงาน...
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid min-h-[calc(100dvh-4rem)] place-items-center px-4">
        <div className="w-full max-w-md rounded-xl border border-rose-200 bg-rose-50 p-8 text-center">
          <p className="font-bold text-rose-800">ไม่สามารถโหลด Dashboard ได้</p>
          <p className="mt-2 text-sm text-rose-600">{error}</p>
          <button
            type="button"
            onClick={() => void load()}
            className="mt-4 rounded-lg bg-brand-navy px-4 py-2 text-sm font-bold text-white"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  const title = selectedActivity?.title || "ภาพรวมผลการดำเนินงาน";
  const heroImage = selectedActivity?.featured_image || photos[0]?.image;
  const overallLevel =
    overall === null
      ? "-"
      : overall >= 4.5
        ? "มากที่สุด"
        : overall >= 3.5
          ? "มาก"
          : overall >= 2.5
            ? "ปานกลาง"
            : "ควรปรับปรุง";

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-slate-50">
      <main className="mx-auto max-w-[1440px] space-y-5 px-4 py-5 sm:px-6 xl:px-8">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 text-xs font-bold text-brand-blue">Executive Dashboard</div>
            <h1 className="text-2xl font-black tracking-tight text-brand-navy sm:text-3xl">
              รายงานผลสัมฤทธิ์และแบบประเมินความพึงพอใจ
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Faculty of Environment and Resource Studies, Mahidol University
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>อัปเดตล่าสุด: {formatDate(new Date().toISOString())}</span>
            <button
              type="button"
              onClick={() => void load(true)}
              disabled={refreshing}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 font-bold shadow-sm transition hover:border-slate-300 disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              รีเฟรช
            </button>
          </div>
        </header>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-brand-blue" />
              <h2 className="text-sm font-extrabold text-brand-navy">ตัวกรองรายงาน</h2>
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 self-start text-xs font-bold text-slate-500 transition hover:text-brand-blue sm:self-auto"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              ล้างตัวกรอง
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
            <SelectField label="กิจกรรม" value={activity} onChange={setActivity}>
              <option value="ALL">ทุกกิจกรรม</option>
              {activities.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </SelectField>

            <SelectField label="ช่วงเวลา" value={period} onChange={(value) => setPeriodAndClearChildren(value as Period)}>
              <option value="ALL">ทั้งหมด</option>
              <option value="YEAR">รายปี</option>
              <option value="QUARTER">รายไตรมาส</option>
              <option value="MONTH">รายเดือน</option>
              <option value="CUSTOM">กำหนดช่วงวันที่</option>
            </SelectField>

            <SelectField label="ปี" value={year} onChange={setYear} disabled={period !== "YEAR"}>
              <option value="ALL">ทุกปี</option>
              {years.map((item) => (
                <option key={item} value={item}>
                  {item + 543}
                </option>
              ))}
            </SelectField>

            <SelectField label="ไตรมาส / เดือน" value={period === "QUARTER" ? quarter : month} onChange={period === "QUARTER" ? setQuarter : setMonth} disabled={period !== "QUARTER" && period !== "MONTH"}>
              <option value="">เลือกช่วง</option>
              {(period === "QUARTER" ? quarters : months).map((item) => (
                <option key={item} value={item}>
                  {period === "QUARTER"
                    ? `${item.split("-")[0]} (พ.ศ. ${Number(item.slice(0, 4)) + 543})`
                    : new Intl.DateTimeFormat("th-TH", { month: "long", year: "numeric" }).format(new Date(`${item}-01`))}
                </option>
              ))}
            </SelectField>

            <div className="grid grid-cols-2 gap-2">
              <label className="min-w-0">
                <span className="mb-1.5 block text-[11px] font-bold text-slate-500">ตั้งแต่</span>
                <input
                  type="date"
                  value={from}
                  disabled={period !== "CUSTOM"}
                  onChange={(event) => setFrom(event.target.value)}
                  className="h-10 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                />
              </label>
              <label className="min-w-0">
                <span className="mb-1.5 block text-[11px] font-bold text-slate-500">ถึง</span>
                <input
                  type="date"
                  value={to}
                  disabled={period !== "CUSTOM"}
                  onChange={(event) => setTo(event.target.value)}
                  className="h-10 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                />
              </label>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col md:flex-row">
            <div
              className="h-44 w-full shrink-0 cursor-pointer bg-slate-100 md:h-32 md:w-60"
              onClick={() => heroImage && setPreviewImage(heroImage)}
            >
              {heroImage ? (
                <img src={heroImage} alt={title} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full place-items-center text-slate-300">
                  <ImageIcon className="h-8 w-8" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1 p-4">
              <div className="text-xs font-bold text-brand-blue">{selectedActivity?.category || "Executive Report"}</div>
              <h2 className="mt-1 text-xl font-black tracking-tight text-brand-navy">{title}</h2>
              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {selectedActivity ? formatDate(selectedActivity.activity_date) : "รวมตามตัวกรอง"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  ผู้เข้าร่วม {formatNumber(participants)} คน
                </span>
                {selectedActivity?.featured_image && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {selectedActivity.category || "กิจกรรม"}
                  </span>
                )}
              </div>
            </div>
            <div className="flex min-w-[190px] flex-col justify-center border-t border-slate-100 bg-slate-50 p-4 md:border-l md:border-t-0">
              <p className="text-xs font-bold text-slate-500">ภาพรวมคะแนน</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-black text-brand-navy">{overall === null ? "-" : overall.toFixed(2)}</span>
                <span className="text-xs font-bold text-slate-400">/ 5.00</span>
              </div>
              <span className="mt-1 text-xs font-bold text-brand-blue">ระดับ {overallLevel}</span>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <KpiCard icon={<Users className="h-5 w-5" />} label="ผู้เข้าร่วมกิจกรรม" value={formatNumber(participants)} suffix="คน" />
          <KpiCard icon={<CheckCircle2 className="h-5 w-5" />} label="ผู้ตอบแบบประเมิน" value={formatNumber(responseCount)} suffix="คน" />
          <KpiCard icon={<Users className="h-5 w-5" />} label="ยังไม่ได้ตอบ" value={formatNumber(pending)} suffix="คน" />
          <KpiCard icon={<ActivityIcon className="h-5 w-5" />} label="อัตราการตอบกลับ" value={responseRate === null ? "-" : responseRate.toFixed(1)} suffix="%" note={dataMismatch ? "ตรวจสอบจำนวนผู้เข้าร่วมกับคำตอบ" : undefined} />
          <KpiCard icon={<Star className="h-5 w-5" />} label="คะแนนประเมินเฉลี่ย" value={overall === null ? "-" : overall.toFixed(2)} suffix="/ 5.00" />
        </div>

        {dataMismatch && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-800">
            จำนวนผู้ตอบแบบประเมินมากกว่าจำนวนผู้เข้าร่วมที่ระบบระบุ จึงไม่ปรับจำนวนผู้ตอบให้ลดลง และแสดงข้อมูลตามข้อมูลจริงที่ได้รับ
          </div>
        )}

        <section className="grid grid-cols-1 items-start gap-4 xl:grid-cols-3">
          <div className="min-w-0 space-y-4">
            <Card title="ผลการประเมินภาพรวม" right={<span className="text-[11px] text-slate-400">{responseCount} ผู้ตอบ</span>}>
              <div className="p-4">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-slate-500">คะแนนเฉลี่ยรวม</p>
                    <p className="mt-1 text-4xl font-black text-brand-navy">{overall === null ? "-" : overall.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <Trophy className="ml-auto h-7 w-7 text-amber-500" />
                    <p className="mt-1 text-xs font-bold text-brand-blue">{overallLevel}</p>
                  </div>
                </div>
                <div className="mt-4 h-2 rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-brand-blue transition-all" style={{ width: `${overall === null ? 0 : Math.min(100, (overall / 5) * 100)}%` }} />
                </div>
              </div>
            </Card>

            <Card title="ข้อมูลทั่วไปของผู้ตอบแบบสอบถาม">
              <div className="p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-slate-500">มิติข้อมูลที่มีอยู่จริง</span>
                  <select
                    value={dimension}
                    onChange={(event) => setDimension(event.target.value as Dimension)}
                    className="h-8 rounded-md border border-slate-200 bg-slate-50 px-2 text-[11px] font-bold text-slate-700 outline-none"
                  >
                    {dimensionOptions.map((item) => (
                      <option key={item.key} value={item.key}>{item.label}</option>
                    ))}
                  </select>
                </div>
                {respondentDistribution.length ? (
                  <div className="space-y-3">
                    {respondentDistribution.map(([label, count]) => (
                      <div key={label}>
                        <div className="mb-1 flex items-center justify-between gap-3 text-xs">
                          <span className="truncate font-semibold text-slate-600">{label}</span>
                          <span className="shrink-0 font-bold text-slate-800">{count} คน ({((count / Math.max(responseCount, 1)) * 100).toFixed(1)}%)</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-brand-blue" style={{ width: `${(count / Math.max(responseCount, 1)) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-5 text-center text-xs text-slate-400">ไม่มีข้อมูลมิตินี้ในช่วงที่เลือก</p>
                )}
              </div>
            </Card>

            <Card title="ภาพกิจกรรมล่าสุด" right={<span className="text-[11px] text-slate-400">{photos.length} ภาพ</span>}>
              <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3">
                {photos.map((photo) => (
                  <button key={photo.id} type="button" onClick={() => setPreviewImage(photo.image)} className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100 text-left">
                    <img src={photo.image} alt={photo.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                    <span className="absolute inset-x-0 bottom-0 bg-black/55 px-2 py-1 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100">{photo.title}</span>
                  </button>
                ))}
                {!photos.length && <p className="col-span-full py-6 text-center text-xs text-slate-400">ไม่มีภาพกิจกรรม</p>}
              </div>
            </Card>

            <Card title="กิจกรรมล่าสุด">
              <div className="divide-y divide-slate-100">
                {recentActivities.map(({ item, occurrence }) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActivity(item.id)}
                    className="flex w-full items-start gap-3 p-3 text-left transition hover:bg-slate-50"
                  >
                    <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-50 text-brand-blue"><Calendar className="h-4 w-4" /></div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-slate-800">{item.title}</p>
                      <p className="mt-1 text-[11px] text-slate-400">{formatDate(occurrence.start_at)}</p>
                    </div>
                  </button>
                ))}
                {!recentActivities.length && <p className="py-6 text-center text-xs text-slate-400">ไม่มีกิจกรรมในช่วงที่เลือก</p>}
              </div>
            </Card>
          </div>

          <div className="min-w-0 space-y-4">
            {scoreGroups.map((group) => (
              <Card key={group.key} title={group.title} right={<span className="text-[11px] text-slate-400">สเกล 1–5</span>}>
                <div className="space-y-3 p-4">
                  {group.items.map((item) => (
                    <div key={item.field}>
                      <div className="mb-1 flex items-center justify-between gap-3 text-xs">
                        <span className="truncate font-semibold text-slate-600">{item.label}</span>
                        <span className="shrink-0 font-black text-slate-800">{item.value.toFixed(2)} / 5.00</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-brand-blue" style={{ width: `${Math.min(100, (item.value / 5) * 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}

            <Card title="กลุ่มผู้ตอบแบบประเมิน">
              <div className="p-4">
                {respondentDistribution.length ? (
                  <div className="space-y-3">
                    {respondentDistribution.map(([label, count]) => (
                      <div key={label} className="flex items-center justify-between gap-3 text-xs">
                        <span className="truncate font-semibold text-slate-600">{label}</span>
                        <span className="shrink-0 font-bold text-slate-800">{count} คน</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="py-4 text-center text-xs text-slate-400">ไม่มีข้อมูล</p>}
              </div>
            </Card>

            <Card title="ช่องทางการรับรู้กิจกรรม" right={<span className="text-[11px] text-slate-400">{channelTotal} การเลือก</span>}>
              <div className="space-y-3 p-4">
                {channelDistribution.length ? channelDistribution.map((channel) => {
                  const percent = channelTotal ? (channel.count / channelTotal) * 100 : 0;
                  return (
                    <div key={channel.label} className="flex items-center gap-2 text-xs">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-50 font-black text-brand-blue">{channel.label === "FACEBOOK" ? "f" : channel.label === "LINE" ? "L" : channel.label === "WEBSITE" ? "◉" : "•"}</span>
                      <span className="w-20 shrink-0 truncate font-semibold text-slate-600">{channel.label}</span>
                      <div className="h-2 min-w-0 flex-1 rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand-blue" style={{ width: `${percent}%` }} /></div>
                      <span className="w-16 shrink-0 text-right font-bold text-slate-800">{channel.count} ({percent.toFixed(1)}%)</span>
                    </div>
                  );
                }) : <p className="py-4 text-center text-xs text-slate-400">ไม่มีข้อมูลช่องทางการรับรู้</p>}
                {channelTotal > responseCount && <p className="text-[10px] font-semibold text-slate-400">หลายคำตอบ: ผู้ตอบหนึ่งคนอาจเลือกมากกว่าหนึ่งช่องทาง</p>}
              </div>
            </Card>
          </div>

          <div className="min-w-0 space-y-4">
            <Card title="การกระจายคะแนน" right={<span className="text-[11px] text-slate-400">รวมคำตอบที่มีคะแนน</span>}>
              <div className="space-y-3 p-4">
                {scoreDistribution.map((item) => (
                  <div key={item.value} className="flex items-center gap-3 text-xs">
                    <span className="w-8 shrink-0 font-black text-slate-700">{item.value} ★</span>
                    <div className="h-3 min-w-0 flex-1 rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand-blue" style={{ width: `${item.percent}%` }} /></div>
                    <span className="w-20 shrink-0 text-right font-bold text-slate-700">{item.count} ({item.percent.toFixed(1)}%)</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Executive Highlights">
              <div className="space-y-3 p-4">
                <div className="rounded-lg bg-emerald-50 p-3">
                  <p className="text-[11px] font-bold text-emerald-700">คะแนนสูงสุด</p>
                  <p className="mt-1 text-xs font-bold text-slate-800">{highest?.label || "-"}</p>
                  <p className="mt-1 text-lg font-black text-emerald-700">{highest ? highest.value.toFixed(2) : "-"} / 5.00</p>
                </div>
                <div className="rounded-lg bg-amber-50 p-3">
                  <p className="text-[11px] font-bold text-amber-700">ประเด็นที่ควรติดตาม</p>
                  <p className="mt-1 text-xs font-bold text-slate-800">{lowest?.label || "-"}</p>
                  <p className="mt-1 text-lg font-black text-amber-700">{lowest ? lowest.value.toFixed(2) : "-"} / 5.00</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-lg border border-slate-100 bg-slate-50 p-3"><p className="text-[10px] font-bold text-slate-400">ผู้ตอบ</p><p className="mt-1 font-black text-brand-navy">{responseCount}</p></div>
                  <div className="rounded-lg border border-slate-100 bg-slate-50 p-3"><p className="text-[10px] font-bold text-slate-400">อัตราตอบกลับ</p><p className="mt-1 font-black text-brand-navy">{responseRate === null ? "-" : `${responseRate.toFixed(1)}%`}</p></div>
                </div>
              </div>
            </Card>

            <Card title="ความคิดเห็นจากผู้ตอบ" right={<MessageSquareQuote className="h-4 w-4 text-slate-400" />}>
              <div className="divide-y divide-slate-100">
                {comments.map((comment, index) => (
                  <div key={`${comment}-${index}`} className="p-4">
                    <p className="text-xs leading-5 text-slate-700">“{comment}”</p>
                    <p className="mt-2 text-[10px] font-semibold text-slate-400">ผู้ตอบแบบประเมิน</p>
                  </div>
                ))}
                {!comments.length && <p className="py-8 text-center text-xs text-slate-400">ไม่มีความคิดเห็นในช่วงที่เลือก</p>}
              </div>
            </Card>
          </div>
        </section>
      </main>

      {previewImage && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <img src={previewImage} alt="ภาพกิจกรรม" className="max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl" />
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-lg font-bold text-white"
              aria-label="ปิดภาพ"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
