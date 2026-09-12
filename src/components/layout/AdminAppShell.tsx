import { useState, type ReactNode } from "react";
import {
  BarChart3, Bell, BookOpen, Building2, CalendarRange, ClipboardList,
  FileImage, FileText, LayoutDashboard, ListTodo, LogOut, Menu, Search,
  Settings2, ShieldCheck, ShoppingBag, X, RefreshCw, Bot, History,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "../AdminGuard";
import type { AdminPermission } from "@/auth/permissions";

const items: readonly { to: string; label: string; icon: typeof LayoutDashboard; permission: AdminPermission }[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, permission: "overview.read" },
  { to: "/admin/activities", label: "กิจกรรม", icon: CalendarRange, permission: "activities.read" },
  { to: "/admin/activities/occurrences", label: "รอบกิจกรรม", icon: CalendarRange, permission: "activities.read" },
  { to: "/admin/activities/photos", label: "ภาพกิจกรรม", icon: FileImage, permission: "activities.read" },
  { to: "/admin/activities/relations", label: "Activity Relations", icon: Building2, permission: "activities.read" },
  { to: "/admin/surveys", label: "แบบสอบถาม", icon: ClipboardList, permission: "survey.read" },
  { to: "/admin/learning-centers", label: "Learning Centers", icon: BookOpen, permission: "learning_centers.read" },
  { to: "/admin/organizations", label: "Organizations", icon: Building2, permission: "overview.read" },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3, permission: "overview.read" },
  { to: "/admin/audit-trail", label: "Audit Trail", icon: ShieldCheck, permission: "system.read" },
  { to: "/admin/governance", label: "Governance", icon: Settings2, permission: "system.read" },
  { to: "/admin/settings", label: "System Settings", icon: Settings2, permission: "system.read" },
  { to: "/admin/cms", label: "Content CMS", icon: FileText, permission: "cms.read" },
  { to: "/admin/lac-satisfaction", label: "LAC Satisfaction", icon: ClipboardList, permission: "survey.audit.read" },
  { to: "/admin/facility-safety", label: "Facility & Safety", icon: Building2, permission: "facility.read" },
  { to: "/storefront", label: "Storefront", icon: ShoppingBag, permission: "store.read" },
];

const aiItems: readonly { to: string; label: string; icon: typeof Bot; permission: AdminPermission }[] = [
  { to: "/admin/ai", label: "AI Command Center", icon: Bot, permission: "ai.command.read" },
  { to: "/admin/ai/work-queue", label: "AI Work Queue", icon: ListTodo, permission: "ai.queue.read" },
  { to: "/admin/ai/history", label: "AI History", icon: History, permission: "ai.execution.read" },
];

export function AdminAppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, permissions } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const hasPermission = (permission: AdminPermission) => role === "SUPER_ADMIN" || permissions.includes(permission);
  const navItems = items.filter((item) => hasPermission(item.permission));
  const aiNavItems = aiItems.filter((item) => hasPermission(item.permission));

  async function logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST", headers: { Accept: "application/json" } });
    } finally {
      sessionStorage.removeItem("dashboard_auth");
      navigate("/login", { replace: true });
    }
  }

  const isDashboard = location.pathname === "/dashboard";
  return (
    <div className={cn("min-h-screen bg-surface-warm text-slate-900", isDashboard && "admin-dashboard-shell")}>
      <button type="button" aria-label="เปิดเมนู" className="fixed left-4 top-4 z-50 grid h-10 w-10 place-items-center rounded-xl border bg-white text-brand-navy shadow-sm lg:hidden" onClick={() => setMobileOpen(true)}>
        <Menu className="h-5 w-5" />
      </button>
      {mobileOpen && <button type="button" aria-label="ปิดเมนู" className="fixed inset-0 z-40 bg-slate-950/30 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <aside className={cn("fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-brand-navy text-white transition-transform lg:translate-x-0", mobileOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <div><p className="text-xs font-semibold uppercase tracking-[.14em] text-white/60">Mahidol Lampang</p><p className="mt-0.5 text-base font-bold">Central Admin</p></div>
          <button type="button" className="lg:hidden" onClick={() => setMobileOpen(false)} aria-label="ปิด"><X className="h-5 w-5" /></button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Admin navigation">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[.14em] text-white/40">Operations</p>
          {navItems.map((item) => { const Icon = item.icon; const active = location.pathname === item.to || (item.to !== "/dashboard" && location.pathname.startsWith(`${item.to}/`)); return <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className={cn("mb-1 flex min-h-10 items-center gap-3 rounded-xl px-3 text-sm font-semibold", active ? "bg-white text-brand-navy" : "text-white/75 hover:bg-white/10 hover:text-white")}><Icon className="h-4 w-4" />{item.label}</Link>; })}
          {aiNavItems.length > 0 && <><p className="px-3 pb-2 pt-5 text-[11px] font-semibold uppercase tracking-[.14em] text-white/40">AI Workspace</p>{aiNavItems.map((item) => { const Icon = item.icon; const active = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`); return <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className={cn("mb-1 flex min-h-10 items-center gap-3 rounded-xl px-3 text-sm font-semibold", active ? "bg-white text-brand-navy" : "text-white/75 hover:bg-white/10 hover:text-white")}><Icon className="h-4 w-4" />{item.label}</Link>; })}</>}
        </nav>
        <div className="border-t border-white/10 p-3"><button type="button" onClick={() => void logout()} className="flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-white/75 hover:bg-white/10 hover:text-white"><LogOut className="h-4 w-4" />ออกจากระบบ</button></div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur"><div className="flex min-h-16 items-center justify-end gap-2 px-4 sm:px-6"><div className="flex items-center gap-2"><span className="hidden text-xs text-slate-500 md:inline">{role ?? ""}</span>{isDashboard && <button type="button" aria-label="รีเฟรช Dashboard" onClick={() => window.dispatchEvent(new CustomEvent("dashboard:refresh"))} className="inline-flex h-10 items-center gap-2 rounded-xl border px-3 text-sm font-semibold text-brand-navy"><RefreshCw className="h-4 w-4" />รีเฟรช</button>}<button type="button" aria-label="ค้นหา" onClick={() => navigate("/admin/governance?tab=search")} className="grid h-10 w-10 place-items-center rounded-xl border text-slate-600"><Search className="h-4 w-4" /></button><button type="button" aria-label="การแจ้งเตือน" onClick={() => navigate("/admin/governance?tab=notifications")} className="grid h-10 w-10 place-items-center rounded-xl border text-slate-600"><Bell className="h-4 w-4" /></button><button type="button" onClick={() => void logout()} className="grid h-10 w-10 place-items-center rounded-xl border text-slate-600" aria-label="ออกจากระบบ"><LogOut className="h-4 w-4" /></button></div></div></header>
        <main id="admin-main" className="min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  );
}
