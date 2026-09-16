import React, { useState } from 'react';
import { Activity } from '../types';

interface ScoreDistributionProps {
  activity: Activity;
}

export const ScoreDistribution: React.FC<ScoreDistributionProps> = ({
  activity,
}) => {
  const [distView, setDistView] = useState<'overall' | 'aspects'>('overall');

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-3.5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[14px] font-bold text-slate-900">การกระจายคะแนน</h3>

        <div className="relative">
          <select
            value={distView}
            onChange={(e) => setDistView(e.target.value as 'overall' | 'aspects')}
            className="bg-slate-50 hover:bg-white border border-slate-200 rounded-md text-[11px] py-0.5 pl-2 pr-6 text-slate-700 font-medium focus:ring-1 focus:ring-sky-600 focus:outline-none cursor-pointer appearance-none shadow-2xs"
          >
            <option value="overall">คะแนนโดยรวม</option>
            <option value="aspects">รายด้าน</option>
          </select>
          <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[14px] text-slate-400">
            expand_more
          </span>
        </div>
      </div>

      <div className="space-y-2 text-[11px]">
        {activity.scoreDistribution.map((item) => {
          let barColor = 'bg-slate-300';
          if (item.score === 5) barColor = 'bg-sky-600';
          else if (item.score === 4) barColor = 'bg-sky-500';
          else if (item.score === 3) barColor = 'bg-sky-400';
          else if (item.score === 2) barColor = 'bg-amber-400';
          else if (item.score === 1) barColor = 'bg-rose-400';

          return (
            <div key={item.score} className="flex items-center gap-2">
              <span className="w-12 shrink-0 text-slate-600 font-medium">
                {item.score} คะแนน
              </span>
              <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className={`${barColor} h-full rounded-full transition-all duration-700 ease-out`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="font-medium text-slate-800 text-right w-16 shrink-0">
                {item.count} คน{' '}
                <span className="text-slate-400 text-[10px] font-normal">
                  ({item.percentage.toFixed(1)}%)
                </span>
              </span>
            </div>
          );
        })}
      </div>

      {/* Green Banner Result */}
      <div className="mt-3.5 bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 flex items-center gap-2.5 text-emerald-900 text-[11px]">
        <span className="material-symbols-outlined text-emerald-600 text-[20px] shrink-0">
          verified
        </span>
        <div>
          <div>
            คะแนนเฉลี่ยโดยรวม{' '}
            <strong className="font-bold text-emerald-950">
              {activity.avgScore.toFixed(2)} / {activity.maxScore.toFixed(2)}
            </strong>
          </div>
          <div className="text-[10px] text-emerald-700 mt-0.5">
            จากผู้ตอบ {activity.respondents} คน
          </div>
        </div>
      </div>
    </div>
  );
};
