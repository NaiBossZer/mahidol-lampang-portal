import React from 'react';
import { AdminActivityItem } from '../types';

interface CompletionConfirmModalProps {
  isOpen: boolean;
  activity: AdminActivityItem;
  onClose: () => void;
  onConfirm: () => void;
}

export const CompletionConfirmModal: React.FC<CompletionConfirmModalProps> = ({
  isOpen,
  activity,
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
        {/* Modal Header */}
        <div className="bg-[#0c2340] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">flag</span>
            </div>
            <div>
              <h3 className="text-[15px] font-bold tracking-tight text-white">
                ยืนยันการเสร็จสิ้นโครงการหรือไม่?
              </h3>
              <p className="text-[11px] text-slate-300">
                ขั้นตอนที่ 6: สิ้นสุดระยะเวลาจัดกิจกรรมและเปิดขั้นตอนหลังโครงการ
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

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-[12px]">
          {/* Target Activity Summary Card */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                {activity.code}
              </span>
              <span className="text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                สถานะปัจจุบัน: ดำเนินกิจกรรม
              </span>
            </div>

            <div className="font-bold text-[14px] text-slate-900 leading-snug">
              {activity.name}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-slate-400 text-[15px]">
                  calendar_today
                </span>
                <span>{activity.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-slate-400 text-[15px]">
                  groups
                </span>
                <span>เป้าหมาย {activity.targetCount} คน</span>
              </div>
            </div>
          </div>

          {/* Workflow Impact Notice */}
          <div className="space-y-2">
            <div className="text-[12px] font-bold text-slate-900 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-amber-600 text-[18px]">
                info
              </span>
              <span>สิ่งที่จะเกิดขึ้นเมื่อยืนยันเสร็จสิ้นโครงการ:</span>
            </div>

            <ul className="space-y-1.5 pl-6 list-disc text-slate-600 text-[11.5px]">
              <li>
                สถานะกิจกรรมจะเปลี่ยนเป็น <strong className="text-slate-900">"เสร็จสิ้นโครงการ" (Completed)</strong>
              </li>
              <li>
                ระบบจะปิดรับคำตอบแบบสอบถามการประเมิน และนำข้อมูลสถิติเข้าสู่การสรุปผลสัมฤทธิ์
              </li>
              <li>
                ระบบจะเปิด <strong className="text-emerald-700">Workflow หลังโครงการ</strong> ได้แก่:
                <div className="mt-1 pl-2 text-[11px] text-slate-500 space-y-0.5">
                  <div>• <strong>บันทึกรูปภาพกิจกรรม:</strong> อัปโหลดภาพบรรยากาศและเลือกภาพปก (เป็นข้อมูลทางเลือก Optional)</div>
                  <div>• <strong>จัดทำรายงาน/ข่าวกิจกรรม:</strong> ใช้ AI ช่วยร่างเนื้อหาข่าว สรุปผลสัมฤทธิ์ และผลกระทบ</div>
                  <div>• <strong>ADMIN ตรวจสอบ & เผยแพร่:</strong> พรีวิวเสมือนจริงและกดเผยแพร่ขึ้นเว็บไซต์</div>
                </div>
              </li>
            </ul>
          </div>

          {/* Confirmation Callout */}
          <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-amber-900 text-[11px] flex items-start gap-2.5">
            <span className="material-symbols-outlined text-amber-600 text-[18px] shrink-0 mt-0.5">
              shield
            </span>
            <div>
              <span className="font-bold">ADMIN เป็นผู้ควบคุมทุกขั้นตอน:</span> AI จะทำหน้าที่เป็นผู้ช่วยร่างเนื้อหาเท่านั้น และ ADMIN จะเป็นผู้ตรวจทานและกดเผยแพร่เว็บไซต์ด้วยตนเองเสมอ
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
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
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[12px] flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>ยืนยันเสร็จสิ้นโครงการ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
