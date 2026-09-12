import { apiRequest, invalidateApiCache } from "./api";

export type ActivityOccurrence = {
  id: string;
  activity_id: string;
  occurrence_no: number;
  start_at: string;
  end_at?: string | null;
  status: "draft" | "scheduled" | "ongoing" | "completed" | "cancelled" | "archived";
  cancellation_reason?: string | null;
  participant_count: number;
  location_type?: "center" | "learning_center" | "external" | "online" | "hybrid" | null;
  location_detail?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type ActivityOccurrenceInput = {
  activityId: string;
  occurrenceNo: number;
  startAt: string;
  endAt?: string | null;
  status: ActivityOccurrence["status"];
  participant_count: number;
  location_type?: ActivityOccurrence["location_type"];
  location_detail?: string | null;
};

export async function getAdminOccurrences(activityId?: string) {
  const query = activityId ? `?activityId=${encodeURIComponent(activityId)}` : "";
  const data = await apiRequest<ActivityOccurrence[]>(`/api/admin/occurrences${query}`);
  return Array.isArray(data) ? data : [];
}

export async function createAdminOccurrence(input: ActivityOccurrenceInput) {
  const result = await apiRequest(`/api/admin/occurrences`, { method: "POST", body: JSON.stringify(input) });
  invalidateApiCache("/api/admin/occurrences");
  invalidateApiCache("/api/admin/dashboard");
  return result;
}

export async function updateAdminOccurrence(id: string, input: Partial<ActivityOccurrenceInput>) {
  const result = await apiRequest(`/api/admin/occurrences?id=${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(input) });
  invalidateApiCache("/api/admin/occurrences");
  invalidateApiCache("/api/admin/dashboard");
  return result;
}

export async function archiveAdminOccurrence(id: string) {
  const result = await apiRequest(`/api/admin/occurrences?id=${encodeURIComponent(id)}`, { method: "DELETE" });
  invalidateApiCache("/api/admin/occurrences");
  invalidateApiCache("/api/admin/dashboard");
  return result;
}
