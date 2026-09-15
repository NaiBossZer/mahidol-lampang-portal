import React from 'react';
import { Activity } from '../types';

interface FeedbackCommentsProps {
  activity: Activity;
  onViewAllComments: () => void;
}

export const FeedbackComments: React.FC<FeedbackCommentsProps> = ({
  activity,
  onViewAllComments,
}) => {
  return (
    <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-slate-500 text-[16px]">
            chat
          </span>
          <h3 className="text-[13px] font-bold text-slate-900">
            ความคิดเห็นจากผู้ตอบ
          </h3>
        </div>
        <button
          type="button"
          onClick={onViewAllComments}
          className="text-[10px] text-sky-600 hover:text-sky-800 font-medium hover:underline cursor-pointer"
        >
          ดูทั้งหมด →
        </button>
      </div>

      <div className="space-y-2 text-[11px]">
        {activity.comments.slice(0, 3).map((comment) => (
          <div
            key={comment.id}
            className="p-2 px-2.5 bg-slate-50 rounded-lg border border-slate-100 leading-snug"
          >
            <p className="text-slate-700 italic truncate" title={comment.text}>
              "{comment.text}"
            </p>
            <div className="text-[9px] text-slate-400 mt-1">
              {comment.date} • {comment.author}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
