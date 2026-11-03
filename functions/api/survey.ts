import { json, supabaseConfig } from "./auth/_shared";

type Env = Record<string, unknown>;
type Row = Record<string, unknown>;
type Answer = { questionId: string; number?: number; text?: string; options?: string[] };

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

async function isSurveyPubliclyAvailable(env: Env, survey: Row): Promise<boolean> {
  if (survey.enabled !== true) return false;
  const now = Date.now();
  if (survey.open_at && now < Date.parse(String(survey.open_at))) return false;
  if (survey.close_at && now > Date.parse(String(survey.close_at))) return false;
  const occurrenceId = String(survey.occurrence_id ?? "");
  if (!occurrenceId) return false;
  const occurrences = await sb<Row[]>(
    env,
    `activity_occurrences?id=eq.${encodeURIComponent(occurrenceId)}&select=id,activity_id,status`,
  );
  const occurrence = occurrences[0];
  // The public SELECT policy on activity_occurrences only exposes rows whose parent
  // activity is published, so no direct public SELECT on activities is required.
  return Boolean(occurrence && !["cancelled", "archived"].includes(String(occurrence.status)));
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
        const available = await Promise.all(
          surveys.map(async (survey) =>
            (await isSurveyPubliclyAvailable(env, survey)) ? survey : null,
          ),
        );
        return json({ success: true, data: available.filter((survey): survey is Row => survey !== null) });
      }
      const surveys = await sb<Row[]>(
        env,
        `occurrence_surveys?id=eq.${encodeURIComponent(surveyId)}&enabled=eq.true&select=id,occurrence_id,title,anonymous,open_at,close_at,welcome_text`,
      );
      if (!surveys[0] || !(await isSurveyPubliclyAvailable(env, surveys[0])))
        return json({ success: false, error: "ไม่พบแบบประเมิน แบบประเมินยังไม่เปิด หรือปิดรับคำตอบแล้ว" }, 404);
      const survey = surveys[0];
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
    if (!survey || !(await isSurveyPubliclyAvailable(env, survey)))
      return json({ success: false, error: "แบบประเมินไม่พร้อมรับคำตอบ หรืออยู่นอกช่วงเวลาเปิดรับ" }, 409);
    const occurrenceId = String(survey.occurrence_id);
    const occurrences = await sb<Row[]>(
      env,
      `activity_occurrences?id=eq.${encodeURIComponent(occurrenceId)}&select=id,activity_id,status`,
    );
    const activityId = String(occurrences[0]?.activity_id ?? "");
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
    const answers = Array.isArray(body.answers) ? body.answers : [];
    if (answers.length)
      await sb<Row[]>(env, "survey_answers", {
        method: "POST",
        body: JSON.stringify(
          answers.map((a) => ({
            response_id: responseId,
            question_id: a.questionId,
            answer_number: a.number ?? null,
            answer_text: a.text ?? null,
            answer_options: Array.isArray(a.options) ? a.options : [],
          })),
        ),
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
