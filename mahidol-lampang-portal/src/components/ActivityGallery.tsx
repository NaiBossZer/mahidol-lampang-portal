import React from 'react';
import { Activity } from '../types';

interface ActivityGalleryProps {
  activity: Activity;
  onViewAllPhotos: () => void;
  onOpenPhoto: (photoUrl: string) => void;
}

export const ActivityGallery: React.FC<ActivityGalleryProps> = ({
  activity,
  onViewAllPhotos,
  onOpenPhoto,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-3.5">
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-[14px] font-bold text-slate-900">ภาพกิจกรรมล่าสุด</h3>
        <button
          type="button"
          onClick={onViewAllPhotos}
          className="text-[11px] text-sky-600 hover:text-sky-700 font-medium flex items-center gap-0.5 cursor-pointer hover:underline"
        >
          <span>ดูทั้งหมด</span>
          <span className="material-symbols-outlined text-[14px]">
            arrow_forward
          </span>
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {activity.photos.slice(0, 4).map((photo, idx) => (
          <div
            key={idx}
            onClick={() => onOpenPhoto(photo)}
            className="group relative w-full h-14 rounded-md overflow-hidden bg-slate-100 cursor-pointer shadow-2xs border border-slate-100"
          >
            <img
              alt={`ภาพกิจกรรม ${idx + 1}`}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
              src={photo}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="material-symbols-outlined text-white text-[16px]">
                visibility
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
