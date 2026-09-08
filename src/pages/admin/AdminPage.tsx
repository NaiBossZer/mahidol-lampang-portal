import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminDashboard } from "@/components/storefront/AdminDashboard";

export function AdminPage() {
  const navigate = useNavigate();
  useEffect(() => {
    if (sessionStorage.getItem("dashboard_auth") !== "true")
      navigate("/login?redirect=%2Fadmin", { replace: true });
  }, [navigate]);
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Prompt']">
      <AdminDashboard />
    </div>
  );
}
