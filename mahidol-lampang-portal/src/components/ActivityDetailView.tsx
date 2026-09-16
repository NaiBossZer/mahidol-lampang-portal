import React, { useState } from 'react';
import { AdminActivityItem, Project } from '../types';
import { UnifiedWorkflowStepper } from './UnifiedWorkflowStepper';
import { CompletionConfirmModal } from './CompletionConfirmModal';
import { PostProjectWorkflow } from './PostProjectWorkflow';

interface ActivityDetailViewProps {
  activity: AdminActivityItem;
  project: Project;
  onGoToAnalytics: (activityId: string) => void;
  onCreateNewActivity: () => void;
  onBackToProject: () => void;
  onUpdateActivity?: (updated: AdminActivityItem) => void;
}

export const ActivityDetailView: React.FC<ActivityDetailViewProps> = ({
  activity,
  project,
  onGoToAnalytics,
  onCreateNewActivity,
  onBackToProject,
  onUpdateActivity,
}) => {
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const isPostProjectPhase = [
    'completed',
    'drafting_report',
    'ready_to_publish',
    'published',
  ].includes(activity.status);

  // Active view mode: 'overview' (existing info & docs) or 'post_project' (steps 6-9)
  const [activeTab, setActiveTab] = useState<'overview' | 'post_project'>(
    isPostProjectPhase ? 'post_project' : 'overview'
  );

  // Handle Complete Project Confirmation
  const handleConfirmCompletion = () => {
    setCompleteModalOpen(false);
    const completedTimestamp =
      'วันนี้ ' +
      new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) +
      ' น.';

    const updated: AdminActivityItem = {
      ...activity,
      status: 'completed',
      statusLabel: 'เสร็จสิ้นโครงการแล้ว',
      currentStep: 7, // Move to step 7: Photos
      completedAt: completedTimestamp,
    };

    if (onUpdateActivity) {
      onUpdateActivity(updated);
    }
    setActiveTab('post_project');
  };

  return (
    <div className="space-y-4">
      {/* 9-Step Unified Workflow Stepper */}
      <UnifiedWorkflowStepper
        currentStep={activity.currentStep || 5}
        status={activity.status}
        maxStepAllowed={isPostProjectPhase ? 9 : 6}
        onStepClick={(step) => {
          if (step >= 6) {
            if (!isPostProjectPhase && step === 6) {
              setCompleteModalOpen(true);
            } else if (isPostProjectPhase) {
              setActiveTab('post_project');
            }
          } else {
            setActiveTab('overview');
          }
        }}
      />

      {/* Main Tab Switcher Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[12px]">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#0c2340] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">info</span>
            <span>รายละเอียดกิจกรรม & เอกสารราชการ</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (!isPostProjectPhase) {
                setCompleteModalOpen(true);
              } else {
                setActiveTab('post_project');
              }
            }}
            className={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'post_project'
                ? 'bg-[#0c2340] text-white shadow-xs'
                : isPostProjectPhase
                ? 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {activity.status === 'published' ? 'public' : 'post_add'}
            </span>
            <span>
              {activity.status === 'published'
                ? 'ข่าวกิจกรรม & เผยแพร่แล้ว'
                : 'กระบวนการหลังโครงการ (รูปภาพ, ข่าว & เผยแพร่)'}
            </span>
            {isPostProjectPhase && (
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            )}
          </button>
        </div>

        {/* Status Callout Pill */}
        <div className="flex items-center gap-2 text-[11.5px]">
          <span className="text-slate-400">สถานะปัจจุบัน:</span>
          <span
            className={`font-bold px-2.5 py-0.5 rounded-full border ${
              activity.status === 'published'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : activity.status === 'completed' || activity.status === 'drafting_report'
                ? 'bg-purple-100 text-purple-800 border-purple-300'
                : 'bg-sky-100 text-sky-800 border-sky-300'
            }`}
          >
            {activity.statusLabel || 'ดำเนินกิจกรรม'}
          </span>
        </div>
      </div>

      {/* View Mode 1: Post-Project Workflow (Steps 6-9) */}
      {activeTab === 'post_project' && isPostProjectPhase ? (
        <PostProjectWorkflow
          activity={activity}
          onUpdateActivity={(updated) => onUpdateActivity && onUpdateActivity(updated)}
          onBackToOverview={() => setActiveTab('overview')}
          onGoToAnalytics={onGoToAnalytics}
        />
      ) : activeTab === 'post_project' && !isPostProjectPhase ? (
        /* Prompt to Complete Project First */
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3 shadow-xs">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-[30px]">flag</span>
          </div>
          <h3 className="text-[16px] font-bold text-slate-900">
            โครงการยังอยู่ในขั้นตอน "ดำเนินกิจกรรม"
          </h3>
          <p className="text-[12px] text-slate-500 max-w-md mx-auto">
            เพื่อเริ่มบันทึกรูปภาพกิจกรรมและให้ AI ช่วยร่างรายงานข่าวกิจกรรม ADMIN ต้องกดยืนยัน "เสร็จสิ้นโครงการ" เพื่อสิ้นสุดระยะเวลาจัดกิจกรรมและปิดรับคำตอบแบบสอบถาม
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setCompleteModalOpen(true)}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[13px] inline-flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>เสร็จสิ้นโครงการ</span>
            </button>
          </div>
        </div>
      ) : (
        /* View Mode 2: Existing Overview & Official Docs */
        <div className="space-y-4">
          {/* Phase Notification Banner */}
          {activity.status === 'published' ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-900">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">public</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[14px]">
                      ข่าวกิจกรรมเผยแพร่บนเว็บไซต์แล้ว (Published)
                    </span>
                    <span className="text-[10px] font-semibold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                      Step 9 Complete
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    เผยแพร่เมื่อ {activity.publishedAt || '15 ก.ย. 2568'} • บุคคลทั่วไปสามารถเข้าชมได้ที่ portal.lampang.mahidol.ac.th
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('post_project')}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-[12px] flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                  <span>ดูหน้าพรีวิวเว็บไซต์</span>
                </button>
              </div>
            </div>
          ) : isPostProjectPhase ? (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-purple-950">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">flag_circle</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[14px]">
                      โครงการเสร็จสิ้นแล้ว — กำลังดำเนินการหลังโครงการ
                    </span>
                    <span className="text-[10px] font-semibold bg-purple-200 text-purple-900 px-2 py-0.5 rounded-full">
                      Post-Project Phase
                    </span>
                  </div>
                  <p className="text-[11px] text-purple-800 mt-0.5">
                    เสร็จสิ้นเมื่อ {activity.completedAt || 'วันนี้'} • ขณะนี้อยู่ในขั้นตอนจัดทำรูปภาพและรายงานข่าวกิจกรรม
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('post_project')}
                  className="px-3.5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-medium rounded-lg text-[12px] flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">edit_note</span>
                  <span>ไปทำข่าว/เผยแพร่ &gt;</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sky-950">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">sync</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[14px]">
                      ขั้นตอนที่ 5: ดำเนินกิจกรรม (เปิดรับคำตอบแบบประเมิน)
                    </span>
                    <span className="text-[10px] font-semibold bg-sky-200 text-sky-900 px-2 py-0.5 rounded-full">
                      Live In-Progress
                    </span>
                  </div>
                  <p className="text-[11px] text-sky-800 mt-0.5">
                    แบบสอบถามถูกผูกเข้ากับกิจกรรม {activity.name} เรียบร้อยแล้ว พร้อมสำหรับการเปิดรับคำตอบ เมื่อจัดกิจกรรมเรียบร้อยแล้ว ให้กดปุ่ม "เสร็จสิ้นโครงการ" ด้านขวา
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setCompleteModalOpen(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[12.5px] flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[17px]">flag</span>
                  <span>เสร็จสิ้นโครงการ</span>
                </button>
              </div>
            </div>
          )}

          {/* Main Activity Detail Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Column: Activity Info & Attached Official Docs (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Card 1: Core Activity Details */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
                <div className="flex items-start justify-between gap-3 pb-2 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      รหัสกิจกรรม: {activity.code}
                    </span>
                    <h2 className="text-[17px] font-bold text-slate-900 mt-0.5">
                      {activity.name}
                    </h2>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      ภายใต้: {project.name} ({project.code})
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold border shrink-0 ${
                      activity.status === 'published'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : isPostProjectPhase
                        ? 'bg-purple-100 text-purple-800 border-purple-200'
                        : 'bg-sky-100 text-sky-800 border-sky-200'
                    }`}
                  >
                    สถานะ: {activity.statusLabel || 'เปิดรับคำตอบ'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[12px]">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                    <span className="text-[10px] text-slate-400">วันที่จัดกิจกรรม</span>
                    <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-slate-500 text-[15px]">
                        calendar_month
                      </span>
                      {activity.date}
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                    <span className="text-[10px] text-slate-400">สถานที่จัดกิจกรรม</span>
                    <div className="font-semibold text-slate-900 flex items-center gap-1.5 truncate">
                      <span className="material-symbols-outlined text-slate-500 text-[15px]">
                        location_on
                      </span>
                      <span className="truncate">{activity.location}</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                    <span className="text-[10px] text-slate-400">หน่วยงาน / วิทยาเขต</span>
                    <div className="font-semibold text-slate-900 flex items-center gap-1.5 truncate">
                      <span className="material-symbols-outlined text-slate-500 text-[15px]">
                        domain
                      </span>
                      <span className="truncate">{activity.faculty}</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                    <span className="text-[10px] text-slate-400">ผู้รับผิดชอบ</span>
                    <div className="font-semibold text-slate-900 flex items-center gap-1.5 truncate">
                      <span className="material-symbols-outlined text-slate-500 text-[15px]">
                        person
                      </span>
                      <span className="truncate">{activity.responsiblePerson}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Verified Official Documents */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-[14px] font-bold text-slate-900 flex items-center gap-2">
                    <span className="material-symbols-outlined text-purple-700 text-[18px]">
                      description
                    </span>
                    เอกสารราชการที่ตรวจวิเคราะห์แล้ว ({activity.officialDocs.length})
                  </h3>
                  <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    AI Verified
                  </span>
                </div>

                <div className="space-y-2">
                  {activity.officialDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3 text-[12px]"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="material-symbols-outlined text-rose-500 text-[20px] shrink-0">
                          picture_as_pdf
                        </span>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 truncate" title={doc.name}>
                            {doc.name}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {doc.documentTypeName} • เลขที่ {doc.docNumber} • {doc.fileSize}
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded shrink-0">
                        ผ่านการตรวจสอบ
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Assigned Survey Information & Action Links (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-[14px] font-bold text-slate-900 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sky-700 text-[18px]">
                      quiz
                    </span>
                    แบบสอบถามที่ผูกกับกิจกรรม
                  </h3>
                  <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
                    Assigned
                  </span>
                </div>

                {activity.survey && (
                  <div className="space-y-3 text-[12px]">
                    <div className="p-3 bg-sky-50/50 rounded-xl border border-sky-100 space-y-1">
                      <div className="text-[11px] font-bold text-sky-900">
                        {activity.survey.surveyTitle}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        สร้างโดย: AI วิเคราะห์จากเอกสารราชการ • ได้รับการทวนและยืนยันโดย ADMIN
                      </div>
                    </div>

                    <div className="space-y-1.5 text-slate-600 text-[11px]">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span>จำนวนตอน / หมวดหมู่:</span>
                        <span className="font-semibold text-slate-900">
                          {activity.survey.sections.length} ตอน
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span>มาตราส่วนประเมิน:</span>
                        <span className="font-semibold text-slate-900">
                          {activity.survey.scaleType}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span>สถานะการเชื่อมต่อ:</span>
                        <span className="font-semibold text-emerald-600 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          พร้อมรับคำตอบ (Live)
                        </span>
                      </div>
                    </div>

                    {/* Direct Action Buttons */}
                    <div className="pt-2 space-y-2">
                      {!isPostProjectPhase && (
                        <button
                          type="button"
                          onClick={() => setCompleteModalOpen(true)}
                          className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[12px] flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[17px]">flag</span>
                          <span>เสร็จสิ้นโครงการ (สิ้นสุดกิจกรรม)</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onGoToAnalytics(activity.id)}
                        className="w-full py-2 px-3 bg-[#0c2340] hover:bg-[#163a66] text-white font-medium rounded-lg text-[12px] flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[17px] text-sky-300">
                          insights
                        </span>
                        <span>ไปยังหน้าวิเคราะห์ผลสถิติ (Executive Analytics)</span>
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={onCreateNewActivity}
                          className="py-1.5 px-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium rounded-lg text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[15px]">add</span>
                          <span>สร้างกิจกรรมใหม่</span>
                        </button>

                        <button
                          type="button"
                          onClick={onBackToProject}
                          className="py-1.5 px-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium rounded-lg text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[15px]">list_alt</span>
                          <span>หน้ารายการโครงการ</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completion Confirmation Modal */}
      <CompletionConfirmModal
        isOpen={completeModalOpen}
        activity={activity}
        onClose={() => setCompleteModalOpen(false)}
        onConfirm={handleConfirmCompletion}
      />
    </div>
  );
};
