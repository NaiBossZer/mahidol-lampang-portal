export type SurveyQuestion = {
  id: string;
  survey_id: string;
  section_key: string;
  question_text: string;
  question_type: "rating" | "text" | "single_choice" | "multi_choice";
  required: boolean;
  order_index: number;
  options: unknown[];
  scale_min: number;
  scale_max: number;
  active: boolean;
};
export type AdminSurvey = {
  id: string;
  occurrence_id: string;
  enabled: boolean;
  anonymous: boolean;
  open_at: string | null;
  close_at: string | null;
  welcome_text: string | null;
  questions: SurveyQuestion[];
};

let refreshPromise: Promise<boolean> | null = null;

async function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
      cache: "no-store",
    })
      .then((response) => response.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

async function request<T>(input: RequestInfo, init?: RequestInit, retried = false): Promise<T> {
  const r = await fetch(input, {
    ...init,
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const b = await r.json().catch(() => null);

  if (r.status === 401 && !retried && (await refreshSession()))
    return request<T>(input, init, true);

  if (!r.ok) throw new Error(b?.error || "ไม่สามารถเชื่อมต่อระบบแบบสอบถามได้");
  return b?.data as T;
}

export const getAdminSurveys = (occurrenceId?: string) =>
  request<AdminSurvey[]>(
    occurrenceId
      ? `/api/admin/surveys?occurrenceId=${encodeURIComponent(occurrenceId)}`
      : "/api/admin/surveys",
  );
export const createAdminSurvey = (input: {
  occurrenceId: string;
  enabled: boolean;
  anonymous: boolean;
  openAt: string | null;
  closeAt: string | null;
  welcomeText: string | null;
}) => request<AdminSurvey>("/api/admin/surveys", { method: "POST", body: JSON.stringify(input) });
export const updateAdminSurvey = (
  id: string,
  input: Partial<Omit<AdminSurvey, "id" | "occurrence_id" | "questions">>,
) =>
  request<AdminSurvey>(`/api/admin/surveys?id=${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });

export const createAdminQuestion = (
  input: Omit<SurveyQuestion, "id" | "active"> & { active?: boolean },
) =>
  request<SurveyQuestion>("/api/admin/surveys", {
    method: "POST",
    body: JSON.stringify({
      question: {
        surveyId: input.survey_id,
        sectionKey: input.section_key,
        questionText: input.question_text,
        questionType: input.question_type,
        required: input.required,
        orderIndex: input.order_index,
        options: input.options,
        scaleMin: input.scale_min,
        scaleMax: input.scale_max,
        active: input.active,
      },
    }),
  });

export const updateAdminQuestion = (input: SurveyQuestion) =>
  request<SurveyQuestion>("/api/admin/surveys", {
    method: "PUT",
    body: JSON.stringify({
      question: {
        id: input.id,
        surveyId: input.survey_id,
        sectionKey: input.section_key,
        questionText: input.question_text,
        questionType: input.question_type,
        required: input.required,
        orderIndex: input.order_index,
        options: input.options,
        scaleMin: input.scale_min,
        scaleMax: input.scale_max,
        active: input.active,
      },
    }),
  });
