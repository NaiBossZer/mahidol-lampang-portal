import React from 'react';

interface UserProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (nav: string) => void;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-4 top-14 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <img
            alt="Dr. Kiatisak"
            className="w-11 h-11 rounded-full object-cover ring-2 ring-sky-600/30"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuABUci1kRaWLA2KS0xbErbOuKvsq-xcMW8otImzD_8BGAR5yrYpfvn3v0222BbX4YZ5AVYVzs9oYUzWV7xlhHtcoiJZ8WXX6Fgfwqs8OK5JxWyGmpG-ZB5sT2BBGoZhrQ7jsG24oTURf2l1Rz0vyoFMWll9C6wJKW94-87UmmGDfqy1-8W-2gs0UHUaKeH3gMkWCfKY4YeAzfkVzrSay699IxlsSrRJfRZFMAKzDwl1Vw-YVNhSNb"
          />
          <div className="min-w-0">
            <div className="font-bold text-[13px] text-slate-900 truncate">
              ดร. เกียรติศักดิ์
            </div>
            <div className="text-[11px] text-slate-500 truncate">
              apiwat.suw@mahidol.ac.th
            </div>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-sky-100 text-sky-800">
              Super Admin
            </span>
          </div>
        </div>

        <div className="p-1 text-[12px] space-y-0.5">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onNavigate) onNavigate('users');
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer text-left"
          >
            <span className="material-symbols-outlined text-[18px] text-slate-400">
              account_circle
            </span>
            <span>ข้อมูลส่วนตัว &amp; สิทธิ์ผู้ใช้งาน</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onNavigate) onNavigate('users');
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer text-left"
          >
            <span className="material-symbols-outlined text-[18px] text-slate-400">
              security
            </span>
            <span>สิทธิ์การเข้าถึงและความปลอดภัย (RBAC)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onNavigate) onNavigate('settings');
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer text-left"
          >
            <span className="material-symbols-outlined text-[18px] text-slate-400">
              tune
            </span>
            <span>ตั้งค่าระบบ &amp; ธรรมาภิบาล</span>
          </button>
        </div>

        <div className="p-2 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-[12px] font-medium transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </div>
    </>
  );
};
