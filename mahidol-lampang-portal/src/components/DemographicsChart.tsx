import React, { useState } from 'react';
import { Activity, DemographicItem } from '../types';

interface DemographicsChartProps {
  activity: Activity;
}

export const DemographicsChart: React.FC<DemographicsChartProps> = ({
  activity,
}) => {
  const [selectedDimension, setSelectedDimension] = useState<
    'age' | 'gender' | 'status'
  >('age');

  let items: DemographicItem[] = activity.ageDemographics;
  let dimensionLabel = 'ช่วงอายุ';

  if (selectedDimension === 'gender') {
    items = activity.genderDemographics;
    dimensionLabel = 'เพศ';
  } else if (selectedDimension === 'status') {
    items = activity.statusDemographics;
    dimensionLabel = 'สถานะ';
  }

  // Calculate SVG donut segments
  // circumference is 100 on radius 15.9155
  let cumulativeOffset = 0;
  const segments = items.map((item) => {
    const dashLength = item.percentage;
    const offset = -cumulativeOffset;
    cumulativeOffset += item.percentage;
    return {
      ...item,
      dasharray: `${dashLength.toFixed(1)}, 100`,
      dashoffset: offset.toFixed(1),
    };
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-3.5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[14px] font-bold text-slate-900">
          ข้อมูลทั่วไปของผู้ตอบแบบสอบถาม
        </h3>

        <div className="relative">
          <select
            value={selectedDimension}
            onChange={(e) =>
              setSelectedDimension(e.target.value as 'age' | 'gender' | 'status')
            }
            className="bg-slate-50 hover:bg-white border border-slate-200 rounded-md text-[11px] py-1 pl-2 pr-6 text-slate-700 font-medium focus:ring-1 focus:ring-sky-600 focus:outline-none cursor-pointer appearance-none shadow-2xs"
          >
            <option value="age">ช่วงอายุ</option>
            <option value="gender">เพศ</option>
            <option value="status">สถานะ</option>
          </select>
          <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[14px] text-slate-400">
            expand_more
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 py-1">
        {/* Donut Chart */}
        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-100"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
            />
            {segments.map((seg, idx) => {
              if (seg.percentage <= 0) return null;
              return (
                <path
                  key={idx}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="4"
                  strokeDasharray={seg.dasharray}
                  strokeDashoffset={seg.dashoffset}
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] text-slate-400 leading-tight">
              {dimensionLabel}
            </span>
            <span className="text-[13px] font-bold text-slate-900 leading-tight">
              {activity.respondents} คน
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="space-y-1.5 text-[11px] flex-1">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 truncate max-w-[130px]">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-600 truncate">{item.label}</span>
              </div>
              <span className="font-medium text-slate-700 shrink-0 ml-1">
                {item.count} คน{' '}
                <span className="text-slate-400 text-[10px]">
                  ({item.percentage.toFixed(1)}%)
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
