import { useState, type ReactNode } from "react";
import { Building2, ClipboardList, FileText, LayoutDashboard, LogOut, Menu, Settings2, ShoppingBag, X } from "lucide-react";
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

function isActive(pathname: string, to: string) {
  return pathname === to || (to !== "/admin" && pathname.startsWith(`${to}/`));
}

export function AdminAppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, permissions } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const visibleItems = items.filter((item) => permissions.includes(item.permission));

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } finally {
      sessionStorage.removeItem("dashboard_auth");
      navigate("/login", { replace: true });
    }
  };

  const nav = (mobile = false) => (
    <nav className={cn("space-y-1", mobile ? "" : "flex-1 overflow-y-auto p-3")} aria-label={mobile ? "Admin mobile navigation" : "Admin navigation"}>
      {visibleItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(location.pathname, item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => mobile && setMobileOpen(false)}
            className={cn(
              "group flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
              active ? "bg-white text-brand-navy shadow-sm" : "text-white/75 hover:bg-white/10 hover:text-white",
            )}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <a href="#admin-main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-navy focus:px-4 focus:py-3 focus:text-white">ข้ามไปยังเนื้อหาหลัก</a>
      <div className="flex min-h-screen">
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/10 bg-brand-navy text-white lg:flex lg:flex-col">
          <div className="border-b border-white/10 px-5 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">Mahidol Lampang</p>
            <h1 className="mt-1 text-lg font-bold tracking-tight">Admin Console</h1>
            <div className="mt-3 inline-flex rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/75">{role}</div>
          </div>
          {nav()}
          <div className="border-t border-white/10 p-3">
            <Link to="/" className="mb-1 flex min-h-10 items-center rounded-xl px-3 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white">ดูเว็บไซต์</Link>
            <button type="button" onClick={() => void handleLogout()} className="flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white">
              <LogOut className="h-4 w-4" aria-hidden="true" />
              ออกจากระบบ
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1 lg:pl-64">
          <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button type="button" onClick={() => setMobileOpen((open) => !open)} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 lg:hidden" aria-label={mobileOpen ? "ปิดเมนู Admin" : "เปิดเมนู Admin"} aria-expanded={mobileOpen}>
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-slate-500">Central Administration</p>
                <p className="truncate text-sm font-bold text-brand-navy">Mahidol Lampang Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 sm:inline-flex">{role}</span>
              <Link to="/" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-brand-navy hover:bg-slate-50">ดูเว็บไซต์</Link>
            </div>
          </header>

          {mobileOpen && (
            <>
              <button type="button" className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" aria-label="ปิดเมนู Admin" onClick={() => setMobileOpen(false)} />
              <div className="relative z-40 border-b border-slate-200 bg-brand-navy p-3 shadow-lg lg:hidden">
                {nav(true)}
                <div className="mt-3 border-t border-white/10 pt-3">
                  <button type="button" onClick={() => void handleLogout()} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white">
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    ออกจากระบบ
                  </button>
                </div>
              </div>
            </>
          )}
          <main id="admin-main" className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
