import { FALLBACK_ACTIVITIES, type SocialActivity } from "@/data/socialEngagement";
import { apiRequest } from "@/services/api";

function normalizeActivity(value: unknown): SocialActivity | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  if (typeof item["title"] !== "string" || typeof item["slug"] !== "string") return null;

  const result: SocialActivity = {
    id: String(item["id"] ?? item["slug"]),
    slug: item["slug"],
    title: item["title"],
    summary: typeof item["summary"] === "string" ? item["summary"] : "กิจกรรมพันธกิจเพื่อสังคม",
    activityDate: String(item["activityDate"] ?? ""),
    location: String(item["location"] ?? "พื้นที่ปฏิบัติการลำปาง"),
    featuredImage:
      typeof item["featuredImage"] === "string" ? item["featuredImage"] : "/main banner.jpg",
    system: "social",
  };

  const optionalFields = [
    "participantCount",
    "centerName",
    "projectTitle",
    "objective",
    "process",
    "outcome",
    "impact",
  ] as const;

  for (const key of optionalFields) {
    const value = item[key];
    if (key === "participantCount" && typeof value === "number") result.participantCount = value;
    if (key !== "participantCount" && typeof value === "string") result[key] = value;
  }

  return result;
}

export async function getActivities(): Promise<SocialActivity[]> {
  try {
    const data = await apiRequest<unknown[]>("/api/activities");
    const activities = Array.isArray(data)
      ? (data.map(normalizeActivity).filter(Boolean) as SocialActivity[])
      : [];
    return activities.length ? activities : FALLBACK_ACTIVITIES;
  } catch {
    return FALLBACK_ACTIVITIES;
  }
}

export async function getActivity(slug: string): Promise<SocialActivity | null> {
  try {
    const data = await apiRequest<unknown>(`/api/activity?slug=${encodeURIComponent(slug)}`);
    return (
      normalizeActivity(data) ?? FALLBACK_ACTIVITIES.find((item) => item.slug === slug) ?? null
    );
  } catch {
    return FALLBACK_ACTIVITIES.find((item) => item.slug === slug) ?? null;
  }
}
