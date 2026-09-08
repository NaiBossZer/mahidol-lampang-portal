import crypto from "node:crypto";
import { readJson, json, methodNotAllowed, type ApiRequest, type ApiResponse } from "../_http";
import { setAdminSession } from "../_auth";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  try {
    const body = await readJson(req);
    const password =
      typeof body === "object" && body !== null && "password" in body
        ? String((body as { password?: unknown }).password ?? "")
        : "";
    const expected = process.env["ADMIN_PASSWORD"] ?? "";
    if (
      !expected ||
      password.length !== expected.length ||
      !crypto.timingSafeEqual(Buffer.from(password), Buffer.from(expected))
    ) {
      return json(res, 401, { error: "รหัสผ่านไม่ถูกต้อง" });
    }
    setAdminSession(res);
    return json(res, 200, { success: true, data: { authenticated: true } });
  } catch {
    return json(res, 400, { error: "ข้อมูลคำขอไม่ถูกต้อง" });
  }
}
