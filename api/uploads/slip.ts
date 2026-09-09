import { randomUUID } from "node:crypto";
import { json, methodNotAllowed, readJson, type ApiRequest, type ApiResponse } from "../_http";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 2_000_000;

function config() {
  const url = process.env["SUPABASE_URL"]?.replace(/\/$/, "");
  const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  const bucket = process.env["SUPABASE_STORAGE_BUCKET"] || "order-slips";
  if (!url || !key) throw new Error("SUPABASE_STORAGE_CONFIG_MISSING");
  return { url, key, bucket };
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  try {
    const body = (await readJson(req)) as Record<string, unknown>;
    const contentType = String(body["contentType"] ?? "");
    const dataUrl = String(body["dataUrl"] ?? "");
    if (!ALLOWED.has(contentType) || !dataUrl.startsWith(`data:${contentType};base64,`)) {
      return json(res, 400, { error: "ชนิดไฟล์สลิปไม่ถูกต้อง" });
    }
    const base64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
    const buffer = Buffer.from(base64, "base64");
    if (!buffer.length || buffer.length > MAX_BYTES) return json(res, 400, { error: "ไฟล์สลิปต้องมีขนาดไม่เกิน 2 MB" });

    const { url, key, bucket } = config();
    const ext = contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : "jpg";
    const path = `orders/${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${ext}`;
    const upload = await fetch(`${url}/storage/v1/object/${encodeURIComponent(bucket)}/${path}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, apikey: key, "Content-Type": contentType, "x-upsert": "false" },
      body: buffer,
    });
    if (!upload.ok) {
      console.error("Supabase slip upload failed", await upload.text());
      return json(res, 502, { error: "ไม่สามารถจัดเก็บสลิปได้" });
    }
    return json(res, 201, { success: true, data: { path } });
  } catch (error) {
    console.error("/api/uploads/slip", error);
    return json(res, 500, { error: error instanceof Error && error.message === "SUPABASE_STORAGE_CONFIG_MISSING" ? "ระบบยังไม่ได้ตั้งค่า Storage" : "ไม่สามารถอัปโหลดสลิปได้" });
  }
}
