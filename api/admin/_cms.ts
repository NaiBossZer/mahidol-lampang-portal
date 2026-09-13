import { requirePermission } from "../_authorization";
import { json, methodNotAllowed, readJson, type ApiRequest, type ApiResponse } from "../_http";
export const CMS_STATUSES = ["draft", "published", "archived"] as const;
export const CMS_LINK_TYPES = ["INTERNAL", "EXTERNAL", "CONTACT"] as const;
export const HOME_SECTION_KEYS = [
  "HOME_HERO",
  "FEATURED_ACTIVITIES",
  "LEARNING_CENTERS",
  "SERVICES",
  "COMMUNITY_ACTION",
  "PARTNERS",
] as const;
export type CmsStatus = (typeof CMS_STATUSES)[number];
export type CmsLinkType = (typeof CMS_LINK_TYPES)[number];
export function requireAdmin(req: ApiRequest, res: ApiResponse) {
  return Boolean(requirePermission(req, res, "cms.read"));
}
export function idFromRequest(req: ApiRequest) {
  return new URL(req.url ?? "/", "http://localhost").searchParams.get("id");
}
export async function parseObject(req: ApiRequest) {
  const body = await readJson(req);
  return body && typeof body === "object" ? (body as Record<string, unknown>) : null;
}
export function stringValue(value: unknown, max = 10000) {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text ? text.slice(0, max) : null;
}
export function requiredString(value: unknown, max = 255) {
  return stringValue(value, max) ?? "";
}
export function integerValue(value: unknown, fallback = 0) {
  const number = Number(value ?? fallback);
  return Number.isInteger(number) ? number : null;
}
export function statusValue(value: unknown, fallback: CmsStatus = "draft") {
  const status = String(value ?? fallback);
  return CMS_STATUSES.includes(status as CmsStatus) ? (status as CmsStatus) : null;
}
export function linkTypeValue(value: unknown, fallback: CmsLinkType = "INTERNAL") {
  const type = String(value ?? fallback);
  return CMS_LINK_TYPES.includes(type as CmsLinkType) ? (type as CmsLinkType) : null;
}
export function respondMethodNotAllowed(res: ApiResponse, methods: string[]) {
  return methodNotAllowed(res, methods);
}
