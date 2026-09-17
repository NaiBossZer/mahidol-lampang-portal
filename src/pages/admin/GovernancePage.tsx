import { useEffect, useMemo, useState } from "react";
import { Bell, CheckCircle2, RefreshCw, ShieldCheck, UserCog, Users } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useAdminAuth } from "@/components/AdminGuard";

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

const ROLE_OPTIONS = [
  "SUPER_ADMIN",
  "CONTENT_ADMIN",
  "OPERATIONS_ADMIN",
  "FACILITY_ADMIN",
] as const;

export function GovernancePage() {
  const { role } = useAdminAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const tab: Tab = requestedTab === "notifications" ? "notifications" : "users";
  const [users, setUsers] = useState<UserRow[]>([]);
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(false);
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
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "อัปเดตการแจ้งเตือนไม่สำเร็จ");
    }
  }

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read_at).length,
    [notifications],
  );

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-[#f8f9ff] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px] space-y-5">
        <header className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#002d62] via-[#0c2340] to-[#00152f] text-white shadow-sm">
          <div className="px-5 py-6 sm:px-7 sm:py-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-sky-100">
                  <ShieldCheck className="h-3.5 w-3.5 text-sky-300" />
                  AI STUDIO · ADMIN CONTROL
                </div>
                <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                  ผู้ใช้งาน & การแจ้งเตือน
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-blue-100">
                  ศูนย์ควบคุมสิทธิ์ผู้ใช้งานและการแจ้งเตือนภายในระบบ โดยใช้ visual language เดียวกับ AI Studio
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] sm:flex sm:flex-wrap">
                <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <Users className="mr-1 inline h-3.5 w-3.5 text-violet-300" />
                  {users.length} Users
                </span>
                <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <Bell className="mr-1 inline h-3.5 w-3.5 text-sky-300" />
                  {unreadCount} Unread
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-2">
              <div className="grid gap-2 sm:grid-cols-2" role="tablist" aria-label="Admin control functions">
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === "users"}
                  onClick={() => setSearchParams({ tab: "users" })}
                  className={`rounded-xl px-4 py-3 text-left transition ${tab === "users" ? "bg-white text-[#002d62] shadow-sm" : "text-blue-100 hover:bg-white/10"}`}
                >
                  <div className="flex items-center gap-2">
                    <UserCog className="h-4 w-4" />
                    <span className="text-sm font-bold">ผู้ใช้งาน & สิทธิ์การเข้าถึง</span>
                  </div>
                  <p className={`mt-1 text-[10px] ${tab === "users" ? "text-violet-600" : "text-blue-100/70"}`}>
                    Admin users · RBAC · role assignment
                  </p>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === "notifications"}
                  onClick={() => setSearchParams({ tab: "notifications" })}
                  className={`rounded-xl px-4 py-3 text-left transition ${tab === "notifications" ? "bg-white text-[#002d62] shadow-sm" : "text-blue-100 hover:bg-white/10"}`}
                >
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <span className="text-sm font-bold">การแจ้งเตือน</span>
                    {unreadCount > 0 && <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[9px] font-black text-white">{unreadCount}</span>}
                  </div>
                  <p className={`mt-1 text-[10px] ${tab === "notifications" ? "text-violet-600" : "text-blue-100/70"}`}>
                    Alerts · approvals · operational updates
                  </p>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-600">Control Plane</p>
            <p className="mt-1 text-sm font-semibold text-[#002d62]">{tab === "users" ? "จัดการบัญชีผู้ดูแลและสิทธิ์" : "ติดตามและจัดการการแจ้งเตือน"}</p>
          </div>
          <button type="button" onClick={() => void load()} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-[#002d62] hover:bg-slate-50">
            <RefreshCw className="h-3.5 w-3.5" /> รีเฟรช
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-sm text-slate-500">กำลังโหลด...</div>
          ) : tab === "users" ? (
            <div>
              <div className="border-b border-slate-100 bg-slate-50 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-2"><UserCog className="h-4 w-4 text-violet-600" /><h2 className="text-sm font-bold text-[#002d62]">Admin Users / RBAC</h2></div>
                <p className="mt-1 text-xs text-slate-500">กำหนด Role ผ่าน authorization boundary เดิมของระบบ</p>
              </div>
              <div className="divide-y divide-slate-100">
                {users.map((user) => (
                  <div key={user.user_id} className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2"><span className="truncate text-sm font-bold text-slate-900">{user.full_name}</span>{user.active && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">ACTIVE</span>}</div>
                      <p className="mt-1 text-xs text-slate-500">{user.position ?? ""}{user.department ? ` · ${user.department}` : ""}</p>
                    </div>
                    <select disabled={!canManage} value={user.central_role ?? ""} onChange={(event) => void setRole(user.user_id, event.target.value)} className="dashboard-control w-full max-w-sm sm:w-60">
                      <option value="">ยังไม่กำหนด</option>
                      {ROLE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </div>
                ))}
                {!users.length && <div className="p-10 text-center text-sm text-slate-500">ยังไม่มีข้อมูลผู้ใช้งาน</div>}
              </div>
            </div>
          ) : (
            <div>
              <div className="border-b border-slate-100 bg-slate-50 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-2"><Bell className="h-4 w-4 text-sky-600" /><h2 className="text-sm font-bold text-[#002d62]">Notifications</h2></div>
                <p className="mt-1 text-xs text-slate-500">คลิกเพื่อทำเครื่องหมายว่าอ่านแล้ว</p>
              </div>
              <div className="divide-y divide-slate-100">
                {notifications.map((notification) => (
                  <button type="button" key={notification.id} onClick={() => void markRead(notification.id)} className="flex w-full items-start gap-3 px-5 py-4 text-left transition hover:bg-slate-50 sm:px-6">
                    <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${notification.read_at ? "bg-slate-100 text-slate-400" : "bg-violet-50 text-violet-600"}`}><Bell className="h-4 w-4" /></div>
                    <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className={`text-sm font-bold ${notification.read_at ? "text-slate-700" : "text-[#002d62]"}`}>{notification.title}</p>{!notification.read_at && <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[9px] font-bold text-rose-600">NEW</span>}</div><p className="mt-1 text-xs leading-5 text-slate-500">{notification.body ?? ""}</p></div>
                    {notification.read_at && <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />}
                  </button>
                ))}
                {!notifications.length && <div className="p-10 text-center text-sm text-slate-500">ยังไม่มีการแจ้งเตือน</div>}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-[11px] text-slate-500 shadow-sm">
          <span><strong className="text-slate-700">AI Studio Admin Control</strong> · AI proposes · ADMIN verifies · System commits</span>
        </div>
      </div>
    </section>
  );
}
