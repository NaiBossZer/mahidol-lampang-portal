import React, { useState } from 'react';
import { AiGeneratedSurvey } from '../types';

interface Step4AdminReviewSurveyProps {
  activityName: string;
  survey: AiGeneratedSurvey;
  onProceedToStep5: () => void;
  onBackToStep3: () => void;
}

export const Step4AdminReviewSurvey: React.FC<Step4AdminReviewSurveyProps> = ({
  activityName,
  survey,
  onProceedToStep5,
  onBackToStep3,
}) => {
  const [checklist, setChecklist] = useState({
    objectivesCovered: true,
    scaleStandard: true,
    targetAudienceMatch: true,
    feedbackAllowed: true,
  });

  const allChecked = Object.values(checklist).every(Boolean);

  return (
    <div className="space-y-4">
      {/* ADMIN Role Banner */}
      <div className="bg-[#0c2340] text-white rounded-xl p-4 shadow-sm border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px] text-sky-300">
                fact_check
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 text-sky-200 px-2 py-0.5 rounded">
                  STEP 4: ADMIN ACTION
                </span>
                <span className="text-[12px] text-slate-300">
                  กิจกรรม: <strong className="text-white">{activityName}</strong>
                </span>
              </div>
              <h2 className="text-[16px] font-bold text-white mt-1">
                ADMIN ทวนแบบสอบถาม (Survey Review)
              </h2>
              <p className="text-[12px] text-slate-300 mt-0.5">
                ADMIN ตรวจสอบข้อคำถามและสเกลการประเมินที่ AI สร้างขึ้นจากเอกสารราชการ ก่อนเข้าสู่ขั้นตอนยืนยัน
              </p>
            </div>
          </div>

          <div className="bg-amber-400/20 border border-amber-300/30 rounded-lg p-2.5 max-w-xs text-[11px] text-amber-200 shrink-0">
            <div className="font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">info</span>
              กติกากระบวนการ (Workflow Rule):
            </div>
            <div className="text-[10px] text-amber-100/90 mt-0.5 leading-snug">
              ใน Workflow นี้ไม่มีขั้นตอนแก้ไข เมื่อ ADMIN ทวนเสร็จจะเข้าสู่ STEP 5 เพื่อยืนยันและนำไปผูกกับกิจกรรม
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: ADMIN Review Checklist & Guidelines (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
            <div className="pb-2 border-b border-slate-100">
              <h3 className="text-[13px] font-bold text-slate-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sky-700 text-[18px]">
                  checklist
                </span>
                รายการทวนสอบของ ADMIN
              </h3>
              <p className="text-[11px] text-slate-500">
                ทำเครื่องหมายเพื่อยืนยันว่าได้ทวนประเด็นหลักแล้ว
              </p>
            </div>

            <div className="space-y-2.5 text-[12px]">
              <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-200">
                <input
                  type="checkbox"
                  checked={checklist.objectivesCovered}
                  onChange={(e) =>
                    setChecklist({ ...checklist, objectivesCovered: e.target.checked })
                  }
                  className="mt-0.5 rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                />
                <div className="text-slate-700 leading-snug">
                  <span className="font-semibold text-slate-900">
                    ความครอบคลุมวัตถุประสงค์:
                  </span>{' '}
                  ข้อคำถามตรงตามวัตถุประสงค์และตัวชี้วัดในบันทึกข้อความ
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-200">
                <input
                  type="checkbox"
                  checked={checklist.scaleStandard}
                  onChange={(e) =>
                    setChecklist({ ...checklist, scaleStandard: e.target.checked })
                  }
                  className="mt-0.5 rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                />
                <div className="text-slate-700 leading-snug">
                  <span className="font-semibold text-slate-900">
                    มาตรฐานสเกล 1–5:
                  </span>{' '}
                  ระดับคะแนนความพึงพอใจถูกต้องตามเกณฑ์สถิติมหาวิทยาลัย
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-200">
                <input
                  type="checkbox"
                  checked={checklist.targetAudienceMatch}
                  onChange={(e) =>
                    setChecklist({ ...checklist, targetAudienceMatch: e.target.checked })
                  }
                  className="mt-0.5 rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                />
                <div className="text-slate-700 leading-snug">
                  <span className="font-semibold text-slate-900">
                    กลุ่มเป้าหมายผู้ตอบ:
                  </span>{' '}
                  ตัวเลือกกลุ่มผู้เข้าร่วมตรงตามที่ระบุในโครงการ TOR
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-200">
                <input
                  type="checkbox"
                  checked={checklist.feedbackAllowed}
                  onChange={(e) =>
                    setChecklist({ ...checklist, feedbackAllowed: e.target.checked })
                  }
                  className="mt-0.5 rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                />
                <div className="text-slate-700 leading-snug">
                  <span className="font-semibold text-slate-900">
                    ช่องรับฟังข้อเสนอแนะ:
                  </span>{' '}
                  มีคำถามปลายเปิดเพื่อนำความคิดเห็นไปปรับปรุงการทำงาน
                </div>
              </label>
            </div>
          </div>

          {/* AI Metadata Box */}
          <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-[11px] space-y-1.5">
            <div className="font-bold text-purple-900 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-purple-700">
                auto_awesome
              </span>
              AI Citation Integrity
            </div>
            <p className="text-purple-800 leading-relaxed">
              AI ได้ผูกโยงแหล่งที่มาในเอกสารราชการ (Citations) กำกับไว้ในทุกข้อคำถาม เพื่อให้ ADMIN ตรวจสอบความถูกต้องได้อย่างโปร่งใส
            </p>
          </div>
        </div>

        {/* Right: Full Survey Review View (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-[14px] font-bold text-slate-900">
                {survey.surveyTitle}
              </h3>
              <div className="text-[11px] text-slate-500 mt-0.5">
                สเกลที่ใช้: <span className="font-semibold text-slate-700">{survey.scaleType}</span>
              </div>
            </div>

            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
              สถานะ: รอ ADMIN ทวนสอบ
            </span>
          </div>

          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
            {survey.sections.map((section, sIdx) => (
              <div
                key={section.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/40 space-y-3"
              >
                <div className="pb-1 border-b border-slate-200">
                  <h4 className="text-[13px] font-bold text-slate-900">
                    {section.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {section.description}
                  </p>
                </div>

                <div className="space-y-2.5">
                  {section.questions.map((q, qIdx) => (
                    <div
                      key={q.id}
                      className="p-3 rounded-lg bg-white border border-slate-200 text-[12px] space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-slate-800">
                          ข้อ {qIdx + 1}. {q.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-slate-100 text-slate-600 shrink-0">
                          {q.questionType === 'likert5' ? 'มาตราส่วน 5 ระดับ' : 'ระบุคำตอบ'}
                        </span>
                      </div>

                      {/* Visual 1-5 Likert buttons preview */}
                      {q.questionType === 'likert5' && (
                        <div className="grid grid-cols-5 gap-1.5 pt-1 text-center text-[10px]">
                          <div className="p-1.5 rounded bg-slate-50 border border-slate-200 text-slate-600">
                            1: น้อยที่สุด
                          </div>
                          <div className="p-1.5 rounded bg-slate-50 border border-slate-200 text-slate-600">
                            2: น้อย
                          </div>
                          <div className="p-1.5 rounded bg-slate-50 border border-slate-200 text-slate-600">
                            3: ปานกลาง
                          </div>
                          <div className="p-1.5 rounded bg-slate-50 border border-slate-200 text-slate-600">
                            4: มาก
                          </div>
                          <div className="p-1.5 rounded bg-sky-50 border border-sky-200 text-sky-800 font-semibold">
                            5: มากที่สุด
                          </div>
                        </div>
                      )}

                      {/* Source Citation badge */}
                      <div className="text-[10px] text-purple-700 bg-purple-50 px-2 py-1 rounded border border-purple-200 flex items-center justify-between">
                        <span className="flex items-center gap-1 truncate">
                          <span className="material-symbols-outlined text-[13px]">
                            verified
                          </span>
                          <span>{q.sourceCiting}</span>
                        </span>
                        <span className="text-slate-400 font-normal shrink-0 ml-2">
                          {q.sourceDocName}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onBackToStep3}
              className="px-3 py-1.5 text-[12px] font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>ย้อนกลับไปดูร่างแบบสอบถาม</span>
            </button>

            <button
              type="button"
              disabled={!allChecked}
              onClick={onProceedToStep5}
              className="px-4 py-2 bg-[#0c2340] hover:bg-[#163a66] disabled:opacity-50 text-white rounded-lg text-[12px] font-semibold flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
            >
              <span>ทวนเรียบร้อย ไปยังขั้นตอนยืนยัน (ไปยัง STEP 5)</span>
              <span className="material-symbols-outlined text-[16px]">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
