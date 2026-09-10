import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const centerItems = [
  { label: "Shellac Learning Center", to: "/shellac" },
  { label: "Smart Farm Station", to: "/smart-farm" },
  { label: "Clean Energy Station", to: "/clean-energy" },
];

const navItems = [
  { label: "หน้าแรก", to: "/" },
  { label: "กิจกรรม", to: "/activities" },
  { label: "แผนที่", to: "/site-map" },
  { label: "ร้านค้า", to: "/storefront" },
];

function isActivePath(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function PublicHeader() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [centersOpen, setCentersOpen] = useState(false);

  const closeMenus = () => {
    setMobileOpen(false);
    setCentersOpen(false);
  };

  const centersActive = centerItems.some((item) => isActivePath(location.pathname, item.to));

  return (
    <header className="sticky top-0 z-50 border-b border-[#EEE9DF] bg-white/95 shadow-[0_1px_4px_rgba(18,59,99,0.06)] backdrop-blur">
      <div className="mx-auto flex min-h-[88px] max-w-[1280px] items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to="/"
          onClick={closeMenus}
          className="flex min-w-0 items-center gap-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677A8] focus-visible:ring-offset-2"
          aria-label="งานพันธกิจเพื่อสังคม — กลับหน้าหลัก"
        >
          <div className="flex shrink-0 items-center gap-1.5" aria-label="ตราสัญลักษณ์หน่วยงาน">
            <img src="/mahidol-logo.png" alt="มหาวิทยาลัยมหิดล" className="h-11 w-11 rounded-full object-contain" width="44" height="44" />
            <img src="/envi-logo.jpg" alt="คณะสิ่งแวดล้อมและทรัพยากรศาสตร์" className="h-11 w-11 rounded-full object-contain" width="44" height="44" />
            <img src="/social-engagement-logo.png" alt="งานพันธกิจเพื่อสังคม" className="h-11 w-11 rounded-full object-contain" width="44" height="44" />
          </div>
          <div className="hidden min-w-0 text-left leading-tight sm:block">
            <p className="truncate text-sm font-bold text-[#123B63]">งานพันธกิจเพื่อสังคม</p>
            <p className="mt-0.5 max-w-[310px] text-[11px] font-medium leading-4 text-[#667085]">
              คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="เมนูหลัก">
          {navItems.slice(0, 2).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677A8] ${
                isActivePath(location.pathname, item.to)
                  ? "bg-[#EEE9DF] font-semibold text-[#123B63]"
                  : "text-[#1F2933] hover:bg-[#F8F6F0] hover:text-[#123B63]"
              }`}
            >
              {item.label}
            </Link>
          ))}

          <div className="relative">
            <button
              type="button"
              onClick={() => setCentersOpen((open) => !open)}
              onBlur={() => window.setTimeout(() => setCentersOpen(false), 150)}
              className={`flex min-h-11 items-center gap-1 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677A8] ${
                centersActive
                  ? "bg-[#EEE9DF] font-semibold text-[#123B63]"
                  : "text-[#1F2933] hover:bg-[#F8F6F0] hover:text-[#123B63]"
              }`}
              aria-expanded={centersOpen}
              aria-haspopup="menu"
            >
              ศูนย์
              <ChevronDown size={15} className={`transition-transform ${centersOpen ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
            {centersOpen && (
              <div className="absolute left-0 top-full mt-2 min-w-[250px] overflow-hidden rounded-2xl border border-[#EEE9DF] bg-white py-1.5 shadow-[0_16px_40px_rgba(18,59,99,0.14)]" role="menu">
                {centerItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={closeMenus}
                    className={`block px-4 py-3 text-sm transition-colors hover:bg-[#F8F6F0] hover:text-[#123B63] ${
                      isActivePath(location.pathname, item.to) ? "font-semibold text-[#123B63]" : "text-[#1F2933]"
                    }`}
                    role="menuitem"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {navItems.slice(2).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677A8] ${
                isActivePath(location.pathname, item.to)
                  ? "bg-[#EEE9DF] font-semibold text-[#123B63]"
                  : "text-[#1F2933] hover:bg-[#F8F6F0] hover:text-[#123B63]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 md:block">
          <Link
            to="/login"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#123B63]/30 px-4 py-2.5 text-sm font-semibold text-[#123B63] transition-colors hover:border-[#123B63] hover:bg-[#123B63]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677A8] focus-visible:ring-offset-2"
          >
            เข้าสู่ระบบ
          </Link>
        </div>

        <button
          type="button"
          className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-[#1F2933] transition-colors hover:bg-[#F8F6F0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677A8] md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "ปิดเมนู" : "เปิดเมนู"}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-[#EEE9DF] bg-white md:hidden" role="navigation" aria-label="เมนูมือถือ">
          <div className="mx-auto max-w-[1280px] space-y-1 px-4 py-3 sm:px-6">
            {navItems.slice(0, 2).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={closeMenus}
                className={`flex min-h-11 items-center rounded-lg px-3 py-3 text-sm font-medium ${
                  isActivePath(location.pathname, item.to) ? "bg-[#EEE9DF] font-semibold text-[#123B63]" : "text-[#1F2933] hover:bg-[#F8F6F0]"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="rounded-xl border border-[#EEE9DF] p-2">
              <p className="px-2 py-1 text-xs font-semibold tracking-wide text-[#667085]">ศูนย์</p>
              {centerItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={closeMenus}
                  className={`flex min-h-11 items-center rounded-lg px-3 py-2.5 text-sm ${
                    isActivePath(location.pathname, item.to) ? "font-semibold text-[#123B63]" : "text-[#1F2933] hover:bg-[#F8F6F0]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            {navItems.slice(2).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={closeMenus}
                className={`flex min-h-11 items-center rounded-lg px-3 py-3 text-sm font-medium ${
                  isActivePath(location.pathname, item.to) ? "bg-[#EEE9DF] font-semibold text-[#123B63]" : "text-[#1F2933] hover:bg-[#F8F6F0]"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-[#EEE9DF] pt-2">
              <Link
                to="/login"
                onClick={closeMenus}
                className="flex min-h-11 items-center justify-center rounded-xl border border-[#123B63]/30 px-3 py-3 text-sm font-semibold text-[#123B63] hover:bg-[#123B63]/5"
              >
                เข้าสู่ระบบ
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
