import { isAdmin } from "../_auth";
import { json, methodNotAllowed, type ApiRequest, type ApiResponse } from "../_http";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  return json(res, 200, { success: true, data: { authenticated: isAdmin(req) } });
}
