import { useEffect, useMemo, useState } from "react";
import { CalendarDays, MapPin, Users, ArrowUpRight, Search } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { getActivities } from "@/services/socialEngagementApi";
import { type SocialActivity } from "@/data/socialEngagement";
import { PublicAppShell } from "@/components/layout/PublicAppShell";
import { PublicPageHeader } from "@/components/layout/PublicPageHeader";

const labels: Record<SocialActivity["system"], string> = {
  "smart-farm": "Smart Farm",
  "clean-energy": "Clean Energy",
  shellac: "Shellac Learning Center",
  social: "พันธกิจเพื่อสังคม",
};

export function ActivitiesPage() {
  const [activities, setActivities] = useState<SocialActivity[]>([]);
  const [query, setQuery] = useState("");
  useEffect(() => {
    getActivities().then(setActivities);
  }, []);
  const filtered = useMemo(
    () =>
      activities.filter((item) =>
        `${item.title} ${item.summary} ${item.location}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [activities, query],
  );
  return (
    <PublicAppShell>
      <PublicPageHeader
        title="กิจกรรมพันธกิจเพื่อสังคม"
        subtitle="หลักฐานการดำเนินงานจากพื้นที่จริง โครงการจริง และความร่วมมือจริง"
      />
      <main className="container-content py-8 sm:py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">กิจกรรมล่าสุด {activities.length} รายการ</p>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" aria-hidden="true" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหากิจกรรม..."
              aria-label="ค้นหากิจกรรม"
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[#1677A8] focus:ring-2 focus:ring-[#1677A8]/30"
            />
          </div>
        </div>
        {filtered.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <div
            className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500"
            role="status"
          >
            ไม่พบกิจกรรมที่ตรงกับการค้นหา
          </div>
        )}
      </main>
    </PublicAppShell>
  );
}

export function ActivityCard({ activity }: { activity: SocialActivity }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <img
          src={activity.featuredImage}
          alt={activity.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
          width="640"
          height="416"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-[#123B63] backdrop-blur">
          {labels[activity.system]}
        </span>
      </div>
      <div className="p-5">
        <h2 className="text-lg font-bold leading-snug text-[#123B63]">{activity.title}</h2>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">{activity.summary}</p>
        <div className="mt-4 space-y-2 text-xs text-slate-500">
          <div className="flex gap-2">
            <CalendarDays className="h-4 w-4 shrink-0" />
            {formatDate(activity.activityDate)}
          </div>
          <div className="flex gap-2">
            <MapPin className="h-4 w-4 shrink-0" />
            {activity.location}
          </div>
          {activity.participantCount !== undefined && (
            <div className="flex gap-2">
              <Users className="h-4 w-4 shrink-0" />
              ผู้เข้าร่วม {activity.participantCount.toLocaleString()} คน
            </div>
          )}
        </div>
        <RouterLink
          to={`/activities/${activity.slug}`}
          className="mt-5 inline-flex min-h-11 items-center gap-1 text-sm font-bold text-[#1677A8] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677A8] focus-visible:ring-offset-2"
        >
          ดูหลักฐานกิจกรรม <ArrowUpRight className="h-4 w-4" />
        </RouterLink>
      </div>
    </article>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return <PublicPageHeader title={title} subtitle={subtitle} />;
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(date);
}
