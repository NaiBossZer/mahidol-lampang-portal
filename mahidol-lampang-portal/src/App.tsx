import React, { useState } from 'react';
import { ACTIVITIES_DATA } from './data/activities';
import {
  INITIAL_PROJECT,
  INITIAL_ADMIN_ACTIVITIES,
  SAMPLE_OFFICIAL_DOCS,
  SAMPLE_AI_EXTRACTED_ENTITIES,
  SAMPLE_AI_SURVEY,
} from './data/adminWorkflow';
import {
  AdminActivityItem,
  OfficialDocument,
  AiExtractedEntity,
  AiGeneratedSurvey,
} from './types';

// Layout Components
import { Sidebar } from './components/Sidebar';
import { Header, BreadcrumbItem } from './components/Header';
import { NotificationPopover } from './components/NotificationPopover';
import { UserProfileMenu } from './components/UserProfileMenu';

// Admin AI-Workflow Components
import { AdminProjectOverview } from './components/AdminProjectOverview';
import { AdminWorkflowStepper } from './components/AdminWorkflowStepper';
import { Step1CreateActivity } from './components/Step1CreateActivity';
import { Step2AiDocAnalysis } from './components/Step2AiDocAnalysis';
import { Step3AiSurveyGeneration } from './components/Step3AiSurveyGeneration';
import { Step4AdminReviewSurvey } from './components/Step4AdminReviewSurvey';
import { Step5AdminConfirm } from './components/Step5AdminConfirm';
import { ActivityDetailView } from './components/ActivityDetailView';
import { OfficialDocsRepository } from './components/OfficialDocsRepository';
import { AiWorkspaceStudio } from './components/AiWorkspaceStudio';
import { UserManagementView } from './components/UserManagementView';
import { NotificationsCenterView } from './components/NotificationsCenterView';
import { SystemSettingsView } from './components/SystemSettingsView';

// Executive Analytics Components
import { FilterBar } from './components/FilterBar';
import { HeroBanner } from './components/HeroBanner';
import { KpiCards } from './components/KpiCards';
import { OverallScoreGauge } from './components/OverallScoreGauge';
import { DemographicsChart } from './components/DemographicsChart';
import { ActivityGallery } from './components/ActivityGallery';
import { RecentActivitiesTable } from './components/RecentActivitiesTable';
import { AspectScores } from './components/AspectScores';
import { RespondentGroups } from './components/RespondentGroups';
import { AwarenessChannels } from './components/AwarenessChannels';
import { ScoreDistribution } from './components/ScoreDistribution';
import { KeyAspects } from './components/KeyAspects';
import { FeedbackComments } from './components/FeedbackComments';
import { PhotoGalleryModal } from './components/PhotoGalleryModal';
import { AllReportsModal } from './components/AllReportsModal';
import { AllCommentsModal } from './components/AllCommentsModal';
import { KpiDetailModal } from './components/KpiDetailModal';

export default function App() {
  // Navigation: 'analytics' (Default view), 'home' (Project Overview), 'workflow' (5-Step AI Survey flow), 'activity-detail', 'docs', etc.
  const [activeNav, setActiveNav] = useState<'home' | 'workflow' | 'activity-detail' | 'analytics' | 'docs' | string>('analytics');

  // Admin Project & Activities state
  const [project] = useState(INITIAL_PROJECT);
  const [adminActivities, setAdminActivities] = useState<AdminActivityItem[]>(INITIAL_ADMIN_ACTIVITIES);
  const [selectedAdminActivity, setSelectedAdminActivity] = useState<AdminActivityItem>(INITIAL_ADMIN_ACTIVITIES[0]);

  // AI Workflow Stepper state
  const [workflowStep, setWorkflowStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [maxWorkflowStepReached, setMaxWorkflowStepReached] = useState<number>(1);

  // Workflow In-Flight Draft Data
  const [draftActivityName, setDraftActivityName] = useState('ENVI Mahidol ร่วมใจ พัฒนาชุมชน');
  const [draftActivityDate, setDraftActivityDate] = useState('14 กันยายน 2568');
  const [draftLocation, setDraftLocation] = useState('อาคารอเนกประสงค์ มหาวิทยาลัยมหิดล วิทยาเขตลำปาง');
  const [draftFaculty, setDraftFaculty] = useState(INITIAL_PROJECT.faculty);
  const [draftCampus, setDraftCampus] = useState(INITIAL_PROJECT.campus);
  const [draftTargetCount, setDraftTargetCount] = useState(30);
  const [draftResponsible, setDraftResponsible] = useState('ดร. เกียรติศักดิ์ (ประธานโครงการ)');
  const [draftDocs, setDraftDocs] = useState<OfficialDocument[]>(SAMPLE_OFFICIAL_DOCS);
  const [extractedEntities, setExtractedEntities] = useState<AiExtractedEntity[]>(SAMPLE_AI_EXTRACTED_ENTITIES);
  const [generatedSurvey, setGeneratedSurvey] = useState<AiGeneratedSurvey>(SAMPLE_AI_SURVEY);

  // Analytics Executive Dashboard state
  const [activities] = useState(ACTIVITIES_DATA);
  const [selectedActivityId, setSelectedActivityId] = useState<string>(ACTIVITIES_DATA[0].id);
  const [period, setPeriod] = useState('ปีงบประมาณ 2568');
  const [faculty, setFaculty] = useState('คณะสิ่งแวดล้อมและทรัพยากรศาสตร์');
  const [survey, setSurvey] = useState('ความพึงพอใจผู้เข้าร่วม');

  // UI / Modal states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [reportsModalOpen, setReportsModalOpen] = useState(false);
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [kpiModalMetric, setKpiModalMetric] = useState<string | null>(null);

  const currentActivity = activities.find((a) => a.id === selectedActivityId) || activities[0];

  // Helper to start fresh 5-step workflow
  const handleStartCreateActivity = () => {
    setDraftActivityName('ENVI Mahidol ร่วมใจ พัฒนาชุมชน');
    setDraftActivityDate('14 กันยายน 2568');
    setDraftLocation('อาคารอเนกประสงค์ มหาวิทยาลัยมหิดล วิทยาเขตลำปาง');
    setDraftDocs(SAMPLE_OFFICIAL_DOCS);
    setWorkflowStep(1);
    setMaxWorkflowStepReached(1);
    setActiveNav('workflow');
  };

  // Step 1 -> Step 2
  const handleProceedToStep2 = (data: {
    name: string;
    date: string;
    location: string;
    faculty: string;
    campus: string;
    targetCount: number;
    responsiblePerson: string;
    documents: OfficialDocument[];
  }) => {
    setDraftActivityName(data.name);
    setDraftActivityDate(data.date);
    setDraftLocation(data.location);
    setDraftFaculty(data.faculty);
    setDraftCampus(data.campus);
    setDraftTargetCount(data.targetCount);
    setDraftResponsible(data.responsiblePerson);
    setDraftDocs(data.documents);

    setWorkflowStep(2);
    setMaxWorkflowStepReached((prev) => Math.max(prev, 2));
  };

  // Step 2 -> Step 3
  const handleProceedToStep3 = (entities: AiExtractedEntity[]) => {
    setExtractedEntities(entities);
    setWorkflowStep(3);
    setMaxWorkflowStepReached((prev) => Math.max(prev, 3));
  };

  // Step 3 -> Step 4
  const handleProceedToStep4 = (surveyObj: AiGeneratedSurvey) => {
    setGeneratedSurvey(surveyObj);
    setWorkflowStep(4);
    setMaxWorkflowStepReached((prev) => Math.max(prev, 4));
  };

  // Step 4 -> Step 5
  const handleProceedToStep5 = () => {
    setWorkflowStep(5);
    setMaxWorkflowStepReached((prev) => Math.max(prev, 5));
  };

  // Step 5 Confirmation & Survey Assignment
  const handleFinalConfirm = () => {
    const newActivity: AdminActivityItem = {
      id: `act-${Date.now()}`,
      projectId: project.id,
      projectName: project.name,
      name: draftActivityName,
      code: `ACT-68-0${adminActivities.length + 1}`,
      date: draftActivityDate,
      faculty: draftFaculty,
      campus: draftCampus,
      location: draftLocation,
      targetCount: draftTargetCount,
      responsiblePerson: draftResponsible,
      status: 'survey_assigned',
      statusLabel: 'ผูกแบบสอบถามแล้ว (Survey Assigned)',
      currentStep: 5,
      officialDocs: draftDocs,
      aiExtractedEntities: extractedEntities,
      survey: {
        ...generatedSurvey,
        status: 'confirmed_and_assigned',
      },
    };

    setAdminActivities((prev) => [newActivity, ...prev]);
    setSelectedAdminActivity(newActivity);
    setActiveNav('activity-detail');
  };

  const handleUpdateAdminActivity = (updated: AdminActivityItem) => {
    setAdminActivities((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
    setSelectedAdminActivity(updated);
  };

  const handleSelectActivityFromOverview = (act: AdminActivityItem) => {
    setSelectedAdminActivity(act);
    setActiveNav('activity-detail');
  };

  const handleGoToAnalytics = (activityId: string) => {
    setSelectedActivityId(activityId);
    setActiveNav('analytics');
  };

  // Compute Breadcrumbs
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    if (activeNav === 'analytics') {
      return [
        { label: 'รายการกิจกรรมโครงการ', onClick: () => setActiveNav('home') },
        {
          label: 'รายงานผลสัมฤทธิ์รายกิจกรรม',
          active: true,
        },
      ];
    }

    const crumbs: BreadcrumbItem[] = [
      { label: 'รายการกิจกรรมโครงการ', onClick: () => setActiveNav('home') },
    ];

    if (activeNav === 'home') {
      crumbs.push({ label: 'รายการกิจกรรมโครงการ', active: true });
    } else if (activeNav === 'workflow') {
      crumbs.push({ label: project.name, onClick: () => setActiveNav('home') });
      crumbs.push({
        label: `AI-assisted Activity & Survey Workflow (STEP ${workflowStep})`,
        active: true,
      });
    } else if (activeNav === 'activity-detail') {
      crumbs.push({ label: project.name, onClick: () => setActiveNav('home') });
      crumbs.push({
        label: `รายละเอียดกิจกรรม: ${selectedAdminActivity.name}`,
        active: true,
      });
    } else if (activeNav === 'docs') {
      crumbs.push({ label: project.name, onClick: () => setActiveNav('home') });
      crumbs.push({ label: 'คลังเอกสารราชการ', active: true });
    } else if (activeNav === 'ai-workspace') {
      crumbs.push({ label: project.name, onClick: () => setActiveNav('home') });
      crumbs.push({ label: 'AI Assistant Studio', active: true });
    } else if (activeNav === 'users') {
      crumbs.push({ label: project.name, onClick: () => setActiveNav('home') });
      crumbs.push({ label: 'ผู้ใช้งาน & สิทธิ์การเข้าถึง (User Management & RBAC)', active: true });
    } else if (activeNav === 'notifications') {
      crumbs.push({ label: project.name, onClick: () => setActiveNav('home') });
      crumbs.push({ label: 'ศูนย์การแจ้งเตือนระบบ (Notification Center)', active: true });
    } else if (activeNav === 'settings') {
      crumbs.push({ label: project.name, onClick: () => setActiveNav('home') });
      crumbs.push({ label: 'ตั้งค่าระบบ (System Configuration & Governance)', active: true });
    }

    return crumbs;
  };

  return (
    <div className="bg-[#f4f6fb] text-slate-800 antialiased min-h-screen flex text-[13px]">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeNav={activeNav}
        setActiveNav={(nav) => {
          if (nav === 'workflow') {
            handleStartCreateActivity();
          } else {
            setActiveNav(nav);
          }
        }}
        onOpenProfile={() => setProfileOpen(!profileOpen)}
      />

      {/* Main Content Area */}
      <div className="pl-0 lg:pl-[245px] flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Top Header */}
        <div className="relative">
          <Header
            breadcrumbs={getBreadcrumbs()}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onOpenNotifications={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileOpen(false);
            }}
            onOpenProfile={() => {
              setProfileOpen(!profileOpen);
              setNotificationsOpen(false);
            }}
          />

          {/* Notifications Dropdown */}
          <NotificationPopover
            isOpen={notificationsOpen}
            onClose={() => setNotificationsOpen(false)}
            onViewAll={() => setActiveNav('notifications')}
          />

          {/* User Profile Menu */}
          <UserProfileMenu
            isOpen={profileOpen}
            onClose={() => setProfileOpen(false)}
            onNavigate={(nav) => setActiveNav(nav)}
          />
        </div>

        {/* Dynamic Content Views */}
        <main className="max-w-[1440px] w-full mx-auto p-4 space-y-3 pb-8">
          {/* VIEW 1: ADMIN PROJECT OVERVIEW (Home) */}
          {activeNav === 'home' && (
            <AdminProjectOverview
              project={project}
              activities={adminActivities}
              onSelectActivity={handleSelectActivityFromOverview}
              onCreateActivity={handleStartCreateActivity}
              onGoToAnalytics={handleGoToAnalytics}
            />
          )}

          {/* VIEW 2: 5-STEP AI WORKFLOW */}
          {activeNav === 'workflow' && (
            <div className="space-y-4">
              {/* Stepper Navigation across top */}
              <AdminWorkflowStepper
                currentStep={workflowStep}
                onStepClick={(s) => {
                  if (s <= 5) {
                    setWorkflowStep(s as 1 | 2 | 3 | 4 | 5);
                  } else {
                    setActiveNav('activity-detail');
                  }
                }}
                maxStepReached={maxWorkflowStepReached}
                activityTitle={draftActivityName}
              />

              {/* Step 1: Admin Create Activity & Upload Official Documents */}
              {workflowStep === 1 && (
                <Step1CreateActivity
                  project={project}
                  onProceedToStep2={handleProceedToStep2}
                  onCancel={() => setActiveNav('home')}
                />
              )}

              {/* Step 2: AI Document Analysis */}
              {workflowStep === 2 && (
                <Step2AiDocAnalysis
                  activityName={draftActivityName}
                  documents={draftDocs}
                  onProceedToStep3={handleProceedToStep3}
                  onBackToStep1={() => setWorkflowStep(1)}
                />
              )}

              {/* Step 3: AI Survey Generation */}
              {workflowStep === 3 && (
                <Step3AiSurveyGeneration
                  activityName={draftActivityName}
                  extractedEntities={extractedEntities}
                  onProceedToStep4={handleProceedToStep4}
                  onBackToStep2={() => setWorkflowStep(2)}
                />
              )}

              {/* Step 4: Admin Review Survey */}
              {workflowStep === 4 && (
                <Step4AdminReviewSurvey
                  activityName={draftActivityName}
                  survey={generatedSurvey}
                  onProceedToStep5={handleProceedToStep5}
                  onBackToStep3={() => setWorkflowStep(3)}
                />
              )}

              {/* Step 5: Admin Confirmation & Survey Assignment */}
              {workflowStep === 5 && (
                <Step5AdminConfirm
                  project={project}
                  activityName={draftActivityName}
                  activityCode={`ACT-68-0${adminActivities.length + 1}`}
                  activityDate={draftActivityDate}
                  location={draftLocation}
                  documents={draftDocs}
                  survey={generatedSurvey}
                  onConfirmAndAssign={handleFinalConfirm}
                  onBackToStep4={() => setWorkflowStep(4)}
                />
              )}
            </div>
          )}

          {/* VIEW 3: ACTIVITY DETAIL (Survey Assigned & Post-Project Workflow) */}
          {activeNav === 'activity-detail' && (
            <ActivityDetailView
              activity={selectedAdminActivity}
              project={project}
              onGoToAnalytics={handleGoToAnalytics}
              onCreateNewActivity={handleStartCreateActivity}
              onBackToProject={() => setActiveNav('home')}
              onUpdateActivity={handleUpdateAdminActivity}
            />
          )}

          {/* VIEW 4: OFFICIAL DOCUMENTS REPOSITORY */}
          {activeNav === 'docs' && (
            <OfficialDocsRepository
              project={project}
              documents={SAMPLE_OFFICIAL_DOCS}
              onUploadNew={handleStartCreateActivity}
            />
          )}

          {/* VIEW 5: EXECUTIVE ANALYTICS DASHBOARD */}
          {activeNav === 'analytics' && (
            <div className="space-y-2.5">
              {/* Top Banner & Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">
                      รายงานผลสัมฤทธิ์รายกิจกรรม
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-sky-100 text-sky-700 border border-sky-200 shadow-2xs">
                      แบบสอบถาม: ผูกกับกิจกรรมแล้ว
                    </span>
                  </div>
                  <p className="text-[12px] text-slate-500 mt-0.5">
                    วิเคราะห์ข้อมูลผลประเมิน การมีส่วนร่วมและความพึงพอใจ จากแบบสอบถามที่ผ่านการทวนและยืนยันโดย ADMIN
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveNav('home')}
                    className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-[12px] shadow-xs hover:shadow transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      arrow_back
                    </span>
                    <span>กลับหน้ารายการกิจกรรมโครงการ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReportsModalOpen(true)}
                    className="bg-sky-700 hover:bg-sky-800 text-white font-medium px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 text-[12px] shadow-xs hover:shadow transition-all cursor-pointer"
                  >
                    <span>ดูรายงานสรุปทั้งหมด</span>
                    <span className="material-symbols-outlined text-[16px]">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>

              {/* Filter Bar */}
              <FilterBar
                activities={activities}
                selectedActivityId={selectedActivityId}
                onSelectActivity={(id) => setSelectedActivityId(id)}
                period={period}
                setPeriod={setPeriod}
                faculty={faculty}
                setFaculty={setFaculty}
                survey={survey}
                setSurvey={setSurvey}
                onResetFilters={() => setSelectedActivityId(ACTIVITIES_DATA[0].id)}
              />

              {/* Hero Banner */}
              <HeroBanner
                activity={currentActivity}
                onOpenImage={(url) => {
                  const idx = currentActivity.photos.indexOf(url);
                  setActivePhotoIndex(idx >= 0 ? idx : 0);
                  setPhotoModalOpen(true);
                }}
              />

              {/* 5 KPI Cards */}
              <KpiCards
                activity={currentActivity}
                onViewDetails={(metric) => setKpiModalMetric(metric)}
              />

              {/* 3-Column Analytics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 items-start gap-3">
                {/* Left Column (4 cols) */}
                <div className="lg:col-span-4 space-y-2.5">
                  <OverallScoreGauge activity={currentActivity} />
                  <DemographicsChart activity={currentActivity} />
                  <ActivityGallery
                    activity={currentActivity}
                    onViewAllPhotos={() => {
                      setActivePhotoIndex(0);
                      setPhotoModalOpen(true);
                    }}
                    onOpenPhoto={(url) => {
                      const idx = currentActivity.photos.indexOf(url);
                      setActivePhotoIndex(idx >= 0 ? idx : 0);
                      setPhotoModalOpen(true);
                    }}
                  />
                  <RecentActivitiesTable
                    activities={activities}
                    selectedActivityId={selectedActivityId}
                    onSelectActivity={(id) => setSelectedActivityId(id)}
                  />
                </div>

                {/* Center Column (5 cols) */}
                <div className="lg:col-span-5 space-y-2.5">
                  <AspectScores activity={currentActivity} />
                  <RespondentGroups activity={currentActivity} />
                  <AwarenessChannels activity={currentActivity} />
                </div>

                {/* Right Column (3 cols) */}
                <div className="lg:col-span-3 space-y-2.5">
                  <ScoreDistribution activity={currentActivity} />
                  <KeyAspects
                    activity={currentActivity}
                    onViewAllAspects={() => setReportsModalOpen(true)}
                  />
                  <FeedbackComments
                    activity={currentActivity}
                    onViewAllComments={() => setCommentsModalOpen(true)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* VIEW 6: AI ASSISTANT STUDIO */}
          {activeNav === 'ai-workspace' && (
            <AiWorkspaceStudio
              project={project}
              onNavigateToWorkflow={handleStartCreateActivity}
              onNavigateToDocs={() => setActiveNav('docs')}
            />
          )}

          {/* VIEW 7: USERS & PERMISSIONS (RBAC) */}
          {activeNav === 'users' && <UserManagementView />}

          {/* VIEW 8: NOTIFICATION CENTER */}
          {activeNav === 'notifications' && (
            <NotificationsCenterView onNavigate={(nav) => setActiveNav(nav)} />
          )}

          {/* VIEW 9: SYSTEM SETTINGS & GOVERNANCE */}
          {activeNav === 'settings' && <SystemSettingsView />}
        </main>
      </div>

      {/* Lightbox / Gallery Modal */}
      <PhotoGalleryModal
        isOpen={photoModalOpen}
        photos={currentActivity.photos}
        initialIndex={activePhotoIndex}
        activityTitle={currentActivity.name}
        onClose={() => setPhotoModalOpen(false)}
      />

      {/* All Reports Modal */}
      <AllReportsModal
        isOpen={reportsModalOpen}
        activities={activities}
        onSelectActivity={(id) => setSelectedActivityId(id)}
        onClose={() => setReportsModalOpen(false)}
      />

      {/* All Comments Modal */}
      <AllCommentsModal
        isOpen={commentsModalOpen}
        activity={currentActivity}
        onClose={() => setCommentsModalOpen(false)}
      />

      {/* KPI Detail Modal */}
      <KpiDetailModal
        isOpen={!!kpiModalMetric}
        metricName={kpiModalMetric}
        activity={currentActivity}
        onClose={() => setKpiModalMetric(null)}
      />
    </div>
  );
}
