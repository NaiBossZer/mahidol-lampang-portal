import { json, supabaseConfig } from "./auth/_shared";

type Env = Record<string, unknown>;
type Row = Record<string, unknown>;
type Answer = { questionId: string; number?: number; text?: string; options?: string[] };

function isSurveyOpen(survey: Row, now = Date.now()) {
  const openAt = survey.open_at ? Date.parse(String(survey.open_at)) : null;
  const closeAt = survey.close_at ? Date.parse(String(survey.close_at)) : null;
  return (openAt === null || now >= openAt) && (closeAt === null || now <= closeAt);
}

async function sb<T>(env: Env, path: string, init: RequestInit = {}) {
  const { url, key, configured } = supabaseConfig(env);
  if (!configured) throw new Error("Supabase is not configured");
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`Supabase REST ${response.status}`);
  return body as T;
}

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  try {
    const url = new URL(request.url);
    if (request.method === "GET") {
      const surveyId = url.searchParams.get("surveyId");
      if (!surveyId) {
        const surveys = await sb<Row[]>(
          env,
          "occurrence_surveys?enabled=eq.true&select=id,occurrence_id,title,anonymous,welcome_text,open_at,close_at&order=created_at.desc",
        );
        return json({ success: true, data: surveys.filter((survey) => isSurveyOpen(survey)) });
      }
      const surveys = await sb<Row[]>(
        env,
        `occurrence_surveys?id=eq.${encodeURIComponent(surveyId)}&enabled=eq.true&select=id,occurrence_id,title,anonymous,open_at,close_at,welcome_text`,
      );
      if (!surveys[0])
        return json({ success: false, error: "ไม่พบแบบสอบถามหรือแบบสอบถามปิดอยู่" }, 404);
      const survey = surveys[0];
      if (!isSurveyOpen(survey))
        return json({ success: false, error: "แบบสอบถามยังไม่เปิดหรือปิดรับคำตอบแล้ว" }, 409);
      const questions = await sb<Row[]>(
        env,
        `survey_questions?survey_id=eq.${encodeURIComponent(surveyId)}&active=eq.true&select=id,section_key,question_text,question_type,required,order_index,options,scale_min,scale_max&order=order_index.asc`,
      );
      return json({ success: true, data: { ...survey, questions } });
    }
    if (request.method !== "POST")
      return json({ success: false, error: "Method Not Allowed" }, 405, { Allow: "GET, POST" });
    const body = (await request.json()) as {
      surveyId?: string;
      activityId?: string;
      occurrenceId?: string;
      ageGroup?: string;
      affiliation?: string;
      everJoined?: string;
      channels?: string;
      feedback?: string;
      pdpaConsent?: boolean;
      answers?: Answer[];
    };
    if (!body.surveyId || body.pdpaConsent !== true)
      return json({ success: false, error: "ต้องระบุ surveyId และยินยอม PDPA" }, 400);
    const surveys = await sb<Row[]>(
      env,
      `occurrence_surveys?id=eq.${encodeURIComponent(body.surveyId)}&enabled=eq.true&select=id,occurrence_id,open_at,close_at`,
    );
    const survey = surveys[0];
    if (!survey) return json({ success: false, error: "แบบสอบถามไม่พร้อมรับคำตอบ" }, 409);
    const now = Date.now();
    if (survey.open_at && now < Date.parse(String(survey.open_at)))
      return json({ success: false, error: "แบบสอบถามยังไม่เปิด" }, 409);
    if (survey.close_at && now > Date.parse(String(survey.close_at)))
      return json({ success: false, error: "แบบสอบถามปิดรับคำตอบแล้ว" }, 409);
    const questions = await sb<Row[]>(
      env,
      `survey_questions?survey_id=eq.${encodeURIComponent(body.surveyId)}&active=eq.true&select=id,question_type,required,options,scale_min,scale_max`,
    );
    if (questions.length === 0)
      return json({ success: false, error: "แบบสอบถามนี้ยังไม่มีคำถาม" }, 409);

    const answers = Array.isArray(body.answers) ? body.answers : [];
    const questionById = new Map(questions.map((question) => [String(question.id), question]));
    const seen = new Set<string>();
    const normalizedAnswers: Row[] = [];
    for (const answer of answers) {
      const question = questionById.get(String(answer.questionId ?? ""));
      if (!question || seen.has(String(answer.questionId)))
        return json({ success: false, error: "พบคำตอบที่ไม่ตรงกับคำถามในแบบประเมิน" }, 400);
      seen.add(String(answer.questionId));
      const type = String(question.question_type);
      const options = Array.isArray(question.options) ? question.options.map(String) : [];
      if (type === "rating") {
        const value = Number(answer.number);
        const min = Number(question.scale_min ?? 1);
        const max = Number(question.scale_max ?? 5);
        if (!Number.isFinite(value) || value < min || value > max)
          return json({ success: false, error: "คะแนนประเมินอยู่นอกช่วงที่กำหนด" }, 400);
        normalizedAnswers.push({ question_id: question.id, answer_number: value, answer_text: null, answer_options: [] });
      } else if (type === "single_choice") {
        const value = String(answer.text ?? "");
        if (!options.includes(value))
          return json({ success: false, error: "กรุณาเลือกตัวเลือกที่กำหนด" }, 400);
        normalizedAnswers.push({ question_id: question.id, answer_number: null, answer_text: value, answer_options: [] });
      } else if (type === "multi_choice") {
        const values = Array.isArray(answer.options) ? answer.options.map(String) : [];
        if (question.required === true && values.length === 0)
          return json({ success: false, error: "กรุณาเลือกคำตอบในคำถามที่จำเป็น" }, 400);
        if (values.some((value) => !options.includes(value)))
          return json({ success: false, error: "พบตัวเลือกที่ไม่ถูกต้อง" }, 400);
        normalizedAnswers.push({ question_id: question.id, answer_number: null, answer_text: null, answer_options: values });
      } else if (type === "text") {
        const value = String(answer.text ?? "");
        if (question.required === true && !value.trim())
          return json({ success: false, error: "กรุณากรอกคำตอบในคำถามที่จำเป็น" }, 400);
        if (value.length > 5000)
          return json({ success: false, error: "คำตอบข้อความยาวเกิน 5,000 ตัวอักษร" }, 400);
        normalizedAnswers.push({ question_id: question.id, answer_number: null, answer_text: value, answer_options: [] });
      } else {
        return json({ success: false, error: "พบประเภทคำถามที่ระบบไม่รองรับ" }, 400);
      }
    }
    const missingRequired = questions.some(
      (question) => question.required === true && !seen.has(String(question.id)),
    );
    if (missingRequired)
      return json({ success: false, error: "กรุณาตอบคำถามที่จำเป็นให้ครบ" }, 400);

    const occurrenceId = String(survey.occurrence_id);
    const occurrences = await sb<Row[]>(
      env,
      `activity_occurrences?id=eq.${encodeURIComponent(occurrenceId)}&status=neq.cancelled&status=neq.archived&select=id,activity_id`,
    );
    if (!occurrences[0]) return json({ success: false, error: "รอบกิจกรรมไม่พร้อมรับคำตอบ" }, 409);
    const activityId = String(occurrences[0].activity_id);
    const responseRows = await sb<Row[]>(env, "survey_responses", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        activity_id: activityId,
        occurrence_id: occurrenceId,
        survey_id: body.surveyId,
        age_group: body.ageGroup ?? "",
        affiliation: body.affiliation ?? "",
        ever_joined: body.everJoined ?? "",
        channels: body.channels ?? "",
        feedback: body.feedback ?? "",
        pdpa_consent: true,
      }),
    });
    const responseId = responseRows[0]?.id;
    if (!responseId) throw new Error("ไม่สามารถสร้าง response ได้");
    if (normalizedAnswers.length)
      await sb<Row[]>(env, "survey_answers", {
        method: "POST",
        body: JSON.stringify(normalizedAnswers.map((answer) => ({
          ...answer,
          response_id: responseId,
        }))),
      });
    return json({ success: true, data: { responseId } }, 201);
  } catch (error) {
    console.error("/api/survey", error);
    return json(
      {
        success: false,
        error: error instanceof Error ? error.message : "ไม่สามารถส่งแบบสอบถามได้",
      },
      500,
    );
  }
}
