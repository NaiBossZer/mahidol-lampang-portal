import { useMemo, useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { 
  ArrowUpRight, 
  BookOpen, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  CloudSun, 
  Droplets, 
  FileText, 
  Leaf, 
  Search, 
  ShoppingCart, 
  Sprout, 
  Sun, 
  Thermometer, 
  Zap,
  Building2,
  Package,
  FileSignature,
  Trees,
  ChevronDown,
  House,
  Info,
  Users,
  GraduationCap,
  CalendarDays
} from "lucide-react";
import { toast } from "sonner";
import { CartProvider } from "../storefront/CartContext";
import { useCart } from "../storefront/useCart";
import { CartDrawer } from "../storefront/CartDrawer";
import { MOCK_PRODUCTS, type Product } from "../storefront/mockData";
import { EVBookingSection } from "../EVBookingSection";

// ข้อมูล 6 ภาพสไลด์แบนเนอร์
const HERO_SLIDES = [
  {
    id: 1,
    image: "/Banner 1.jpg",
    badge: "MAHIDOL SMART FARM HUB",
    title: "งานพันธกิจเพื่อสังคม",
    subtitle: "คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล อ.สบปราบ จ.ลำปาง",
    buttonText: "สำรวจแปลงเกษตร 3 มิติ",
    buttonLink: "#market",
  },
  {
    id: 2,
    image: "/Banner 2.jpg",
    badge: "ZONE 01 // SOIL MOISTURE IOT",
    title: "เซนเซอร์วัดความชื้นดิน",
    subtitle: "ตรวจวัดความชื้นในดินแบบเรียลไทม์ด้วยเซนเซอร์ IoT ทั่วแปลงสาธิต เพื่อการรดน้ำที่แม่นยำ",
    buttonText: "ดูข้อมูลความชื้นดิน",
    buttonLink: "#farm",
  },
  {
    id: 3,
    image: "/Banner 3.jpg",
    badge: "ZONE 02 // WEATHER STATION",
    title: "สถานีตรวจวัดสภาพอากาศ",
    subtitle: "บันทึกอุณหภูมิ ความชื้นอากาศ และปริมาณน้ำฝนตลอด 24 ชั่วโมง เพื่อวางแผนการเพาะปลูก",
    buttonText: "ดูข้อมูลสภาพอากาศ",
    buttonLink: "#farm",
  },
  {
    id: 4,
    image: "/Banner 4.jpg",
    badge: "ZONE 03 // AUTO IRRIGATION",
    title: "ระบบรดน้ำอัตโนมัติ",
    subtitle: "วาล์วน้ำอัจฉริยะสั่งงานอัตโนมัติตามค่าความชื้นดิน ลดการใช้น้ำและแรงงานในแปลงสาธิต",
    buttonText: "ดูระบบรดน้ำอัตโนมัติ",
    buttonLink: "#farm",
  },
  {
    id: 5,
    image: "/Banner 5.jpg",
    badge: "ZONE 04 // DIGITAL TWIN 3D",
    title: "โมเดลแปลงเกษตร 3 มิติ",
    subtitle: "สำรวจโครงสร้างแปลงสาธิตและตำแหน่งเซนเซอร์แบบ 360 องศาผ่านโมเดล 3 มิติเสมือนจริง",
    buttonText: "หมุนดูโมเดล 3 มิติ",
    buttonLink: "#farm",
  },
  {
    id: 6,
    image: "/Banner 6.jpg",
    badge: "ZONE 05 // REALTIME DASHBOARD",
    title: "แดชบอร์ดและการแจ้งเตือน",
    subtitle: "ติดตามค่าจากเซนเซอร์ทุกจุดและรับการแจ้งเตือนทันทีเมื่อค่าความชื้นหรืออุณหภูมิผิดปกติ",
    buttonText: "ดูสถิติแบบเรียลไทม์",
    buttonLink: "#farm",
  },
];

type Module = { label: string; title: string; description: string; href: string; icon: typeof Leaf; tone: string };
const modules: Module[] = [
  { label: "PORTAL", title: "ภาพรวมโครงการ", description: "ข่าวสาร กิจกรรมและบริการวิชาการ", href: "https://mahidol-lampang-portal.vercel.app", icon: Sprout, tone: "bg-[#002D62]" },
  { label: "SHELLAC", title: "ห้องเรียนรู้ครั่งครบวงจร", description: "งานวิจัย คู่มือและข้อมูลเปิด", href: "https://mahidol-insight-hub.vercel.app", icon: BookOpen, tone: "bg-[#80142B]" }, // สีครั่งแดง (Lac Red)
  { label: "SMART FARM", title: "เกษตรอัจฉริยะ", description: "ติดตามแปลงเพาะปลูกแบบเรียลไทม์", href: "https://mahidol-smart-farm.vercel.app", icon: Leaf, tone: "bg-[#2E7D32]" },
  { label: "CLEAN ENERGY", title: "พลังงานสะอาด", description: "วิเคราะห์การผลิตและคาร์บอนที่ลดได้", href: "https://mahidol-clean-energy.vercel.app", icon: Zap, tone: "bg-[#9b6a00]" },
  { label: "SHOPPING VEG", title: "ตลาดผักมหิดล", description: "ผลผลิตปลอดสารพิษจากแปลงวิจัย", href: "https://mulp-farm-fresh-market.vercel.app", icon: ShoppingCart, tone: "bg-[#1b8a43]" }, // สีเขียวผักสด (Fresh Green)
];

const knowledge = [
  { type: "RESEARCH", title: "การบริหารจัดการระบบ Smart Farm ในพื้นที่แห้งแล้ง", meta: "เกษตรอัจฉริยะ · 4 นาที", color: "text-[#2E7D32]" },
  { type: "GUIDE", title: "คู่มือการใช้งานและดูแลแปลงผักปลอดภัย", meta: "คู่มือเกษตร · ดาวน์โหลด PDF", color: "text-[#002D62]" },
  { type: "ENERGY", title: "รายงานผลการผลิตไฟฟ้าจาก Solar Rooftop", meta: "พลังงานสะอาด · 2 นาที", color: "text-[#9b6a00]" },
];

// การ์ดบริการหลัก 4 รายการ
const serviceCards = [
  {
    id: "meeting-rooms",
    title: "บริการห้องประชุม / ห้องพัก",
    desc: "ห้องประชุมสัมมนาพร้อมอุปกรณ์ทันสมัย และห้องพักสิ่งอำนวยความสะดวกครบครัน บรรยากาศเงียบสงบ",
    icon: Building2,
    tag: "ยอดนิยม",
    gradient: "from-blue-600 to-[#002D62]",
    badgeBg: "bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border-blue-200 hover:border-blue-600",
  },
  {
    id: "products",
    title: "ผลิตภัณฑ์โครงการ",
    desc: "สินค้าแปรรูปและผลิตภัณฑ์ที่เป็นมิตรต่อสิ่งแวดล้อมจากงานวิจัยและโครงการพัฒนาชุมชน",
    icon: Package,
    tag: "สินค้าชุมชน",
    gradient: "from-amber-500 to-orange-600",
    badgeBg: "bg-amber-50 text-amber-700 hover:bg-amber-600 hover:text-white border-amber-200 hover:border-amber-600",
  },
  {
    id: "forms",
    title: "แบบฟอร์มขอเช่าสถานที่",
    desc: "ดาวน์โหลดเอกสาร แบบฟอร์มคำขอ ยื่นเรื่องขอใช้สถานที่ อัตราค่าบริการ และขั้นตอนการขออนุมัติ",
    icon: FileSignature,
    tag: "ดาวน์โหลดเอกสาร",
    gradient: "from-emerald-600 to-teal-800",
    badgeBg: "bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border-emerald-200 hover:border-emerald-600",
  },
  {
    id: "farm-land",
    title: "บริการพื้นที่เช่าทำการเกษตร",
    desc: "เปิดให้เช่าแปลงเกษตรทดลอง เกษตรปลอดภัยเพื่อการเรียนรู้และวิจัยสำหรับเกษตรกรและประชาชน",
    icon: Trees,
    tag: "พื้นที่ส่งเสริม",
    gradient: "from-green-600 to-lime-700",
    badgeBg: "bg-green-50 text-green-700 hover:bg-green-600 hover:text-white border-green-200 hover:border-green-600",
  },
];

function CartButton() {
  const { totalItems, setIsCartOpen } = useCart();
  return (
    <button onClick={() => setIsCartOpen(true)} className="relative rounded-xl border border-white/20 p-2.5 transition hover:bg-white/10" aria-label="เปิดรถเข็น">
      <ShoppingCart size={19} />
      {totalItems > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#F2A900] px-1 text-[10px] font-bold text-[#002D62]">
          {totalItems}
        </span>
      )}
    </button>
  );
}

function Telemetry({ icon: Icon, label, value, unit, status, color }: { icon: typeof Droplets; label: string; value: string; unit: string; status: string; color: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className={`rounded-lg p-2 ${color}`}><Icon size={18} /></span>
        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-[#2E7D32]">
          <CheckCircle2 size={13} />{status}
        </span>
      </div>
      <p className="mt-4 text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-[#002D62]">{value}<span className="ml-1 text-xs font-medium text-slate-400">{unit}</span></p>
    </div>
  );
}

function MarketCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative h-40 overflow-hidden bg-slate-100">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-[#2E7D32] backdrop-blur-md">GAP CERTIFIED</span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold leading-snug text-[#002D62]">{product.name}</h3>
          <span className="whitespace-nowrap text-base font-bold text-[#002D62]">฿{product.price}<small className="text-[10px] font-normal text-slate-400">/{product.unit}</small></span>
        </div>
        <p className="mt-2 flex items-center gap-1 text-[11px] text-[#2E7D32]"><CloudSun size={13} /> IoT Monitored · แปลง {product.plotId}</p>
        <button onClick={() => addItem(product)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#002D62] py-2.5 text-xs font-bold text-white transition hover:bg-[#17497f]">
          <ShoppingCart size={14} /> เพิ่มลงตะกร้า
        </button>
      </div>
    </article>
  );
}

export function MahidolLampangHub() {
  const [query, setQuery] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const products = MOCK_PRODUCTS.slice(0, 3);

  const filteredKnowledge = useMemo(
    () => knowledge.filter((item) => `${item.title} ${item.type}`.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  // Auto Slide Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  return (
    <CartProvider>
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans" id="overview">
        
        {/* HEADER / NAVIGATION BAR */}
        <header className="sticky top-0 z-50 bg-[#0e2b42] text-white shadow-md border-b-4 border-[#e2a021]">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
            
            {/* LEFT LOGO & TITLE SECTION */}
            <a href="#overview" className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-white p-1.5 shadow-inner">
                <img src="/mahidol-logo.png" alt="Mahidol Logos" className="h-10 sm:h-11 object-contain" />
              </div>
              <div className="h-9 w-px bg-slate-600 hidden sm:block"></div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs lg:text-sm font-bold text-white leading-tight">
                  งานพันธกิจเพื่อสังคม สำนักงานวิจัยและวิทยาบริการ
                </span>
                <span className="text-[11px] lg:text-xs text-amber-300 leading-tight mt-0.5 font-medium">
                  คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล จังหวัดลำปาง
                </span>
              </div>
            </a>

            {/* MAIN NAVIGATION */}
            <nav className="flex items-center gap-1 xl:gap-2 text-xs font-medium text-slate-200">
              <a href="#overview" className="rounded-lg px-3 py-2 transition hover:bg-white/10 hover:text-white flex items-center gap-1">
                <House size={14} className="text-amber-400" /> หน้าแรก
              </a>
              <a href="#about" className="rounded-lg px-3 py-2 transition hover:bg-white/10 hover:text-white">
                เกี่ยวกับเรา
              </a>
              <a href="#social-projects" className="rounded-lg px-3 py-2 transition hover:bg-white/10 hover:text-white">
                โครงการเพื่อสังคม
              </a>
              <a href="#learning-center" className="rounded-lg px-3 py-2 transition hover:bg-white/10 hover:text-white">
                ศูนย์การเรียนรู้
              </a>
              <a href="#activities" className="rounded-lg px-3 py-2 transition hover:bg-white/10 hover:text-white">
                กิจกรรม
              </a>

              {/* EYE-CATCHING DROPDOWN FOR "SERVICES" */}
              <div className="relative group py-1">
                <button className="flex items-center gap-1.5 rounded-full bg-linear-to-r from-emerald-600 to-teal-600 px-4 py-1.5 font-semibold text-white shadow-md border border-emerald-400/30 transition hover:from-emerald-500 hover:to-teal-500">
                  <Sprout size={15} className="text-amber-300" />
                  <span>บริการของเรา</span>
                  <ChevronDown size={14} />
                </button>

                {/* DROPDOWN MENU */}
                <div className="absolute right-0 top-full hidden w-64 rounded-xl border border-slate-100 bg-white py-2 text-slate-800 shadow-xl group-hover:block animate-in fade-in slide-in-from-top-2">
                  <div className="border-b border-slate-100 px-4 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    บริการวิชาการและสถานที่
                  </div>
                  <a href="#services-cards" className="flex items-center gap-2.5 px-4 py-2.5 text-xs transition hover:bg-emerald-50 hover:text-emerald-700">
                    <Building2 size={16} className="text-emerald-600" />
                    <span>บริการห้องประชุม / ห้องพัก</span>
                  </a>
                  <a href="#services-cards" className="flex items-center gap-2.5 px-4 py-2.5 text-xs transition hover:bg-emerald-50 hover:text-emerald-700">
                    <Package size={16} className="text-emerald-600" />
                    <span>ผลิตภัณฑ์โครงการ</span>
                  </a>
                  <a href="#services-cards" className="flex items-center gap-2.5 px-4 py-2.5 text-xs transition hover:bg-emerald-50 hover:text-emerald-700">
                    <FileSignature size={16} className="text-emerald-600" />
                    <span>แบบฟอร์มขอเช่าสถานที่</span>
                  </a>
                  <a href="#services-cards" className="flex items-center gap-2.5 px-4 py-2.5 text-xs transition hover:bg-emerald-50 hover:text-emerald-700">
                    <Trees size={16} className="text-emerald-600" />
                    <span>บริการพื้นที่เช่าทำการเกษตร</span>
                  </a>
                </div>
              </div>

              {/* SEARCH & CART */}
              <div className="ml-2 flex items-center gap-2 border-l border-slate-700 pl-3">
                <div className="hidden items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 xl:flex">
                  <Search size={14} className="text-slate-300" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="ค้นหา..."
                    className="w-24 bg-transparent text-xs outline-none placeholder:text-slate-300"
                  />
                </div>
                <CartButton />
              </div>
            </nav>
          </div>
        </header>

        <main>
          {/* HERO SLIDER SECTION */}
          <section className="relative overflow-hidden bg-[#0e2b42] text-white">
            <div className="relative h-105 sm:h-120 lg:h-130 w-full">
              {HERO_SLIDES.map((slide, idx) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${slide.image}')` }}
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-[#0e2b42] via-[#0e2b42]/80 to-transparent" />
                  </div>

                  <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 lg:px-8">
                    <div className="max-w-2xl">
                      <span className="inline-flex items-center gap-2 rounded-full border border-[#F2A900]/50 bg-[#F2A900]/15 px-3 py-1 text-[10px] font-bold tracking-widest text-[#F2A900]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#F2A900]" /> {slide.badge}
                      </span>
                      <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
                        {slide.title}
                      </h1>
                      <p className="mt-4 text-xs leading-relaxed text-slate-300 sm:text-sm md:text-base">
                        {slide.subtitle}
                      </p>
                      <div className="mt-6 flex flex-wrap gap-3">
                        <a
                          href={slide.buttonLink}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#F2A900] px-5 py-2.5 text-xs font-bold text-[#002D62] transition hover:-translate-y-0.5"
                        >
                          {slide.buttonText} <ArrowUpRight size={15} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* SLIDE ARROW BUTTONS */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2.5 text-white backdrop-blur-md transition hover:bg-black/70"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2.5 text-white backdrop-blur-md transition hover:bg-black/70"
            >
              <ChevronRight size={20} />
            </button>

            {/* SLIDE DOT INDICATORS */}
            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentSlide ? "w-7 bg-[#F2A900]" : "w-2 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </section>

          {/* MODULE NAVIGATION CARDS */}
          <section id="modules" className="relative z-20 mx-auto -mt-10 max-w-7xl px-4 lg:px-8">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {modules.map(({ icon: Icon, ...module }) => (
                <a
                  key={module.title}
                  href={module.href}
                  className={`group rounded-2xl ${module.tone} p-4 text-white shadow-xl transition hover:-translate-y-1`}
                >
                  <div className="flex items-center justify-between">
                    <Icon size={21} />
                    <ArrowUpRight size={16} className="opacity-60 transition group-hover:opacity-100" />
                  </div>
                  <p className="mt-5 text-[9px] font-bold tracking-[.18em] text-white/60">{module.label}</p>
                  <h2 className="mt-1 text-sm font-bold">{module.title}</h2>
                  <p className="mt-1 text-[11px] leading-5 text-white/75">{module.description}</p>
                </a>
              ))}
            </div>
          </section>

          {/* FEATURED SECTION: "บริการของเรา" */}
          <section id="services-cards" className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                SERVICE HIGHLIGHTS
              </span>
              <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                บริการของเรา
              </h2>
              <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-linear-to-r from-emerald-500 to-amber-500" />
              <p className="mt-3 text-sm text-slate-600">
                บริการเช่าสถานที่ แปลงเกษตรกรรม สินค้าชุมชน และบริการวิชาการเพื่อพัฒนาคุณภาพชีวิต
              </p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {serviceCards.map((srv) => {
                const IconComp = srv.icon;
                return (
                  <div
                    key={srv.id}
                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div>
                      {/* CARD TOP BANNER */}
                      <div className={`relative flex h-36 items-center justify-center bg-linear-to-br ${srv.gradient}`}>
                        <IconComp size={56} className="text-white/80 transition-transform duration-300 group-hover:scale-110" />
                        <span className="absolute top-3 right-3 rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-bold text-slate-800 shadow-sm">
                          {srv.tag}
                        </span>
                      </div>

                      {/* CARD CONTENT */}
                      <div className="p-5">
                        <h3 className="text-base font-bold text-slate-800 transition-colors group-hover:text-emerald-700">
                          {srv.title}
                        </h3>
                        <p className="mt-2 text-xs leading-relaxed text-slate-500">
                          {srv.desc}
                        </p>
                      </div>
                    </div>

                    {/* CARD FOOTER BUTTON */}
                    <div className="p-5 pt-0">
                      <button
                        onClick={() => toast.info(`เปิดหน้ารายละเอียด: ${srv.title}`)}
                        className={`flex w-full items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-semibold transition-all ${srv.badgeBg}`}
                      >
                        <span>เข้าดูบริการ</span>
                        <ArrowUpRight size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* SMART FARM LIVE TELEMETRY */}
          <section id="farm" className="bg-slate-100/70 py-16 border-y border-slate-200">
            <div className="mx-auto max-w-7xl px-4 lg:px-8">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <p className="text-[10px] font-bold tracking-[.2em] text-[#2E7D32]">SMART FARM / LIVE TELEMETRY</p>
                  <h2 className="mt-2 text-2xl font-bold text-[#002D62] md:text-3xl">สถานะแปลงสาธิตวันนี้</h2>
                  <p className="mt-2 text-sm text-slate-500">ข้อมูลจากเซนเซอร์แปลงเกษตรอัจฉริยะ อัปเดตทุก 5 นาที</p>
                </div>
                <RouterLink to="/smart-farm" className="flex items-center gap-1 text-xs font-bold text-[#002D62]">
                  ดูแดชบอร์ดเต็ม <ChevronRight size={16} />
                </RouterLink>
              </div>
              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                <Telemetry icon={Droplets} label="ความชื้นในดิน" value="61" unit="%" status="Ready" color="bg-green-50 text-[#2E7D32]" />
                <Telemetry icon={Thermometer} label="อุณหภูมิ" value="25.8" unit="°C" status="Normal" color="bg-amber-50 text-[#9b6a00]" />
                <Telemetry icon={CloudSun} label="ความชื้นสัมพัทธ์" value="68" unit="%" status="Normal" color="bg-blue-50 text-[#002D62]" />
              </div>
            </div>
          </section>

          {/* วางระบบจอง EV ตรงนี้ */}
          <EVBookingSection />

          {/* CLEAN ENERGY ANALYTICS */}
          <section className="bg-white">
            <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 lg:grid-cols-[1.2fr_.8fr] lg:px-8">
              <div>
                <p className="text-[10px] font-bold tracking-[.2em] text-[#9b6a00]">CLEAN ENERGY ANALYTICS</p>
                <h2 className="mt-2 text-2xl font-bold text-[#002D62]">พลังงานสะอาดที่สร้างผลลัพธ์</h2>
                <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">
                  ติดตามพลังงานจากแสงอาทิตย์และผลกระทบเชิงบวกต่อสิ่งแวดล้อมแบบโปร่งใส
                </p>
                <RouterLink to="/clean-energy" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#002D62] px-4 py-2.5 text-xs font-bold text-white">
                  เปิด Energy dashboard <ArrowUpRight size={14} />
                </RouterLink>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-amber-50 p-4">
                  <Sun className="text-[#F2A900]" size={20} />
                  <p className="mt-4 text-xs text-slate-500">ผลิตไฟฟ้าวันนี้</p>
                  <p className="mt-1 text-2xl font-bold text-[#002D62]">42.8 <small className="text-xs">kWh</small></p>
                </div>
                <div className="rounded-2xl bg-green-50 p-4">
                  <Leaf className="text-[#2E7D32]" size={20} />
                  <p className="mt-4 text-xs text-slate-500">ลด CO₂ สะสม</p>
                  <p className="mt-1 text-2xl font-bold text-[#2E7D32]">1.24 <small className="text-xs">tCO₂e</small></p>
                </div>
              </div>
            </div>
          </section>

          {/* MARKETPLACE SECTION */}
          <section id="market" className="bg-slate-50 border-t border-slate-200 py-16">
            <div className="mx-auto max-w-7xl px-4 lg:px-8">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <p className="text-[10px] font-bold tracking-[.2em] text-[#2E7D32]">SHOPPING VEG MARKETPLACE</p>
                  <h2 className="mt-2 text-2xl font-bold text-[#002D62] md:text-3xl">ผลผลิตจากแปลงวิจัย</h2>
                  <p className="mt-2 text-sm text-slate-500">สด ปลอดภัย ตรวจสอบย้อนกลับได้ด้วย IoT</p>
                </div>
                <button onClick={() => toast.info("กำลังเปิดดูผลผลิตทั้งหมด")} className="flex items-center gap-1 text-xs font-bold text-[#002D62]">
                  ดูสินค้าทั้งหมด <ChevronRight size={16} />
                </button>
              </div>
              <div className="mt-7 grid gap-5 md:grid-cols-3">
                {products.map((product) => (
                  <MarketCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>

          {/* KNOWLEDGE REPOSITORY */}
          <section id="knowledge" className="bg-white py-16">
            <div className="mx-auto max-w-7xl px-4 lg:px-8">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <p className="text-[10px] font-bold tracking-[.2em] text-[#002D62]">KNOWLEDGE REPOSITORY</p>
                  <h2 className="mt-2 text-2xl font-bold text-[#002D62] md:text-3xl">ห้องคลังความรู้</h2>
                  <p className="mt-2 text-sm text-slate-500">ข้อมูลสำหรับการเรียนรู้ วิจัย และต่อยอดชุมชน</p>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <Search size={15} className="text-slate-400" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="ค้นหาเอกสาร..."
                    className="w-40 bg-transparent text-xs outline-none"
                  />
                </div>
              </div>
              <div className="mt-7 grid gap-4 lg:grid-cols-3">
                {filteredKnowledge.map((item) => (
                  <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold tracking-widest ${item.color}`}>{item.type}</span>
                      <FileText size={18} className="text-slate-300" />
                    </div>
                    <h3 className="mt-8 text-sm font-bold leading-6 text-[#002D62]">{item.title}</h3>
                    <p className="mt-2 text-[11px] text-slate-500">{item.meta}</p>
                    <button onClick={() => toast.success("เปิดเอกสารในห้องคลังแล้ว")} className="mt-5 flex items-center gap-1 text-xs font-bold text-[#002D62]">
                      อ่านเพิ่มเติม <ArrowUpRight size={14} />
                    </button>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* OVERVIEW SECTIONS */}
          <section className="bg-slate-100 py-16 border-t border-slate-200">
            <div className="mx-auto max-w-7xl px-4 lg:px-8">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                
                {/* ABOUT US BOX */}
                <div id="about" className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200/80">
                  <div className="flex items-center gap-2 text-base font-bold text-[#002D62]">
                    <Info size={18} className="text-blue-600" />
                    <span>เกี่ยวกับเรา</span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-500">
                    งานพันธกิจเพื่อสังคม ทำหน้าที่เชื่อมโยงองค์ความรู้ด้านสิ่งแวดล้อมสู่การปฏิบัติจริงในพื้นที่ จ.ลำปาง และภาคเหนือ
                  </p>
                </div>

                {/* SOCIAL PROJECTS BOX */}
                <div id="social-projects" className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200/80">
                  <div className="flex items-center gap-2 text-base font-bold text-[#002D62]">
                    <Users size={18} className="text-emerald-600" />
                    <span>โครงการเพื่อสังคม</span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-500">
                    รวบรวมโครงการพัฒนาคุณภาพชีวิต โครงการอนุรักษ์ทรัพยากรธรรมชาติ และกิจกรรมเพื่อชุมชนอย่างยั่งยืน
                  </p>
                </div>

                {/* LEARNING CENTER BOX */}
                <div id="learning-center" className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200/80">
                  <div className="flex items-center gap-2 text-base font-bold text-[#002D62]">
                    <GraduationCap size={18} className="text-amber-600" />
                    <span>ศูนย์การเรียนรู้</span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-500">
                    คลังความรู้ นิทรรศการ และศูนย์อบรมถ่ายทอดเทคโนโลยีด้านการจัดการสิ่งแวดล้อมและเกษตรอัจฉริยะ
                  </p>
                </div>

                {/* ACTIVITIES BOX */}
                <div id="activities" className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200/80">
                  <div className="flex items-center gap-2 text-base font-bold text-[#002D62]">
                    <CalendarDays size={18} className="text-teal-600" />
                    <span>กิจกรรม</span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-500">
                    ข่าวสารกิจกรรม สัมมนา อบรมเชิงปฏิบัติการ และความเคลื่อนไหวล่าสุดของงานพันธกิจเพื่อสังคม
                  </p>
                </div>

              </div>
            </div>
          </section>
        </main>

        {/* FOOTER */}
        <footer className="bg-[#0e2b42] text-blue-100 border-t border-slate-800">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
            <div>
              <div className="flex items-center gap-3">
                <img src="/mahidol-logo.png" alt="Mahidol University" className="h-9 w-9 rounded bg-white p-1" />
                <p className="font-bold text-white">Mahidol Lampang Hub</p>
              </div>
              <p className="mt-4 max-w-sm text-xs leading-6 text-slate-300">
                งานพันธกิจเพื่อสังคม สำนักงานวิจัยและวิทยาบริการ คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล อำเภอสบปราบ จังหวัดลำปาง
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-[#F2A900]">เมนูด่วน</p>
              <a href="#about" className="mt-3 block text-xs hover:text-white">เกี่ยวกับเรา</a>
              <a href="#services-cards" className="mt-2 block text-xs hover:text-white">บริการของเรา</a>
              <a href="#knowledge" className="mt-2 block text-xs hover:text-white">ห้องคลังความรู้</a>
              <a href="#market" className="mt-2 block text-xs hover:text-white">ตลาดผักมหิดล</a>
            </div>
            <div>
              <p className="text-xs font-bold text-[#F2A900]">SYSTEM STATUS</p>
              <p className="mt-4 flex items-center gap-2 text-xs">
                <span className="h-2 w-2 rounded-full bg-[#7bd67f]" /> All systems operational
              </p>
              <p className="mt-3 text-xs text-slate-400">© 2026 Mahidol University. All Rights Reserved.</p>
            </div>
          </div>
        </footer>

        <CartDrawer />
      </div>
    </CartProvider>
  );
}