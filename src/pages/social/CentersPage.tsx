import { MapPin, ArrowUpRight, BookOpen } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

const centers = [
  {
    slug: "shellac-learning-center",
    title: "Shellac Learning Center",
    type: "ศูนย์เรียนรู้",
    description: "พื้นที่เรียนรู้ครั่งครบวงจร เชื่อมงานวิจัย การเรียนรู้ และการพัฒนาชุมชน",
    location: "สบปราบ ลำปาง",
    image: "/Shellac banner.jpg",
    href: "https://mahidol-shellac.vercel.app/",
  },
  {
    slug: "smart-farm-station",
    title: "Smart Farm Station",
    type: "พื้นที่ปฏิบัติการ",
    description: "โรงเรือนและพื้นที่สาธิตเกษตรอัจฉริยะสำหรับเรียนรู้จากข้อมูลจริง",
    location: "สบปราบ ลำปาง",
    image: "/Smart Farm.jpg",
    href: "/smart-farm",
  },
  {
    slug: "clean-energy-station",
    title: "Clean Energy Station",
    type: "พื้นที่สาธิต",
    description: "พื้นที่สาธิตการผลิตและการจัดการพลังงานสะอาดในพื้นที่ปฏิบัติการ",
    location: "สบปราบ ลำปาง",
    image: "/EVCharger.jpg",
    href: "/clean-energy",
  },
];

export function CentersPage() {
  return (
    <div className="min-h-screen bg-[#f8f6f0]">
      <header className="bg-[#123B63] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <RouterLink to="/" className="text-xs font-bold text-[#D6A84F]">
            ← กลับหน้าหลัก
          </RouterLink>
          <h1 className="mt-4 text-3xl font-black">ศูนย์ / พื้นที่ปฏิบัติการ</h1>
          <p className="mt-2 text-sm text-blue-100">
            พื้นที่จริงที่ทำให้พันธกิจเพื่อสังคมเกิดขึ้นและเรียนรู้ได้
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {centers.map((center) => (
            <article
              key={center.slug}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              <img src={center.image} alt={center.title} className="h-48 w-full object-cover" />
              <div className="p-5">
                <span className="text-xs font-bold text-[#C66B4F]">{center.type}</span>
                <h2 className="mt-2 text-xl font-black text-[#123B63]">{center.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">{center.description}</p>
                <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                  <MapPin className="h-4 w-4" />
                  {center.location}
                </p>
                <a
                  href={center.href}
                  target={center.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-[#1677A8]"
                >
                  เข้าสู่พื้นที่ <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-2 text-[#123B63]">
            <BookOpen className="h-5 w-5" />
            <h2 className="font-black">Learning Experience</h2>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            แต่ละระบบหลักสามารถมีประสบการณ์การเรียนรู้ของตัวเอง เช่น Interactive Learning,
            Simulation และ Game โดยไม่แยกออกจากระบบหลัก
          </p>
        </div>
      </main>
    </div>
  );
}
