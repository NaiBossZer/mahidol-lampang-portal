import { useState } from "react";
import { Eye, EyeOff, ArrowLeft, Lock, Mail } from "lucide-react";
import type { PublicPage } from "../PublicPortal";

interface Props {
  navigate: (p: PublicPage) => void;
}

export default function LoginPage({ navigate }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }
    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
      navigate("home");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] flex">
      {/* Left decorative panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-[480px] flex-shrink-0 bg-[#123B63] relative overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1647607124632-f47bfa887125?w=600&h=900&fit=crop&auto=format)` }}
        />
        <div className="relative p-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">ML</span>
            </div>
            <div>
              <div className="text-white font-semibold text-sm">Mahidol Lampang</div>
              <div className="text-white/50 text-xs">มหิดล ลำปาง พอร์ทัล</div>
            </div>
          </div>
        </div>
        <div className="relative p-10">
          <blockquote className="text-white/90 text-2xl font-semibold leading-snug mb-4">
            "ภูมิปัญญาท้องถิ่น<br />สู่อนาคตการเรียนรู้"
          </blockquote>
          <p className="text-white/50 text-sm">
            มหาวิทยาลัยมหิดล วิทยาเขตลำปาง
          </p>
          <div className="mt-8 flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`h-1 rounded-full ${i === 0 ? "w-8 bg-[#D6A84F]" : "w-3 bg-white/30"}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 max-sm:px-4 py-12">
        <div className="w-full max-w-[400px]">
          <button
            onClick={() => navigate("home")}
            className="flex items-center gap-2 text-[#667085] text-sm hover:text-[#123B63] transition-colors mb-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677A8] rounded p-1"
          >
            <ArrowLeft size={16} /> กลับหน้าหลัก
          </button>

          {/* Logo (mobile) */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#123B63] flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">ML</span>
            </div>
            <div>
              <div className="text-[#123B63] font-semibold">Mahidol Lampang</div>
              <div className="text-[#667085] text-xs">มหิดล ลำปาง พอร์ทัล</div>
            </div>
          </div>

          <h1 className="text-[#123B63] font-bold text-3xl mb-2">เข้าสู่ระบบ</h1>
          <p className="text-[#667085] text-base mb-8">ยินดีต้อนรับกลับสู่ระบบมหิดล ลำปาง</p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-[#C66B4F]/10 border border-[#C66B4F]/20 text-[#C66B4F] text-sm flex items-center gap-2">
              <Lock size={14} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="block text-[#1F2933] text-sm font-medium mb-1.5">
                อีเมล / รหัสนักศึกษา
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9BA8B7]" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@mahidol.ac.th"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#EEE9DF] bg-white text-[#1F2933] text-sm placeholder:text-[#9BA8B7] focus:outline-none focus:ring-2 focus:ring-[#1677A8] focus:border-transparent min-h-[48px] transition-shadow"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="text-[#1F2933] text-sm font-medium">รหัสผ่าน</label>
                <a href="#" className="text-[#1677A8] text-sm hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677A8] rounded">
                  ลืมรหัสผ่าน?
                </a>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9BA8B7]" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-[#EEE9DF] bg-white text-[#1F2933] text-sm placeholder:text-[#9BA8B7] focus:outline-none focus:ring-2 focus:ring-[#1677A8] focus:border-transparent min-h-[48px] transition-shadow"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9BA8B7] hover:text-[#667085] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677A8] rounded"
                  aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-[#EEE9DF] accent-[#123B63] cursor-pointer"
              />
              <label htmlFor="remember" className="text-[#667085] text-sm cursor-pointer select-none">
                จดจำฉันในระบบ
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#123B63] text-white font-semibold text-sm hover:bg-[#0e2d4f] transition-colors min-h-[48px] disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677A8]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  กำลังเข้าสู่ระบบ…
                </span>
              ) : "เข้าสู่ระบบ"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#667085] text-sm">
              ยังไม่มีบัญชี?{" "}
              <a href="#" className="text-[#1677A8] font-semibold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677A8] rounded">
                สมัครสมาชิก
              </a>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-[#EEE9DF] text-center">
            <p className="text-[#9BA8B7] text-xs">
              การเข้าสู่ระบบถือว่าคุณยอมรับ{" "}
              <a href="#" className="underline hover:text-[#667085]">นโยบายความเป็นส่วนตัว</a>
              {" "}และ{" "}
              <a href="#" className="underline hover:text-[#667085]">ข้อกำหนดการใช้งาน</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
