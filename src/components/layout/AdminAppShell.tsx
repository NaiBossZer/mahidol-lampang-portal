import { useState, type ReactNode } from "react";
import { Building2, ClipboardList, FileText, LayoutDashboard, LogOut, Menu, Settings2, ShoppingBag, X, RefreshCw } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "../AdminGuard";
import type { AdminPermission } from "@/auth/permissions";

const items: readonly { to: string; label: string; icon: typeof LayoutDashboard; permission: AdminPermission }[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, permission: "overview.read" },
  { to: "/admin", label: "Admin Center", icon: Settings2, permission: "system.read" },
  { to: "/admin/cms", label: "Content CMS", icon: FileText, permission: "cms.read" },
  { to: "/admin/lac-satisfaction", label: "LAC Satisfaction", icon: ClipboardList, permission: "survey.audit.read" },
  { to: "/admin/facility-safety", label: "Facility & Safety", icon: Building2, permission: "facility.read" },
  { to: "/storefront", label: "Storefront", icon: ShoppingBag, permission: "store.read" },
];

const iconTone: Record<string, string> = {
  Dashboard: "text-[#00A878]",
  "Admin Center": "text-[#D6A84F]",
  "Content CMS": "text-[#5FA8D3]",
  "LAC Satisfaction": "text-[#6FCF97]",
  "Facility & Safety": "text-[#F2994A]",
  Storefront: "text-[#D6A84F]",
};

function isActive(pathname: string, to: string) {
  return pathname === to || (to !== "/admin" && pathname.startsWith(`${to}/`));
}

export function AdminAppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, email, permissions } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const visibleItems = items.filter((item) => permissions.includes(item.permission));
  const isDashboard = location.pathname === "/dashboard";
  const adminLabel = email ? email.split("@")[0] : "Admin";

  const handleLogout = async () => {
    try { await fetch("/api/auth/logout", { method: "POST", credentials: "include" }); }
    finally { sessionStorage.removeItem("dashboard_auth"); navigate("/login", { replace: true }); }
  };

  const nav = (mobile = false) => (
    <nav className={cn("space-y-1", mobile ? "" : "flex-1 overflow-y-auto p-3")} aria-label={mobile ? "Admin mobile navigation" : "Admin navigation"}>
      {visibleItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(location.pathname, item.to);
        return <Link key={item.to} to={item.to} onClick={() => mobile && setMobileOpen(false)} className={cn("group flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors", active ? "bg-white text-brand-navy shadow-sm" : "text-white/75 hover:bg-white/10 hover:text-white")} aria-current={active ? "page" : undefined}>
          <Icon className={cn("h-4 w-4 shrink-0", active ? "text-brand-navy" : iconTone[item.label] ?? "text-white/70")} aria-hidden="true" />
          <span>{item.label}</span>
        </Link>;
      })}
    </nav>
  );

  return <div className={cn("min-h-screen bg-slate-50 text-slate-900", isDashboard && "admin-dashboard-shell")}>
    <a href="#admin-main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-navy focus:px-4 focus:py-3 focus:text-white">ข้ามไปยังเนื้อหาหลัก</a>
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/10 bg-brand-navy text-white lg:flex lg:flex-col">
        <div className="border-b border-white/10 px-4 py-4">
          <Link to="/" className="flex items-center gap-3 rounded-xl p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A84F]" aria-label="งานพันธกิจเพื่อสังคม — กลับหน้าหลัก">
            <img src="/social-engagement-logo.png" alt="งานพันธกิจเพื่อสังคม" className="h-12 w-12 shrink-0 rounded-lg bg-white object-contain p-1" width="48" height="48" />
            <span className="min-w-0 text-left leading-tight"><span className="block truncate text-sm font-bold text-white">งานพันธกิจเพื่อสังคม</span><span className="mt-0.5 block truncate text-[10px] font-medium text-[#F4E8C5]">คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล</span></span>
          </Link>
        </div>
        {nav()}
        <div className="border-t border-white/10 p-3"><Link to="/" className="mb-1 flex min-h-10 items-center rounded-xl px-3 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white">ดูเว็บไซต์</Link><button type="button" onClick={() => void handleLogout()} className="flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white"><LogOut className="h-4 w-4" aria-hidden="true"/>ออกจากระบบ</button></div>
      </aside>

      <div className="min-w-0 flex-1 lg:pl-64">
        <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b border-[#D6A84F]/70 bg-[#0F3553] px-4 text-white shadow-[0_4px_18px_rgba(15,53,83,0.18)] sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" onClick={() => setMobileOpen((open) => !open)} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-white/20 text-white hover:bg-white/10 lg:hidden" aria-label={mobileOpen ? "ปิดเมนู Admin" : "เปิดเมนู Admin"} aria-expanded={mobileOpen}>{mobileOpen ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}</button>
            {isDashboard ? <div className="min-w-0 leading-tight"><p className="text-[10px] font-semibold tracking-[0.14em] text-[#6FCF97]">EXECUTIVE ANALYTICS &amp; SATISFACTION INSIGHT</p><h1 className="truncate text-base font-bold text-white sm:text-lg">Dashboard ภาพรวมกิจกรรมและความพึงพอใจ</h1></div> : <Link to="/" className="flex min-w-0 items-center gap-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A84F]">
              <img src="/social-engagement-logo.png" alt="งานพันธกิจเพื่อสังคม" className="h-10 w-10 shrink-0 rounded-md bg-white object-contain p-1" width="40" height="40"/>
              <span className="hidden min-w-0 leading-tight sm:block"><span className="block truncate text-sm font-bold text-white">งานพันธกิจเพื่อสังคม</span><span className="block max-w-[430px] truncate text-[10px] font-medium text-[#F4E8C5]">คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล</span></span>
            </Link>}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {isDashboard && <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("dashboard:refresh"))} className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 text-xs font-semibold text-white hover:bg-white/15" aria-label="รีเฟรช Dashboard"><RefreshCw className="h-3.5 w-3.5"/>รีเฟรช</button>}
            <div className="hidden text-right sm:block"><p className="text-[10px] text-white/60">ผู้ดูแลระบบ</p><p className="max-w-[180px] truncate text-xs font-semibold text-white">{adminLabel}</p></div>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-[#F4E8C5]">{role}</span>
            <Link to="/" className="hidden min-h-9 items-center rounded-full border border-white/20 px-3 text-xs font-semibold text-white hover:bg-white/10 md:inline-flex">ดูเว็บไซต์</Link>
          </div>
        </header>

        {mobileOpen && <><button type="button" className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" aria-label="ปิดเมนู Admin" onClick={() => setMobileOpen(false)}/><div className="relative z-40 border-b border-slate-200 bg-brand-navy p-3 shadow-lg lg:hidden">{nav(true)}<div className="mt-3 border-t border-white/10 pt-3"><button type="button" onClick={() => void handleLogout()} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white"><LogOut className="h-4 w-4"/>ออกจากระบบ</button></div></div></>}
        <main id="admin-main" className="min-w-0">{children}</main>
      </div>
    </div>
  </div>;
}
