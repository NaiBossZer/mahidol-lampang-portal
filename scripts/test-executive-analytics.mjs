import assert from "node:assert/strict";
import {
  parseScore,
  computeAverage,
  getRatingLevel,
  computeExecutiveMetrics,
  buildReportRows,
  generateReportCsvContent,
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

// 4. Executive metrics computation from canonical survey_questions + survey_answers
const mockActivities = [
  {
    id: "act-1",
    title: "โครงการทดสอบ",
    activity_date: "2026-03-01",
    participants: 120,
    status: "completed",
  },
];

const mockResponses = [
  {
    id: "resp-1",
    activity_id: "act-1",
    occurrence_id: "occ-1",
    survey_id: "survey-1",
    submitted_at: "2026-03-01T12:00:00Z",
    age_group: "21-30",
    affiliation: "นักศึกษา",
    feedback: "ยอดเยี่ยมมาก",
    channels: "FACEBOOK, LINE",
  },
  {
    id: "resp-2",
    activity_id: "act-1",
    occurrence_id: "occ-2",
    survey_id: "survey-1",
    submitted_at: "2026-03-02T12:00:00Z",
    age_group: "31-40",
    affiliation: "ประชาชนทั่วไป",
    feedback: "อยากให้จัดอีก",
    channels: "WEBSITE",
  },
];

const mockQuestions = [
  {
    id: "q-location",
    survey_id: "survey-1",
    section_key: "opening",
    question_type: "rating",
    question_text: "ความเหมาะสมของสถานที่จัดงาน",
    order_index: 1,
    active: true,
  },
  {
    id: "q-schedule",
    survey_id: "survey-1",
    section_key: "opening",
    question_type: "rating",
    question_text: "ความเหมาะสมของกำหนดการและระยะเวลาการจัดงาน",
    order_index: 2,
    active: true,
  },
  {
    id: "q-learning",
    survey_id: "survey-1",
    section_key: "learning_room",
    question_type: "rating",
    question_text: "ความน่าสนใจของห้องการเรียนรู้และนิทรรศการ",
    order_index: 6,
    active: true,
  },
  {
    id: "q-outcome",
    survey_id: "survey-1",
    section_key: "outcomes",
    question_type: "rating",
    question_text: "ท่านมีความสนใจเข้าร่วมกิจกรรมหรือกลับมาใช้ห้องการเรียนรู้อีกในอนาคต",
    order_index: 14,
    active: true,
  },
  {
    id: "q-text",
    survey_id: "survey-1",
    section_key: "feedback",
    question_type: "text",
    question_text: "ข้อเสนอแนะเพิ่มเติม",
    order_index: 15,
    active: true,
  },
];

const mockAnswers = [
  { id: "ans-1", response_id: "resp-1", question_id: "q-location", answer_number: 5 },
  { id: "ans-2", response_id: "resp-1", question_id: "q-schedule", answer_number: 4 },
  { id: "ans-3", response_id: "resp-1", question_id: "q-learning", answer_number: 5 },
  { id: "ans-4", response_id: "resp-1", question_id: "q-outcome", answer_number: 5 },
  { id: "ans-5", response_id: "resp-2", question_id: "q-location", answer_number: 4 },
  { id: "ans-6", response_id: "resp-2", question_id: "q-schedule", answer_number: 4 },
  { id: "ans-7", response_id: "resp-2", question_id: "q-learning", answer_number: 4 },
  { id: "ans-8", response_id: "resp-2", question_id: "q-outcome", answer_number: 4 },
];

const metrics = computeExecutiveMetrics(
  mockActivities,
  mockResponses,
  mockQuestions,
  mockAnswers,
  "age_group",
  [],
  "survey-1",
);

assert.equal(metrics.participants, 120, "activities.participant_count must be canonical");
assert.equal(metrics.responseCount, 2, "total responses must be 2");
assert.equal(metrics.responseRate, (2 / 120) * 100, "response rate must use activity participant_count");
assert.ok(
  metrics.overallScore !== null && metrics.overallScore > 4.0,
  "overall score must be > 4.0",
);
assert.equal(metrics.ratingLevel, "ดี", "overall rating level for dynamic survey answers");
assert.equal(
  metrics.questionScores.length,
  4,
  "only active rating questions with canonical answers must be evaluated",
);
assert.equal(
  metrics.questionScores[0]?.label,
  "ความเหมาะสมของสถานที่จัดงาน",
  "question labels must come from survey_questions",
);
assert.equal(
  metrics.scoreGroups.length,
  3,
  "three groups must be derived from question section_key",
);
assert.equal(
  metrics.scoreGroups.every(
    (group) =>
      group.items.every(
        (item, index, items) => index === 0 || items[index - 1].value >= item.value,
      ),
  ),
  true,
  "scores must be sorted highest-to-lowest within each survey section",
);
assert.equal(metrics.channelDistribution.length, 3, "must detect FACEBOOK, LINE, WEBSITE");
assert.equal(metrics.comments.length, 2, "must collect 2 comments");
console.log("PASS: Executive metrics calculations from canonical survey data verified");

const reportRows = buildReportRows(
  {
    activities: mockActivities,
    occurrences: [],
    organizations: [],
  },
  mockResponses,
  mockQuestions,
  mockAnswers,
);
assert.equal(reportRows[0]?.questionDetails.length, 4, "report must use dynamic rating questions");
assert.ok(
  reportRows[0]?.questionDetails.some((q) => q.question === "ความเหมาะสมของกำหนดการและระยะเวลาการจัดงาน"),
  "report must preserve full dynamic question text",
);
console.log("PASS: Dynamic report question rows verified");

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
