import React, { useState } from 'react';
import { Activity } from '../types';

interface AllCommentsModalProps {
  isOpen: boolean;
  activity: Activity;
  onClose: () => void;
}

export const AllCommentsModal: React.FC<AllCommentsModalProps> = ({
  isOpen,
  activity,
  onClose,
}) => {
  const [filter, setFilter] = useState<'all' | 'positive' | 'suggestion' | 'neutral'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredComments = activity.comments.filter((c) => {
    const matchesFilter = filter === 'all' ? true : c.sentiment === filter;
    const matchesSearch = c.text.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[85vh] overflow-hidden text-slate-800">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sky-600 text-[20px]">
              forum
            </span>
            <div>
              <h2 className="text-[15px] font-bold text-slate-900">
                ความคิดเห็นและข้อเสนอแนะทั้งหมด
              </h2>
              <div className="text-[11px] text-slate-500">
                {activity.name} • {activity.comments.length} ความคิดเห็น
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-3.5 border-b border-slate-100 bg-white flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <span className="material-symbols-outlined text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px]">
              search
            </span>
            <input
              type="text"
              placeholder="ค้นหาข้อความ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-[12px] border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-600"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              ทั้งหมด ({activity.comments.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('positive')}
              className={`px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'positive'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              ชื่นชม ({activity.comments.filter((c) => c.sentiment === 'positive').length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('suggestion')}
              className={`px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'suggestion'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              ข้อเสนอแนะ ({activity.comments.filter((c) => c.sentiment === 'suggestion').length})
            </button>
          </div>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredComments.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-[13px]">
              ไม่พบความคิดเห็นที่ตรงกับการค้นหา
            </div>
          ) : (
            filteredComments.map((c) => (
              <div
                key={c.id}
                className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-700">
                    {c.author}
                  </span>
                  <span className="text-[10px] text-slate-400">{c.date}</span>
                </div>
                <p className="text-[12px] text-slate-800 leading-relaxed">
                  "{c.text}"
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[12px] font-medium transition-colors"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
