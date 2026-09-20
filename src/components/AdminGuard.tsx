import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { AdminPermission, AdminRole } from "@/auth/permissions";

type AdminAuth = {
  userId: string;
  role: AdminRole;
  email: string | null;
  permissions: AdminPermission[];
};
const AdminAuthContext = createContext<AdminAuth | null>(null);

async function fetchSession() {
  let response = await fetch("/api/auth/me", { credentials: "include", cache: "no-store" });

  if (response.status === 401) {
    const refresh = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
      cache: "no-store",
    });
    if (refresh.ok)
      response = await fetch("/api/auth/me", { credentials: "include", cache: "no-store" });
  }

  const body = (await response.json().catch(() => ({}))) as {
    data?: {
      authorized?: boolean;
      role?: AdminRole;
      permissions?: AdminPermission[];
      user?: { id?: string; email?: string | null };
    };
  };
  return { response, body };
}

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
    fetchSession()
      .then(({ response, body }) => {
        if (!active) return;
        const user = body.data?.user;
        if (response.ok && body.data?.authorized && body.data.role && user?.id) {
          setAuth({
            userId: user.id,
            role: body.data.role,
            email: user.email ?? null,
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
