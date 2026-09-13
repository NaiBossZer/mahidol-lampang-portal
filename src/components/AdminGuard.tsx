import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { AdminPermission, AdminRole } from "@/auth/permissions";

type AdminAuth = { role: AdminRole; email: string | null; permissions: AdminPermission[] };
const AdminAuthContext = createContext<AdminAuth | null>(null);

export function useAdminAuth(): AdminAuth {
  const value = useContext(AdminAuthContext);
  if (!value) throw new Error("useAdminAuth must be used inside AdminGuard");
  return value;
}

export function AdminGuard({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [auth, setAuth] = useState<AdminAuth | null>(null);
  const [state, setState] = useState<"loading" | "denied">("loading");

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me", { credentials: "include" })
      .then(async (response) => ({
        response,
        body: (await response.json()) as {
          data?: {
            authorized?: boolean;
            role?: AdminRole;
            permissions?: AdminPermission[];
            user?: { email?: string | null };
          };
        },
      }))
      .then(({ response, body }) => {
        if (!active) return;
        if (response.ok && body.data?.authorized && body.data.role) {
          setAuth({
            role: body.data.role,
            email: body.data.user?.email ?? null,
            permissions: body.data.permissions ?? [],
          });
        } else setState("denied");
      })
      .catch(() => {
        if (active) setState("denied");
      });
    return () => {
      active = false;
    };
  }, []);

  if (!auth && state === "loading")
    return (
      <div className="min-h-screen grid place-items-center text-slate-500">
        กำลังตรวจสอบสิทธิ์...
      </div>
    );
  if (!auth)
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  return <AdminAuthContext.Provider value={auth}>{children}</AdminAuthContext.Provider>;
}
