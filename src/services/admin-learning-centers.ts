export type LearningCenter = {
  id: string;
  name: string;
  slug: string;
  type: string;
  description: string | null;
  province: string | null;
  district: string | null;
  subdistrict: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  cover_image: string | null;
  status: string;
};
async function request<T>(path = "/api/admin/learning-centers", init?: RequestInit) {
  const r = await fetch(path, {
    credentials: "include",
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const b = await r.json().catch(() => null);
  if (!r.ok) throw new Error(b?.error || "ไม่สามารถเชื่อมต่อ Learning Center ได้");
  return b.data as T;
}
export const getAdminLearningCenters = () => request<LearningCenter[]>();
export const createAdminLearningCenter = (input: Partial<LearningCenter>) =>
  request<LearningCenter>("/api/admin/learning-centers", {
    method: "POST",
    body: JSON.stringify(input),
  });
export const updateAdminLearningCenter = (id: string, input: Partial<LearningCenter>) =>
  request<LearningCenter>(`/api/admin/learning-centers?id=${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
