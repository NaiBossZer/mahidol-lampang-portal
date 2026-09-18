import { useCallback, useEffect, useMemo, useState } from "react";
import { Bell, Check, ExternalLink, RefreshCw } from "lucide-react";
import { toast } from "sonner";

type Notification = {
  id: string;
  kind: string;
  title: string;
  body: string;
  link?: string | null;
  is_read: boolean;
  created_at: string;
};

async function getNotifications() {
  const response = await fetch("/api/admin/notifications", {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error || "โหลดการแจ้งเตือนไม่สำเร็จ");
  return (body?.data ?? []) as Notification[];
}

async function markNotificationRead(id: string) {
  const response = await fetch("/api/admin/notifications", {
    method: "PATCH",
    credentials: "include",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error || "อัปเดตสถานะการแจ้งเตือนไม่สำเร็จ");
}

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setNotifications(await getNotifications());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "โหลดการแจ้งเตือนไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.is_read).length,
    [notifications],
  );

  const filtered = useMemo(
    () =>
      notifications.filter((notification) =>
        filter === "all"
          ? true
          : filter === "unread"
            ? !notification.is_read
            : notification.is_read,
      ),
    [filter, notifications],
  );

  async function openNotification(notification: Notification) {
    try {
      if (!notification.is_read) {
        await markNotificationRead(notification.id);
        setNotifications((current) =>
          current.map((item) =>
            item.id === notification.id ? { ...item, is_read: true } : item,
          ),
        );
      }
      if (notification.link) window.location.assign(notification.link);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "เปิดการแจ้งเตือนไม่สำเร็จ");
    }
  }

  async function markAsRead(notification: Notification) {
    if (notification.is_read) return;
    try {
      await markNotificationRead(notification.id);
      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id ? { ...item, is_read: true } : item,
        ),
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ทำเครื่องหมายว่าอ่านแล้วไม่สำเร็จ");
    }
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-[#f8f9ff] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1100px] space-y-5">
        <header className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#002d62] via-[#0c2340] to-[#00152f] text-white shadow-sm">
          <div className="px-5 py-6 sm:px-7 sm:py-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-sky-100">
                  <Bell className="h-3.5 w-3.5" />
                  ADMIN NOTIFICATION CENTER
                </div>
                <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">การแจ้งเตือน</h1>
                <p className="mt-2 text-sm leading-6 text-blue-100">
                  ศูนย์รวมการแจ้งเตือนของบัญชีผู้ดูแลระบบ แยกจากผู้ใช้งานและสิทธิ์การเข้าถึง
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-sky-200">ยังไม่ได้อ่าน</p>
                <p className="mt-1 text-2xl font-black">{unreadCount}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2 overflow-x-auto">
            {[
              ["all", "ทั้งหมด"],
              ["unread", `ยังไม่ได้อ่าน ${unreadCount > 0 ? `(${unreadCount})` : ""}`],
              ["read", "อ่านแล้ว"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value as typeof filter)}
                className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                  filter === value
                    ? "bg-[#002d62] text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            รีเฟรช
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-14 text-center text-sm text-slate-500">กำลังโหลดการแจ้งเตือน...</div>
          ) : filtered.length === 0 ? (
            <div className="p-14 text-center">
              <Bell className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-3 text-sm font-bold text-slate-700">ไม่มีการแจ้งเตือน</p>
              <p className="mt-1 text-xs text-slate-400">เมื่อมีงานหรือเหตุการณ์ที่ต้องติดตาม รายการจะแสดงที่นี่</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex gap-3 p-4 sm:p-5 ${notification.is_read ? "bg-white" : "bg-sky-50/40"}`}
                >
                  <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    notification.is_read ? "bg-slate-100 text-slate-500" : "bg-sky-100 text-sky-700"
                  }`}>
                    <Bell className="h-4 w-4" />
                  </div>
                  <button
                    type="button"
                    onClick={() => void openNotification(notification)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-slate-900">{notification.title}</p>
                      {!notification.is_read && (
                        <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[9px] font-black text-rose-600">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs leading-5 text-slate-600">{notification.body}</p>
                    <p className="mt-2 text-[10px] text-slate-400">
                      {new Date(notification.created_at).toLocaleString("th-TH")}
                    </p>
                  </button>
                  <div className="flex shrink-0 items-start gap-1">
                    {!notification.is_read && (
                      <button
                        type="button"
                        title="ทำเครื่องหมายว่าอ่านแล้ว"
                        aria-label="ทำเครื่องหมายว่าอ่านแล้ว"
                        onClick={() => void markAsRead(notification)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    {notification.link && (
                      <button
                        type="button"
                        title="เปิดรายการที่เกี่ยวข้อง"
                        aria-label="เปิดรายการที่เกี่ยวข้อง"
                        onClick={() => void openNotification(notification)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-sky-50 hover:text-sky-600"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
