import { LayoutDashboard, BarChart2, Building2, Settings, X, Leaf, Users } from "lucide-react";
import type { AdminPage } from "../AdminPortal";

interface Props {
  currentPage: AdminPage;
  navigate: (p: AdminPage) => void;
  open: boolean;
  onClose: () => void;
}

const navSections = [
  {
    title: "ภาพรวม",
    items: [{ icon: LayoutDashboard, label: "Dashboard", page: "dashboard" as AdminPage }],
  },
  {
    title: "การวิเคราะห์",
    items: [
      { icon: BarChart2, label: "LAC Satisfaction", page: "lac-satisfaction" as AdminPage },
      { icon: Building2, label: "Facility Safety", page: "facility" as AdminPage },
    ],
  },
  {
    title: "ระบบ",
    items: [
      { icon: Leaf, label: "Smart Farm", page: "hub" as AdminPage },
      { icon: Users, label: "ผู้ใช้งาน", page: "hub" as AdminPage },
      { icon: Settings, label: "ตั้งค่า", page: "hub" as AdminPage },
    ],
  },
];

function SidebarContent({ currentPage, navigate, onClose }: Omit<Props, "open">) {
  return (
    <div className="flex flex-col h-full bg-[#123B63] w-[220px] flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
            <span className="text-white font-display font-bold text-xs">ML</span>
          </div>
          <div>
            <div className="text-white font-semibold text-sm">Admin</div>
            <div className="text-white/40 text-[10px]">มหิดล ลำปาง</div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden text-white/40 hover:text-white p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          aria-label="ปิดเมนู"
        >
          <X size={16} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto" aria-label="Admin navigation">
        {navSections.map((section) => (
          <div key={section.title}>
            <div className="text-white/35 text-[10px] font-semibold uppercase tracking-wider px-3 mb-1.5">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = currentPage === item.page;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      navigate(item.page);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
                      active
                        ? "bg-white/15 text-white font-semibold"
                        : "text-white/60 hover:text-white hover:bg-white/8"
                    }`}
                  >
                    <Icon size={16} className={active ? "text-[#D6A84F]" : ""} />
                    {item.label}
                    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#D6A84F]" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-white/10 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#D6A84F] flex items-center justify-center text-[#123B63] font-bold text-sm">
            A
          </div>
          <div className="min-w-0">
            <div className="text-white text-sm font-medium truncate">Admin User</div>
            <div className="text-white/40 text-xs truncate">admin@mahidol.ac.th</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminSidebar({ currentPage, navigate, open, onClose }: Props) {
  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:flex">
        <SidebarContent currentPage={currentPage} navigate={navigate} onClose={onClose} />
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <div className="relative">
            <SidebarContent currentPage={currentPage} navigate={navigate} onClose={onClose} />
          </div>
        </div>
      )}
    </>
  );
}
