import { useEffect, useState } from "react";
import { ChevronDown, Menu, ShoppingCart, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";

const centerItems = [
  { label: "Shellac Learning Center", to: "/shellac" },
  { label: "Smart Farm Station", to: "/smart-farm" },
  { label: "Clean Energy Station", to: "/clean-energy" },
];

const navItems = [
  { th: "หน้าแรก", en: "Home", to: "/" },
  { th: "กิจกรรม", en: "Activities", to: "/activities" },
  { th: "แผนที่", en: "Site Map", to: "/site-map" },
  { th: "ร้านค้า", en: "Store", to: "/storefront" },
];

function isActivePath(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

const navItemClass =
  "inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A84F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F3553]";

export function PublicHeader() {
  const location = useLocation();
  const { language, setLanguage } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [centersOpen, setCentersOpen] = useState(false);
  const isEnglish = language === "en";
  const text = (th: string, en: string) => (isEnglish ? en : th);

  const closeMenus = () => {
    setMobileOpen(false);
    setCentersOpen(false);
  };

  useEffect(() => {
    if (!centersOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCentersOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [centersOpen]);

  const centersActive = centerItems.some((item) => isActivePath(location.pathname, item.to));
  const navLabel = (item: (typeof navItems)[number]) => text(item.th, item.en);

  return (
    <header className="sticky top-0 z-50 border-b border-[#D6A84F]/70 bg-[#0F3553] text-white shadow-[0_4px_18px_rgba(15,53,83,0.18)]">
      <div className="mx-auto flex min-h-[88px] max-w-[1280px] items-center gap-4 px-4 py-3 sm:px-6 xl:gap-6 xl:px-8">
        <Link to="/" onClick={closeMenus} className="flex min-w-0 flex-1 items-center gap-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A84F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F3553]" aria-label={text("งานพันธกิจเพื่อสังคม — กลับหน้าหลัก", "Social Engagement — Home")}>
          <div className="flex shrink-0 items-center gap-1.5" aria-label={text("ตราสัญลักษณ์หน่วยงาน", "Organization logos")}>
            <img src="/mahidol-logo.png" alt="มหาวิทยาลัยมหิดล" className="h-11 w-[108px] rounded-md bg-white object-contain p-1 max-[399px]:h-9 max-[399px]:w-[72px]" width="108" height="44" />
            <img src="/envi-logo.jpg" alt="คณะสิ่งแวดล้อมและทรัพยากรศาสตร์" className="h-11 w-[66px] rounded-md bg-white object-contain p-1 max-[399px]:h-9 max-[399px]:w-[44px]" width="66" height="44" />
            <img src="/social-engagement-logo.png" alt="งานพันธกิจเพื่อสังคม" className="h-11 w-[46px] rounded-md bg-white object-contain p-1 max-[399px]:h-9 max-[399px]:w-[32px]" width="46" height="44" />
          </div>
          <div className="hidden min-w-0 text-left leading-tight sm:block">
            <p className="truncate text-sm font-bold text-white">งานพันธกิจเพื่อสังคม</p>
            <p className="mt-0.5 max-w-[360px] text-[11px] font-medium leading-4 text-[#F4E8C5]">คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล · พื้นที่สบปราบ ลำปาง</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1.5 xl:flex" aria-label={text("เมนูหลัก", "Main navigation")}>
          {navItems.slice(0, 2).map((item) => (
            <Link key={item.to} to={item.to} className={`${navItemClass} ${isActivePath(location.pathname, item.to) ? "bg-[#00A878] text-white shadow-[0_4px_12px_rgba(0,168,120,0.22)]" : "text-white/95 hover:bg-white/10"}`}>
              {navLabel(item)}
            </Link>
          ))}

          <div className="relative">
            <button type="button" onClick={() => setCentersOpen((open) => !open)} className={`${navItemClass} gap-1.5 ${centersActive || centersOpen ? "bg-[#00A878] text-white shadow-[0_4px_12px_rgba(0,168,120,0.22)]" : "text-white/95 hover:bg-white/10"}`} aria-expanded={centersOpen} aria-haspopup="menu" aria-controls="desktop-centers-menu">
              {text("ศูนย์", "Centers")}
              <ChevronDown size={16} className={`transition-transform ${centersOpen ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
            {centersOpen && (
              <div id="desktop-centers-menu" className="absolute right-0 top-full mt-3 min-w-[270px] overflow-hidden rounded-2xl border border-[#E8E2D7] bg-white py-1.5 text-[#1F2933] shadow-[0_18px_45px_rgba(15,53,83,0.2)]" role="menu">
                {centerItems.map((item) => (
                  <Link key={item.to} to={item.to} onClick={closeMenus} className={`block min-h-11 px-4 py-3 text-sm transition-colors hover:bg-[#F8F6F0] hover:text-[#123B63] ${isActivePath(location.pathname, item.to) ? "font-semibold text-[#123B63]" : "text-[#1F2933]"}`} role="menuitem">
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {navItems.slice(2).map((item) => (
            <Link key={item.to} to={item.to} className={`${navItemClass} ${isActivePath(location.pathname, item.to) ? "bg-[#00A878] text-white shadow-[0_4px_12px_rgba(0,168,120,0.22)]" : "text-white/95 hover:bg-white/10"}`}>
              {navLabel(item)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          <button type="button" onClick={() => setLanguage(isEnglish ? "th" : "en")} aria-label={text("เปลี่ยนเป็นภาษาอังกฤษ", "Switch to Thai")} className="inline-flex min-h-11 items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 text-xs font-bold tracking-wide text-white transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A84F]">
            <span className={language === "th" ? "text-[#F4E8C5]" : "text-white/55"}>TH</span>
            <span className="text-white/35">/</span>
            <span className={language === "en" ? "text-[#F4E8C5]" : "text-white/55"}>EN</span>
          </button>
          <Link to="/storefront" aria-label={text("ตะกร้าสินค้า", "Shopping cart")} className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A84F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F3553]"><ShoppingCart size={20} aria-hidden="true" /></Link>
          <Link to="/login" className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#00A878] px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(0,168,120,0.22)] transition hover:bg-[#00966D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A84F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F3553]">{text("เข้าสู่ระบบ", "Log in")}</Link>
        </div>

        <button type="button" className="flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-white/20 text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A84F] xl:hidden" onClick={() => setMobileOpen((open) => !open)} aria-expanded={mobileOpen} aria-controls="mobile-navigation" aria-label={mobileOpen ? text("ปิดเมนู", "Close menu") : text("เปิดเมนู", "Open menu")}>
          {mobileOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </div>

      {mobileOpen && (
        <div id="mobile-navigation" className="border-t border-white/10 bg-[#0F3553] xl:hidden" role="navigation" aria-label={text("เมนูมือถือ", "Mobile navigation")}>
          <div className="mx-auto max-w-[1280px] space-y-1 px-4 py-3 sm:px-6">
            {navItems.slice(0, 2).map((item) => (
              <Link key={item.to} to={item.to} onClick={closeMenus} className={`flex min-h-11 items-center rounded-xl px-3 py-3 text-sm font-semibold ${isActivePath(location.pathname, item.to) ? "bg-[#00A878] text-white" : "text-white hover:bg-white/10"}`}>{navLabel(item)}</Link>
            ))}
            <div className="rounded-2xl border border-white/10 p-2">
              <p className="px-2 py-1 text-xs font-semibold tracking-wide text-[#F4E8C5]">{text("ศูนย์", "Centers")}</p>
              {centerItems.map((item) => <Link key={item.to} to={item.to} onClick={closeMenus} className={`flex min-h-11 items-center rounded-xl px-3 py-2.5 text-sm ${isActivePath(location.pathname, item.to) ? "bg-[#00A878] font-semibold text-white" : "text-white hover:bg-white/10"}`}>{item.label}</Link>)}
            </div>
            {navItems.slice(2).map((item) => (
              <Link key={item.to} to={item.to} onClick={closeMenus} className={`flex min-h-11 items-center rounded-xl px-3 py-3 text-sm font-semibold ${isActivePath(location.pathname, item.to) ? "bg-[#00A878] text-white" : "text-white hover:bg-white/10"}`}>{navLabel(item)}</Link>
            ))}
            <div className="flex items-center gap-2 border-t border-white/10 pt-2">
              <button type="button" onClick={() => setLanguage(isEnglish ? "th" : "en")} className="min-h-11 flex-1 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm font-bold text-white">{language === "th" ? "TH / EN" : "EN / TH"}</button>
              <Link to="/login" onClick={closeMenus} className="flex min-h-11 flex-[2] items-center justify-center rounded-full bg-[#00A878] px-3 py-3 text-sm font-semibold text-white">{text("เข้าสู่ระบบ", "Log in")}</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
