import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

export function HomePage() {
  // ฟังก์ชันช่วย Scroll ไปยังส่วนที่ต้องการโดยไม่เปลี่ยน URL
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col justify-between scroll-smooth">
      <div>
        {/* 1. Header Banner / Hero Section */}
        <header
          className="relative bg-cover bg-center bg-no-repeat text-white py-16 sm:py-24 px-4 text-center overflow-hidden"
          style={{ backgroundImage: "url('/Backdrop_Shellac_2569.png')" }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-[2px]" />

          <div className="relative z-10 max-w-4xl mx-auto space-y-4 sm:space-y-6">
            <span className="inline-block bg-emerald-500/30 text-emerald-100 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full border border-emerald-400/30 backdrop-blur-sm shadow-inner">
              โครงการห้องการเรียนรู้ครั่งครบวงจร
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-md leading-tight">
              ศูนย์เรียนรู้และองค์ความรู้ครั่ง
            </h1>
            <p className="text-emerald-100 text-sm sm:text-lg max-w-2xl mx-auto font-light drop-shadow">
              คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล อ.สบปราบ จ.ลำปาง
            </p>

            {/* TAB / Navigation Buttons */}
<div className="pt-4 flex flex-wrap justify-center gap-3 sm:gap-4">
  {/* 1. คลังความรู้ */}
  <button
    type="button"
    onClick={() => scrollToSection("cards-section")}
    className="bg-white text-emerald-900 hover:bg-emerald-50 font-bold px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 text-sm sm:text-base flex items-center gap-2 cursor-pointer"
  >
    <span>📚</span> คลังความรู้
  </button>

  {/* 2. สถิติการผลิต */}
  <button
    type="button"
    onClick={() => scrollToSection("data-viz")}
    className="bg-white text-emerald-900 hover:bg-emerald-50 font-bold px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 text-sm sm:text-base flex items-center gap-2 cursor-pointer"
  >
    <span>📈</span> สถิติการผลิต
  </button>

  {/* 3. ทำแบบประเมินความพึงพอใจ */}
  <Link
    to="/survey"
    className="bg-white text-emerald-900 hover:bg-emerald-50 font-bold px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 text-sm sm:text-base flex items-center gap-2"
  >
    <span>📝</span> ทำแบบประเมินความพึงพอใจ
  </Link>

  {/* 4. ดูสรุปผล Dashboard */}
  <Link
    to="/dashboard"
    className="bg-white text-emerald-900 hover:bg-emerald-50 font-bold px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 text-sm sm:text-base flex items-center gap-2"
  >
    <span>📊</span> ดูสรุปผล Dashboard
  </Link>
</div>
          </div>
        </header>

        {/* 2. Video Section */}
        <section className="bg-white dark:bg-slate-800/60 py-12 sm:py-16 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-4xl mx-auto px-4 space-y-6 text-center">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                🎬 วิดีโอแนะนำห้องการเรียนรู้ครั่ง
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                รับชมวิดีโอแนะนำศูนย์เรียนรู้และกิจกรรมการเรียนรู้ครั่งครบวงจร
              </p>
            </div>

            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 bg-slate-950">
              <video
                className="w-full h-full object-cover"
                controls
                playsInline
                preload="metadata"
              >
                <source src="/intro-lac.mp4" type="video/mp4" />
                <p className="p-4 text-white text-sm">
                  เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอ
                </p>
              </video>
            </div>
          </div>
        </section>

        {/* 3. Cards Grid Section */}
        <div id="cards-section" className="scroll-mt-6">
          <LacKnowledgeCards />
        </div>

        {/* 4. Data Visualization Section */}
        <div id="data-viz" className="scroll-mt-6">
          <LacDataVisualization />
        </div>

        {/* 5. Accordion Section */}
        <LacKnowledgeAccordion />
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm border-t border-slate-800 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <p>© 2026 คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล</p>
        </div>
      </footer>
    </div>
  );
}

// --- COMPONENT: Cards Grid (เปิด Pop-up Tab ได้) ---
interface CardDetail {
  overview: string;
  highlights: string[];
}

interface CardItem {
  id: number;
  icon: string;
  title: string;
  desc: string;
  tag: string;
  bgColor: string;
  borderColor: string;
  badgeColor: string;
  detail: CardDetail;
}

function LacKnowledgeCards() {
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null);

  const cards: CardItem[] = [
    {
      id: 1,
      icon: "🐞",
      title: "ครั่งคืออะไร & ถิ่นกำเนิด",
      desc: "ยางธรรมชาติจากแมลงครั่ง (Laccifer lacca) สารชันสีแดงธรรมชาติตั้งแต่เอเชียใต้ถึงตะวันออกเฉียงใต้",
      tag: "พื้นฐานครั่ง",
      bgColor: "bg-rose-50/70 dark:bg-rose-950/20",
      borderColor: "border-rose-200 dark:border-rose-900/50",
      badgeColor: "bg-rose-100 dark:bg-rose-900/80 text-rose-800 dark:text-rose-200",
      detail: {
        overview:
          "ครั่ง คือ ยางหรือสารชันชนิดหนึ่งที่ขับออกมาจากตัวแมลงครั่ง (Laccifer lacca) เพื่อสร้างเป็นรังห่อหุ้มลำตัว ครั่งดิบมีลักษณะเป็นก้อนแข็งสีแดงอิฐหรือน้ำตาลแดง มีคุณสมบัติละลายได้ในแอลกอฮอล์ และหลอมเหลวด้วยความร้อน",
        highlights: [
          "ถิ่นกำเนิดหลักอยู่ในภูมิภาคเอเชียใต้และเอเชียตะวันออกเฉียงใต้ (ไทย, อินเดีย, พม่า)",
          "เป็นสารธรรมชาติ 100% ที่ปลอดภัยและย่อยสลายได้ตามธรรมชาติ",
          "ถูกนำมาใช้ประโยชน์ย้อนไปนานหลายร้อยปีทั้งในงานช่างสิบหมู่และยารักษาโรค",
        ],
      },
    },
    {
      id: 2,
      icon: "🌳",
      title: "พืชอาศัย & นิเวศวิทยา",
      desc: "ต้นไม้อาศัยที่เหมาะแก่การเพาะเลี้ยง เช่น จามจุรี (ก้ามปู) ปลัก สีเสียด พร้อมรับมือสภาวะโลกร้อน",
      tag: "นิเวศวิทยา",
      bgColor: "bg-emerald-50/70 dark:bg-emerald-950/20",
      borderColor: "border-emerald-200 dark:border-emerald-900/50",
      badgeColor: "bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200",
      detail: {
        overview:
          "แมลงครั่งต้องอาศัยอยู่บนกิ่งของต้นไม้เฉพาะชนิดเพื่อดูดกินน้ำเลี้ยง พืชอาศัยที่ดีต้องมีทรงพุ่มโปร่ง มีกิ่งอ่อนให้แมลงเกาะ และเจริญเติบโตได้ดีในสภาพอากาศท้องถิ่น",
        highlights: [
          "ต้นจามจุรี (ก้ามปู): พืชอาศัยยอดนิยม ให้ผลผลิตครั่งสูงและโตไว",
          "ต้นปลัก / สีเสียด / ปันแก: พืชอาศัยท้องถิ่นที่ทนทานสภาพอากาศแห้งแล้งได้ดี",
          "การจัดการพุ่มไม้: ต้องมีการตัดแต่งกิ่งเพื่อให้แสงแดดและลมถ่ายเทอย่างเหมาะสม",
        ],
      },
    },
    {
      id: 3,
      icon: "📅",
      title: "การเพาะเลี้ยง & การจัดการ",
      desc: "เทคนิคการคัดแม่พันธุ์ รอบปฏิทินฤดูกาล (รอบร้อน/ฝน) อัตราปล่อยพันธุ์ และการดูแลป้องกันศัตรูครั่ง",
      tag: "คู่มือเกษตรกร",
      bgColor: "bg-amber-50/70 dark:bg-amber-950/20",
      borderColor: "border-amber-200 dark:border-amber-900/50",
      badgeColor: "bg-amber-100 dark:bg-amber-900/80 text-amber-800 dark:text-amber-200",
      detail: {
        overview:
          "การเลี้ยงครั่งแบ่งออกเป็น 2 รอบตามฤดูกาล ได้แก่ รอบฤดูร้อน และ รอบฤดูฝน การจัดการที่มีประสิทธิภาพจะช่วยลดอัตราการสูญเสียจากแมลงศัตรูพืชและสภาพอากาศ",
        highlights: [
          "รอบฤดูร้อน: ปล่อยพันธุ์ พ.ย.-ธ.ค. เก็บเกี่ยว พ.ค.-มิ.ย.",
          "รอบฤดูฝน: ปล่อยพันธุ์ พ.ค.-มิ.ย. เก็บเกี่ยว พ.ย.-ธ.ค.",
          "การคัดพันธุ์: เลือกกิ่งครั่งที่สมบูรณ์ ไม่มีมดหรือแมลงเบียนทำลาย มัดติดกิ่งพืชอาศัยช่วงละ 3-4 เมตร",
        ],
      },
    },
    {
      id: 4,
      icon: "🧪",
      title: "ผลิตภัณฑ์ & การแปรรูป",
      desc: "การแปรรูปสู่ครั่งเมล็ด เชลแลก สีย้อมผ้า สารเคลือบผิวผลไม้/ยา และน้ำล้างครั่งบำรุงดิน",
      tag: "นวัตกรรม & มูลค่า",
      bgColor: "bg-sky-50/70 dark:bg-sky-950/20",
      borderColor: "border-sky-200 dark:border-sky-900/50",
      badgeColor: "bg-sky-100 dark:bg-sky-900/80 text-sky-800 dark:text-sky-200",
      detail: {
        overview:
          "ครั่งดิบที่เก็บเกี่ยวได้จะถูกนำเข้าสู่กระบวนการแปรรูป ตั้งแต่การแกะกิ่ง บด ล้าง สกัดแยกสี และฟอกสี จนได้ผลิตภัณฑ์มูลค่าสูงที่ใช้ในหลายอุตสาหกรรม",
        highlights: [
          "ครั่งเมล็ด (Seedlac) & เชลแลก (Shellac): ใช้ทำเคลือบเงาไม้ และเคลือบเม็ดยา/ลูกอม",
          "สีสกัดครั่ง (Lac Dye): สีย้อมธรรมชาติโทนสีแดงสำหรับสิ่งทอและเครื่องสำอาง",
          "น้ำล้างครั่ง: มีธาตุอาหารสูง นำไปทำปุ๋ยชีวภาพบำรุงพืชผักสวนครัว",
        ],
      },
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
      <div className="text-center mb-10 space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          📚 หมวดหมู่องค์ความรู้เรื่องครั่ง
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          เจาะลึกข้อมูลทางนิเวศวิทยา การเพาะเลี้ยง และอุตสาหกรรมแปรรูปครั่ง (คลิกเพื่อดูรายละเอียด)
        </p>
      </div>

      {/* Grid การ์ด */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => setSelectedCard(card)}
            className={`${card.bgColor} ${card.borderColor} border p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer text-left flex flex-col justify-between space-y-4 group`}
          >
            <div className="space-y-3 w-full">
              <div className="flex items-center justify-between">
                <span className="text-3xl group-hover:scale-110 transition-transform">
                  {card.icon}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${card.badgeColor}`}>
                  {card.tag}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {card.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {card.desc}
              </p>
            </div>
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 pt-2">
              <span>อ่านรายละเอียดเพิ่มเติม</span>
              <span>→</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pop-up Tab (Modal) */}
      {selectedCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setSelectedCard(null)}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ปุ่มปิด มุมขวาบน */}
            <button
              type="button"
              onClick={() => setSelectedCard(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-slate-700 w-9 h-9 rounded-full flex items-center justify-center transition-all text-base font-bold cursor-pointer"
              aria-label="Close"
            >
              ✕
            </button>

            {/* เนื้อหาใน Modal */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 pr-8">
                <span className="text-4xl p-3 bg-slate-100 dark:bg-slate-700/50 rounded-2xl">
                  {selectedCard.icon}
                </span>
                <div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${selectedCard.badgeColor}`}>
                    {selectedCard.tag}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {selectedCard.title}
                  </h3>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                  📌 ภาพรวมองค์ความรู้
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
                  {selectedCard.detail.overview}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                  💡 ประเด็นสำคัญ
                </h4>
                <ul className="space-y-2">
                  {selectedCard.detail.highlights.map((item, idx) => (
                    <li key={idx} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
                      <span className="text-emerald-500 font-bold mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedCard(null)}
                  className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// --- COMPONENT: Data Visualization ---
function LacDataVisualization() {
  const [activeTab, setActiveTab] = useState<"farmers" | "efficiency">("farmers");

  const compositions = [
    { name: "ชัน/เรซิน (Resin)", percent: "68-90%", value: 80, color: "bg-emerald-600" },
    { name: "สีสกัด (Dye)", percent: "2-10%", value: 10, color: "bg-rose-500" },
    { name: "ขี้ผึ้ง (Wax)", percent: "5-6%", value: 6, color: "bg-amber-500" },
    { name: "แร่ธาตุ (Mineral)", percent: "3-7%", value: 5, color: "bg-sky-500" },
    { name: "น้ำ (Water)", percent: "2-3%", value: 3, color: "bg-slate-400" },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 sm:py-16 space-y-10">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          📊 สถิติและข้อมูลการผลิตครั่ง จ.ลำปาง
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          ข้อมูลเชิงสถิติ นิเวศวิทยา และศักยภาพการผลิตครั่งในพื้นที่
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-50/60 dark:bg-emerald-950/30 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
              ศูนย์กลางการผลิตใหญ่ที่สุด
            </p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-emerald-100 mt-1">
              อ.งาว (บ้านบ่อสี่เหลี่ยม)
            </h3>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              300,000 <span className="text-base font-normal text-slate-600 dark:text-slate-400">กก./ปี</span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              สร้างรายได้เฉลี่ย 4.5 แสนบาท/ครอบครัว/ปี
            </p>
          </div>
        </div>

        <div className="bg-sky-50/60 dark:bg-sky-950/30 p-6 rounded-2xl border border-sky-200 dark:border-sky-900/50 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider">
              ประสิทธิภาพการผลิตสูงสุด
            </p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-sky-100 mt-1">
              อ.สบปราบ
            </h3>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black text-sky-600 dark:text-sky-400">
              อันดับ 1
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              วัดจากผลผลิตที่ได้ต่อกิโลกรัมพันธุ์ (ตามด้วย อ.เสริมงาม, อ.ห้างฉัตร)
            </p>
          </div>
        </div>

        <div className="bg-amber-50/60 dark:bg-amber-950/30 p-6 rounded-2xl border border-amber-200 dark:border-amber-900/50 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
              พืชอาศัยยอดนิยม
            </p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-amber-100 mt-1">
              ต้นจามจุรี (ก้ามปู)
            </h3>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black text-amber-600 dark:text-amber-400">
              Top 1
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              เรือนยอดโปร่ง แตกกิ่งเร็ว เหมาะกับการเลี้ยงครั่งมากที่สุด
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ranking Switcher */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700/60 pb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              📍 อันดับพื้นที่การผลิต จ.ลำปาง
            </h3>
            <div className="flex bg-slate-100 dark:bg-slate-700/60 p-1 rounded-xl text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveTab("farmers")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === "farmers"
                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm font-bold"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                }`}
              >
                ผู้เลี้ยงมากสุด
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("efficiency")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === "efficiency"
                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm font-bold"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                }`}
              >
                ประสิทธิภาพสูงสุด
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {activeTab === "farmers" ? (
              <>
                <div className="flex items-center justify-between p-3.5 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">🥇 อันดับ 1: อ.วังเหนือ</span>
                  <span className="text-xs bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2.5 py-1 rounded-full font-semibold">เกษตรกรมากที่สุด</span>
                </div>
                <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm">🥈 อันดับ 2: อ.แจ้ห่ม</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">ยุทธศาสตร์การผลิต</span>
                </div>
                <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm">🥉 อันดับ 3: อ.เมืองปาน</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">ยุทธศาสตร์การผลิต</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between p-3.5 bg-sky-50/50 dark:bg-sky-950/20 rounded-xl border border-sky-100 dark:border-sky-900/50">
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">🥇 อันดับ 1: อ.สบปราบ</span>
                  <span className="text-xs bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200 px-2.5 py-1 rounded-full font-semibold">ผลผลิต/กก.พันธุ์ สูงสุด</span>
                </div>
                <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm">🥈 อันดับ 2: อ.เสริมงาม</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">อัตราการรอดสูง</span>
                </div>
                <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm">🥉 อันดับ 3: อ.ห้างฉัตร</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">อัตราการรอดสูง</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Composition Bars */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="space-y-1 border-b border-slate-100 dark:border-slate-700/60 pb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              🧪 สัดส่วนองค์ประกอบของครั่งดิบ (Sticklac)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              สัดส่วนสารธรรมชาติที่สกัดได้จากรังครั่ง
            </p>
          </div>

          <div className="space-y-4">
            {compositions.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                  <span>{item.name}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{item.percent}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// --- COMPONENT: Accordion ---
function LacKnowledgeAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const accordions = [
    {
      title: "🗓️ ปฏิทินและเทคนิคการเพาะเลี้ยงครั่ง (ฤดูกาล & การคัดพันธุ์)",
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-amber-50/80 dark:bg-amber-950/20 p-4 rounded-xl border border-amber-200 dark:border-amber-900/40">
              <p className="font-bold text-amber-900 dark:text-amber-200 mb-2">☀️ รอบฤดูร้อน</p>
              <ul className="list-disc list-inside space-y-1">
                <li><b>ปล่อยครั่ง:</b> พฤศจิกายน - ธันวาคม</li>
                <li><b>เก็บเกี่ยว:</b> พฤษภาคม - มิถุนายน</li>
              </ul>
            </div>
            <div className="bg-sky-50/80 dark:bg-sky-950/20 p-4 rounded-xl border border-sky-200 dark:border-sky-900/40">
              <p className="font-bold text-sky-900 dark:text-sky-200 mb-2">🌧️ รอบฤดูฝน</p>
              <ul className="list-disc list-inside space-y-1">
                <li><b>ปล่อยครั่ง:</b> พฤษภาคม - มิถุนายน</li>
                <li><b>เก็บเกี่ยว:</b> พฤศจิกายน - ธันวาคม (ปีถัดไป)</li>
              </ul>
            </div>
          </div>
          <div className="space-y-2 border-t pt-3 border-slate-200 dark:border-slate-700">
            <p className="font-bold text-slate-900 dark:text-white">📌 เทคนิคการคัดเลือกและปล่อยครั่งพันธุ์:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
              <li>คัดรังครั่งสมบูรณ์ หนา เกาะติดกิ่งดี ไม่มีร่องรอยศัตรูพืชทำลาย</li>
              <li>ตัดครั่งพันธุ์ความยาว 15 ซม. (หนัก 40-50 กรัม) ผูกติดกิ่งพืชอาศัยห่างกันช่วงละ 3-4 เมตร</li>
              <li><b>การดูแลหลังปล่อย:</b> เก็บครั่งพันธุ์ออกภายใน 3 สัปดาห์ หรือเมื่อตัวอ่อนลงเกาะหมดแล้ว</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "🌿 รายชื่อพืชอาศัยยอดนิยม และลักษณะต้นไม้ที่เหมาะสม",
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          <p><b>คุณลักษณะต้นไม้ที่เหมาะแก่การเลี้ยงครั่ง:</b> เรือนยอดโปร่ง ได้รับแสงแดดพอเหมาะ อากาศถ่ายเทสะดวก แตกกิ่งได้ตลอดปี และเติบโตเร็ว</p>
          <div className="p-4 bg-slate-100/70 dark:bg-slate-700/40 rounded-xl">
            <p className="font-bold text-slate-900 dark:text-white mb-2">ตัวอย่างพืชอาศัย (Host Trees):</p>
            <div className="flex flex-wrap gap-2">
              {[
                "ต้นจามจุรี (ก้ามปู) - Top 1",
                "ต้นปลัก",
                "ต้นสีเสียด",
                "ต้นปันแก",
                "กระถินเทพา",
                "ต้นลำไย",
                "ต้นลิ้นจี่",
                "ต้นพุทรา",
                "มะขามเทศ",
                "มะกอกเกลื้อน",
              ].map((tree, idx) => (
                <span key={idx} className="bg-white dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-600 text-xs font-medium shadow-sm">
                  🌱 {tree}
                </span>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "🏭 ผลิตภัณฑ์และการแปรรูปจากครั่ง สู่ประโยชน์รอบตัว",
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-rose-50/80 dark:bg-rose-950/20 rounded-xl border border-rose-100 dark:border-rose-900/40">
              <p className="font-bold text-rose-800 dark:text-rose-300">🎨 สีสกัดธรรมชาติ</p>
              <p className="mt-1 text-slate-600 dark:text-slate-400">ใช้ย้อมผ้าสีแดงธรรมชาติ และแปรรูปเป็นสีผสมอาหาร</p>
            </div>
            <div className="p-3.5 bg-amber-50/80 dark:bg-amber-950/20 rounded-xl border border-amber-100 dark:border-amber-900/40">
              <p className="font-bold text-amber-800 dark:text-amber-300">✨ สารเคลือบสารพัดประโยชน์</p>
              <p className="mt-1 text-slate-600 dark:text-slate-400">ทำเชลแลกทาเงาไม้ เคลือบผิวผลไม้ เคลือบยาเม็ด ลูกอม และลิปสติก</p>
            </div>
            <div className="p-3.5 bg-emerald-50/80 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
              <p className="font-bold text-emerald-800 dark:text-emerald-300">🌱 น้ำล้างครั่งรักษ์โลก</p>
              <p className="mt-1 text-slate-600 dark:text-slate-400">น้ำจากการล้างครั่งดิบนำมาใช้เป็นสารบำรุงดิน ช่วยให้พืชผักเติบโตเร็วขึ้น</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "🌡️ ผลกระทบจากสภาวะโลกร้อน (Climate Change) ต่อการเลี้ยงครั่ง",
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          <div className="p-4 bg-red-50/80 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900/40 space-y-2">
            <p className="font-bold text-red-900 dark:text-red-200">⚠️ ปัจจัยความเสี่ยงที่ต้องระวัง:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
              <li><b>อุณหภูมิสูงขึ้น:</b> ทำให้แมลงครั่งอ่อนแอ เมตาบอลิซึมผิดปกติ ตัวแมลงตายง่าย ผลผลิตลดลง</li>
              <li><b>ฝนตกผิดฤดูกาล:</b> ส่งผลต่อการเกาะของตัวอ่อน ครั่งหลุดร่วงง่าย และเกิดเชื้อราในรังครั่ง</li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
      <div className="text-center mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          ❓ เจาะลึกรายละเอียด (FAQ & Accordion)
        </h2>
      </div>

      <div className="space-y-3">
        {accordions.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-800 shadow-sm transition-all"
            >
              <button
                type="button"
                onClick={() => toggleAccordion(index)}
                aria-expanded={isOpen}
                className="w-full flex justify-between items-center p-4 sm:p-5 text-left font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all text-sm sm:text-base gap-4 cursor-pointer"
              >
                <span>{item.title}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0 text-lg transition-transform duration-200">
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              {isOpen && (
                <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/50">
                  {item.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
