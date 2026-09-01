export default function PartnerLogos() {
  const partners = [
    { name: 'Creasia Group', src: '/partner-creasia.png' },
    { name: 'กรมส่งเสริมการเกษตร (DOAE)', src: '/partner-DOAE.png' },
    { name: 'เทศบาลตำบลแม่กัวะ', src: '/partner-maekua.jpg' },
    { name: 'อบจ.ลำปาง (PAO Lampang)', src: '/partner-pao-lampang.png' },
  ];

  return (
    <section className="border-t border-slate-200/70 bg-linear-to-b from-slate-50 to-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* หัวข้อส่วนพันธมิตร */}
        <div className="text-center space-y-1.5">
          <span className="inline-block rounded-full bg-blue-50 px-3 py-0.5 text-[11px] font-semibold tracking-wider text-[#002D62] border border-blue-100">
            NETWORK & COLLABORATION
          </span>
          <h3 className="text-lg font-bold text-[#002D62] sm:text-xl">
            เครือข่ายความร่วมมือและหน่วยงานพันธมิตร
          </h3>
        </div>

        {/* การ์ดแสดงโลโก้พันธมิตร */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex h-20 w-36 sm:h-22 sm:w-44 items-center justify-center rounded-2xl bg-white p-3 shadow-sm border border-slate-200/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-amber-300"
            >
              <img
                src={partner.src}
                alt={partner.name}
                className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}