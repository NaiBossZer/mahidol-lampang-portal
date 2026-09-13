import {
  Users,
  Activity,
  BookOpen,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

const metrics = [
  {
    label: "ผู้ใช้งานทั้งหมด",
    value: "4,832",
    change: "+12.4%",
    up: true,
    icon: Users,
    color: "#1677A8",
  },
  {
    label: "กิจกรรมเดือนนี้",
    value: "28",
    change: "+4 จากเดือนที่แล้ว",
    up: true,
    icon: Activity,
    color: "#5F8D62",
  },
  {
    label: "การเรียนรู้ที่เสร็จสิ้น",
    value: "1,204",
    change: "-3.1%",
    up: false,
    icon: BookOpen,
    color: "#C66B4F",
  },
  {
    label: "ความพึงพอใจ LAC",
    value: "88%",
    change: "+2.3% จากไตรมาสก่อน",
    up: true,
    icon: TrendingUp,
    color: "#D6A84F",
  },
];

const recentActivities = [
  { title: "Workshop ภูมิปัญญาครั่ง", date: "22 ก.ย.", status: "active", participants: 18 },
  { title: "ตลาดชุมชนออร์แกนิก", date: "12 ต.ค.", status: "upcoming", participants: 0 },
  { title: "สัมมนา AI ในการศึกษา", date: "5 ต.ค.", status: "upcoming", participants: 0 },
  { title: "Smart Farm Open Day", date: "15 ก.ย.", status: "completed", participants: 64 },
  { title: "นำเสนอผลวิจัยสิ่งแวดล้อม", date: "20 ต.ค.", status: "upcoming", participants: 0 },
];

const statusMap = {
  active: { label: "กำลังดำเนินการ", color: "#5F8D62", bg: "#5F8D6215", icon: Activity },
  upcoming: { label: "กำลังจะมาถึง", color: "#1677A8", bg: "#1677A815", icon: Clock },
  completed: { label: "เสร็จสิ้น", color: "#667085", bg: "#66708515", icon: CheckCircle },
};

const systemAlerts = [
  { msg: "Smart Farm เซ็นเซอร์ B-04 ออฟไลน์", severity: "warning" },
  { msg: "ระบบชำระเงินออนไลน์ยังไม่พร้อมใช้งาน", severity: "info" },
  { msg: "สำรองข้อมูลสำเร็จ 09:00 น.", severity: "success" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Metric cards */}
      <div className="grid grid-cols-4 max-xl:grid-cols-2 max-sm:grid-cols-1 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-white rounded-xl border border-[#E2E6EA] p-5">
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: m.color + "18" }}
                >
                  <Icon size={17} style={{ color: m.color }} />
                </div>
                <button className="text-[#9BA8B7] hover:text-[#667085] transition-colors">
                  <MoreHorizontal size={16} />
                </button>
              </div>
              <div className="text-[#667085] text-xs mb-1">{m.label}</div>
              <div className="font-display font-bold text-2xl text-[#1F2933] mb-1">{m.value}</div>
              <div
                className={`flex items-center gap-1 text-xs ${m.up ? "text-[#5F8D62]" : "text-[#C66B4F]"}`}
              >
                {m.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {m.change}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-[1fr_340px] max-lg:grid-cols-1 gap-5">
        {/* Activities table */}
        <div className="bg-white rounded-xl border border-[#E2E6EA] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E2E6EA] flex items-center justify-between">
            <h2 className="text-[#1F2933] font-semibold text-sm">กิจกรรมล่าสุด</h2>
            <button className="flex items-center gap-1 text-[#1677A8] text-xs font-medium hover:underline">
              ดูทั้งหมด <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-[#F0F2F5]">
            {recentActivities.map((a) => {
              const s = statusMap[a.status as keyof typeof statusMap];
              const StatusIcon = s.icon;
              return (
                <div
                  key={a.title}
                  className="px-5 py-3.5 flex items-center gap-4 hover:bg-[#F8F9FA] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-[#1F2933] text-sm font-medium truncate">{a.title}</div>
                    <div className="text-[#9BA8B7] text-xs mt-0.5">{a.date}</div>
                  </div>
                  {a.participants > 0 && (
                    <div className="text-[#667085] text-xs flex items-center gap-1">
                      <Users size={11} /> {a.participants}
                    </div>
                  )}
                  <div
                    className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
                    style={{ color: s.color, backgroundColor: s.bg }}
                  >
                    <StatusIcon size={11} />
                    {s.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alerts + quick stats */}
        <div className="space-y-5">
          {/* System alerts */}
          <div className="bg-white rounded-xl border border-[#E2E6EA] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E2E6EA]">
              <h2 className="text-[#1F2933] font-semibold text-sm">สถานะระบบ</h2>
            </div>
            <div className="p-4 space-y-3">
              {systemAlerts.map((a, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    a.severity === "warning"
                      ? "bg-[#C66B4F]/8 border border-[#C66B4F]/15"
                      : a.severity === "info"
                        ? "bg-[#1677A8]/8 border border-[#1677A8]/15"
                        : "bg-[#5F8D62]/8 border border-[#5F8D62]/15"
                  }`}
                >
                  {a.severity === "warning" ? (
                    <AlertCircle size={14} className="text-[#C66B4F] mt-0.5 flex-shrink-0" />
                  ) : a.severity === "info" ? (
                    <AlertCircle size={14} className="text-[#1677A8] mt-0.5 flex-shrink-0" />
                  ) : (
                    <CheckCircle size={14} className="text-[#5F8D62] mt-0.5 flex-shrink-0" />
                  )}
                  <p className="text-[#1F2933] text-xs leading-relaxed">{a.msg}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick stats */}
          <div className="bg-white rounded-xl border border-[#E2E6EA] p-5">
            <h2 className="text-[#1F2933] font-semibold text-sm mb-4">สรุปเดือนกันยายน</h2>
            <div className="space-y-3">
              {[
                { label: "สมาชิกใหม่", value: 128, max: 200, color: "#1677A8" },
                { label: "กิจกรรมที่เสร็จ", value: 8, max: 12, color: "#5F8D62" },
                { label: "ยอดขายสินค้า", value: 65, max: 100, color: "#D6A84F" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[#667085] text-xs">{s.label}</span>
                    <span className="font-display text-sm font-bold text-[#1F2933]">{s.value}</span>
                  </div>
                  <div className="h-1.5 bg-[#F0F2F5] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(s.value / s.max) * 100}%`, backgroundColor: s.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
