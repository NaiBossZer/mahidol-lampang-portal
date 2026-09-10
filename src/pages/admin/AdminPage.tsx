import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdminDashboard } from "@/components/storefront/AdminDashboard";

export function AdminPage() {
  const navigate = useNavigate();
  useEffect(() => {
    if (sessionStorage.getItem("dashboard_auth") !== "true")
      navigate("/login?redirect=%2Fadmin", { replace: true });
  }, [navigate]);
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Prompt']">
      <div className="mx-auto w-full max-w-7xl px-4 pt-4 md:px-8">
        <Link to="/admin/lac-satisfaction" className="inline-flex items-center gap-2 rounded-xl bg-rose-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-rose-800">
          🎮 Lac Learning Game — แบบประเมิน / Dashboard / Export
        </Link>
      </div>
      <AdminDashboard />
    </div>
  );
}
