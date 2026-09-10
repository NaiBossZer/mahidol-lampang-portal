import { Map3DViewer } from "@/components/Map3DViewer";
import { PublicAppShell } from "@/components/layout/PublicAppShell";

export function SiteMapPage() {
  return (
    <PublicAppShell>
      <section className="min-h-[calc(100dvh-12rem)] bg-slate-50 px-4 py-8 md:px-8" aria-labelledby="site-map-title">
        <div className="mx-auto max-w-6xl">
          <header className="mb-6">
            <p className="text-sm font-semibold text-amber-600">Mahidol Social Engagement Platform</p>
            <h1 id="site-map-title" className="mt-1 text-3xl font-black text-slate-900">
              แผนที่พื้นที่ปฏิบัติการ 3D
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              สำรวจพื้นที่ปฏิบัติการและพื้นที่เรียนรู้ของมหิดล ลำปาง
            </p>
          </header>
          <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <Map3DViewer />
          </div>
        </div>
      </section>
    </PublicAppShell>
  );
}
