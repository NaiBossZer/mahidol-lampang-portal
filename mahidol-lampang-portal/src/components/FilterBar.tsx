import React, { useState } from 'react';
import { Activity } from '../types';

interface FilterBarProps {
  activities: Activity[];
  selectedActivityId: string;
  onSelectActivity: (id: string) => void;
  period: string;
  setPeriod: (val: string) => void;
  faculty: string;
  setFaculty: (val: string) => void;
  survey: string;
  setSurvey: (val: string) => void;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  activities,
  selectedActivityId,
  onSelectActivity,
  period,
  setPeriod,
  faculty,
  setFaculty,
  survey,
  setSurvey,
  onResetFilters,
}) => {
  const currentActivity =
    activities.find((a) => a.id === selectedActivityId) || activities[0];

  const periods = ['ปีงบประมาณ 2568', 'ปีงบประมาณ 2567', 'ปีงบประมาณ 2566'];
  const faculties = [
    'คณะสิ่งแวดล้อมและทรัพยากรศาสตร์',
    'วิทยาลัยนวัตกรรมและการจัดการ',
    'คณะวิทยาศาสตร์และเทคโนโลยี',
  ];
  const surveys = [
    'ความพึงพอใจผู้เข้าร่วม',
    'ประเมินวิทยากรและเนื้อหา',
    'การประยุกต์ใช้ในชุมชน',
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-3.5 space-y-3">
      {/* Top Status & Scale Badges Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 font-semibold border border-sky-200">
            <span className="material-symbols-outlined text-[14px]">flag</span>
            {currentActivity.mode}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            สถานะ: {currentActivity.status}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200">
            <span className="material-symbols-outlined text-[14px]">straighten</span>
            สเกลคะแนนที่ตรวจพบ: {currentActivity.scale}
          </span>
        </div>

        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-rose-600 font-medium px-2 py-1 rounded hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[14px]">restart_alt</span>
          <span>ล้างตัวกรอง</span>
        </button>
      </div>

      {/* 4 Responsive Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-[12px]">
        {/* 1. Period */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-slate-400">
              calendar_today
            </span>
            ช่วงเวลา (Period)
          </label>
          <div className="relative">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full appearance-none bg-slate-50 hover:bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 pr-8 shadow-2xs text-slate-800 font-medium cursor-pointer transition-colors focus:ring-1 focus:ring-sky-600 focus:outline-none"
            >
              {periods.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[16px] text-slate-400">
              expand_more
            </span>
          </div>
        </div>

        {/* 2. Faculty / Unit */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-slate-400">
              apartment
            </span>
            ศูนย์ / หน่วยงาน (Faculty/Unit)
          </label>
          <div className="relative">
            <select
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
              className="w-full appearance-none bg-slate-50 hover:bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 pr-8 shadow-2xs text-slate-800 font-medium cursor-pointer transition-colors focus:ring-1 focus:ring-sky-600 focus:outline-none truncate"
            >
              {faculties.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[16px] text-slate-400">
              expand_more
            </span>
          </div>
        </div>

        {/* 3. Activity Context */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-slate-400">
              event_available
            </span>
            กิจกรรม (Activity Context)
          </label>
          <div className="relative">
            <select
              value={selectedActivityId}
              onChange={(e) => onSelectActivity(e.target.value)}
              className="w-full appearance-none bg-slate-50 hover:bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 pr-8 shadow-2xs text-slate-800 font-medium cursor-pointer transition-colors focus:ring-1 focus:ring-sky-600 focus:outline-none truncate"
            >
              {activities.map((act) => (
                <option key={act.id} value={act.id}>
                  {act.shortName}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[16px] text-slate-400">
              expand_more
            </span>
          </div>
        </div>

        {/* 4. Survey Selector */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-slate-400">
              assignment
            </span>
            แบบสอบถาม (Survey Selector)
          </label>
          <div className="relative">
            <select
              value={survey}
              onChange={(e) => setSurvey(e.target.value)}
              className="w-full appearance-none bg-slate-50 hover:bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 pr-8 shadow-2xs text-slate-800 font-medium cursor-pointer transition-colors focus:ring-1 focus:ring-sky-600 focus:outline-none truncate"
            >
              {surveys.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[16px] text-slate-400">
              expand_more
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
