import { createFileRoute } from "@tanstack/react-router";
import { createAdminCookie } from "../../../server/admin-auth";

export const Route = createFileRoute("/api/auth/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body: unknown = await request.json();
          const password =
            isRecord(body) && typeof body["password"] === "string" ? body["password"] : "";
          const configured = process.env["ADMIN_PASSWORD"];
          if (!configured || configured.length < 12)
            return Response.json(
              { success: false, error: "ระบบยังไม่ได้ตั้งค่าความปลอดภัย" },
              { status: 503 },
            );
          if (password.length > 128 || password !== configured)
            return Response.json({ success: false, error: "รหัสผ่านไม่ถูกต้อง" }, { status: 401 });
          return Response.json(
            { success: true },
            { headers: { "Set-Cookie": await createAdminCookie(request) } },
          );
        } catch {
          return Response.json({ success: false, error: "คำขอไม่ถูกต้อง" }, { status: 400 });
        }
      },
    },
  },
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
