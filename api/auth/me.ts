import { json, methodNotAllowed, type ApiRequest, type ApiResponse } from "../_http";
import { getUser, supabaseConfigured } from "../_supabase-auth";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  if (!supabaseConfigured()) return json(res, 503, { error: "Supabase Auth is not configured" });
  const user = await getUser(req);
  if (!user) return json(res, 401, { success: false, data: { authenticated: false } });
  return json(res, 200, { success: true, data: { authenticated: true, user, role: "ADMIN" } });
}
