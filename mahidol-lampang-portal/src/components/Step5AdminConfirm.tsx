import React, { useState } from 'react';
import { OfficialDocument, AiGeneratedSurvey, Project } from '../types';

interface Step5AdminConfirmProps {
  project: Project;
  activityName: string;
  activityCode: string;
  activityDate: string;
  location: string;
  documents: OfficialDocument[];
  survey: AiGeneratedSurvey;
  onConfirmAndAssign: () => void;
  onBackToStep4: () => void;
}

export const Step5AdminConfirm: React.FC<Step5AdminConfirmProps> = ({
  project,
  activityName,
  activityCode,
  activityDate,
  location,
  documents,
  survey,
  onConfirmAndAssign,
  onBackToStep4,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirmAndAssign();
    }, 600);
  };

  const totalQuestions = survey.sections.reduce(
    (acc, s) => acc + s.questions.length,
    0
  );

  return (
    <div className="space-y-4">
      {/* Step Header */}
      <div className="bg-emerald-800 text-white rounded-xl p-4 shadow-sm border border-emerald-600/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px] text-emerald-200">
                task_alt
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 text-emerald-100 px-2 py-0.5 rounded">
                  STEP 5: ADMIN CONFIRMATION
                </span>
                <span className="text-[12px] text-emerald-100">
                  กิจกรรม: <strong className="text-white">{activityName}</strong>
                </span>
              </div>
              <h2 className="text-[16px] font-bold text-white mt-1">
                ADMIN ยืนยัน และ นำแบบสอบถามไปผูกกับกิจกรรม
              </h2>
              <p className="text-[12px] text-emerald-100/90 mt-0.5">
                ขั้นตอนสุดท้าย: ยืนยันการผูกแบบสอบถามที่ผ่านการทวนแล้วเข้ากับกิจกรรม เพื่อส่งต่อให้กิจกรรมและพร้อมเปิดรับผลการประเมิน
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <span className="text-[11px] px-2.5 py-1 rounded-full font-bold bg-white text-emerald-800 shadow-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">verified</span>
              พร้อมยืนยัน (Ready to Assign)
            </span>
          </div>
        </div>
      </div>

      {/* Confirmation Summary Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-5">
        <div className="pb-3 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-[20px]">
              assignment_turned_in
            </span>
            สรุปข้อมูลการผูกแบบสอบถามเข้ากับกิจกรรม (Assignment Summary)
          </h3>
          <p className="text-[12px] text-slate-500 mt-0.5">
            โปรดตรวจสอบข้อมูลสรุปก่อนกดยืนยันเพื่อผูกแบบสอบถามเข้าสู่ระบบกิจกรรม
          </p>
        </div>

        {/* 3 Summary Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Block 1: Activity Info */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-sky-600">
                event
              </span>
              ข้อมูลกิจกรรม
            </div>
            <div className="text-[13px] font-bold text-slate-900">
              {activityName}
            </div>
            <div className="text-[11px] text-slate-600 space-y-0.5">
              <div>รหัส: <span className="font-semibold text-slate-800">{activityCode}</span></div>
              <div>โครงการ: {project.name}</div>
              <div>วันที่: {activityDate}</div>
              <div>สถานที่: {location}</div>
            </div>
          </div>

          {/* Block 2: Official Documents */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-purple-600">
                description
              </span>
              เอกสารราชการที่ตรวจแล้ว
            </div>
            <div className="text-[13px] font-bold text-slate-900">
              {documents.length} ฉบับ (ผ่านการวิเคราะห์โดย AI)
            </div>
            <div className="space-y-1 text-[11px] text-slate-600">
              {documents.map((d) => (
                <div key={d.id} className="flex items-center gap-1.5 truncate">
                  <span className="material-symbols-outlined text-[14px] text-rose-500 shrink-0">
                    picture_as_pdf
                  </span>
                  <span className="truncate">{d.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Block 3: Survey Details */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-emerald-600">
                quiz
              </span>
              แบบสอบถามที่ยืนยัน
            </div>
            <div className="text-[13px] font-bold text-slate-900">
              {survey.surveyTitle}
            </div>
            <div className="text-[11px] text-slate-600 space-y-0.5">
              <div>โครงสร้าง: <span className="font-semibold text-slate-800">3 ตอน ({totalQuestions} ข้อคำถาม)</span></div>
              <div>สเกล: <span className="font-semibold text-slate-800">Likert 1–5 คะแนน</span></div>
              <div>สถานะทวนสอบ: <span className="text-emerald-600 font-semibold">ADMIN ทวนแล้วเรียบร้อย</span></div>
            </div>
          </div>
        </div>

        {/* Essential Business Note Callout */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-[12px] space-y-1 text-amber-900">
          <div className="font-bold flex items-center gap-1.5 text-amber-950">
            <span className="material-symbols-outlined text-[18px] text-amber-700">
              verified_user
            </span>
            คำชี้แจงตาม Business Workflow:
          </div>
          <p className="text-amber-800 leading-relaxed text-[11px]">
            การกด <strong>"ยืนยันและส่งแบบสอบถามไปยังกิจกรรม"</strong> หมายถึงการนำ Survey ไปผูกกับกิจกรรมที่ตั้งไว้โดยสมบูรณ์ เพื่อเปิดให้ผู้เข้าร่วมตอบแบบประเมินและประมวลผลสถิติลงสู่ Executive Dashboard ต่อไป
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToStep4}
            className="px-3 py-1.5 text-[12px] font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>ย้อนกลับไปดูผลการทวนสอบ</span>
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleConfirm}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[13px] font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">
                  sync
                </span>
                <span>กำลังผูกแบบสอบถามเข้ากับกิจกรรม...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">
                  task_alt
                </span>
                <span>ยืนยันและส่งแบบสอบถามไปยังกิจกรรมที่ตั้งไว้ (Complete Workflow)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
