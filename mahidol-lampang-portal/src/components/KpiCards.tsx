import React from 'react';
import { Activity } from '../types';

interface KpiCardsProps {
  activity: Activity;
  onViewDetails: (metricName: string) => void;
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  activity,
  onViewDetails,
}) => {
  const formatChange = (val: number, isScore = false) => {
    const isPositive = val >= 0;
    return {
      text: `${Math.abs(val)}${isScore ? '' : '%'}`,
      isPositive,
      icon: isPositive ? 'arrow_upward' : 'arrow_downward',
    };
  };

  const cards = [
    {
      id: 'participants',
      title: 'ผู้เข้าร่วมกิจกรรม',
      value: activity.participants,
      unit: 'คน',
      icon: 'group',
      iconBg: 'bg-sky-50 text-sky-600',
      change: formatChange(activity.monthlyChanges.participantsChange),
    },
    {
      id: 'respondents',
      title: 'ผู้ตอบแบบประเมิน',
      value: activity.respondents,
      unit: 'คน',
      icon: 'assignment_turned_in',
      iconBg: 'bg-indigo-50 text-indigo-600',
      change: formatChange(activity.monthlyChanges.respondentsChange),
    },
    {
      id: 'unresponded',
      title: 'ยังไม่ได้ตอบ',
      value: activity.unresponded,
      unit: 'คน',
      icon: 'hourglass_top',
      iconBg: 'bg-purple-50 text-purple-600',
      change: formatChange(activity.monthlyChanges.unrespondedChange),
    },
    {
      id: 'responseRate',
      title: 'อัตราการตอบกลับ',
      value: `${activity.responseRate}%`,
      unit: '',
      icon: 'percent',
      iconBg: 'bg-teal-50 text-teal-600',
      change: formatChange(activity.monthlyChanges.responseRateChange),
    },
    {
      id: 'avgScore',
      title: 'คะแนนประเมินเฉลี่ย',
      value: activity.avgScore.toFixed(2),
      unit: `/ ${activity.maxScore.toFixed(2)}`,
      icon: 'star',
      iconBg: 'bg-amber-50 text-amber-500',
      change: formatChange(activity.monthlyChanges.scoreChange, true),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {cards.map((card) => (
        <div
          key={card.id}
          className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-[12px] text-slate-500 font-medium">
                {card.title}
              </div>
              <div className="text-[24px] font-bold text-slate-900 mt-0.5 leading-none">
                {card.value}{' '}
                {card.unit && (
                  <span className="text-[13px] font-normal text-slate-500">
                    {card.unit}
                  </span>
                )}
              </div>
            </div>

            <div
              className={`w-9 h-9 rounded-full ${card.iconBg} flex items-center justify-center shrink-0`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {card.icon}
              </span>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <div
              className={`font-medium flex items-center gap-0.5 ${
                card.change.isPositive ? 'text-emerald-600' : 'text-emerald-600'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {card.change.icon}
              </span>
              <span>{card.change.text}</span>
              <span className="text-slate-400 font-normal ml-0.5">
                จากเดือนที่แล้ว
              </span>
            </div>

            <button
              type="button"
              onClick={() => onViewDetails(card.title)}
              className="text-sky-600 hover:text-sky-700 font-medium flex items-center gap-0.5 cursor-pointer ml-1"
            >
              <span>ดูรายละเอียด</span>
              <span className="material-symbols-outlined text-[12px]">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
