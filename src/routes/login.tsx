import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

export function LoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // ใส่ Logic รหัสผ่านของคุณที่นี่ (ตัวอย่าง: admin1234)
    if (password === "ENLP2517") {
      sessionStorage.setItem("dashboard_auth", "true");
      navigate({ to: "/dashboard" });
    } else {
      setError("รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xl max-w-sm w-full space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            เข้าสู่ระบบ Dashboard
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            กรุณากรอกรหัสผ่านเพื่อเข้าชมสรุปผลแบบประเมิน
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              รหัสผ่าน
            </label>
            <input
              type="password"
              placeholder="กรอกรหัสผ่านที่นี่..."
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-500 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-800 transition-all placeholder:text-slate-400"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-xs font-semibold text-red-500 text-center animate-shake">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        {/* ปุ่มกลับสู่หน้าหลัก */}
        <div className="pt-2 text-center border-t border-slate-100">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-600 font-semibold transition-colors py-1 px-2 rounded-lg hover:bg-slate-50"
          >
            ← กลับสู่หน้าหลัก
          </Link>
        </div>

      </div>
    </div>
  );
}
