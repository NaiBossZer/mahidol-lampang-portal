import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { 
  Zap, TreePine, Sprout, ArrowUpRight, Search, ChevronRight, 
  ChevronLeft, Menu, X, BookOpen, Clock, PlayCircle
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

// ข้อมูลรูปภาพแบนเนอร์
const SLIDES = [
  {
    id: 1,
    image: '/banner1.jpg',
    title: 'Mahidol University Lampang Hub',
    subtitle: 'ศูนย์รวมองค์ความรู้ งานวิจัยนวัตกรรม และพลังงานสะอาดเพื่อชุมชน',
    buttonText: 'สำรวจคลังความรู้',
    buttonLink: '#knowledge-hub',
  },
  {
    id: 2,
    image: '/banner2.jpg',
    title: 'Sustainable Future Starts Here',
    subtitle: 'ยกระดับการบริการวิชาการ มหาวิทยาลัยมหิดล อำเภอสบปราบ จังหวัดลำปาง',
    buttonText: 'ฐานการเรียนรู้',
    buttonLink: '#bases',
  },
  {
    id: 3,
    image: '/banner3.jpg',
    title: 'Smart Learning & Innovation',
    subtitle: 'เชื่อมโยงระบบสารสนเทศ งานวิจัยครั่ง พลังงานโซลาร์เซลล์ และเกษตรกรรมอัจฉริยะ',
    buttonText: 'เกี่ยวกับเรา',
    buttonLink: '#about-video',
  },
];

// ข้อมูล Knowledge Cards (Vercel / Bento Grid Architecture)
const KNOWLEDGE_ARTICLES = [
  {
    id: 1,
    category: 'ครั่ง',
    badgeClass: 'bg-rose-50 text-[#9F1239] border-rose-200',
    title: 'การแปรรูปครั่งสู่ผลิตภัณฑ์ชีวภาพมูลค่าสูง',
    snippet: 'นวัตกรรมการสกัดสารจากครั่งธรรมชาติ เพื่อนำไปใช้ในอุตสาหกรรมทางการแพทย์ อาหาร และการเกษตรเชิงพาณิชย์...',
    readTime: '3 นาที',
    author: 'งานวิจัยครั่ง',
    link: BASE_URLS.LAC,
  },
  {
    id: 2,
    category: 'พลังงาน',
    badgeClass: 'bg-amber-50 text-[#D97706] border-amber-200',
    title: 'ติดตาม Real-time Solar Data อาคารสำนักงาน',
    snippet: 'ระบบ Smart Meter ตรวจวัดกำลังการผลิตไฟฟ้าจากแผงโซลาร์เซลล์และสถิติการลดก๊าซเรือนกระจกรายวัน...',
    readTime: '2 นาที',
    author: 'ศูนย์พลังงาน',
    link: BASE_URLS.ENERGY,
  },
  {
    id: 3,
    category: 'เกษตร',
    badgeClass: 'bg-emerald-50 text-[#059669] border-emerald-200',
    title: 'การบริหารจัดการระบบ Smart Farm ในพื้นที่แห้งแล้ง',
    snippet: 'การปรับใช้ไอโอที (IoT) และเซนเซอร์วัดความชื้นดินเพื่อการรดน้ำแปลงสาธิตเกษตรกรรมแม่นยำสูง...',
    readTime: '4 นาที',
    author: 'เกษตรอัจฉริยะ',
    link: '#',
  },
];

function MahidolLampangHub() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด');

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  const nextSlide = () => setCurrentSlide((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));

  const filteredArticles = activeCategory === 'ทั้งหมด' 
    ? KNOWLEDGE_ARTICLES 
    : KNOWLEDGE_ARTICLES.filter(item => item.category === activeCategory);

  return (
    <div className="font-['Prompt'] bg-[#F8FAFC] min-h-screen text-slate-800 selection:bg-[#002D62] selection:text-white scroll-smooth antialiased">
      
      {/* 1. TOP HEADER / NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#002D62] text-white shadow-md border-b border-blue-900/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-2.5 flex justify-between items-center">
          
          {/* Logo Section */}
          <div className="flex items-center gap-2 md:gap-3">
            <img src="/envi-logo.jpg" alt="Envi Mahidol Logo" className="h-9 md:h-11 object-contain bg-white rounded p-0.5" />
            <img src="/mahidol-logo.png" alt="Mahidol Logo" className="h-9 md:h-11 object-contain bg-white rounded p-0.5" />
            <img src="/social-engagement-logo.png" alt="Social Engagement Logo" className="h-9 md:h-11 object-contain bg-white rounded p-0.5" />

            <div className="h-8 w-[1px] bg-blue-800/80 hidden sm:block mx-1" />

            <div className="hidden xl:block">
              <span className="font-bold text-xs md:text-sm tracking-tight block leading-tight text-white">
                งานพันธกิจเพื่อสังคม สำนักงานวิจัยและวิทยบริการ
              </span>
              <span className="text-[10px] text-[#F2A900] font-normal block leading-tight">
                คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล จังหวัดลำปาง
              </span>
            </div>
          </div>

          {/* Nav Menu (Desktop) */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-slate-100">
            <a href="#hero" className="hover:text-[#F2A900] transition">หน้าแรก</a>
            <a href="#knowledge-hub" className="hover:text-[#F2A900] transition">คลังความรู้</a>
            <a href="#bases" className="hover:text-[#F2A900] transition">ฐานการเรียนรู้</a>
            <a href="#about-video" className="hover:text-[#F2A900] transition">เกี่ยวกับเรา</a>
            <a href="#stats" className="hover:text-[#F2A900] transition">สถิติ</a>
            <a href="#testimonials" className="hover:text-[#F2A900] transition">เสียงสะท้อน</a>
            <a href="#partners" className="hover:text-[#F2A900] transition">พันธมิตร</a>
            <a href="#news" className="hover:text-[#F2A900] transition">ข่าวสาร</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-blue-900 rounded-full transition" aria-label="Search">
              <Search className="w-4 h-4 text-slate-200" />
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-blue-900 rounded-full transition text-slate-200"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#001f44] border-t border-blue-900 px-4 py-3 space-y-2 text-xs font-medium">
            <a href="#hero" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 hover:text-[#F2A900]">หน้าแรก</a>
            <a href="#knowledge-hub" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 hover:text-[#F2A900]">คลังความรู้</a>
            <a href="#bases" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 hover:text-[#F2A900]">ฐานการเรียนรู้</a>
            <a href="#about-video" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 hover:text-[#F2A900]">เกี่ยวกับเรา</a>
            <a href="#stats" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 hover:text-[#F2A900]">สถิติ</a>
            <a href="#testimonials" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 hover:text-[#F2A900]">เสียงสะท้อน</a>
            <a href="#partners" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 hover:text-[#F2A900]">พันธมิตร</a>
            <a href="#news" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 hover:text-[#F2A900]">ข่าวสาร</a>
          </div>
        )}
      </header>

      {/* 2. HERO SLIDER BANNER SECTION */}
      <section id="hero" className="relative w-full h-[450px] md:h-[520px] overflow-hidden bg-slate-900">
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${slide.image}')` }}
            >
              <div className="absolute inset-0 bg-[#002D62]/40 bg-gradient-to-t from-[#002D62] via-slate-900/40 to-black/30" />
            </div>

            <div className="relative z-20 max-w-7xl mx-auto h-full px-6 md:px-12 flex flex-col justify-center items-center text-center text-white space-y-4">
              <span className="bg-[#F2A900] text-[#002D62] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                Mahidol Learning Hub
              </span>
              <h1 className="text-2xl md:text-5xl font-extrabold tracking-tight drop-shadow-md max-w-4xl leading-tight">
                {slide.title}
              </h1>
              <p className="text-sm md:text-base text-slate-200 max-w-2xl drop-shadow font-normal leading-relaxed">
                {slide.subtitle}
              </p>
              <div className="pt-4">
                <a
                  href={slide.buttonLink}
                  className="bg-[#002D62] border border-blue-400/30 hover:bg-blue-900 text-white font-semibold text-xs md:text-sm px-7 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition flex items-center gap-2"
                >
                  {slide.buttonText} <ChevronRight className="w-4 h-4 text-[#F2A900]" />
                </a>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm transition"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm transition"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-8 bg-[#F2A900]' : 'w-2.5 bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 3. KNOWLEDGE HUB SECTION */}
      <section id="knowledge-hub" className="max-w-7xl mx-auto px-4 md:px-8 py-14 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#F2A900] bg-blue-50 px-3 py-1 rounded-md w-fit border border-blue-100 mb-2">
              <BookOpen className="w-3.5 h-3.5 text-[#002D62]" /> KNOWLEDGE REPOSITORY
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#002D62]">
              คลังความรู้และงานวิจัย
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-normal">
              ย่อยองค์ความรู้ นวัตกรรม และผลการดำเนินงานเพื่อการเรียนรู้ของชุมชน
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {['ทั้งหมด', 'ครั่ง', 'พลังงาน', 'เกษตร'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs font-medium px-4 py-2 rounded-xl transition-all border ${
                  activeCategory === cat
                    ? 'bg-[#002D62] text-white border-[#002D62] shadow-md'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat === 'ทั้งหมด' ? 'ทั้งหมด' : `ฐาน${cat}`}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <div 
              key={article.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-video overflow-hidden bg-slate-100 flex items-center justify-center">
                  <img src="/banner1.jpg" alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className={`absolute top-3 left-3 text-[10px] font-semibold px-3 py-1 rounded-full border shadow-sm ${article.badgeClass}`}>
                    ฐาน{article.category}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2 font-normal">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
                    <span>•</span>
                    <span>{article.author}</span>
                  </div>
                  <h3 className="text-base font-semibold text-[#002D62] line-clamp-2 hover:text-[#F2A900] transition-colors cursor-pointer leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 mt-2 font-normal leading-relaxed">
                    {article.snippet}
                  </p>
                </div>
              </div>

              <a 
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#002D62] hover:bg-blue-50/50 transition"
              >
                <span>อ่านเนื้อหาฉบับเต็ม</span>
                <ArrowUpRight className="w-4 h-4 text-[#F2A900] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 4. BENTO BASES SECTION */}
      <section id="bases" className="bg-white py-14 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-[#002D62]">
              ฐานการเรียนรู้และระบบปฏิบัติการ
            </h2>
            <p className="text-xs text-slate-500 font-normal">
              เข้าใช้งานระบบสารสนเทศเจาะลึกเฉพาะทางของแต่ละฐานเรียนรู้
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* CARD 1: ฐานครั่ง */}
            <a 
              href={BASE_URLS.LAC}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#F8FAFC] rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-[#9F1239] border border-rose-100 flex items-center justify-center font-bold">
                  <TreePine className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#9F1239] uppercase tracking-wider">ฐานที่ 1</span>
                  <h3 className="text-lg font-semibold text-[#002D62] group-hover:text-[#9F1239] transition">
                    ฐานเรียนรู้ครั่ง
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed font-normal">
                    รวบรวมองค์ความรู้การเลี้ยงครั่ง งานวิจัยการแปรรูป ตลาดครั่ง และระบบสนับสนุนเศรษฐกิจชุมชน
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-[#9F1239]">
                <span>เข้าสู่ระบบ `mahidol-shellac`</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </a>

            {/* CARD 2: ฐานพลังงาน */}
            <a 
              href={BASE_URLS.ENERGY}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#F8FAFC] rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#D97706] border border-amber-100 flex items-center justify-center font-bold">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#D97706] uppercase tracking-wider">ฐานที่ 2</span>
                  <h3 className="text-lg font-semibold text-[#002D62] group-hover:text-[#D97706] transition">
                    ฐานพลังงานสะอาด
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed font-normal">
                    ติดตาม Solar Data (อาคารสำนักงาน & โรงจอดรถ), ระบบจอง EV Charger และคลังความรู้โซลาร์เซลล์
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-[#D97706]">
                <span>เข้าสู่ระบบ `mahidol-clean-energy`</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </a>

            {/* CARD 3: ฐานเกษตร */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 opacity-75 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#059669] border border-emerald-100 flex items-center justify-center font-bold">
                  <Sprout className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ฐานที่ 3</span>
                  <h3 className="text-lg font-semibold text-slate-700">
                    ฐานเกษตรอัจฉริยะ
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed font-normal">
                    ระบบบริหารจัดการ Smart Farm แปลงสาธิตเกษตรกรรม และระบบตรวจวัดสภาพแวดล้อม
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>กำลังพัฒนาระบบ</span>
                <span>Coming Soon</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. GET TO KNOW US SECTION (VIDEO) */}
      <section id="about-video" className="py-14 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center space-y-6">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#002D62]">
            <PlayCircle className="w-4 h-4 text-[#F2A900]" /> VIDEO PRESENTATION
          </div>
          <h2 className="text-2xl font-bold text-[#002D62]">
            GET TO KNOW US : ศูนย์การเรียนรู้ มหิดล ลำปาง
          </h2>

          <div className="relative w-full rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-black aspect-video">
            <video 
              controls 
              preload="metadata"
              className="w-full h-full object-cover"
              poster="/banner1.jpg"
            >
              <source src="/intro-enlp.mp4" type="video/mp4" />
              เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอ
            </video>
          </div>
        </div>
      </section>

      {/* 6. STATS COUNTER SECTION */}
      <section id="stats" className="max-w-7xl mx-auto px-4 md:px-8 py-14 text-center space-y-8">
        <h2 className="text-2xl font-bold text-[#002D62]">
          ศักยภาพและสถิติภาพรวมศูนย์
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase">กำลังการผลิตไฟฟ้ารวม</p>
            <p className="text-4xl md:text-5xl font-extrabold text-[#002D62]">18.00+</p>
            <p className="text-xs text-[#F2A900] font-semibold">kWp (โซลาร์เซลล์)</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase">ฐานเรียนรู้และวิจัย</p>
            <p className="text-4xl md:text-5xl font-extrabold text-[#002D62]">3</p>
            <p className="text-xs text-slate-400 font-normal">ฐานการเรียนรู้หลัก</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase">พื้นที่บริการวิชาการ</p>
            <p className="text-4xl md:text-5xl font-extrabold text-[#002D62]">สบปราบ</p>
            <p className="text-xs text-slate-400 font-normal">จ.ลำปาง</p>
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS SECTION */}
      <section id="testimonials" className="bg-white py-14 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
          <div className="border-l-4 border-[#F2A900] pl-3">
            <h2 className="text-lg font-bold text-[#002D62]">Testimonials</h2>
            <p className="text-xs text-slate-500 font-normal">เสียงสะท้อนจากผู้ใช้บริการและเกษตรกรในพื้นที่</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "นายสมชาย ใจดี", role: "เกษตรกรผู้เลี้ยงครั่ง อ.สบปราบ", text: "ได้ความรู้เรื่องการดูแลครั่งและเทคนิคใหม่ๆ จากศูนย์ นำไปปรับใช้ได้จริงเพิ่มผลผลิตได้มาก" },
              { name: "ดร.วิภาดา เรียนงาม", role: "นักวิจัยด้านพลังงาน", text: "ระบบแสดงข้อมูล Solar Data ชัดเจน เข้าถึงง่าย เหมาะสำหรับการศึกษาวิจัยต่อยอด" },
              { name: "นายอนันต์ ยอดเพชร", role: "ผู้ใช้บริการสถานีชาร์จ EV", text: "จองคิวชาร์จไฟผ่านเว็บสะดวกมาก สถานีสะอาดและปลอดภัย ถือเป็นจุดพักรถที่ดีเยี่ยม" },
              { name: "นางสาวณิชา พรหมสุข", role: "นักศึกษาลงพื้นที่ศึกษาดูงาน", text: "ฐานเรียนรู้จัดหมวดหมู่อย่างเป็นระบบ เว็บไซต์ใช้งานง่าย ได้ข้อมูลครบถ้วน" },
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="w-10 h-10 rounded-full bg-[#002D62] text-white mx-auto flex items-center justify-center font-bold text-xs">
                  MU
                </div>
                <div className="text-center space-y-1">
                  <h4 className="font-semibold text-xs text-[#002D62]">{item.name}</h4>
                  <p className="text-[10px] text-amber-600 font-medium">{item.role}</p>
                  <p className="text-[11px] text-slate-600 leading-relaxed pt-2 border-t border-slate-200 font-normal">
                    "{item.text}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. PARTNERS SECTION */}
      <section id="partners" className="bg-[#F8FAFC] py-14 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-[#002D62] bg-blue-50 px-3 py-1 rounded-md border border-blue-100 uppercase tracking-wider">
              Network & Collaboration
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-[#002D62] pt-2">
              พันธมิตรและความร่วมมือ
            </h2>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 pt-2">
            {/* Partner 1 */}
            <div className="flex flex-col items-center gap-2 group">
              <div className="h-20 w-20 md:h-24 md:w-24 bg-white rounded-2xl p-3 shadow-sm border border-slate-200 flex items-center justify-center group-hover:shadow-md group-hover:border-blue-200 transition-all">
                <img src="/partner-creasia.png" alt="Creasia Group" className="max-h-full max-w-full object-contain" />
              </div>
              <span className="text-xs font-medium text-slate-700 group-hover:text-[#002D62] transition">Creasia Group</span>
            </div>

            {/* Partner 2 */}
            <div className="flex flex-col items-center gap-2 group">
              <div className="h-20 w-20 md:h-24 md:w-24 bg-white rounded-2xl p-3 shadow-sm border border-slate-200 flex items-center justify-center group-hover:shadow-md group-hover:border-blue-200 transition-all">
                <img src="/partner-pao-lampang.png" alt="องค์การบริหารส่วนจังหวัดลำปาง" className="max-h-full max-w-full object-contain" />
              </div>
              <span className="text-xs font-medium text-slate-700 group-hover:text-[#002D62] transition">อบจ. ลำปาง</span>
            </div>

            {/* Partner 3 */}
            <div className="flex flex-col items-center gap-2 group">
              <div className="h-20 w-20 md:h-24 md:w-24 bg-white rounded-2xl p-3 shadow-sm border border-slate-200 flex items-center justify-center group-hover:shadow-md group-hover:border-blue-200 transition-all">
                <img src="/partner-maekua.jpg" alt="อบต. แม่กัวะ อ.สบปราบ จ.ลำปาง" className="max-h-full max-w-full object-contain" />
              </div>
              <span className="text-xs font-medium text-slate-700 group-hover:text-[#002D62] transition">อบต. แม่กัวะ</span>
            </div>

{/* Partner 4: กรมส่งเสริมการเกษตร */}
<div className="flex flex-col items-center gap-2 group">
  <div className="h-20 w-20 md:h-24 md:w-24 bg-white rounded-2xl p-3 shadow-sm border border-slate-200 flex items-center justify-center group-hover:shadow-md group-hover:border-blue-200 transition-all">
    <img 
      src="/partner-DOAE.png" 
      alt="กรมส่งเสริมการเกษตร" 
      className="max-h-full max-w-full object-contain"
    />
  </div>
  <span className="text-xs font-medium text-slate-700 group-hover:text-[#002D62] transition">กรมส่งเสริมการเกษตร</span>
</div>

      {/* 9. NEWS & ACTIVITIES SECTION */}
      <section id="news" className="max-w-7xl mx-auto px-4 md:px-8 py-14 space-y-6">
        <div className="border-l-4 border-[#002D62] pl-3">
          <h2 className="text-lg font-bold text-[#002D62]">News & Activities</h2>
          <p className="text-xs text-slate-500 font-normal">ข่าวสารและกิจกรรมล่าสุดจากศูนย์มหิดล ลำปาง</p>
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
                <span className="text-[10px] text-[#002D62] font-semibold">{news.date}</span>
                <h4 className="font-semibold text-xs text-slate-900 line-clamp-2">{news.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-normal">{news.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#002D62] text-slate-300 text-xs py-8 border-t border-blue-900">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center space-y-2 font-normal">
          <p>© 2026 Mahidol University Lampang Center. All rights reserved.</p>
          <p className="text-[10px] text-[#F2A900]">ศูนย์การเรียนรู้ วิจัย และบริการวิชาการ มหาวิทยาลัยมหิดล อ.สบปราบ จ.ลำปาง</p>
        </div>
      </footer>

    </div>
  );
}

export default MahidolLampangHub;
