import { useEffect, useState } from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { PublicAppShell } from "../components/layout/PublicAppShell";
import { getActivities } from "../services/socialEngagementApi";
import type { SocialActivity } from "../data/socialEngagement";

const CORE_SYSTEMS = [
  {
    slug: "lac",
    title: "Shellac Learning Center",
    subtitle: "เรียนรู้ครั่งครบวงจร ตั้งแต่ภูมิปัญญาท้องถิ่นถึงการต่อยอด",
    image: "/learning-centers-bg.jpeg",
    href: "https://mahidol-shellac.vercel.app/",
  },
  {
    slug: "smart-farm",
    title: "Smart Farm Station",
    subtitle: "พื้นที่เรียนรู้เกษตรอัจฉริยะและการจัดการทรัพยากรอย่างยั่งยืน",
    image: "/activities-bg.jpeg",
    href: "/smart-farm",
  },
  {
    slug: "clean-energy",
    title: "Clean Energy Station",
    subtitle: "ระบบพลังงานสะอาดและการใช้พลังงานอย่างมีประสิทธิภาพ",
    image: "/research-bg.jpeg",
    href: "/clean-energy",
  },
];

function activityCategory(activity: SocialActivity) {
  if (activity.system === "shellac") return "SHELLAC";
  if (activity.system === "smart-farm") return "SMART FARM";
  if (activity.system === "clean-energy") return "CLEAN ENERGY";
  return "SOCIAL ENGAGEMENT";
}

function ActivityPreview({ activity }: { activity: SocialActivity }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="p-5">
        <p className="text-xs font-medium text-[#C66B4F]">{activityCategory(activity)}</p>
        <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-[#123B63]">{activity.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{activity.summary}</p>
        <RouterLink to={`/activities/${activity.slug}`} className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-[#1677A8]">
          อ่านเพิ่มเติม <ArrowUpRight className="ml-1 h-4 w-4" />
        </RouterLink>
      </div>
    </article>
  );
}

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
        <img src="/hero-bg.jpeg" alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.18]" width="1920" height="1080" fetchPriority="high" />
        <div aria-hidden="true" className="absolute inset-0 bg-[#123B63]/58" />
        <div className="relative mx-auto grid max-w-[1280px] items-center gap-8 px-4 py-12 sm:px-6 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <span className="inline-flex min-h-8 items-center rounded-full bg-[#D6A84F] px-3.5 py-1 text-xs font-bold tracking-wide text-[#123B63]">MAHIDOL SOCIAL ENGAGEMENT</span>
            <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl lg:text-[52px]">งานพันธกิจเพื่อสังคม<br />จากองค์ความรู้สู่พื้นที่จริง</h1>
            <p className="mt-5 max-w-2xl text-sm font-normal leading-7 text-blue-100 sm:text-base sm:leading-7">แพลตฟอร์มกลางสำหรับกิจกรรม โครงการ ศูนย์ปฏิบัติการและระบบการเรียนรู้</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <RouterLink to="/activities" className="inline-flex min-h-11 items-center rounded-xl bg-[#D6A84F] px-5 py-3 text-sm font-semibold text-[#123B63] transition hover:brightness-95">ดูผลงานและกิจกรรม <ArrowUpRight className="ml-1 h-4 w-4" /></RouterLink>
              <RouterLink to="/centers" className="inline-flex min-h-11 items-center rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold transition hover:bg-white/10">สำรวจพื้นที่ปฏิบัติการ</RouterLink>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[560px] lg:justify-self-end">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/10 shadow-xl backdrop-blur-[2px]">
              <video className="aspect-[16/10] w-full object-cover" controls playsInline preload="metadata" aria-label="วิดีโอแนะนำพื้นที่เรียนรู้" poster="/hero-bg.jpeg">
                <source src="/intro-enlp.mp4" type="video/mp4" />
                เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอ
              </video>
              <div className="bg-[#123B63]/90 px-5 py-3 sm:px-6 sm:py-3.5">
                <p className="text-xs font-medium leading-5 text-[#D6A84F]">พื้นที่แห่งการเรียนรู้ ภูมิปัญญาท้องถิ่นและการพัฒนาที่ยั่งยืน</p>
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
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#C66B4F]">ACTIVITY EVIDENCE</p>
              <h2 className="mt-2 text-2xl font-black text-[#123B63]">กิจกรรมและโครงการ</h2>
            </div>
            <RouterLink to="/activities" className="hidden min-h-11 items-center text-sm font-bold text-[#1677A8] sm:inline-flex">ดูทั้งหมด <ArrowUpRight className="ml-1 h-4 w-4" /></RouterLink>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => <ActivityPreview key={activity.id} activity={activity} />)}
          </div>
        </div>
      </section>

      <section className="bg-[#F8FAFC] py-12">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#C66B4F]">SOCIAL IMPACT</p>
              <h2 className="mt-2 text-2xl font-black text-[#123B63]">จากพื้นที่เรียนรู้สู่การเปลี่ยนแปลง</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">เชื่อมองค์ความรู้ งานวิจัย และการลงมือทำ เพื่อสร้างประโยชน์แก่ชุมชนและพัฒนาพื้นที่อย่างยั่งยืน</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-[#123B63] p-6 text-white shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D6A84F]">JOIN & LEARN</p>
              <h3 className="mt-2 text-xl font-black">เข้ามาเรียนรู้ร่วมกัน</h3>
              <p className="mt-2 text-sm leading-6 text-blue-100">สำรวจศูนย์ปฏิบัติการ กิจกรรม และองค์ความรู้จากพื้นที่จริง</p>
              <RouterLink to="/centers" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-[#D6A84F] px-4 py-2.5 text-sm font-bold text-[#123B63]">สำรวจศูนย์ <ArrowUpRight className="ml-1 h-4 w-4" /></RouterLink>
            </div>
          </div>
        </div>
      </section>
    </PublicAppShell>
  );
}
