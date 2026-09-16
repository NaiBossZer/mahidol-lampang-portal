import React from 'react';

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onViewAll?: () => void;
}

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({
  isOpen,
  onClose,
  onViewAll,
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      title: 'ผู้ตอบแบบประเมินครบ 90%',
      desc: 'กิจกรรม ENVI Mahidol ร่วมใจ พัฒนาชุมชน บรรลุเกณฑ์ประเมินเรียบร้อย',
      time: '10 นาทีที่แล้ว',
      unread: true,
      icon: 'verified',
      iconColor: 'text-emerald-500',
    },
    {
      id: 2,
      title: 'ระบบอัปเดตข้อมูลสถิติรอบเช้า',
      desc: 'สรุปผลคะแนนประเมินประจำสัปดาห์ได้รับการประมวลผลแล้ว',
      time: '1 ชั่วโมงที่แล้ว',
      unread: true,
      icon: 'sync',
      iconColor: 'text-sky-500',
    },
    {
      id: 3,
      title: 'แบบประเมินใหม่เปิดรับคำตอบ',
      desc: 'โครงการอบรมการจัดการขยะ เปิดรับคำตอบถึงวันที่ 20 ก.ย. 2568',
      time: '3 ชั่วโมงที่แล้ว',
      unread: true,
      icon: 'assignment',
      iconColor: 'text-purple-500',
    },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-4 top-14 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-700 text-[18px]">
              notifications
            </span>
            <span className="font-bold text-[13px] text-slate-900">
              การแจ้งเตือน
            </span>
            <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              3 ใหม่
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-[11px]"
          >
            ปิด
          </button>
        </div>

        <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3 hover:bg-slate-50 transition-colors flex items-start gap-3 cursor-pointer ${
                n.unread ? 'bg-sky-50/30' : ''
              }`}
            >
              <span
                className={`material-symbols-outlined text-[20px] shrink-0 mt-0.5 ${n.iconColor}`}
              >
                {n.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-semibold text-slate-900 truncate">
                  {n.title}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  {n.desc}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">{n.time}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-2.5 flex items-center justify-between border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            className="text-[11px] font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            ทำเครื่องหมายว่าอ่านทั้งหมด
          </button>

          {onViewAll && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onViewAll();
              }}
              className="text-[11px] font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-0.5 cursor-pointer"
            >
              <span>ดูทั้งหมด</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};
