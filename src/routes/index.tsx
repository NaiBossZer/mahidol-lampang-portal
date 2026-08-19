import { useState } from 'react';
import { 
  Zap, TreePine, Sprout, ArrowUpRight, Search, Globe, ChevronRight, 
  MapPin, ShieldCheck, Newspaper, Award, Users, ChevronLeft, Menu, X 
} from 'lucide-react';

// URL ของแต่ละ Repo ที่ Deploy แล้ว
const BASE_URLS = {
  LAC: "https://mahidol-rac.vercel.app", // Repo: mahidol-rac (ฐานครั่ง)
  ENERGY: "https://mahidol-clean-energy.vercel.app", // Repo: mahidol-clean-energy (ฐานพลังงาน)
  AGRI: "#" // ฐานเกษตร
};

export default function MahidolLampangHub() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans selection:bg-blue-600 selection:text-white scroll-smooth">
      
      {/* 1. TOP HEADER / NAVBAR (สไตล์ PEA VOLTA Header) */}
      <header className="sticky top-0 z-50 bg-indigo-950 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
          
          {/* Logo & Portal Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-indigo-950 flex items-center justify-center font-black text-xl shadow">
              M
            </div>
            <div>
              <span className="font-bold text-base md:text-lg tracking-tight block leading-none">
                MAHIDOL LAMPANG
              </span>
              <span className="text-[10px] text-indigo-200 tracking-wider font-light">
                ศูนย์การเรียนรู้ มหาวิทยาลัยมหิดล ลำปาง
              </span>
            </div>
          </div>

          {/* Nav Menu (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-indigo-100">
            <a href="#hero" className="hover:text-amber-300 transition">หน้าแรก</a>
            <a href="#bases" className="hover:text-amber-300 transition">ฐานการเรียนรู้</a>
            <a href="#stats" className="hover:text-amber-300 transition">สถิติและเครือข่าย</a>
            <a href="#testimonials" className="hover:text-amber-300 transition">เสียงจากผู้ใช้บริการ</a>
            <a href="#partners" className="hover:text-amber-300 transition">พันธมิตร</a>
            <a href="#news" className="hover:text-amber-300 transition">ข่าวสาร & กิจกรรม</a>
          </nav>

          {/* Search Icon & Mobile Menu Button */}
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-indigo-900 rounded-full transition" aria-label="Search">
              <Search className="w-4 h-4 text-indigo-200" />
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-indigo-900 rounded-full transition text-indigo-200"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-indigo-900 border-t border-indigo-800 px-4 py-3 space-y-2 text-xs font-medium">
            <a href="#hero" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 hover:text-amber-300">หน้าแรก</a>
            <a href="#bases" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 hover:text-amber-300">ฐานการเรียนรู้</a>
            <a href="#stats" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 hover:text-amber-300">สถิติและเครือข่าย</a>
            <a href="#testimonials" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 hover:text-amber-300">เสียงจากผู้ใช้บริการ</a>
            <a href="#partners" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 hover:text-amber-300">พันธมิตร</a>
            <a href="#news" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 hover:text-amber-300">ข่าวสาร & กิจกรรม</a>
          </div>
        )}
      </header>

      {/* 2. HERO BANNER SECTION */}
      <section id="hero" className="max-w-7xl mx-auto px-4 md:px-8 pt-8 pb-12">
        <div className="bg-gradient-to-r from-indigo-50 via-sky-50 to-indigo-100 rounded-3xl p-8 md:p-12 border border-indigo-100 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="space-y-4 max-w-xl text-center md:text-left z-10">
            <span className="inline-block bg-indigo-900 text-white text-[11px] font-semibold px-3.5 py-1 rounded-full uppercase tracking-wider">
              Mahidol Learning Hub
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold text-indigo-950 leading-tight">
              ศูนย์รวมองค์ความรู้ นวัตกรรม และพลังงานสะอาดเพื่อชุมชน
            </h1>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              เชื่อมโยงระบบสารสนเทศ งานวิจัยครั่ง พลังงานโซลาร์เซลล์ และเกษตรกรรมอัจฉริยะ ยกระดับการบริการวิชาการ มหาวิทยาลัยมหิดล อำเภอสบปราบ จังหวัดลำปาง
            </p>
            
            <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
              <a 
                href="#bases" 
                className="bg-indigo-900 hover:bg-indigo-800 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition flex items-center gap-2"
              >
                สำรวจฐานเรียนรู้ <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex justify-center z-10">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-indigo-50 max-w-sm w-full space-y-4 text-center">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto text-2xl font-black">
                ⚡
              </div>
              <h3 className="font-bold text-indigo-950 text-base">ระบบสนับสนุนการเรียนรู้</h3>
              <p className="text-xs text-slate-500">
                เข้าถึงข้อมูลสถิติการผลิตไฟฟ้า Real-time คลังงานวิจัยครั่ง และระบบลงทะเบียนใช้บริการ
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. CARD BASES SECTION */}
      <section id="bases" className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-black text-indigo-950">
            ฐานการเรียนรู้และระบบปฏิบัติการ
          </h2>
          <p className="text-xs text-slate-500">
            เลือกเข้าชมระบบสารสนเทศเจาะลึกแยกตามฐานการเรียนรู้
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* CARD 1: ฐานครั่ง */}
          <a 
            href={BASE_URLS.LAC}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <TreePine className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">ฐานที่ 1</span>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-rose-600 transition">
                  ฐานเรียนรู้ครั่ง
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  รวบรวมองค์ความรู้การเลี้ยงครั่ง งานวิจัยการแปรรูป ตลาดครั่ง และระบบสนับสนุนเศรษฐกิจชุมชน
                </p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-rose-600">
              <span>เข้าสู่ระบบ `mahidol-rac`</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </a>

          {/* CARD 2: ฐานพลังงาน */}
          <a 
            href={BASE_URLS.ENERGY}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">ฐานที่ 2</span>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition">
                  ฐานพลังงานสะอาด
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  ติดตาม Solar Data (อาคารสำนักงาน & โรงจอดรถ), ระบบจอง EV Charger และคลังความรู้โซลาร์เซลล์
                </p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
              <span>เข้าสู่ระบบ `mahidol-clean-energy`</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </a>

          {/* CARD 3: ฐานเกษตร */}
          <div className="bg-slate-100 rounded-2xl border border-slate-200 p-6 opacity-75 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ฐานที่ 3</span>
                <h3 className="text-lg font-bold text-slate-800">
                  ฐานเกษตรอัจฉริยะ
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  ระบบบริหารจัดการ Smart Farm แปลงสาธิตเกษตรกรรม และระบบตรวจวัดสภาพแวดล้อม
                </p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-400">
              <span>กำลังพัฒนาระบบ</span>
              <span>Coming Soon</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4. STATS COUNTER SECTION */}
      <section id="stats" className="max-w-7xl mx-auto px-4 md:px-8 py-12 text-center space-y-8">
        <h2 className="text-2xl font-black text-indigo-950">
          ศักยภาพและสถิติภาพรวมศูนย์
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-1">
            <p className="text-xs font-bold text-indigo-900 uppercase">กำลังการผลิตไฟฟ้ารวม</p>
            <p className="text-4xl md:text-5xl font-black text-purple-700">18.00+</p>
            <p className="text-xs text-slate-400">kWp (โซลาร์เซลล์)</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold text-indigo-900 uppercase">ฐานเรียนรู้และวิจัย</p>
            <p className="text-4xl md:text-5xl font-black text-purple-700">3</p>
            <p className="text-xs text-slate-400">ฐานการเรียนรู้หลัก</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold text-indigo-900 uppercase">พื้นที่บริการวิชาการ</p>
            <p className="text-4xl md:text-5xl font-black text-purple-700">สบปราบ</p>
            <p className="text-xs text-slate-400">จ.ลำปาง</p>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION */}
      <section id="testimonials" className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-6">
        <div className="border-l-4 border-rose-600 pl-3">
          <h2 className="text-lg font-bold text-indigo-950">Testimonials</h2>
          <p className="text-xs text-slate-500">เสียงสะท้อนจากผู้ใช้บริการและเกษตรกรในพื้นที่</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "นายสมชาย ใจดี", role: "เกษตรกรผู้เลี้ยงครั่ง อ.สบปราบ", text: "ได้ความรู้เรื่องการดูแลครั่งและเทคนิคใหม่ๆ จากศูนย์ นำไปปรับใช้ได้จริงเพิ่มผลผลิตได้มาก" },
            { name: "ดร.วิภาดา เรียนงาม", role: "นักวิจัยด้านพลังงาน", text: "ระบบแสดงข้อมูล Solar Data ชัดเจน เข้าถึงง่าย เหมาะสำหรับการศึกษาวิจัยต่อยอด" },
            { name: "นายอนันต์ ยอดเพชร", role: "ผู้ใช้บริการสถานีชาร์จ EV", text: "จองคิวชาร์จไฟผ่านเว็บสะดวกมาก สถานีสะอาดและปลอดภัย ถือเป็นจุดพักรถที่ดีเยี่ยม" },
            { name: "นางสาวณิชา พรหมสุข", role: "นักศึกษาลงพื้นที่ศึกษาดูงาน", text: "ฐานเรียนรู้จัดหมวดหมู่อย่างเป็นระบบ เว็บไซต์ใช้งานง่าย ได้ข้อมูลครบถ้วน" },
          ].map((item, idx) => (
            <div key={idx} className="bg-rose-50/50 p-5 rounded-2xl border border-rose-100 space-y-3">
              <div className="w-10 h-10 rounded-full bg-slate-300 mx-auto flex items-center justify-center font-bold text-slate-600 text-xs">
                USER
              </div>
              <div className="text-center space-y-1">
                <h4 className="font-bold text-xs text-indigo-950">{item.name}</h4>
                <p className="text-[10px] text-indigo-800 font-medium">{item.role}</p>
                <p className="text-[11px] text-slate-600 leading-relaxed pt-2 border-t border-rose-100">
                  "{item.text}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. PARTNERS SECTION */}
      <section id="partners" className="max-w-7xl mx-auto px-4 md:px-8 py-10 text-center space-y-6">
        <h2 className="text-xl font-bold text-indigo-950">พันธมิตรของเรา</h2>
        
        <div className="flex flex-wrap items-center justify-center gap-8 opacity-75">
          <div className="h-12 w-28 bg-slate-200 rounded-lg flex items-center justify-center font-bold text-xs text-slate-500">
            มหาวิทยาลัยมหิดล
          </div>
          <div className="h-12 w-28 bg-slate-200 rounded-lg flex items-center justify-center font-bold text-xs text-slate-500">
            อบต.สบปราบ
          </div>
          <div className="h-12 w-28 bg-slate-200 rounded-lg flex items-center justify-center font-bold text-xs text-slate-500">
            กฟภ. (PEA)
          </div>
          <div className="h-12 w-28 bg-slate-200 rounded-lg flex items-center justify-center font-bold text-xs text-slate-500">
            กระทรวง อว.
          </div>
        </div>
      </section>

      {/* 7. NEWS & ACTIVITIES SECTION */}
      <section id="news" className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-6">
        <div className="border-l-4 border-indigo-900 pl-3">
          <h2 className="text-lg font-bold text-indigo-950">News & Activities</h2>
          <p className="text-xs text-slate-500">ข่าวสารและกิจกรรมล่าสุดจากศูนย์มหิดล ลำปาง</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "อบรมเทคนิคการเลี้ยงครั่งยั่งยืนประจำปี 2026", date: "15 สิงหาคม 2026", desc: "ขอเชิญเกษตรกรเข้าร่วมอบรมเชิงปฏิบัติการพัฒนาคุณภาพผลผลิตครั่ง..." },
            { title: "เปิดให้บริการจุดชาร์จ EV Charger Solar Carport", date: "1 สิงหาคม 2026", desc: "เปิดทดสอบระบบสถานีชาร์จพลังงานสะอาดสำหรับรถยนต์ไฟฟ้า..." },
            { title: "ต้อนรับคณะศึกษาดูงานด้านพลังงานและเกษตรกรรม", date: "25 กรกฎาคม 2026", desc: "ศูนย์มหิดลลำปางต้อนรับคณะผู้บริหารและนักเรียนในการเข้าชมฐานเรียนรู้..." },
            { title: "สรุปผลการลดการปล่อยก๊าซคาร์บอนประจำไตรมาส", date: "10 กรกฎาคม 2026", desc: "เปิดเผยสถิติการผลิตไฟฟ้าจากพลังงานแสงอาทิตย์ช่วยลดคาร์บอน..." },
          ].map((news, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition space-y-3 p-3">
              <div className="aspect-video bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-medium text-xs">
                News Image
              </div>
              <div className="space-y-1 p-1">
                <span className="text-[10px] text-indigo-600 font-semibold">{news.date}</span>
                <h4 className="font-bold text-xs text-slate-900 line-clamp-2">{news.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{news.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-indigo-950 text-indigo-200 text-xs py-8 border-t border-indigo-900">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center space-y-2">
          <p>© 2026 Mahidol University Lampang Center. All rights reserved.</p>
          <p className="text-[10px] text-indigo-400">ศูนย์การเรียนรู้ วิจัย และบริการวิชาการ มหาวิทยาลัยมหิดล อ.สบปราบ จ.ลำปาง</p>
        </div>
      </footer>

    </div>
  );
}
