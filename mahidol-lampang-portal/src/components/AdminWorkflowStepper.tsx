import React, { useState } from 'react';
import { ActivityWorkflowStatus } from '../types';

export interface AdminWorkflowStepperProps {
  currentStep: number; // 1 to 9 (also supports legacy 1|2|3|4|5)
  onStepClick?: (step: number) => void;
  maxStepReached?: number;
  maxStepAllowed?: number;
  status?: ActivityWorkflowStatus | string;
  activityTitle?: string;
  showPhaseFilter?: boolean;
  defaultPhase?: 'all' | 'pre' | 'post';
  onPhaseChange?: (phase: 'pre' | 'post') => void;
  showLinearTrack?: boolean;
}

interface StepDefinition {
  step: number;
  phase: 'pre' | 'post';
  phaseNumber: 1 | 2;
  role: 'ADMIN' | 'AI' | 'AI + ADMIN' | 'ADMIN / LIVE';
  roleBadgeColor: string;
  title: string;
  subTitle: string;
  icon: string;
  phaseBadge: string;
  summaryTooltip: string;
}

export const AdminWorkflowStepper: React.FC<AdminWorkflowStepperProps> = ({
  currentStep,
  onStepClick,
  maxStepReached,
  maxStepAllowed,
  status,
  activityTitle,
  showPhaseFilter = true,
  defaultPhase = 'all',
  showLinearTrack = true,
}) => {
  // Determine effective max step allowed
  const effectiveMaxStep = maxStepReached ?? maxStepAllowed ?? currentStep;

  // Active phase tab view filter ('all', 'pre', 'post')
  const [phaseFilter, setPhaseFilter] = useState<'all' | 'pre' | 'post'>(defaultPhase);

  // Expanded details drawer for step inspection
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  // 9-Step Full End-to-End Workflow Definition
  const steps: StepDefinition[] = [
    // PHASE 1: INITIAL PROJECT & ACTIVITY CREATION (Steps 1-5)
    {
      step: 1,
      phase: 'pre',
      phaseNumber: 1,
      role: 'ADMIN',
      roleBadgeColor: 'bg-[#0c2340] text-white',
      title: 'สร้างกิจกรรม & แนบ TOR',
      subTitle: 'กรอกข้อมูลโครงการ & อัปโหลดเอกสารราชการ',
      icon: 'post_add',
      phaseBadge: 'ระยะสร้างกิจกรรม',
      summaryTooltip: 'กรอกชื่อ วันที่ สถานที่ วัตถุประสงค์ และแนบไฟล์ TOR / บันทึกข้อความเพื่อเตรียมสกัดข้อมูล',
    },
    {
      step: 2,
      phase: 'pre',
      phaseNumber: 1,
      role: 'AI',
      roleBadgeColor: 'bg-purple-700 text-white',
      title: 'AI ตรวจสอบเอกสาร',
      subTitle: 'วิเคราะห์ข้อมูล & สกัดสาระสำคัญ',
      icon: 'document_scanner',
      phaseBadge: 'ระยะสร้างกิจกรรม',
      summaryTooltip: 'AI ประมวลผลเอกสารราชการ สกัดวัตถุประสงค์ กลุ่มเป้าหมาย วิทยากร และตัวชี้วัดความสำเร็จ',
    },
    {
      step: 3,
      phase: 'pre',
      phaseNumber: 1,
      role: 'AI',
      roleBadgeColor: 'bg-purple-700 text-white',
      title: 'AI จัดทำ Survey',
      subTitle: 'สร้างแบบสอบถามจากเอกสาร',
      icon: 'auto_awesome',
      phaseBadge: 'ระยะสร้างกิจกรรม',
      summaryTooltip: 'AI ร่างแบบสอบถามประเมินผลตามข้อกำหนด TOR พร้อมมาตราส่วน Likert Scale 5 ระดับ',
    },
    {
      step: 4,
      phase: 'pre',
      phaseNumber: 1,
      role: 'ADMIN',
      roleBadgeColor: 'bg-[#0c2340] text-white',
      title: 'ADMIN ทวนแบบสอบถาม',
      subTitle: 'ตรวจสอบ Survey ที่ AI สร้างขึ้น',
      icon: 'fact_check',
      phaseBadge: 'ระยะสร้างกิจกรรม',
      summaryTooltip: 'ADMIN ตรวจสอบข้อคำถาม แก้ไข เพิ่มเติม หรือตัดข้อความให้ตรงตามวัตถุประสงค์',
    },
    {
      step: 5,
      phase: 'pre',
      phaseNumber: 1,
      role: 'ADMIN / LIVE',
      roleBadgeColor: 'bg-sky-700 text-white',
      title: 'ADMIN ยืนยัน / เปิดรับ',
      subTitle: 'ผูกแบบสอบถาม & ดำเนินกิจกรรม',
      icon: 'task_alt',
      phaseBadge: 'ระยะสร้างกิจกรรม',
      summaryTooltip: 'ADMIN อนุมัติผูกแบบสอบถามเข้ากับกิจกรรม และเปิดระบบรับคำตอบจากผู้เข้าร่วมผ่าน QR Code',
    },

    // PHASE 2: POST-PROJECT REPORTING & CLOSURE (Steps 6-9)
    {
      step: 6,
      phase: 'post',
      phaseNumber: 2,
      role: 'ADMIN',
      roleBadgeColor: 'bg-amber-700 text-white',
      title: 'เสร็จสิ้นโครงการ',
      subTitle: 'ยืนยันปิดรับผลประเมิน',
      icon: 'flag_circle',
      phaseBadge: 'ระยะรายงานผลสัมฤทธิ์',
      summaryTooltip: 'สรุปยอดผู้ตอบแบบประเมินครบถ้วน และ ADMIN กดยืนยันสิ้นสุดโครงการอย่างเป็นทางการ',
    },
    {
      step: 7,
      phase: 'post',
      phaseNumber: 2,
      role: 'ADMIN',
      roleBadgeColor: 'bg-slate-700 text-white',
      title: 'บันทึกรูปภาพ & หลักฐาน',
      subTitle: 'ภาพกิจกรรม (ข้อมูล OPTIONAL)',
      icon: 'add_photo_alternate',
      phaseBadge: 'ระยะรายงานผลสัมฤทธิ์',
      summaryTooltip: 'อัปโหลดภาพกิจกรรมจริงเพื่อใช้ประกอบข่าวและเป็นหลักฐาน (เป็นข้อมูลทางเลือก ไม่บังคับ)',
    },
    {
      step: 8,
      phase: 'post',
      phaseNumber: 2,
      role: 'AI + ADMIN',
      roleBadgeColor: 'bg-indigo-700 text-white',
      title: 'รายงาน / ข่าว AI',
      subTitle: 'AI สรุปผล & ร่างข่าวประชาสัมพันธ์',
      icon: 'edit_note',
      phaseBadge: 'ระยะรายงานผลสัมฤทธิ์',
      summaryTooltip: 'AI ช่วยวิเคราะห์ผลประเมิน สรุปตัวชี้วัด (KPIs) และร่างเนื้อหาข่าว โดย ADMIN เป็นผู้ตรวจสอบและแก้ไข',
    },
    {
      step: 9,
      phase: 'post',
      phaseNumber: 2,
      role: 'ADMIN',
      roleBadgeColor: 'bg-emerald-700 text-white',
      title: 'เผยแพร่สู่เว็บไซต์',
      subTitle: 'ตรวจทาน & เผยแพร่สู่สาธารณะ',
      icon: 'public',
      phaseBadge: 'ระยะรายงานผลสัมฤทธิ์',
      summaryTooltip: 'ADMIN ตรวจสอบความถูกต้องขั้นสุดท้าย และกดเผยแพร่ข่าวและผลสัมฤทธิ์ขึ้นเว็บไซต์พอร์ทัล',
    },
  ];

  // Completion calculation
  const isPublished = status === 'published' || (currentStep === 9 && status === 'published');

  const preSteps = steps.filter((s) => s.phase === 'pre');
  const postSteps = steps.filter((s) => s.phase === 'post');

  const preCompletedCount = Math.min(5, currentStep > 5 || isPublished ? 5 : Math.max(0, currentStep - 1));
  const postCompletedCount = isPublished
    ? 4
    : currentStep >= 6
    ? Math.min(4, Math.max(0, currentStep - 6))
    : 0;

  const totalCompletedCount = preCompletedCount + postCompletedCount;
  const overallPercentage = Math.round((totalCompletedCount / 9) * 100);

  const currentPhase: 'pre' | 'post' = currentStep <= 5 ? 'pre' : 'post';
  const activeStepDef = steps.find((s) => s.step === currentStep) || steps[0];

  // Helper to determine step status
  const getStepStatus = (stepNumber: number) => {
    if (isPublished) return 'completed';
    if (currentStep > stepNumber) return 'completed';
    if (currentStep === stepNumber) return 'active';
    return 'pending';
  };

  // Render individual step card
  const renderStepCard = (s: StepDefinition) => {
    const stepStatus = getStepStatus(s.step);
    const isCompleted = stepStatus === 'completed';
    const isCurrent = stepStatus === 'active';
    const isClickable = Boolean(
      onStepClick && (s.step <= effectiveMaxStep || s.step <= currentStep || isPublished)
    );

    const isPre = s.phase === 'pre';

    // Detailed style calculation with clear visual contrast
    let cardClasses = '';
    let numberBadgeClasses = '';
    let iconColor = '';
    let titleColor = '';

    if (isCompleted) {
      // Completed Step: Solid Emerald Green Theme with clear check
      cardClasses =
        'bg-emerald-50/60 border-2 border-emerald-400 text-slate-800 shadow-2xs hover:bg-emerald-50/90 hover:border-emerald-500';
      numberBadgeClasses = 'bg-emerald-600 text-white shadow-xs';
      iconColor = 'text-emerald-700';
      titleColor = 'text-slate-900 font-bold';
    } else if (isCurrent) {
      // Active Step: High-contrast pulsing theme with double ring
      if (isPre) {
        cardClasses =
          'bg-white border-2 border-sky-600 shadow-md ring-4 ring-sky-500/20';
        numberBadgeClasses = 'bg-sky-600 text-white shadow-md ring-2 ring-white';
        iconColor = 'text-sky-600';
        titleColor = 'text-sky-950 font-extrabold';
      } else {
        cardClasses =
          'bg-white border-2 border-amber-600 shadow-md ring-4 ring-amber-500/20';
        numberBadgeClasses = 'bg-amber-600 text-white shadow-md ring-2 ring-white';
        iconColor = 'text-amber-600';
        titleColor = 'text-amber-950 font-extrabold';
      }
    } else {
      // Pending / Future Step: Subtle muted theme
      cardClasses =
        'bg-slate-50/80 border border-slate-200 text-slate-500 opacity-80 hover:opacity-100 hover:border-slate-300';
      numberBadgeClasses = 'bg-slate-200 text-slate-600 border border-slate-300';
      iconColor = 'text-slate-400';
      titleColor = 'text-slate-700 font-medium';
    }

    return (
      <div
        key={s.step}
        id={`workflow-step-card-${s.step}`}
        onClick={() => {
          if (isClickable && onStepClick) {
            onStepClick(s.step);
          }
        }}
        onMouseEnter={() => setHoveredStep(s.step)}
        onMouseLeave={() => setHoveredStep(null)}
        className={`relative rounded-xl p-3 transition-all flex flex-col justify-between ${cardClasses} ${
          isClickable ? 'cursor-pointer' : 'cursor-default'
        }`}
      >
        {/* Active Step Beacon Banner */}
        {isCurrent && (
          <div className="absolute -top-2.5 right-3 z-10">
            <span
              className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full shadow-xs text-white flex items-center gap-1 ${
                isPre ? 'bg-sky-600' : 'bg-amber-600'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              <span>กำลังดำเนินการ</span>
            </span>
          </div>
        )}

        {/* Card Header: Step number, phase badge & role */}
        <div>
          <div className="flex items-center justify-between gap-1 mb-2">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-transform ${numberBadgeClasses}`}
              >
                {isCompleted ? (
                  <span className="material-symbols-outlined text-[15px]">check</span>
                ) : (
                  s.step
                )}
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                STEP {s.step}
              </span>
            </div>

            <span
              className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase ${s.roleBadgeColor}`}
            >
              {s.role}
            </span>
          </div>

          {/* Title & Subtitle */}
          <div className="flex items-start gap-2">
            <span className={`material-symbols-outlined text-[18px] shrink-0 mt-0.5 ${iconColor}`}>
              {s.icon}
            </span>
            <div className="min-w-0">
              <h4 className={`text-[12px] leading-snug truncate ${titleColor}`}>
                {s.title}
              </h4>
              <p className="text-[10.5px] text-slate-500 leading-tight mt-0.5 line-clamp-2">
                {s.subTitle}
              </p>
            </div>
          </div>
        </div>

        {/* Footer: State status pill */}
        <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
          <span className="text-slate-400 font-medium">สถานะ:</span>
          {isCompleted ? (
            <span className="text-emerald-700 bg-emerald-100/90 border border-emerald-300 font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[12px]">done_all</span>
              <span>เสร็จสิ้นแล้ว</span>
            </span>
          ) : isCurrent ? (
            <span
              className={`font-bold px-1.5 py-0.2 rounded flex items-center gap-1 ${
                isPre
                  ? 'text-sky-800 bg-sky-100 border border-sky-300'
                  : 'text-amber-900 bg-amber-100 border border-amber-300'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isPre ? 'bg-sky-600' : 'bg-amber-600'
                }`}
              ></span>
              <span>ขั้นตอนปัจจุบัน</span>
            </span>
          ) : (
            <span className="text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.2 rounded">
              รอดำเนินการ
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      id="admin-workflow-stepper-container"
      className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3.5 text-slate-800"
    >
      {/* Top Banner: Workflow Header & Phase Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#0c2340] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[17px]">account_tree</span>
            </span>
            <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">
              เส้นทางดำเนินงาน 9 ขั้นตอน (End-to-End Activity &amp; AI Lifecycle)
            </h3>
            {activityTitle && (
              <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 truncate max-w-xs">
                {activityTitle}
              </span>
            )}
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/90 border border-emerald-300 px-2 py-0.5 rounded-full">
              สำเร็จแล้ว {totalCompletedCount}/9 ขั้นตอน ({overallPercentage}%)
            </span>
          </div>
          <p className="text-[11.5px] text-slate-500 mt-1">
            ครอบคลุมระยะสร้างกิจกรรมเริ่มต้น (ขั้นตอน 1-5) และระยะรายงานผลสัมฤทธิ์หลังจัดกิจกรรม (ขั้นตอน 6-9)
          </p>
        </div>

        {/* Phase Navigation Tabs & Filter */}
        {showPhaseFilter && (
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/80 shrink-0 text-[11px]">
            <button
              id="stepper-filter-all"
              type="button"
              onClick={() => setPhaseFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                phaseFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">view_column</span>
              <span>ทุกขั้นตอน (1-9)</span>
            </button>

            <button
              id="stepper-filter-pre"
              type="button"
              onClick={() => setPhaseFilter('pre')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                phaseFilter === 'pre'
                  ? 'bg-[#0c2340] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              <span>ระยะสร้างกิจกรรม (1-5)</span>
              <span className="text-[10px] px-1 py-0.2 rounded-full bg-white/20">
                {preCompletedCount}/5
              </span>
            </button>

            <button
              id="stepper-filter-post"
              type="button"
              onClick={() => setPhaseFilter('post')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                phaseFilter === 'post'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>ระยะรายงานผลสัมฤทธิ์ (6-9)</span>
              <span className="text-[10px] px-1 py-0.2 rounded-full bg-white/20">
                {postCompletedCount}/4
              </span>
            </button>
          </div>
        )}
      </div>

      {/* 9-STEP UNIFIED HORIZONTAL PROGRESS TRACK (Stepline) */}
      {showLinearTrack && (
        <div className="bg-slate-50/90 rounded-xl border border-slate-200/90 p-3 space-y-2">
          {/* Phase Brackets Header */}
          <div className="grid grid-cols-9 gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
            <div className="col-span-5 flex items-center gap-1.5 text-sky-800 bg-sky-100/70 border border-sky-200/70 rounded-md px-2 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
              <span>ระยะที่ 1: การสร้างกิจกรรม &amp; จัดทำ Survey (Steps 1–5)</span>
              <span className="ml-auto text-[9.5px] font-semibold text-sky-700">
                {preCompletedCount}/5 เสร็จ
              </span>
            </div>
            <div className="col-span-4 flex items-center gap-1.5 text-emerald-800 bg-emerald-100/70 border border-emerald-200/70 rounded-md px-2 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              <span>ระยะที่ 2: รายงานผลสัมฤทธิ์ &amp; เผยแพร่ (Steps 6–9)</span>
              <span className="ml-auto text-[9.5px] font-semibold text-emerald-700">
                {postCompletedCount}/4 เสร็จ
              </span>
            </div>
          </div>

          {/* Interactive Stepline Rail */}
          <div className="relative pt-1 pb-1">
            {/* Background Rail Line */}
            <div className="absolute top-1/2 left-4 right-4 h-1.5 -translate-y-1/2 bg-slate-200 rounded-full z-0">
              {/* Completed Fill Bar */}
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(
                      0,
                      ((totalCompletedCount + (currentStep <= 9 && !isPublished ? 0.4 : 0)) / 9) * 100
                    )
                  )}%`,
                }}
              ></div>
            </div>

            {/* 9 Step Rail Nodes */}
            <div className="relative z-10 grid grid-cols-9 gap-1">
              {steps.map((s) => {
                const stepStatus = getStepStatus(s.step);
                const isCompleted = stepStatus === 'completed';
                const isCurrent = stepStatus === 'active';
                const isClickable = Boolean(
                  onStepClick && (s.step <= effectiveMaxStep || s.step <= currentStep || isPublished)
                );

                let nodeCircle = 'bg-white border-2 border-slate-300 text-slate-500';
                if (isCompleted) {
                  nodeCircle = 'bg-emerald-600 border-2 border-emerald-600 text-white shadow-xs';
                } else if (isCurrent) {
                  nodeCircle =
                    s.phase === 'pre'
                      ? 'bg-sky-600 border-2 border-white text-white ring-4 ring-sky-500/30 shadow-md'
                      : 'bg-amber-600 border-2 border-white text-white ring-4 ring-amber-500/30 shadow-md';
                }

                return (
                  <div
                    key={s.step}
                    onClick={() => {
                      if (isClickable && onStepClick) {
                        onStepClick(s.step);
                      }
                    }}
                    className={`flex flex-col items-center text-center group ${
                      isClickable ? 'cursor-pointer' : 'cursor-default'
                    }`}
                    title={`Step ${s.step}: ${s.title} (${s.role})`}
                  >
                    {/* Node Dot */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-transform group-hover:scale-110 ${nodeCircle}`}
                    >
                      {isCompleted ? (
                        <span className="material-symbols-outlined text-[16px]">check</span>
                      ) : (
                        s.step
                      )}
                    </div>

                    {/* Node Mini Label */}
                    <div className="mt-1 w-full px-0.5">
                      <span
                        className={`text-[9.5px] line-clamp-1 leading-tight font-medium ${
                          isCurrent
                            ? 'text-slate-900 font-extrabold'
                            : isCompleted
                            ? 'text-emerald-800 font-bold'
                            : 'text-slate-400'
                        }`}
                      >
                        {s.title}
                      </span>
                      <span
                        className={`text-[8.5px] block font-bold ${
                          isCompleted
                            ? 'text-emerald-700'
                            : isCurrent
                            ? 'text-sky-700'
                            : 'text-slate-400'
                        }`}
                      >
                        {isCompleted ? '✓ เสร็จ' : isCurrent ? '● กำลังทำ' : `รอ`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Active Step Focus Callout */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl border text-[11.5px] ${
          currentPhase === 'pre'
            ? 'bg-sky-50/80 border-sky-200/90 text-sky-950'
            : 'bg-amber-50/80 border-amber-200/90 text-amber-950'
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full animate-pulse ${
              currentPhase === 'pre' ? 'bg-sky-600' : 'bg-amber-600'
            }`}
          ></span>
          <span className="font-bold">ขั้นตอนปัจจุบัน:</span>
          <span className="font-extrabold underline decoration-2">
            STEP {activeStepDef.step}: {activeStepDef.title}
          </span>
          <span
            className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${activeStepDef.roleBadgeColor}`}
          >
            ผู้รับผิดชอบ: {activeStepDef.role}
          </span>
          <span className="text-slate-600 hidden md:inline">
            — {activeStepDef.summaryTooltip}
          </span>
        </div>

        {/* Quick Phase Switcher Controls */}
        <div className="flex items-center gap-2 shrink-0 font-medium">
          {currentPhase === 'pre' ? (
            <button
              id="stepper-quick-goto-post"
              type="button"
              onClick={() => {
                setPhaseFilter('post');
                if (onStepClick && effectiveMaxStep >= 6) {
                  onStepClick(6);
                }
              }}
              className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 cursor-pointer bg-white/70 px-2 py-0.5 rounded border border-emerald-200"
            >
              <span>ดูระยะรายงานผลสัมฤทธิ์ (Steps 6-9)</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          ) : (
            <button
              id="stepper-quick-goto-pre"
              type="button"
              onClick={() => {
                setPhaseFilter('pre');
                if (onStepClick) {
                  onStepClick(Math.min(5, effectiveMaxStep));
                }
              }}
              className="text-[11px] font-semibold text-sky-800 hover:text-sky-900 flex items-center gap-1 cursor-pointer bg-white/70 px-2 py-0.5 rounded border border-sky-200"
            >
              <span className="material-symbols-outlined text-[14px]">arrow_back</span>
              <span>ย้อนดูระยะสร้างกิจกรรม (Steps 1-5)</span>
            </button>
          )}
        </div>
      </div>

      {/* RENDER STEPS: PHASING LAYOUT */}
      {(phaseFilter === 'all' || phaseFilter === 'pre') && (
        <div
          id="stepper-phase-1-section"
          className="rounded-xl border border-sky-200/80 bg-sky-50/15 p-3 space-y-2.5 transition-all"
        >
          {/* Phase 1 Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-sky-100 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-[#0c2340] text-white flex items-center justify-center text-[10px] font-bold">
                1
              </span>
              <h4 className="text-[12.5px] font-bold text-[#0c2340]">
                ระยะที่ 1: การสร้างกิจกรรม &amp; จัดทำ Survey (Initial Project &amp; Activity Setup: Steps 1-5)
              </h4>
              <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-sky-100 text-sky-700 border border-sky-200">
                เสร็จสิ้น {preCompletedCount}/5
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              การเตรียมเอกสารราชการ, AI วิเคราะห์ TOR, ร่างแบบประเมิน Likert และ ADMIN ทวนยืนยัน
            </p>
          </div>

          {/* Grid of Steps 1-5 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {preSteps.map(renderStepCard)}
          </div>
        </div>
      )}

      {/* Transition Pipeline Connector */}
      {phaseFilter === 'all' && (
        <div
          id="stepper-transition-bridge"
          className="relative flex items-center justify-center py-1"
        >
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dashed border-slate-300"></div>
          </div>
          <div className="relative bg-white px-3.5 py-1 rounded-full border border-slate-300 shadow-2xs flex items-center gap-2 text-[11px] text-slate-600">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="font-bold text-[#0c2340]">ช่วงดำเนินกิจกรรม:</span>
            <span>จัดกิจกรรมตามกำหนดการ &amp; เปิดรับคำตอบแบบประเมินจากผู้เข้าร่วม</span>
            <span className="material-symbols-outlined text-[15px] text-slate-400">
              arrow_downward
            </span>
          </div>
        </div>
      )}

      {/* Phase 2: Post-Project Reporting & Closure (Steps 6-9) */}
      {(phaseFilter === 'all' || phaseFilter === 'post') && (
        <div
          id="stepper-phase-2-section"
          className="rounded-xl border border-emerald-200/80 bg-emerald-50/15 p-3 space-y-2.5 transition-all"
        >
          {/* Phase 2 Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-emerald-100 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold">
                2
              </span>
              <h4 className="text-[12.5px] font-bold text-emerald-950">
                ระยะที่ 2: รายงานผลสัมฤทธิ์ &amp; เผยแพร่ผลงาน (Post-Project Reporting &amp; Closure Phase: Steps 6-9)
              </h4>
              <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                เสร็จสิ้น {postCompletedCount}/4
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              ปิดรับแบบประเมิน, บันทึกภาพหลักฐาน (Optional), AI สรุปผลสัมฤทธิ์และร่างข่าว, และ ADMIN เผยแพร่สู่เว็บไซต์
            </p>
          </div>

          {/* Grid of Steps 6-9 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
            {postSteps.map(renderStepCard)}
          </div>
        </div>
      )}

      {/* Hovered Step Detailed Summary Drawer */}
      {hoveredStep && (
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2 text-[11px] text-slate-600 animate-in fade-in duration-150">
          <span className="material-symbols-outlined text-[16px] text-sky-600">info</span>
          <span className="font-semibold text-slate-900">
            STEP {hoveredStep} - {steps[hoveredStep - 1].title}:
          </span>
          <span>{steps[hoveredStep - 1].summaryTooltip}</span>
        </div>
      )}
    </div>
  );
};
