import { useState } from "react";

export function LacKnowledgeAccordion() {
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
            <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-xl border border-amber-200 dark:border-amber-900">
              <p className="font-bold text-amber-900 dark:text-amber-200 mb-2">☀️ รอบฤดูร้อน</p>
              <ul className="list-disc list-inside space-y-1">
                <li><b>ปล่อยครั่ง:</b> พฤศจิกายน - ธันวาคม</li>
                <li><b>เก็บเกี่ยว:</b> พฤษภาคม - มิถุนายน</li>
              </ul>
            </div>
            <div className="bg-sky-50 dark:bg-sky-950/20 p-4 rounded-xl border border-sky-200 dark:border-sky-900">
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
          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
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
                <span key={idx} className="bg-white dark:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-600 text-xs font-medium">
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
            <div className="p-3 bg-rose-50 dark:bg-rose-950/20 rounded-xl border border-rose-100 dark:border-rose-900">
              <p className="font-bold text-rose-800 dark:text-rose-300">🎨 สีสกัดธรรมชาติ</p>
              <p className="mt-1 text-slate-600 dark:text-slate-400">ใช้ย้อมผ้าสีแดงธรรมชาติ และแปรรูปเป็นสีผสมอาหาร</p>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-100 dark:border-amber-900">
              <p className="font-bold text-amber-800 dark:text-amber-300">✨ สารเคลือบสารพัดประโยชน์</p>
              <p className="mt-1 text-slate-600 dark:text-slate-400">ทำเชลแลกทาเงาไม้ เคลือบผิวผลไม้ เคลือบยาเม็ด ลูกอม และลิปสติก</p>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900">
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
          <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900 space-y-2">
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
    <section className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          ❓ เจาะลึกรายละเอียด (FAQ & Accordion)
        </h2>
      </div>

      <div className="space-y-3">
        {accordions.map((item, index) => (
          <div
            key={index}
            className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-800 shadow-sm"
          >
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex justify-between items-center p-4 sm:p-5 text-left font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all text-sm sm:text-base"
            >
              <span>{item.title}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold ml-2">
                {openIndex === index ? "➖" : "➕"}
              </span>
            </button>

            {openIndex === index && (
              <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/50">
                {item.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
