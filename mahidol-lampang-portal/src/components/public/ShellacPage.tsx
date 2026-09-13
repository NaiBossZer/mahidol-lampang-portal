import { ChevronRight, BookOpen, Leaf, Palette, Users, ArrowRight } from "lucide-react";
import type { PublicPage } from "../PublicPortal";

interface Props {
  navigate: (p: PublicPage) => void;
}

const programs = [
  {
    icon: BookOpen,
    color: "#C66B4F",
    title: "การเรียนรู้ครั่ง",
    desc: "ประวัติ กระบวนการผลิต และคุณสมบัติทางวิทยาศาสตร์ของครั่งลำปาง",
  },
  {
    icon: Leaf,
    color: "#5F8D62",
    title: "เกษตรอินทรีย์ครั่ง",
    desc: "การเพาะเลี้ยงครั่งอินทรีย์บนพื้นฐานระบบนิเวศและภูมิปัญญาท้องถิ่น",
  },
  {
    icon: Palette,
    color: "#D6A84F",
    title: "ศิลปะและนวัตกรรม",
    desc: "การนำครั่งไปใช้ในงานออกแบบ ศิลปะ และผลิตภัณฑ์ร่วมสมัย",
  },
  {
    icon: Users,
    color: "#1677A8",
    title: "เครือข่ายชุมชน",
    desc: "เชื่อมโยงเกษตรกร นักวิจัย และผู้ประกอบการครั่งภาคเหนือ",
  },
];

const timeline = [
  {
    year: "2554",
    label: "ก่อตั้งศูนย์วิจัยครั่ง",
    desc: "เริ่มโครงการรวบรวมองค์ความรู้ภูมิปัญญาครั่งลำปาง",
  },
  {
    year: "2558",
    label: "เปิด SLC อาคาร A",
    desc: "ศูนย์การเรียนรู้สาธารณะ เปิดให้ชุมชนเข้าถึงได้",
  },
  {
    year: "2562",
    label: "ขยายโปรแกรม",
    desc: "เพิ่มหลักสูตรนวัตกรรมและเชื่อมโยงเครือข่ายนานาชาติ",
  },
  { year: "2567", label: "SLC 2.0", desc: "อาคาร B เปิดใหม่ พร้อมห้องทดลองและ Maker Space" },
];

export default function ShellacPage({ navigate }: Props) {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[420px] flex items-end">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1533656641950-4ca64c3de9d4?w=1440&h=600&fit=crop&auto=format)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0d06]/85 via-[#1a0d06]/50 to-[#1a0d06]/20" />
        <div className="relative max-w-[1280px] mx-auto px-8 max-md:px-4 pb-14 pt-20 w-full">
          <nav
            className="flex items-center gap-2 text-sm text-white/60 mb-6"
            aria-label="Breadcrumb"
          >
            <button onClick={() => navigate("home")} className="hover:text-white transition-colors">
              หน้าหลัก
            </button>
            <ChevronRight size={14} />
            <span className="text-white">Shellac Learning Center</span>
          </nav>
          <div className="inline-block bg-[#C66B4F] text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            ศูนย์การเรียนรู้ภูมิปัญญาท้องถิ่น
          </div>
          <h1 className="text-white font-bold text-5xl max-md:text-3xl mb-4 leading-tight">
            Shellac Learning Center
          </h1>
          <p className="text-white/75 text-xl max-md:text-base max-w-[560px] leading-relaxed">
            ศูนย์เรียนรู้ครั่งและภูมิปัญญาท้องถิ่นลำปาง เชื่อมโยงวิทยาศาสตร์ วัฒนธรรม
            และนวัตกรรมสร้างสรรค์
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-[#C66B4F]">
        <div className="max-w-[1280px] mx-auto px-8 max-md:px-4 py-5 grid grid-cols-4 max-sm:grid-cols-2 gap-4">
          {[
            { value: "13+", label: "ปีแห่งการวิจัย" },
            { value: "620", label: "ผู้เข้าร่วม/ปี" },
            { value: "40+", label: "โปรแกรมเรียนรู้" },
            { value: "8", label: "เครือข่ายนานาชาติ" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-2xl font-bold text-white">{s.value}</div>
              <div className="text-white/70 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Programs */}
      <section className="max-w-[1280px] mx-auto px-8 max-md:px-4 py-16">
        <div className="text-center mb-10">
          <div className="text-[#C66B4F] text-xs font-semibold uppercase tracking-widest mb-1">
            โปรแกรมเรียนรู้
          </div>
          <h2 className="text-[#123B63] font-bold text-3xl max-md:text-2xl">
            เส้นทางการเรียนรู้ครั่ง
          </h2>
        </div>
        <div className="grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-5">
          {programs.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="bg-white rounded-2xl p-6 border border-[#EEE9DF] hover:shadow-md transition-all group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: p.color + "18" }}
                >
                  <Icon size={22} style={{ color: p.color }} />
                </div>
                <h3 className="text-[#1F2933] font-semibold text-base mb-2">{p.title}</h3>
                <p className="text-[#667085] text-sm leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Story / timeline */}
      <section className="bg-white border-y border-[#EEE9DF] py-16">
        <div className="max-w-[1280px] mx-auto px-8 max-md:px-4">
          <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-14 items-center">
            <div>
              <div className="text-[#C66B4F] text-xs font-semibold uppercase tracking-widest mb-2">
                เรื่องราวของเรา
              </div>
              <h2 className="text-[#123B63] font-bold text-3xl max-md:text-2xl mb-5">
                จากภูมิปัญญาท้องถิ่น
                <br />
                สู่ศูนย์เรียนรู้ระดับชาติ
              </h2>
              <p className="text-[#667085] text-base leading-relaxed mb-6">
                Shellac Learning Center ก่อตั้งขึ้นด้วยแรงบันดาลใจจากภูมิปัญญาครั่งของชาวลำปาง
                ที่สืบทอดกันมาหลายร้อยปี ผสมผสานกับองค์ความรู้ทางวิทยาศาสตร์และการออกแบบสมัยใหม่
              </p>
              <div className="space-y-6">
                {timeline.map((t) => (
                  <div key={t.year} className="flex gap-5 items-start">
                    <div className="flex-shrink-0 text-right">
                      <span className="font-display font-bold text-[#C66B4F] text-lg">
                        {t.year}
                      </span>
                    </div>
                    <div className="flex-shrink-0 w-px bg-[#EEE9DF] self-stretch mt-1" />
                    <div>
                      <div className="text-[#1F2933] font-semibold text-sm mb-0.5">{t.label}</div>
                      <div className="text-[#667085] text-sm">{t.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-[#EEE9DF]">
              <img
                src="https://images.unsplash.com/photo-1770021601292-0a3e41371055?w=700&h=525&fit=crop&auto=format"
                alt="Shellac elephant art"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1280px] mx-auto px-8 max-md:px-4 py-16 text-center">
        <div className="bg-[#F8F6F0] rounded-3xl border border-[#EEE9DF] p-12 max-md:p-8">
          <div className="text-[#C66B4F] text-xs font-semibold uppercase tracking-widest mb-3">
            เข้าร่วมกับเรา
          </div>
          <h2 className="text-[#123B63] font-bold text-3xl max-md:text-2xl mb-4">
            พร้อมสำรวจ Shellac Learning Center?
          </h2>
          <p className="text-[#667085] text-base mb-8 max-w-[480px] mx-auto">
            ร่วมกิจกรรม Workshop นำเที่ยว หรือสมัครโปรแกรมวิจัยกับ SLC
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <button
              onClick={() => navigate("activities")}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C66B4F] text-white font-semibold text-sm hover:bg-[#b05d44] transition-colors min-h-[44px]"
            >
              ดูกิจกรรม SLC <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate("sitemap")}
              className="px-6 py-3 rounded-xl border border-[#EEE9DF] text-[#123B63] font-semibold text-sm hover:border-[#123B63]/30 bg-white transition-colors min-h-[44px]"
            >
              ดูแผนที่
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
