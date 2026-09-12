import { apiRequest } from "@/services/api";

export type AdminOrganization = {
  id: string;
  name: string;
  organization_type: "internal" | "external";
  parent_organization_id?: string | null;
  status: "active" | "inactive";
  display_order: number;
};

export type AdminOrganizationInput = Omit<AdminOrganization, "id">;

export async function getAdminOrganizations(): Promise<AdminOrganization[]> {
  const data = await apiRequest<AdminOrganization[]>("/api/admin/organizations");
  return Array.isArray(data) ? data : [];
}

export async function createAdminOrganization(input: AdminOrganizationInput) {
  return apiRequest<AdminOrganization>("/api/admin/organizations", { method: "POST", body: JSON.stringify(input) });
}

export async function updateAdminOrganization(input: AdminOrganization) {
  return apiRequest<AdminOrganization>(`/api/admin/organizations?id=${encodeURIComponent(input.id)}`, { method: "PUT", body: JSON.stringify(input) });
}
