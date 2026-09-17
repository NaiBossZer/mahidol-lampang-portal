import { useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  Bot,
  ChevronDown,
  ExternalLink,
  FileText,
  FolderOpen,
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
    { to: "/admin/activities", label: "รายการกิจกรรมโครงการ", icon: Activity, permission: "activities.read" },
    { to: "/admin/survey-workflow", label: "สร้างกิจกรรม & AI Survey", icon: Bot, permission: "survey.read", badge: "AI" },
    { to: "/admin/surveys", label: "แบบสอบถามประเมิน", icon: FileText, permission: "survey.read" },
  ],
};

const navItems: readonly NavItem[] = [
  { to: "/admin/cms", label: "คลังเอกสารราชการ", icon: FolderOpen, permission: "cms.read" },
  { to: "/admin/ai", label: "AI Assistant Studio", icon: Bot, permission: "ai.command.read" },
  { to: "/admin/organizations", label: "ผู้ใช้งาน & สิทธิ์การเข้าถึง", icon: Group, permission: "overview.read" },
  { to: "/admin/governance?tab=notifications", label: "การแจ้งเตือน", icon: Bell, permission: "system.read", badge: "3" },
  { to: "/admin/settings", label: "ตั้งค่าระบบ", icon: Settings, permission: "system.read" },
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
  "/admin/ai/improvement": { group: "AI Assistant Studio", title: "AI Model Improvement & Feedback" },
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

export function AdminAppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, permissions } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [surveySubmenuOpen, setSurveySubmenuOpen] = useState(true);

  const hasPermission = (permission: AdminPermission) => role === "SUPER_ADMIN" || permissions.includes(permission);
  const visibleOverview = useMemo(() => hasPermission(overviewItem.permission), [role, permissions]);
  const visibleSurveyItems = useMemo(() => surveyGroup.items.filter((item) => hasPermission(item.permission)), [role, permissions]);
  const visibleNavItems = useMemo(() => navItems.filter((item) => hasPermission(item.permission)), [role, permissions]);

  async function logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST", headers: { Accept: "application/json" } });
    } finally {
      sessionStorage.removeItem("dashboard_auth");
      navigate("/login", { replace: true });
    }
  }

  const currentBreadcrumb = PATH_TITLE_MAP[location.pathname] ?? { group: "ระบบหลังบ้าน", title: "Central Admin" };
  const roleText = (role && ROLE_DISPLAY_MAP[role]) ?? role ?? "Staff";
  const surveyActive = visibleSurveyItems.some((item) => isItemActive(location.pathname, item));

  return (
    <div className={cn("admin-app-shell min-h-screen font-sans text-slate-900", location.pathname === "/dashboard" ? "admin-dashboard-shell" : "admin-modern-shell")}>
      {mobileOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="ปิดเมนูนำทาง"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
          onKeyDown={(event) => { if (event.key === "Escape" || event.key === "Enter") setMobileOpen(false); }}
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
            <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex min-w-0 items-center gap-3 text-left">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0c2340] text-xs font-bold tracking-tighter text-[#0c2340]">MU</span>
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-[14px] font-bold leading-tight tracking-tight text-white">Mahidol Lampang Portal</span>
                <span className="mt-0.5 truncate text-[10px] font-normal leading-tight text-slate-300">ระบบบริหารจัดการและข้อมูลเชิงสถิติ</span>
              </div>
            </Link>
            <button type="button" onClick={() => setMobileOpen(false)} className="p-1 text-slate-400 hover:text-white lg:hidden" aria-label="ปิดเมนู"><X className="h-5 w-5" /></button>
          </div>

          <nav className="max-h-[calc(100vh-140px)] space-y-1 overflow-y-auto p-3 text-[13px]" aria-label="Admin navigation">
            {visibleOverview && (
              <Link to={overviewItem.to} onClick={() => setMobileOpen(false)} className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors", isItemActive(location.pathname, overviewItem) ? "bg-[#163a66] font-medium text-white shadow-xs" : "text-slate-300 hover:bg-white/5 hover:text-white")}>
                <BarChart3 className="h-[19px] w-[19px] shrink-0 text-amber-400" />
                <span className="truncate">{overviewItem.label}</span>
              </Link>
            )}

            {visibleSurveyItems.length > 0 && (
              <div className="space-y-1">
                <button type="button" onClick={() => setSurveySubmenuOpen((open) => !open)} className={cn("flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors", surveyActive ? "bg-[#163a66] font-medium text-white shadow-xs" : "text-slate-300 hover:bg-white/5 hover:text-white")} aria-expanded={surveySubmenuOpen}>
                  <span className="flex min-w-0 items-center gap-3"><Activity className="h-[19px] w-[19px] shrink-0" /><span className="truncate">{surveyGroup.label}</span></span>
                  <ChevronDown className={cn("h-4 w-4 shrink-0 text-slate-400 transition-transform", surveySubmenuOpen && "rotate-180")} />
                </button>
                {surveySubmenuOpen && (
                  <div className="space-y-1 py-1 pl-9 pr-2 text-[12px]">
                    {visibleSurveyItems.map((item) => {
                      const ItemIcon = item.icon;
                      const active = isItemActive(location.pathname, item);
                      return (
                        <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className={cn("flex w-full items-center justify-between rounded px-2 py-1.5 text-left transition-colors", active ? "bg-white/10 font-semibold text-sky-300" : "text-slate-400 hover:bg-white/5 hover:text-white")}>
                          <span className="flex min-w-0 items-center gap-2"><ItemIcon className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{item.label}</span></span>
                          {item.badge && <span className="ml-2 shrink-0 rounded bg-purple-600 px-1 py-0.5 text-[9px] font-bold text-white">{item.badge}</span>}
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
                <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className={cn("flex w-full items-center justify-between rounded-lg px-3 py-2 transition-colors", active ? "bg-[#163a66] font-medium text-white shadow-xs" : "text-slate-300 hover:bg-white/5 hover:text-white")}>
                  <span className="flex min-w-0 items-center gap-3"><ItemIcon className="h-[19px] w-[19px] shrink-0" /><span className="truncate">{item.label}</span></span>
                  {item.badge && <span className="ml-2 shrink-0 rounded bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">{item.badge}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-white/10 p-3">
          <button type="button" onClick={() => navigate("/admin/settings")} className="mb-1 flex w-full items-center justify-between rounded-lg p-2 text-left transition-colors hover:bg-white/5">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/80 ring-1 ring-white/20"><span className="text-xs font-bold">MU</span></div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-[12px] font-medium leading-snug text-white">เจ้าหน้าที่ส่วนกลาง</span>
                <span className="truncate text-[10px] leading-none text-slate-400">{roleText}</span>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
          </button>
          <div className="mt-1 flex items-center gap-1">
            <Link to="/" target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white">
              <ExternalLink className="h-3.5 w-3.5" /> หน้าเว็บ
            </Link>
            <button type="button" onClick={() => void logout()} className="flex items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium text-slate-300 transition-colors hover:bg-rose-500/10 hover:text-rose-300" aria-label="ออกจากระบบ">
              <LogOut className="h-3.5 w-3.5" /> ออกจากระบบ
            </button>
          </div>
        </div>
      </aside>

      <div className="min-h-screen">
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-white/10 bg-[#0c2340] px-4 text-white shadow-xs sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5 text-[12px] text-slate-300">
            <button type="button" onClick={() => setMobileOpen(true)} className="rounded p-1 text-slate-300 transition-colors hover:bg-white/10 hover:text-white lg:hidden" aria-label="เปิดเมนูนำทาง" aria-controls="app-sidebar" aria-expanded={mobileOpen}><Menu className="h-[22px] w-[22px]" /></button>
            <div className="flex min-w-0 items-center gap-1.5 truncate">
              <span className="hidden text-slate-300 sm:inline">{currentBreadcrumb.group}</span>
              <span className="hidden text-[10px] text-slate-500 sm:inline">&gt;</span>
              <span className="truncate font-medium text-white">{currentBreadcrumb.title}</span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2.5 sm:gap-4">
            <button type="button" onClick={() => navigate("/admin/governance?tab=search")} className="hidden rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white md:block" aria-label="ค้นหาระบบ" title="ค้นหาข้อมูลกลาง"><Search className="h-4 w-4" /></button>
            <Link to="/admin/ai" className="hidden items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-slate-200 transition-colors hover:bg-white/10 hover:text-white md:inline-flex"><Sparkles className="h-3.5 w-3.5 text-amber-400" /> AI Assistant</Link>
            <Link to="/admin/governance?tab=notifications" className="relative rounded-full p-1.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white" title="การแจ้งเตือน" aria-label="การแจ้งเตือน">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 animate-pulse rounded-full bg-rose-500 ring-2 ring-[#0c2340]" />
            </Link>
            <button type="button" onClick={() => navigate("/admin/settings")} className="hidden items-center gap-2 rounded-lg p-1 text-left transition-colors hover:bg-white/10 sm:flex" aria-label="โปรไฟล์และการตั้งค่า">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white ring-1 ring-white/30">MU</div>
              <div className="hidden leading-tight lg:block"><div className="text-[12px] font-medium text-white">เจ้าหน้าที่ส่วนกลาง</div><div className="text-[10px] text-slate-400">{roleText}</div></div>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        </header>

        <main id="admin-main" className="min-h-[calc(100vh-3.5rem)]">{children}</main>
      </div>
    </div>
  );
}
