import { getCookie, getSupabaseUser, hasAdminPermission, isAdminRole, json, supabaseConfig } from "./auth/_shared";

type Env = Record<string, unknown>;
type Row = Record<string, unknown>;
type Answer = { questionId: string; number?: number; text?: string; options?: string[] };

async function authorizeTest(request: Request, env: Env) {
  const user = await getSupabaseUser(request, env);
  const role = user?.app_metadata?.role;
  const token = getCookie(request, "sb_access_token");
  if (!user || !isAdminRole(role) || !hasAdminPermission(role, "survey.read") || !token) return null;
  return { user, role, token };
}

async function sbAsUser<T>(env: Env, token: string, path: string, init: RequestInit = {}) {
  const { url, key, configured } = supabaseConfig(env);
  if (!configured) throw new Error("Supabase is not configured");
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: key, Authorization: `Bearer ${token}`, Accept: "application/json", "Content-Type": "application/json", ...(init.headers ?? {}) },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = typeof body === "object" && body !== null ? String((body as Record<string, unknown>).message ?? (body as Record<string, unknown>).hint ?? "") : "";
    throw new Error(`Supabase REST ${response.status}${detail ? `: ${detail.slice(0, 220)}` : ""}`);
  }
  return body as T;
}

async function loadTestSurvey(request: Request, env: Env, surveyId: string) {
  const auth = await authorizeTest(request, env);
  if (!auth) return { response: json({ success: false, error: "กรุณาเข้าสู่ระบบผู้ดูแลที่มีสิทธิ์ดูแบบประเมิน" }, 401) };
  const surveys = await sbAsUser<Row[]>(env, auth.token, `occurrence_surveys?id=eq.${encodeURIComponent(surveyId)}&select=id,occurrence_id,title,anonymous,welcome_text,enabled`);
  const survey = surveys[0];
  if (!survey) return { response: json({ success: false, error: "ไม่พบแบบประเมิน" }, 404) };
  const occurrences = await sbAsUser<Row[]>(env, auth.token, `activity_occurrences?id=eq.${encodeURIComponent(String(survey.occurrence_id))}&select=id,activity_id,status`);
  const occurrence = occurrences[0];
  if (!occurrence || ["cancelled", "archived"].includes(String(occurrence.status)))
    return { response: json({ success: false, error: "รอบกิจกรรมถูกยกเลิกหรือเก็บถาวรแล้ว" }, 409) };
  const questions = await sbAsUser<Row[]>(env, auth.token, `survey_questions?survey_id=eq.${encodeURIComponent(surveyId)}&active=eq.true&select=id,section_key,question_text,question_type,required,order_index,options,scale_min,scale_max&order=order_index.asc`);
  return { auth, survey, occurrence, questions };
}

async function sb<T>(env: Env, path: string, init: RequestInit = {}) {
  const { url, key, configured } = supabaseConfig(env);
  if (!configured) throw new Error("Supabase is not configured");
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = typeof body === "object" && body !== null
      ? String((body as Record<string, unknown>).message ?? (body as Record<string, unknown>).error_description ?? (body as Record<string, unknown>).hint ?? "")
      : "";
    throw new Error(`Supabase REST ${response.status}${detail ? `: ${detail.slice(0, 240)}` : ""}`);
  }
  return body as T;
}

async function getPublicSurveyOccurrence(env: Env, surveyId: string): Promise<Row | null> {
  const occurrences = await sb<Row[]>(env, "rpc/get_public_survey_occurrence", {
    method: "POST",
    body: JSON.stringify({ p_survey_id: surveyId }),
  });
  const occurrence = occurrences[0];
  return occurrence && !["cancelled", "archived"].includes(String(occurrence.occurrence_status))
    ? occurrence
    : null;
}

async function isSurveyPubliclyAvailable(env: Env, survey: Row): Promise<boolean> {
  if (survey.enabled !== true) return false;
  return Boolean(await getPublicSurveyOccurrence(env, String(survey.id ?? "")));
}

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  try {
    const url = new URL(request.url);
    if (request.method === "GET") {
      const surveyId = url.searchParams.get("surveyId");
      if (url.searchParams.get("mode") === "test") {
        if (!surveyId) return json({ success: false, error: "ต้องระบุ surveyId" }, 400);
        const loaded = await loadTestSurvey(request, env, surveyId);
        if ("response" in loaded) return loaded.response;
        return json({ success: true, data: { ...loaded.survey, occurrence_id: loaded.occurrence.id, questions: loaded.questions }, mode: "test" });
      }
      if (!surveyId) {
        const surveys = await sb<Row[]>(
          env,
          "occurrence_surveys?enabled=eq.true&select=id,occurrence_id,title,anonymous,welcome_text,open_at,close_at,enabled&order=created_at.desc",
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
        `occurrence_surveys?id=eq.${encodeURIComponent(surveyId)}&enabled=eq.true&select=id,occurrence_id,title,anonymous,open_at,close_at,welcome_text,enabled`,
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
      mode?: string;
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
    if (body.mode === "test") {
      const loaded = await loadTestSurvey(request, env, body.surveyId);
      if ("response" in loaded) return loaded.response;
      const allowedIds = new Set(loaded.questions.map((q) => String(q.id)));
      const answers = Array.isArray(body.answers)
        ? body.answers.filter((answer) => allowedIds.has(String(answer.questionId)))
        : [];
      const requiredIds = loaded.questions.filter((q) => q.required === true).map((q) => String(q.id));
      const answeredIds = new Set(
        answers
          .filter((answer) =>
            (typeof answer.text === "string" && answer.text.trim().length > 0) ||
            typeof answer.number === "number" ||
            (Array.isArray(answer.options) && answer.options.length > 0),
          )
          .map((answer) => String(answer.questionId)),
      );
      if (requiredIds.some((id) => !answeredIds.has(id)))
        return json({ success: false, error: "กรุณาตอบคำถามที่จำเป็นให้ครบ" }, 400);
      const rows = await sbAsUser<Row[]>(env, loaded.auth.token, "survey_test_responses", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({
          survey_id: body.surveyId,
          occurrence_id: loaded.occurrence.id,
          activity_id: loaded.occurrence.activity_id,
          submitted_by: loaded.auth.user.id,
          answers,
        }),
      });
      if (!rows[0]?.id) throw new Error("ไม่สามารถบันทึกคำตอบทดสอบได้");
      return json({ success: true, data: { responseId: rows[0].id, test: true } }, 201);
    }
    const surveys = await sb<Row[]>(
      env,
      `occurrence_surveys?id=eq.${encodeURIComponent(body.surveyId)}&enabled=eq.true&select=id,occurrence_id,open_at,close_at`,
    );
    const survey = surveys[0];
    const occurrence = survey
      ? await getPublicSurveyOccurrence(env, String(survey.id))
      : null;
    if (!survey || !occurrence)
      return json({ success: false, error: "แบบประเมินไม่พร้อมรับคำตอบ หรืออยู่นอกช่วงเวลาเปิดรับ" }, 409);
    const occurrenceId = String(occurrence.occurrence_id);
    const activityId = String(occurrence.activity_id ?? "");
    // The public role may INSERT survey_responses but intentionally cannot SELECT them.
    // PostgREST return=representation adds RETURNING and is therefore rejected by RLS.
    // Generate the UUID here and request a minimal response to keep SELECT private.
    const responseId = crypto.randomUUID();
    await sb<null>(env, "survey_responses", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        id: responseId,
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
