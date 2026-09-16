import React, { useState } from 'react';
import { AdminActivityItem, ActivityPhoto, ActivityReport } from '../types';
import { SAMPLE_DEFAULT_REPORT } from '../data/adminWorkflow';
import { ActivityPhotoManager } from './ActivityPhotoManager';
import { ActivityReportEditor } from './ActivityReportEditor';
import { ActivityWebsitePreview } from './ActivityWebsitePreview';

interface PostProjectWorkflowProps {
  activity: AdminActivityItem;
  initialStep?: 6 | 7 | 8 | 9;
  onUpdateActivity: (updated: AdminActivityItem) => void;
  onBackToOverview: () => void;
  onGoToAnalytics: (activityId: string) => void;
}

export const PostProjectWorkflow: React.FC<PostProjectWorkflowProps> = ({
  activity,
  initialStep = 7,
  onUpdateActivity,
  onBackToOverview,
  onGoToAnalytics,
}) => {
  // Post project workflow active sub-step: 6 (Completed), 7 (Photos), 8 (Report), 9 (Preview & Publish)
  const [activeStep, setActiveStep] = useState<6 | 7 | 8 | 9>(() => {
    if (activity.status === 'published') return 9;
    if (activity.status === 'ready_to_publish') return 9;
    if (activity.status === 'drafting_report') return 8;
    if (activity.status === 'completed') return 7;
    return initialStep;
  });

  // Local report state initialized from activity or default
  const [report, setReport] = useState<ActivityReport>(() => {
    if (activity.report) return activity.report;
    return {
      ...SAMPLE_DEFAULT_REPORT,
      title: `ม.มหิดล วิทยาเขตลำปาง จัดกิจกรรม "${activity.name}" ขับเคลื่อนสุขภาวะและสิ่งแวดล้อมยั่งยืน`,
      summary: `คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล วิทยาเขตลำปาง ร่วมกับตัวแทนชุมชน จัดกิจกรรม ${activity.name} ณ ${activity.location} เมื่อ ${activity.date} โดยมีผู้เข้าร่วมตามเป้าหมาย ${activity.targetCount} คน พร้อมผลประเมินความพึงพอใจสูงในระดับดีมาก`,
      author: `ฝ่ายสื่อสารองค์กร ${activity.faculty}`,
    };
  });

  // Handler: Update Photos
  const handleUpdatePhotos = (photos: ActivityPhoto[]) => {
    const updated: AdminActivityItem = {
      ...activity,
      photos,
      hasNoPhotos: photos.length === 0,
    };
    onUpdateActivity(updated);
  };

  // Handler: Skip Photos
  const handleSkipPhotos = () => {
    const updated: AdminActivityItem = {
      ...activity,
      hasNoPhotos: true,
      currentStep: Math.max(activity.currentStep, 8),
      status: activity.status === 'published' ? 'published' : 'drafting_report',
      statusLabel: activity.status === 'published' ? 'เผยแพร่บนเว็บไซต์แล้ว' : 'รอจัดทำรายงาน/ข่าวกิจกรรม',
    };
    onUpdateActivity(updated);
    setActiveStep(8);
  };

  // Handler: Proceed to Report
  const handleProceedToReport = () => {
    const updated: AdminActivityItem = {
      ...activity,
      currentStep: Math.max(activity.currentStep, 8),
      status: activity.status === 'published' ? 'published' : 'drafting_report',
      statusLabel: activity.status === 'published' ? 'เผยแพร่บนเว็บไซต์แล้ว' : 'รอจัดทำรายงาน/ข่าวกิจกรรม',
    };
    onUpdateActivity(updated);
    setActiveStep(8);
  };

  // Handler: Update Report
  const handleUpdateReport = (newReport: ActivityReport) => {
    setReport(newReport);
    const updated: AdminActivityItem = {
      ...activity,
      report: newReport,
    };
    onUpdateActivity(updated);
  };

  // Handler: Proceed to Preview
  const handleProceedToPreview = () => {
    const updated: AdminActivityItem = {
      ...activity,
      report,
      currentStep: Math.max(activity.currentStep, 9),
      status: activity.status === 'published' ? 'published' : 'ready_to_publish',
      statusLabel: activity.status === 'published' ? 'เผยแพร่บนเว็บไซต์แล้ว' : 'พร้อมเผยแพร่ (รอ ADMIN ยืนยัน)',
    };
    onUpdateActivity(updated);
    setActiveStep(9);
  };

  // Handler: Publish Confirmed
  const handlePublishConfirmed = () => {
    const publishedTimestamp =
      'วันนี้ ' +
      new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) +
      ' น.';
    const publishedUrl = `https://portal.lampang.mahidol.ac.th/news/${activity.code.toLowerCase()}`;

    const publishedReport: ActivityReport = {
      ...report,
      publishedAt: publishedTimestamp,
      publishedUrl,
    };

    const updated: AdminActivityItem = {
      ...activity,
      report: publishedReport,
      status: 'published',
      statusLabel: 'เผยแพร่บนเว็บไซต์แล้ว',
      publishedAt: publishedTimestamp,
      currentStep: 9,
    };

    setReport(publishedReport);
    onUpdateActivity(updated);
  };

  return (
    <div className="space-y-4">
      {/* Sub-navigation tabs for Post-Project workflow */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 text-[12px]">
          <button
            type="button"
            onClick={() => setActiveStep(7)}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeStep === 7
                ? 'bg-[#0c2340] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {activity.photos && activity.photos.length > 0 ? 'photo_library' : 'add_photo_alternate'}
            </span>
            <span>ขั้นตอนที่ 7: รูปภาพกิจกรรม</span>
            {activity.photos && activity.photos.length > 0 && (
              <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.2 rounded-full font-mono">
                {activity.photos.length}
              </span>
            )}
            {activity.hasNoPhotos && (
              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full">
                ข้ามแล้ว
              </span>
            )}
          </button>

          <span className="text-slate-300">/</span>

          <button
            type="button"
            onClick={() => setActiveStep(8)}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeStep === 8
                ? 'bg-[#0c2340] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">edit_note</span>
            <span>ขั้นตอนที่ 8: รายงาน / ข่าว</span>
            {report.isAiAssisted && (
              <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded-full font-bold">
                AI
              </span>
            )}
          </button>

          <span className="text-slate-300">/</span>

          <button
            type="button"
            onClick={() => setActiveStep(9)}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeStep === 9
                ? 'bg-[#0c2340] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {activity.status === 'published' ? 'public' : 'visibility'}
            </span>
            <span>
              {activity.status === 'published'
                ? 'ขั้นตอนที่ 9: เผยแพร่แล้ว (Live)'
                : 'ขั้นตอนที่ 9: ตรวจสอบ & เผยแพร่'}
            </span>
            {activity.status === 'published' && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            )}
          </button>
        </div>

        {/* Action Link: View Analytics Dashboard */}
        <button
          type="button"
          onClick={() => onGoToAnalytics(activity.id)}
          className="px-3 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[14px]">analytics</span>
          <span>ดูสถิติผลประเมิน (Dashboard)</span>
        </button>
      </div>

      {/* Render Active Post-Project Sub-step */}
      {activeStep === 7 && (
        <ActivityPhotoManager
          photos={activity.photos || []}
          onUpdatePhotos={handleUpdatePhotos}
          onProceedToReport={handleProceedToReport}
          onSkipPhotos={handleSkipPhotos}
          onBackToOverview={onBackToOverview}
        />
      )}

      {activeStep === 8 && (
        <ActivityReportEditor
          activity={activity}
          report={report}
          onUpdateReport={handleUpdateReport}
          onProceedToPreview={handleProceedToPreview}
          onBackToPhotos={() => setActiveStep(7)}
        />
      )}

      {activeStep === 9 && (
        <ActivityWebsitePreview
          activity={activity}
          report={report}
          onPublishConfirmed={handlePublishConfirmed}
          onBackToEdit={() => setActiveStep(8)}
        />
      )}
    </div>
  );
};
