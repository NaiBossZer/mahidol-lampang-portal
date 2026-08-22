// src/components/SiteLayout3D.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // หรือปรับ path ตาม Alias ของคุณ
import { MapPin, PlayCircle } from 'lucide-react';

export default function SiteLayout3D() {
  return (
    <section id="site-layout-section" className="py-14 border-b border-slate-200 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-6">
        
        {/* Header ส่วนของผังบริเวณ */}
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold text-[#002D62] bg-blue-50 px-3 py-1 rounded-md border border-blue-100 uppercase tracking-wider">
            Explore Our Site
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-[#002D62]">
            ผังบริเวณและพื้นที่การเรียนรู้ มหิดล ลำปาง
          </h2>
          <p className="text-xs text-slate-500 font-normal">
            รับชมแผนที่ผังบริเวณศูนย์ฯ และวิดีโอแนะนำพื้นที่การดำเนินงาน
          </p>
        </div>

        {/* RADIX / SHADCN TABS */}
        <Tabs defaultValue="map" className="w-full flex flex-col items-center">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6 bg-slate-200/60 p-1 rounded-xl">
            <TabsTrigger 
              value="map" 
              className="flex items-center justify-center gap-2 text-xs md:text-sm font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#002D62] data-[state=active]:shadow-sm transition-all"
            >
              <MapPin className="w-4 h-4 text-[#F2A900]" />
              แผนที่ผังบริเวณ
            </TabsTrigger>
            
            <TabsTrigger 
              value="video" 
              className="flex items-center justify-center gap-2 text-xs md:text-sm font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#002D62] data-[state=active]:shadow-sm transition-all"
            >
              <PlayCircle className="w-4 h-4 text-[#F2A900]" />
              วิดีโอแนะนำศูนย์
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: MAP DISPLAY */}
          <TabsContent value="map" className="w-full mt-0 focus-visible:outline-none">
            <div className="relative w-full rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-black aspect-video">
              <iframe
                title="Mahidol Lampang Site Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3788.835492194685!2d99.3361!3d18.1065!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDA2JzIzLjQiTiA5OcKwMjAnMTAuMCJF!5e0!3m2!1sth!2sth!4v1620000000000!5m2!1sth!2sth"
                className="w-full h-full border-0"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </TabsContent>

          {/* TAB 2: VIDEO DISPLAY */}
          <TabsContent value="video" className="w-full mt-0 focus-visible:outline-none">
            <div className="relative w-full rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-black aspect-video">
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
        </Tabs>

      </div>
    </section>
  );
}
