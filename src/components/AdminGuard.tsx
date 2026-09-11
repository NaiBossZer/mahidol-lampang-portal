import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

export function AdminGuard({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [state, setState] = useState<"loading" | "ok" | "denied">("loading");

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me", { credentials: "include" })
      .then(async (response) => ({ response, body: await response.json() as { data?: { authorized?: boolean } } }))
      .then(({ response, body }) => {
        if (active) setState(response.ok && body.data?.authorized ? "ok" : "denied");
      })
      .catch(() => { if (active) setState("denied"); });
    return () => { active = false; };
  }, []);

  if (state === "loading") return <div className="min-h-screen grid place-items-center text-slate-500">กำลังตรวจสอบสิทธิ์...</div>;
  if (state === "denied") return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  return <>{children}</>;
}
