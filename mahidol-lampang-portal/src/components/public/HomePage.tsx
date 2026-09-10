import { ArrowRight, Leaf, Cpu, BookOpen, Users, ChevronRight } from "lucide-react";
import type { PublicPage } from "../PublicPortal";

interface Props {
  navigate: (p: PublicPage) => void;
}

const activities = [
  {
    category: "เกษตรอินทรีย์",
    title: "เปิดรับสมัครนักเรียนฝึกงานฟาร์มอัจฉริยะ ประจำปี 2567",
    date: "15 กันยายน 2567",
    image: "https://images.unsplash.com/photo-1560559383-338dc7faf062?w=600&h=400&fit=crop&auto=format",
    tag: "เกษตร",
    tagColor: "#5F8D62",
  },
  {
    category: "ชุมชนและวัฒนธรรม",
    title: "Workshop ภูมิปัญญาชาดและครั่ง กับ Shellac Learning Center",
    date: "22 กันยายน 2567",
    image: "https://images.unsplash.com/photo-1647879826700-cfc5fd9d9a31?w=600&h=400&fit=crop&auto=format",
    tag: "วัฒนธรรม",
    tagColor: "#C66B4F",
  },
  {
    category: "พลังงานสะอาด",
    title: "เปิดตัวระบบโซลาร์เซลล์ชุมชน ลดคาร์บอน 40% ภายใน 5 ปี",
    date: "30 กันยายน 2567",
    image: "https://images.unsplash.com/photo-1711397651462-3b2a22f5cfc8?w=600&h=400&fit=crop&auto=format",
    tag: "พลังงาน",
    tagColor: "#1677A8",
  },
];

const pillars = [
  {
    icon: Leaf,
    color: "#5F8D62",
    bg: "#5F8D6215",
    title: "เกษตรและสิ่งแวดล้อม",
    desc: "ฟาร์มอัจฉริยะ การจัดการน้ำ และระบบนิเวศการเกษตรอินทรีย์บนพื้นฐานวิจัย",
  },
  {
    icon: BookOpen,
    color: "#C66B4F",
    bg: "#C66B4F15",
    title: "การเรียนรู้และวัฒนธรรม",
    desc: "Shellac Learning Center ศูนย์เรียนรู้ภูมิปัญญาท้องถิ่นและนวัตกรรมสร้างสรรค์",
  },
  {
    icon: Cpu,
    color: "#1677A8",
    bg: "#1677A815",
    title: "เทคโนโลยีและนวัตกรรม",
    desc: "ระบบเซ็นเซอร์ IoT พลังงานสะอาด และ RAC ขับเคลื่อนชุมชนด้วยข้อมูล",
  },
  {
    icon: Users,
    color: "#D6A84F",
    bg: "#D6A84F15",
    title: "ชุมชนและการมีส่วนร่วม",
    desc: "เชื่อมโยงนักวิจัย นักศึกษา ชุมชน และภาคีเครือข่ายในภาคเหนือ",
  },
];

const stats = [
  { value: "12+", label: "ศูนย์วิจัย" },
  { value: "340", label: "โครงการ" },
  { value: "4,800", label: "ผู้ใช้งาน" },
  { value: "38", label: "ภาคีเครือข่าย" },
];

export default function HomePage({ navigate }: Props) {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1647607124632-f47bfa887125?w=1440&h=700&fit=crop&auto=format)` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#123B63]/90 via-[#123B63]/70 to-[#123B63]/20" aria-hidden="true" />

        <div className="relative max-w-[1280px] mx-auto px-8 max-md:px-4 py-24 max-md:py-16">
          <div className="max-w-[600px]">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#D6A84F]" />
              <span className="text-white/90 text-sm font-medium">มหิดล ลำปาง — ปีการศึกษา 2567</span>
            </div>
            <h1 className="text-white font-bold text-5xl max-md:text-3xl leading-tight mb-5">
              ภูมิปัญญาท้องถิ่น<br />
              <span className="text-[#D6A84F]">สู่อนาคตการเรียนรู้</span>
            </h1>
            <p className="text-white/80 text-lg max-md:text-base leading-relaxed mb-8">
              พอร์ทัลกลางของมหาวิทยาลัยมหิดล วิทยาเขตลำปาง เชื่อมโยงการเรียนรู้
              งานวิจัย เกษตรกรรม และเทคโนโลยีเพื่อชุมชนภาคเหนือ
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("activities")}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D6A84F] text-[#123B63] font-semibold text-sm hover:bg-[#c49840] transition-colors min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                ดูกิจกรรมทั้งหมด <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate("sitemap")}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/30 text-white font-semibold text-sm hover:bg-white/25 transition-colors min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                แผนที่ศูนย์ฯ <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative bg-[#0E2D4F]/80 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-[1280px] mx-auto px-8 max-md:px-4 py-5 grid grid-cols-4 max-sm:grid-cols-2 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-2xl font-bold text-[#D6A84F]">{s.value}</div>
                <div className="text-white/60 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="max-w-[1280px] mx-auto px-8 max-md:px-4 py-16">
        <div className="text-center mb-10">
          <div className="inline-block text-[#C66B4F] text-xs font-semibold uppercase tracking-widest mb-2">พันธกิจหลัก</div>
          <h2 className="text-[#123B63] font-bold text-3xl max-md:text-2xl">ขับเคลื่อนด้วยองค์ความรู้ รับใช้ชุมชน</h2>
        </div>
        <div className="grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-5">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="bg-white rounded-2xl p-6 border border-[#EEE9DF] hover:shadow-md hover:border-[#D6A84F]/30 transition-all duration-200 group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: p.bg }}
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

      {/* Featured activities */}
      <section className="bg-white py-16 border-y border-[#EEE9DF]">
        <div className="max-w-[1280px] mx-auto px-8 max-md:px-4">
          <div className="flex items-end justify-between mb-10 max-sm:flex-col max-sm:items-start max-sm:gap-4">
            <div>
              <div className="text-[#C66B4F] text-xs font-semibold uppercase tracking-widest mb-1">กิจกรรมล่าสุด</div>
              <h2 className="text-[#123B63] font-bold text-3xl max-md:text-2xl">ข่าวสารและกิจกรรม</h2>
            </div>
            <button
              onClick={() => navigate("activities")}
              className="flex items-center gap-1.5 text-[#1677A8] text-sm font-semibold hover:gap-2.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677A8] rounded min-h-[44px] px-1"
            >
              ดูทั้งหมด <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-3 max-lg:grid-cols-1 gap-6">
            {activities.map((a) => (
              <button
                key={a.title}
                onClick={() => navigate("activity-detail")}
                className="group text-left bg-[#F8F6F0] rounded-2xl overflow-hidden border border-[#EEE9DF] hover:shadow-md hover:border-[#D6A84F]/30 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677A8]"
              >
                <div className="aspect-[16/10] overflow-hidden bg-[#EEE9DF]">
                  <img
                    src={a.image}
                    alt={a.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
                      style={{ backgroundColor: a.tagColor }}
                    >
                      {a.tag}
                    </span>
                    <span className="text-[#667085] text-xs">{a.date}</span>
                  </div>
                  <h3 className="text-[#1F2933] font-semibold text-base leading-snug group-hover:text-[#123B63] transition-colors">
                    {a.title}
                  </h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured centers */}
      <section className="max-w-[1280px] mx-auto px-8 max-md:px-4 py-16">
        <div className="text-center mb-10">
          <div className="text-[#C66B4F] text-xs font-semibold uppercase tracking-widest mb-1">ศูนย์แห่งการเรียนรู้</div>
          <h2 className="text-[#123B63] font-bold text-3xl max-md:text-2xl">สำรวจศูนย์และระบบหลัก</h2>
        </div>
        <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-6">
          {/* Shellac */}
          <button
            onClick={() => navigate("shellac")}
            className="group relative overflow-hidden rounded-2xl min-h-[280px] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677A8] bg-[#EEE9DF]"
          >
            <img
              src="https://images.unsplash.com/photo-1533656641950-4ca64c3de9d4?w=700&h=500&fit=crop&auto=format"
              alt="Shellac Learning Center"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#123B63]/90 via-[#123B63]/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-7">
              <div className="inline-block bg-[#C66B4F] text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">ศูนย์การเรียนรู้</div>
              <h3 className="text-white font-bold text-xl mb-1.5">Shellac Learning Center</h3>
              <p className="text-white/70 text-sm">ศูนย์เรียนรู้ครั่งและภูมิปัญญาท้องถิ่นลำปาง</p>
              <div className="flex items-center gap-1.5 mt-3 text-[#D6A84F] text-sm font-semibold group-hover:gap-2.5 transition-all">
                เข้าชม <ArrowRight size={14} />
              </div>
            </div>
          </button>

          {/* Smart Farm */}
          <button
            onClick={() => navigate("smart-farm")}
            className="group relative overflow-hidden rounded-2xl min-h-[280px] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677A8] bg-[#EEE9DF]"
          >
            <img
              src="https://images.unsplash.com/photo-1560559383-338dc7faf062?w=700&h=500&fit=crop&auto=format"
              alt="Smart Farm"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E3B2A]/90 via-[#0E3B2A]/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-7">
              <div className="inline-block bg-[#5F8D62] text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">ระบบฟาร์ม</div>
              <h3 className="text-white font-bold text-xl mb-1.5">ระบบ Smart Farm</h3>
              <p className="text-white/70 text-sm">เกษตรอัจฉริยะด้วยเซ็นเซอร์ IoT และปัญญาประดิษฐ์</p>
              <div className="flex items-center gap-1.5 mt-3 text-[#D6A84F] text-sm font-semibold group-hover:gap-2.5 transition-all">
                เข้าชม <ArrowRight size={14} />
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-[#123B63] py-14">
        <div className="max-w-[1280px] mx-auto px-8 max-md:px-4 text-center">
          <h2 className="text-white font-bold text-3xl max-md:text-2xl mb-3">ร่วมเป็นส่วนหนึ่งของชุมชนมหิดลลำปาง</h2>
          <p className="text-white/70 text-base mb-8 max-w-[520px] mx-auto">
            สมัครร่วมกิจกรรม โครงการวิจัย และเชื่อมต่อกับเครือข่ายนักวิจัยและชุมชนภาคเหนือ
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => navigate("login")}
              className="px-7 py-3 rounded-xl bg-[#D6A84F] text-[#123B63] font-semibold text-sm hover:bg-[#c49840] transition-colors min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              ลงทะเบียนเข้าใช้งาน
            </button>
            <button
              onClick={() => navigate("activities")}
              className="px-7 py-3 rounded-xl border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              ดูกิจกรรม
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
