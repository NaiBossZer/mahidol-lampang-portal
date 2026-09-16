import React from 'react';
import { Activity } from '../types';

interface RecentActivitiesTableProps {
  activities: Activity[];
  selectedActivityId: string;
  onSelectActivity: (id: string) => void;
}

export const RecentActivitiesTable: React.FC<RecentActivitiesTableProps> = ({
  activities,
  selectedActivityId,
  onSelectActivity,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-3.5">
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-[14px] font-bold text-slate-900">กิจกรรมล่าสุด</h3>
        <span className="text-[10px] text-slate-400">คลิกแถวเพื่อดูข้อมูล</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-[11px]">
          <thead>
            <tr className="text-slate-400 border-b border-slate-100 font-medium">
              <th className="pb-1.5 font-normal">กิจกรรม</th>
              <th className="pb-1.5 font-normal">วันที่จัดกิจกรรม</th>
              <th className="pb-1.5 font-normal text-center">ผู้เข้าร่วม</th>
              <th className="pb-1.5 font-normal text-center">ผู้ตอบ</th>
              <th className="pb-1.5 font-normal text-right">คะแนนเฉลี่ย</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-slate-700">
            {activities.map((act) => {
              const isSelected = act.id === selectedActivityId;
              return (
                <tr
                  key={act.id}
                  onClick={() => onSelectActivity(act.id)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'bg-sky-50/70 font-medium' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="py-2.5 pr-2 flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0 ${act.codeColor}`}
                    >
                      {act.code}
                    </span>
                    <span className="text-slate-900 truncate max-w-[120px] sm:max-w-[140px] font-medium" title={act.name}>
                      {act.name}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-500 whitespace-nowrap">
                    {act.date}
                  </td>
                  <td className="py-2.5 text-center font-medium">
                    {act.participants}
                  </td>
                  <td className="py-2.5 text-center font-medium">
                    {act.respondents}
                  </td>
                  <td className="py-2.5 text-right font-bold text-slate-900">
                    {act.avgScore.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
