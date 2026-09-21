import type { AdminDashboardData } from "@/services/api";

export type Period = "ALL" | "YEAR" | "QUARTER" | "MONTH" | "CUSTOM";
export type Dimension = "age_group" | "affiliation" | "organization";
export type ResponseWithChannels = AdminDashboardData["responses"][number] & {
  channels?: string | null;
};

export type ScoreField = keyof Pick<
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

export type ScoreItem = {
  field: ScoreField;
  label: string;
  value: number;
  respondentCount: number;
};

const SCORE_FIELD_GROUPS: Record<string, ScoreField[]> = {
  opening: ["p2_location", "p2_schedule", "p2_readiness", "p2_reception", "p2_overall"],
  learning: ["p3_interest", "p3_content", "p3_clarity", "p3_benefit", "p3_application"],
  outcomes: ["p4_knowledge", "p4_inspiration", "p4_community_resource", "p4_future_return"],
};

function buildSurveyScoreLabelOverrides(
  surveyQuestions: AdminDashboardData["surveyQuestions"],
  surveyId: string | null,
): Partial<Record<ScoreField, string>> {
  if (!surveyId) return {};

  const overrides: Partial<Record<ScoreField, string>> = {};
  for (const [sectionKey, fields] of Object.entries(SCORE_FIELD_GROUPS)) {
    const sectionQuestions = surveyQuestions
      .filter(
        (question) =>
          question.survey_id === surveyId &&
          question.active &&
          question.question_type === "rating" &&
          (question.section_key === sectionKey ||
            (sectionKey === "outcomes" && question.section_key === "outcome")),
      )
      .sort((a, b) => a.order_index - b.order_index);

    sectionQuestions.slice(0, fields.length).forEach((question, index) => {
      const text = question.question_text;
      if (text.trim()) overrides[fields[index]] = text;
    });
  }

  return overrides;
}

export function getSurveyScoreLabelOverrides(
  surveyQuestions: AdminDashboardData["surveyQuestions"],
  surveyId: string | null,
) {
  return buildSurveyScoreLabelOverrides(surveyQuestions, surveyId);
}

export type ScoreGroup = {
  key: string;
  title: string;
  fields: ScoreField[];
  items: ScoreItem[];
};

export type ReportRow = {
  id: string;
  activity: string;
  date: string;
  submittedAt: string;
  ageGroup: string;
  affiliation: string;
  organization: string;
  scores: Record<ScoreField, string>;
  feedback: string;
  channels: string;
};

export type ReportDetailRow = {
  respondentId: string;
  activity: string;
  date: string;
  submittedAt: string;
  ageGroup: string;
  affiliation: string;
  organization: string;
  group: string;
  question: string;
  score: string;
  feedback: string;
  channels: string;
};

export type RespondentDetailRow = {
  id: string;
  activity: string;
  date: string;
  submittedAt: string;
  ageGroup: string;
  affiliation: string;
  organization: string;
  averageScore: number | null;
  feedback: string;
  channels: string;
};

export type DistributionItem = {
  label: string;
  count: number;
  percentage: number;
  color: string;
};

export type ScoreDistributionItem = {
  value: number;
  count: number;
  percent: number;
};

export type ChannelDistributionItem = {
  label: string;
  count: number;
  color: string;
};

export type ExecutiveMetrics = {
  participants: number;
  responseCount: number;
  pending: number;
  responseRate: number | null;
  overallScore: number | null;
  ratingLevel: string;
  questionScores: ScoreItem[];
  scoreGroups: ScoreGroup[];
  highestScore?: ScoreItem;
  lowestScore?: ScoreItem;
  respondentDistribution: DistributionItem[];
  scoreDistribution: ScoreDistributionItem[];
  channelDistribution: ChannelDistributionItem[];
  comments: string[];
};

export type DateFilterOptions = {
  period: Period;
  year: string;
  quarter: string;
  month: string;
  from: string;
  to: string;
};

export const SCORE_GROUPS_DEF: { key: string; title: string; fields: ScoreField[] }[] = [
  {
    key: "opening",
    title: "การจัดกิจกรรม (Activity Organization)",
    fields: ["p2_location", "p2_schedule", "p2_readiness", "p2_reception", "p2_overall"],
  },
  {
    key: "learning",
    title: "เนื้อหาและการเรียนรู้ (Content & Learning)",
    fields: ["p3_interest", "p3_content", "p3_clarity", "p3_benefit", "p3_application"],
  },
  {
    key: "outcome",
    title: "ผลลัพธ์และประโยชน์ (Outcomes & Benefits)",
    fields: ["p4_knowledge", "p4_inspiration", "p4_community_resource", "p4_future_return"],
  },
];

export const SCORE_LABELS: Record<ScoreField, string> = {
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

export const ALL_SCORE_FIELDS = Object.keys(SCORE_LABELS) as ScoreField[];

export const CHART_COLORS = ["#10B981", "#0EA5E9", "#F59E0B", "#A855F7", "#FB7185", "#CBD5E1"];

export const CHANNEL_BRAND_COLORS: Record<string, string> = {
  FACEBOOK: "#1877F2",
  LINE: "#06C755",
  WEBSITE: "#123B6D",
  อื่นๆ: "#6B7280",
};

export function parseScore(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) && n >= 1 && n <= 5 ? n : null;
}

export function computeAverage(values: number[]): number | null {
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
}

export function formatThaiNumber(value: number): string {
  return new Intl.NumberFormat("th-TH").format(value);
}

export function formatThaiDate(value?: string | null): string {
  if (!value) return "-";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? "-"
    : new Intl.DateTimeFormat("th-TH", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(d);
}

export function formatThaiDateTime(value?: string | null): string {
  if (!value) return "-";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? "-"
    : new Intl.DateTimeFormat("th-TH", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(d);
}

export function matchesDateFilter(
  value: string,
  period: Period,
  year: string,
  quarter: string,
  month: string,
  from: string,
  to: string,
): boolean {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return false;
  if (period === "ALL") return true;
  if (period === "YEAR") return year === "ALL" || String(d.getFullYear()) === year;
  if (period === "QUARTER")
    return !quarter || `${d.getFullYear()}-Q${Math.floor(d.getMonth() / 3) + 1}` === quarter;
  if (period === "MONTH") return !month || value.slice(0, 7) === month;
  const day = value.slice(0, 10);
  return (!from || day >= from) && (!to || day <= to);
}

export function getRatingLevel(overallScore: number | null): string {
  if (overallScore === null) return "-";
  if (overallScore >= 4.5) return "ดีมาก";
  if (overallScore >= 3.5) return "ดี";
  if (overallScore >= 2.5) return "ปานกลาง";
  return "ควรปรับปรุง";
}

export function computeExecutiveMetrics(
  occurrences: AdminDashboardData["occurrences"],
  responses: AdminDashboardData["responses"],
  dimension: Dimension,
  organizations: AdminDashboardData["organizations"],
  scoreLabelOverrides: Partial<Record<ScoreField, string>> = {},
): ExecutiveMetrics {
  const participants = occurrences.reduce(
    (s, o) => s + Math.max(0, Number(o.participant_count || 0)),
    0,
  );
  const responseCount = responses.length;
  const pending = Math.max(0, participants - responseCount);
  const responseRate = participants ? (responseCount / participants) * 100 : null;

  const questionScores: ScoreItem[] = ALL_SCORE_FIELDS.flatMap((field) => {
    const values = responses
      .map((r) => parseScore(r[field]))
      .filter((x): x is number => x !== null);
    const value = computeAverage(values);
    return value === null
      ? []
      : [
          {
            field,
            label: scoreLabelOverrides[field] ?? SCORE_LABELS[field],
            value,
            respondentCount: values.length,
          },
        ];
  }).sort((a, b) => b.value - a.value);

  const scoreGroups: ScoreGroup[] = SCORE_GROUPS_DEF.map((g) => ({
    ...g,
    items: g.fields
      .map((f) => questionScores.find((x) => x.field === f))
      .filter((x): x is ScoreItem => Boolean(x)),
  })).filter((g) => g.items.length > 0);

  const overallScore = computeAverage(
    responses.flatMap((r) =>
      ALL_SCORE_FIELDS.map((f) => parseScore(r[f])).filter((x): x is number => x !== null),
    ),
  );

  const sortedScores = [...questionScores].sort((a, b) => b.value - a.value);
  const highestScore = sortedScores[0];
  const lowestScore = sortedScores[sortedScores.length - 1];

  const respondentMap = new Map<string, number>();
  for (const r of responses) {
    const raw =
      dimension === "age_group"
        ? r.age_group
        : dimension === "affiliation"
          ? r.affiliation
          : organizations.find((o) => o.id === r.participant_organization_id)?.name;
    const v = raw?.trim();
    if (v) respondentMap.set(v, (respondentMap.get(v) || 0) + 1);
  }

  const respondentDistribution: DistributionItem[] = [...respondentMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([label, count], i) => ({
      label,
      count,
      percentage: responseCount ? (count / responseCount) * 100 : 0,
      color: CHART_COLORS[i % CHART_COLORS.length],
    }));

  const totalScoresSubmitted = responses.reduce(
    (s, r) => s + ALL_SCORE_FIELDS.filter((f) => parseScore(r[f]) !== null).length,
    0,
  );

  const scoreDistribution: ScoreDistributionItem[] = [5, 4, 3, 2, 1].map((v) => {
    const count = responses.reduce(
      (s, r) => s + ALL_SCORE_FIELDS.filter((f) => parseScore(r[f]) === v).length,
      0,
    );
    return {
      value: v,
      count,
      percent: totalScoresSubmitted ? (count / totalScoresSubmitted) * 100 : 0,
    };
  });

  const channelMap = new Map<string, number>();
  for (const r of responses as ResponseWithChannels[]) {
    const raw = r.channels?.trim();
    if (!raw || raw === "-") continue;
    for (const p of new Set(
      raw
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
    )) {
      const u = p.toUpperCase();
      const c = u.includes("FACEBOOK")
        ? "FACEBOOK"
        : u.includes("LINE")
          ? "LINE"
          : u.includes("WEBSITE")
            ? "WEBSITE"
            : "อื่นๆ";
      channelMap.set(c, (channelMap.get(c) || 0) + 1);
    }
  }

  const channelDistribution: ChannelDistributionItem[] = ["FACEBOOK", "LINE", "WEBSITE", "อื่นๆ"]
    .map((label) => ({
      label,
      count: channelMap.get(label) || 0,
      color: CHANNEL_BRAND_COLORS[label],
    }))
    .filter((x) => x.count > 0);

  const comments = responses.map((r) => r.feedback?.trim()).filter((x): x is string => Boolean(x));

  return {
    participants,
    responseCount,
    pending,
    responseRate,
    overallScore,
    ratingLevel: getRatingLevel(overallScore),
    questionScores,
    scoreGroups,
    highestScore,
    lowestScore,
    respondentDistribution,
    scoreDistribution,
    channelDistribution,
    comments,
  };
}

export function buildReportRows(
  data: AdminDashboardData | null,
  responses: AdminDashboardData["responses"],
): ReportRow[] {
  if (!data) return [];
  const occurrenceMap = new Map(data.occurrences.map((o) => [o.id, o]));
  const activityMap = new Map(data.activities.map((a) => [a.id, a]));
  const organizationMap = new Map((data.organizations ?? []).map((o) => [o.id, o.name]));

  return responses
    .map((r, index) => {
      const occurrence = r.occurrence_id ? occurrenceMap.get(r.occurrence_id) : undefined;
      const activityId = r.activity_id || occurrence?.activity_id;
      const activityItem = activityId ? activityMap.get(activityId) : undefined;
      const scores = Object.fromEntries(
        ALL_SCORE_FIELDS.map((field) => [field, parseScore(r[field])?.toFixed(2) || ""]),
      ) as Record<ScoreField, string>;

      return {
        id: String(r.id || `${activityId || "row"}-${index}`),
        activity: activityItem?.title || "-",
        date: occurrence?.start_at || activityItem?.activity_date || "",
        submittedAt: r.submitted_at || "",
        ageGroup: r.age_group || "",
        affiliation: r.affiliation || "",
        organization:
          (r.participant_organization_id
            ? organizationMap.get(r.participant_organization_id)
            : "") || "",
        scores,
        feedback: r.feedback?.trim() || "",
        channels: (r as ResponseWithChannels).channels?.trim() || "",
      };
    })
    .sort(
      (a, b) =>
        new Date(b.submittedAt || b.date).getTime() - new Date(a.submittedAt || a.date).getTime(),
    );
}

export function buildReportDetailRows(filteredReportRows: ReportRow[]): ReportDetailRow[] {
  return filteredReportRows.flatMap((r) =>
    ALL_SCORE_FIELDS.map((field) => ({
      respondentId: r.id,
      activity: r.activity,
      date: r.date,
      submittedAt: r.submittedAt,
      ageGroup: r.ageGroup,
      affiliation: r.affiliation,
      organization: r.organization,
      group: SCORE_GROUPS_DEF.find((g) => g.fields.includes(field))?.title || "-",
      question: SCORE_LABELS[field],
      score: r.scores[field] || "",
      feedback: r.feedback,
      channels: r.channels,
    })),
  );
}

export function buildRespondentDetailRows(reportRows: ReportRow[]): RespondentDetailRow[] {
  return reportRows.map((row) => {
    const scores = ALL_SCORE_FIELDS.map((field) => parseScore(row.scores[field])).filter(
      (value): value is number => value !== null,
    );
    return {
      id: row.id,
      activity: row.activity,
      date: row.date,
      submittedAt: row.submittedAt,
      ageGroup: row.ageGroup,
      affiliation: row.affiliation,
      organization: row.organization,
      averageScore: scores.length ? computeAverage(scores) : null,
      feedback: row.feedback,
      channels: row.channels,
    };
  });
}

function csvEscapeCell(value: unknown): string {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export function generateReportCsvContent(detailRows: ReportDetailRow[]): string {
  const headers = [
    "รหัสผู้ตอบ",
    "กิจกรรม",
    "วันที่กิจกรรม",
    "วันที่ส่งแบบประเมิน",
    "ช่วงอายุ",
    "ประเภทผู้ตอบ",
    "หน่วยงาน",
    "หมวดคำถาม",
    "ข้อคำถาม",
    "คะแนน (1-5)",
    "ความคิดเห็น",
    "ช่องทางการรับรู้",
  ];
  const rows = detailRows.map((r) => [
    r.respondentId,
    r.activity,
    formatThaiDate(r.date),
    formatThaiDateTime(r.submittedAt),
    r.ageGroup,
    r.affiliation,
    r.organization,
    r.group,
    r.question,
    r.score,
    r.feedback,
    r.channels,
  ]);
  return "\uFEFF" + [headers, ...rows].map((row) => row.map(csvEscapeCell).join(",")).join("\r\n");
}
