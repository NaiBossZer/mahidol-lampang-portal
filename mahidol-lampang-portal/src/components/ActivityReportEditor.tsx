import React, { useState } from 'react';
import { AdminActivityItem, ActivityReport } from '../types';
import { ActivityAiWritingModal } from './ActivityAiWritingModal';

interface ActivityReportEditorProps {
  activity: AdminActivityItem;
  report: ActivityReport;
  onUpdateReport: (report: ActivityReport) => void;
  onProceedToPreview: () => void;
  onBackToPhotos: () => void;
}

export const ActivityReportEditor: React.FC<ActivityReportEditorProps> = ({
  activity,
  report,
  onUpdateReport,
  onProceedToPreview,
  onBackToPhotos,
}) => {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [savedStatus, setSavedStatus] = useState<string>('บันทึกร่างเรียบร้อยแล้ว');

  const handleChange = (field: keyof ActivityReport, value: any) => {
    onUpdateReport({
      ...report,
      [field]: value,
    });
    setSavedStatus('กำลังบันทึก...');
    setTimeout(() => setSavedStatus('บันทึกร่างเรียบร้อยแล้ว'), 600);
  };

  const coverImg =
    report.coverImage ||
    activity.photos?.find((p) => p.isCover)?.url ||
    activity.photos?.[0]?.url;

  const isFormComplete =
    report.title.trim().length > 5 &&
    report.summary.trim().length > 10 &&
    report.content.trim().length > 20;

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-sky-700 text-white flex items-center justify-center font-bold text-[11px]">
              8
            </span>
            <h2 className="text-[16px] font-bold text-slate-900">
              รายงาน / ข่าวกิจกรรม (Activity Report & News Editor)
            </h2>
            {report.isAiAssisted && (
              <span className="text-[10px] font-semibold bg-purple-100 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">auto_awesome</span>
                <span>AI Assisted</span>
              </span>
            )}
          </div>
          <p className="text-[12px] text-slate-500 mt-1">
            จัดทำเนื้อหาข่าวและรายงานผลสัมฤทธิ์ สำหรับเผยแพร่สู่เว็บไซต์มหาวิทยาลัยมหิดล วิทยาเขตลำปาง
          </p>
        </div>

        {/* AI Action Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setAiModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl text-[12px] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px]">auto_awesome</span>
            <span>✨ ให้ AI ช่วยเขียน (AI Assistant)</span>
          </button>
        </div>
      </div>

      {/* AI Assistant Advice Banner */}
      <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl flex items-start gap-2.5 text-[11.5px] text-purple-950">
        <span className="material-symbols-outlined text-purple-700 text-[18px] shrink-0 mt-0.5">
          psychology
        </span>
        <div className="flex-1">
          <span className="font-bold">ระบบร่างเนื้อหาอัจฉริยะ (AI-assisted Draft):</span> สามารถกดปุ่ม{' '}
          <strong className="text-purple-800 underline cursor-pointer" onClick={() => setAiModalOpen(true)}>
            "✨ ให้ AI ช่วยเขียน"
          </strong>{' '}
          เพื่อให้ AI ดึงข้อมูลกิจกรรม วันที่ เอกสารราชการ และสถิติความพึงพอใจมาร่างเนื้อหาให้ในคลิกเดียว จากนั้น ADMIN สามารถปรับแก้ข้อความได้ตามต้องการ
        </div>
      </div>

      {/* Editor Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Form: Main News Content (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Card: Core News Fields */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-[13px] font-bold text-slate-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sky-700 text-[17px]">
                  article
                </span>
                <span>เนื้อหาข่าวประชาสัมพันธ์</span>
              </h3>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>{savedStatus}</span>
              </span>
            </div>

            {/* Field 1: News Title */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-bold text-slate-800">
                  หัวข้อข่าว <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400">
                  {report.title.length} ตัวอักษร
                </span>
              </div>
              <input
                type="text"
                value={report.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="ระบุหัวข้อข่าวที่กระชับและดึงดูดความสนใจ..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-[13px] font-semibold focus:outline-hidden focus:border-sky-500 focus:bg-white"
              />
            </div>

            {/* Field 2: News Summary */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-bold text-slate-800">
                  สรุปข่าว (Executive Summary / Lead Paragraph) <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400">
                  {report.summary.length} ตัวอักษร
                </span>
              </div>
              <textarea
                rows={3}
                value={report.summary}
                onChange={(e) => handleChange('summary', e.target.value)}
                placeholder="สรุปประเด็นสำคัญของกิจกรรม ผลสัมฤทธิ์ และความร่วมมือใน 2-3 ประโยค..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-[12px] focus:outline-hidden focus:border-sky-500 focus:bg-white leading-relaxed"
              />
            </div>

            {/* Field 3: Full Content */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-bold text-slate-800">
                  เนื้อหาข่าว / รายงานฉบับเต็ม <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400">
                  {report.content.length} ตัวอักษร
                </span>
              </div>
              <textarea
                rows={8}
                value={report.content}
                onChange={(e) => handleChange('content', e.target.value)}
                placeholder="รายละเอียดการจัดกิจกรรม ขั้นตอน การบรรยาย การลงพื้นที่ และความคิดเห็นของผู้เข้าร่วม..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-[12px] focus:outline-hidden focus:border-sky-500 focus:bg-white leading-relaxed font-sans"
              />
            </div>
          </div>

          {/* Card: Performance Results & Impact */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-[13px] font-bold text-slate-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-700 text-[17px]">
                  trending_up
                </span>
                <span>ผลสัมฤทธิ์และผลกระทบ (Results & Impact)</span>
              </h3>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ดึงจากระบบประเมิน AI
              </span>
            </div>

            {/* Field 4: Performance Results */}
            <div className="space-y-1">
              <label className="text-[12px] font-bold text-slate-800">
                ผลการดำเนินงาน (Performance Results & KPIs)
              </label>
              <textarea
                rows={3}
                value={report.performanceResults}
                onChange={(e) => handleChange('performanceResults', e.target.value)}
                placeholder="ระบุตัวเลขผู้เข้าร่วม อัตราการตอบแบบสอบถาม และคะแนนความพึงพอใจ..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-[12px] focus:outline-hidden focus:border-sky-500 focus:bg-white leading-relaxed"
              />
            </div>

            {/* Field 5: Outcomes & Impact */}
            <div className="space-y-1">
              <label className="text-[12px] font-bold text-slate-800">
                ผลที่ได้รับ / ผลกระทบต่อชุมชนและมหาวิทยาลัย (Outcomes & Impact)
              </label>
              <textarea
                rows={3}
                value={report.outcomesAndImpact}
                onChange={(e) => handleChange('outcomesAndImpact', e.target.value)}
                placeholder="ระบุผลลัพธ์เชิงบวก การต่อยอดโครงการ หรือข้อตกลงความร่วมมือระยะยาว..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-[12px] focus:outline-hidden focus:border-sky-500 focus:bg-white leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Right Form: Media & Meta Information (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Cover Image Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-[13px] font-bold text-slate-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-amber-600 text-[17px]">
                  image
                </span>
                <span>รูปภาพหน้าปก (Cover Image)</span>
              </h3>
            </div>

            {coverImg ? (
              <div className="space-y-2">
                <div className="relative aspect-16/10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                  <img
                    src={coverImg}
                    alt="Cover"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[9px] px-2 py-0.5 rounded font-medium">
                    ภาพปกสำหรับหน้าเว็บไซต์
                  </div>
                </div>

                <div className="text-[10.5px] text-slate-500 flex items-center justify-between">
                  <span>เลือกจากรูปภาพกิจกรรม</span>
                  <button
                    type="button"
                    onClick={onBackToPhotos}
                    className="text-sky-600 hover:text-sky-700 hover:underline font-semibold cursor-pointer"
                  >
                    เปลี่ยนรูปภาพ &gt;
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 border-2 border-dashed border-slate-200 rounded-lg text-center space-y-2 bg-slate-50">
                <span className="material-symbols-outlined text-slate-400 text-[24px]">
                  hide_image
                </span>
                <div className="text-[11px] text-slate-600 font-semibold">
                  ยังไม่ได้กำหนดรูปภาพหน้าปก
                </div>
                <p className="text-[10px] text-slate-400">
                  (ระบบจะใช้ภาพอัตลักษณ์ของมหาวิทยาลัยแทนหากไม่ได้ระบุ)
                </p>
                <button
                  type="button"
                  onClick={onBackToPhotos}
                  className="px-2.5 py-1 bg-white border border-slate-300 text-slate-700 text-[10px] font-semibold rounded hover:bg-slate-50 cursor-pointer"
                >
                  + ไปเลือกภาพกิจกรรม
                </button>
              </div>
            )}
          </div>

          {/* Attached Gallery Photos Summary */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-[13px] font-bold text-slate-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sky-700 text-[17px]">
                  photo_library
                </span>
                <span>รูปภาพประกอบ ({activity.photos?.length || 0} รูป)</span>
              </h3>
              <button
                type="button"
                onClick={onBackToPhotos}
                className="text-[11px] text-sky-600 hover:underline font-medium cursor-pointer"
              >
                จัดการรูปภาพ
              </button>
            </div>

            {activity.photos && activity.photos.length > 0 ? (
              <div className="grid grid-cols-3 gap-1.5">
                {activity.photos.map((p) => (
                  <div
                    key={p.id}
                    className="aspect-square rounded-md overflow-hidden bg-slate-100 border border-slate-200 relative group"
                  >
                    <img
                      src={p.url}
                      alt={p.caption || 'Photo'}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {p.isCover && (
                      <span className="absolute top-1 left-1 w-2 h-2 rounded-full bg-sky-500 ring-2 ring-white"></span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-slate-50 rounded-lg text-center text-[11px] text-slate-400">
                ไม่มีรูปภาพประกอบ (ข้ามขั้นตอนรูปภาพ)
              </div>
            )}
          </div>

          {/* Publishing Meta Info */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-2.5 text-[11.5px]">
            <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-slate-500 text-[16px]">
                badge
              </span>
              <span>ข้อมูลการเผยแพร่</span>
            </h3>

            <div className="space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">ผู้จัดทำเนื้อหา:</span>
                <span className="font-semibold text-slate-800">{report.author}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">หน่วยงาน:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[150px]">
                  {activity.faculty}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">สถานะเนื้อหา:</span>
                <span className="font-semibold text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded">
                  กำลังจัดทำ (Drafting)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBackToPhotos}
          className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium rounded-lg text-[12px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>ย้อนกลับไปรูปภาพกิจกรรม</span>
        </button>

        <div className="flex items-center gap-2.5">
          {!isFormComplete && (
            <span className="text-[11px] text-amber-700 font-medium">
              * กรุณากรอกหัวข้อ สรุป และเนื้อหาให้ครบถ้วน
            </span>
          )}

          <button
            type="button"
            onClick={onProceedToPreview}
            disabled={!isFormComplete}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold rounded-lg text-[12px] flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <span>ถัดไป: ตรวจสอบเนื้อหา (Preview)</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* AI Assistant Modal */}
      <ActivityAiWritingModal
        isOpen={aiModalOpen}
        activity={activity}
        currentReport={report}
        onClose={() => setAiModalOpen(false)}
        onApplyDraft={(draft) => {
          onUpdateReport(draft);
          setSavedStatus('บันทึกเนื้อหาจาก AI เรียบร้อยแล้ว');
        }}
      />
    </div>
  );
};
