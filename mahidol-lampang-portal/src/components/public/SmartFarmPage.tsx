import { useState } from "react";
import {
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Cpu,
  Leaf,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

const sensorData = [
  {
    icon: Thermometer,
    label: "อุณหภูมิ",
    value: "28.4",
    unit: "°C",
    status: "normal",
    color: "#C66B4F",
    trend: "+1.2",
  },
  {
    icon: Droplets,
    label: "ความชื้น",
    value: "72",
    unit: "%",
    status: "normal",
    color: "#1677A8",
    trend: "-3.1",
  },
  {
    icon: Sun,
    label: "แสงแดด",
    value: "6,840",
    unit: "lux",
    status: "high",
    color: "#D6A84F",
    trend: "+420",
  },
  {
    icon: Wind,
    label: "ความเร็วลม",
    value: "12.3",
    unit: "km/h",
    status: "normal",
    color: "#5F8D62",
    trend: "+0.5",
  },
];

const crops = [
  { name: "ข้าวกล้องหอมมะลิ", area: "2.4 ไร่", health: 92, stage: "ออกรวง", days: 18 },
  { name: "ผักกาดขาว อินทรีย์", area: "0.8 ไร่", health: 87, stage: "เก็บเกี่ยว", days: 5 },
  { name: "มะเขือเทศ Cherry", area: "0.5 ไร่", health: 95, stage: "ดอกบาน", days: 24 },
];

const alerts = [
  {
    type: "warning",
    msg: "ความชื้นดินแปลง B ต่ำกว่าค่าที่กำหนด — เปิดระบบน้ำอัตโนมัติ",
    time: "09:15",
  },
  { type: "info", msg: "ระบบพยากรณ์ฝน: มีฝนเล็กน้อย 16:00 – 18:00 น.", time: "08:00" },
];

export default function SmartFarmPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "crops" | "alerts">("overview");

  return (
    <div>
      {/* Header */}
      <div className="bg-[#123B63]">
        <div className="max-w-[1280px] mx-auto px-8 max-md:px-4 py-10">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#5F8D62] flex items-center justify-center flex-shrink-0">
              <Leaf size={26} className="text-white" />
            </div>
            <div>
              <div className="text-[#D6A84F] text-xs font-semibold uppercase tracking-widest mb-1">
                ระบบเกษตรอัจฉริยะ
              </div>
              <h1 className="text-white font-bold text-4xl max-md:text-2xl">
                Smart Farm มหิดล ลำปาง
              </h1>
              <p className="text-white/60 text-base mt-1">
                ข้อมูล IoT แบบ Real-time · อัปเดตล่าสุด 09:32 น.
              </p>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex gap-1">
            {(["overview", "crops", "alerts"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                  activeTab === t
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {t === "overview" ? "ภาพรวม" : t === "crops" ? "พืชผล" : "การแจ้งเตือน"}
                {t === "alerts" && alerts.length > 0 && (
                  <span className="ml-2 bg-[#C66B4F] text-white text-xs rounded-full px-1.5 py-0.5">
                    {alerts.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-8 max-md:px-4 py-10">
        {activeTab === "overview" && (
          <>
            {/* Sensor cards */}
            <div className="grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-5 mb-8">
              {sensorData.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="bg-white rounded-2xl border border-[#EEE9DF] p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: s.color + "18" }}
                      >
                        <Icon size={20} style={{ color: s.color }} />
                      </div>
                      <div
                        className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                          s.status === "high"
                            ? "bg-[#D6A84F]/15 text-[#D6A84F]"
                            : "bg-[#5F8D62]/15 text-[#5F8D62]"
                        }`}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-current" />
                        {s.status === "high" ? "สูง" : "ปกติ"}
                      </div>
                    </div>
                    <div className="text-[#667085] text-sm mb-1">{s.label}</div>
                    <div className="flex items-end gap-1.5">
                      <span className="font-display font-bold text-3xl text-[#1F2933]">
                        {s.value}
                      </span>
                      <span className="text-[#667085] text-sm mb-1">{s.unit}</span>
                    </div>
                    <div
                      className={`flex items-center gap-1 text-xs mt-2 ${
                        s.trend.startsWith("+") ? "text-[#C66B4F]" : "text-[#5F8D62]"
                      }`}
                    >
                      <TrendingUp size={12} />
                      {s.trend} จากเมื่อวาน
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Soil + system overview */}
            <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-6">
              {/* Soil moisture */}
              <div className="bg-white rounded-2xl border border-[#EEE9DF] p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-[#1F2933] font-semibold">ความชื้นดิน</h2>
                  <span className="text-[#667085] text-xs">อัปเดต 09:30</span>
                </div>
                {[
                  { zone: "แปลง A", value: 68, status: "ดี" },
                  { zone: "แปลง B", value: 42, status: "ต่ำ" },
                  { zone: "แปลง C", value: 75, status: "ดี" },
                  { zone: "แปลง D", value: 81, status: "สูง" },
                ].map((z) => (
                  <div key={z.zone} className="mb-4 last:mb-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[#1F2933] text-sm font-medium">{z.zone}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-sm font-bold text-[#1F2933]">
                          {z.value}%
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            z.status === "ต่ำ"
                              ? "bg-[#C66B4F]/15 text-[#C66B4F]"
                              : z.status === "สูง"
                                ? "bg-[#1677A8]/15 text-[#1677A8]"
                                : "bg-[#5F8D62]/15 text-[#5F8D62]"
                          }`}
                        >
                          {z.status}
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-[#EEE9DF] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${z.value}%`,
                          backgroundColor:
                            z.status === "ต่ำ"
                              ? "#C66B4F"
                              : z.status === "สูง"
                                ? "#1677A8"
                                : "#5F8D62",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* System status */}
              <div className="bg-white rounded-2xl border border-[#EEE9DF] p-6">
                <h2 className="text-[#1F2933] font-semibold mb-5">สถานะระบบ</h2>
                <div className="space-y-3">
                  {[
                    { name: "ระบบน้ำหยด", status: "active", icon: Droplets },
                    { name: "เซ็นเซอร์ IoT (48 ตัว)", status: "active", icon: Cpu },
                    { name: "ระบบ Solar เกษตร", status: "active", icon: Sun },
                    { name: "AI วิเคราะห์โรค", status: "standby", icon: Leaf },
                    { name: "ระบบแจ้งเตือน", status: "active", icon: AlertTriangle },
                  ].map((sys) => {
                    const Icon = sys.icon;
                    return (
                      <div
                        key={sys.name}
                        className="flex items-center justify-between p-3 rounded-xl bg-[#F8F6F0]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                            <Icon size={15} className="text-[#667085]" />
                          </div>
                          <span className="text-[#1F2933] text-sm">{sys.name}</span>
                        </div>
                        <div
                          className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                            sys.status === "active"
                              ? "bg-[#5F8D62]/15 text-[#5F8D62]"
                              : "bg-[#667085]/15 text-[#667085]"
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${sys.status === "active" ? "bg-[#5F8D62]" : "bg-[#667085]"}`}
                          />
                          {sys.status === "active" ? "ทำงาน" : "สแตนด์บาย"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "crops" && (
          <div className="space-y-5">
            {crops.map((c) => (
              <div key={c.name} className="bg-white rounded-2xl border border-[#EEE9DF] p-6">
                <div className="flex items-start justify-between max-sm:flex-col max-sm:gap-4">
                  <div>
                    <h3 className="text-[#1F2933] font-semibold text-lg mb-1">{c.name}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-[#667085]">
                      <span>พื้นที่ {c.area}</span>
                      <span>ระยะ: {c.stage}</span>
                      <span>เก็บเกี่ยวใน {c.days} วัน</span>
                    </div>
                  </div>
                  <div className="text-right max-sm:text-left">
                    <div className="text-[#667085] text-xs mb-1">สุขภาพพืช</div>
                    <div
                      className="font-display font-bold text-3xl"
                      style={{
                        color: c.health >= 90 ? "#5F8D62" : c.health >= 80 ? "#D6A84F" : "#C66B4F",
                      }}
                    >
                      {c.health}%
                    </div>
                  </div>
                </div>
                <div className="mt-4 h-2.5 bg-[#EEE9DF] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${c.health}%`,
                      backgroundColor:
                        c.health >= 90 ? "#5F8D62" : c.health >= 80 ? "#D6A84F" : "#C66B4F",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "alerts" && (
          <div className="space-y-4">
            {alerts.map((a, i) => (
              <div
                key={i}
                className={`flex items-start gap-4 p-5 rounded-2xl border ${
                  a.type === "warning"
                    ? "bg-[#C66B4F]/5 border-[#C66B4F]/20"
                    : "bg-[#1677A8]/5 border-[#1677A8]/20"
                }`}
              >
                <AlertTriangle
                  size={18}
                  className={`flex-shrink-0 mt-0.5 ${a.type === "warning" ? "text-[#C66B4F]" : "text-[#1677A8]"}`}
                />
                <div className="flex-1">
                  <p className="text-[#1F2933] text-sm">{a.msg}</p>
                  <p className="text-[#667085] text-xs mt-1">{a.time} น. · วันนี้</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
