import React from 'react';
import { Activity } from '../types';

interface AspectScoresProps {
  activity: Activity;
}

export const AspectScores: React.FC<AspectScoresProps> = ({ activity }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-3.5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[14px] font-bold text-slate-900">
          คะแนนประเมินรายด้าน
        </h3>
        <span className="text-[11px] text-slate-400 font-medium">
          สเกล 1–5 คะแนน
        </span>
      </div>

      <div className="space-y-3.5 text-[12px]">
        {activity.aspects.map((aspect) => (
          <div key={aspect.id}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-700 truncate pr-2 font-medium">
                {aspect.title}
              </span>
              <span className="font-bold text-slate-900 shrink-0">
                {aspect.score.toFixed(2)}{' '}
                <span className="text-[11px] font-normal text-slate-400">
                  / 5.00
                </span>
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-sky-600 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${aspect.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
