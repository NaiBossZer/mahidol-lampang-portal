import React, { useState } from 'react';
import { ACTIVITIES_DATA } from './data/activities';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
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
import { NotificationPopover } from './components/NotificationPopover';
import { UserProfileMenu } from './components/UserProfileMenu';

export default function App() {
  const [activities] = useState(ACTIVITIES_DATA);
  const [selectedActivityId, setSelectedActivityId] = useState<string>(
    ACTIVITIES_DATA[0].id
  );

  // Filter states
  const [period, setPeriod] = useState('ปีงบประมาณ 2568');
  const [faculty, setFaculty] = useState('คณะสิ่งแวดล้อมและทรัพยากรศาสตร์');
  const [survey, setSurvey] = useState('ความพึงพอใจผู้เข้าร่วม');

  // Navigation & UI states
  const [activeNav, setActiveNav] = useState('analytics');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Modals
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [reportsModalOpen, setReportsModalOpen] = useState(false);
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [kpiModalMetric, setKpiModalMetric] = useState<string | null>(null);

  // Current active activity
  const currentActivity =
    activities.find((a) => a.id === selectedActivityId) || activities[0];

  const handleResetFilters = () => {
    setSelectedActivityId(ACTIVITIES_DATA[0].id);
    setPeriod('ปีงบประมาณ 2568');
    setFaculty('คณะสิ่งแวดล้อมและทรัพยากรศาสตร์');
    setSurvey('ความพึงพอใจผู้เข้าร่วม');
  };

  const handleOpenPhoto = (url: string) => {
    const idx = currentActivity.photos.indexOf(url);
    setActivePhotoIndex(idx >= 0 ? idx : 0);
    setPhotoModalOpen(true);
  };

  return (
    <div className="bg-[#f4f6fb] text-slate-800 antialiased min-h-screen flex text-[13px]">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        onOpenProfile={() => setProfileOpen(!profileOpen)}
      />

      {/* Main Content Area */}
      <div className="pl-0 lg:pl-[245px] flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Top Header */}
        <div className="relative">
          <Header
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
          />

          {/* User Profile Menu */}
          <UserProfileMenu
            isOpen={profileOpen}
            onClose={() => setProfileOpen(false)}
          />
        </div>

        {/* Content Body */}
        <main className="max-w-[1440px] w-full mx-auto p-4 space-y-2.5 pb-6">
          {/* Page Title & Top Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">
                  รายงานผลสัมฤทธิ์รายกิจกรรม
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-sky-100 text-sky-700 border border-sky-200 shadow-2xs">
                  แบบสอบถาม: ที่เปิดเผย
                </span>
              </div>
              <p className="text-[12px] text-slate-500 mt-0.5">
                วิเคราะห์ข้อมูลผลประเมิน การมีส่วนร่วมและความพึงพอใจ
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right text-[11px] text-slate-500 hidden sm:block">
                <div className="text-[10px] text-slate-400">
                  *ข้อมูลอาจมีการปรับปรุงจากแบบสอบถามที่เปิดในระบบ
                </div>
                <div className="flex items-center justify-end gap-1 text-slate-600 font-medium">
                  <span className="material-symbols-outlined text-[14px] text-slate-400">
                    calendar_today
                  </span>
                  <span>14 ก.ย. 2568 10:24 น.</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setReportsModalOpen(true)}
                className="bg-white hover:bg-slate-50 text-sky-700 border border-sky-600 font-medium px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 text-[12px] shadow-xs hover:shadow transition-all cursor-pointer"
              >
                <span>ดูรายงานทั้งหมด</span>
                <span className="material-symbols-outlined text-[16px]">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>

          {/* Global Filter Bar */}
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
            onResetFilters={handleResetFilters}
          />

          {/* Activity Hero Banner */}
          <HeroBanner
            activity={currentActivity}
            onOpenImage={handleOpenPhoto}
          />

          {/* 5 KPI Cards Row */}
          <KpiCards
            activity={currentActivity}
            onViewDetails={(metric) => setKpiModalMetric(metric)}
          />

          {/* 3-Column Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 items-start gap-3">
            {/* Left Column (4 cols) */}
            <div className="lg:col-span-4 space-y-2.5">
              {/* 1. Overall Score Gauge */}
              <OverallScoreGauge activity={currentActivity} />

              {/* 2. Demographic Donut Chart */}
              <DemographicsChart activity={currentActivity} />

              {/* 3. Activity Gallery */}
              <ActivityGallery
                activity={currentActivity}
                onViewAllPhotos={() => {
                  setActivePhotoIndex(0);
                  setPhotoModalOpen(true);
                }}
                onOpenPhoto={handleOpenPhoto}
              />

              {/* 4. Recent Activities Table */}
              <RecentActivitiesTable
                activities={activities}
                selectedActivityId={selectedActivityId}
                onSelectActivity={(id) => setSelectedActivityId(id)}
              />
            </div>

            {/* Center Column (5 cols) */}
            <div className="lg:col-span-5 space-y-2.5">
              {/* 1. Aspect Scores */}
              <AspectScores activity={currentActivity} />

              {/* 2. Respondent Groups */}
              <RespondentGroups activity={currentActivity} />

              {/* 3. Awareness Channels */}
              <AwarenessChannels activity={currentActivity} />
            </div>

            {/* Right Column (3 cols) */}
            <div className="lg:col-span-3 space-y-2.5">
              {/* 1. Score Distribution */}
              <ScoreDistribution activity={currentActivity} />

              {/* 2. Key Aspects (Highest & Needs attention) */}
              <KeyAspects
                activity={currentActivity}
                onViewAllAspects={() => setReportsModalOpen(true)}
              />

              {/* 3. Feedback Comments */}
              <FeedbackComments
                activity={currentActivity}
                onViewAllComments={() => setCommentsModalOpen(true)}
              />
            </div>
          </div>
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
