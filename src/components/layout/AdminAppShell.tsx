import { useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  Bot,
  ChevronDown,
  ExternalLink,
  FileText,
  FolderShared,
  Group,
  LogOut,
  Menu,
  Search,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "../AdminGuard";
import type { AdminPermission } from "@/auth/permissions";

type NavItem = {
  to: string;
  label: string;
  icon: typeof Activity;
  permission: AdminPermission;
  badge?: string;
};

type NavGroup = {
  id: string;
  label: string;
  icon: typeof Activity;
  items: readonly NavItem[];
};

const overviewItem: NavItem = {
  to: "/dashboard",
  label: "รายงานผลสัมฤทธิ์ & สถิติ",
  icon: BarChart3,
  permission: "overview.read",
};

const surveyGroup: NavGroup = {
  id: "surveys",
  label: "บริหารกิจกรรม & Survey",
  icon: Activity,
  items: [
    {
      to: "/admin/activities",
      label: "รายการกิจกรรมโครงการ",
      icon: Activity,
      permission: "activities.read",
    },
    {
      to: "/admin/survey-workflow",
      label: "สร้างกิจกรรม & AI Survey",
      icon: Bot,
      permission: "survey.read",
      badge: "AI",
    },
    {
      to: "/admin/surveys",
      label: "แบบสอบถามประเมิน",
      icon: FileText,
      permission: "survey.read",
    },
  ],
};

const navItems: readonly NavItem[] = [
  {
    to: "/admin/cms",
    label: "คลังเอกสารราชการ",
    icon: FolderShared,
    permission: "cms.read",
  },
  {
    to: "/admin/ai",
    label: "AI Assistant Studio",
    icon: Bot,
    permission: "ai.command.read",
  },
  {
    to: "/admin/organizations",
    label: "ผู้ใช้งาน & สิทธิ์การเข้าถึง",
    icon: Group,
    permission: "overview.read",
  },
  {
    to: "/admin/governance?tab=notifications",
    label: "การแจ้งเตือน",
    icon: Bell,
    permission: "system.read",
    badge: "3",
  },
  {
    to: "/admin/settings",
    label: "ตั้งค่าระบบ",
    icon: Settings,
    permission: "system.read",
  },
];

const PATH_TITLE_MAP: Record<string, { group: string; title: string }> = {
  "/dashboard": { group: "รายงานผลสัมฤทธิ์ & สถิติ", title: "ภาพรวมสถิติ (Executive Dashboard)" },
  "/admin": { group: "ระบบหลังบ้าน", title: "จัดการผลผลิตและคำสั่งซื้อ" },
  "/admin/activities": { group: "บริหารกิจกรรม & Survey", title: "รายการกิจกรรมโครงการ" },
  "/admin/survey-workflow": { group: "บริหารกิจกรรม & Survey", title: "สร้างกิจกรรม & AI Survey" },
  "/admin/surveys": { group: "บริหารกิจกรรม & Survey", title: "แบบสอบถามประเมิน" },
  "/admin/activities/occurrences": { group: "บริหารกิจกรรม & Survey", title: "รอบการจัดกิจกรรม (Occurrences)" },
  "/admin/activities/photos": { group: "บริหารกิจกรรม & Survey", title: "คลังภาพกิจกรรม (Media)" },
  "/admin/activities/relations": { group: "บริหารกิจกรรม & Survey", title: "ความเชื่อมโยงกิจกรรมและภาคี" },
  "/admin/facility-safety": { group: "ระบบหลังบ้าน", title: "อาคารและความปลอดภัย" },
  "/admin/learning-centers": { group: "ระบบหลังบ้าน", title: "ศูนย์การเรียนรู้ชุมชน" },
  "/admin/ai": { group: "AI Assistant Studio", title: "AI Command Center & Workspace" },
  "/admin/surveys/analytics": { group: "บริหารกิจกรรม & Survey", title: "ผลการวิเคราะห์แบบสอบถาม" },
  "/admin/surveys/response": { group: "บริหารกิจกรรม & Survey", title: "รายละเอียดคำตอบแบบสอบถาม" },
  "/admin/cms": { group: "คลังเอกสารราชการ", title: "จัดการเนื้อหาเว็บไซต์ (CMS)" },
  "/admin/analytics": { group: "รายงานผลสัมฤทธิ์ & สถิติ", title: "รายงานการวิเคราะห์ (Analytics)" },
  "/admin/organizations": { group: "ผู้ใช้งาน & สิทธิ์การเข้าถึง", title: "หน่วยงานและภาคีเครือข่าย" },
  "/admin/governance": { group: "ระบบหลังบ้าน", title: "การกำกับดูแลระบบ (Governance)" },
  "/admin/audit-trail": { group: "ระบบหลังบ้าน", title: "ประวัติการใช้งาน (Audit Trail)" },
  "/admin/settings": { group: "ตั้งค่าระบบ", title: "การตั้งค่าระบบ (System Settings)" },
};

const ROLE_DISPLAY_MAP: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  CONTENT_ADMIN: "Content Admin",
  OPERATIONS_ADMIN: "Operations Admin",
  FACILITY_ADMIN: "Facility Admin",
};

function isItemActive(pathname: string, item: NavItem) {
  const basePath = item.to.split("?")[0];
  if (basePath === "/dashboard") return pathname === "/dashboard";
  if (basePath === "/admin") return pathname === "/admin";
  return pathname === basePath || pathname.startsWith(`${basePath}/`);
}

function isGroupActive(pathname: string, group: NavGroup) {
  return group.items.some((item) => isItemActive(pathname, item));
}

export function AdminAppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, permissions } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [surveySubmenuOpen, setSurveySubmenuOpen] = useState(true);

  const hasPermission = (permission: AdminPermission) =>
    role === "SUPER_ADMIN" || permissions.includes(permission);

  const visibleOverview = useMemo(
    () => hasPermission(overviewItem.permission),
    [role, permissions],
  );

  const visibleSurveyItems = useMemo(
    () => surveyGroup.items.filter((item) => hasPermission(item.permission)),
    [role, permissions],
  );

  const visibleNavItems = useMemo(
    () => navItems.filter((item) => hasPermission(item.permission)),
    [role, permissions],
  );

  async function logout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { Accept: "application/json" },
      });
    } finally {
      sessionStorage.removeItem("dashboard_auth");
      navigate("/login", { replace: true });
    }
  }

  const currentBreadcrumb = PATH_TITLE_MAP[location.pathname] ?? {
    group: "ระบบหลังบ้าน",
    title: "Central Admin",
  };
  const roleText = (role && ROLE_DISPLAY_MAP[role]) ?? role ?? "Staff";
  const surveyActive = visibleSurveyItems.some((item) => isItemActive(location.pathname, item));

  return (
    <div className="min-h-screen bg-slate-50/70 font-sans text-slate-900">
      {mobileOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="ปิดเมนูนำทาง"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
          onKeyDown={(event) => {
            if (event.key === "Escape" || event.key === "Enter") setMobileOpen(false);
          }}
        />
      )}

      <aside
        id="app-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen w-[245px] shrink-0 flex-col justify-between select-none bg-[#0c2340] text-white shadow-xl transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex min-h-0 flex-col">
          <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
            <Link
              to="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="flex min-w-0 items-center gap-3 text-left"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0c2340] text-xs font-bold tracking-tighter text-[#0c2340]">
                  MU
                </span>
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-[14px] font-bold leading-tight tracking-tight text-white">
                  Mahidol Lampang Portal
                </span>
                <span className="mt-0.5 truncate text-[10px] font-normal leading-tight text-slate-300">
                  ระบบบริหารจัดการและข้อมูลเชิงสถิติ
                </span>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="p-1 text-slate-400 hover:text-white lg:hidden"
              aria-label="ปิดเมนู"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="max-h-[calc(100vh-140px)] space-y-1 overflow-y-auto p-3 text-[13px]" aria-label="Admin navigation">
            {visibleOverview && (
              <Link
                to={overviewItem.to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                  isItemActive(location.pathname, overviewItem)
                    ? "bg-[#163a66] font-medium text-white shadow-xs"
                    : "text-slate-300 hover:bg-white/5 hover:text-white",
                )}
              >
                <BarChart3 className="h-[19px] w-[19px] shrink-0 text-amber-400" />
                <span className="truncate">{overviewItem.label}</span>
              </Link>
            )}

            {visibleSurveyItems.length > 0 && (
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setSurveySubmenuOpen((open) => !open)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors",
                    surveyActive
                      ? "bg-[#163a66] font-medium text-white shadow-xs"
                      : "text-slate-300 hover:bg-white/5 hover:text-white",
                  )}
                  aria-expanded={surveySubmenuOpen}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <Activity className="h-[19px] w-[19px] shrink-0" />
                    <span className="truncate">{surveyGroup.label}</span>
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-slate-400 transition-transform",
                      surveySubmenuOpen && "rotate-180",
                    )}
                  />
                </button>

                {surveySubmenuOpen && (
                  <div className="space-y-1 py-1 pl-9 pr-2 text-[12px]">
                    {visibleSurveyItems.map((item) => {
                      const ItemIcon = item.icon;
                      const active = isItemActive(location.pathname, item);
                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "flex w-full items-center justify-between rounded px-2 py-1.5 text-left transition-colors",
                            active
                              ? "bg-white/10 font-semibold text-sky-300"
                              : "text-slate-400 hover:bg-white/5 hover:text-white",
                          )}
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <ItemIcon className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{item.label}</span>
                          </span>
                          {item.badge && (
                            <span className="ml-2 shrink-0 rounded bg-purple-600 px-1 py-0.5 text-[9px] font-bold text-white">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {visibleNavItems.map((item) => {
              const ItemIcon = item.icon;
              const active = isItemActive(location.pathname, item);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 transition-colors",
                    active
                      ? "bg-[#163a66] font-medium text-white shadow-xs"
                      : "text-slate-300 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <ItemIcon className="h-[19px] w-[19px] shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {item.badge && (
                    <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-white/10 p-3">
          <div className="mb-1 flex items-center justify-between px-2">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-white/80 ring-1 ring-white/20">
                <span className="text-xs font-bold">MU</span>
              </div>
              <div className="flex min-w-0 flex-col text-left">
                <span className="truncate text-[12px] font-medium leading-snug text-white">
                  เจ้าหน้าที่ส่วนกลาง
                </span>
                <span className="truncate text-[10px] leading-none text-slate-400">{roleText}</span>
              </div>
            </div>
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          </div>

          <div className="mt-2 grid grid-cols-2 gap-1">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 rounded-lg px-2 py-2 text-[11px] font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              หน้าเว็บ
            </Link>
            <button
              type="button"
              onClick={() => void logout()}
              className="flex items-center justify-center gap-1 rounded-lg px-2 py-2 text-[11px] font-medium text-slate-300 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
            >
              <LogOut className="h-3.5 w-3.5" />
              ออกจากระบบ
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-[245px]">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                aria-label="เปิดเมนูนำทาง"
                className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 lg:hidden"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex min-w-0 items-center gap-2 text-xs">
                <span className="hidden font-semibold text-slate-400 sm:inline">{currentBreadcrumb.group}</span>
                <span className="hidden text-slate-300 sm:inline">/</span>
                <span className="truncate font-bold text-[#0c2340]">{currentBreadcrumb.title}</span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                aria-label="ค้นหาระบบ"
                title="ค้นหาข้อมูลกลาง"
                onClick={() => navigate("/admin/governance?tab=search")}
                className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-2xs transition hover:bg-slate-50 hover:text-[#0c2340]"
              >
                <Search className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="การแจ้งเตือนระบบ"
                title="การแจ้งเตือน"
                onClick={() => navigate("/admin/governance?tab=notifications")}
                className="relative grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-2xs transition hover:bg-slate-50 hover:text-[#0c2340]"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
              </button>
              <div className="hidden h-5 w-px bg-slate-200 sm:block" />
              <span className="hidden rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 sm:inline-flex">
                {roleText}
              </span>
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
