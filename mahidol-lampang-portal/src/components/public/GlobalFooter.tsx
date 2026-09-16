import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";
import type { PublicPage } from "../PublicPortal";

interface Props {
  navigate: (p: PublicPage) => void;
}

export default function GlobalFooter({ navigate }: Props) {
  return (
    <footer className="bg-[#123B63] text-white">
      <div className="max-w-[1280px] mx-auto px-8 max-md:px-4 pt-12 pb-8">
        <div className="grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-10 pb-10 border-b border-white/10">
          {/* Identity */}
          <div className="max-lg:col-span-2 max-sm:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                <span className="font-display font-bold text-sm">ML</span>
              </div>
              <div>
                <div className="font-semibold">Mahidol Lampang</div>
                <div className="text-white/60 text-xs">มหิดล ลำปาง พอร์ทัล</div>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              แหล่งเรียนรู้ ชุมชน และงานวิจัยเพื่อการพัฒนา<br />
              ภาคเหนือตอนบนอย่างยั่งยืน มหาวิทยาลัยมหิดล
            </p>
            <div className="mt-5 flex flex-col gap-2.5">
              <a href="#" className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors">
                <MapPin size={14} className="flex-shrink-0 text-[#D6A84F]" />
                ตำบลแม่กัวะ อำเภอสบปราบ ลำปาง 52170
              </a>
              <a href="tel:+6654269500" className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors">
                <Phone size={14} className="flex-shrink-0 text-[#D6A84F]" />
                054-269-500
              </a>
              <a href="mailto:info.lampang@mahidol.ac.th" className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors">
                <Mail size={14} className="flex-shrink-0 text-[#D6A84F]" />
                info.lampang@mahidol.ac.th
              </a>
            </div>
          </div>

          {/* Nav links */}
          <div>
            <h3 className="text-[#D6A84F] text-xs font-semibold uppercase tracking-wider mb-4">เกี่ยวกับเรา</h3>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "หน้าหลัก", page: "home" as PublicPage },
                { label: "กิจกรรม", page: "activities" as PublicPage },
                { label: "แผนที่ศูนย์ฯ", page: "sitemap" as PublicPage },
                { label: "ร้านค้าชุมชน", page: "storefront" as PublicPage },
              ].map((l) => (
                <li key={l.page}>
                  <button
                    onClick={() => navigate(l.page)}
                    className="text-white/60 hover:text-white text-sm transition-colors text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[#D6A84F] text-xs font-semibold uppercase tracking-wider mb-4">ศูนย์ฯ และระบบ</h3>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "Shellac Learning Center", page: "shellac" as PublicPage },
                { label: "Smart Farm", page: "smart-farm" as PublicPage },
              ].map((l) => (
                <li key={l.page}>
                  <button
                    onClick={() => navigate(l.page)}
                    className="text-white/60 hover:text-white text-sm transition-colors text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
              <li>
                <a
                  href="https://mahidol.ac.th"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors"
                >
                  มหาวิทยาลัยมหิดล <ExternalLink size={11} />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[#D6A84F] text-xs font-semibold uppercase tracking-wider mb-4">ข้อมูลและนโยบาย</h3>
            <ul className="flex flex-col gap-2.5">
              {["นโยบายความเป็นส่วนตัว", "การเข้าถึงเว็บไซต์", "ข้อกำหนดการใช้งาน", "ติดต่อเรา"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 flex items-center justify-between max-sm:flex-col max-sm:gap-3 max-sm:text-center">
          <p className="text-white/40 text-xs">
            © 2567 มหาวิทยาลัยมหิดล วิทยาเขตลำปาง สงวนลิขสิทธิ์
          </p>
          <p className="text-white/30 text-xs">
            Mahidol University Lampang Campus
          </p>
        </div>
      </div>
    </footer>
  );
}
