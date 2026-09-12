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

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, { ...init, credentials: "include", headers: { Accept: "application/json", "Content-Type": "application/json", ...(init?.headers ?? {}) } });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error || "ไม่สามารถเชื่อมต่อระบบแบบสอบถามได้");
  return body?.data as T;
}

export const getAdminSurveys = (occurrenceId?: string) => request<AdminSurvey[]>(occurrenceId ? `/api/admin/surveys?occurrenceId=${encodeURIComponent(occurrenceId)}` : "/api/admin/surveys");
export const createAdminSurvey = (input: { occurrenceId: string; enabled: boolean; anonymous: boolean; openAt: string | null; closeAt: string | null; welcomeText: string | null }) => request<AdminSurvey>("/api/admin/surveys", { method: "POST", body: JSON.stringify(input) });
export const updateAdminSurvey = (id: string, input: Partial<Omit<AdminSurvey, "id" | "occurrence_id" | "questions">>) => request<AdminSurvey>(`/api/admin/surveys?id=${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(input) });
export const createAdminQuestion = (input: Omit<SurveyQuestion, "id" | "survey_id" | "active"> & { surveyId: string; active?: boolean }) => request<SurveyQuestion>("/api/admin/surveys", { method: "POST", body: JSON.stringify({ question: input }) });
export const updateAdminQuestion = (input: SurveyQuestion) => request<SurveyQuestion>(`/api/admin/surveys`, { method: "PUT", body: JSON.stringify({ question: { ...input, surveyId: input.survey_id } }) });
