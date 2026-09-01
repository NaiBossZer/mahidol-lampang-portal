import React, { useState } from "react";
import { Zap, Clock, Calendar, X, ShieldCheck, Send } from "lucide-react";
import { toast } from "sonner";

interface Booking {
  id: string;
  stationId: string;
  date: string;
  startTime: string; // Format "HH:mm"
  endTime: string;   // Format "HH:mm"
  userName: string;
  plateNumber: string;
  phone: string;
  lineId: string;
}

interface Station {
  id: string;
  name: string;
  type: string;
  status: string;
}

interface TimeSlot {
  start: string;
  end: string;
}

const STATIONS: Station[] = [
  { id: "ST-01", name: "ตู้ A (AC Type 2 - 22kW)", type: "Normal Charge", status: "Available" },
  { id: "ST-02", name: "ตู้ B (DC Fast Charge - 50kW)", type: "Fast Charge", status: "Available" },
];

const TIME_SLOTS: TimeSlot[] = [
  { start: "08:00", end: "09:00" },
  { start: "09:00", end: "10:00" },
  { start: "10:00", end: "11:00" },
  { start: "11:00", end: "12:00" },
  { start: "13:00", end: "14:00" },
  { start: "14:00", end: "15:00" },
  { start: "15:00", end: "16:00" },
  { start: "16:00", end: "17:00" },
];

// ฟังก์ชันแปลงวันที่รูปแบบ YYYY-MM-DD
const getTodayDate = (): string => {
  return new Date().toISOString().slice(0, 10);
};

export function EVBookingSection() {
  const defaultStationId = STATIONS[0]?.id ?? "ST-01";
  const [selectedStation, setSelectedStation] = useState<string>(defaultStationId);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // ข้อมูลการจองในระบบ (Mock Data + State)
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "b1",
      stationId: "ST-01",
      date: getTodayDate(),
      startTime: "09:00",
      endTime: "10:00",
      userName: "สมชาย ใจดี",
      plateNumber: "กข 1234 ลำปาง",
      phone: "0812345678",
      lineId: "somchai_line",
    },
  ]);

  // ฟอร์มกรอกข้อมูลการจอง
  const [formData, setFormData] = useState({
    userName: "",
    plateNumber: "",
    phone: "",
    lineId: "",
  });

  // เช็กว่าช่วงเวลานี้ถูกจองไปแล้วหรือยัง (Time-slot Lock Logic)
  const isSlotBooked = (stationId: string, date: string, start: string, end: string) => {
    return bookings.some(
      (b) =>
        b.stationId === stationId &&
        b.date === date &&
        ((start >= b.startTime && start < b.endTime) ||
          (end > b.startTime && end <= b.endTime) ||
          (start <= b.startTime && end >= b.endTime))
    );
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    if (isSlotBooked(selectedStation, selectedDate, slot.start, slot.end)) {
      toast.error("ช่วงเวลานี้มีผู้ใช้งานจองไว้แล้ว กรุณาเลือกช่วงเวลาอื่น");
      return;
    }
    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  // ยืนยันการจอง และจำลองการส่ง LINE Notification
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    // Double-check Time-slot Lock
    if (isSlotBooked(selectedStation, selectedDate, selectedSlot.start, selectedSlot.end)) {
      toast.error("ขออภัย ช่วงเวลานี้ถูกจองตัดหน้าแล้ว");
      return;
    }

    const newBooking: Booking = {
      id: `b_${Date.now()}`,
      stationId: selectedStation,
      date: selectedDate,
      startTime: selectedSlot.start,
      endTime: selectedSlot.end,
      ...formData,
    };

    setBookings((prev) => [...prev, newBooking]);
    setIsModalOpen(false);

    // จำลองส่ง LINE Notification
    toast.success("จองคิวสำเร็จ! ระบบส่งข้อความยืนยันไปยัง LINE เรียบร้อยแล้ว", {
      description: `ตู้: ${selectedStation} | เวลา: ${selectedSlot.start} - ${selectedSlot.end} น.`,
    });

    // รีเซ็ตฟอร์ม
    setFormData({ userName: "", plateNumber: "", phone: "", lineId: "" });
    setSelectedSlot(null);
  };

  const currentStation = STATIONS.find((s) => s.id === selectedStation);

  return (
    <section id="ev-booking" className="bg-slate-900 py-16 text-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-semibold text-amber-400">
              <Zap size={14} /> EV CHARGING HUB
            </span>
            <h2 className="mt-3 text-2xl font-bold md:text-3xl text-white">ระบบจองคิวชาร์จรถยนต์ไฟฟ้า</h2>
            <p className="mt-1 text-sm text-slate-400">เลือกตู้ชาร์จและล็อกช่วงเวลาใช้งานล่วงหน้า ป้องกันคิวซ้อน 100%</p>
          </div>
          
          {/* เลือกวันที่ */}
          <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-xl border border-slate-700">
            <Calendar size={18} className="text-amber-400 ml-2" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer pr-2"
            />
          </div>
        </div>

        {/* เลือกตู้ชาร์จ */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {STATIONS.map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStation(st.id)}
              className={`flex items-center justify-between p-4 rounded-2xl border text-left transition ${
                selectedStation === st.id
                  ? "bg-amber-500/10 border-amber-500 text-white"
                  : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${selectedStation === st.id ? "bg-amber-500 text-slate-950" : "bg-slate-700 text-slate-300"}`}>
                  <Zap size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{st.name}</p>
                  <p className="text-xs text-slate-400">{st.type}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {st.status}
              </span>
            </button>
          ))}
        </div>

        {/* Time-Slot Grid */}
        <div className="mt-8 bg-slate-800/40 rounded-2xl border border-slate-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Clock size={16} className="text-amber-400" /> ตารางเวลาว่างประจำวันที่ {selectedDate}
            </h3>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> ว่าง</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500"></span> มีผู้จองแล้ว</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TIME_SLOTS.map((slot) => {
              const booked = isSlotBooked(selectedStation, selectedDate, slot.start, slot.end);
              return (
                <button
                  key={slot.start}
                  disabled={booked}
                  onClick={() => handleSlotSelect(slot)}
                  className={`p-3.5 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 border ${
                    booked
                      ? "bg-rose-950/20 border-rose-900/50 text-rose-400/50 cursor-not-allowed line-through"
                      : "bg-slate-800 border-slate-700 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 hover:border-emerald-500"
                  }`}
                >
                  <span>{slot.start} - {slot.end} น.</span>
                  <span className="text-[10px] font-normal">{booked ? "จองแล้ว" : "ว่าง"}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      {isModalOpen && selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-800 border border-slate-700 p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-400" /> ยืนยันการจองคิวชาร์จ EV
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="mt-4 space-y-4">
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/50 text-xs space-y-1">
                <p className="text-slate-400">สถานี: <span className="text-white font-semibold">{currentStation?.name ?? selectedStation}</span></p>
                <p className="text-slate-400">วันที่: <span className="text-white font-semibold">{selectedDate}</span></p>
                <p className="text-slate-400">ช่วงเวลา: <span className="text-amber-400 font-bold">{selectedSlot.start} - {selectedSlot.end} น.</span></p>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">ชื่อ-นามสกุล ผู้จอง</label>
                <input
                  required
                  type="text"
                  placeholder="เช่น นายสมชาย ใจดี"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">ทะเบียนรถยนต์ EV</label>
                <input
                  required
                  type="text"
                  placeholder="เช่น กข 1234 ลำปาง"
                  value={formData.plateNumber}
                  onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">เบอร์โทรศัพท์</label>
                  <input
                    required
                    type="tel"
                    placeholder="08X-XXX-XXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">LINE ID (รับการแจ้งเตือน)</label>
                  <input
                    type="text"
                    placeholder="ไอดีไลน์"
                    value={formData.lineId}
                    onChange={(e) => setFormData({ ...formData, lineId: e.target.value })}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
              >
                <Send size={14} /> ยืนยันจองคิว และส่งการแจ้งเตือนเข้า LINE
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}