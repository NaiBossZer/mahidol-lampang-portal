import React, { useState } from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  onOpenProfile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeNav,
  setActiveNav,
  onOpenProfile,
}) => {
  const [surveySubmenuOpen, setSurveySubmenuOpen] = useState(true);

  const navItems = [
    {
      id: 'analytics',
      label: 'รายงานผลสัมฤทธิ์ & สถิติ',
      icon: 'analytics',
      iconColor: 'text-amber-400',
    },
    {
      id: 'surveys',
      label: 'บริหารกิจกรรม & Survey',
      icon: 'rule',
      hasSubmenu: true,
    },
    {
      id: 'docs',
      label: 'คลังเอกสารราชการ',
      icon: 'folder_shared',
    },
    {
      id: 'ai-workspace',
      label: 'AI Assistant Studio',
      icon: 'psychology',
    },
    {
      id: 'users',
      label: 'ผู้ใช้งาน & สิทธิ์การเข้าถึง',
      icon: 'group',
    },
    {
      id: 'notifications',
      label: 'การแจ้งเตือน',
      icon: 'notifications',
      badge: 3,
    },
    {
      id: 'settings',
      label: 'ตั้งค่าระบบ',
      icon: 'settings',
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        id="app-sidebar"
        className={`w-[245px] shrink-0 bg-[#0c2340] text-white flex flex-col justify-between fixed top-0 bottom-0 left-0 z-50 select-none h-screen transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col">
          {/* Brand Logo Header */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-white/10">
            <button
              type="button"
              onClick={() => {
                setActiveNav('home');
                if (window.innerWidth < 1024) onClose();
              }}
              className="flex items-center gap-3 text-left cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                <span className="text-[#0c2340] font-bold text-xs tracking-tighter border-2 border-[#0c2340] rounded-full w-7 h-7 flex items-center justify-center">
                  MU
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-[14px] leading-tight text-white tracking-tight truncate">
                  Mahidol Lampang Portal
                </span>
                <span className="text-[10px] text-slate-300 font-normal leading-tight truncate mt-0.5">
                  ระบบบริหารจัดการและข้อมูลเชิงสถิติ
                </span>
              </div>
            </button>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden text-slate-400 hover:text-white p-1"
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1 text-[13px] overflow-y-auto max-h-[calc(100vh-140px)]">
            {navItems.map((item) => {
              const isParentActive =
                activeNav === item.id ||
                (item.id === 'surveys' &&
                  (activeNav === 'workflow' || activeNav === 'activity-detail'));

              if (item.hasSubmenu) {
                return (
                  <div key={item.id} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setSurveySubmenuOpen(!surveySubmenuOpen);
                        setActiveNav('home');
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                        isParentActive
                          ? 'bg-[#163a66] text-white font-medium shadow-xs'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[19px]">
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      <span
                        className={`material-symbols-outlined text-[16px] text-slate-400 transition-transform ${
                          surveySubmenuOpen ? 'rotate-180' : ''
                        }`}
                      >
                        expand_more
                      </span>
                    </button>

                    {surveySubmenuOpen && (
                      <div className="pl-9 pr-2 py-1 space-y-1 text-[12px]">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveNav('home');
                            if (window.innerWidth < 1024) onClose();
                          }}
                          className={`w-full text-left py-1 px-2 rounded block truncate transition-colors ${
                            activeNav === 'home'
                              ? 'text-sky-300 font-semibold bg-white/10'
                              : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          รายการกิจกรรมโครงการ
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveNav('workflow');
                            if (window.innerWidth < 1024) onClose();
                          }}
                          className={`w-full text-left py-1 px-2 rounded block truncate transition-colors flex items-center justify-between ${
                            activeNav === 'workflow'
                              ? 'text-sky-300 font-semibold bg-white/10'
                              : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <span>+ สร้างกิจกรรม &amp; AI Survey</span>
                          <span className="text-[9px] px-1 py-0.2 bg-purple-600 text-white rounded font-bold">
                            AI
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveNav(item.id);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    activeNav === item.id
                      ? 'bg-[#163a66] text-white font-medium shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`material-symbols-outlined text-[19px] ${
                        item.iconColor || ''
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile */}
        <div className="p-3 border-t border-white/10">
          <button
            type="button"
            onClick={onOpenProfile}
            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer text-left transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                alt="Dr. Kiatisak"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-white/30 shrink-0"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAkn91IOeKpnt7UxpHp0D4DdJE-kkXjqQHojzwrX--ThpK0nRci525m-dXSrNn1T9_CGCYCLEJoyL0mq7piLu8gJCt3_NPRWLbpjrtIhsPvnIQcyJxh0ZGaq624INnojOfuI0oM59e4b_ilYR-XEpv1D-MvSfIG_kZiNHDeTFwp2mN2IerndLVBs8saaTn31XrN8ngaQ5YKxCCYoeLJqPztYxv9_WThKGHrqEBJ7tOZN_PSmhinM0m"
              />
              <div className="flex flex-col text-left min-w-0">
                <span className="text-[12px] font-medium leading-snug text-white truncate">
                  ดร. เกียรติศักดิ์
                </span>
                <span className="text-[10px] text-slate-400 leading-none truncate">
                  Super Admin
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-slate-400 text-[18px] shrink-0">
              unfold_more
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};
