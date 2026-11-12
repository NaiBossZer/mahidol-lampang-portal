import { Map3DViewer } from "@/components/Map3DViewer";
import { PublicAppShell } from "@/components/layout/PublicAppShell";

const capabilities = [
  { number: "01", title: "สำรวจพื้นที่", description: "สำรวจโมเดลพื้นที่ต้นฉบับด้วยการหมุนมุมมองและซูมตามต้องการ" },
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
                สำรวจพื้นที่ปฏิบัติการและพื้นที่เรียนรู้ผ่านโมเดลสามมิติต้นฉบับ
                เพื่อพัฒนา Mahidol Lampang Integrated Digital Center
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              โมเดล 3D ต้นฉบับ
            </span>
          </header>

          <Map3DViewer />

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
              หน้านี้ใช้โมเดล GLB ต้นฉบับของพื้นที่ โดยปิดการหมุนอัตโนมัติไว้ ผู้ใช้ยังสามารถลากเพื่อหมุนมุมมอง ซูม และเลือกมุมกล้องได้ตามต้องการ
            </p>
          </aside>
        </div>
      </section>
    </PublicAppShell>
  );
}
