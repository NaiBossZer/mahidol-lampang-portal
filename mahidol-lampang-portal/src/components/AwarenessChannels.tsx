import React from 'react';
import { Activity } from '../types';

interface AwarenessChannelsProps {
  activity: Activity;
}

export const AwarenessChannels: React.FC<AwarenessChannelsProps> = ({
  activity,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-3.5 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sky-600 text-[18px]">
            campaign
          </span>
          <h3 className="text-[14px] font-bold text-slate-900">
            ช่องทางการรับรู้กิจกรรม
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">หลายคำตอบ</span>
      </div>

      <div className="space-y-3 text-[11px]">
        {activity.awarenessChannels.map((channel, idx) => {
          return (
            <div key={idx} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 w-28 shrink-0">
                {channel.iconType === 'facebook' && (
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                    f
                  </span>
                )}
                {channel.iconType === 'line' && (
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px]">
                    L
                  </span>
                )}
                {channel.iconType === 'website' && (
                  <span className="w-5 h-5 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[13px]">
                      language
                    </span>
                  </span>
                )}
                {channel.iconType === 'other' && (
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[13px]">
                      more_horiz
                    </span>
                  </span>
                )}
                <span className="text-slate-700 font-medium truncate">
                  {channel.name}
                </span>
              </div>

              <div className="flex-1 mx-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                    channel.iconType === 'line'
                      ? 'bg-emerald-500'
                      : channel.iconType === 'website'
                      ? 'bg-sky-400'
                      : channel.iconType === 'other'
                      ? 'bg-slate-300'
                      : 'bg-sky-600'
                  }`}
                  style={{ width: `${channel.percentage}%` }}
                />
              </div>

              <span className="font-semibold text-slate-800 w-16 text-right shrink-0">
                {channel.count} คน{' '}
                <span className="text-slate-400 text-[10px] font-normal">
                  ({channel.percentage.toFixed(1)}%)
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
