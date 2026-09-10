const partners = [
  { name: "กรมส่งเสริมการเกษตร", image: "/partner-DOAE.png" },
  { name: "CREASIA", image: "/partner-creasia.png" },
  { name: "ชุมชนแม่กั๊วะ", image: "/partner-maekua.jpg" },
  { name: "องค์การบริหารส่วนจังหวัดลำปาง", image: "/partner-pao-lampang.png" },
];

export function HomePartners() {
  return (
    <section aria-labelledby="partners-heading" className="relative overflow-hidden bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1677A8]">PARTNERS &amp; NETWORK</p>
          <h2 id="partners-heading" className="mt-2 text-2xl font-bold tracking-tight text-[#123B63] sm:text-3xl">เครือข่ายความร่วมมือของเรา</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#667085] sm:text-base">
            ร่วมมือกับหน่วยงาน องค์กร และภาคีเครือข่าย เพื่อขับเคลื่อนการเรียนรู้และการพัฒนาพื้นที่
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:mt-10 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex h-[104px] items-center justify-center rounded-2xl border border-[#E6E0D5] bg-[#FCFBF8] px-5 py-4 transition duration-300 hover:-translate-y-0.5 hover:border-[#D6A84F]/70 hover:shadow-sm sm:h-[112px] sm:px-6"
            >
              <img
                src={partner.image}
                alt={partner.name}
                className="max-h-[72px] w-full object-contain sm:max-h-[78px]"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
