import React from 'react';
import { AdminActivityItem, ActivityReport } from '../types';

interface PublishConfirmModalProps {
  isOpen: boolean;
  activity: AdminActivityItem;
  report: ActivityReport;
  onClose: () => void;
  onConfirm: () => void;
}

export const PublishConfirmModal: React.FC<PublishConfirmModalProps> = ({
  isOpen,
  activity,
  report,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-[#0c2340] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">public</span>
            </div>
            <div>
              <h3 className="text-[15px] font-bold tracking-tight text-white">
                ยืนยันการเผยแพร่ข่าวกิจกรรมหรือไม่?
              </h3>
              <p className="text-[11px] text-slate-300">
                ขั้นตอนที่ 9: เผยแพร่ข้อมูลสู่เว็บไซต์ทางการ มหาวิทยาลัยมหิดล วิทยาเขตลำปาง
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-[12px]">
          {/* News Preview Snapshot Card */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-start gap-3">
              {report.coverImage ? (
                <img
                  src={report.coverImage}
                  alt={report.title}
                  className="w-20 h-14 object-cover rounded-lg border border-slate-200 shrink-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-20 h-14 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-[10px] shrink-0">
                  ไม่มีภาพปก
                </div>
              )}

              <div className="min-w-0 space-y-1">
                <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 uppercase tracking-wide">
                  ข่าวกิจกรรมและผลสัมฤทธิ์
                </span>
                <h4 className="font-bold text-slate-900 text-[13px] leading-snug line-clamp-2">
                  {report.title || activity.name}
                </h4>
                <div className="text-[10px] text-slate-500">
                  หน่วยงาน: {activity.faculty}
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-600 line-clamp-2 bg-white p-2.5 rounded-lg border border-slate-200">
              {report.summary || 'สรุปข่าวกิจกรรมและผลการดำเนินงาน'}
            </div>
          </div>

          {/* Verification Checklist */}
          <div className="space-y-2">
            <div className="text-[12px] font-bold text-slate-900 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-emerald-600 text-[18px]">
                fact_check
              </span>
              <span>รายการตรวจสอบก่อนเผยแพร่โดย ADMIN:</span>
            </div>

            <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1.5 text-[11px] text-emerald-950">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-[15px]">
                  check_circle
                </span>
                <span>หัวข้อข่าวและเนื้อหารายงานครบถ้วน</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-[15px]">
                  check_circle
                </span>
                <span>ผลการดำเนินงานและผลกระทบ (KPI & Impact) ได้รับการตรวจสอบ</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-[15px]">
                  check_circle
                </span>
                <span>
                  รูปภาพประกอบ: {activity.photos?.length || 0} ภาพ{' '}
                  {activity.photos?.length === 0 ? '(ข้ามขั้นตอนรูปภาพ - ระบบใช้รูปภาพมาตรฐาน)' : ''}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-[15px]">
                  check_circle
                </span>
                <span>เป้าหมายปลายทาง: เว็บไซต์พอร์ทัลวิทยาเขต (portal.lampang.mahidol.ac.th)</span>
              </div>
            </div>
          </div>

          {/* Governance Notice */}
          <div className="p-2.5 bg-slate-100 rounded-lg text-[10.5px] text-slate-500 flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-600 text-[16px]">
              verified_user
            </span>
            <span>
              การเผยแพร่ถูกบันทึกประวัติภายใต้บัญชี ADMIN: <strong>{activity.responsiblePerson}</strong>
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-medium rounded-lg text-[12px] transition-colors cursor-pointer"
          >
            ยกเลิก
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg text-[12px] flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
            <span>ยืนยันเผยแพร่ทันที</span>
          </button>
        </div>
      </div>
    </div>
  );
};
