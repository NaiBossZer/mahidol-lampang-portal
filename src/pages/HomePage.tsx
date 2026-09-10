import { useEffect, useState } from "react";
import { ArrowUpRight, CalendarDays, ExternalLink, MapPin, Users, BarChart3 } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { CORE_SYSTEMS } from "@/config";
import { type SocialActivity } from "@/data/socialEngagement";
import { getActivities } from "@/services/socialEngagementApi";
import { PublicAppShell } from "@/components/layout/PublicAppShell";

const services = [
  "บริการห้องพัก / ห้องประชุม",
  "บริการพื้นที่เรียนรู้และศึกษาดูงาน",
  "บริการพื้นที่ปฏิบัติการ",
  "ผลิตภัณฑ์และองค์ความรู้จากโครงการ",
];

export function HomePage() {
  const [activities, setActivities] = useState<SocialActivity[]>([]);

  useEffect(() => {
    let active = true;
    getActivities().then((items) => {
      if (active) setActivities(items.slice(0, 6));
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <PublicAppShell>
      <section className="relative overflow-hidden bg-[#123B63] text-white">
        <img src="/hero-bg.jpeg" alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-15" width="1920" height="1080" fetchPriority="high" />
        <div aria-hidden="true" className="absolute inset-0 bg-[#123B63]/80" />
        <div className="relative mx-auto grid max-w-[1280px] items-center gap-8 px-4 py-12 sm:px-6 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <span className="inline-flex min-h-8 items-center rounded-full bg-[#D6A84F] px-3.5 py-1 text-xs font-bold tracking-wide text-[#123B63]">MAHIDOL SOCIAL ENGAGEMENT</span>
            <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl lg:text-[52px]">งานพันธกิจเพื่อสังคม<br />จากองค์ความรู้สู่พื้นที่จริง</h1>
            <p className="mt-5 max-w-2xl text-sm font-normal leading-7 text-blue-100 sm:text-base sm:leading-7">แพลตฟอร์มกลางสำหรับกิจกรรม โครงการ ศูนย์ปฏิบัติการ และระบบการเรียนรู้ของคณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล ในพื้นที่สบปราบ ลำปาง</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <RouterLink to="/activities" className="inline-flex min-h-11 items-center rounded-xl bg-[#D6A84F] px-5 py-3 text-sm font-semibold text-[#123B63] transition hover:brightness-95">ดูผลงานและกิจกรรม <ArrowUpRight className="ml-1 h-4 w-4" /></RouterLink>
              <RouterLink to="/centers" className="inline-flex min-h-11 items-center rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold transition hover:bg-white/10">สำรวจพื้นที่ปฏิบัติการ</RouterLink>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[560px] lg:justify-self-end">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/10 shadow-xl backdrop-blur-[2px]">
              <img src="/hero-bg.jpeg" alt="" aria-hidden="true" className="aspect-[16/10] w-full object-cover" width="1120" height="700" />
              <div className="bg-[#123B63]/90 px-5 py-3 sm:px-6 sm:py-3.5">
                <p className="text-xs font-medium leading-5 text-[#D6A84F]">พื้นที่แห่งการเรียนรู้ ภูมิปัญญาท้องถิ่น และการพัฒนาที่ยั่งยืน</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#C66B4F]">CORE SYSTEMS</p>
          <h2 className="mt-2 text-2xl font-black text-[#123B63]">3 ระบบหลักของพื้นที่</h2>
          <p className="mt-1 text-sm text-slate-500">แต่ละระบบมี Learning Experience เป็นส่วนหนึ่งของระบบนั้น</p>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {CORE_SYSTEMS.map((system) => (
            <article key={system.slug} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <img src={system.image} alt={system.title} className="h-52 w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" decoding="async" width="640" height="416" />
              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-[#C66B4F]">CORE SYSTEM</p>
                <h3 className="mt-2 text-2xl font-black text-[#123B63]">{system.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{system.subtitle}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-[#123B63]">Learning Experience</span>
                  <a href={system.href} target={system.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="min-h-11 inline-flex items-center text-sm font-bold text-[#1677A8]">เข้าสู่ระบบ <ExternalLink className="ml-1 inline h-4 w-4" /></a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-[#C66B4F]">ACTIVITY EVIDENCE</p>
              <h2 className="mt-2 text-2xl font-black text-[#123B63]">กิจกรรมล่าสุด</h2>
            </div>
            <RouterLink to="/activities" className="min-h-11 inline-flex items-center text-sm font-bold text-[#1677A8]">ดูทั้งหมด →</RouterLink>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => <ActivityPreview key={activity.id} activity={activity} />)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl bg-[#123B63] p-7 text-white">
            <p className="text-xs font-black uppercase tracking-widest text-[#D6A84F]">SOCIAL IMPACT</p>
            <h2 className="mt-2 text-2xl font-black">จากกิจกรรมสู่รายงานผล</h2>
            <p className="mt-3 text-sm leading-7 text-blue-100">ทุกกิจกรรมสามารถบันทึกวันเวลา พื้นที่ ผู้เข้าร่วม ภาคีเครือข่าย ผลลัพธ์ และหลักฐานภาพถ่าย เพื่อรองรับการสรุปผลระดับผู้บริหารในระยะถัดไป</p>
            <RouterLink to="/activities" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#D6A84F] px-4 py-2.5 text-sm font-black text-[#123B63]">สำรวจ Activity Evidence <BarChart3 className="h-4 w-4" /></RouterLink>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-7">
            <p className="text-xs font-black uppercase tracking-widest text-[#C66B4F]">SERVICES</p>
            <h2 className="mt-2 text-xl font-black text-[#123B63]">บริการของเรา</h2>
            <ul className="mt-4 space-y-3">
              {services.map((service) => <li key={service} className="flex items-center gap-2 text-sm text-slate-600"><span className="h-2 w-2 rounded-full bg-[#D6A84F]" />{service}</li>)}
            </ul>
          </div>
        </div>
      </section>
    </PublicAppShell>
  );
}

function ActivityPreview({ activity }: { activity: SocialActivity }) {
  return (
    <RouterLink to={`/activities/${activity.slug}`} className="group overflow-hidden rounded-3xl border border-slate-200 bg-[#f8f6f0] transition hover:shadow-lg">
      <img src={activity.featuredImage} alt={activity.title} className="h-44 w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" decoding="async" width="640" height="352" />
      <div className="p-5">
        <div className="flex items-center gap-2 text-[11px] font-bold text-[#C66B4F]"><CalendarDays className="h-4 w-4" />{formatDate(activity.activityDate)}</div>
        <h3 className="mt-2 text-lg font-black leading-snug text-[#123B63]">{activity.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{activity.summary}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500"><span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{activity.location}</span>{activity.participantCount !== undefined && <span className="flex items-center gap-1"><Users className="h-4 w-4" />{activity.participantCount}</span>}</div>
      </div>
    </RouterLink>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(date);
}
