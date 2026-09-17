import { apiRequest } from "@/services/api";

export type ActivityOutcomeMetric = {
  id: string;
  activity_id: string;
  metric_name: string;
  metric_value: string | null;
  unit: string | null;
  description: string | null;
  created_at: string;
};

export type ActivityOutcomeInput = {
  activityId: string;
  metricName: string;
  value: string;
  unit?: string;
  description?: string;
};

export async function getAdminActivityOutcomes(activityId: string): Promise<ActivityOutcomeMetric[]> {
  const data = await apiRequest<ActivityOutcomeMetric[]>(
    `/api/admin/activity-outcomes?activityId=${encodeURIComponent(activityId)}`,
  );
  return Array.isArray(data) ? data : [];
}

export async function createActivityOutcome(input: ActivityOutcomeInput) {
  return apiRequest<ActivityOutcomeMetric>("/api/admin/activity-outcomes", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateActivityOutcome(
  id: string,
  input: Omit<ActivityOutcomeInput, "activityId">,
) {
  return apiRequest<ActivityOutcomeMetric>(`/api/admin/activity-outcomes?id=${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteActivityOutcome(id: string) {
  return apiRequest<{ id: string }>(`/api/admin/activity-outcomes?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
