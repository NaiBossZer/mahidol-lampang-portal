import { useEffect, useState } from "react";
import { CalendarDays, MapPin, Users, Target, Workflow, TrendingUp } from "lucide-react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { getActivity } from "@/services/socialEngagementApi";
import type { SocialActivity } from "@/data/socialEngagement";
import { PublicAppShell } from "@/components/layout/PublicAppShell";

export function ActivityDetailPage() {
  const { slug = "" } = useParams();
  const [activity, setActivity] = useState<SocialActivity | null>(null);
  useEffect(() => {
    getActivity(slug).then(setActivity);
  }, [slug]);
  if (!activity)
    return (
      <PublicAppShell>
        <main className="flex min-h-[60vh] items-center justify-center bg-surface-warm px-4 text-slate-500" role="status" aria-live="polite">
          ไม่พบข้อมูลกิจกรรม
        </main>
      </PublicAppShell>
    );
  return (
    <PublicAppShell>
      <div className="bg-surface-warm text-slate-800">
        <section className="bg-brand-navy text-white" aria-labelledby="activity-detail-title">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
            <RouterLink to="/activities" className="inline-flex min-h-11 items-center text-sm font-bold text-northern-gold focus-visible:rounded-lg">
              ← กิจกรรมทั้งหมด
            </RouterLink>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-northern-gold">พันธกิจเพื่อสังคม</p>
            <h1 id="activity-detail-title" className="mt-2 max-w-4xl text-3xl font-black sm:text-5xl">{activity.title}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-blue-100">{activity.summary}</p>
          </div>
        </section>
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <img src={activity.featuredImage} alt={activity.title} className="h-56 w-full rounded-3xl object-cover shadow-lg sm:h-96" width="1200" height="600" loading="eager" />
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Meta icon={CalendarDays} label="วันที่" value={formatDate(activity.activityDate)} />
            <Meta icon={MapPin} label="พื้นที่" value={activity.location} />
            <Meta icon={Users} label="ผู้เข้าร่วม" value={activity.participantCount !== undefined ? `${activity.participantCount.toLocaleString()} คน` : "ไม่ได้ระบุ"} />
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-6">
              {activity.objective && <Section icon={Target} title="วัตถุประสงค์" text={activity.objective} />}
              {activity.process && <Section icon={Workflow} title="กระบวนการดำเนินงาน" text={activity.process} />}
              {activity.outcome && <Section icon={TrendingUp} title="ผลลัพธ์" text={activity.outcome} />}
              {activity.impact && <Section icon={TrendingUp} title="ผลกระทบ / คุณค่าที่เกิดขึ้น" text={activity.impact} />}
            </div>
            <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="activity-evidence-title">
              <p className="text-xs font-bold uppercase tracking-widest text-local-terracotta">ACTIVITY EVIDENCE</p>
              <h2 id="activity-evidence-title" className="mt-2 text-xl font-black text-brand-navy">ข้อมูลกิจกรรม</h2>
              <dl className="mt-5 space-y-4 text-sm">
                <div><dt className="text-xs text-slate-400">ระบบหลัก</dt><dd className="mt-1 font-bold text-brand-navy">{systemLabel(activity.system)}</dd></div>
                {activity.centerName && <div><dt className="text-xs text-slate-400">ศูนย์ / พื้นที่</dt><dd className="mt-1 font-bold">{activity.centerName}</dd></div>}
                {activity.projectTitle && <div><dt className="text-xs text-slate-400">โครงการ</dt><dd className="mt-1 font-bold">{activity.projectTitle}</dd></div>}
              </dl>
            </aside>
          </div>
        </main>
      </div>
    </PublicAppShell>
  );
}

function Meta({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex items-center gap-2 text-xs text-slate-400"><Icon className="h-4 w-4 text-brand-blue" aria-hidden="true" />{label}</div><p className="mt-2 text-sm font-bold text-brand-navy">{value}</p></div>;
}
function Section({ icon: Icon, title, text }: { icon: typeof Target; title: string; text: string }) {
  return <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center gap-2 text-brand-navy"><Icon className="h-5 w-5 text-local-terracotta" aria-hidden="true" /><h2 className="font-black">{title}</h2></div><p className="mt-3 text-sm leading-7 text-slate-600">{text}</p></section>;
}
function systemLabel(system: SocialActivity["system"]) {
  return { "smart-farm": "Smart Farm", "clean-energy": "Clean Energy", shellac: "Shellac Learning Center", social: "พันธกิจเพื่อสังคม" }[system];
}
function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(date);
}
