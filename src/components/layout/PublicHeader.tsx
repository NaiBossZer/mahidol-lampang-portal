import { useState } from "react";
import { ChevronDown, Menu, Search, ShoppingCart, X } from "lucide-react";
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

const navItemClass =
  "inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A84F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F3553]";

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
    <header className="sticky top-0 z-50 border-b border-[#D6A84F]/70 bg-[#0F3553] text-white shadow-[0_4px_18px_rgba(15,53,83,0.18)]">
      <div className="mx-auto flex min-h-[88px] max-w-[1280px] items-center gap-4 px-4 py-3 sm:px-6 lg:gap-6 lg:px-8">
        <Link
          to="/"
          onClick={closeMenus}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A84F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F3553]"
          aria-label="งานพันธกิจเพื่อสังคม — กลับหน้าหลัก"
        >
          <div className="flex shrink-0 items-center gap-1.5" aria-label="ตราสัญลักษณ์หน่วยงาน">
            <img src="/mahidol-logo.png" alt="มหาวิทยาลัยมหิดล" className="h-11 w-11 rounded-full object-contain" width="44" height="44" />
            <img src="/envi-logo.jpg" alt="คณะสิ่งแวดล้อมและทรัพยากรศาสตร์" className="h-11 w-11 rounded-full object-contain" width="44" height="44" />
            <img src="/social-engagement-logo.png" alt="งานพันธกิจเพื่อสังคม" className="h-11 w-11 rounded-full object-contain" width="44" height="44" />
          </div>
          <div className="hidden min-w-0 text-left leading-tight sm:block">
            <p className="truncate text-sm font-bold text-white">งานพันธกิจเพื่อสังคม</p>
            <p className="mt-0.5 max-w-[310px] text-[11px] font-medium leading-4 text-[#F4E8C5]">
              คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1.5 lg:flex" aria-label="เมนูหลัก">
          {navItems.slice(0, 2).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`${navItemClass} ${
                isActivePath(location.pathname, item.to)
                  ? "bg-[#00A878] text-white shadow-[0_4px_12px_rgba(0,168,120,0.22)]"
                  : "text-white/95 hover:bg-white/10"
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
              className={`${navItemClass} gap-1.5 ${
                centersActive || centersOpen
                  ? "bg-[#00A878] text-white shadow-[0_4px_12px_rgba(0,168,120,0.22)]"
                  : "text-white/95 hover:bg-white/10"
              }`}
              aria-expanded={centersOpen}
              aria-haspopup="menu"
            >
              ศูนย์
              <ChevronDown size={16} className={`transition-transform ${centersOpen ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
            {centersOpen && (
              <div className="absolute right-0 top-full mt-3 min-w-[270px] overflow-hidden rounded-2xl border border-[#E8E2D7] bg-white py-1.5 text-[#1F2933] shadow-[0_18px_45px_rgba(15,53,83,0.2)]" role="menu">
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
              className={`${navItemClass} ${
                isActivePath(location.pathname, item.to)
                  ? "bg-[#00A878] text-white shadow-[0_4px_12px_rgba(0,168,120,0.22)]"
                  : "text-white/95 hover:bg-white/10"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <div className="relative hidden xl:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={16} aria-hidden="true" />
            <input
              aria-label="ค้นหา"
              type="search"
              placeholder="ค้นหา..."
              className="h-10 w-[145px] rounded-full border border-white/20 bg-white/10 pl-9 pr-3 text-sm text-white placeholder:text-white/55 outline-none transition focus:border-[#D6A84F] focus:bg-white/15"
            />
          </div>
          <Link
            to="/storefront"
            aria-label="ตะกร้าสินค้า"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A84F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F3553]"
          >
            <ShoppingCart size={20} aria-hidden="true" />
          </Link>
          <Link
            to="/login"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#00A878] px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(0,168,120,0.22)] transition hover:bg-[#00966D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A84F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F3553]"
          >
            เข้าสู่ระบบ
          </Link>
        </div>

        <button
          type="button"
          className="flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-white/20 text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A84F] lg:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "ปิดเมนู" : "เปิดเมนู"}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#0F3553] lg:hidden" role="navigation" aria-label="เมนูมือถือ">
          <div className="mx-auto max-w-[1280px] space-y-1 px-4 py-3 sm:px-6">
            {navItems.slice(0, 2).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={closeMenus}
                className={`flex min-h-11 items-center rounded-xl px-3 py-3 text-sm font-semibold ${
                  isActivePath(location.pathname, item.to) ? "bg-[#00A878] text-white" : "text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="rounded-2xl border border-white/10 p-2">
              <p className="px-2 py-1 text-xs font-semibold tracking-wide text-[#F4E8C5]">ศูนย์</p>
              {centerItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={closeMenus}
                  className={`flex min-h-11 items-center rounded-xl px-3 py-2.5 text-sm ${
                    isActivePath(location.pathname, item.to) ? "bg-[#00A878] font-semibold text-white" : "text-white hover:bg-white/10"
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
                className={`flex min-h-11 items-center rounded-xl px-3 py-3 text-sm font-semibold ${
                  isActivePath(location.pathname, item.to) ? "bg-[#00A878] text-white" : "text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-white/10 pt-2">
              <Link
                to="/login"
                onClick={closeMenus}
                className="flex min-h-11 items-center justify-center rounded-full bg-[#00A878] px-3 py-3 text-sm font-semibold text-white"
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
