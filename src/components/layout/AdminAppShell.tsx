import { useMemo, useState, type ReactNode } from "react";
import {
  BarChart3,
  Bell,
  Bot,
  Building2,
  CalendarRange,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  ExternalLink,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  RefreshCw,
  Search,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  User,
  X,
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

const overviewItems: readonly NavItem[] = [
  {
    to: "/dashboard",
    label: "ภาพรวมสถิติ (Dashboard)",
    icon: LayoutDashboard,
    permission: "overview.read",
  },
  {
    to: "/admin",
    label: "จัดการผลผลิต & สโตร์",
    icon: ShoppingBag,
    permission: "store.read",
  },
];

const operationsGroup: NavGroup = {
  id: "operations",
  label: "ภารกิจและการดำเนินงาน",
  icon: CalendarRange,
  items: [
    {
      to: "/admin/activities",
      label: "กิจกรรมชุมชน",
      icon: CalendarRange,
      permission: "activities.read",
    },
    {
      to: "/admin/learning-centers",
      label: "ศูนย์การเรียนรู้",
      icon: GraduationCap,
      permission: "learning_centers.read",
    },
    {
      to: "/admin/facility-safety",
      label: "อาคารและความปลอดภัย",
      icon: ShieldAlert,
      permission: "facility.read",
    },
  ],
};

const aiWorkspaceGroup: NavGroup = {
  id: "ai-workspace",
  label: "AI Workspace",
  icon: Bot,
  items: [
    {
      to: "/admin/ai",
      label: "AI Command Center",
      icon: Bot,
      permission: "ai.command.read",
    },
  ],
};

const insightsGroup: NavGroup = {
  id: "insights",
  label: "การประเมิน & Insights",
  icon: BarChart3,
  items: [
    {
      to: "/admin/surveys",
      label: "แบบสอบถามประเมิน",
      icon: ClipboardList,
      permission: "survey.read",
    },
    {
      to: "/admin/analytics",
      label: "รายงานสถิติ (Analytics)",
      icon: BarChart3,
      permission: "overview.read",
    },
  ],
};

const administrationGroup: NavGroup = {
  id: "core",
  label: "การจัดการระบบ",
  icon: Settings2,
  items: [
    {
      to: "/admin/organizations",
      label: "หน่วยงานและภาคีเครือข่าย",
      icon: Building2,
      permission: "overview.read",
    },
    {
      to: "/admin/cms",
      label: "จัดการเนื้อหา (CMS)",
      icon: FileText,
      permission: "cms.read",
    },
    {
      to: "/admin/governance",
      label: "การกำกับดูแล (Governance)",
      icon: ShieldCheck,
      permission: "system.read",
    },
    {
      to: "/admin/audit-trail",
      label: "ประวัติการใช้งาน (Audit)",
      icon: ShieldCheck,
      permission: "system.read",
    },
    {
      to: "/admin/settings",
      label: "ตั้งค่าระบบกลาง",
      icon: Settings2,
      permission: "system.read",
    },
  ],
};

const ALL_GROUPS: readonly NavGroup[] = [
  operationsGroup,
  aiWorkspaceGroup,
  insightsGroup,
  administrationGroup,
];

const PATH_TITLE_MAP: Record<string, { group: string; title: string }> = {
  "/dashboard": { group: "ภาพรวม", title: "ภาพรวมสถิติ (Executive Dashboard)" },
  "/admin": { group: "ภาพรวม", title: "จัดการผลผลิตและคำสั่งซื้อ" },
  "/admin/activities": { group: "ภารกิจและการดำเนินงาน", title: "จัดการกิจกรรมชุมชน" },
  "/admin/activities/occurrences": { group: "ภารกิจและการดำเนินงาน", title: "รอบการจัดกิจกรรม (Occurrences)" },
  "/admin/activities/photos": { group: "ภารกิจและการดำเนินงาน", title: "คลังภาพกิจกรรม (Media)" },
  "/admin/activities/relations": { group: "ภารกิจและการดำเนินงาน", title: "ความเชื่อมโยงกิจกรรมและภาคี" },
  "/admin/learning-centers": { group: "ภารกิจและการดำเนินงาน", title: "ศูนย์การเรียนรู้ชุมชน" },
  "/admin/facility-safety": { group: "ภารกิจและการดำเนินงาน", title: "อาคารและความปลอดภัย" },
  "/admin/ai": { group: "AI Workspace", title: "AI Command Center & Workspace" },
  "/admin/surveys": { group: "การประเมิน & Insights", title: "แบบสอบถามประเมินผล" },
  "/admin/surveys/analytics": { group: "การประเมิน & Insights", title: "ผลการวิเคราะห์แบบสอบถาม" },
  "/admin/surveys/response": { group: "การประเมิน & Insights", title: "รายละเอียดคำตอบแบบสอบถาม" },
  "/admin/organizations": { group: "การจัดการระบบ", title: "หน่วยงานและภาคีเครือข่าย" },
  "/admin/cms": { group: "การจัดการระบบ", title: "จัดการเนื้อหาเว็บไซต์ (CMS)" },
  "/admin/analytics": { group: "การประเมิน & Insights", title: "รายงานการวิเคราะห์ (Analytics)" },
  "/admin/governance": { group: "การจัดการระบบ", title: "การกำกับดูแลระบบ (Governance)" },
  "/admin/audit-trail": { group: "การจัดการระบบ", title: "ประวัติการใช้งาน (Audit Trail)" },
  "/admin/settings": { group: "การจัดการระบบ", title: "การตั้งค่าระบบ (System Settings)" },
};

const ROLE_DISPLAY_MAP: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  CONTENT_ADMIN: "Content Admin",
  OPERATIONS_ADMIN: "Operations Admin",
  FACILITY_ADMIN: "Facility Admin",
};

function isItemActive(pathname: string, item: NavItem) {
  if (item.to === "/dashboard") return pathname === "/dashboard";
  if (item.to === "/admin") return pathname === "/admin";
  return pathname === item.to || pathname.startsWith(`${item.to}/`);
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

  const hasPermission = (permission: AdminPermission) =>
    role === "SUPER_ADMIN" || permissions.includes(permission);

  const visibleOverviewItems = useMemo(
    () => overviewItems.filter((item) => hasPermission(item.permission)),
    [role, permissions],
  );

  const visibleGroups = useMemo(
    () =>
      ALL_GROUPS.map((group) => ({
        ...group,
        items: group.items.filter((item) => hasPermission(item.permission)),
      })).filter((group) => group.items.length > 0),
    [role, permissions],
  );

  function toggleGroup(id: string) {
    setOpenGroups((current) => ({
      ...current,
      [id]: !(
        current[id] ??
        isGroupActive(
          location.pathname,
          visibleGroups.find((group) => group.id === id) ?? administrationGroup,
        )
      ),
    }));
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
  const currentBreadcrumb = PATH_TITLE_MAP[location.pathname] ?? {
    group: "ระบบหลังบ้าน",
    title: "Central Admin",
  };

  const roleText = (role && ROLE_DISPLAY_MAP[role]) ?? role ?? "Staff";

  return (
    <div
      className={cn(
        "min-h-screen bg-slate-50/70 text-slate-900 font-sans",
        isDashboard && "admin-dashboard-shell",
      )}
    >
      {mobileOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="ปิดเมนูนำทาง"
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={() => setMobileOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape" || e.key === "Enter") setMobileOpen(false);
          }}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-brand-navy text-white shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-18 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-northern-gold ring-1 ring-white/15">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-northern-gold">
                  MAHIDOL LAMPANG
                </span>
              </div>
              <p className="text-sm font-bold tracking-tight text-white">Central Admin</p>
            </div>
          </div>
          <button
            type="button"
            className="grid h-8 w-8 place-items-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white lg:hidden cursor-pointer"
            onClick={() => setMobileOpen(false)}
            aria-label="ปิดเมนู"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-white/8 bg-white/[0.03] px-5 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-white/10 text-white/80">
                <User className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-white/90">เจ้าหน้าที่ส่วนกลาง</p>
                <span className="inline-flex items-center rounded-md bg-white/10 px-1.5 py-0.2 text-[10px] font-medium text-northern-gold">
                  {roleText}
                </span>
              </div>
            </div>
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              title="ดูหน้าเว็บสาธารณะ (เปิดแท็บใหม่)"
              className="inline-flex h-8 items-center gap-1 rounded-lg bg-white/8 px-2.5 text-[11px] font-medium text-white/75 transition hover:bg-white/15 hover:text-white"
            >
              <span>หน้าเว็บ</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-4" aria-label="Admin navigation">
          <div>
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-white/40">
              OVERVIEW
            </p>
            <div className="space-y-1">
              {visibleOverviewItems.map((item) => {
                const Icon = item.icon;
                const active = isItemActive(location.pathname, item);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex min-h-10 items-center gap-3 rounded-xl px-3 text-xs font-semibold transition-all duration-150",
                      active
                        ? "bg-white text-brand-navy shadow-xs font-bold"
                        : "text-white/80 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <Icon className={cn("h-4 w-4", active ? "text-brand-blue" : "text-white/70")} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {visibleGroups.map((group) => {
            const GroupIcon = group.icon;
            const active = isGroupActive(location.pathname, group);
            const open = openGroups[group.id] ?? active;
            return (
              <div key={group.id}>
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  className={cn(
                    "flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-xs font-semibold transition-all cursor-pointer",
                    active
                      ? "bg-white/10 text-white font-bold"
                      : "text-white/75 hover:bg-white/8 hover:text-white",
                  )}
                  aria-expanded={open}
                >
                  <GroupIcon className="h-4 w-4 text-white/70" />
                  <span className="flex-1 truncate">{group.label}</span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-white/50 transition-transform duration-200",
                      open && "rotate-180",
                    )}
                  />
                </button>

                {open && (
                  <div className="ml-3.5 mt-1 border-l border-white/15 pl-2.5 space-y-1">
                    {group.items.map((item) => {
                      const ItemIcon = item.icon;
                      const itemActive = isItemActive(location.pathname, item);
                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "flex min-h-9 items-center gap-2.5 rounded-lg px-2.5 text-xs font-medium transition-all",
                            itemActive
                              ? "bg-white text-brand-navy font-bold shadow-2xs"
                              : "text-white/70 hover:bg-white/10 hover:text-white",
                          )}
                        >
                          <ItemIcon
                            className={cn(
                              "h-3.5 w-3.5 shrink-0",
                              itemActive ? "text-brand-blue" : "text-white/60",
                            )}
                          />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3.5">
          <button
            type="button"
            onClick={() => void logout()}
            className="flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-white/5 px-3 text-xs font-semibold text-white/80 hover:bg-white/15 hover:text-white transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="เปิดเมนูนำทาง"
                className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 lg:hidden cursor-pointer"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-slate-400 hidden sm:inline">
                  {currentBreadcrumb.group}
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-300 hidden sm:inline" />
                <span className="font-bold text-brand-navy truncate max-w-[220px] sm:max-w-none">
                  {currentBreadcrumb.title}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isDashboard && (
                <button
                  type="button"
                  aria-label="รีเฟรช Dashboard"
                  onClick={() => window.dispatchEvent(new CustomEvent("dashboard:refresh"))}
                  className="hidden sm:inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-brand-navy shadow-2xs hover:bg-slate-50 transition cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-brand-blue" />
                  <span>รีเฟรช</span>
                </button>
              )}

              <button
                type="button"
                aria-label="ค้นหาระบบ"
                title="ค้นหาข้อมูลกลาง"
                onClick={() => navigate("/admin/governance?tab=search")}
                className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-2xs hover:bg-slate-50 hover:text-brand-navy transition cursor-pointer"
              >
                <Search className="h-4 w-4" />
              </button>

              <button
                type="button"
                aria-label="การแจ้งเตือนระบบ"
                title="การแจ้งเตือน"
                onClick={() => navigate("/admin/governance?tab=notifications")}
                className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-2xs hover:bg-slate-50 hover:text-brand-navy transition cursor-pointer relative"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-brand-blue" />
              </button>

              <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

              <div className="hidden sm:flex items-center gap-2">
                <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                  {roleText}
                </span>
              </div>

              <button
                type="button"
                onClick={() => void logout()}
                className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-2xs hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 transition cursor-pointer"
                aria-label="ออกจากระบบ"
                title="ออกจากระบบ"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <main id="admin-main" className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
