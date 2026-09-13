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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="mx-auto w-full max-w-7xl px-4 pt-4 md:px-8 flex flex-wrap gap-3">
        <Link to="/admin/control-center" className="inline-flex items-center gap-2 rounded-xl bg-[#123B63] px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#0f3152]">
          🛡️ Central Admin Control Center
        </Link>
        <Link to="/admin/lac-satisfaction" className="inline-flex items-center gap-2 rounded-xl bg-rose-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-rose-800">
          🎮 Lac Learning Game — แบบประเมิน / Dashboard / Export
        </Link>
        <Link to="/admin/facility-safety" className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-800">
          🏢 Facility & Safety
        </Link>
      </div>
      <AdminDashboard />
    </div>
  );
}
