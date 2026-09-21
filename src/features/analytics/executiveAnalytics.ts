import type { AdminDashboardData } from "@/services/api";

export type Period = "ALL" | "YEAR" | "QUARTER" | "MONTH" | "CUSTOM";
export type Dimension = "age_group" | "affiliation" | "organization";
export type ResponseWithChannels = AdminDashboardData["responses"][number] & {
  channels?: string | null;
};

export type ScoreField = string;

export type ScoreItem = {
  field: ScoreField;
  questionId: string;
  surveyId: string;
  sectionKey: string;
  orderIndex: number;
  label: string;
  value: number;
  respondentCount: number;
};

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
  scores: Record<string, string>;
  questionDetails: {
    field: string;
    group: string;
    question: string;
    score: string;
  }[];
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

const SECTION_TITLE_LABELS: Record<string, string> = {
  opening: "การจัดกิจกรรม (Activity Organization)",
  learning: "เนื้อหาและการเรียนรู้ (Content & Learning)",
  learning_room: "เนื้อหาและการเรียนรู้ (Content & Learning)",
  outcomes: "ผลลัพธ์และประโยชน์ (Outcomes & Benefits)",
};

function sectionTitle(sectionKey: string) {
  return (
    SECTION_TITLE_LABELS[sectionKey] ??
    sectionKey
      .replace(/[_-]+/g, " ")
      .replace(/\b\w/g, (value) => value.toUpperCase())
  );
}

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
  activities: AdminDashboardData["activities"],
  responses: AdminDashboardData["responses"],
  surveyQuestions: AdminDashboardData["surveyQuestions"],
  surveyAnswers: AdminDashboardData["surveyAnswers"],
  dimension: Dimension,
  organizations: AdminDashboardData["organizations"],
  surveyId: string | null = null,
): ExecutiveMetrics {
  const participants = activities.reduce(
    (sum, activity) => sum + Math.max(0, Number(activity.participants ?? 0)),
    0,
  );
  const responseCount = responses.length;
  const pending = Math.max(0, participants - responseCount);
  const responseRate = participants ? (responseCount / participants) * 100 : null;

  const responseIds = new Set(responses.map((response) => response.id));
  const activeRatingQuestions = surveyQuestions
    .filter(
      (question) =>
        question.active &&
        question.question_type === "rating" &&
        question.question_text.trim() &&
        (!surveyId || question.survey_id === surveyId),
    )
    .sort((a, b) => a.order_index - b.order_index);

  const questionMap = new Map(activeRatingQuestions.map((question) => [question.id, question]));
  const valuesByQuestion = new Map<string, number[]>();
  for (const answer of surveyAnswers) {
    if (!responseIds.has(answer.response_id)) continue;
    const question = questionMap.get(answer.question_id);
    if (!question) continue;
    const value = parseScore(answer.answer_number);
    if (value === null) continue;
    const values = valuesByQuestion.get(question.id) ?? [];
    values.push(value);
    valuesByQuestion.set(question.id, values);
  }

  const questionScores = activeRatingQuestions
    .flatMap((question) => {
      const values = valuesByQuestion.get(question.id) ?? [];
      const value = computeAverage(values);
      return value === null
        ? []
        : [
            {
              field: question.id,
              questionId: question.id,
              surveyId: question.survey_id,
              sectionKey: question.section_key,
              orderIndex: question.order_index,
              label: question.question_text.trim(),
              value,
              respondentCount: values.length,
            },
          ];
    })
    .sort((a, b) => b.value - a.value);

  const groups = new Map<string, ScoreItem[]>();
  const groupFirstOrder = new Map<string, number>();
  for (const item of questionScores) {
    const current = groups.get(item.sectionKey) ?? [];
    current.push(item);
    groups.set(item.sectionKey, current);
    groupFirstOrder.set(
      item.sectionKey,
      Math.min(groupFirstOrder.get(item.sectionKey) ?? Number.POSITIVE_INFINITY, item.orderIndex),
    );
  }

  const scoreGroups = [...groups.entries()]
    .sort((a, b) => (groupFirstOrder.get(a[0]) ?? 0) - (groupFirstOrder.get(b[0]) ?? 0))
    .map(([key, items]) => ({
      key,
      title: sectionTitle(key),
      fields: items.map((item) => item.field),
      items: [...items].sort((a, b) => b.value - a.value),
    }));

  const allSubmittedScores = [...valuesByQuestion.values()].flat();
  const overallScore = computeAverage(allSubmittedScores);
  const highestScore = questionScores[0];
  const lowestScore = questionScores.at(-1);

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

  const scoreDistribution: ScoreDistributionItem[] = [5, 4, 3, 2, 1].map((value) => {
    const count = allSubmittedScores.filter((score) => score === value).length;
    return {
      value,
      count,
      percent: allSubmittedScores.length ? (count / allSubmittedScores.length) * 100 : 0,
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
  surveyQuestions: AdminDashboardData["surveyQuestions"],
  surveyAnswers: AdminDashboardData["surveyAnswers"],
): ReportRow[] {
  if (!data) return [];
  const occurrenceMap = new Map(data.occurrences.map((o) => [o.id, o]));
  const activityMap = new Map(data.activities.map((a) => [a.id, a]));
  const organizationMap = new Map((data.organizations ?? []).map((o) => [o.id, o.name]));
  const answersByResponse = new Map<string, AdminDashboardData["surveyAnswers"]>();
  for (const answer of surveyAnswers) {
    const current = answersByResponse.get(answer.response_id) ?? [];
    current.push(answer);
    answersByResponse.set(answer.response_id, current);
  }

  return responses
    .map((r, index) => {
      const occurrence = r.occurrence_id ? occurrenceMap.get(r.occurrence_id) : undefined;
      const activityId = r.activity_id || occurrence?.activity_id;
      const activityItem = activityId ? activityMap.get(activityId) : undefined;
      const ratingQuestions = surveyQuestions
        .filter(
          (question) =>
            question.active &&
            question.question_type === "rating" &&
            (!r.survey_id || question.survey_id === r.survey_id),
        )
        .sort((a, b) => a.order_index - b.order_index);
      const answersForResponse = new Map(
        (answersByResponse.get(r.id) ?? []).map((answer) => [answer.question_id, answer]),
      );
      const questionDetails = ratingQuestions.map((question) => ({
        field: question.id,
        group: sectionTitle(question.section_key),
        question: question.question_text.trim(),
        score: parseScore(answersForResponse.get(question.id)?.answer_number)?.toFixed(2) ?? "",
      }));
      const scores = Object.fromEntries(
        questionDetails.map((question) => [question.field, question.score]),
      );

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
        questionDetails,
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
    r.questionDetails.map((question) => ({
      respondentId: r.id,
      activity: r.activity,
      date: r.date,
      submittedAt: r.submittedAt,
      ageGroup: r.ageGroup,
      affiliation: r.affiliation,
      organization: r.organization,
      group: question.group,
      question: question.question,
      score: question.score,
      feedback: r.feedback,
      channels: r.channels,
    })),
  );
}

export function buildRespondentDetailRows(reportRows: ReportRow[]): RespondentDetailRow[] {
  return reportRows.map((row) => {
    const scores = Object.values(row.scores)
      .map((value) => parseScore(value))
      .filter((value): value is number => value !== null);
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
