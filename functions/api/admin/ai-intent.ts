/**
 * AI Intent Intake API
 * Single entry point for the AI Workspace command bar.
 * Delegates to the real server-side OpenAI -> governed tool pipeline.
 */

import { getSupabaseUser, isAdminRole, json } from "../auth/_shared";

type Env = Record<string, unknown>;

const cookie = (request: Request): string | null => {
  const cookies = (request.headers.get("Cookie") ?? "").split(";").map((v) => v.trim());
  const found = cookies.find((v) => v.startsWith("sb_access_token="));
  return found ? decodeURIComponent(found.slice(17)) : null;
};

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  if (request.method !== "POST") return json({ success: false, error: "Method Not Allowed" }, 405, { Allow: "POST" });

  const user = await getSupabaseUser(request, env);
  const role = user?.app_metadata?.role;
  const token = cookie(request);
  if (!user || !isAdminRole(role) || !token) return json({ success: false, error: "Unauthorized" }, 401);

  const intentResponse = await fetch(new URL("/api/admin/ai-process", request.url), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Cookie: request.headers.get("Cookie") ?? "",
    },
    body: await request.text(),
  });

  const body = await intentResponse.json().catch(() => ({ success: false, error: "Invalid AI response" }));
  return json(body, intentResponse.status);
}
