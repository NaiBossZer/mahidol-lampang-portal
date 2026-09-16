import React, { useState, useEffect } from 'react';
import { AiGeneratedSurvey, AiExtractedEntity } from '../types';
import { SAMPLE_AI_SURVEY } from '../data/adminWorkflow';

interface Step3AiSurveyGenerationProps {
  activityName: string;
  extractedEntities: AiExtractedEntity[];
  onProceedToStep4: (survey: AiGeneratedSurvey) => void;
  onBackToStep2: () => void;
}

export const Step3AiSurveyGeneration: React.FC<Step3AiSurveyGenerationProps> = ({
  activityName,
  extractedEntities,
  onProceedToStep4,
  onBackToStep2,
}) => {
  const [progress, setProgress] = useState(25);
  const [currentAction, setCurrentAction] = useState('กำลังแปลงวัตถุประสงค์จากเอกสารเป็นข้อคำถาม Likert Scale...');
  const [isDone, setIsDone] = useState(false);
  const [survey] = useState<AiGeneratedSurvey>(SAMPLE_AI_SURVEY);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setProgress(65);
      setCurrentAction('กำลังจัดหมวดหมู่คำถาม 3 ตอน: ข้อมูลทั่วไป, การประเมิน 5 ด้าน, และข้อเสนอแนะ...');
    }, 900);

    const t2 = setTimeout(() => {
      setProgress(100);
      setCurrentAction('จัดทำแบบสอบถามเสร็จสมบูรณ์ - ส่งต่อให้ ADMIN ทวนแบบสอบถาม');
      setIsDone(true);
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const totalQuestions = survey.sections.reduce(
    (acc, sec) => acc + sec.questions.length,
    0
  );

  return (
    <div className="space-y-4">
      {/* AI Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-900 to-[#0c2340] text-white rounded-xl p-4 shadow-sm border border-purple-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px] text-purple-300 animate-pulse">
                auto_awesome
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded border border-purple-400/30">
                  STEP 3: AI PROCESSING
                </span>
                <span className="text-[12px] text-purple-200">
                  กิจกรรม: <strong className="text-white">{activityName}</strong>
                </span>
              </div>
              <h2 className="text-[16px] font-bold text-white mt-1">
                AI จัดทำแบบสอบถาม (AI Survey Generation)
              </h2>
              <p className="text-[12px] text-purple-200/90 mt-0.5">
                AI สร้างข้อคำถามแบบประเมินโดยอัตโนมัติจากข้อมูลเอกสารราชการและรายละเอียดกิจกรรมที่สกัดได้
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold bg-purple-500/20 text-purple-200 border border-purple-400/30 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">psychology</span>
              AI Survey Generator
            </span>
          </div>
        </div>

        {/* Live status bar */}
        <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-purple-200 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-purple-300 animate-spin">
                cycle
              </span>
              {currentAction}
            </span>
            <span className="font-bold text-white">{progress}%</span>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-400 via-pink-400 to-sky-400 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Generated Survey Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Generation Mapping Logic (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-[13px] font-bold text-slate-900 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-purple-700 text-[18px]">
                account_tree
              </span>
              ตรรกะการแปลงข้อมูลของ AI
            </h3>
          </div>

          <div className="space-y-2.5 text-[11px]">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <div className="font-bold text-slate-800 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-sky-600">
                  check_circle
                </span>
                โครงสร้างสเกลมาตรฐาน
              </div>
              <p className="text-slate-600">
                กำหนดใช้ Likert Scale 5 ระดับ (1 = น้อยที่สุด, 5 = มากที่สุด) ตามระเบียบมหาวิทยาลัยมหิดล
              </p>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <div className="font-bold text-slate-800 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-purple-600">
                  link
                </span>
                การเชื่อมโยงกับเอกสารราชการ
              </div>
              <p className="text-slate-600">
                ทุกข้อคำถามมีการอ้างอิงกลับไปยังข้อความจริงในบันทึกข้อความและเอกสารโครงการ
              </p>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <div className="font-bold text-slate-800 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-emerald-600">
                  analytics
                </span>
                พร้อมนำไปแสดงผลใน Dashboard
              </div>
              <p className="text-slate-600">
                ข้อคำถามถูกจัดให้สอดคล้องกับ Dashboard วิเคราะห์คะแนนเฉลี่ย 5 ด้านที่ระบบรองรับ
              </p>
            </div>
          </div>

          <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-[11px] space-y-1">
            <div className="font-bold text-purple-900">ผลลัพธ์การสร้าง:</div>
            <div className="text-purple-700">
              สร้างสำเร็จ <strong>3 ตอน</strong> รวม <strong>{totalQuestions} ข้อคำถาม</strong>
            </div>
          </div>
        </div>

        {/* Right: Generated Survey Form Sections (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-[14px] font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-700 text-[20px]">
                  quiz
                </span>
                ร่างแบบสอบถามที่ AI จัดทำขึ้น
              </h3>
              <p className="text-[11px] text-slate-500">
                {survey.surveyTitle}
              </p>
            </div>

            <span className="text-[10px] font-bold px-2 py-1 rounded bg-purple-100 text-purple-800 border border-purple-200 shrink-0">
              AI Generation Complete
            </span>
          </div>

          <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1">
            {survey.sections.map((section, sIdx) => (
              <div
                key={section.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2.5"
              >
                <div className="pb-1.5 border-b border-slate-200/70">
                  <h4 className="text-[13px] font-bold text-slate-900">
                    {section.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {section.description}
                  </p>
                </div>

                <div className="space-y-2">
                  {section.questions.map((q, qIdx) => (
                    <div
                      key={q.id}
                      className="p-2.5 rounded-lg bg-white border border-slate-200 text-[12px] space-y-1 hover:border-purple-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-slate-800">
                          ข้อ {qIdx + 1}. {q.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-slate-100 text-slate-600 shrink-0">
                          {q.questionType === 'likert5'
                            ? 'Likert 1-5'
                            : q.questionType === 'single_choice'
                            ? 'เลือกตอบ'
                            : 'ปลายเปิด'}
                        </span>
                      </div>

                      <div className="text-[10px] text-purple-700 font-medium flex items-center gap-1 pt-0.5">
                        <span className="material-symbols-outlined text-[13px]">
                          auto_awesome
                        </span>
                        <span>{q.sourceCiting}</span>
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
              onClick={onBackToStep2}
              className="px-3 py-1.5 text-[12px] font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>ย้อนกลับไปดูผลวิเคราะห์เอกสาร</span>
            </button>

            <button
              type="button"
              disabled={!isDone}
              onClick={() => onProceedToStep4(survey)}
              className="px-4 py-2 bg-[#0c2340] hover:bg-[#163a66] disabled:opacity-50 text-white rounded-lg text-[12px] font-semibold flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
            >
              <span>ส่งต่อให้ ADMIN ทวนแบบสอบถาม (ไปยัง STEP 4)</span>
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
