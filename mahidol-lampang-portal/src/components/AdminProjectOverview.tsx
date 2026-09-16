import React from 'react';
import { Project, AdminActivityItem } from '../types';

interface AdminProjectOverviewProps {
  project: Project;
  activities: AdminActivityItem[];
  onSelectActivity: (activity: AdminActivityItem) => void;
  onCreateActivity: () => void;
  onGoToAnalytics: (activityId: string) => void;
}

export const AdminProjectOverview: React.FC<AdminProjectOverviewProps> = ({
  project,
  activities,
  onSelectActivity,
  onCreateActivity,
  onGoToAnalytics,
}) => {
  const totalAssigned = activities.filter(
    (a) => a.status === 'survey_assigned'
  ).length;

  const totalDocs = activities.reduce(
    (acc, a) => acc + a.officialDocs.length,
    0
  );

  return (
    <div className="space-y-4">
      {/* Project Header Banner */}
      <div className="bg-[#0c2340] text-white rounded-xl p-5 shadow-sm border border-white/10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30 uppercase tracking-wide">
                โครงการยุทธศาสตร์ ปีงบประมาณ {project.fiscalYear}
              </span>
              <span className="text-[11px] text-slate-300">
                รหัสโครงการ: <strong className="text-white">{project.code}</strong>
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-medium">
                อนุมัติและเปิดดำเนินการ
              </span>
            </div>

            <h1 className="text-[20px] font-bold text-white tracking-tight leading-snug">
              {project.name}
            </h1>

            <p className="text-[12px] text-slate-300 line-clamp-2">
              {project.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-300 pt-1">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-sky-400">
                  domain
                </span>
                {project.faculty} • {project.campus}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-emerald-400">
                  payments
                </span>
                งบประมาณ: <strong>{project.budget.toLocaleString()} บาท</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onCreateActivity}
              className="w-full sm:w-auto px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-[13px] flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>+ สร้างกิจกรรมใหม่ (AI Workflow)</span>
            </button>
            <span className="text-[11px] text-slate-400">
              สร้างกิจกรรม &gt; AI วิเคราะห์เอกสาร &gt; ทวน &gt; ยืนยันผูก Survey
            </span>
          </div>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">กิจกรรมทั้งหมด</span>
            <span className="material-symbols-outlined text-[18px] text-sky-600">
              event_available
            </span>
          </div>
          <div className="text-[22px] font-bold text-slate-900">
            {activities.length} <span className="text-[12px] font-normal text-slate-500">กิจกรรม</span>
          </div>
          <div className="text-[10px] text-slate-400">ภายใต้โครงการนี้</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">เอกสารราชการที่ตรวจแล้ว</span>
            <span className="material-symbols-outlined text-[18px] text-purple-600">
              description
            </span>
          </div>
          <div className="text-[22px] font-bold text-purple-900">
            {totalDocs} <span className="text-[12px] font-normal text-slate-500">ฉบับ</span>
          </div>
          <div className="text-[10px] text-emerald-600 font-medium">AI ตรวจสอบครบถ้วน</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">ผูก Survey สำเร็จ</span>
            <span className="material-symbols-outlined text-[18px] text-emerald-600">
              task_alt
            </span>
          </div>
          <div className="text-[22px] font-bold text-emerald-600">
            {totalAssigned} <span className="text-[12px] font-normal text-slate-500">/{activities.length}</span>
          </div>
          <div className="text-[10px] text-slate-400">พร้อมเปิดรับคำตอบ</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">ระบบ AI Assistant</span>
            <span className="material-symbols-outlined text-[18px] text-indigo-600">
              psychology
            </span>
          </div>
          <div className="text-[22px] font-bold text-indigo-900 flex items-center gap-1.5">
            Active
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <div className="text-[10px] text-slate-400">พร้อมช่วยสกัดเอกสาร</div>
        </div>
      </div>

      {/* Activities Table Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-4 py-3.5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-[14px] font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-sky-700 text-[18px]">
                format_list_bulleted
              </span>
              รายการกิจกรรมและสถานะ Workflow ({activities.length})
            </h3>
            <p className="text-[11px] text-slate-500">
              แสดงสถานะการดำเนินงานของแต่ละกิจกรรม และสถานะการผูกแบบสอบถาม AI
            </p>
          </div>

          <button
            type="button"
            onClick={onCreateActivity}
            className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>สร้างกิจกรรมใหม่</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-2.5 px-4">รหัส & ชื่อกิจกรรม</th>
                <th className="py-2.5 px-3">วันที่จัด</th>
                <th className="py-2.5 px-3">เอกสารราชการ</th>
                <th className="py-2.5 px-3">แบบสอบถาม (Survey)</th>
                <th className="py-2.5 px-3">สถานะ Workflow</th>
                <th className="py-2.5 px-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activities.map((act) => {
                const isAssigned = act.status === 'survey_assigned';

                return (
                  <tr
                    key={act.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">
                        {act.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {act.code} • {act.faculty}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      {act.date}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1 text-[11px] text-slate-700 font-medium">
                        <span className="material-symbols-outlined text-rose-500 text-[16px]">
                          picture_as_pdf
                        </span>
                        <span>{act.officialDocs.length} ฉบับ</span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      {act.survey ? (
                        <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px]">
                            task_alt
                          </span>
                          <span>ผูกแล้ว ({act.survey.sections.length} ตอน)</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">ยังไม่ผูก</span>
                      )}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      {act.status === 'published' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <span className="material-symbols-outlined text-[13px] text-emerald-600">verified</span>
                          <span>เผยแพร่เว็บไซต์แล้ว</span>
                        </span>
                      ) : act.status === 'ready_to_publish' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-300">
                          <span className="material-symbols-outlined text-[13px] text-sky-600">visibility</span>
                          <span>พร้อมเผยแพร่</span>
                        </span>
                      ) : act.status === 'drafting_report' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
                          <span className="material-symbols-outlined text-[13px] text-purple-600">edit_note</span>
                          <span>รอทำข่าว/รายงาน</span>
                        </span>
                      ) : act.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          <span className="material-symbols-outlined text-[13px] text-amber-600">flag</span>
                          <span>เสร็จสิ้นโครงการ</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-600 animate-pulse" />
                          <span>{act.statusLabel || 'ดำเนินกิจกรรม'}</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSelectActivity(act)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          {act.status === 'published' ? 'ดูข่าว/เว็บ' : act.status === 'drafting_report' ? 'ทำข่าว AI' : 'รายละเอียด'}
                        </button>

                        <button
                          type="button"
                          onClick={() => onGoToAnalytics(act.id)}
                          className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[13px]">
                            analytics
                          </span>
                          <span>สถิติ</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
