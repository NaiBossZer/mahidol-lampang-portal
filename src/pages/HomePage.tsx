import { useEffect, useState } from "react";
import { ArrowUpRight, BatteryCharging, Leaf, TestTube2 } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { PublicAppShell } from "../components/layout/PublicAppShell";
import { getActivities } from "../services/socialEngagementApi";
import type { SocialActivity } from "../data/socialEngagement";

function activityCategory(activity: SocialActivity) {
  if (activity.system === "shellac") return "SHELLAC";
  if (activity.system === "smart-farm") return "SMART FARM";
  if (activity.system === "clean-energy") return "CLEAN ENERGY";
  return "SOCIAL ENGAGEMENT";
}

function formatActivityDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function ActivityPreview({ activity }: { activity: SocialActivity }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <RouterLink to={`/activities/${activity.slug}`} className="block h-full">
        <div className="aspect-[4/3] overflow-hidden bg-slate-100">
          <img src={activity.featuredImage} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" loading="lazy" decoding="async" />
        </div>
        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium">
            <span className="rounded-full bg-[#F7E9E3] px-2.5 py-1 text-[#C66B4F]">{activityCategory(activity)}</span>
            {activity.centerName && <span className="text-slate-400">{activity.centerName}</span>}
          </div>
          <h3 className="mt-3 line-clamp-2 text-lg font-semibold leading-7 text-[#123B63]">{activity.title}</h3>
          <p className="mt-2 text-xs font-medium text-slate-400">{formatActivityDate(activity.activityDate)}</p>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">{activity.summary}</p>
          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-[#1677A8]"><span>อ่านรายละเอียด</span><ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></div>
        </div>
      </RouterLink>
    </article>
  );
}

const learningCenters = [
  { title: "ศูนย์วิจัยและพัฒนาต้นน้ำ", description: "พัฒนางานวิจัยและนวัตกรรมบนฐานของพื้นที่ เพื่อเป็นชุดความรู้ให้กับชุมชนและสร้างความยั่งยืนในระบบนิเวศ", action: "รายละเอียดศูนย์วิจัย", to: "/activities", icon: TestTube2, iconClass: "bg-[#FBECE7] text-[#C66B4F]", actionClass: "text-[#C66B4F]" },
  { title: "สมาร์ทฟาร์มอัจฉริยะ", description: "แปลงเรียนรู้เกษตรอัจฉริยะและระบบการจัดการน้ำ พัฒนาการผลิตที่ดีขึ้นและมีประสิทธิภาพสูง", action: "เยี่ยมชมระบบฟาร์ม", to: "/smart-farm", icon: Leaf, iconClass: "bg-[#EAF3E9] text-[#5A9A55]", actionClass: "text-[#5A9A55]" },
  { title: "สถานีพลังงานทดแทน", description: "วิจัยและพัฒนาระบบพลังงานสะอาดเพื่ออนาคตที่ยั่งยืน เช่น โซลาร์เซลล์และพลังงานชีวมวล", action: "ตรวจสอบสถานีพลังงาน", to: "/clean-energy", icon: BatteryCharging, iconClass: "bg-[#E6F1F7] text-[#1677A8]", actionClass: "text-[#1677A8]" },
];

export function HomePage() {
  const [activities, setActivities] = useState<SocialActivity[]>([]);

  useEffect(() => {
    let active = true;
    getActivities().then((items) => { if (active) setActivities(items.slice(0, 6)); });
    return () => { active = false; };
  }, []);

  return (
    <PublicAppShell>
      <section className="relative overflow-hidden bg-[#123B63] text-white">
        <img src="/hero-bg.jpeg" alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.18]" width="1920" height="1080" fetchPriority="high" />
        <div aria-hidden="true" className="absolute inset-0 bg-[#123B63]/58" />
        <div className="relative mx-auto grid max-w-[1280px] items-center gap-8 px-4 py-12 sm:px-6 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <span className="inline-flex min-h-8 items-center rounded-full bg-[#D6A84F] px-3.5 py-1 text-xs font-bold tracking-wide text-[#123B63]">MAHIDOL SOCIAL ENGAGEMENT</span>
            <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl lg:text-[52px]">งานพันธกิจเพื่อสังคม<br />จากองค์ความรู้สู่พื้นที่จริง</h1>
            <p className="mt-5 max-w-2xl text-sm font-normal leading-7 text-blue-100 sm:text-base sm:leading-7">แพลตฟอร์มกลางสำหรับกิจกรรม โครงการ ศูนย์ปฏิบัติการและระบบการเรียนรู้</p>
            <div className="mt-7 flex flex-wrap gap-3"><RouterLink to="/activities" className="inline-flex min-h-11 items-center rounded-xl bg-[#D6A84F] px-5 py-3 text-sm font-semibold text-[#123B63] transition hover:brightness-95">ดูผลงานและกิจกรรม <ArrowUpRight className="ml-1 h-4 w-4" /></RouterLink><RouterLink to="/centers" className="inline-flex min-h-11 items-center rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold transition hover:bg-white/10">สำรวจพื้นที่ปฏิบัติการ</RouterLink></div>
          </div>
          <div className="relative mx-auto w-full max-w-[560px] lg:justify-self-end"><div className="overflow-hidden rounded-2xl border border-white/10 bg-white/10 shadow-xl backdrop-blur-[2px]"><video className="aspect-[16/10] w-full object-cover" controls playsInline preload="metadata" aria-label="วิดีโอแนะนำพื้นที่เรียนรู้" poster="/hero-bg.jpeg"><source src="/intro-enlp.mp4" type="video/mp4" />เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอ</video><div className="bg-[#123B63]/90 px-5 py-3 sm:px-6 sm:py-3.5"><p className="text-xs font-medium leading-5 text-[#D6A84F]">พื้นที่แห่งการเรียนรู้ ภูมิปัญญาท้องถิ่นและการพัฒนาที่ยั่งยืน</p></div></div></div>
        </div>
      </section>

      <section className="relative overflow-hidden py-12 sm:py-14 lg:py-16">
        <img src="/activities-bg.jpeg" alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.48]" loading="eager" decoding="async" fetchPriority="high" width="1920" height="1080" />
        <div aria-hidden="true" className="absolute inset-0 bg-[#F7F4ED]/70" />
        <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8"><div className="flex items-end justify-between gap-6"><div><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1677A8]">COMMUNITY &amp; EDUCATION</p><h2 className="mt-2 text-2xl font-bold tracking-tight text-[#123B63] sm:text-3xl">กิจกรรมและโครงการล่าสุด</h2></div><RouterLink to="/activities" className="hidden min-h-11 shrink-0 items-center text-sm font-semibold text-[#1677A8] sm:inline-flex">ดูกิจกรรมทั้งหมด <ArrowUpRight className="ml-1 h-4 w-4" /></RouterLink></div><div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{activities.slice(0, 3).map((activity) => <ActivityPreview key={activity.id} activity={activity} />)}</div><RouterLink to="/activities" className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-[#1677A8] sm:hidden">ดูกิจกรรมทั้งหมด <ArrowUpRight className="ml-1 h-4 w-4" /></RouterLink></div>
      </section>

      <section className="relative isolate overflow-hidden py-14 sm:py-16 lg:py-20">
        <img src="/learning-enters-bg.jpeg" alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover object-center" loading="lazy" decoding="async" width="1920" height="1080" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-white/58" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-white/42 via-white/48 to-white/62" />
        <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center"><span className="inline-flex rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#D6A84F] shadow-sm ring-1 ring-white/70">SPACE &amp; INNOVATION</span><h2 className="mt-3 text-2xl font-bold tracking-tight text-[#123B63] sm:text-3xl lg:text-[34px]">ศูนย์การเรียนรู้เชิงพื้นที่และบริการวิชาการ</h2><p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#52677B] sm:text-base">ผลักดันงานวิจัยและนวัตกรรมเพื่อพัฒนาท้องถิ่น สร้างความเป็นอยู่ที่ดีให้ชุมชน ตอบโจทย์ชุมชนและสร้างระบบที่ยั่งยืน</p></div>
          <div className="mt-8 grid gap-5 md:grid-cols-3 lg:mt-10">{learningCenters.map((center) => { const Icon = center.icon; return <article key={center.title} className="group rounded-2xl border border-white/75 bg-white/90 p-6 shadow-[0_12px_35px_rgba(18,59,99,0.10)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white sm:p-7"><div className={`flex h-11 w-11 items-center justify-center rounded-full ${center.iconClass}`}><Icon className="h-5 w-5" strokeWidth={1.8} /></div><h3 className="mt-5 text-lg font-bold leading-7 text-[#123B63]">{center.title}</h3><p className="mt-3 min-h-[96px] text-sm leading-6 text-[#64778A]">{center.description}</p><RouterLink to={center.to} className={`mt-5 inline-flex min-h-11 items-center text-sm font-semibold ${center.actionClass} focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677A8] focus-visible:ring-offset-2`}>{center.action} <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></RouterLink></article>; })}</div>
        </div>
      </section>

      <section className="bg-white py-12"><div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8"><div className="flex items-end justify-between"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#C66B4F]">ACTIVITY EVIDENCE</p><h2 className="mt-2 text-2xl font-black text-[#123B63]">กิจกรรมและโครงการ</h2></div><RouterLink to="/activities" className="hidden min-h-11 items-center text-sm font-bold text-[#1677A8] sm:inline-flex">ดูทั้งหมด <ArrowUpRight className="ml-1 h-4 w-4" /></RouterLink></div><div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{activities.slice(3).map((activity) => <ActivityPreview key={activity.id} activity={activity} />)}</div></div></section>

      <section className="bg-[#F8FAFC] py-12"><div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8"><div className="grid gap-6 md:grid-cols-3"><div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#C66B4F]">SOCIAL IMPACT</p><h2 className="mt-2 text-2xl font-black text-[#123B63]">จากพื้นที่เรียนรู้สู่การเปลี่ยนแปลง</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">เชื่อมองค์ความรู้ งานวิจัย และการลงมือทำ เพื่อสร้างประโยชน์แก่ชุมชนและพัฒนาพื้นที่อย่างยั่งยืน</p></div><div className="rounded-2xl border border-slate-200 bg-[#123B63] p-6 text-white shadow-sm"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#D6A84F]">JOIN &amp; LEARN</p><h3 className="mt-2 text-xl font-black">เข้ามาเรียนรู้ร่วมกัน</h3><p className="mt-2 text-sm leading-6 text-blue-100">สำรวจศูนย์ปฏิบัติการ กิจกรรม และองค์ความรู้จากพื้นที่จริง</p><RouterLink to="/centers" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-[#D6A84F] px-4 py-2.5 text-sm font-bold text-[#123B63]">สำรวจศูนย์ <ArrowUpRight className="ml-1 h-4 w-4" /></RouterLink></div></div></div></section>
    </PublicAppShell>
  );
}
