import { useEffect, useState } from "react";
import { RefreshCw, Save } from "lucide-react";
import { toast } from "sonner";
export function ActivityRelationsPage() {
  const [activities, setActivities] = useState<any[]>([]),
    [centers, setCenters] = useState<any[]>([]),
    [orgs, setOrgs] = useState<any[]>([]),
    [activityId, setActivityId] = useState(""),
    [centerIds, setCenterIds] = useState<string[]>([]),
    [selectedOrgs, setSelectedOrgs] = useState<string[]>([]),
    [loading, setLoading] = useState(true);
  async function get(url: string) {
    const r = await fetch(url, { credentials: "include", headers: { Accept: "application/json" } });
    const b = await r.json();
    if (!r.ok) throw new Error(b?.error || "โหลดข้อมูลไม่สำเร็จ");
    return b.data;
  }
  async function load() {
    setLoading(true);
    try {
      const [a, c, o] = await Promise.all([
        get("/api/admin/activities"),
        get("/api/admin/learning-centers"),
        get("/api/admin/organizations"),
      ]);
      setActivities(a ?? []);
      setCenters(c ?? []);
      setOrgs(o ?? []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "โหลดไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  useEffect(() => {
    if (!activityId) return;
    void get(`/api/admin/activity-relations?activityId=${encodeURIComponent(activityId)}`)
      .then((x) => {
        setCenterIds(x.learningCenterIds ?? []);
        setSelectedOrgs(
          (x.organizations ?? []).map((v: any) => v.organization_id ?? v.organizationId),
        );
      })
      .catch((e) => toast.error(e instanceof Error ? e.message : "โหลดความสัมพันธ์ไม่สำเร็จ"));
  }, [activityId]);
  async function save() {
    try {
      const r = await fetch(
        `/api/admin/activity-relations?activityId=${encodeURIComponent(activityId)}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({
            learningCenterIds: centerIds,
            organizations: selectedOrgs.map((id) => ({ organizationId: id, organizerRole: "co" })),
          }),
        },
      );
      const b = await r.json();
      if (!r.ok) throw new Error(b?.error || "บันทึกไม่สำเร็จ");
      toast.success("บันทึกความสัมพันธ์แล้ว");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "บันทึกไม่สำเร็จ");
    }
  }
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.14em] text-emerald-700">
            Domain Relations
          </p>
          <h1 className="mt-1 text-2xl font-bold text-brand-navy lg:text-3xl">
            Activity ↔ Learning Center ↔ Organization
          </h1>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border bg-white px-4 text-sm font-semibold"
        >
          <RefreshCw className="h-4 w-4" />
          รีเฟรช
        </button>
      </div>
      {loading ? (
        <div className="mt-6 p-8 text-center text-sm text-slate-500">กำลังโหลด...</div>
      ) : (
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <div className="rounded-2xl border bg-white p-5 shadow-sm lg:col-span-3">
            <select
              value={activityId}
              onChange={(e) => setActivityId(e.target.value)}
              className="dashboard-control w-full"
            >
              <option value="">เลือกกิจกรรม</option>
              {activities.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
            </select>
          </div>
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="font-bold text-brand-navy">Learning Centers</h2>
            <div className="mt-4 space-y-2">
              {centers.map((c) => (
                <label key={c.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={centerIds.includes(c.id)}
                    onChange={(e) =>
                      setCenterIds((x) =>
                        e.target.checked ? [...x, c.id] : x.filter((id) => id !== c.id),
                      )
                    }
                  />
                  {c.name}
                </label>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="font-bold text-brand-navy">Organizations</h2>
            <div className="mt-4 space-y-2">
              {orgs.map((o) => (
                <label key={o.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedOrgs.includes(o.id)}
                    onChange={(e) =>
                      setSelectedOrgs((x) =>
                        e.target.checked ? [...x, o.id] : x.filter((id) => id !== o.id),
                      )
                    }
                  />
                  {o.name}
                </label>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="font-bold text-brand-navy">Save mapping</h2>
            <p className="mt-2 text-sm text-slate-500">
              หนึ่งกิจกรรมเชื่อมหลาย Learning Centers และหลาย Organizations ได้
            </p>
            <button
              type="button"
              disabled={!activityId}
              onClick={() => void save()}
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-navy px-4 text-sm font-bold text-white disabled:opacity-40"
            >
              <Save className="h-4 w-4" />
              บันทึก
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
