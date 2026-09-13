import { getSupabaseUser, isAdminRole, json, supabaseConfig } from "../auth/_shared";

type Env = Record<string, unknown>;
type Row = Record<string, unknown>;
type SurveyInput = {
  occurrenceId?: string;
  enabled?: boolean;
  anonymous?: boolean;
  openAt?: string | null;
  closeAt?: string | null;
  welcomeText?: string | null;
};
type QuestionInput = {
  id?: string;
  surveyId: string;
  sectionKey?: string;
  questionText: string;
  questionType?: "rating" | "text" | "single_choice" | "multi_choice";
  required?: boolean;
  orderIndex?: number;
  options?: unknown[];
  scaleMin?: number;
  scaleMax?: number;
  active?: boolean;
};

function cookieValue(request: Request, name: string) {
  const header = request.headers.get("Cookie") ?? "";
  const part = header
    .split(";")
    .map((x) => x.trim())
    .find((x) => x.startsWith(`${name}=`));
  return part ? decodeURIComponent(part.slice(name.length + 1)) : null;
}

async function sb<T>(env: Env, token: string, path: string, init: RequestInit = {}) {
  const { url, key, configured } = supabaseConfig(env);
  if (!configured) throw new Error("Supabase is not configured");
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok)
    throw new Error(`Supabase REST ${response.status}: ${JSON.stringify(body).slice(0, 300)}`);
  return body as T;
}

async function authorize(request: Request, env: Env) {
  const user = await getSupabaseUser(request, env);
  const role = user?.app_metadata?.role;
  const token = cookieValue(request, "sb_access_token");
  if (!user || !isAdminRole(role) || !token)
    return { error: json({ success: false, error: "Unauthorized" }, 401) } as const;
  if (role !== "SUPER_ADMIN" && role !== "OPERATIONS_ADMIN" && role !== "CONTENT_ADMIN")
    return { error: json({ success: false, error: "Forbidden" }, 403) } as const;
  return { token } as const;
}

const surveySelect =
  "id,occurrence_id,enabled,anonymous,open_at,close_at,welcome_text,created_at,updated_at";
const questionSelect =
  "id,survey_id,section_key,question_text,question_type,required,order_index,options,scale_min,scale_max,active,created_at,updated_at";

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  const method = request.method.toUpperCase();
  if (!["GET", "POST", "PUT"].includes(method))
    return json({ success: false, error: "Method Not Allowed" }, 405, { Allow: "GET, POST, PUT" });
  const auth = await authorize(request, env);
  if ("error" in auth) return auth.error;
  try {
    const url = new URL(request.url);
    const surveyId = url.searchParams.get("id");
    const occurrenceId = url.searchParams.get("occurrenceId");

    if (method === "GET") {
      const surveys = await sb<Row[]>(
        env,
        auth.token,
        `occurrence_surveys?select=${surveySelect}&order=created_at.desc`,
      );
      const filtered = occurrenceId
        ? surveys.filter((x) => String(x.occurrence_id) === occurrenceId)
        : surveys;
      const questions = await sb<Row[]>(
        env,
        auth.token,
        `survey_questions?select=${questionSelect}&active=eq.true&order=order_index.asc`,
      );
      return json({
        success: true,
        data: filtered.map((survey) => ({
          ...survey,
          questions: questions.filter((q) => String(q.survey_id) === String(survey.id)),
        })),
      });
    }

    const body = (await request.json()) as SurveyInput & { question?: QuestionInput };
    if (body.question) {
      const q = body.question;
      if (!q.surveyId || !q.questionText?.trim())
        return json({ success: false, error: "กรุณาระบุแบบสอบถามและคำถาม" }, 400);
      const row = {
        survey_id: q.surveyId,
        section_key: String(q.sectionKey ?? "general").trim() || "general",
        question_text: q.questionText.trim(),
        question_type: q.questionType ?? "rating",
        required: q.required !== false,
        order_index: Math.max(0, Number(q.orderIndex ?? 0)),
        options: Array.isArray(q.options) ? q.options : [],
        scale_min: Math.max(1, Number(q.scaleMin ?? 1)),
        scale_max: Math.max(2, Number(q.scaleMax ?? 5)),
        active: q.active !== false,
      };
      if (method === "POST") {
        const rows = await sb<Row[]>(env, auth.token, "survey_questions", {
          method: "POST",
          headers: { Prefer: "return=representation" },
          body: JSON.stringify(row),
        });
        return json({ success: true, data: rows[0] ?? null }, 201);
      }
      if (!q.id) return json({ success: false, error: "ต้องระบุ id ของคำถาม" }, 400);
      const rows = await sb<Row[]>(
        env,
        auth.token,
        `survey_questions?id=eq.${encodeURIComponent(q.id)}`,
        {
          method: "PATCH",
          headers: { Prefer: "return=representation" },
          body: JSON.stringify(row),
        },
      );
      return json({ success: true, data: rows[0] ?? null });
    }

    if (method === "POST") {
      if (!body.occurrenceId) return json({ success: false, error: "ต้องระบุ occurrenceId" }, 400);
      const existing = await sb<Row[]>(
        env,
        auth.token,
        `occurrence_surveys?occurrence_id=eq.${encodeURIComponent(body.occurrenceId)}&select=${surveySelect}`,
      );
      if (existing[0])
        return json(
          { success: false, error: "รอบกิจกรรมนี้มีแบบสอบถามอยู่แล้ว", data: existing[0] },
          409,
        );
      const row = {
        occurrence_id: body.occurrenceId,
        enabled: body.enabled !== false,
        anonymous: body.anonymous === true,
        open_at: body.openAt ?? null,
        close_at: body.closeAt ?? null,
        welcome_text: body.welcomeText ?? null,
      };
      const rows = await sb<Row[]>(env, auth.token, "occurrence_surveys", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify(row),
      });
      return json({ success: true, data: rows[0] ?? null }, 201);
    }

    if (!surveyId) return json({ success: false, error: "ต้องระบุ survey id" }, 400);
    const row = {
      enabled: body.enabled,
      anonymous: body.anonymous,
      open_at: body.openAt ?? null,
      close_at: body.closeAt ?? null,
      welcome_text: body.welcomeText ?? null,
    };
    const rows = await sb<Row[]>(
      env,
      auth.token,
      `occurrence_surveys?id=eq.${encodeURIComponent(surveyId)}`,
      { method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify(row) },
    );
    return json({ success: true, data: rows[0] ?? null });
  } catch (error) {
    console.error("/api/admin/surveys", error);
    return json(
      {
        success: false,
        error: error instanceof Error ? error.message : "ไม่สามารถจัดการแบบสอบถามได้",
      },
      500,
    );
  }
}
