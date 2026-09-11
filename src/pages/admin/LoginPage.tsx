import { Link as RouterLink, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect")?.startsWith("/admin") ? searchParams.get("redirect")! : "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      if (!response.ok) { const body = await response.json().catch(() => ({})) as { error?: string }; setError(body.error ?? "เข้าสู่ระบบไม่สำเร็จ"); return; }
      sessionStorage.removeItem("dashboard_auth"); navigate(redirect);
    } catch { setError("ไม่สามารถเชื่อมต่อระบบยืนยันตัวตนได้"); }
    finally { setLoading(false); }
  };

  return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans"><div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xl max-w-sm w-full space-y-6">
    <div className="text-center space-y-1"><h1 className="text-2xl font-black text-slate-800 tracking-tight">เข้าสู่ระบบ Central Admin</h1><p className="text-xs text-slate-500 font-medium">ใช้บัญชีบุคลากรที่ได้รับอนุญาตผ่าน Supabase Auth</p></div>
    <form onSubmit={handleLogin} className="space-y-4" autoComplete="on">
      <div className="space-y-1.5"><label className="text-xs font-semibold text-slate-700 block">อีเมล</label><input type="email" required value={email} onChange={e => { setEmail(e.target.value); setError(""); }} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-800" autoFocus autoComplete="username" /></div>
      <div className="space-y-1.5"><label className="text-xs font-semibold text-slate-700 block">รหัสผ่าน</label><input type="password" required value={password} onChange={e => { setPassword(e.target.value); setError(""); }} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-800" autoComplete="current-password" /></div>
      {error && <p role="alert" className="text-xs font-semibold text-red-500 text-center">{error}</p>}
      <button type="submit" disabled={loading} className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-sm">{loading ? "กำลังตรวจสอบ…" : "เข้าสู่ระบบ"}</button>
    </form>
    <div className="pt-2 text-center border-t border-slate-100"><RouterLink to="/" className="text-xs text-slate-500 hover:text-emerald-600 font-semibold">← กลับสู่หน้าหลัก</RouterLink></div>
  </div></div>;
}
