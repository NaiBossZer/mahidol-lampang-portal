import React from 'react';
import { Activity } from '../types';

interface HeroBannerProps {
  activity: Activity;
  onOpenImage: (url: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  activity,
  onOpenImage,
}) => {
  return (
    <div className="bg-white rounded-xl p-3 sm:p-3.5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-4">
      {/* Banner Landscape Thumbnail with click to preview */}
      <div
        onClick={() => onOpenImage(activity.bannerImage)}
        className="group w-full md:w-56 h-28 rounded-lg overflow-hidden shrink-0 relative bg-slate-100 cursor-pointer shadow-2xs"
        title="คลิกเพื่อดูภาพขยาย"
      >
        <img
          alt={activity.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          src={activity.bannerImage}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="material-symbols-outlined text-white text-[24px]">
            zoom_in
          </span>
        </div>
      </div>

      {/* Banner Information */}
      <div className="flex-1 min-w-0">
        <div className="text-[12px] text-sky-700 font-semibold tracking-wide flex items-center flex-wrap gap-1">
          <span>{activity.faculty}</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 font-normal">{activity.campus}</span>
        </div>

        <h2 className="text-[18px] font-bold text-slate-900 mt-1 tracking-tight truncate">
          {activity.name}
        </h2>

        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-5 text-[12px] text-slate-600 mt-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-slate-400">
              calendar_today
            </span>
            <span>
              วันที่จัดกิจกรรม:{' '}
              <strong className="font-semibold text-slate-800">
                {activity.date}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-slate-400">
              description
            </span>
            <span className="truncate max-w-[320px]">
              แบบประเมิน:{' '}
              <strong className="font-semibold text-slate-800">
                {activity.surveyName}
              </strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
