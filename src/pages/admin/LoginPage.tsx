import { Link as RouterLink, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const redirect = redirectParam?.startsWith("/admin") || redirectParam === "/dashboard" ? redirectParam : "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({ email, password }),
      });
      const body = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        setError(body.error ?? "เข้าสู่ระบบไม่สำเร็จ");
        return;
      }

      const sessionResponse = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });
      const sessionBody = (await sessionResponse.json().catch(() => ({}))) as {
        data?: { authorized?: boolean; role?: string };
      };

      if (!sessionResponse.ok || !sessionBody.data?.authorized || !sessionBody.data.role) {
        setError(
          sessionResponse.status === 403
            ? "บัญชีเข้าสู่ระบบได้ แต่ยังไม่ได้รับสิทธิ์ Central Admin"
            : sessionResponse.status === 401
              ? "สร้าง session สำเร็จ แต่ไม่พบ session จากเบราว์เซอร์"
              : "ไม่สามารถตรวจสอบสิทธิ์ Central Admin ได้",
        );
        return;
      }

      sessionStorage.setItem("dashboard_auth", "true");
      navigate(redirect, { replace: true });
    } catch {
      setError("ไม่สามารถเชื่อมต่อระบบยืนยันตัวตนได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-surface-warm px-4 py-8 font-sans sm:px-6 sm:py-10">
      <main className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-[520px] flex-col justify-center">
        <header className="text-center">
          <img src="/social-engagement-logo.png" alt="งานพันธกิจเพื่อสังคม" className="mx-auto h-20 w-20 object-contain sm:h-24 sm:w-24" width="96" height="96" />
          <h1 className="mt-3 text-xl font-black tracking-tight text-brand-navy sm:text-2xl">งานพันธกิจเพื่อสังคม</h1>
          <p className="mt-1 text-xs font-medium leading-5 text-muted-ink sm:text-sm">คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล</p>
        </header>

        <section className="mt-6 rounded-2xl border border-panel-line bg-white px-5 py-6 shadow-[0_10px_30px_rgba(18,59,99,0.08)] sm:px-8 sm:py-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-blue">Central Admin</p>
            <h2 className="mt-2 text-xl font-black tracking-tight text-brand-navy sm:text-2xl">เข้าสู่ระบบ</h2>
            <p className="mt-1 text-sm text-muted-ink">ใช้บัญชีบุคลากรที่ได้รับอนุญาต</p>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-5" autoComplete="on">
            <div className="space-y-2">
              <label htmlFor="login-email" className="block text-sm font-semibold text-ink">อีเมล</label>
              <input id="login-email" type="email" required value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} placeholder="username@mahidol.ac.th" className="w-full rounded-xl border border-input bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted-ink/70 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15" autoFocus autoComplete="username" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="login-password" className="block text-sm font-semibold text-ink">รหัสผ่าน</label>
                <span className="text-xs font-semibold text-brand-blue">ลืมรหัสผ่าน? ติดต่อผู้ดูแลระบบ</span>
              </div>
              <input id="login-password" type="password" required value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} className="w-full rounded-xl border border-input bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15" autoComplete="current-password" />
            </div>

            {error && <p role="alert" className="rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-center text-xs font-semibold leading-5 text-red-600">{error}</p>}

            <button type="submit" disabled={loading} className="w-full rounded-xl bg-brand-navy py-3 text-sm font-bold text-white shadow-[0_5px_14px_rgba(18,59,99,0.18)] transition hover:bg-[#0F3553] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60">{loading ? "กำลังตรวจสอบ…" : "เข้าสู่ระบบ"}</button>
          </form>

          <div className="mt-5 border-t border-surface-subtle pt-5 text-center">
            <RouterLink to="/" className="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-semibold text-muted-ink transition-colors hover:bg-surface-subtle hover:text-brand-blue">← กลับสู่หน้าหลัก</RouterLink>
          </div>
        </section>

        <footer className="mt-6 px-2 text-center text-xs leading-5 text-muted-ink">
          <p>© 2026 งานพันธกิจเพื่อสังคม คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล</p>
        </footer>
      </main>
    </div>
  );
}
