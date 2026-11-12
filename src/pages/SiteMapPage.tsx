import { Map3DViewer } from "@/components/Map3DViewer";
import { ProceduralCampusViewer } from "@/components/ProceduralCampusViewer";
import { ModelAuditPanel } from "@/components/ModelAuditPanel";
import { PublicAppShell } from "@/components/layout/PublicAppShell";

const capabilities = [
  { number: "01", title: "สำรวจพื้นที่", description: "หมุนมุมมอง ซูม และสำรวจแบบจำลอง 3 มิติที่สร้างจาก geometry ใหม่" },
  { number: "02", title: "มุมมองหลายระดับ", description: "สลับมุมมองเฉียง มุมบน และมุมระดับต่ำ เพื่อสำรวจองค์ประกอบพื้นที่" },
  { number: "03", title: "ต่อยอด Digital Twin", description: "เตรียมเชื่อมข้อมูลอาคาร ความปลอดภัย เซนเซอร์ และการใช้ประโยชน์พื้นที่ในระยะถัดไป" },
];

export function SiteMapPage() {
  return (
    <PublicAppShell>
      <section
        className="min-h-[calc(100dvh-12rem)] bg-slate-50 px-4 py-8 md:px-8"
        aria-labelledby="site-map-title"
      >
        <div className="mx-auto max-w-7xl">
          <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold text-amber-600">
                Mahidol Social Engagement Platform
              </p>
              <h1 id="site-map-title" className="mt-1 text-3xl font-black text-slate-900">
                แผนที่พื้นที่ปฏิบัติการ 3D
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                สำรวจพื้นที่ปฏิบัติการและพื้นที่เรียนรู้ผ่านแบบจำลองสามมิติที่สร้างขึ้นใหม่จากภาพถ่ายทางอากาศ
                เพื่อพัฒนา Mahidol Lampang Integrated Digital Center
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              แบบจำลอง 3D สร้างใหม่
            </span>
          </header>

          <ProceduralCampusViewer />
          <ModelAuditPanel />
          <details className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
            <summary className="cursor-pointer text-sm font-bold text-slate-800">เปิดดูโมเดล GLB ต้นฉบับ (สำหรับเปรียบเทียบ)</summary>
            <p className="my-3 text-xs leading-6 text-slate-600">เก็บโมเดลต้นฉบับไว้โดยไม่แก้ไข ใช้ตรวจสอบและเปรียบเทียบกับแบบจำลอง procedural ที่สร้างใหม่</p>
            <Map3DViewer />
          </details>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {capabilities.map((item) => (
              <article key={item.number} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-black tracking-widest text-amber-600">{item.number}</p>
                <h2 className="mt-2 text-sm font-bold text-slate-900">{item.title}</h2>
                <p className="mt-1 text-xs leading-6 text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>

          <aside className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-bold text-slate-900">เกี่ยวกับโมเดล</h2>
            <p className="mt-1 text-xs leading-6 text-slate-600">
              แบบจำลองหลักสร้าง geometry ขึ้นใหม่จากองค์ประกอบที่มองเห็นในภาพถ่ายทางอากาศ โดยกำหนดตำแหน่งและสัดส่วนเป็นค่าประมาณเพื่อทำต้นแบบก่อน ไฟล์ GLB ต้นฉบับยังคงเก็บไว้ให้เปิดดูเปรียบเทียบได้ ส่วนพิกัด ขนาดอาคาร ชั้น ห้อง และข้อมูลสถานะจริงจะปรับหลังได้รับผังสำรวจหรือข้อมูล CAD/BIM ที่ยืนยันแล้ว
            </p>
          </aside>
        </div>
      </section>
    </PublicAppShell>
  );
}
