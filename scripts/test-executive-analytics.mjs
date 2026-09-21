import assert from "node:assert/strict";
import {
  parseScore,
  computeAverage,
  getRatingLevel,
  computeExecutiveMetrics,
  generateReportCsvContent,
  getSurveyScoreLabelOverrides,
  ALL_SCORE_FIELDS,
} from "../src/features/analytics/executiveAnalytics.ts";

console.log("Running Executive Analytics Unit Tests...\n");

// 1. Invariant: Null/invalid score does not count as zero
assert.equal(parseScore(null), null, "null score must return null");
assert.equal(parseScore(undefined), null, "undefined score must return null");
assert.equal(parseScore(""), null, "empty string score must return null");
assert.equal(parseScore(0), null, "0 is out of 1-5 scale and must return null");
assert.equal(parseScore(6), null, "6 is out of 1-5 scale and must return null");
assert.equal(parseScore(5), 5, "5 is valid score");
assert.equal(parseScore("4"), 4, "string '4' parsed to 4");
console.log("PASS: Score parsing and 1..5 scale invariant verified");

// 2. Average computation
assert.equal(computeAverage([]), null, "empty list average must be null");
assert.equal(computeAverage([4, 5]), 4.5, "average of 4 and 5 is 4.5");
console.log("PASS: Average computation verified");

// 3. Rating level bands
assert.equal(getRatingLevel(null), "-", "null overall score shows '-'");
assert.equal(getRatingLevel(4.8), "ดีมาก", ">= 4.5 is 'ดีมาก'");
assert.equal(getRatingLevel(3.9), "ดี", ">= 3.5 is 'ดี'");
assert.equal(getRatingLevel(3.0), "ปานกลาง", ">= 2.5 is 'ปานกลาง'");
assert.equal(getRatingLevel(2.0), "ควรปรับปรุง", "< 2.5 is 'ควรปรับปรุง'");
console.log("PASS: Rating level bands verified");

// 4. Executive metrics computation with domain data
const mockOccurrences = [
  {
    id: "occ-1",
    activity_id: "act-1",
    occurrence_no: 1,
    start_at: "2026-03-01",
    participant_count: 50,
    status: "completed",
  },
  {
    id: "occ-2",
    activity_id: "act-1",
    occurrence_no: 2,
    start_at: "2026-03-02",
    participant_count: 50,
    status: "completed",
  },
];

const mockResponses = [
  {
    id: "resp-1",
    activity_id: "act-1",
    occurrence_id: "occ-1",
    submitted_at: "2026-03-01T12:00:00Z",
    age_group: "21-30",
    affiliation: "นักศึกษา",
    p2_location: 5,
    p2_schedule: 4,
    p2_readiness: 5,
    p2_reception: 4,
    p2_overall: 5,
    p3_interest: 4,
    p3_content: 5,
    p3_clarity: 4,
    p3_benefit: 5,
    p3_application: 4,
    p4_knowledge: 5,
    p4_inspiration: 4,
    p4_community_resource: 5,
    p4_future_return: 5,
    feedback: "ยอดเยี่ยมมาก",
    channels: "FACEBOOK, LINE",
  },
  {
    id: "resp-2",
    activity_id: "act-1",
    occurrence_id: "occ-2",
    submitted_at: "2026-03-02T12:00:00Z",
    age_group: "31-40",
    affiliation: "ประชาชนทั่วไป",
    p2_location: 4,
    p2_schedule: 4,
    p2_readiness: 4,
    p2_reception: 4,
    p2_overall: 4,
    p3_interest: 4,
    p3_content: 4,
    p3_clarity: 4,
    p3_benefit: 4,
    p3_application: 4,
    p4_knowledge: 4,
    p4_inspiration: 4,
    p4_community_resource: 4,
    p4_future_return: 4,
    feedback: "อยากให้จัดอีก",
    channels: "WEBSITE",
  },
];

const labelOverrides = getSurveyScoreLabelOverrides(
  [
    {
      id: "q-1",
      survey_id: "survey-1",
      section_key: "opening",
      question_type: "rating",
      question_text: "ความเหมาะสมของสถานที่จัดงาน",
      order_index: 1,
      active: true,
    },
  ],
  "survey-1",
);
const rankedMetrics = computeExecutiveMetrics(
  mockOccurrences,
  mockResponses,
  "age_group",
  [],
  labelOverrides,
);
assert.equal(
  rankedMetrics.questionScores[0].label,
  "สถานที่",
  "without a selected survey response, default labels remain deterministic",
);
assert.equal(
  rankedMetrics.questionScores[0].value >=
    rankedMetrics.questionScores[rankedMetrics.questionScores.length - 1].value,
  true,
  "question scores must be sorted from highest to lowest",
);
assert.equal(
  getSurveyScoreLabelOverrides(
    [
      {
        id: "q-1",
        survey_id: "survey-1",
        section_key: "opening",
        question_type: "rating",
        question_text: "ความเหมาะสมของสถานที่จัดงาน",
        order_index: 1,
        active: true,
      },
    ],
    "survey-1",
  ).p2_location,
  "ความเหมาะสมของสถานที่จัดงาน",
  "survey wording override must match the questionnaire text exactly",
);

const metrics = computeExecutiveMetrics(mockOccurrences, mockResponses, "age_group", []);

assert.equal(metrics.participants, 100, "total participants must be 100");
assert.equal(metrics.responseCount, 2, "total responses must be 2");
assert.equal(metrics.responseRate, 2.0, "response rate must be 2%");
assert.ok(
  metrics.overallScore !== null && metrics.overallScore > 4.0,
  "overall score must be > 4.0",
);
assert.equal(metrics.ratingLevel, "ดี", "overall rating level for 4.21 must be 'ดี'");
assert.equal(
  metrics.questionScores.length,
  ALL_SCORE_FIELDS.length,
  "all 14 score fields must be evaluated",
);
assert.equal(
  metrics.scoreGroups.length,
  3,
  "must have 3 score groups (opening, learning, outcome)",
);
assert.equal(metrics.channelDistribution.length, 3, "must detect FACEBOOK, LINE, WEBSITE");
assert.equal(metrics.comments.length, 2, "must collect 2 comments");
console.log("PASS: Executive metrics calculations verified");

// 5. CSV export generation formatting
const csvContent = generateReportCsvContent([
  {
    respondentId: "resp-1",
    activity: "โครงการอบรม",
    date: "2026-03-01",
    submittedAt: "2026-03-01T12:00:00Z",
    ageGroup: "21-30",
    affiliation: "นักศึกษา",
    organization: "ม.มหิดล",
    group: "การจัดกิจกรรม",
    question: "สถานที่",
    score: "5.00",
    feedback: "ดีมาก",
    channels: "FACEBOOK",
  },
]);

assert.ok(
  csvContent.startsWith("\uFEFF"),
  "CSV must include UTF-8 BOM for Excel Thai compatibility",
);
assert.ok(csvContent.includes("รหัสผู้ตอบ"), "CSV must include column header");
assert.ok(csvContent.includes("โครงการอบรม"), "CSV must contain row data");
console.log("PASS: CSV generation formatting verified");

console.log("\nAll 5 Executive Analytics test suites passed successfully! 🎉");
