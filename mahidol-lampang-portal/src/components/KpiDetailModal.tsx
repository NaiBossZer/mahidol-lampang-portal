import React from 'react';
import { Activity } from '../types';

interface KpiDetailModalProps {
  isOpen: boolean;
  metricName: string | null;
  activity: Activity;
  onClose: () => void;
}

export const KpiDetailModal: React.FC<KpiDetailModalProps> = ({
  isOpen,
  metricName,
  activity,
  onClose,
}) => {
  if (!isOpen || !metricName) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 overflow-hidden text-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sky-600 text-[20px]">
              info
            </span>
            <h3 className="text-[15px] font-bold text-slate-900">
              รายละเอียดตัวชี้วัด: {metricName}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="py-4 space-y-3.5 text-[12px]">
          <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 space-y-1">
            <div className="text-[11px] text-sky-700 font-medium">
              กิจกรรมปัจจุบัน
            </div>
            <div className="text-[13px] font-bold text-slate-900">
              {activity.name}
            </div>
            <div className="text-[11px] text-slate-500">
              {activity.faculty} • {activity.campus}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <div className="text-slate-400 text-[11px]">ผู้เข้าร่วมทั้งหมด</div>
              <div className="text-[18px] font-bold text-slate-900 mt-0.5">
                {activity.participants} คน
              </div>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <div className="text-slate-400 text-[11px]">ส่งแบบประเมินแล้ว</div>
              <div className="text-[18px] font-bold text-emerald-600 mt-0.5">
                {activity.respondents} คน
              </div>
            </div>
          </div>

          <div className="space-y-1.5 text-slate-600">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>อัตราตอบกลับเป้าหมาย (KPI Target):</span>
              <span className="font-semibold text-slate-900">&ge; 80.0%</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>ผลการดำเนินงานจริง:</span>
              <span className="font-semibold text-teal-600">
                {activity.responseRate}% (บรรลุเป้าหมาย)
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span>เกณฑ์การประเมินคะแนนเฉลี่ย:</span>
              <span className="font-semibold text-slate-900">
                {activity.avgScore.toFixed(2)} / 5.00 ({activity.scoreGrade})
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-[12px] font-medium"
          >
            ตกลง
          </button>
        </div>
      </div>
    </div>
  );
};
