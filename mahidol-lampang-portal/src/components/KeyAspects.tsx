import React from 'react';
import { Activity } from '../types';

interface KeyAspectsProps {
  activity: Activity;
  onViewAllAspects: () => void;
}

export const KeyAspects: React.FC<KeyAspectsProps> = ({
  activity,
  onViewAllAspects,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs space-y-3 p-3.5">
      {/* Highest Score Aspect */}
      <div>
        <div className="flex items-center justify-between text-[12px] mb-1.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <span className="text-[14px]">🏆</span>
            <span>หัวข้อคะแนนสูงสุด</span>
          </div>
          <button
            type="button"
            onClick={onViewAllAspects}
            className="text-[10px] text-sky-600 hover:text-sky-800 font-medium hover:underline cursor-pointer"
          >
            ดูทั้งหมด →
          </button>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <div className="text-[12px] font-medium text-slate-800 line-clamp-1">
            {activity.topAspect.title}
          </div>
          <div className="flex items-baseline justify-between mt-1 text-[11px]">
            <span className="text-slate-400">
              จาก {activity.topAspect.respondentsCount} คน
            </span>
            <span className="text-emerald-600 font-bold text-[13px]">
              {activity.topAspect.score.toFixed(2)}{' '}
              <span className="text-[10px] text-slate-400 font-normal">
                / {activity.topAspect.total.toFixed(2)}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Focus Area / Topic Needing Attention */}
      <div>
        <div className="flex items-center gap-1.5 font-bold text-slate-900 text-[12px] mb-1.5">
          <span className="text-[14px]">⚠️</span>
          <span>หัวข้อที่ควรติดตาม</span>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <div className="text-[12px] font-medium text-slate-800 line-clamp-1">
            {activity.concernAspect.title}
          </div>
          <div className="flex items-baseline justify-between mt-1 text-[11px]">
            <span className="text-slate-400">
              จาก {activity.concernAspect.respondentsCount} คน
            </span>
            <span className="text-amber-600 font-bold text-[13px]">
              {activity.concernAspect.score.toFixed(2)}{' '}
              <span className="text-[10px] text-slate-400 font-normal">
                / {activity.concernAspect.total.toFixed(2)}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
