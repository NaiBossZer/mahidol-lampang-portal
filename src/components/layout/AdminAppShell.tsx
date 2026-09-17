import { useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  Bot,
  ChevronDown,
  ClipboardList,
  ExternalLink,
  FileText,
  FolderOpen,
  Group,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldCheck,
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

const navGroups: readonly NavGroup[] = [
  {
    id: "ai-studio",
    label: "AI STUDIO",
    icon: Sparkles,
    items: [
      {
        to: "/admin/ai-studio-workspace",
        label: "AI Studio Workspace",
        icon: Sparkles,
        permission: "ai.command.read",
        badge: "9",
      },
    ],
  },
  {
    id: "activities",
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
        label: "จัดการแบบสอบถาม",
        icon: ClipboardList,
        permission: "survey.read",
      },
      {
        to: "/admin/surveys/analytics",
        label: "ผลการวิเคราะห์ Survey",
        icon: BarChart3,
        permission: "survey.audit.read",
      },
      {
        to: "/admin/activities/occurrences",
        label: "รอบการจัดกิจกรรม",
        icon: ClipboardList,
        permission: "activities.read",
      },
      {
        to: "/admin/activities/photos",
        label: "คลังภาพกิจกรรม",
        icon: FolderOpen,
        permission: "activities.read",
      },
      {
        to: "/admin/activities/relations",
        label: "ความเชื่อมโยงกิจกรรม & ภาคี",
        icon: Group,
        permission: "activities.read",
      },
    ],
  },
  {
    id: "content",
    label: "เนื้อหา",
    icon: FolderOpen,
    items: [
      {
        to: "/admin/cms",
        label: "คลังเอกสารราชการ / CMS",
        icon: FolderOpen,
        permission: "cms.read",
      },
    ],
  },
  {
    id: "facility",
    label: "อาคาร & ความปลอดภัย",
    icon: ShieldCheck,
    items: [
      {
        to: "/admin/facility-safety",
        label: "อาคารและความปลอดภัย",
        icon: ShieldCheck,
        permission: "facility.read",
      },
    ],
  },
  {
    id: "administration",
    label: "กำกับดูแลระบบ",
    icon: Settings,
    items: [
      {
        to: "/admin/governance?tab=notifications",
        label: "การแจ้งเตือน",
        icon: Bell,
        permission: "system.read",
        badge: "3",
      },
      {
        to: "/admin/audit-trail",
        label: "ประวัติการใช้งาน",
        icon: FileText,
        permission: "system.read",
      },
      {
        to: "/admin/governance",
        label: "Governance",
        icon: ShieldCheck,
        permission: "system.read",
      },
      {
        to: "/admin/settings",
        label: "ตั้งค่าระบบ",
        icon: Settings,
        permission: "system.read",
      },
    ],
  },
  {
    id: "reports",
    label: "รายงาน & Analytics",
    icon: BarChart3,
    items: [
      {
        to: "/admin/analytics",
        label: "Analytics",
        icon: BarChart3,
        permission: "overview.read",
      },
    ],
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
  "/admin/facility-safety": { group: "อาคาร & ความปลอดภัย", title: "อาคารและความปลอดภัย" },
  "/admin/ai": { group: "AI Assistant Studio", title: "AI Command Center & Workspace" },
  "/admin/ai-studio-workspace": { group: "AI Studio", title: "AI Studio Unified Workspace" },
  "/admin/ai/improvement": { group: "AI Assistant Studio", title: "AI Model Improvement & Feedback" },
  "/admin/surveys/analytics": { group: "บริหารกิจกรรม & Survey", title: "ผลการวิเคราะห์แบบสอบถาม" },
  "/admin/surveys/response": { group: "บริหารกิจกรรม & Survey", title: "รายละเอียดคำตอบแบบสอบถาม" },
  "/admin/cms": { group: "เนื้อหา", title: "จัดการเนื้อหาเว็บไซต์ (CMS)" },
  "/admin/analytics": { group: "รายงาน & Analytics", title: "รายงานการวิเคราะห์ (Analytics)" },
  "/admin/governance": { group: "กำกับดูแลระบบ", title: "การกำกับดูแลระบบ (Governance)" },
  "/admin/audit-trail": { group: "กำกับดูแลระบบ", title: "ประวัติการใช้งาน (Audit Trail)" },
  "/admin/settings": { group: "กำกับดูแลระบบ", title: "การตั้งค่าระบบ (System Settings)" },
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

export function AdminAppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, permissions } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "ai-studio": true,
    activities: true,
  });

  const hasPermission = (permission: AdminPermission) =>
    role === "SUPER_ADMIN" || permissions.includes(permission);

  const visibleOverview = useMemo(
    () => hasPermission(overviewItem.permission),
    [role, permissions],
  );

  const visibleGroups = useMemo(
    () =>
      navGroups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => hasPermission(item.permission)),
        }))
        .filter((group) => group.items.length > 0),
    [role, permissions],
  );

  function isGroupActive(group: NavGroup) {
    return group.items.some((item) => isItemActive(location.pathname, item));
  }

  function isGroupOpen(group: NavGroup) {
    return Boolean(openGroups[group.id] ?? isGroupActive(group));
  }

  function toggleGroup(groupId: string) {
    setOpenGroups((current) => ({
      ...current,
      [groupId]: !(current[groupId] ?? false),
    }));
  }

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

  const currentBreadcrumb =
    PATH_TITLE_MAP[location.pathname] ?? {
      group: "ระบบหลังบ้าน",
      title: "Central Admin",
    };
  const roleText = (role && ROLE_DISPLAY_MAP[role]) ?? role ?? "Staff";
  const contentOffsetClass =
    location.pathname === "/dashboard" ? "lg:ml-[var(--admin-sidebar-width)]" : "";

  return (
    <div
      className={cn(
        "admin-app-shell min-h-screen font-sans text-slate-900",
        location.pathname === "/dashboard"
          ? "admin-dashboard-shell"
          : "admin-modern-shell",
      )}
    >
      {mobileOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="ปิดเมนูนำทาง"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
          onKeyDown={(event) => {
            if (event.key === "Escape" || event.key === "Enter") {
              setMobileOpen(false);
            }
          }}
        />
      )}

      <aside
        id="app-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen w-[var(--admin-sidebar-width)] shrink-0 flex-col justify-between select-none bg-[#0c2340] text-white shadow-xl transition-transform duration-300 ease-in-out",
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
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

          <nav
            className="max-h-[calc(100vh-140px)] space-y-1 overflow-y-auto p-3 text-[13px]"
            aria-label="Admin navigation"
          >
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

            {visibleGroups.map((group) => {
              const GroupIcon = group.icon;
              const active = isGroupActive(group);
              const open = isGroupOpen(group);
              return (
                <div key={group.id} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors",
                      active
                        ? "bg-[#163a66] font-medium text-white shadow-xs"
                        : "text-slate-300 hover:bg-white/5 hover:text-white",
                    )}
                    aria-expanded={open}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <GroupIcon className="h-[19px] w-[19px] shrink-0" />
                      <span className="truncate">{group.label}</span>
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 shrink-0 text-slate-400 transition-transform",
                        open && "rotate-180",
                      )}
                    />
                  </button>

                  {open && (
                    <div className="space-y-1 py-1 pl-9 pr-2 text-[12px]">
                      {group.items.map((item) => {
                        const ItemIcon = item.icon;
                        const itemActive = isItemActive(location.pathname, item);
                        return (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              "flex w-full items-center justify-between rounded px-2 py-1.5 text-left transition-colors",
                              itemActive
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
              );
            })}
          </nav>
        </div>

        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={() => navigate("/admin/settings")}
            className="mb-1 flex w-full items-center justify-between rounded-lg p-2 text-left transition-colors hover:bg-white/5"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/80 ring-1 ring-white/20">
                <span className="text-xs font-bold">MU</span>
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-[12px] font-medium leading-snug text-white">
                  เจ้าหน้าที่ส่วนกลาง
                </span>
                <span className="truncate text-[10px] leading-none text-slate-400">
                  {roleText}
                </span>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
          </button>
          <div className="flex items-center justify-between px-2 text-[10px] text-slate-500">
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
              ออกจากระบบ
            </button>
            <span className="inline-flex items-center gap-1">
              <ExternalLink className="h-3.5 w-3.5" />
              Public Portal
            </span>
          </div>
        </div>
      </aside>

      <div className={cn("min-h-screen", contentOffsetClass)}>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="เปิดเมนู"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden items-center gap-2 text-xs text-slate-400 md:flex">
              <span>{currentBreadcrumb.group}</span>
              <span>/</span>
              <span className="font-semibold text-slate-700">
                {currentBreadcrumb.title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              aria-label="ค้นหา"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/ai-studio-workspace")}
              className="hidden rounded-lg bg-[#002d62] px-3 py-2 text-xs font-bold text-white sm:inline-flex"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              AI Studio
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/governance?tab=notifications")}
              className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              aria-label="การแจ้งเตือน"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-rose-500" />
            </button>
          </div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
