import { useState } from "react";
import { MapPin, Info, ZoomIn, ZoomOut, Layers, AlertCircle } from "lucide-react";

const locations = [
  { id: 1, name: "Shellac Learning Center", type: "learning", x: 32, y: 28, color: "#C66B4F", desc: "ศูนย์เรียนรู้ครั่งและภูมิปัญญาท้องถิ่น" },
  { id: 2, name: "Smart Farm", type: "farm", x: 60, y: 45, color: "#5F8D62", desc: "ระบบเกษตรอัจฉริยะ IoT" },
  { id: 3, name: "ระบบพลังงานสะอาด", type: "energy", x: 22, y: 58, color: "#1677A8", desc: "Solar cell และระบบพลังงานหมุนเวียน" },
  { id: 4, name: "RAC ศูนย์วิจัย", type: "research", x: 72, y: 25, color: "#123B63", desc: "Research & Academic Center" },
  { id: 5, name: "ลานกิจกรรมกลาง", type: "community", x: 48, y: 65, color: "#D6A84F", desc: "พื้นที่กิจกรรมและชุมชน" },
  { id: 6, name: "อาคารบริหาร", type: "admin", x: 80, y: 55, color: "#667085", desc: "สำนักงานและบริการนักศึกษา" },
];

const legendItems = [
  { color: "#C66B4F", label: "การเรียนรู้" },
  { color: "#5F8D62", label: "เกษตร" },
  { color: "#1677A8", label: "พลังงาน" },
  { color: "#123B63", label: "วิจัย" },
  { color: "#D6A84F", label: "ชุมชน" },
  { color: "#667085", label: "บริหาร" },
];

export default function SiteMapPage() {
  const [selectedLocation, setSelectedLocation] = useState<typeof locations[0] | null>(null);
  const [zoom, setZoom] = useState(1);

  return (
    <div>
      {/* Page header */}
      <div className="bg-white border-b border-[#EEE9DF]">
        <div className="max-w-[1280px] mx-auto px-8 max-md:px-4 py-10">
          <div className="text-[#C66B4F] text-xs font-semibold uppercase tracking-widest mb-2">แผนที่ศูนย์</div>
          <h1 className="text-[#123B63] font-bold text-4xl max-md:text-2xl mb-2">แผนที่มหิดล ลำปาง</h1>
          <p className="text-[#667085] text-base">สำรวจพื้นที่ ศูนย์ฯ และสิ่งอำนวยความสะดวกของมหาวิทยาลัย</p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-8 max-md:px-4 py-8">
        <div className="grid grid-cols-[1fr_300px] max-lg:grid-cols-1 gap-6">
          {/* Map area */}
          <div>
            {/* Controls */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[#667085] text-sm">
                <Layers size={14} />
                <span>มหิดล ลำปาง Campus</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoom(Math.min(zoom + 0.2, 2))}
                  className="w-9 h-9 rounded-lg border border-[#EEE9DF] bg-white flex items-center justify-center text-[#667085] hover:border-[#123B63]/30 hover:text-[#123B63] transition-colors"
                  aria-label="ซูมเข้า"
                >
                  <ZoomIn size={15} />
                </button>
                <button
                  onClick={() => setZoom(Math.max(zoom - 0.2, 0.6))}
                  className="w-9 h-9 rounded-lg border border-[#EEE9DF] bg-white flex items-center justify-center text-[#667085] hover:border-[#123B63]/30 hover:text-[#123B63] transition-colors"
                  aria-label="ซูมออก"
                >
                  <ZoomOut size={15} />
                </button>
              </div>
            </div>

            {/* Map canvas */}
            <div className="relative rounded-2xl overflow-hidden border border-[#EEE9DF] bg-[#E8F4EC]" style={{ height: 480 }}>
              {/* Terrain base */}
              <div className="absolute inset-0" style={{ transform: `scale(${zoom})`, transformOrigin: "center", transition: "transform 0.3s" }}>
                {/* Paths */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <rect x="0" y="0" width="100" height="100" fill="#C9E8C9" />
                  <rect x="10" y="10" width="80" height="80" rx="4" fill="#D4EDD4" opacity="0.5" />
                  {/* Roads */}
                  <path d="M 0,50 L 100,50" stroke="#E8E0D0" strokeWidth="3" fill="none" />
                  <path d="M 50,0 L 50,100" stroke="#E8E0D0" strokeWidth="3" fill="none" />
                  <path d="M 20,20 L 80,80" stroke="#E8E0D0" strokeWidth="1.5" fill="none" strokeDasharray="3,3" />
                  {/* Water feature */}
                  <ellipse cx="45" cy="50" rx="6" ry="4" fill="#8BBFDE" opacity="0.5" />
                  {/* Fields */}
                  <rect x="54" y="38" width="14" height="14" rx="2" fill="#A8D5A8" opacity="0.6" />
                  <rect x="16" y="50" width="10" height="12" rx="2" fill="#7FB57F" opacity="0.5" />
                </svg>

                {/* Location markers */}
                {locations.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => setSelectedLocation(loc === selectedLocation ? null : loc)}
                    className="absolute group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677A8] rounded-full"
                    style={{ left: `${loc.x}%`, top: `${loc.y}%`, transform: "translate(-50%, -100%)" }}
                    aria-label={loc.name}
                  >
                    <div
                      className="relative flex flex-col items-center"
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-transform group-hover:scale-110 ${selectedLocation?.id === loc.id ? "scale-125" : ""}`}
                        style={{ backgroundColor: loc.color }}
                      >
                        <MapPin size={16} className="text-white" />
                      </div>
                      <div
                        className={`mt-1 text-xs font-semibold text-white px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm transition-opacity ${selectedLocation?.id === loc.id || true ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                        style={{ backgroundColor: loc.color }}
                      >
                        {loc.name}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl border border-[#EEE9DF] p-3 shadow-sm">
                <div className="text-[#667085] text-xs font-semibold mb-2">ประเภทพื้นที่</div>
                <div className="space-y-1.5">
                  {legendItems.map((l) => (
                    <div key={l.label} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: l.color }} />
                      <span className="text-[#1F2933] text-xs">{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile fallback notice */}
            <div className="mt-3 flex items-center gap-2 text-[#667085] text-xs">
              <AlertCircle size={13} />
              <span>แผนที่ 3D แบบโต้ตอบจะพร้อมใช้งานในเร็วๆ นี้ แผนที่นี้เป็นรุ่น Preview</span>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Selected info */}
            {selectedLocation ? (
              <div className="bg-white rounded-2xl border border-[#EEE9DF] p-5">
                <div
                  className="inline-flex items-center gap-2 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3"
                  style={{ backgroundColor: selectedLocation.color }}
                >
                  <MapPin size={11} />
                  {selectedLocation.name}
                </div>
                <p className="text-[#667085] text-sm leading-relaxed mb-4">{selectedLocation.desc}</p>
                <button className="w-full py-2.5 rounded-xl bg-[#123B63] text-white text-sm font-semibold hover:bg-[#0e2d4f] transition-colors min-h-[44px]">
                  ดูรายละเอียด
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#EEE9DF] p-5 text-center">
                <div className="w-10 h-10 rounded-full bg-[#F8F6F0] flex items-center justify-center mx-auto mb-3">
                  <Info size={18} className="text-[#9BA8B7]" />
                </div>
                <p className="text-[#667085] text-sm">คลิกที่หมุดบนแผนที่เพื่อดูรายละเอียด</p>
              </div>
            )}

            {/* Location list */}
            <div className="bg-white rounded-2xl border border-[#EEE9DF] p-5">
              <h2 className="text-[#1F2933] font-semibold text-base mb-4">สถานที่ทั้งหมด</h2>
              <div className="space-y-2">
                {locations.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => setSelectedLocation(loc === selectedLocation ? null : loc)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677A8] ${
                      selectedLocation?.id === loc.id
                        ? "bg-[#F8F6F0] border border-[#EEE9DF]"
                        : "hover:bg-[#F8F6F0]"
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: loc.color + "20" }}
                    >
                      <MapPin size={14} style={{ color: loc.color }} />
                    </div>
                    <div>
                      <div className="text-[#1F2933] text-sm font-medium">{loc.name}</div>
                      <div className="text-[#667085] text-xs truncate max-w-[180px]">{loc.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
