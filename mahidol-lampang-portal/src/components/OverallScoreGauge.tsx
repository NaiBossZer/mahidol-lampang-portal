import React from 'react';
import { Activity } from '../types';

interface OverallScoreGaugeProps {
  activity: Activity;
}

export const OverallScoreGauge: React.FC<OverallScoreGaugeProps> = ({
  activity,
}) => {
  // percentage based on max score 5.0
  const percentage = (activity.avgScore / activity.maxScore) * 100;
  // circumference of circle with radius 15.9155 is 100
  const strokeDash = `${percentage.toFixed(1)}, 100`;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-3.5">
      <h3 className="text-[14px] font-bold text-slate-900 mb-3">
        ผลการประเมินภาพรวม
      </h3>

      <div className="flex items-center justify-between gap-4">
        {/* Radial Gauge */}
        <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            {/* Background circle */}
            <path
              className="text-slate-100"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.6"
            />
            {/* Value fill circle */}
            <path
              className="text-sky-600 transition-all duration-700 ease-out"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeDasharray={strokeDash}
              strokeLinecap="round"
              strokeWidth="3.6"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="text-[22px] font-bold text-slate-900 leading-tight">
              {activity.avgScore.toFixed(2)}
            </div>
            <div className="text-[10px] text-slate-400 leading-none">
              / {activity.maxScore.toFixed(2)}
            </div>
            <span className="mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
              {activity.scoreGrade}
            </span>
          </div>
        </div>

        {/* Side Metrics */}
        <div className="space-y-3 flex-1 text-[12px]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-slate-50 flex items-center justify-center text-slate-500 shrink-0">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
            <div>
              <div className="text-slate-500 text-[11px]">ผู้ตอบแบบประเมิน</div>
              <div className="font-bold text-slate-900">
                {activity.respondents}{' '}
                <span className="font-normal text-slate-500">คน</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-slate-50 flex items-center justify-center text-slate-500 shrink-0">
              <span className="material-symbols-outlined text-[18px]">groups</span>
            </div>
            <div>
              <div className="text-slate-500 text-[11px]">ผู้เข้าร่วมกิจกรรม</div>
              <div className="font-bold text-slate-900">
                {activity.participants}{' '}
                <span className="font-normal text-slate-500">คน</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-slate-50 flex items-center justify-center text-slate-500 shrink-0">
              <span className="material-symbols-outlined text-[18px]">sync</span>
            </div>
            <div>
              <div className="text-slate-500 text-[11px]">Response Rate</div>
              <div className="font-bold text-slate-900">
                {activity.responseRate}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
