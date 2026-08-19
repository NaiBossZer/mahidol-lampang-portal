import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { 
  Zap, TreePine, Sprout, ArrowUpRight, Search, Globe, ChevronRight, 
  MapPin, ShieldCheck, Newspaper, Award, Users, ChevronLeft, Menu, X 
} from 'lucide-react';

export const Route = createFileRoute('/')({
  component: MahidolLampangHub,
});

// URL ของแต่ละ Repo
const BASE_URLS = {
  LAC: "https://mahidol-shellac.vercel.app",
  ENERGY: "https://mahidol-clean-energy.vercel.app",
  AGRI: "#"
};

// ข้อมูลรูปภาพที่จะนำไปวางในโฟลเดอร์ public/
const SLIDES = [
  {
    id: 1,
    image: '/banner1.jpg', // นำไฟล์ภาพชื่อ banner1.jpg ไปใส่ในโฟลเดอร์ public
    title: 'Mahidol University Lampang Center',
    subtitle: 'ศูนย์รวมองค์ความรู้ นวัตกรรม และพลังงานสะอาดเพื่อชุมชน',
    buttonText: 'สำรวจฐานเรียนรู้',
    buttonLink: '#bases',
  },
  {
    id: 2,
    image: '/banner2.jpg', // นำไฟล์ภาพชื่อ banner2.jpg ไปใส่ในโฟลเดอร์ public
    title: 'Sustainable Future Starts Here',
    subtitle: 'ยกระดับการบริการวิชาการ มหาวิทยาลัยมหิดล อำเภอสบปราบ จังหวัดลำปาง',
    buttonText: 'สถิติภาพรวม',
    buttonLink: '#stats',
  },
  {
    id: 3,
    image: '/banner3.jpg', // นำไฟล์ภาพชื่อ banner3.jpg ไปใส่ในโฟลเดอร์ public
    title: 'Smart Learning & Innovation',
    subtitle: 'เชื่อมโยงระบบสารสนเทศ งานวิจัยครั่ง พลังงานโซลาร์เซลล์ และเกษตรกรรมอัจฉริยะ',
    buttonText: 'ข่าวสารและกิจกรรม',
    buttonLink: '#news',
  },
];

function MahidolLampangHub() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // ระบบเปลี่ยนภาพอัตโนมัติทุกๆ 5 วินาที
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(slideInterval);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans selection:bg-blue-600 selection:text-white scroll-smooth">
      
{/* 1. TOP HEADER / NAVBAR */}
      <header className="sticky top-0 z-50 bg-indigo-950 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-2.5 flex justify-between items-center">
          
          {/* Logo Section ด้านซ้าย (รวม 3 โลโก้) */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* โลโก้ที่ 1: Envi Mahidol */}
            <img 
              src="/envi-logo.png" 
              alt="Envi Mahidol Logo" 
              className="h-8 md:h-10 object-contain"
            />

            {/* โลโก้ที่ 2: คณะสิ่งแวดล้อมฯ มหาวิทยาลัยมหิดล */}
            <img 
              src="/mahidol-logo.png" 
              alt="Faculty of Environment Logo" 
              className="h-8 md:h-10 object-contain bg-white rounded p-0.5"
            />

            {/* โลโก้ที่ 3: งานพันธกิจเพื่อสังคม */}
            <img 
              src="/social-engagement-logo.png" 
              alt="Social Engagement Lampang Logo" 
              className="h-8 md:h-10 object-contain bg-white rounded p-0.5"
            />

            {/* เส้นแบ่งแนวตั้ง */}
            <div className="h-7 w-[1px] bg-indigo-700/60 hidden sm:block mx-1" />

            {/* ข้อความชื่อศูนย์ */}
            <div className="hidden xl:block">
              <span className="font-bold text-sm tracking-tight block leading-none text-white">
                MAHIDOL LAMPANG
              </span>
              <span className="text-[10px] text-indigo-200 tracking-wider font-light">
                ศูนย์การเรียนรู้ มหาวิทยาลัยมหิดล ลำปาง
              </span>
            </div>
          </div>

          {/* Nav Menu (Desktop) */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-indigo-100">
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

      {/* 2. HERO SLIDER BANNER SECTION (สไตล์เว็บไซต์มหิดล) */}
      <section id="hero" className="relative w-full h-[450px] md:h-[550px] overflow-hidden bg-slate-900">
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${slide.image}')` }}
            >
              {/* Overlay เงาดำสำหรับทำให้อ่านตัวหนังสือได้ชัดขึ้น */}
              <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
            </div>

            {/* Banner Text Content */}
            <div className="relative z-20 max-w-7xl mx-auto h-full px-6 md:px-12 flex flex-col justify-center items-center text-center text-white space-y-4">
              <span className="bg-indigo-600/80 backdrop-blur-md text-white text-xs font-medium px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                Mahidol Learning Hub
              </span>
              <h1 className="text-2xl md:text-5xl font-extrabold tracking-tight drop-shadow-md max-w-4xl leading-tight">
                {slide.title}
              </h1>
              <p className="text-sm md:text-lg text-slate-200 max-w-2xl drop-shadow">
                {slide.subtitle}
              </p>
              <div className="pt-4">
                <a
                  href={slide.buttonLink}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs md:text-sm px-7 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition flex items-center gap-2"
                >
                  {slide.buttonText} <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        ))}

        {/* ปุ่มเลื่อนซ้าย-ขวา */}
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm transition"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm transition"
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
        </button>

        {/* จุด (Indicators) แสดงตำแหน่ง Slide */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-8 bg-emerald-500' : 'w-2.5 bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 3. CARD BASES SECTION */}
      <section id="bases" className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-8">
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
              <span>เข้าสู่ระบบ `mahidol-shellac`</span>
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

export default MahidolLampangHub;
