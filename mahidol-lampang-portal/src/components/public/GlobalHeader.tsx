import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import type { PublicPage } from "../PublicPortal";

interface Props {
  currentPage: PublicPage;
  navigate: (p: PublicPage) => void;
}

const navItems = [
  { label: "หน้าหลัก", page: "home" as PublicPage },
  { label: "กิจกรรม", page: "activities" as PublicPage },
  {
    label: "ศูนย์ฯ",
    children: [
      { label: "Shellac Learning Center", page: "shellac" as PublicPage },
      { label: "Smart Farm", page: "smart-farm" as PublicPage },
    ],
  },
  { label: "แผนที่", page: "sitemap" as PublicPage },
  { label: "ร้านค้า", page: "storefront" as PublicPage },
];

export default function GlobalHeader({ currentPage, navigate }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#EEE9DF] shadow-[0_1px_4px_rgba(18,59,99,0.06)]">
      <div className="max-w-[1280px] mx-auto px-8 max-md:px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <button
          onClick={() => navigate("home")}
          className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677A8] rounded-md"
          aria-label="Mahidol Lampang Portal — กลับหน้าหลัก"
        >
          <div className="w-9 h-9 rounded-lg bg-[#123B63] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-display font-bold text-sm tracking-wide">ML</span>
          </div>
          <div className="text-left leading-tight">
            <div className="text-[#123B63] font-semibold text-sm">Mahidol Lampang</div>
            <div className="text-[#667085] text-[11px] font-medium">มหิดล ลำปาง พอร์ทัล</div>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="เมนูหลัก">
          {navItems.map((item) =>
            item.children ? (
              <div key={item.label} className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
                  className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-[#1F2933] hover:bg-[#F8F6F0] hover:text-[#123B63] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677A8]"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  {item.label}
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {dropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-[#EEE9DF] rounded-xl shadow-lg py-1 min-w-[200px]">
                    {item.children.map((child) => (
                      <button
                        key={child.page}
                        onClick={() => {
                          navigate(child.page);
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-[#1F2933] hover:bg-[#F8F6F0] hover:text-[#123B63] transition-colors"
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                key={item.page}
                onClick={() => navigate(item.page!)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677A8] ${
                  currentPage === item.page
                    ? "text-[#123B63] bg-[#EEE9DF] font-semibold"
                    : "text-[#1F2933] hover:bg-[#F8F6F0] hover:text-[#123B63]"
                }`}
              >
                {item.label}
              </button>
            ),
          )}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate("login")}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-[#123B63] border border-[#123B63]/30 hover:border-[#123B63] hover:bg-[#123B63]/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677A8] min-h-[44px]"
          >
            เข้าสู่ระบบ
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-md text-[#1F2933] hover:bg-[#F8F6F0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677A8] min-w-[44px] min-h-[44px] flex items-center justify-center"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "ปิดเมนู" : "เปิดเมนู"}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="md:hidden border-t border-[#EEE9DF] bg-white"
          role="navigation"
          aria-label="เมนูมือถือ"
        >
          <div className="max-w-[1280px] mx-auto px-4 py-3 flex flex-col gap-1">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <div className="px-3 py-2 text-sm font-semibold text-[#667085] uppercase tracking-wider">
                    {item.label}
                  </div>
                  {item.children.map((child) => (
                    <button
                      key={child.page}
                      onClick={() => {
                        navigate(child.page);
                        setMobileOpen(false);
                      }}
                      className="w-full text-left px-6 py-3 rounded-md text-sm text-[#1F2933] hover:bg-[#F8F6F0] min-h-[44px] transition-colors"
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              ) : (
                <button
                  key={item.page}
                  onClick={() => {
                    navigate(item.page!);
                    setMobileOpen(false);
                  }}
                  className={`w-full text-left px-3 py-3 rounded-md text-sm font-medium min-h-[44px] transition-colors ${
                    currentPage === item.page
                      ? "text-[#123B63] bg-[#EEE9DF] font-semibold"
                      : "text-[#1F2933] hover:bg-[#F8F6F0]"
                  }`}
                >
                  {item.label}
                </button>
              ),
            )}
            <div className="pt-2 pb-1 border-t border-[#EEE9DF] mt-2">
              <button
                onClick={() => {
                  navigate("login");
                  setMobileOpen(false);
                }}
                className="w-full px-3 py-3 rounded-lg text-sm font-semibold text-[#123B63] border border-[#123B63]/30 hover:bg-[#123B63]/5 min-h-[44px] transition-colors"
              >
                เข้าสู่ระบบ
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
