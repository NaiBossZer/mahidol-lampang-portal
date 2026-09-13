import { Menu, Bell, Search } from "lucide-react";
import type { AdminPage } from "../AdminPortal";

const titles: Record<AdminPage, string> = {
  dashboard: "Dashboard",
  "lac-satisfaction": "LAC Satisfaction",
  facility: "Facility Safety",
  hub: "Admin Hub",
};

interface Props {
  page: AdminPage;
  onMenuClick: () => void;
}

export default function AdminHeader({ page, onMenuClick }: Props) {
  return (
    <header className="bg-white border-b border-[#E2E6EA] px-6 max-md:px-4 py-3 flex items-center gap-4">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-[#667085] hover:bg-[#F0F2F5] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677A8]"
        aria-label="เปิดเมนู"
      >
        <Menu size={20} />
      </button>

      <h1 className="text-[#1F2933] font-semibold text-lg">{titles[page]}</h1>

      <div className="ml-auto flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9BA8B7]" />
          <input
            type="search"
            placeholder="ค้นหา..."
            className="pl-8 pr-4 py-2 rounded-lg border border-[#E2E6EA] bg-[#F8F9FA] text-sm text-[#1F2933] placeholder:text-[#9BA8B7] focus:outline-none focus:ring-2 focus:ring-[#1677A8] focus:border-transparent w-[200px]"
          />
        </div>
        <button
          className="relative w-9 h-9 rounded-lg flex items-center justify-center text-[#667085] hover:bg-[#F0F2F5] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677A8]"
          aria-label="การแจ้งเตือน"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C66B4F] rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-[#123B63] flex items-center justify-center text-white text-sm font-bold">
          A
        </div>
      </div>
    </header>
  );
}
