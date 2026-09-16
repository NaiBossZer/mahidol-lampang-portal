import { useState } from "react";
import { Download, Filter, Star, TrendingUp, Users, MessageSquare } from "lucide-react";

const quarters = ["Q1 2567", "Q2 2567", "Q3 2567", "Q4 2566"];

const satisfactionData = [
  { category: "คุณภาพการสอน", score: 4.6, responses: 312, trend: "+0.2" },
  { category: "สิ่งอำนวยความสะดวก", score: 4.2, responses: 298, trend: "+0.1" },
  { category: "การสนับสนุนนักศึกษา", score: 4.4, responses: 305, trend: "-0.1" },
  { category: "ทรัพยากรการเรียนรู้", score: 4.5, responses: 287, trend: "+0.3" },
  { category: "บรรยากาศชุมชน", score: 4.7, responses: 320, trend: "+0.4" },
  { category: "โปรแกรมนวัตกรรม", score: 4.3, responses: 245, trend: "0.0" },
];

const recentFeedback = [
  { name: "นักศึกษา A", score: 5, comment: "กิจกรรม Shellac Workshop ให้ประสบการณ์ตรงมาก ประทับใจมาก", date: "20 ก.ย." },
  { name: "ผู้เข้าร่วม B", score: 4, comment: "ห้องปฏิบัติการดี แต่อยากให้มีอุปกรณ์เพิ่มเติม", date: "18 ก.ย." },
  { name: "นักวิจัย C", score: 5, comment: "เครือข่ายชุมชนแข็งแกร่งมาก ได้ความรู้จากชาวบ้านจริงๆ", date: "15 ก.ย." },
  { name: "นักศึกษา D", score: 3, comment: "ระบบลงทะเบียนออนไลน์ยังไม่ค่อยสะดวก ต้องปรับปรุง", date: "12 ก.ย." },
];

const StarRating = ({ score }: { score: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={12}
        className={s <= Math.round(score) ? "text-[#D6A84F] fill-[#D6A84F]" : "text-[#E2E6EA]"}
      />
    ))}
  </div>
);

export default function AdminLACSatisfaction() {
  const [activeQuarter, setActiveQuarter] = useState("Q3 2567");

  const overall = satisfactionData.reduce((a, b) => a + b.score, 0) / satisfactionData.length;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[#667085]" />
          <div className="flex gap-1.5">
            {quarters.map((q) => (
              <button
                key={q}
                onClick={() => setActiveQuarter(q)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677A8] ${
                  activeQuarter === q
                    ? "bg-[#123B63] text-white"
                    : "bg-white border border-[#E2E6EA] text-[#667085] hover:border-[#123B63]/30"
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E2E6EA] bg-white text-[#667085] text-sm hover:border-[#123B63]/30 transition-colors min-h-[40px]">
          <Download size={14} /> ส่งออกรายงาน
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-4">
        <div className="bg-white rounded-xl border border-[#E2E6EA] p-5">
          <div className="flex items-center gap-2 mb-3">
            <Star size={16} className="text-[#D6A84F]" />
            <span className="text-[#667085] text-sm">คะแนนรวม</span>
          </div>
          <div className="font-display font-bold text-4xl text-[#1F2933] mb-1">{overall.toFixed(1)}</div>
          <div className="flex gap-0.5 mb-1">
            {[1,2,3,4,5].map((s) => (
              <Star key={s} size={14} className={s <= Math.round(overall) ? "text-[#D6A84F] fill-[#D6A84F]" : "text-[#E2E6EA]"} />
            ))}
          </div>
          <div className="text-[#5F8D62] text-xs flex items-center gap-1">
            <TrendingUp size={11} /> +0.3 จากไตรมาสก่อน
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E6EA] p-5">
          <div className="flex items-center gap-2 mb-3">
            <Users size={16} className="text-[#1677A8]" />
            <span className="text-[#667085] text-sm">ผู้ตอบแบบสำรวจ</span>
          </div>
          <div className="font-display font-bold text-4xl text-[#1F2933] mb-1">1,767</div>
          <div className="text-[#5F8D62] text-xs flex items-center gap-1">
            <TrendingUp size={11} /> +218 จากไตรมาสก่อน
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E6EA] p-5">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare size={16} className="text-[#C66B4F]" />
            <span className="text-[#667085] text-sm">ความคิดเห็น</span>
          </div>
          <div className="font-display font-bold text-4xl text-[#1F2933] mb-1">284</div>
          <div className="text-[#5F8D62] text-xs flex items-center gap-1">
            <TrendingUp size={11} /> +47 ความคิดเห็น
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_360px] max-lg:grid-cols-1 gap-5">
        {/* Category scores */}
        <div className="bg-white rounded-xl border border-[#E2E6EA] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E2E6EA]">
            <h2 className="text-[#1F2933] font-semibold text-sm">คะแนนแยกตามหมวดหมู่ · {activeQuarter}</h2>
          </div>
          <div className="divide-y divide-[#F0F2F5]">
            {satisfactionData.map((d) => (
              <div key={d.category} className="px-5 py-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#1F2933] text-sm font-medium">{d.category}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[#9BA8B7] text-xs">{d.responses} ผู้ตอบ</span>
                    <span
                      className={`text-xs font-medium ${
                        d.trend.startsWith("+") ? "text-[#5F8D62]" :
                        d.trend.startsWith("-") ? "text-[#C66B4F]" :
                        "text-[#9BA8B7]"
                      }`}
                    >
                      {d.trend !== "0.0" ? d.trend : "–"}
                    </span>
                    <div className="flex items-center gap-1.5 min-w-[52px]">
                      <span className="font-display font-bold text-sm text-[#1F2933]">{d.score}</span>
                      <StarRating score={d.score} />
                    </div>
                  </div>
                </div>
                <div className="h-2 bg-[#F0F2F5] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(d.score / 5) * 100}%`,
                      backgroundColor: d.score >= 4.5 ? "#5F8D62" : d.score >= 4.0 ? "#D6A84F" : "#C66B4F",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent feedback */}
        <div className="bg-white rounded-xl border border-[#E2E6EA] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E2E6EA]">
            <h2 className="text-[#1F2933] font-semibold text-sm">ความคิดเห็นล่าสุด</h2>
          </div>
          <div className="divide-y divide-[#F0F2F5]">
            {recentFeedback.map((f, i) => (
              <div key={i} className="px-5 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#EEE9DF] flex items-center justify-center text-[#123B63] text-xs font-bold">
                      {f.name.slice(0, 1)}
                    </div>
                    <span className="text-[#1F2933] text-sm font-medium">{f.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating score={f.score} />
                    <span className="text-[#9BA8B7] text-xs">{f.date}</span>
                  </div>
                </div>
                <p className="text-[#667085] text-sm leading-relaxed">{f.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
