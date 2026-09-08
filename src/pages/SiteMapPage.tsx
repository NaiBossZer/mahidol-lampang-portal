import { Map3DViewer } from "@/components/Map3DViewer";

export function SiteMapPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6">
          <p className="text-sm font-semibold text-amber-600">Mahidol Social Engagement Platform</p>
          <h1 className="mt-1 text-3xl font-black text-slate-900">แผนที่พื้นที่ปฏิบัติการ 3D</h1>
          <p className="mt-2 text-sm text-slate-600">
            สำรวจพื้นที่ปฏิบัติการและพื้นที่เรียนรู้ของมหิดล ลำปาง
          </p>
        </header>
        <Map3DViewer modelUrl="/site-map-3d.glb" />
      </div>
    </main>
  );
}
