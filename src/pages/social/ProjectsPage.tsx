import { ArrowUpRight, CalendarRange } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { PublicAppShell } from "@/components/layout/PublicAppShell";

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
    <PublicAppShell>
      <div className="bg-surface-warm">
        <section className="bg-brand-navy text-white" aria-labelledby="projects-title">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <RouterLink to="/" className="inline-flex min-h-11 items-center text-sm font-bold text-northern-gold focus-visible:rounded-lg">
              ← กลับหน้าหลัก
            </RouterLink>
            <h1 id="projects-title" className="mt-4 text-3xl font-black sm:text-4xl">โครงการเพื่อสังคม</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">โครงการที่เชื่อมองค์ความรู้ของมหาวิทยาลัยกับพื้นที่และชุมชน</p>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8" aria-labelledby="projects-grid-title">
          <h2 id="projects-grid-title" className="sr-only">รายการโครงการ</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {projects.map((project) => (
              <article key={project.slug} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <img src={project.image} alt={project.title} className="h-48 w-full object-cover sm:h-52" width="960" height="384" loading="lazy" />
                <div className="p-5">
                  <h2 className="text-xl font-black text-brand-navy">{project.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{project.description}</p>
                  <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-local-terracotta">
                    <CalendarRange className="h-4 w-4" aria-hidden="true" />
                    {project.period}
                  </p>
                  <RouterLink to={`/projects/${project.slug}`} className="mt-5 inline-flex min-h-11 items-center gap-1 text-sm font-bold text-brand-blue focus-visible:rounded-lg">
                    ดูโครงการ <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </RouterLink>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </PublicAppShell>
  );
}

export function ProjectDetailPage() {
  const slug = window.location.pathname.split("/").pop();
  const project = projects.find((item) => item.slug === slug) ?? projects[0]!;
  return (
    <PublicAppShell>
      <div className="bg-surface-warm">
        <section className="bg-brand-navy text-white" aria-labelledby="project-detail-title">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
            <RouterLink to="/projects" className="inline-flex min-h-11 items-center text-sm font-bold text-northern-gold focus-visible:rounded-lg">
              ← โครงการทั้งหมด
            </RouterLink>
            <h1 id="project-detail-title" className="mt-5 max-w-4xl text-3xl font-black sm:text-4xl">{project.title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-blue-100">{project.description}</p>
          </div>
        </section>
        <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <img src={project.image} alt="" className="h-56 w-full rounded-3xl object-cover sm:h-72" width="960" height="512" loading="eager" />
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="project-role-title">
            <h2 id="project-role-title" className="text-xl font-black text-brand-navy">บทบาทของโครงการ</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">โครงการทำหน้าที่เป็นพื้นที่เชื่อมระหว่างงานวิจัย การบริการวิชาการ การเรียนรู้ และการพัฒนาพื้นที่ โดยสามารถติดตามหลักฐานการดำเนินงานผ่านกิจกรรมของโครงการ</p>
            <RouterLink to="/activities" className="mt-5 inline-flex min-h-11 items-center gap-1 text-sm font-bold text-brand-blue focus-visible:rounded-lg">
              ดูหลักฐานกิจกรรม <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </RouterLink>
          </section>
        </main>
      </div>
    </PublicAppShell>
  );
}
