import React from 'react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

interface HeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  onToggleSidebar: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  breadcrumbs,
  onToggleSidebar,
  onOpenNotifications,
  onOpenProfile,
}) => {
  const defaultBreadcrumbs: BreadcrumbItem[] = [
    { label: 'หน้าหลัก' },
    { label: 'ระบบบริหารโครงการและกิจกรรม (AI-assisted Management)', active: true },
  ];

  const crumbs = breadcrumbs && breadcrumbs.length > 0 ? breadcrumbs : defaultBreadcrumbs;

  return (
    <header className="h-14 bg-[#0c2340] text-white px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 border-b border-white/10 shadow-xs">
      {/* Left: Mobile hamburger & Dynamic Breadcrumbs */}
      <div className="flex items-center gap-2.5 text-[12px] text-slate-300 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden text-slate-300 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>

        <div className="flex items-center gap-1.5 truncate">
          {crumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-slate-500 text-[10px]">&gt;</span>}
              {crumb.onClick && !crumb.active ? (
                <button
                  type="button"
                  onClick={crumb.onClick}
                  className="hover:text-white transition-colors truncate text-slate-300 hover:underline cursor-pointer"
                >
                  {crumb.label}
                </button>
              ) : (
                <span
                  className={`truncate ${
                    crumb.active ? 'text-white font-medium' : 'text-slate-300'
                  }`}
                >
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <button
          type="button"
          onClick={onOpenNotifications}
          className="relative text-slate-300 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          title="การแจ้งเตือน"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse ring-2 ring-[#0c2340]"></span>
        </button>

        <button
          type="button"
          onClick={onOpenProfile}
          className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
        >
          <img
            alt="Profile Dr. Kiatisak"
            className="w-7 h-7 rounded-full object-cover ring-1 ring-white/30 shrink-0"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuABUci1kRaWLA2KS0xbErbOuKvsq-xcMW8otImzD_8BGAR5yrYpfvn3v0222BbX4YZ5AVYVzs9oYUzWV7xlhHtcoiJZ8WXX6Fgfwqs8OK5JxWyGmpG-ZB5sT2BBGoZhrQ7jsG24oTURf2l1Rz0vyoFMWll9C6wJKW94-87UmmGDfqy1-8W-2gs0UHUaKeH3gMkWCfKY4YeAzfkVzrSay699IxlsSrRJfRZFMAKzDwl1Vw-YVNhSNb"
          />
          <div className="text-left leading-tight hidden sm:block">
            <div className="text-[12px] font-medium text-white">ดร. เกียรติศักดิ์</div>
            <div className="text-[10px] text-slate-400">Super Admin</div>
          </div>
          <span className="material-symbols-outlined text-slate-400 text-[16px]">
            expand_more
          </span>
        </button>
      </div>
    </header>
  );
};
