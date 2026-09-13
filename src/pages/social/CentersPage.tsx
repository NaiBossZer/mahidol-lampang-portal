import { MapPin, ArrowUpRight, BookOpen } from "lucide-react";
import { PublicAppShell } from "@/components/layout/PublicAppShell";
import { PublicPageHeader } from "@/components/layout/PublicPageHeader";

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
    <PublicAppShell>
      <PublicPageHeader
        title="ศูนย์ / พื้นที่ปฏิบัติการ"
        subtitle="พื้นที่จริงที่ทำให้พันธกิจเพื่อสังคมเกิดขึ้นและเรียนรู้ได้"
      />
      <main className="container-content py-8 sm:py-10">
        <div className="grid gap-6 md:grid-cols-3">
          {centers.map((center) => (
            <article
              key={center.slug}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="overflow-hidden bg-slate-100">
                <img
                  src={center.image}
                  alt={center.title}
                  className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="p-6">
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
                  className="mt-5 inline-flex min-h-11 items-center gap-1 text-sm font-bold text-[#1677A8] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677A8] focus-visible:ring-offset-2"
                >
                  เข้าสู่พื้นที่ <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-7">
          <div className="flex items-center gap-2 text-[#123B63]">
            <BookOpen className="h-5 w-5" />
            <h2 className="font-black">Learning Experience</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            แต่ละระบบหลักสามารถมีประสบการณ์การเรียนรู้ของตัวเอง เช่น Interactive Learning,
            Simulation และ Game โดยไม่แยกออกจากระบบหลัก
          </p>
        </div>
      </main>
    </PublicAppShell>
  );
}
