import { ArrowUpRight, CalendarRange } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

const projects = [
  {
    slug: "integrated-shellac-learning",
    title: "โครงการพื้นที่เรียนรู้ครั่งครบวงจร",
    description: "พัฒนาองค์ความรู้และพื้นที่เรียนรู้ครั่งร่วมกับสถานศึกษา ชุมชน และภาคีเครือข่าย",
    period: "2569–ปัจจุบัน",
    image: "/Shellac banner.jpg",
  },
  {
    slug: "smart-farm-community",
    title: "โครงการเกษตรอัจฉริยะเพื่อการเรียนรู้",
    description: "ใช้เทคโนโลยี IoT และข้อมูลสิ่งแวดล้อมสนับสนุนการเรียนรู้และการจัดการเกษตร",
    period: "2569–ปัจจุบัน",
    image: "/Smart Farm.jpg",
  },
  {
    slug: "clean-energy-community",
    title: "โครงการพลังงานสะอาดในพื้นที่ปฏิบัติการ",
    description: "สาธิตการผลิตพลังงานสะอาดและสร้างความเข้าใจเรื่องประสิทธิภาพพลังงานและคาร์บอน",
    period: "2569–ปัจจุบัน",
    image: "/EVCharger.jpg",
  },
];

export function ProjectsPage() {
  return (
    <div className="min-h-screen bg-[#f8f6f0]">
      <header className="bg-[#123B63] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <RouterLink to="/" className="text-xs font-bold text-[#D6A84F]">
            ← กลับหน้าหลัก
          </RouterLink>
          <h1 className="mt-4 text-3xl font-black">โครงการเพื่อสังคม</h1>
          <p className="mt-2 text-sm text-blue-100">
            โครงการที่เชื่อมองค์ความรู้ของมหาวิทยาลัยกับพื้นที่และชุมชน
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.slug}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              <img src={project.image} alt={project.title} className="h-48 w-full object-cover" />
              <div className="p-5">
                <h2 className="text-xl font-black text-[#123B63]">{project.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">{project.description}</p>
                <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#C66B4F]">
                  <CalendarRange className="h-4 w-4" />
                  {project.period}
                </p>
                <RouterLink
                  to={`/projects/${project.slug}`}
                  className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-[#1677A8]"
                >
                  ดูโครงการ <ArrowUpRight className="h-4 w-4" />
                </RouterLink>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

export function ProjectDetailPage() {
  const slug = window.location.pathname.split("/").pop();
  const project = projects.find((item) => item.slug === slug) ?? projects[0]!;
  return (
    <div className="min-h-screen bg-[#f8f6f0]">
      <header className="bg-[#123B63] text-white">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <RouterLink to="/projects" className="text-xs font-bold text-[#D6A84F]">
            ← โครงการทั้งหมด
          </RouterLink>
          <h1 className="mt-5 text-3xl font-black sm:text-4xl">{project.title}</h1>
          <p className="mt-3 text-sm leading-7 text-blue-100">{project.description}</p>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <img src={project.image} alt="" className="h-72 w-full rounded-3xl object-cover" />
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-black text-[#123B63]">บทบาทของโครงการ</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            โครงการทำหน้าที่เป็นพื้นที่เชื่อมระหว่างงานวิจัย การบริการวิชาการ การเรียนรู้
            และการพัฒนาพื้นที่ โดยสามารถติดตามหลักฐานการดำเนินงานผ่านกิจกรรมของโครงการ
          </p>
          <RouterLink
            to="/activities"
            className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-[#1677A8]"
          >
            ดูหลักฐานกิจกรรม <ArrowUpRight className="h-4 w-4" />
          </RouterLink>
        </div>
      </main>
    </div>
  );
}
