import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Map, MapPin, PlayCircle } from 'lucide-react';
import { Map3DViewer } from './Map3DViewer';

const FALLBACK_MODEL_URL =
  'https://huggingface.co/BossLampang/site-map-3d-MU-Lampang/resolve/main/site-map-3d.glb';
const ACTIVE_MODEL_URL = import.meta.env.VITE_MODEL_URL?.trim() || FALLBACK_MODEL_URL;
const GOOGLE_MAP_URL =
  'https://www.google.com/maps?q=ศูนย์การเรียนรู้ วิจัย และบริการวิชาการ มหาวิทยาลัยมหิดล อำเภอสบปราบ จังหวัดลำปาง&output=embed';

export default function SiteLayout3D() {
  return (
    <section id="site-layout-section" className="border-b border-slate-200 bg-slate-50 py-12 sm:py-14">
      <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-6">
        
        {/* Header ส่วนของผังบริเวณ */}
        <div className="space-y-2 text-center">
          <span className="inline-block rounded-md border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#002D62]">
            Explore Our Site
          </span>
          <h2 className="text-2xl font-bold leading-tight text-[#002D62] md:text-3xl">
            ผังบริเวณและพื้นที่การเรียนรู้ มหิดล ลำปาง
          </h2>
          <p className="mx-auto max-w-2xl text-xs font-normal leading-relaxed text-slate-600 sm:text-sm">
            รับชมวิดีโอแนะนำศูนย์ฯ ดูตำแหน่งที่ตั้ง และสำรวจผังบริเวณ 3D
          </p>
        </div>

        {/* TABS */}
        <Tabs defaultValue="video" className="flex w-full flex-col items-center">
          <TabsList className="mb-6 grid h-auto w-full max-w-2xl grid-cols-1 gap-1 rounded-xl bg-slate-200/60 p-1 sm:grid-cols-3">
            <TabsTrigger 
              value="video" 
              className="flex min-h-10 items-center justify-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-slate-700 transition-all duration-200 hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2A900] focus-visible:ring-offset-2 data-[state=active]:bg-white data-[state=active]:text-[#002D62] data-[state=active]:shadow-sm sm:text-sm"
            >
              <PlayCircle className="w-4 h-4 text-[#F2A900]" />
              วิดีโอแนะนำศูนย์
            </TabsTrigger>

            <TabsTrigger 
              value="google-map" 
              className="flex min-h-10 items-center justify-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-slate-700 transition-all duration-200 hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2A900] focus-visible:ring-offset-2 data-[state=active]:bg-white data-[state=active]:text-[#002D62] data-[state=active]:shadow-sm sm:text-sm"
            >
              <Map className="w-4 h-4 text-[#F2A900]" />
              Google Maps
            </TabsTrigger>

            <TabsTrigger 
              value="map" 
              className="flex min-h-10 items-center justify-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-slate-700 transition-all duration-200 hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2A900] focus-visible:ring-offset-2 data-[state=active]:bg-white data-[state=active]:text-[#002D62] data-[state=active]:shadow-sm sm:text-sm"
            >
              <MapPin className="w-4 h-4 text-[#F2A900]" />
              แผนที่ผังบริเวณ (3D)
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: VIDEO DISPLAY */}
          <TabsContent value="video" className="w-full mt-0 focus-visible:outline-none">
            <div className="relative aspect-video min-h-[240px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-xl sm:min-h-0">
              <video 
                controls 
                preload="metadata"
                className="w-full h-full object-cover"
                poster="/banner1.jpg"
              >
                <source src="/intro-enlp.mp4" type="video/mp4" />
                เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอ
              </video>
            </div>
          </TabsContent>

          {/* TAB 2: GOOGLE MAP DISPLAY */}
          <TabsContent value="google-map" className="w-full mt-0 focus-visible:outline-none">
            <div className="relative aspect-video min-h-[300px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:min-h-0">
              <iframe
                src={GOOGLE_MAP_URL}
                title="ตำแหน่งศูนย์การเรียนรู้ วิจัย และบริการวิชาการ มหาวิทยาลัยมหิดล ลำปาง"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full border-0"
              />
            </div>
          </TabsContent>

          {/* TAB 3: 3D MAP DISPLAY */}
          <TabsContent value="map" className="w-full mt-0 focus-visible:outline-none">
            <div className="relative aspect-video min-h-[360px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-xl sm:min-h-0">
              <Map3DViewer modelUrl={ACTIVE_MODEL_URL} />
            </div>
          </TabsContent>
        </Tabs>

      </div>
    </section>
  );
}