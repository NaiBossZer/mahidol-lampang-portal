import { useState } from "react";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import type { PublicPage } from "../PublicPortal";

interface Props {
  navigate: (p: PublicPage) => void;
}

const categories = ["ทั้งหมด", "เกษตร", "วัฒนธรรม", "พลังงาน", "การศึกษา", "วิจัย", "ชุมชน"];

const allActivities = [
  { id: 1, category: "เกษตร", tag: "#5F8D62", title: "เปิดรับสมัครนักเรียนฝึกงาน Smart Farm 2567", date: "15 ก.ย. 2567", location: "ศูนย์เกษตรอัจฉริยะ", image: "https://images.unsplash.com/photo-1560559383-338dc7faf062?w=600&h=380&fit=crop&auto=format" },
  { id: 2, category: "วัฒนธรรม", tag: "#C66B4F", title: "Workshop ภูมิปัญญาครั่ง กับ Shellac Learning Center", date: "22 ก.ย. 2567", location: "SLC อาคาร B", image: "https://images.unsplash.com/photo-1647879826700-cfc5fd9d9a31?w=600&h=380&fit=crop&auto=format" },
  { id: 3, category: "พลังงาน", tag: "#1677A8", title: "เปิดตัวระบบโซลาร์เซลล์ชุมชน ลดคาร์บอน 40%", date: "30 ก.ย. 2567", location: "ลานกิจกรรมกลาง", image: "https://images.unsplash.com/photo-1711397651462-3b2a22f5cfc8?w=600&h=380&fit=crop&auto=format" },
  { id: 4, category: "การศึกษา", tag: "#123B63", title: "สัมมนาวิชาการ: นวัตกรรมการศึกษาในยุค AI", date: "5 ต.ค. 2567", location: "ห้องประชุมใหญ่", image: "https://images.unsplash.com/photo-1708454567006-c020cda64b36?w=600&h=380&fit=crop&auto=format" },
  { id: 5, category: "ชุมชน", tag: "#D6A84F", title: "ตลาดชุมชนออร์แกนิก ครั้งที่ 12", date: "12 ต.ค. 2567", location: "ลานกิจกรรมกลาง", image: "https://images.unsplash.com/photo-1647607124632-f47bfa887125?w=600&h=380&fit=crop&auto=format" },
  { id: 6, category: "วิจัย", tag: "#5F8D62", title: "นำเสนอผลงานวิจัยด้านสิ่งแวดล้อมลำปาง 2567", date: "20 ต.ค. 2567", location: "ห้อง Conference 1", image: "https://images.unsplash.com/photo-1731865746818-9c6dbbc52c72?w=600&h=380&fit=crop&auto=format" },
];

export default function ActivitiesPage({ navigate }: Props) {
  const [activeCategory, setActiveCategory] = useState("ทั้งหมด");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = allActivities.filter((a) => {
    const matchCat = activeCategory === "ทั้งหมด" || a.category === activeCategory;
    const matchSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div>
      {/* Page header */}
      <div className="bg-white border-b border-[#EEE9DF]">
        <div className="max-w-[1280px] mx-auto px-8 max-md:px-4 py-10">
          <nav className="flex items-center gap-2 text-sm text-[#667085] mb-4" aria-label="Breadcrumb">
            <button onClick={() => navigate("home")} className="hover:text-[#123B63] transition-colors">หน้าหลัก</button>
            <ChevronRight size={14} />
            <span className="text-[#1F2933] font-medium">กิจกรรม</span>
          </nav>
          <h1 className="text-[#123B63] font-bold text-4xl max-md:text-2xl mb-2">กิจกรรมและข่าวสาร</h1>
          <p className="text-[#667085] text-base">ติดตามกิจกรรม โครงการ และข่าวสารจากมหิดล ลำปาง</p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-8 max-md:px-4 py-10">
        {/* Search + filter */}
        <div className="flex flex-wrap gap-4 mb-8 items-center">
          <div className="relative flex-1 min-w-[240px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085]" />
            <input
              type="search"
              placeholder="ค้นหากิจกรรม..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EEE9DF] bg-white text-[#1F2933] text-sm placeholder:text-[#9BA8B7] focus:outline-none focus:ring-2 focus:ring-[#1677A8] focus:border-transparent min-h-[44px]"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={14} className="text-[#667085]" />
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors min-h-[36px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677A8] ${
                  activeCategory === c
                    ? "bg-[#123B63] text-white"
                    : "bg-white border border-[#EEE9DF] text-[#667085] hover:border-[#123B63]/30 hover:text-[#123B63]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Result summary */}
        <div className="text-[#667085] text-sm mb-6">
          แสดง <strong className="text-[#1F2933]">{filtered.length}</strong> รายการ
          {activeCategory !== "ทั้งหมด" && ` ในหมวด "${activeCategory}"`}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-6">
            {filtered.map((a) => (
              <button
                key={a.id}
                onClick={() => navigate("activity-detail")}
                className="group text-left bg-white rounded-2xl overflow-hidden border border-[#EEE9DF] hover:shadow-md hover:border-[#D6A84F]/30 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677A8]"
              >
                <div className="aspect-[16/10] overflow-hidden bg-[#EEE9DF]">
                  <img
                    src={a.image}
                    alt={a.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
                      style={{ backgroundColor: a.tag }}
                    >
                      {a.category}
                    </span>
                  </div>
                  <h3 className="text-[#1F2933] font-semibold text-base leading-snug mb-3 group-hover:text-[#123B63] transition-colors">
                    {a.title}
                  </h3>
                  <div className="flex items-center justify-between text-[#667085] text-xs">
                    <span>{a.date}</span>
                    <span className="truncate ml-2">{a.location}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-[#EEE9DF] flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-[#9BA8B7]" />
            </div>
            <h3 className="text-[#1F2933] font-semibold text-lg mb-2">ไม่พบกิจกรรม</h3>
            <p className="text-[#667085] text-sm">ลองเปลี่ยนคำค้นหาหรือหมวดหมู่</p>
          </div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button className="w-10 h-10 rounded-lg border border-[#EEE9DF] flex items-center justify-center text-[#667085] hover:border-[#123B63]/30 hover:text-[#123B63] transition-colors disabled:opacity-40" disabled>
              <ChevronLeft size={16} />
            </button>
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                  p === 1
                    ? "bg-[#123B63] text-white"
                    : "border border-[#EEE9DF] text-[#667085] hover:border-[#123B63]/30 hover:text-[#123B63]"
                }`}
              >
                {p}
              </button>
            ))}
            <button className="w-10 h-10 rounded-lg border border-[#EEE9DF] flex items-center justify-center text-[#667085] hover:border-[#123B63]/30 hover:text-[#123B63] transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
