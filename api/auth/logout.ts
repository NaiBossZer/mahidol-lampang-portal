import { clearAdminSession } from "../_auth";
import { json, methodNotAllowed, type ApiRequest, type ApiResponse } from "../_http";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  clearAdminSession(res);
  return json(res, 200, { success: true, data: { authenticated: false } });
}
