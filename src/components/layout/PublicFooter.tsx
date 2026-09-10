import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const learningLinks = [
  { label: "ศูนย์วิจัยและพัฒนาต้นน้ำ", to: "/activities" },
  { label: "สมาร์ทฟาร์มอัจฉริยะ", to: "/smart-farm" },
  { label: "สถานีพลังงานทดแทน", to: "/clean-energy" },
];

const researchTopics = ["เทคโนโลยีภูมิปัญญาท้องถิ่น", "เกษตรอัจฉริยะ", "พลังงานสะอาด"];

export function PublicFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#123B63] text-white">
      <div aria-hidden="true" className="absolute inset-0 bg-[#123B63]/88" />
      <div className="relative mx-auto max-w-[1280px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="grid gap-8 md:grid-cols-4 md:gap-7 lg:gap-10">
          <div>
            <div className="flex items-start gap-3">
              <img src="/mahidol-logo.png" alt="มหาวิทยาลัยมหิดล" className="h-11 w-11 shrink-0 rounded-full bg-white object-contain p-1" width="44" height="44" />
              <div className="min-w-0">
                <p className="text-sm font-bold leading-6">มหาวิทยาลัยมหิดล โครงการจัดตั้งวิทยาเขตลำปาง</p>
                <p className="mt-0.5 text-[10px] font-medium leading-4 text-[#D6A84F]">Mahidol University Lampang Project</p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-xs leading-6 text-blue-100">มุ่งมั่นพัฒนาวิทยาการและการเรียนรู้ร่วมกับชุมชน เพื่อสร้างการเปลี่ยนแปลงที่ยั่งยืน</p>
          </div>

          <div>
            <p className="text-sm font-bold text-[#D6A84F]">ศูนย์การเรียนรู้</p>
            <div className="mt-3 space-y-2 text-xs leading-5 text-blue-100">
              {learningLinks.map((item) => <Link key={item.to} to={item.to} className="block transition hover:text-white">{item.label}</Link>)}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-[#D6A84F]">งานวิจัยและเทคโนโลยี</p>
            <div className="mt-3 space-y-2 text-xs leading-5 text-blue-100">
              {researchTopics.map((topic) => <p key={topic}>{topic}</p>)}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-[#D6A84F]">ติดต่อเรา</p>
            <div className="mt-3 space-y-2.5 text-xs leading-5 text-blue-100">
              <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#D6A84F]" aria-hidden="true" /><span>191 หมู่ 11 ต.ทุ่งฝาย อ.เมือง จ.ลำปาง 52000</span></p>
              <a href="tel:054820200" className="flex items-center gap-2 transition hover:text-white"><Phone className="h-4 w-4 shrink-0 text-[#D6A84F]" aria-hidden="true" />054-820-200</a>
              <a href="mailto:lampang@mahidol.ac.th" className="flex items-center gap-2 break-all transition hover:text-white"><Mail className="h-4 w-4 shrink-0 text-[#D6A84F]" aria-hidden="true" />lampang@mahidol.ac.th</a>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/15 pt-4 text-[10px] text-slate-300 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 มหาวิทยาลัยมหิดล โครงการจัดตั้งวิทยาเขตลำปาง</p>
          <div className="flex gap-4"><Link to="/site-map" className="transition hover:text-white">ผังของการใช้งาน</Link><Link to="/login" className="transition hover:text-white">นโยบายความเป็นส่วนตัว</Link></div>
        </div>
      </div>
    </footer>
  );
}
