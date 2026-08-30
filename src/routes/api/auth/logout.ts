import { createFileRoute } from "@tanstack/react-router";
import { clearAdminCookie } from "../../../server/admin-auth";

export const Route = createFileRoute("/api/auth/logout")({
  server: {
    handlers: {
      POST: async ({ request }) =>
        Response.json({ success: true }, { headers: { "Set-Cookie": clearAdminCookie(request) } }),
    },
  },
});
