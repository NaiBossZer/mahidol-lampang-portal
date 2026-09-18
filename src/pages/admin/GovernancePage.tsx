import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CheckCircle2,
  CircleUserRound,
  Clock3,
  RefreshCw,
  Search,
  Check,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useAdminAuth } from "@/components/AdminGuard";
import { PERMISSION_CATALOG, permissionsForRole, type AdminRole } from "@/auth/permissions";

type Tab = "users" | "notifications";
type UserRow = {
  user_id: string;
  full_name: string;
  position?: string;
  department?: string;
  central_role?: string | null;
  active: boolean;
};

type NotificationRow = {
  id: string;
  title: string;
  body?: string | null;
  created_at?: string;
  read_at?: string | null;
};

const ROLE_OPTIONS = [
  "SUPER_ADMIN",
  "CONTENT_ADMIN",
  "OPERATIONS_ADMIN",
  "FACILITY_ADMIN",
] as const;

const ROLE_META: Record<AdminRole, { label: string; description: string }> = {
  SUPER_ADMIN: { label: "ผู้ดูแลระบบสูงสุด", description: "ควบคุมระบบและสิทธิ์ผู้ดูแลทั้งหมด" },
  CONTENT_ADMIN: { label: "ผู้ดูแลเนื้อหา", description: "จัดการ CMS และเนื้อหาสาธารณะ" },
  OPERATIONS_ADMIN: { label: "ผู้ดูแลปฏิบัติการ", description: "จัดการกิจกรรม ศูนย์การเรียนรู้ และแบบประเมิน" },
  FACILITY_ADMIN: { label: "ผู้ดูแลอาคารและความปลอดภัย", description: "จัดการอาคาร สถานที่ และความปลอดภัย" },
};

const tabs: Array<{
  id: Tab;
  label: string;
  description: string;
  icon: typeof Users;
}> = [
  {
    id: "users",
    label: "ผู้ใช้งาน & สิทธิ์การเข้าถึง",
    description: "Users · RBAC · Access Control",
    icon: Users,
  },
  {
    id: "notifications",
    label: "การแจ้งเตือน",
    description: "Alerts · Approvals · Operational Updates",
    icon: Bell,
  },
];

async function getJson<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error || "Request failed");
  return body.data as T;
}

function StudioModuleTabs({ active, onSelect, unreadCount }: { active: Tab; onSelect: (tab: Tab) => void; unreadCount: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
      <div className="flex gap-2 overflow-x-auto" role="tablist" aria-label="Admin control modules">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onSelect(tab.id)}
              className={`min-w-[240px] flex-1 rounded-xl border px-3 py-3 text-left transition ${
                selected
                  ? "border-sky-200 bg-[#002d62] text-white shadow-sm"
                  : "border-transparent text-slate-600 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate text-xs font-bold">{tab.label}</span>
                {tab.id === "notifications" && unreadCount > 0 && (
                  <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[9px] font-black text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
              <p className={`mt-1 truncate text-[10px] ${selected ? "text-blue-100" : "text-slate-400"}`}>
                {tab.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ControlHeader({ tab, userCount, unreadCount, loading, onRefresh }: { tab: Tab; userCount: number; unreadCount: number; loading: boolean; onRefresh: () => void }) {
  const isUsers = tab === "users";
  return (
    <header className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#002d62] via-[#0c2340] to-[#00152f] text-white shadow-sm">
      <div className="px-5 py-6 sm:px-7 sm:py-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-sky-100">
              <Sparkles className="h-3.5 w-3.5 text-sky-300" />
              AI STUDIO · CONTROL PLANE
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              {isUsers ? "ผู้ใช้งาน & สิทธิ์การเข้าถึง" : "การแจ้งเตือน"}
            </h1>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-blue-100">
              {isUsers
                ? "ศูนย์ควบคุมบัญชีผู้ดูแลระบบ Role และ authorization boundary โดยใช้ interaction model เดียวกับ AI Studio"
                : "ศูนย์ควบคุม Alerts, approvals และ operational updates ด้วย interaction model เดียวกับ AI Studio"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px]">
              <div className="flex items-center gap-1.5 text-sky-100"><ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />Governance</div>
              <p className="mt-1 text-xs font-bold text-white">Protected</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px]">
              <div className="flex items-center gap-1.5 text-sky-100">{isUsers ? <Users className="h-3.5 w-3.5 text-violet-300" /> : <Bell className="h-3.5 w-3.5 text-sky-300" />}{isUsers ? "Users" : "Unread"}</div>
              <p className="mt-1 text-xs font-bold text-white">{isUsers ? userCount : unreadCount}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-sky-200">Admin Control Flow</p>
              <p className="mt-1 text-xs font-semibold text-white">Review → Verify → Apply → Observe</p>
            </div>
            <button
              type="button"
              onClick={onRefresh}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/15 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              รีเฟรชข้อมูล
            </button>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-4">
            {[
              ["01", "Review", "ตรวจสอบรายการ"],
              ["02", "Verify", "ยืนยันขอบเขต"],
              ["03", "Apply", "ดำเนินการผ่านสิทธิ์"],
              ["04", "Observe", "ติดตามสถานะ"],
            ].map(([step, title, subtitle]) => (
              <div key={step} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <div className="flex items-center gap-2"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[9px] font-black text-sky-100">{step}</span><span className="text-[10px] font-bold text-white">{title}</span></div>
                <p className="mt-1 pl-8 text-[9px] text-blue-100/60">{subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

export function GovernancePage() {
  const { role } = useAdminAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const tab: Tab = requestedTab === "notifications" ? "notifications" : "users";
  const [users, setUsers] = useState<UserRow[]>([]);
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | AdminRole | "UNASSIGNED">("ALL");
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [selectedRole, setSelectedRole] = useState<AdminRole | null>(null);
  const [matrixRole, setMatrixRole] = useState<AdminRole>("SUPER_ADMIN");
  const [permissionDomain, setPermissionDomain] = useState("all");
  const canManage = role === "SUPER_ADMIN";

  async function load() {
    setLoading(true);
    try {
      if (tab === "users") setUsers(await getJson<UserRow[]>("/api/admin/users"));
      else setNotifications(await getJson<NotificationRow[]>("/api/admin/notifications"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [tab]);

  async function setRole(userId: string, value: string) {
    if (!canManage) {
      toast.error("เฉพาะ SUPER_ADMIN เท่านั้น");
      return;
    }
    try {
      await getJson("/api/admin/users", {
        method: "PATCH",
        body: JSON.stringify({ userId, role: value }),
      });
      toast.success("ปรับสิทธิ์ผู้ใช้งานแล้ว");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ปรับสิทธิ์ไม่สำเร็จ");
    }
  }

  async function markRead(id: string) {
    try {
      await getJson("/api/admin/notifications", {
        method: "PATCH",
        body: JSON.stringify({ id }),
      });
      toast.success("ทำเครื่องหมายว่าอ่านแล้ว");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "อัปเดตการแจ้งเตือนไม่สำเร็จ");
    }
  }

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read_at).length,
    [notifications],
  );

  const filteredUsers = useMemo(() => {
    const query = userSearch.trim().toLocaleLowerCase();
    return users.filter((user) => {
      const matchesSearch = !query || [user.full_name, user.position, user.department, user.user_id]
        .filter(Boolean)
        .some((value) => String(value).toLocaleLowerCase().includes(query));
      const matchesRole =
        roleFilter === "ALL"
          ? true
          : roleFilter === "UNASSIGNED"
            ? !user.central_role
            : user.central_role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, userSearch, roleFilter]);

  const roleSummary = useMemo(() => {
    const summary = new Map<string, number>();
    users.forEach((user) => {
      const key = user.central_role ?? "UNASSIGNED";
      summary.set(key, (summary.get(key) ?? 0) + 1);
    });
    return Array.from(summary.entries());
  }, [users]);

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-[#f8f9ff] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px] space-y-5">
        <ControlHeader
          tab={tab}
          userCount={users.length}
          unreadCount={unreadCount}
          loading={loading}
          onRefresh={() => void load()}
        />

        <StudioModuleTabs
          active={tab}
          unreadCount={unreadCount}
          onSelect={(nextTab) => setSearchParams({ tab: nextTab })}
        />

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50 px-5 py-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-600">Control Module</p>
                <div className="mt-1 flex items-center gap-2">
                  {tab === "users" ? <CircleUserRound className="h-4 w-4 text-violet-600" /> : <Bell className="h-4 w-4 text-sky-600" />}
                  <h2 className="text-sm font-bold text-[#002d62]">{tab === "users" ? "Admin Users / RBAC" : "Notifications Center"}</h2>
                </div>
                <p className="mt-1 text-[10px] text-slate-500">{tab === "users" ? "Role assignment ผ่าน authorization boundary เดิมของระบบ" : "ติดตาม alerts, approvals และ operational state"}</p>
              </div>
              <div className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${tab === "users" ? "bg-violet-50 text-violet-700" : "bg-sky-50 text-sky-700"}`}>
                {tab === "users" ? `${users.length} users` : `${unreadCount} unread`}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-14 text-center">
              <RefreshCw className="mx-auto h-5 w-5 animate-spin text-violet-500" />
              <p className="mt-3 text-sm text-slate-500">กำลังซิงก์ข้อมูล...</p>
            </div>
          ) : tab === "users" ? (
            <div>
              <div className="grid gap-3 border-b border-slate-100 bg-white p-4 sm:grid-cols-4 sm:p-5">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Total Users</p><p className="mt-2 text-2xl font-bold text-[#002d62]">{users.length}</p><p className="mt-1 text-[10px] text-slate-500">บัญชีในระบบ</p></div>
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-600">Active</p><p className="mt-2 text-2xl font-bold text-emerald-700">{users.filter((user) => user.active).length}</p><p className="mt-1 text-[10px] text-emerald-700/70">พร้อมใช้งาน</p></div>
                <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-violet-600">Roles</p><p className="mt-2 text-2xl font-bold text-violet-700">{roleSummary.length}</p><p className="mt-1 text-[10px] text-violet-700/70">Role ที่ถูกใช้งาน</p></div>
                <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-sky-600">Admin Control</p><p className="mt-2 text-sm font-bold text-sky-700">{canManage ? "SUPER_ADMIN" : "READ ONLY"}</p><p className="mt-1 text-[10px] text-sky-700/70">สิทธิ์การเปลี่ยน Role</p></div>
              </div>

              <div className="border-b border-slate-100 bg-slate-50 p-4 sm:p-5">
                <div className="flex flex-col gap-3 lg:flex-row">
                  <label className="relative flex-1">
                    <span className="sr-only">ค้นหาผู้ใช้งาน</span>
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input value={userSearch} onChange={(event) => setUserSearch(event.target.value)} placeholder="ค้นหาชื่อ ตำแหน่ง หน่วยงาน หรือ User ID" className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-violet-200" />
                  </label>
                  <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value as typeof roleFilter)} className="dashboard-control w-full lg:w-64">
                    <option value="ALL">ทุก Role</option>
                    {ROLE_OPTIONS.map((option) => <option key={option} value={option}>{ROLE_META[option].label}</option>)}
                    <option value="UNASSIGNED">ยังไม่กำหนด Role</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-3 border-b border-slate-100 p-4 sm:grid-cols-2 lg:grid-cols-4 sm:p-5">
                {ROLE_OPTIONS.map((option) => (
                  <button key={option} type="button" onClick={() => setSelectedRole(option)} className="rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-violet-200 hover:bg-violet-50/40">
                    <p className="text-[10px] font-black tracking-[0.08em] text-violet-600">{option}</p>
                    <p className="mt-1 text-xs font-bold text-slate-800">{ROLE_META[option].label}</p>
                    <p className="mt-2 text-[10px] leading-4 text-slate-500">{ROLE_META[option].description}</p>
                  </button>
                ))}
              </div>
              <div className="border-b border-slate-100 px-5 py-3 text-[10px] font-semibold text-slate-500 sm:px-6">แสดง {filteredUsers.length} จาก {users.length} ผู้ใช้งาน</div>
              <div className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <div key={user.user_id} className="flex flex-col gap-4 px-5 py-4 transition hover:bg-slate-50/70 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <button type="button" onClick={() => setSelectedUser(user)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600"><CircleUserRound className="h-5 w-5" /></div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2"><p className="truncate text-sm font-bold text-slate-900">{user.full_name}</p>{user.active && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">ACTIVE</span>}</div>
                        <p className="mt-1 text-xs text-slate-500">{user.position ?? ""}{user.department ? ` · ${user.department}` : ""}</p>
                      </div>
                    </button>
                    <select disabled={!canManage} value={user.central_role ?? ""} onChange={(event) => void setRole(user.user_id, event.target.value)} className="dashboard-control w-full max-w-sm sm:w-60">
                      <option value="">ยังไม่กำหนด</option>
                      {ROLE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </div>
                ))}
                {!filteredUsers.length && <div className="p-10 text-center text-sm text-slate-500">{users.length ? "ไม่พบผู้ใช้งานตามตัวกรอง" : "ยังไม่มีข้อมูลผู้ใช้งาน"}</div>}
              </div>
            </div>
          ) : (
            <div>
              <div className="grid gap-3 border-b border-slate-100 bg-white p-4 sm:grid-cols-3 sm:p-5">
                <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-sky-600">Inbox</p><p className="mt-2 text-2xl font-bold text-sky-700">{notifications.length}</p><p className="mt-1 text-[10px] text-sky-700/70">รายการแจ้งเตือน</p></div>
                <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-rose-600">Attention</p><p className="mt-2 text-2xl font-bold text-rose-700">{unreadCount}</p><p className="mt-1 text-[10px] text-rose-700/70">ยังไม่ได้อ่าน</p></div>
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-600">Read</p><p className="mt-2 text-2xl font-bold text-emerald-700">{notifications.filter((item) => item.read_at).length}</p><p className="mt-1 text-[10px] text-emerald-700/70">ดำเนินการแล้ว</p></div>
              </div>

              <div className="divide-y divide-slate-100">
                {notifications.map((notification) => (
                  <button key={notification.id} type="button" onClick={() => void markRead(notification.id)} className="flex w-full items-start gap-3 px-5 py-4 text-left transition hover:bg-slate-50 sm:px-6">
                    <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${notification.read_at ? "bg-slate-100 text-slate-400" : "bg-sky-50 text-sky-600"}`}>
                      {notification.read_at ? <CheckCircle2 className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className={`text-sm font-bold ${notification.read_at ? "text-slate-700" : "text-[#002d62]"}`}>{notification.title}</p>
                        {!notification.read_at && <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[9px] font-bold text-rose-600">ATTENTION</span>}
                      </div>
                      <p className="mt-1 text-xs leading-5 text-slate-500">{notification.body ?? ""}</p>
                      {notification.created_at && <p className="mt-2 flex items-center gap-1 text-[9px] text-slate-400"><Clock3 className="h-3 w-3" />{new Date(notification.created_at).toLocaleString("th-TH")}</p>}
                    </div>
                    <span className="mt-1 text-[10px] font-bold text-slate-400">{notification.read_at ? "READ" : "OPEN"}</span>
                  </button>
                ))}
                {!notifications.length && <div className="p-10 text-center text-sm text-slate-500">ยังไม่มีการแจ้งเตือน</div>}
              </div>
            </div>
          )}
        </div>

        {selectedUser && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/40 p-4" role="dialog" aria-modal="true">
            <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="flex items-start justify-between border-b border-slate-100 p-5">
                <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-violet-600">User Detail</p><h3 className="mt-1 text-lg font-bold text-[#002d62]">{selectedUser.full_name}</h3><p className="mt-1 text-xs text-slate-500">{selectedUser.position ?? "ไม่ระบุตำแหน่ง"}{selectedUser.department ? " · " + selectedUser.department : ""}</p></div>
                <button type="button" onClick={() => setSelectedUser(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label="ปิด"><X className="h-4 w-4" /></button>
              </div>
              <div className="space-y-4 p-5">
                <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-slate-50 p-3"><p className="text-[9px] font-bold text-slate-400">USER ID</p><p className="mt-1 break-all text-[11px] font-semibold text-slate-700">{selectedUser.user_id}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-[9px] font-bold text-slate-400">STATUS</p><p className="mt-1 text-[11px] font-semibold text-emerald-700">{selectedUser.active ? "พร้อมใช้งาน" : "ปิดใช้งาน"}</p></div></div>
                <div className="rounded-xl border border-violet-100 bg-violet-50/50 p-4"><p className="text-[9px] font-black text-violet-600">CENTRAL ROLE</p><p className="mt-1 text-sm font-bold text-[#002d62]">{selectedUser.central_role ? ROLE_META[selectedUser.central_role as AdminRole].label : "ยังไม่กำหนด Role"}</p></div>
                {selectedUser.central_role && <div><p className="mb-2 text-[10px] font-bold text-slate-500">สิทธิ์ปัจจุบัน</p><div className="max-h-52 space-y-1 overflow-auto rounded-xl border border-slate-200 p-3">{permissionsForRole(selectedUser.central_role as AdminRole).map((item) => <div key={item} className="flex justify-between gap-3 py-1 text-[10px]"><span className="font-semibold text-slate-700">{item}</span><span className="text-right text-slate-400">{PERMISSION_CATALOG.find((d) => d.key === item)?.label}</span></div>)}</div></div>}
              </div>
            </div>
          </div>
        )}
        {tab === "users" && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-slate-50 px-5 py-4 sm:px-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-600">Permission Matrix</p>
              <div className="mt-1 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div><h2 className="text-sm font-bold text-[#002d62]">Role / Permission Matrix</h2><p className="mt-1 text-[10px] text-slate-500">สิทธิ์ตาม Role จาก Canonical Permission Catalog · Read-only governance view</p></div>
                <div className="flex flex-wrap gap-2">
                  {ROLE_OPTIONS.map((option) => <button key={option} type="button" onClick={() => setMatrixRole(option)} className={`rounded-xl px-3 py-2 text-[10px] font-bold transition ${matrixRole === option ? "bg-[#002d62] text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"}`}>{option}</button>)}
                  <select value={permissionDomain} onChange={(event) => setPermissionDomain(event.target.value)} className="dashboard-control"><option value="all">ทุก Domain</option>{Array.from(new Set(PERMISSION_CATALOG.map((item) => item.domain))).map((domain) => <option key={domain} value={domain}>{domain}</option>)}</select>
                </div>
              </div>
            </div>
            <div className="border-b border-slate-100 bg-white px-5 py-3 text-[10px] text-slate-500">Role: <span className="font-bold text-slate-700">{ROLE_META[matrixRole].label}</span> · {permissionsForRole(matrixRole).length} permissions</div>
            <div className="max-h-[520px] overflow-auto">
              <div className="min-w-[720px]">
                {Array.from(new Set(PERMISSION_CATALOG.map((item) => item.domain))).filter((domain) => permissionDomain === "all" || domain === permissionDomain).map((domain) => (
                  <div key={domain} className="border-b border-slate-100 last:border-0">
                    <div className="sticky top-0 z-10 border-b border-slate-100 bg-slate-50 px-5 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">{domain}</div>
                    {PERMISSION_CATALOG.filter((item) => item.domain === domain).map((definition) => {
                      const enabled = permissionsForRole(matrixRole).includes(definition.key);
                      return <div key={definition.key} className="grid grid-cols-[48px_1fr_160px] items-center gap-3 px-5 py-3 hover:bg-slate-50/70"><span className={`flex h-6 w-6 items-center justify-center rounded-full ${enabled ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-300"}`}>{enabled ? <Check className="h-3.5 w-3.5" /> : "—"}</span><div><p className="text-[11px] font-bold text-slate-700">{definition.label}</p><p className="mt-0.5 text-[9px] text-slate-400">{definition.key} · {definition.description}</p></div><span className={`rounded-full px-2 py-1 text-center text-[9px] font-bold ${enabled ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>{enabled ? "Granted" : "Not granted"}</span></div>;
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedRole && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/40 p-4" role="dialog" aria-modal="true">
            <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="flex items-start justify-between border-b border-slate-100 p-5"><div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-violet-600">Role Profile</p><h3 className="mt-1 text-lg font-bold text-[#002d62]">{ROLE_META[selectedRole].label}</h3><p className="mt-1 text-xs text-slate-500">{ROLE_META[selectedRole].description}</p></div><button type="button" onClick={() => setSelectedRole(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label="ปิด"><X className="h-4 w-4" /></button></div>
              <div className="max-h-[60vh] space-y-2 overflow-auto p-5">{permissionsForRole(selectedRole).map((item) => { const d = PERMISSION_CATALOG.find((entry) => entry.key === item); return <div key={item} className="rounded-xl border border-slate-100 bg-slate-50 p-3"><p className="text-[10px] font-bold text-slate-800">{d?.label ?? item}</p><p className="mt-1 text-[9px] text-slate-400">{item} · {d?.description ?? ""}</p></div>; })}</div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-[11px] text-slate-500 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <span><strong className="text-slate-700">AI Studio Control Plane</strong> · ทุก action สำคัญผ่านสิทธิ์และ verification ก่อน commit</span>
          <span className="font-semibold text-[#002d62]">Review · Verify · Apply · Observe</span>
        </div>
      </div>
    </section>
  );
}
