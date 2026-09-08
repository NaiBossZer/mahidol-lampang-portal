import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

export function AdminGuard({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [state, setState] = useState<"loading" | "ok" | "denied">("loading");

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me", { credentials: "include" })
      .then((response) => response.json() as Promise<{ data?: { authenticated?: boolean } }>)
      .then((body) => {
        if (active) setState(body.data?.authenticated ? "ok" : "denied");
      })
      .catch(() => {
        if (active) setState("denied");
      });
    return () => {
      active = false;
    };
  }, []);

  if (state === "loading")
    return (
      <div className="min-h-screen grid place-items-center text-slate-500">
        กำลังตรวจสอบสิทธิ์...
      </div>
    );
  if (state === "denied")
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  return <>{children}</>;
}
