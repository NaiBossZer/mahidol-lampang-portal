import { useState } from "react";

// --- INTERFACES ---
interface CardItem {
  id: number;
  icon: string;
  title: string;
  desc: string;
  tag: string;
  bgColor: string;
  borderColor: string;
  badgeColor: string;
  detail: {
    overview: string;
    highlights: string[];
  };
}

export function LacKnowledgeCards() {
  // State สำหรับเก็บข้อมูลการ์ดที่ถูกเลือก (ถ้าเป็น null แสดงว่าไม่ได้เปิด Modal)
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
          "ครั่ง คือ ยางหรือสารชันชนิดหนึ่งที่ขับออกมาจากตัวแมลงครั่ง (Laccifer lacca) เพื่อสร้างเป็นรังห่อหุ้มลำตัว ครั่งดิบมีลักษณะเป็นก้อนแข็งสีแดงอิฐหรือน้ำตาลแดง ห่อหุ้มกิ่งไม้ มีคุณสมบัติละลายได้ในแอลกอฮอล์ และหลอมเหลวด้วยความร้อน",
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
          คลิกที่การ์ดเพื่ออ่านรายละเอียดเชิงลึกของแต่ละหมวดหมู่
        </p>
      </div>

      {/* Grid Cards List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
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
          </button>
        ))}
      </div>

      {/* --- MODAL DIALOG (แสดงเฉพาะเมื่อ selectedCard !== null) --- */}
      {selectedCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedCard(null)} // คลิกพื้นหลังสีดำเพื่อปิด
        >
          {/* Modal Container */}
          <div
            className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // ป้องกันไม่ให้คลิกข้างในตู้แล้วปิด
          >
            {/* ปุ่มปิด มุมขวาบน */}
            <button
              type="button"
              onClick={() => setSelectedCard(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 w-9 h-9 rounded-full flex items-center justify-center transition-all text-lg font-bold"
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* Modal Content */}
            <div className="space-y-6">
              {/* Header */}
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

              {/* Overview */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  📌 ภาพรวมองค์ความรู้
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
                  {selectedCard.detail.overview}
                </p>
              </div>

              {/* Highlights List */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  💡 ประเด็นสำคัญ
                </h4>
                <ul className="space-y-2">
                  {selectedCard.detail.highlights.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
                    >
                      <span className="text-emerald-500 font-bold mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedCard(null)}
                  className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md active:scale-95"
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
