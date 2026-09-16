import React, { useState, useEffect } from 'react';
import { OfficialDocument, AiExtractedEntity } from '../types';
import { SAMPLE_AI_EXTRACTED_ENTITIES } from '../data/adminWorkflow';

interface Step2AiDocAnalysisProps {
  activityName: string;
  documents: OfficialDocument[];
  onProceedToStep3: (extractedEntities: AiExtractedEntity[]) => void;
  onBackToStep1: () => void;
}

export const Step2AiDocAnalysis: React.FC<Step2AiDocAnalysisProps> = ({
  activityName,
  documents,
  onProceedToStep3,
  onBackToStep1,
}) => {
  const [analysisProgress, setAnalysisProgress] = useState(30);
  const [currentActionText, setCurrentActionText] = useState('กำลังอ่านและวิเคราะห์โครงสร้างเอกสารราชการ...');
  const [isCompleted, setIsCompleted] = useState(false);
  const [extractedEntities] = useState<AiExtractedEntity[]>(SAMPLE_AI_EXTRACTED_ENTITIES);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setAnalysisProgress(65);
      setCurrentActionText('กำลังสกัดวัตถุประสงค์โครงการ, กลุ่มเป้าหมาย และตัวชี้วัดความสำเร็จ...');
    }, 900);

    const timer2 = setTimeout(() => {
      setAnalysisProgress(100);
      setCurrentActionText('การตรวจสอบเอกสารเสร็จสมบูรณ์ - ข้อมูลพร้อมสำหรับจัดทำ Survey');
      setIsCompleted(true);
    }, 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* AI Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-900 to-[#0c2340] text-white rounded-xl p-4 shadow-sm border border-purple-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px] text-purple-300 animate-pulse">
                psychology
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded border border-purple-400/30">
                  STEP 2: AI PROCESSING
                </span>
                <span className="text-[12px] text-purple-200">
                  กิจกรรม: <strong className="text-white">{activityName}</strong>
                </span>
              </div>
              <h2 className="text-[16px] font-bold text-white mt-1">
                AI ตรวจสอบและวิเคราะห์เอกสารราชการ
              </h2>
              <p className="text-[12px] text-purple-200/90 mt-0.5">
                AI รับเอกสารราชการ {documents.length} ฉบับ วิเคราะห์ข้อมูล และสกัดสาระสำคัญเพื่อนำไปเป็นพื้นฐานในการจัดทำแบบสอบถาม
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold bg-purple-500/20 text-purple-200 border border-purple-400/30 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">smart_toy</span>
              AI Processing State
            </span>
          </div>
        </div>

        {/* Progress Bar & Real-time Live Log */}
        <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-purple-200 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-purple-300 animate-spin">
                sync
              </span>
              {currentActionText}
            </span>
            <span className="font-bold text-white">{analysisProgress}%</span>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-400 to-sky-400 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${analysisProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Analysis Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Documents being analyzed (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-[13px] font-bold text-slate-900 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-slate-600 text-[18px]">
                folder_open
              </span>
              เอกสารราชการนำเข้า ({documents.length})
            </h3>
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Verified
            </span>
          </div>

          <div className="space-y-2">
            {documents.map((doc, idx) => (
              <div
                key={doc.id || idx}
                className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 text-[11px] space-y-1"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-rose-500 text-[18px]">
                    picture_as_pdf
                  </span>
                  <span className="font-bold text-slate-900 truncate" title={doc.name}>
                    {doc.name}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 flex items-center justify-between">
                  <span>เลขที่: {doc.docNumber}</span>
                  <span className="text-emerald-600 font-medium">ตรวจผ่านแล้ว</span>
                </div>
              </div>
            ))}
          </div>

          {/* AI Extraction Criteria */}
          <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] space-y-2">
            <div className="font-semibold text-slate-700 flex items-center gap-1">
              <span className="material-symbols-outlined text-sky-600 text-[16px]">
                rule
              </span>
              เกณฑ์ที่ AI ใช้ในการสอบทานเอกสาร:
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-600 text-[10px] leading-relaxed">
              <li>สกัดวัตถุประสงค์เพื่อนำไปสร้างข้อคำถามด้านผลสัมฤทธิ์</li>
              <li>สกัดกลุ่มเป้าหมายเพื่อกำหนดตัวเลือกข้อมูลทั่วไป (Demographics)</li>
              <li>สกัดตัวชี้วัดความสำเร็จ (KPI) เพื่อเทียบกับสเกลแบบประเมิน 1-5</li>
              <li>สกัดสถานที่และสิ่งอำนวยความสะดวกเพื่อประเมินความพร้อม</li>
            </ul>
          </div>
        </div>

        {/* Right: AI Extracted Entities List (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-[14px] font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-600 text-[20px]">
                  data_object
                </span>
                ข้อมูลสำคัญที่ AI สกัดได้จากเอกสาร ({extractedEntities.length} รายการ)
              </h3>
              <p className="text-[11px] text-slate-500">
                ข้อมูลเหล่านี้จะถูกส่งเข้าสู่ STEP 3 เพื่อสร้างแบบสอบถามอัตโนมัติ
              </p>
            </div>
            <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-full shrink-0">
              ความมั่นใจเฉลี่ย 97.4%
            </span>
          </div>

          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {extractedEntities.map((entity) => (
              <div
                key={entity.id}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">
                    {entity.categoryLabel}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold">
                    <span className="material-symbols-outlined text-[14px]">
                      verified
                    </span>
                    <span>ความมั่นใจ {entity.confidence}%</span>
                  </div>
                </div>

                <div className="text-[13px] font-bold text-slate-900">
                  {entity.title}
                </div>

                <p className="text-[12px] text-slate-600 leading-relaxed">
                  {entity.text}
                </p>

                <div className="pt-1 text-[10px] text-slate-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">
                    menu_book
                  </span>
                  <span>แหล่งที่มาในเอกสาร: <strong>{entity.sourceDoc}</strong> ({entity.page})</span>
                </div>
              </div>
            ))}
          </div>

          {/* Action footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onBackToStep1}
              className="px-3 py-1.5 text-[12px] font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>ย้อนกลับไปแก้ไขเอกสาร</span>
            </button>

            <button
              type="button"
              disabled={!isCompleted}
              onClick={() => onProceedToStep3(extractedEntities)}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white rounded-lg text-[12px] font-semibold flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
            >
              <span>ส่งข้อมูลให้ AI จัดทำ Survey (ไปยัง STEP 3)</span>
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
