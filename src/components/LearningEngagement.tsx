import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Check, Copy, Link2, Share2 } from "lucide-react";

const PROGRESS_KEY = "mahidol:learning-progress";
const learningPath = [
  { id: "smart-farm-intro", title: "รู้จักเกษตรอัจฉริยะ", detail: "ทำความเข้าใจข้อมูลจากแปลงและเซนเซอร์", href: "#learning" },
  { id: "smart-farm-practice", title: "ทดลองอ่านข้อมูลแปลง", detail: "ดูอุณหภูมิ ความชื้น และการวางแผนเพาะปลูก", href: "https://mahidol-smart-farm.vercel.app/" },
  { id: "smart-farm-extend", title: "ต่อยอดสู่ชุมชน", detail: "เรียนรู้แนวทางนำองค์ความรู้ไปใช้จริง", href: "#about" },
];

const events = [
  { date: "21 ส.ค. 2569", title: "กิจกรรมเรียนรู้สิ่งแวดล้อมและทรัพยากร", detail: "เปิดพื้นที่แลกเปลี่ยนเรียนรู้สำหรับนักเรียน นักศึกษา และประชาชน" },
  { date: "ทุกวันทำการ", title: "เยี่ยมชมพื้นที่ปฏิบัติงาน", detail: "ติดต่อทีมงานเพื่อวางแผนการเข้าชมและการเรียนรู้เป็นกลุ่ม" },
];

export function LearningEngagement() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    try { setCompleted(JSON.parse(localStorage.getItem(PROGRESS_KEY) || "[]")); } catch { setCompleted([]); }
  }, []);
  const percent = useMemo(() => Math.round((completed.length / learningPath.length) * 100), [completed]);
  const toggle = (id: string) => {
    const next = completed.includes(id) ? completed.filter((item) => item !== id) : [...completed, id];
    setCompleted(next);
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
  };
  const share = async () => {
    const data = { title: "งานพันธกิจเพื่อสังคม มหิดล", text: "ชวนสำรวจองค์ความรู้และพื้นที่ปฏิบัติงาน", url: window.location.href };
    if (navigator.share) await navigator.share(data); else { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1800); }
  };
  return <section id="learning-path" className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
    <div className="rounded-3xl bg-[#123B63] p-6 text-white shadow-lg sm:p-8">
      <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D6A84F]">LEARNING PATH</p><h2 className="mt-2 text-2xl font-black">เริ่มต้นเรียนรู้ Smart Farm</h2><p className="mt-2 text-sm leading-7 text-blue-100">เส้นทางสั้น ๆ สำหรับผู้ที่อยากทำความเข้าใจการใช้ข้อมูลสิ่งแวดล้อมและเกษตรในพื้นที่จริง</p></div><span className="text-3xl font-black text-[#D6A84F]">{percent}%</span></div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-[#D6A84F] transition-all" style={{ width: `${percent}%` }} /></div>
      <div className="mt-5 space-y-3">{learningPath.map((item) => <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-3"><button type="button" aria-label={`ทำเครื่องหมาย ${item.title}`} onClick={() => toggle(item.id)} className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${completed.includes(item.id) ? "border-[#D6A84F] bg-[#D6A84F] text-[#123B63]" : "border-white/40 text-white"}`}>{completed.includes(item.id) && <Check size={16} />}</button><a href={item.href} className="min-w-0 flex-1"><p className="font-bold">{item.title}</p><p className="text-xs text-blue-100">{item.detail}</p></a><Link2 size={15} className="text-blue-200" /></div>)}</div>
    </div>
    <div className="space-y-6"><div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C66B4F]">PUBLIC EVENTS</p><h2 className="mt-2 text-xl font-black text-[#123B63]">กิจกรรมที่กำลังจะเกิดขึ้น</h2></div><CalendarDays className="text-[#C66B4F]" /></div><div className="mt-4 space-y-3">{events.map((event) => <article key={event.title} className="rounded-2xl bg-[#F8F6F0] p-4"><p className="text-xs font-bold text-[#C66B4F]">{event.date}</p><h3 className="mt-1 font-bold text-[#123B63]">{event.title}</h3><p className="mt-1 text-xs leading-6 text-slate-600">{event.detail}</p></article>)}</div></div><button type="button" onClick={share} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#1677A8] px-4 py-3 text-sm font-bold text-white hover:bg-[#123B63]">{copied ? <Copy size={16} /> : <Share2 size={16} />}{copied ? "คัดลอกลิงก์แล้ว" : "แชร์เว็บไซต์นี้"}</button></div>
  </section>;
}
