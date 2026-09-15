import React from 'react';
import { Activity } from '../types';

interface RespondentGroupsProps {
  activity: Activity;
}

export const RespondentGroups: React.FC<RespondentGroupsProps> = ({
  activity,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-3.5 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sky-600 text-[18px]">
            pie_chart
          </span>
          <h3 className="text-[14px] font-bold text-slate-900">
            กลุ่มผู้ตอบแบบประเมิน
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">
          รวม {activity.respondents} คน
        </span>
      </div>

      <div className="space-y-3 text-[12px]">
        {activity.respondentGroups.map((group, idx) => (
          <div key={idx}>
            <div className="flex justify-between text-slate-700 mb-1">
              <span className="truncate pr-2">• {group.label}</span>
              <span className="font-semibold text-slate-900 shrink-0">
                {group.count} คน{' '}
                <span className="text-[10px] text-slate-400 font-normal">
                  ({group.percentage.toFixed(1)}%)
                </span>
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className={`${
                  group.color || 'bg-sky-600'
                } h-full rounded-full transition-all duration-700 ease-out`}
                style={{ width: `${group.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
