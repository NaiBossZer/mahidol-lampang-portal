import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/survey")({
  component: SurveyPage,
});

// ⚠️ Web App URL ล่าสุดสำหรับรับข้อมูล
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbx6MoINngMyK4Jf4JgCTQHY_B_iydnYqtqSKcT2-UbslV23ZBX__k-ez7gbeixDXq8rPQ/exec";

// ตัวเลือกสำหรับแบบสอบถาม
const AGE_GROUPS = [
  "0 - 10 ปี",
  "11 - 20 ปี",
  "21 - 30 ปี",
  "31 - 40 ปี",
  "41 - 50 ปี",
  "51 - 60 ปี",
  "มากกว่า 60 ปี",
];

const AFFILIATIONS = [
  "หน่วยงานภาครัฐ (เช่น อบต./เทศบาล/อำเภอ)",
  "ภาคประชาชน/ชุมชน/ผู้นำชุมชน",
  "ภาคการศึกษา/สถานศึกษา",
  "อื่นๆ",
];

const CHANNEL_OPTIONS = [
  "FACEBOOK",
  "LINE",
  "WEBSITE ของคณะสิ่งแวดล้อมและทรัพยากรศาสตร์ ม.มหิดล",
  "อื่นๆ",
];

export function SurveyPage() {
  const [step, setStep] = useState<"pdpa" | "survey" | "submitting" | "submitted">("pdpa");
  const [agreed, setAgreed] = useState(false);

  // ตอนที่ 1: ข้อมูลทั่วไป
  const [ageGroup, setAgeGroup] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [affiliationOther, setAffiliationOther] = useState("");
  const [everJoined, setEverJoined] = useState("");
  const [channels, setChannels] = useState<string[]>([]);
  const [channelOther, setChannelOther] = useState("");

  // ตอนที่ 2: ความพึงพอใจต่อการจัดพิธีเปิด
  const [p2_location, setP2_location] = useState<number | null>(null);
  const [p2_schedule, setP2_schedule] = useState<number | null>(null);
  const [p2_readiness, setP2_readiness] = useState<number | null>(null);
  const [p2_reception, setP2_reception] = useState<number | null>(null);
  const [p2_overall, setP2_overall] = useState<number | null>(null);

  // ตอนที่ 3: ความพึงพอใจต่อห้องการเรียนรู้ครั่งครบวงจร
  const [p3_interest, setP3_interest] = useState<number | null>(null);
  const [p3_content, setP3_content] = useState<number | null>(null);
  const [p3_clarity, setP3_clarity] = useState<number | null>(null);
  const [p3_benefit, setP3_benefit] = useState<number | null>(null);
  const [p3_application, setP3_application] = useState<number | null>(null);

  // ตอนที่ 4: ผลที่ได้รับและข้อเสนอแนะ
  const [p4_knowledge, setP4_knowledge] = useState<number | null>(null);
  const [p4_inspiration, setP4_inspiration] = useState<number | null>(null);
  const [p4_communityResource, setP4_communityResource] = useState<number | null>(null);
  const [p4_futureReturn, setP4_futureReturn] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");

  // จัดการการเลือกช่องทางข่าวสาร (Checkbox)
  const handleChannelChange = (val: string) => {
    setChannels((prev) =>
      prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
    );
  };

  // จัดการการส่งแบบฟอร์ม
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. ตรวจสอบการเลือกช่องทางข่าวสาร
    if (channels.length === 0) {
      alert("กรุณาเลือกช่องทางที่ท่านทราบข่าวสารอย่างน้อย 1 ช่องทาง");
      return;
    }

    // 2. ตรวจสอบ Likert Scale (1-5) ให้ครบทุกข้อ
    const ratings = [
      p2_location, p2_schedule, p2_readiness, p2_reception, p2_overall,
      p3_interest, p3_content, p3_clarity, p3_benefit, p3_application,
      p4_knowledge, p4_inspiration, p4_communityResource, p4_futureReturn,
    ];

    if (ratings.some((r) => r === null)) {
      alert("กรุณาตอบแบบประเมินความพึงพอใจ (ให้คะแนน 1-5) ให้ครบทุกข้อครับ");
      return;
    }

    setStep("submitting");

    try {
      const finalAffiliation = affiliation === "อื่นๆ" ? affiliationOther : affiliation;
      const finalChannels = channels
        .map((c) => (c === "อื่นๆ" ? channelOther : c))
        .join(", ");

      const params = new URLSearchParams({
        // ตอนที่ 1
        ageGroup,
        affiliation: finalAffiliation,
        everJoined,
        channels: finalChannels,
        // ตอนที่ 2
        p2_location: p2_location?.toString() || "",
        p2_schedule: p2_schedule?.toString() || "",
        p2_readiness: p2_readiness?.toString() || "",
        p2_reception: p2_reception?.toString() || "",
        p2_overall: p2_overall?.toString() || "",
        // ตอนที่ 3
        p3_interest: p3_interest?.toString() || "",
        p3_content: p3_content?.toString() || "",
        p3_clarity: p3_clarity?.toString() || "",
        p3_benefit: p3_benefit?.toString() || "",
        p3_application: p3_application?.toString() || "",
        // ตอนที่ 4
        p4_knowledge: p4_knowledge?.toString() || "",
        p4_inspiration: p4_inspiration?.toString() || "",
        p4_communityResource: p4_communityResource?.toString() || "",
        p4_futureReturn: p4_futureReturn?.toString() || "",
        feedback,
      });

      await fetch(`${GOOGLE_SCRIPT_URL}?${params.toString()}`, {
        method: "GET",
        mode: "no-cors",
      });

      setStep("submitted");
    } catch (err) {
      console.error("Error sending data:", err);
      alert("เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง");
      setStep("survey");
    }
  };

  // Component ย่อยสำหรับสร้าง Likert Scale 5 -> 1
  const renderLikert = (
    nameGroup: string,
    value: number | null,
    onChange: (val: number) => void,
    leftLabel = "มากที่สุด",
    rightLabel = "น้อยที่สุด"
  ) => (
    <div className="mt-3">
      <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700">
        <span className="text-xs text-slate-500 w-20 text-left select-none">{leftLabel}</span>
        <div className="flex gap-2 sm:gap-6">
          {[5, 4, 3, 2, 1].map((score) => (
            <label key={score} className="flex flex-col items-center gap-1 cursor-pointer select-none">
              <input
                type="radio"
                name={nameGroup}
                checked={value === score}
                onChange={() => onChange(score)}
                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {score}
              </span>
            </label>
          ))}
        </div>
        <span className="text-xs text-slate-500 w-20 text-right select-none">{rightLabel}</span>
      </div>
    </div>
  );

  // 1. หน้าจอเมื่อส่งข้อมูลสำเร็จ
  if (step === "submitted") {
    return (
      <div 
        className="min-h-screen relative flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/Backdrop_Shellac_2569.png')" }}
      >
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]" />

        <div className="relative z-10 max-w-md w-full text-center bg-white/95 dark:bg-slate-800/95 p-8 rounded-2xl shadow-2xl border border-white/40 dark:border-slate-700 backdrop-blur-md">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-400 mb-2">
            ขอบคุณสำหรับข้อมูล!
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            ระบบได้รับผลการตอบแบบประเมินกิจกรรมพิธีเปิดห้องการเรียนรู้ครั่งครบวงจรเรียบร้อยแล้ว
          </p>
        </div>
      </div>
    );
  }

  // 2. หน้าข้อตกลง PDPA
  if (step === "pdpa") {
    return (
      <div 
        className="min-h-screen relative py-12 px-4 flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/Backdrop_Shellac_2569.png')" }}
      >
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]" />

        <div className="relative z-10 max-w-2xl w-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/50 dark:border-slate-700">
          <div className="border-b border-emerald-100 dark:border-slate-700 pb-4 mb-6 text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              พิธีเปิด
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
              ห้องการเรียนรู้ครั่งครบวงจร
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              วันที่ 21 สิงหาคม พ.ศ.2569 ณ คณะสิ่งแวดล้อมฯ มหาวิทยาลัยมหิดล อ.สบปราบ จ.ลำปาง
            </p>
          </div>

          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
            ข้อตกลงความเป็นส่วนตัว (PDPA)
          </h2>
          <div className="p-4 bg-emerald-50/80 dark:bg-slate-900/60 rounded-xl text-sm text-slate-700 dark:text-slate-300 mb-6 leading-relaxed border border-emerald-100/80 dark:border-slate-700">
            ข้อมูลที่ท่านกรอกในแบบประเมินนี้จะนำไปใช้เพื่อการวิเคราะห์และปรับปรุงการจัดกิจกรรมเท่านั้น{" "}
            โดยจะได้รับการคุ้มครองตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล (PDPA){" "}
            และไม่มีการเปิดเผยข้อมูลระบุตัวตนสู่สาธารณะ
          </div>

          <label className="flex items-center gap-3 mb-6 cursor-pointer group select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium group-hover:text-emerald-700 transition-colors">
              ข้าพเจ้าได้อ่านและยอมรับเงื่อนไขข้อตกลงความเป็นส่วนตัว
            </span>
          </label>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => {
                window.location.href = "/";
              }}
              className="w-1/2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              ไม่ยอมรับ
            </button>
            <button
              type="button"
              disabled={!agreed}
              onClick={() => setStep("survey")}
              className="w-1/2 rounded-xl bg-emerald-600 py-3 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all cursor-pointer"
            >
              ยอมรับ
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. หน้าแบบสอบถามหลัก
  return (
    <div className="min-h-screen bg-emerald-50/30 dark:bg-slate-900 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header Banner Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 sm:p-8 border-t-8 border-t-emerald-600 border-x border-b border-emerald-100 dark:border-slate-700">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            แบบเก็บข้อมูลความพึงพอใจพิธีเปิดห้องการเรียนรู้ครั่งครบวงจร
          </h1>
          <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-2 font-medium">
            วันศุกร์ที่ 21 สิงหาคม พ.ศ. 2569 ณ คณะสิ่งแวดล้อมฯ มหาวิทยาลัยมหิดล อ.สบปราบ จ.ลำปาง
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1 */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 space-y-5">
            <h2 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 border-b border-slate-100 dark:border-slate-700 pb-2">
              ตอนที่ 1 ข้อมูลทั่วไปของผู้ตอบแบบสอบถาม
            </h2>

            {/* ช่วงอายุ */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                ช่วงอายุ (ปี) <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AGE_GROUPS.map((item) => (
                  <label key={item} className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-emerald-50/50 dark:hover:bg-slate-700/50 cursor-pointer text-sm text-slate-700 dark:text-slate-300 transition-colors">
                    <input
                      type="radio"
                      name="ageGroup"
                      required
                      value={item}
                      onChange={(e) => setAgeGroup(e.target.value)}
                      className="text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            {/* หน่วยงานที่สังกัด */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                หน่วยงานที่สังกัดอยู่ <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {AFFILIATIONS.map((item) => (
                  <label key={item} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="affiliation"
                      required
                      value={item}
                      onChange={(e) => setAffiliation(e.target.value)}
                      className="text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    {item}
                  </label>
                ))}
                {affiliation === "อื่นๆ" && (
                  <input
                    type="text"
                    required
                    placeholder="ระบุหน่วยงานของคุณ..."
                    value={affiliationOther}
                    onChange={(e) => setAffiliationOther(e.target.value)}
                    className="mt-2 w-full p-2.5 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 border border-slate-300 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                )}
              </div>
            </div>

            {/* เคยเข้าร่วมกิจกรรมหรือไม่ */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                ท่านเคยเข้าร่วมกิจกรรมของโครงการนี้มาก่อนหรือไม่ <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-6">
                {["เคย", "ไม่เคย"].map((item) => (
                  <label key={item} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="everJoined"
                      required
                      value={item}
                      onChange={(e) => setEverJoined(e.target.value)}
                      className="text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            {/* ทราบข่าวสารจากช่องทางใด */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                ท่านทราบข่าวสารการจัดงานจากช่องทางใด (เลือกได้มากกว่า 1 ข้อ) <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {CHANNEL_OPTIONS.map((item) => (
                  <label key={item} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      value={item}
                      checked={channels.includes(item)}
                      onChange={() => handleChannelChange(item)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    {item}
                  </label>
                ))}
                {channels.includes("อื่นๆ") && (
                  <input
                    type="text"
                    required
                    placeholder="ระบุช่องทางอื่น..."
                    value={channelOther}
                    onChange={(e) => setChannelOther(e.target.value)}
                    className="mt-2 w-full p-2.5 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 border border-slate-300 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 space-y-5">
            <h2 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 border-b border-slate-100 dark:border-slate-700 pb-2">
              ตอนที่ 2 ความพึงพอใจต่อการจัดพิธีเปิด
            </h2>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                1. ความเหมาะสมของสถานที่จัดงาน <span className="text-red-500">*</span>
              </label>
              {renderLikert("p2_location", p2_location, setP2_location)}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                2. ความเหมาะสมของกำหนดการและระยะเวลาการจัดงาน <span className="text-red-500">*</span>
              </label>
              {renderLikert("p2_schedule", p2_schedule, setP2_schedule)}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                3. ความพร้อมและความเป็นระเบียบของสถานที่ <span className="text-red-500">*</span>
              </label>
              {renderLikert("p2_readiness", p2_readiness, setP2_readiness)}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                4. การต้อนรับและการอำนวยความสะดวกของเจ้าหน้าที่ <span className="text-red-500">*</span>
              </label>
              {renderLikert("p2_reception", p2_reception, setP2_reception)}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                5. ความพึงพอใจต่อการจัดพิธีเปิดโดยรวม <span className="text-red-500">*</span>
              </label>
              {renderLikert("p2_overall", p2_overall, setP2_overall)}
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 space-y-5">
            <h2 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 border-b border-slate-100 dark:border-slate-700 pb-2">
              ตอนที่ 3 ความพึงพอใจต่อห้องการเรียนรู้ครั่งครบวงจร
            </h2>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                1. ความน่าสนใจของห้องการเรียนรู้และนิทรรศการ <span className="text-red-500">*</span>
              </label>
              {renderLikert("p3_interest", p3_interest, setP3_interest)}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                2. ความเหมาะสมและความครบถ้วนของเนื้อหา <span className="text-red-500">*</span>
              </label>
              {renderLikert("p3_content", p3_content, setP3_content)}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                3. ความชัดเจนและเข้าใจง่ายของสื่อการเรียนรู้ <span className="text-red-500">*</span>
              </label>
              {renderLikert("p3_clarity", p3_clarity, setP3_clarity)}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                4. ประโยชน์ขององค์ความรู้ที่ได้รับ <span className="text-red-500">*</span>
              </label>
              {renderLikert("p3_benefit", p3_benefit, setP3_benefit)}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                5. ความสามารถในการนำความรู้ไปใช้หรือต่อยอด <span className="text-red-500">*</span>
              </label>
              {renderLikert("p3_application", p3_application, setP3_application)}
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 space-y-5">
            <h2 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 border-b border-slate-100 dark:border-slate-700 pb-2">
              ตอนที่ 4 ผลที่ได้รับและข้อเสนอแนะ
            </h2>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                1. ท่านได้รับความรู้และความเข้าใจเกี่ยวกับครั่งเพิ่มขึ้น <span className="text-red-500">*</span>
              </label>
              {renderLikert("p4_knowledge", p4_knowledge, setP4_knowledge)}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                2. กิจกรรมสามารถสร้างแรงบันดาลใจในการอนุรักษ์และพัฒนาครั่ง <span className="text-red-500">*</span>
              </label>
              {renderLikert("p4_inspiration", p4_inspiration, setP4_inspiration)}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                3. ห้องการเรียนรู้สามารถใช้เป็นแหล่งเรียนรู้สำหรับชุมชนและผู้สนใจได้ <span className="text-red-500">*</span>
              </label>
              {renderLikert("p4_communityResource", p4_communityResource, setP4_communityResource)}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                4. ท่านมีความสนใจเข้าร่วมกิจกรรมหรือกลับมาใช้ห้องการเรียนรู้อีกในอนาคต <span className="text-red-500">*</span>
              </label>
              {renderLikert("p4_futureReturn", p4_futureReturn, setP4_futureReturn)}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                5. ข้อเสนอแนะ/ความคิดเห็นเพิ่มเติม
              </label>
              <textarea
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="ข้อเสนอแนะเพิ่มเติม..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={step === "submitting"}
            className="w-full rounded-xl bg-emerald-600 py-3.5 text-base font-bold text-white hover:bg-emerald-700 shadow-lg transition-all disabled:opacity-50 cursor-pointer"
          >
            {step === "submitting" ? "กำลังบันทึกข้อมูล..." : "ส่งแบบประเมิน"}
          </button>
        </form>
      </div>
    </div>
  );
}
