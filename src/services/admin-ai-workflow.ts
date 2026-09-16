export type ExtractedEntity = {
  id: string;
  category: "objective" | "target_group" | "location" | "kpi" | "schedule";
  categoryLabel: string;
  title: string;
  text: string;
  sourceDoc: string;
  page: string;
  confidence: number;
};

export type GeneratedQuestion = {
  id: string;
  aspectIndex: number;
  title: string;
  questionType: "single_choice" | "likert5" | "text";
  scaleLabel?: string;
  sourceCiting: string;
  sourceDocName: string;
  required?: boolean;
};

export type GeneratedSurveySection = {
  id: string;
  title: string;
  description: string;
  questions: GeneratedQuestion[];
};

export type GeneratedSurvey = {
  id: string;
  activityId: string;
  surveyTitle: string;
  generatedDate: string;
  scaleType: string;
  aiConfidenceScore: number;
  status: "ready_for_review";
  sections: GeneratedSurveySection[];
};

export type ActivityDocument = {
  id: string;
  original_name: string;
  public_url: string;
  size_bytes: number;
  caption?: string | null;
  created_at?: string;
};

export type PostProjectReport = {
  title: string;
  summary: string;
  content: string;
  performanceResults: string;
  outcomesAndImpact: string;
  averageScore?: number | null;
  satisfactionPercent?: number | null;
  responseCount?: number;
  author?: string;
};

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || `HTTP ${res.status}`);
  }
  return data?.data as T;
}

export async function uploadActivityDocument(activityId: string, file: File): Promise<ActivityDocument> {
  const form = new FormData();
  form.set("entityType", "activities");
  form.set("entityId", activityId);
  form.set("fieldKey", "documents");
  form.set("file", file);

  const res = await fetch("/api/admin/media", {
    method: "POST",
    credentials: "include",
    body: form,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || "อัปโหลดเอกสารไม่สำเร็จ");
  return data.data as ActivityDocument;
}

export async function getActivityDocuments(activityId: string): Promise<ActivityDocument[]> {
  const url = `/api/admin/media?entityType=activities&entityId=${encodeURIComponent(activityId)}&fieldKey=documents`;
  try {
    const list = await fetchJson<ActivityDocument[]>(url);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export async function deleteActivityDocument(id: string): Promise<void> {
  const res = await fetch(`/api/admin/media?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    credentials: "include",
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || "ลบเอกสารไม่สำเร็จ");
}

export async function analyzeActivityDocument(activityId: string, documentId?: string): Promise<{
  executionId: string;
  summary: string;
  extractedEntities: ExtractedEntity[];
  primaryDoc: string;
  documentCount: number;
}> {
  return fetchJson("/api/admin/ai-document-analysis", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ activityId, documentId }),
  });
}

export async function getPreviousAnalysis(activityId: string): Promise<{
  id: string;
  status: string;
  output?: {
    summary?: string;
    extractedEntities?: ExtractedEntity[];
    primaryDoc?: string;
  };
} | null> {
  return fetchJson(`/api/admin/ai-document-analysis?activityId=${encodeURIComponent(activityId)}`);
}

export async function generateAiSurvey(activityId: string, entities?: ExtractedEntity[]): Promise<{
  executionId: string;
  survey: GeneratedSurvey;
}> {
  return fetchJson("/api/admin/ai-survey-generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ activityId, entities }),
  });
}

export async function getPreviousGeneratedSurvey(activityId: string): Promise<{
  id: string;
  status: string;
  survey?: GeneratedSurvey | null;
} | null> {
  return fetchJson(`/api/admin/ai-survey-generate?activityId=${encodeURIComponent(activityId)}`);
}

export async function confirmAiSurvey(
  executionId: string,
  decision: "approved" | "rejected",
  reason?: string,
): Promise<{
  surveyId?: string;
  occurrenceId?: string;
  activityId?: string;
}> {
  const res = await fetch("/api/admin/ai-approval", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ executionId, decision, reason }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || "ยืนยันผลไม่สำเร็จ");
  return data?.data ?? {};
}

export async function generateAiPostProjectReport(activityId: string): Promise<{
  report: PostProjectReport;
}> {
  return fetchJson("/api/admin/ai-post-project", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ activityId }),
  });
}
