export default function PartnerLogos() {
  return (
    <section className="border-t border-slate-200 bg-slate-100/80 py-10">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8 space-y-6">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
          เครือข่ายความร่วมมือและหน่วยงานพันธมิตร
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          <img 
            src="/partner-creasia.png" 
            alt="Creasia Partner" 
            className="h-10 sm:h-12 w-auto object-contain grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300" 
          />
          <img 
            src="/partner-DOAE.png" 
            alt="DOAE Partner" 
            className="h-10 sm:h-12 w-auto object-contain grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300" 
          />
          <img 
            src="/partner-maekua.jpg" 
            alt="Mae Kua Partner" 
            className="h-10 sm:h-12 w-auto object-contain grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300" 
          />
          <img 
            src="/partner-pao-lampang.png" 
            alt="PAO Lampang Partner" 
            className="h-10 sm:h-12 w-auto object-contain grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300" 
          />
        </div>
      </div>
    </section>
  );
}