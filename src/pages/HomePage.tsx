import { useEffect, useState } from "react";
import { ArrowUpRight, CalendarDays, ExternalLink, MapPin, Users, BarChart3 } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { SYSTEMS, type SocialActivity } from "@/data/socialEngagement";
import { getActivities } from "@/services/socialEngagementApi";

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
    getActivities().then((items) => { if (active) setActivities(items.slice(0, 6)); });
    return () => { active = false; };
  }, []);
  return (
    <div className="min-h-screen bg-[#f8f6f0] text-slate-800">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0e2b42]/95 text-white backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <RouterLink to="/" className="flex items-center gap-3">
            <img src="/mahidol-logo.png" alt="Mahidol University" className="h-10 rounded bg-white p-1" width="40" height="40" fetchPriority="high" />
            <div className="hidden sm:block"><p className="text-sm font-black">งานพันธกิจเพื่อสังคม</p><p className="text-[11px] text-[#D6A84F]">คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล</p></div>
          </RouterLink>
          <nav className="flex items-center gap-2 text-xs font-bold"><RouterLink to="/activities" className="rounded-full px-3 py-2 hover:bg-white/10">กิจกรรม</RouterLink><RouterLink to="/projects" className="rounded-full px-3 py-2 hover:bg-white/10">โครงการ</RouterLink><RouterLink to="/centers" className="rounded-full px-3 py-2 hover:bg-white/10">ศูนย์ / พื้นที่</RouterLink></nav>
        </div>
      </header>
      <section className="relative overflow-hidden bg-[#123B63] text-white">
        <div className="absolute inset-0 opacity-30"><img src="/main banner.jpg" alt="" className="h-full w-full object-cover" width="1920" height="900" fetchPriority="high" /></div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"><div className="max-w-3xl"><span className="rounded-full bg-[#D6A84F] px-3 py-1 text-xs font-black text-[#123B63]">MAHIDOL SOCIAL ENGAGEMENT</span><h1 className="mt-5 text-4xl font-black leading-tight sm:text-6xl">งานพันธกิจเพื่อสังคม<br />จากองค์ความรู้สู่พื้นที่จริง</h1><p className="mt-5 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">แพลตฟอร์มกลางสำหรับกิจกรรม โครงการ ศูนย์ปฏิบัติการ และระบบการเรียนรู้ของคณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล ในพื้นที่สบปราบ ลำปาง</p><div className="mt-7 flex flex-wrap gap-3"><RouterLink to="/activities" className="rounded-xl bg-[#D6A84F] px-5 py-3 text-sm font-black text-[#123B63]">ดูผลงานและกิจกรรม <ArrowUpRight className="ml-1 inline h-4 w-4" /></RouterLink><RouterLink to="/centers" className="rounded-xl border border-white/30 px-5 py-3 text-sm font-bold hover:bg-white/10">สำรวจพื้นที่ปฏิบัติการ</RouterLink></div></div></div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><div className="flex items-end justify-between"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#C66B4F]">CORE SYSTEMS</p><h2 className="mt-2 text-2xl font-black text-[#123B63]">3 ระบบหลักของพื้นที่</h2><p className="mt-1 text-sm text-slate-500">แต่ละระบบมี Learning Experience เป็นส่วนหนึ่งของระบบนั้น</p></div></div><div className="mt-6 grid gap-6 md:grid-cols-3">{SYSTEMS.map((system) => <article key={system.slug} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><img src={system.image} alt={system.title} className="h-52 w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" decoding="async" width="640" height="416" /><div className="p-6"><p className="text-xs font-bold uppercase tracking-widest text-[#C66B4F]">CORE SYSTEM</p><h3 className="mt-2 text-2xl font-black text-[#123B63]">{system.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{system.subtitle}</p><div className="mt-5 flex items-center justify-between"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-[#123B63]">Learning Experience</span><a href={system.href} target={system.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="text-sm font-bold text-[#1677A8]">เข้าสู่ระบบ <ExternalLink className="inline h-4 w-4" /></a></div></div></article>)}</div></section>
      <section className="bg-white py-12"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="flex items-end justify-between"><div><p className="text-xs font-black uppercase tracking-widest text-[#C66B4F]">ACTIVITY EVIDENCE</p><h2 className="mt-2 text-2xl font-black text-[#123B63]">กิจกรรมล่าสุด</h2></div><RouterLink to="/activities" className="text-sm font-bold text-[#1677A8]">ดูทั้งหมด →</RouterLink></div><div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{activities.map((activity) => <ActivityPreview key={activity.id} activity={activity} />)}</div></div></section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"><div className="rounded-3xl bg-[#123B63] p-7 text-white"><p className="text-xs font-black uppercase tracking-widest text-[#D6A84F]">SOCIAL IMPACT</p><h2 className="mt-2 text-2xl font-black">จากกิจกรรมสู่รายงานผล</h2><p className="mt-3 text-sm leading-7 text-blue-100">ทุกกิจกรรมสามารถบันทึกวันเวลา พื้นที่ ผู้เข้าร่วม ภาคีเครือข่าย ผลลัพธ์ และหลักฐานภาพถ่าย เพื่อรองรับการสรุปผลระดับผู้บริหารในระยะถัดไป</p><RouterLink to="/activities" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#D6A84F] px-4 py-2.5 text-sm font-black text-[#123B63]">สำรวจ Activity Evidence <BarChart3 className="h-4 w-4" /></RouterLink></div><div className="rounded-3xl border border-slate-200 bg-white p-7"><p className="text-xs font-black uppercase tracking-widest text-[#C66B4F]">SERVICES</p><h2 className="mt-2 text-xl font-black text-[#123B63]">บริการของเรา</h2><ul className="mt-4 space-y-3">{services.map((service) => <li key={service} className="flex items-center gap-2 text-sm text-slate-600"><span className="h-2 w-2 rounded-full bg-[#D6A84F]" />{service}</li>)}</ul></div></div></section>
      <footer className="bg-[#0e2b42] py-8 text-white"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><p className="text-sm font-bold">งานพันธกิจเพื่อสังคม คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล</p><p className="mt-2 flex items-center gap-2 text-xs text-slate-300"><MapPin className="h-4 w-4" />พื้นที่ปฏิบัติการสบปราบ จังหวัดลำปาง</p><p className="mt-4 text-[11px] text-slate-400">© 2026 Mahidol Social Engagement Platform</p></div></footer>
    </div>
  );
}
function ActivityPreview({ activity }: { activity: SocialActivity }) { return <RouterLink to={`/activities/${activity.slug}`} className="group overflow-hidden rounded-3xl border border-slate-200 bg-[#f8f6f0] transition hover:shadow-lg"><img src={activity.featuredImage} alt={activity.title} className="h-44 w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" decoding="async" width="640" height="352" /><div className="p-5"><div className="flex items-center gap-2 text-[11px] font-bold text-[#C66B4F]"><CalendarDays className="h-4 w-4" />{formatDate(activity.activityDate)}</div><h3 className="mt-2 text-lg font-black leading-snug text-[#123B63]">{activity.title}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{activity.summary}</p><div className="mt-4 flex items-center justify-between text-xs text-slate-500"><span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{activity.location}</span>{activity.participantCount !== undefined && <span className="flex items-center gap-1"><Users className="h-4 w-4" />{activity.participantCount}</span>}</div></div></RouterLink>; }
function formatDate(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(date); }
