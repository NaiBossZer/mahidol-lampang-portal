import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Leaf,
  MapPin,
  Menu,
  ShoppingCart,
  Sparkles,
  Zap,
} from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { type SocialActivity } from "@/data/socialEngagement";
import { getActivities } from "@/services/socialEngagementApi";

const fallbackActivities = [
  {
    id: "fallback-community",
    title: "โครงการอนุรักษ์ป่าชุมชนและภูมินิเวศ",
    activityDate: "2026-03-12",
    category: "กิจกรรมชุมชน",
    image: "/Shellac banner.jpg",
    summary: "ร่วมขับเคลื่อนการเรียนรู้และการจัดการพื้นที่เพื่อเพิ่มพื้นที่สีเขียวและสร้างเครือข่ายท้องถิ่นที่ยั่งยืน",
  },
  {
    id: "fallback-smart-farm",
    title: "กิจกรรมเกษตรอัจฉริยะและเทคโนโลยีสินทรัพย์",
    activityDate: "2026-02-28",
    category: "เกษตรกรรมเทคโนโลยี",
    image: "/Smart Farm.jpg",
    summary: "ประยุกต์ใช้องค์ความรู้และเทคโนโลยีเพื่อเพิ่มประสิทธิภาพการเกษตรของชุมชนอย่างยั่งยืน",
  },
  {
    id: "fallback-learning",
    title: "เวิร์กช็อปการแปรรูปผลิตภัณฑ์ชุมชน",
    activityDate: "2026-03-15",
    category: "ปฏิบัติการการเรียนรู้",
    image: "/Mahidol_U.jpg",
    summary: "กระบวนการเรียนรู้จากการทดลองและลงมือปฏิบัติ เพื่อเพิ่มมูลค่าและสร้างรายได้ให้ชุมชน",
  },
];

const learningCards = [
  {
    title: "ศูนย์วิจัยและพัฒนาแผนงานไฟฟ้า",
    description: "พื้นที่นวัตกรรมด้านพลังงานและปัญหาท้องถิ่น สามารถใช้เป็นระบบเรียนรู้เชิงพื้นที่และระดับคุณภาพชีวิตของชุมชน",
    icon: Zap,
    href: "#research",
  },
  {
    title: "สมาร์ทฟาร์มอัจฉริยะ",
    description: "เทคโนโลยีเกษตรอัจฉริยะและระบบการจัดการน้ำ พัฒนาการผลิตที่ยั่งยืนและประสิทธิภาพสูง",
    icon: Leaf,
    href: "/centers",
  },
  {
    title: "สถานีวิจัยพลังงานทดแทน",
    description: "พัฒนาพลังงานหมุนเวียนและสะอาด เพื่อนำมาทดแทน เช่น โซลาร์เซลล์ และพลังงานชีวมวล",
    icon: Sparkles,
    href: "#research",
  },
];

export function HomePage() {
  const [activities, setActivities] = useState<SocialActivity[]>([]);

  useEffect(() => {
    let active = true;
    getActivities()
      .then((items) => {
        if (active) setActivities(items.slice(0, 3));
      })
      .catch(() => {
        if (active) setActivities([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const visibleActivities = activities.length > 0 ? activities : fallbackActivities;

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-[#173B5F]">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex min-h-[76px] max-w-[1280px] items-center gap-5 px-4 sm:px-6 lg:px-8">
          <RouterLink to="/" className="flex min-w-0 shrink-0 items-center gap-3" aria-label="มหิดล วิทยาเขตลำปาง — หน้าหลัก">
            <img src="/mahidol-logo.png" alt="มหาวิทยาลัยมหิดล" className="h-11 w-11 shrink-0 object-contain" width="44" height="44" />
            <div className="hidden leading-tight sm:block">
              <p className="text-sm font-black text-[#123B63]">มหิดล วิทยาเขตลำปาง</p>
              <p className="text-[10px] font-medium text-slate-500">Mahidol University Lampang Learning Portal</p>
            </div>
          </RouterLink>

          <nav className="ml-auto hidden items-center gap-0.5 lg:flex" aria-label="เมนูหลัก">
            <a href="#top" className="rounded-lg border-b-2 border-[#E67E5B] px-3 py-2 text-sm font-bold text-[#123B63]">หน้าแรก</a>
            <RouterLink to="/activities" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-[#123B63]">กิจกรรม</RouterLink>
            <a href="#learning" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-[#123B63]">ศูนย์การเรียนรู้</a>
            <a href="#research" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-[#123B63]">งานวิจัย</a>
            <a href="#learning" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-[#123B63]">ระบบเทคโนโลยี</a>
            <RouterLink to="/storefront" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-[#123B63]">ร้านค้าชุมชน</RouterLink>
            <a href="#community" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-[#123B63]">เกี่ยวกับเรา</a>
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-2">
            <button type="button" className="hidden px-2 text-[11px] font-semibold text-slate-500 sm:block" aria-label="เปลี่ยนภาษา">TH | EN</button>
            <RouterLink to="/storefront" aria-label="ร้านค้าชุมชน" className="hidden h-10 w-10 items-center justify-center rounded-lg text-[#123B63] hover:bg-slate-50 sm:flex">
              <ShoppingCart className="h-5 w-5" />
            </RouterLink>
            <RouterLink to="/login" className="hidden min-h-10 items-center gap-2 rounded-lg bg-[#0F426B] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#0A3556] sm:inline-flex">
              เข้าสู่ระบบ
            </RouterLink>
            <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 lg:hidden" aria-label="เปิดเมนู">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="relative min-h-[500px] overflow-hidden bg-[#174A6E] text-white sm:min-h-[560px]">
          <img src="/hero-bg.jpeg" alt="ภูมิทัศน์ลำปาง" className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B3554]/90 via-[#164C6E]/70 to-[#174A6E]/20" />
          <div className="relative mx-auto grid min-h-[500px] max-w-[1280px] items-center gap-8 px-4 py-14 sm:min-h-[560px] sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
            <div className="max-w-[650px]">
              <span className="inline-flex rounded-md bg-[#E6B84A] px-3 py-1 text-[11px] font-black tracking-wide text-[#163D5E]">Lampang Campus Portal</span>
              <h1 className="mt-5 text-4xl font-black leading-[1.08] tracking-tight sm:text-6xl lg:text-[62px]">Local Wisdom, <span className="text-[#F2BF4F]">Future</span><br /><span className="text-[#F2BF4F]">Learning</span></h1>
              <p className="mt-5 max-w-[650px] text-sm leading-7 text-white/90 sm:text-base">บูรณาการภูมิปัญญาท้องถิ่นและสิ่งแวดล้อมแห่งอนาคต มหาวิทยาลัยมหิดล จ.ลำปาง เชื่อมโยงองค์ความรู้ เศรษฐกิจ และสิ่งแวดล้อมเพื่อการพัฒนาที่ยั่งยืน</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <RouterLink to="/activities" className="inline-flex min-h-11 items-center rounded-lg bg-[#E8785A] px-5 py-3 text-sm font-black text-white shadow-lg transition hover:bg-[#D96549]">สำรวจกิจกรรมและโครงการ <ArrowRight className="ml-2 h-4 w-4" /></RouterLink>
                <a href="#learning" className="inline-flex min-h-11 items-center rounded-lg border border-white/70 bg-white/5 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15">เกี่ยวกับวิทยาเขต</a>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="overflow-hidden rounded-2xl border border-white/25 bg-white/10 p-2 shadow-2xl backdrop-blur-sm">
                <img src="/main banner.jpg" alt="พื้นที่มหิดลลำปาง" className="h-[315px] w-full rounded-xl object-cover" loading="eager" width="900" height="620" />
                <div className="px-3 py-3 text-xs font-semibold text-white/90">สัมผัสภูมิปัญญาและพัฒนาวัฒนธรรมท้องถิ่นควบคู่กับการเรียนรู้</div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#F7FBFD] py-14 sm:py-16">
          <img src="/activities-bg.jpeg" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20" aria-hidden="true" />
          <div className="relative mx-auto max-w-[1120px] px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-5">
              <div><span className="text-[11px] font-black tracking-wide text-[#1695C9]">COMMUNITY & EDUCATION</span><h2 className="mt-2 text-2xl font-black text-[#123B63] sm:text-3xl">กิจกรรมและโครงการล่าสุด</h2></div>
              <RouterLink to="/activities" className="hidden items-center gap-1 text-sm font-bold text-[#1684B7] sm:inline-flex">ดูทั้งหมดกิจกรรม <ArrowRight className="h-4 w-4" /></RouterLink>
            </div>
            <div className="mt-7 grid gap-5 md:grid-cols-3">
              {visibleActivities.map((activity, index) => {
                const fallback = fallbackActivities[index % fallbackActivities.length];
                const title = "title" in activity ? String(activity.title) : fallback.title;
                const image = "featuredImage" in activity && activity.featuredImage ? String(activity.featuredImage) : fallback.image;
                const date = "activityDate" in activity ? String(activity.activityDate) : fallback.activityDate;
                const summary = "summary" in activity ? String(activity.summary ?? "") : fallback.summary;
                const category = "category" in activity ? String(activity.category ?? fallback.category) : fallback.category;
                const href = "slug" in activity && activity.slug ? `/activities/${String(activity.slug)}` : "/activities";
                const key = "id" in activity ? String(activity.id) : fallback.id;
                return (
                  <RouterLink key={key} to={href} className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative h-44 overflow-hidden"><img src={image} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" /></div>
                    <div className="p-4">
                      <span className="inline-flex rounded-full bg-[#EEF8F3] px-2.5 py-1 text-[10px] font-bold text-[#4B9466]">{category}</span>
                      <h3 className="mt-2 text-base font-black leading-snug text-[#123B63]">{title}</h3>
                      <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500"><CalendarDays className="h-3.5 w-3.5" />{formatDate(date)}</div>
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{summary}</p>
                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-[#1684B7]">อ่านรายละเอียด <ArrowRight className="h-3.5 w-3.5" /></div>
                    </div>
                  </RouterLink>
                );
              })}
            </div>
          </div>
        </section>

        <section id="learning" className="relative overflow-hidden py-16 sm:py-20">
          <img src="/learning-enters-bg.jpeg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-65" aria-hidden="true" />
          <div className="absolute inset-0 bg-white/45" />
          <div className="relative mx-auto max-w-[1120px] px-4 sm:px-6 lg:px-8">
            <div className="text-center"><span className="text-[11px] font-black tracking-wide text-[#E4A52F]">SPACE & INNOVATION</span><h2 className="mt-2 text-2xl font-black text-[#123B63] sm:text-3xl">ศูนย์การเรียนรู้เชิงพื้นที่และบริการวิชาการ</h2><p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">ผลักดันงานวิจัยและนวัตกรรมต่อยอดคุณภาพชีวิตของชุมชนท้องถิ่น บนพื้นฐานการเรียนรู้และการจัดการอย่างยั่งยืน</p></div>
            <div className="mt-9 grid gap-5 md:grid-cols-3">
              {learningCards.map(({ title, description, icon: Icon, href }) => (
                <a key={title} href={href} className="group rounded-xl border border-white/80 bg-white/90 p-6 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E9F5EE] text-[#55A46E]"><Icon className="h-5 w-5" /></div>
                  <h3 className="mt-5 text-lg font-black text-[#123B63]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
                  <span className="mt-5 inline-flex items-center text-xs font-black text-[#D9875B]">ดูข้อมูลศูนย์ <ArrowRight className="ml-1 h-3.5 w-3.5" /></span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="research" className="relative overflow-hidden bg-white py-16 sm:py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/75" />
          <img src="/research-bg.jpeg" alt="" className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-25" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-[1120px] gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
            <div className="flex flex-col justify-center"><span className="text-[11px] font-black tracking-wide text-[#E07859]">RESEARCH & PUBLICATIONS</span><h2 className="mt-2 text-2xl font-black leading-tight text-[#123B63] sm:text-3xl">ผลงานวิจัยและการจัดสรรคุณค่าสู่สังคมและชุมชน</h2><p className="mt-4 text-sm leading-7 text-slate-600">วิทยาเขตนำงานวิจัยมาเป็นส่วนหนึ่งในการยกระดับการพัฒนาชุมชน การเกษตร พลังงาน รวมถึงระบบสารสนเทศและนวัตกรรมเทคโนโลยีเพื่อสร้างผลกระทบในระยะยาวอย่างยั่งยืน</p><div className="mt-8 grid grid-cols-3 gap-5"><div><strong className="text-3xl font-black text-[#E07859]">45+</strong><p className="mt-1 text-[11px] font-medium text-slate-500">โครงการมีส่วนร่วมชุมชน</p></div><div><strong className="text-3xl font-black text-[#164A70]">22+</strong><p className="mt-1 text-[11px] font-medium text-slate-500">รางวัลนวัตกรรมระดับชาติ</p></div><div><strong className="text-3xl font-black text-[#56A56F]">120+</strong><p className="mt-1 text-[11px] font-medium text-slate-500">เครือข่ายความร่วมมือ</p></div></div></div>
            <div className="grid grid-cols-2 gap-4"><img src="/Smart Farm.jpg" alt="งานวิจัยเกษตรอัจฉริยะ" className="h-72 w-full rounded-xl object-cover shadow-lg" loading="lazy" /><img src="/Mahidol_U.jpg" alt="งานวิจัยและนวัตกรรม" className="mt-10 h-72 w-full rounded-xl object-cover shadow-lg" loading="lazy" /></div>
          </div>
        </section>

        <section id="community" className="relative overflow-hidden py-14 sm:py-16">
          <img src="/community-action-bg.jpeg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-55" aria-hidden="true" /><div className="absolute inset-0 bg-white/40" />
          <div className="relative mx-auto flex max-w-[1120px] flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-8"><div><span className="text-[11px] font-black tracking-wide text-[#1D9ACB]">COMMUNITY ACTION</span><h2 className="mt-2 text-2xl font-black text-[#123B63]">ร่วมสร้างสรรค์และบูรณาการชุมชนลำปาง</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">หากคุณเป็นผู้บริหาร เกษตรกร นักวิจัย หรือผู้สนใจพัฒนาพื้นที่ร่วมกับมหิดลลำปาง สามารถร่วมออกแบบกิจกรรมและสนับสนุนการพัฒนาชุมชนอย่างมีส่วนร่วม</p></div><RouterLink to="/activities" className="inline-flex shrink-0 items-center rounded-lg bg-[#0F426B] px-5 py-3 text-sm font-black text-white shadow-lg transition hover:bg-[#0A3556]">ติดต่อร่วมโครงการ <ArrowRight className="ml-2 h-4 w-4" /></RouterLink></div>
        </section>
      </main>

      <footer className="relative overflow-hidden bg-[#073B60] py-10 text-white">
        <img src="/footer-bg.jpeg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-10" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-[1120px] gap-8 px-4 sm:px-6 md:grid-cols-[1.35fr_1fr_1fr_1.1fr] lg:px-8"><div><div className="flex items-center gap-3"><img src="/mahidol-logo.png" alt="มหาวิทยาลัยมหิดล" className="h-11 w-11 rounded-full bg-white p-1 object-contain" /><div><p className="text-sm font-black">มหาวิทยาลัยมหิดล วิทยาเขตลำปาง</p><p className="text-[10px] text-white/65">Mahidol University, Lampang Campus</p></div></div><p className="mt-4 max-w-xs text-xs leading-6 text-white/70">มุ่งพัฒนาคน สร้างความรู้ ร่วมกับชุมชนการเรียนรู้ เพื่อสังคมและสิ่งแวดล้อมที่ยั่งยืน</p></div><div><h3 className="text-sm font-black text-[#F0C65B]">ศูนย์การเรียนรู้</h3><p className="mt-3 text-xs leading-6 text-white/70">ศูนย์วิจัยและพัฒนา<br />สมาร์ทฟาร์มอัจฉริยะ<br />สถานีพลังงานทดแทน</p></div><div><h3 className="text-sm font-black text-[#F0C65B]">งานวิจัยและเทคโนโลยี</h3><p className="mt-3 text-xs leading-6 text-white/70">เทคโนโลยีเพื่อการเรียนรู้<br />นวัตกรรมเพื่อชุมชน<br />ผลิตภัณฑ์และองค์ความรู้</p></div><div><h3 className="text-sm font-black text-[#F0C65B]">ติดต่อ</h3><p className="mt-3 flex items-start gap-2 text-xs leading-6 text-white/70"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />191 หมู่ 11 ต.สบปราบ อ.สบปราบ จ.ลำปาง 52170</p><p className="mt-2 text-xs text-white/70">054-820-200</p><p className="mt-1 text-xs text-white/70">lampang@mahidol.ac.th</p></div></div>
        <div className="relative mx-auto mt-8 max-w-[1120px] border-t border-white/15 px-4 pt-5 text-[10px] text-white/50 sm:px-6 lg:px-8">© 2026 มหาวิทยาลัยมหิดล วิทยาเขตลำปาง <span className="float-right">นโยบายความเป็นส่วนตัว | เงื่อนไขการใช้งาน</span></div>
      </footer>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(date);
}
