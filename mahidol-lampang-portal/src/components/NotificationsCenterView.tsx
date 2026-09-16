import React, { useState } from 'react';

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  category: 'ai' | 'survey' | 'publish' | 'system';
  timestamp: string;
  isRead: boolean;
  activityCode?: string;
  actionLabel?: string;
  actionTarget?: string;
}

interface NotificationsCenterViewProps {
  onNavigate: (nav: string) => void;
}

export const NotificationsCenterView: React.FC<NotificationsCenterViewProps> = ({
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'ai' | 'survey' | 'publish'>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n-1',
      title: 'AI สกัดข้อมูลเอกสารราชการสำเร็จ (Confidence: 98.4%)',
      desc: 'ระบบได้สกัดวัตถุประสงค์ ตัวชี้วัด และกลุ่มเป้าหมาย 30 คน จาก "บันทึกข้อความ_ENVI_ขออนุมัติจัดกิจกรรม.pdf" เรียบร้อยแล้ว',
      category: 'ai',
      timestamp: '10 นาทีที่แล้ว',
      isRead: false,
      activityCode: 'ACT-68-01',
      actionLabel: 'ตรวจทานแบบสอบถาม AI',
      actionTarget: 'workflow',
    },
    {
      id: 'n-2',
      title: 'ผู้ตอบแบบสอบถามครบเป้าหมาย 30 คน (100%)',
      desc: 'กิจกรรม "ENVI Mahidol ร่วมใจ พัฒนาชุมชน" มีผู้เข้าร่วมตอบแบบประเมินความพึงพอใจครบตามเป้าหมาย คะแนนเฉลี่ย 4.54/5.00',
      category: 'survey',
      timestamp: '1 ชั่วโมงที่แล้ว',
      isRead: false,
      activityCode: 'ACT-68-01',
      actionLabel: 'ดูผลสถิติ & กราฟ Dashboard',
      actionTarget: 'analytics',
    },
    {
      id: 'n-3',
      title: 'เผยแพร่ข่าวกิจกรรมสู่เว็บไซต์มหาวิทยาลัยแล้ว',
      desc: 'ข่าว "ม.มหิดล วิทยาเขตลำปาง จัดกิจกรรมพัฒนาสุขภาวะและสิ่งแวดล้อม" ได้รับการเผยแพร่ผ่าน portal.lampang.mahidol.ac.th',
      category: 'publish',
      timestamp: '3 ชั่วโมงที่แล้ว',
      isRead: false,
      activityCode: 'ACT-68-01',
      actionLabel: 'ดูหน้ารายละเอียดและพรีวิว',
      actionTarget: 'activity-detail',
    },
    {
      id: 'n-4',
      title: 'เอกสารคำสั่งแต่งตั้งคณะกรรมการได้รับการจัดเก็บในคลัง',
      desc: 'จัดเก็บไฟล์ "คำสั่งแต่งตั้งคณะทำงาน_ENVI_2568.pdf" ลงในคลังเอกสารราชการเรียบร้อยแล้ว',
      category: 'system',
      timestamp: 'เมื่อวานนี้ 15:40 น.',
      isRead: true,
      activityCode: 'DOC-68-0942',
      actionLabel: 'เปิดคลังเอกสารราชการ',
      actionTarget: 'docs',
    },
    {
      id: 'n-5',
      title: 'กำหนดการจัดส่งรายงานผลสัมฤทธิ์ประจำปี 2568',
      desc: 'ขอความร่วมมือหัวหน้าโครงการตรวจสอบและยืนยันการเผยแพร่กิจกรรมที่เสร็จสิ้นทั้งหมดก่อนสิ้นรอบประเมิน',
      category: 'system',
      timestamp: '3 วันที่แล้ว',
      isRead: true,
      actionLabel: 'ดูภาพรวมโครงการ',
      actionTarget: 'home',
    },
  ]);

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const handleToggleRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredList = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.isRead;
    if (activeTab === 'ai') return n.category === 'ai';
    if (activeTab === 'survey') return n.category === 'survey';
    if (activeTab === 'publish') return n.category === 'publish';
    return true;
  });

  const getCategoryBadge = (category: NotificationItem['category']) => {
    switch (category) {
      case 'ai':
        return {
          bg: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: 'psychology',
          label: 'AI Studio',
        };
      case 'survey':
        return {
          bg: 'bg-sky-100 text-sky-800 border-sky-200',
          icon: 'fact_check',
          label: 'แบบสอบถาม',
        };
      case 'publish':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: 'public',
          label: 'เผยแพร่เว็บ',
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: 'notifications',
          label: 'ระบบ',
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-sky-900 text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">notifications</span>
            </span>
            <h1 className="text-[17px] font-bold text-slate-900">
              ศูนย์การแจ้งเตือนระบบ (Notification Center)
            </h1>
            {unreadCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {unreadCount} ใหม่
              </span>
            )}
          </div>
          <p className="text-[12px] text-slate-500 mt-1">
            ติดตามสถานะการสกัดเอกสารด้วย AI, การตอบแบบสอบถาม และการเผยแพร่ข่าวกิจกรรมแบบเรียลไทม์
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-[12px] flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span className="material-symbols-outlined text-[16px]">done_all</span>
            <span>ทำเครื่องหมายว่าอ่านแล้วทั้งหมด</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 pb-2 overflow-x-auto text-[12px]">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'all'
              ? 'bg-[#0c2340] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          ทั้งหมด ({notifications.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('unread')}
          className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'unread'
              ? 'bg-[#0c2340] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>ยังไม่อ่าน</span>
          {unreadCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ai')}
          className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'ai'
              ? 'bg-[#0c2340] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          งาน AI &amp; เอกสาร
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('survey')}
          className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'survey'
              ? 'bg-[#0c2340] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          แบบสอบถาม &amp; ผู้ตอบ
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('publish')}
          className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'publish'
              ? 'bg-[#0c2340] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          เผยแพร่เว็บไซต์
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {filteredList.map((item) => {
          const badge = getCategoryBadge(item.category);

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all ${
                !item.isRead
                  ? 'bg-white border-sky-300 shadow-xs ring-1 ring-sky-200/50'
                  : 'bg-white/70 border-slate-200 hover:bg-white'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${badge.bg}`}
                  >
                    <span className="material-symbols-outlined text-[19px]">
                      {badge.icon}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[13px] text-slate-900">
                        {item.title}
                      </span>
                      {item.activityCode && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded border border-slate-200">
                          {item.activityCode}
                        </span>
                      )}
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      )}
                    </div>

                    <p className="text-[12px] text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>

                    <div className="text-[10.5px] text-slate-400 flex items-center gap-2 pt-1">
                      <span>{item.timestamp}</span>
                      <span>•</span>
                      <span>{badge.label}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {item.actionLabel && item.actionTarget && (
                    <button
                      type="button"
                      onClick={() => onNavigate(item.actionTarget!)}
                      className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg text-[11.5px] font-semibold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>{item.actionLabel}</span>
                      <span className="material-symbols-outlined text-[14px]">
                        arrow_forward
                      </span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleToggleRead(item.id)}
                    title={item.isRead ? 'ทำเครื่องหมายว่ายังไม่ได้อ่าน' : 'ทำเครื่องหมายว่าอ่านแล้ว'}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {item.isRead ? 'mark_chat_unread' : 'check_circle'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredList.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-[13px]">
            ไม่มีรายการแจ้งเตือนในหมวดหมู่นี้
          </div>
        )}
      </div>
    </div>
  );
};
