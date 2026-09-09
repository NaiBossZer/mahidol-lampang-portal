import { ArrowUpRight, BookOpen, ExternalLink, Users } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { SUB_SYSTEM_URLS } from "@/config";

export function ShellacLearningCenterPage() {
  return (
    <div className="min-h-screen bg-[#f8f6f0] text-slate-800">
      <header className="bg-[#123B63] text-white">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <RouterLink to="/" className="text-xs font-bold text-[#D6A84F]">← กลับหน้าหลัก</RouterLink>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D6A84F]">CORE SYSTEM · LEARNING EXPERIENCE</p>
              <h1 className="mt-3 text-4xl font-black sm:text-5xl">Shellac Learning Center</h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-blue-100">ศูนย์เรียนรู้ครั่งครบวงจร ภายใต้งานพันธกิจเพื่อสังคม เชื่อมองค์ความรู้ งานวิจัย สถานศึกษา และชุมชน</p>
              <a href={SUB_SYSTEM_URLS.RAC} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#D6A84F] px-5 py-3 text-sm font-bold text-[#123B63]">
                เข้าสู่ศูนย์เรียนรู้ <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <img src="/Shellac banner.jpg" alt="Shellac Learning Center" className="h-64 w-full rounded-3xl object-cover shadow-xl" width="960" height="512" loading="eager" />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-5 md:grid-cols-3">
          <Info icon={BookOpen} title="องค์ความรู้" text="วงจรชีวิตครั่ง การเลี้ยง การแปรรูป และการสร้างมูลค่า" />
          <Info icon={Users} title="การเรียนรู้ร่วมกัน" text="เปิดพื้นที่สำหรับนักเรียน นักศึกษา ชุมชน และภาคีเครือข่าย" />
          <Info icon={ArrowUpRight} title="ต่อยอดสู่พื้นที่" text="เชื่อมงานวิจัยกับการใช้ประโยชน์และการพัฒนาท้องถิ่น" />
        </div>
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-[#C66B4F]">LEARNING EXPERIENCE</p>
          <h2 className="mt-2 text-2xl font-black text-[#123B63]">เรียนรู้ผ่านระบบหลัก</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">Learning Experience เป็นส่วนหนึ่งของระบบ Shellac Learning Center ไม่ใช่ระบบแยกต่างหาก ผู้ใช้สามารถเรียนรู้ผ่านเนื้อหา Interactive สื่อ และกิจกรรมจากพื้นที่จริง</p>
          <RouterLink to="/activities" className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-[#1677A8]">ดูหลักฐานกิจกรรม <ArrowUpRight className="h-4 w-4" /></RouterLink>
        </section>
      </main>
    </div>
  );
}

function Info({ icon: Icon, title, text }: { icon: typeof BookOpen; title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <Icon className="h-6 w-6 text-[#C66B4F]" />
      <h2 className="mt-4 font-black text-[#123B63]">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}
