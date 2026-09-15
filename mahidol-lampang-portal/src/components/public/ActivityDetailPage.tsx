import { ChevronRight, Calendar, MapPin, Users, Share2, Bookmark, ArrowLeft } from "lucide-react";
import type { PublicPage } from "../PublicPortal";

interface Props {
  navigate: (p: PublicPage) => void;
}

export default function ActivityDetailPage({ navigate }: Props) {
  return (
    <div className="max-w-[1280px] mx-auto px-8 max-md:px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[#667085] mb-6" aria-label="Breadcrumb">
        <button onClick={() => navigate("home")} className="hover:text-[#123B63] transition-colors">หน้าหลัก</button>
        <ChevronRight size={14} />
        <button onClick={() => navigate("activities")} className="hover:text-[#123B63] transition-colors">กิจกรรม</button>
        <ChevronRight size={14} />
        <span className="text-[#1F2933] font-medium truncate">Workshop ภูมิปัญญาครั่ง</span>
      </nav>

      <div className="grid grid-cols-[1fr_320px] max-lg:grid-cols-1 gap-10">
        {/* Main content */}
        <article>
          {/* Category + meta */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-[#C66B4F] text-white text-xs font-semibold px-3 py-1 rounded-full">วัฒนธรรม</span>
            <span className="text-[#667085] text-sm">22 กันยายน 2567</span>
          </div>

          <h1 className="text-[#123B63] font-bold text-4xl max-md:text-2xl leading-snug mb-4">
            Workshop ภูมิปัญญาครั่งและการใช้ประโยชน์<br className="max-sm:hidden" />
            กับ Shellac Learning Center
          </h1>

          <p className="text-[#667085] text-lg leading-relaxed mb-6">
            กิจกรรมเปิดบ้าน Shellac Learning Center พร้อมเวิร์คช็อปเรียนรู้กระบวนการผลิตครั่งธรรมชาติ
            และการนำไปใช้ประโยชน์ทั้งในเชิงอุตสาหกรรมและศิลปะร่วมสมัย
          </p>

          {/* Hero image */}
          <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-[#EEE9DF] mb-8">
            <img
              src="https://images.unsplash.com/photo-1647879826700-cfc5fd9d9a31?w=900&h=506&fit=crop&auto=format"
              alt="Workshop ภูมิปัญญาครั่ง"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Body */}
          <div className="prose max-w-none text-[#1F2933] leading-relaxed space-y-5">
            <p>
              Shellac Learning Center มหิดล ลำปาง ขอเชิญชวนนักศึกษา นักวิจัย และผู้สนใจทุกท่านเข้าร่วม
              กิจกรรม Workshop ภูมิปัญญาครั่งและการใช้ประโยชน์ ซึ่งจัดขึ้นเป็นส่วนหนึ่งของโครงการ
              อนุรักษ์และพัฒนาภูมิปัญญาท้องถิ่นภาคเหนือ
            </p>
            <p>
              ในกิจกรรมนี้ ผู้เข้าร่วมจะได้เรียนรู้กระบวนการเก็บเกี่ยวครั่งธรรมชาติจากต้นไม้ในท้องถิ่น
              กระบวนการแปรรูป และการนำไปใช้ประโยชน์หลากหลายรูปแบบ ทั้งในอุตสาหกรรมอาหาร
              เครื่องสำอาง และงานศิลปะร่วมสมัย
            </p>
            <h2 className="text-[#123B63] font-bold text-xl mt-6 mb-3">กำหนดการ</h2>
            <div className="bg-[#F8F6F0] rounded-xl p-5 space-y-3 border border-[#EEE9DF]">
              {[
                { time: "08:30 – 09:00", label: "ลงทะเบียน" },
                { time: "09:00 – 10:30", label: "บรรยาย: ครั่งในบริบทลำปางและภาคเหนือ" },
                { time: "10:30 – 12:00", label: "Workshop: กระบวนการผลิตครั่งธรรมชาติ" },
                { time: "13:00 – 15:00", label: "Workshop: การนำครั่งไปใช้ในงานออกแบบ" },
                { time: "15:00 – 16:00", label: "นำเสนอผลงานและสรุป" },
              ].map((s) => (
                <div key={s.time} className="flex items-start gap-4">
                  <span className="font-display text-sm text-[#667085] min-w-[120px] font-medium">{s.time}</span>
                  <span className="text-[#1F2933] text-sm">{s.label}</span>
                </div>
              ))}
            </div>
            <h2 className="text-[#123B63] font-bold text-xl mt-6 mb-3">คุณสมบัติผู้เข้าร่วม</h2>
            <ul className="list-disc list-inside space-y-1.5 text-sm text-[#1F2933]">
              <li>นักศึกษาและบุคลากรมหาวิทยาลัยมหิดล</li>
              <li>ผู้ประกอบการและชุมชนในจังหวัดลำปาง</li>
              <li>ผู้สนใจด้านภูมิปัญญาท้องถิ่นและนวัตกรรม</li>
            </ul>
          </div>

          <div className="flex gap-3 mt-8">
            <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#123B63] text-white font-semibold text-sm hover:bg-[#0e2d4f] transition-colors min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677A8]">
              ลงทะเบียนเข้าร่วม
            </button>
            <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[#EEE9DF] bg-white text-[#667085] text-sm hover:border-[#123B63]/30 transition-colors min-h-[44px]">
              <Bookmark size={16} /> บันทึก
            </button>
            <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[#EEE9DF] bg-white text-[#667085] text-sm hover:border-[#123B63]/30 transition-colors min-h-[44px]">
              <Share2 size={16} /> แชร์
            </button>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="space-y-5">
          {/* Info card */}
          <div className="bg-white rounded-2xl border border-[#EEE9DF] p-6">
            <h2 className="text-[#1F2933] font-semibold text-base mb-5">รายละเอียดกิจกรรม</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar size={16} className="text-[#1677A8] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[#1F2933] text-sm font-medium">วันและเวลา</div>
                  <div className="text-[#667085] text-sm">22 กันยายน 2567, 08:30 – 16:00</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-[#C66B4F] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[#1F2933] text-sm font-medium">สถานที่</div>
                  <div className="text-[#667085] text-sm">Shellac Learning Center, อาคาร B มหิดล ลำปาง</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users size={16} className="text-[#5F8D62] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[#1F2933] text-sm font-medium">จำนวนที่รับ</div>
                  <div className="text-[#667085] text-sm">30 คน (รับสมัครแล้ว 18 คน)</div>
                </div>
              </div>
            </div>
            <div className="mt-5 pt-5 border-t border-[#EEE9DF]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#667085]">ที่นั่งที่เหลือ</span>
                <span className="text-sm font-semibold text-[#5F8D62]">12 / 30</span>
              </div>
              <div className="h-2 bg-[#EEE9DF] rounded-full overflow-hidden">
                <div className="h-full bg-[#5F8D62] rounded-full" style={{ width: "60%" }} />
              </div>
            </div>
            <button className="w-full mt-5 py-3 rounded-xl bg-[#123B63] text-white font-semibold text-sm hover:bg-[#0e2d4f] transition-colors min-h-[44px]">
              ลงทะเบียนเข้าร่วม
            </button>
          </div>

          {/* Related */}
          <div className="bg-white rounded-2xl border border-[#EEE9DF] p-6">
            <h2 className="text-[#1F2933] font-semibold text-base mb-4">กิจกรรมที่เกี่ยวข้อง</h2>
            <div className="space-y-4">
              {[
                { title: "ตลาดชุมชนออร์แกนิก ครั้งที่ 12", date: "12 ต.ค. 2567", tag: "ชุมชน" },
                { title: "สัมมนาวิชาการ: นวัตกรรม AI ในการศึกษา", date: "5 ต.ค. 2567", tag: "การศึกษา" },
              ].map((r) => (
                <button
                  key={r.title}
                  onClick={() => navigate("activity-detail")}
                  className="w-full text-left group"
                >
                  <div className="text-[#1F2933] text-sm font-medium group-hover:text-[#123B63] transition-colors leading-snug mb-1">
                    {r.title}
                  </div>
                  <div className="text-[#667085] text-xs">{r.date} · {r.tag}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate("activities")}
            className="flex items-center gap-2 text-[#1677A8] text-sm font-semibold hover:gap-3 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677A8] rounded p-1"
          >
            <ArrowLeft size={14} /> กลับรายการกิจกรรม
          </button>
        </aside>
      </div>
    </div>
  );
}
