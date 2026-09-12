import { useState, type ReactNode } from "react";
import {
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  CalendarRange,
  ClipboardList,
  FileImage,
  FileText,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Menu,
  Search,
  Settings2,
  ShieldCheck,
  X,
  RefreshCw,
  Bot,
  History,
  ChevronDown,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "../AdminGuard";
import type { AdminPermission } from "@/auth/permissions";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  permission: AdminPermission;
};

type NavGroup = {
  id: string;
  label: string;
  icon: typeof LayoutDashboard;
  items: readonly NavItem[];
};

const operationGroups: readonly NavGroup[] = [
  {
    id: "activities",
    label: "Programs & Activities",
    icon: CalendarRange,
    items: [
      { to: "/admin/activities", label: "กิจกรรม", icon: CalendarRange, permission: "activities.read" },
      { to: "/admin/activities/occurrences", label: "กิจกรรมที่จัดจริง", icon: CalendarRange, permission: "activities.read" },
      { to: "/admin/activities/photos", label: "ภาพกิจกรรม", icon: FileImage, permission: "activities.read" },
      { to: "/admin/activities/relations", label: "ความสัมพันธ์กิจกรรม", icon: Building2, permission: "activities.read" },
    ],
  },
  {
    id: "learning",
    label: "Learning & Content",
    icon: BookOpen,
    items: [
      { to: "/admin/learning-centers", label: "Learning Centers", icon: BookOpen, permission: "learning_centers.read" },
      { to: "/admin/cms", label: "Content / CMS", icon: FileText, permission: "cms.read" },
    ],
  },
  {
    id: "engagement",
    label: "Engagement & Insights",
    icon: BarChart3,
    items: [
      { to: "/admin/surveys", label: "แบบสอบถาม", icon: ClipboardList, permission: "survey.read" },
      { to: "/admin/analytics", label: "Analytics", icon: BarChart3, permission: "overview.read" },
      { to: "/admin/lac-satisfaction", label: "LAC Satisfaction", icon: ClipboardList, permission: "survey.audit.read" },
    ],
  },
  {
    id: "ai",
    label: "AI Workspace",
    icon: Bot,
    items: [
      { to: "/admin/ai", label: "AI Command Center", icon: Bot, permission: "ai.command.read" },
      { to: "/admin/ai/work-queue", label: "AI Work Queue", icon: ListTodo, permission: "ai.queue.read" },
      { to: "/admin/ai/execution", label: "AI Execution", icon: Bot, permission: "ai.execution.read" },
      { to: "/admin/ai/approval", label: "AI Approval", icon: ShieldCheck, permission: "ai.approval.read" },
      { to: "/admin/ai/history", label: "AI History", icon: History, permission: "ai.execution.read" },
    ],
  },
];

const coreGroup: NavGroup = {
  id: "core",
  label: "Administration",
  icon: Settings2,
  items: [
    { to: "/admin/organizations", label: "Organizations", icon: Building2, permission: "overview.read" },
    { to: "/admin/governance", label: "Governance", icon: ShieldCheck, permission: "system.read" },
    { to: "/admin/audit-trail", label: "Audit Trail", icon: ShieldCheck, permission: "system.read" },
    { to: "/admin/settings", label: "System Settings", icon: Settings2, permission: "system.read" },
  ],
};

function isItemActive(pathname: string, item: NavItem) {
  return pathname === item.to || (item.to !== "/dashboard" && pathname.startsWith(`${item.to}/`));
}

function isGroupActive(pathname: string, group: NavGroup) {
  return group.items.some((item) => isItemActive(pathname, item));
}

export function AdminAppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, permissions } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const hasPermission = (permission: AdminPermission) => role === "SUPER_ADMIN" || permissions.includes(permission);

  const visibleGroups = [...operationGroups, coreGroup]
    .map((group) => ({ ...group, items: group.items.filter((item) => hasPermission(item.permission)) }))
    .filter((group) => group.items.length > 0);

  function toggleGroup(id: string) {
    setOpenGroups((current) => ({ ...current, [id]: !(current[id] ?? isGroupActive(location.pathname, visibleGroups.find((group) => group.id === id) ?? coreGroup)) }));
  }

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
          <Link to="/dashboard" onClick={() => setMobileOpen(false)} className={cn("mb-1 flex min-h-10 items-center gap-3 rounded-xl px-3 text-sm font-semibold", isDashboard ? "bg-white text-brand-navy" : "text-white/75 hover:bg-white/10 hover:text-white")}>
            <LayoutDashboard className="h-4 w-4" />Dashboard
          </Link>
          <p className="px-3 pb-2 pt-4 text-[11px] font-semibold uppercase tracking-[.14em] text-white/40">Operations</p>
          {visibleGroups.map((group) => {
            const Icon = group.icon;
            const active = isGroupActive(location.pathname, group);
            const open = openGroups[group.id] ?? active;
            return (
              <div key={group.id} className="mb-1">
                <button type="button" onClick={() => toggleGroup(group.id)} className={cn("flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold", active ? "bg-white/10 text-white" : "text-white/75 hover:bg-white/10 hover:text-white")} aria-expanded={open}>
                  <Icon className="h-4 w-4" />
                  <span className="flex-1">{group.label}</span>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
                </button>
                {open && (
                  <div className="ml-3 mt-1 border-l border-white/10 pl-2">
                    {group.items.map((item) => {
                      const ItemIcon = item.icon;
                      const itemActive = isItemActive(location.pathname, item);
                      return <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className={cn("mb-1 flex min-h-9 items-center gap-3 rounded-lg px-3 text-[13px] font-medium", itemActive ? "bg-white text-brand-navy" : "text-white/65 hover:bg-white/10 hover:text-white")}><ItemIcon className="h-3.5 w-3.5" />{item.label}</Link>;
                    })}
                  </div>
                )}
              </div>
            );
          })}
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
