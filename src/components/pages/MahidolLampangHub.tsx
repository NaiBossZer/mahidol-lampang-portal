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
import SiteLayout3D from "../SiteLayout3D";
import { CartProvider } from "../storefront/CartContext";
import { useCart } from "../storefront/useCart";
import { CartDrawer } from "../storefront/CartDrawer";
import { MOCK_PRODUCTS, type Product } from "../storefront/mockData";
import { EVBookingSection } from "../EVBookingSection";
import PartnerLogos from '../PartnerLogos';
import AboutOur from "../AboutOur";

// ข้อมูล 6 ภาพสไลด์แบนเนอร์
const HERO_SLIDES = [
  {
    id: 1,
    image: "/main banner.jpg",
    badge: "MAHIDOL HUB",
    title: "งานพันธกิจเพื่อสังคม",
    subtitle: "คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล อ.สบปราบ จ.ลำปาง",
  },
  {
    id: 2,
    image: "/Shellac banner.jpg",
    badge: "ZONE 01 // COMPREHENSIVE SHELLAC LEARNING CENTER",
    title: "ห้องครั่งครบวงจร",
    subtitle: "กำเนิดครั่ง มหัศจรรย์วงจรชีวิตของแมลงครั่งและการแปรรูปครั่งสู่ผลิตภัณฑ์สร้างมูลค่า",
    buttonText: "เข้าสู่ห้องเรียนรู้ครั่ง",
    buttonLink: "https://mahidol-shellac.vercel.app/",
  },
  {
    id: 3,
    image: "/Smart Farm.jpg",
    badge: "ZONE 02 // SMART FARM STATION",
    title: "โรงเรือนเกษตรอัจฉริยะ",
    subtitle: "บันทึกอุณหภูมิ ความชื้นอากาศและปริมาณน้ำฝนตลอด 24 ชั่วโมง เพื่อวางแผนการเพาะปลูก",
    buttonText: "ดูข้อมูลสภาพอากาศ",
    buttonLink: "https://mahidol-smart-farm.vercel.app/",
  },
  {
    id: 4,
    image: "/EVCharger.jpg",
    badge: "ZONE 03 // EV CHARGER STATION",
    title: "จุดจอดรถชาร์จไฟฟ้า EV",
    subtitle: "บริการชาร์จไฟฟ้า EV สำหรับรถยนต์ไฟฟ้า พร้อมระบบจองคิวออนไลน์",
    buttonText: "เข้าสู่ระบบจัดการพลังงานแสงอาทิตย์",
    buttonLink: "https://mahidol-clean-energy.vercel.app/",
  },
];

type Module = { label: string; title: string; description: string; href: string; icon: typeof Leaf; tone: string };
const modules: Module[] = [
  { label: "PORTAL", title: "ภาพรวมโครงการ", description: "ข่าวสาร กิจกรรมและบริการวิชาการ", href: "https://mahidol-lampang-portal.vercel.app", icon: Sprout, tone: "bg-[#002D62]" },
  { label: "SHELLAC", title: "ห้องเรียนรู้ครั่งครบวงจร", description: "งานวิจัย คู่มือและข้อมูลเปิด", href: "https://mahidol-insight-hub.vercel.app", icon: BookOpen, tone: "bg-[#80142B]" },
  { label: "SMART FARM", title: "เกษตรอัจฉริยะ", description: "ติดตามแปลงเพาะปลูกแบบเรียลไทม์", href: "https://mahidol-smart-farm.vercel.app", icon: Leaf, tone: "bg-[#2E7D32]" },
  { label: "CLEAN ENERGY", title: "พลังงานสะอาด", description: "วิเคราะห์การผลิตและคาร์บอนที่ลดได้", href: "https://mahidol-clean-energy.vercel.app", icon: Zap, tone: "bg-[#9b6a00]" },
  { label: "SHOPPING VEG", title: "ตลาดผักมหิดล", description: "ผลผลิตปลอดสารพิษจากแปลงวิจัย", href: "https://mulp-farm-fresh-market.vercel.app", icon: ShoppingCart, tone: "bg-[#1b8a43]" },
];

const knowledge = [
  { type: "RESEARCH", title: "การบริหารจัดการระบบ Smart Farm ในพื้นที่แห้งแล้ง", meta: "เกษตรอัจฉริยะ · 4 นาที", color: "text-[#2E7D32]" },
  { type: "GUIDE", title: "คู่มือการใช้งานและดูแลแปลงผักปลอดภัย", meta: "คู่มือเกษตร · ดาวน์โหลด PDF", color: "text-[#002D62]" },
  { type: "ENERGY", title: "รายงานผลการผลิตไฟฟ้าจาก Solar Rooftop", meta: "พลังงานสะอาด · 2 นาที", color: "text-[#9b6a00]" },
];

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
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800" id="overview">
        
        {/* HEADER / NAVIGATION BAR */}
        <header className="sticky top-0 z-50 border-b-4 border-[#e2a021] bg-[#0e2b42] text-white shadow-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
            
            {/* LEFT LOGO & TITLE SECTION */}
            <div className="flex items-center gap-3 shrink-0 sm:gap-4">
              
              {/* LOGO GROUP */}
              <div className="flex items-center gap-2">
                
                {/* LOGO 1: Mahidol University */}
                <div className="flex h-9 items-center justify-center rounded-lg bg-white p-1 shadow-sm shrink-0 sm:h-11">
                  <img 
                    src="/mahidol-logo.png" 
                    alt="Mahidol University Logo" 
                    className="h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerText = '🏛️ Mahidol';
                    }}
                  />
                </div>

                {/* LOGO 2: Faculty of Environment */}
                <div className="flex h-9 items-center justify-center rounded-lg bg-white p-1 shadow-sm shrink-0 sm:h-11">
                  <img 
                    src="/envi-logo.jpg" 
                    alt="Envi Mahidol Logo" 
                    className="h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerText = '🌍 Envi';
                    }}
                  />
                </div>

                {/* LOGO 3: Social Engagement */}
                <div className="flex h-9 items-center justify-center rounded-lg bg-white p-1 shadow-sm shrink-0 sm:h-11">
                  <img 
                    src="/social-engagement-logo.png" 
                    alt="Social Engagement Logo" 
                    className="h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerText = '🤝 Social';
                    }}
                  />
                </div>

              </div>

              {/* VERTICAL DIVIDER */}
              <div className="hidden h-8 w-px bg-white/20 shrink-0 sm:block sm:h-10" />

              {/* ORGANIZATION TITLE */}
              <div className="hidden sm:block">
                <span className="block text-xs font-semibold leading-snug tracking-tight text-white sm:text-sm">
                  งานพันธกิจเพื่อสังคม สำนักงานวิจัยและวิทยบริการ
                </span>
                <span className="mt-0.5 block text-[10px] font-medium leading-tight text-[#F5B800] sm:text-xs">
                  คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล จังหวัดลำปาง
                </span>
              </div>

            </div>

            {/* RIGHT SECTION: Navigation & Utilities */}
            <div className="flex items-center gap-3 sm:gap-6">
              <nav className="hidden items-center gap-5 text-xs font-semibold md:flex">
                <a href="#about" className="flex items-center gap-1 text-white/90 transition hover:text-[#F2A900]">
                  <Info size={14} /> เกี่ยวกับเรา
                </a>
                <a href="#projects" className="flex items-center gap-1 text-white/90 transition hover:text-[#F2A900]">
                  <Users size={14} /> โครงการเพื่อสังคม
                </a>
                <a href="#learning" className="flex items-center gap-1 text-white/90 transition hover:text-[#F2A900]">
                  <GraduationCap size={14} /> ศูนย์การเรียนรู้
                </a>
                
                <div className="group relative">
                  <button className="flex items-center gap-1 rounded-full bg-[#00A86B] px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-[#008f5b]">
                    <Sprout size={14} /> บริการของเรา <ChevronDown size={13} />
                  </button>
                  <div className="absolute right-0 top-full hidden w-52 rounded-xl border border-slate-100 bg-white p-2 text-slate-700 shadow-xl group-hover:block">
                    {serviceCards.map((s) => (
                      <a key={s.id} href={`#${s.id}`} className="block rounded-lg px-3 py-2 text-xs font-medium hover:bg-slate-100">
                        {s.title}
                      </a>
                    ))}
                  </div>
                </div>
              </nav>

              {/* SEARCH BAR */}
              <div className="relative hidden lg:block">
                <input
                  type="text"
                  placeholder="ค้นหา..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-36 rounded-xl bg-white/10 py-1.5 pl-8 pr-3 text-xs text-white placeholder-white/50 border border-white/20 focus:w-48 focus:bg-white/20 focus:outline-none transition-all duration-300"
                />
                <Search size={14} className="absolute left-2.5 top-2 text-white/60" />
              </div>

              {/* CART BUTTON */}
              <CartButton />
            </div>

          </div>
        </header>

        {/* HERO CAROUSEL */}
        <section className="relative h-120 overflow-hidden bg-slate-900 sm:h-140">
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}
            >
              <img src={slide.image} alt={slide.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-[#0e2b42] via-[#0e2b42]/50 to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full space-y-4">
                  <span className="inline-block rounded-full bg-[#e2a021] px-3.5 py-1 text-xs font-bold text-[#0e2b42]">
                    {slide.badge}
                  </span>
                  <h1 className="text-3xl font-extrabold text-white sm:text-5xl lg:text-6xl max-w-2xl leading-tight">
                    {slide.title}
                  </h1>
                  <p className="max-w-xl text-sm text-slate-200 sm:text-base">
                    {slide.subtitle}
                  </p>
                  {slide.buttonText && (
                    <a
                      href={slide.buttonLink}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#e2a021] px-5 py-2.5 text-xs font-bold text-[#0e2b42] transition hover:bg-amber-400"
                    >
                      {slide.buttonText} <ArrowUpRight size={15} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* SLIDE NAVIGATION CONTROLS */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-md transition hover:bg-black/60"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-md transition hover:bg-black/60"
            aria-label="Next Slide"
          >
            <ChevronRight size={20} />
          </button>
        </section>

        {/* 5 MAIN SYSTEM MODULE CARDS */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 -mt-16 relative z-30">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {modules.map((m) => {
              const Icon = m.icon;
              return (
                <a
                  key={m.label}
                  href={m.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${m.tone} group relative overflow-hidden rounded-2xl p-5 text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl`}
                >
                  <div className="flex items-center justify-between">
                    <Icon size={22} />
                    <ArrowUpRight size={16} className="opacity-70 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                  </div>
                  <span className="mt-4 block text-[10px] font-bold uppercase tracking-wider opacity-80">{m.label}</span>
                  <h3 className="mt-1 text-base font-bold">{m.title}</h3>
                  <p className="mt-1 text-xs opacity-90 leading-relaxed">{m.description}</p>
                </a>
              );
            })}
          </div>
        </section>

        {/* MAIN SERVICES SECTION */}
        <section id="services-cards" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-[#002D62] sm:text-3xl">บริการของเรา</h2>
            <p className="text-xs text-slate-500 sm:text-sm">บริการเช่าสถานที่ แปลงเกษตรกรรม สินค้าชุมชน และบริการวิชาการเพื่อพัฒนาคุณภาพชีวิต</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {serviceCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.id} className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`rounded-2xl bg-linear-to-br ${card.gradient} p-3.5 text-white shadow-md`}>
                        <Icon size={24} />
                      </div>
                      <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold transition ${card.badgeBg}`}>
                        {card.tag}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#002D62]">{card.title}</h3>
                    <p className="text-xs leading-relaxed text-slate-500">{card.desc}</p>
                  </div>
                  <button className="mt-6 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-xs font-bold text-[#002D62] transition hover:bg-slate-50">
                    เข้าดูบริการ <ArrowUpRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* TELEMETRY / IOT MONITORING */}
        <section id="farm" className="bg-slate-100/60 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D32]">SMART FARM // LIVE TELEMETRY</span>
                <h2 className="text-xl font-bold text-[#002D62] sm:text-2xl">สถานะแปลงสาธิตวันนี้</h2>
              </div>
              <span className="text-xs font-medium text-slate-500">อัปเดตล่าสุด: เมื่อครู่นี้ (เรียลไทม์)</span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Telemetry icon={Droplets} label="ความชื้นในดิน (แปลง 1)" value="42" unit="%" status="ปกติ" color="bg-blue-50 text-blue-600" />
              <Telemetry icon={Thermometer} label="อุณหภูมิอากาศ" value="31.5" unit="°C" status="ปกติ" color="bg-amber-50 text-amber-600" />
              <Telemetry icon={Sun} label="ความเข้มแสง Solar" value="845" unit="W/m²" status="แสงแดดจัด" color="bg-orange-50 text-orange-600" />
              <Telemetry icon={Zap} label="กำลังไฟฟ้าที่ผลิตได้" value="4.2" unit="kW" status="ปกติ" color="bg-emerald-50 text-emerald-600" />
            </div>
          </div>
        </section>

        {/* 3D SITE LAYOUT SECTION */}
        <SiteLayout3D />

        {/* EV CHARGING BOOKING SECTION */}
        <EVBookingSection />

        {/* MARKETPLACE PREVIEW */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1b8a43]">FRESH MARKET</span>
              <h2 className="text-xl font-bold text-[#002D62] sm:text-2xl">ผลผลิตแนะนำจากแปลงวิจัย</h2>
            </div>
            <a href="https://mulp-farm-fresh-market.vercel.app" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-bold text-[#2E7D32] hover:underline">
              ดูสินค้าทั้งหมด <ChevronRight size={14} />
            </a>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {products.map((p) => (
              <MarketCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* KNOWLEDGE BASE SECTION */}
        <AboutOur items={filteredKnowledge} />

        {/* PARTNER LOGOS SECTION */}
        <PartnerLogos />

        {/* FOOTER */}
        <footer className="border-t border-slate-800 bg-[#0a1e2f] py-8 text-slate-400 text-xs">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8 space-y-2">
            <p className="font-medium text-slate-300">
              © 2026 งานพันธกิจเพื่อสังคม คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล จังหวัดลำปาง
            </p>
            <p className="text-slate-500">
              SOCIAL ENGAGEMENT : Faculty of Environment and Resource Studies , Mahidol University 
            </p>
          </div>
        </footer>

        {/* CART DRAWER SLIDE-OVER */}
        <CartDrawer />

      </div>
    </CartProvider>
  );
}