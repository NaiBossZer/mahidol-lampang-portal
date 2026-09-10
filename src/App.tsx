import { Link as RouterLink, Route, Routes } from "react-router-dom";
import { lazy, Suspense, type ReactNode } from "react";
import { Toaster } from "sonner";
import { RuntimeErrorBoundary } from "./components/RuntimeErrorBoundary";
import { AdminGuard } from "./components/AdminGuard";
import { HomePage } from "./pages/HomePage";

const ActivitiesPage = lazy(() => import("./pages/social/ActivitiesPage").then((m) => ({ default: m.ActivitiesPage })));
const ActivityDetailPage = lazy(() => import("./pages/social/ActivityDetailPage").then((m) => ({ default: m.ActivityDetailPage })));
const CentersPage = lazy(() => import("./pages/social/CentersPage").then((m) => ({ default: m.CentersPage })));
const ProjectsModule = lazy(() => import("./pages/social/ProjectsPage"));
const ShellacLearningCenterPage = lazy(() => import("./pages/social/ShellacLearningCenterPage").then((m) => ({ default: m.ShellacLearningCenterPage })));
const SurveyPage = lazy(() => import("./pages/SurveyPage").then((m) => ({ default: m.SurveyPage })));
const SiteMapPage = lazy(() => import("./pages/SiteMapPage").then((m) => ({ default: m.SiteMapPage })));
const LoginPage = lazy(() => import("./pages/admin/LoginPage").then((m) => ({ default: m.LoginPage })));
const AdminPage = lazy(() => import("./pages/admin/AdminPage").then((m) => ({ default: m.AdminPage })));
const DashboardPage = lazy(() => import("./pages/admin/DashboardPage").then((m) => ({ default: m.DashboardPage })));
const LacSatisfactionPage = lazy(() => import("./pages/admin/LacSatisfactionPage").then((m) => ({ default: m.LacSatisfactionPage })));
const FacilitySafetyAdminPage = lazy(() => import("./pages/admin/FacilitySafetyAdminPage").then((m) => ({ default: m.FacilitySafetyAdminPage })));
const StorefrontPage = lazy(() => import("./pages/store/StorefrontPage").then((m) => ({ default: m.StorefrontPage })));
const SmartFarmPage = lazy(() => import("./pages/systems/SmartFarmPage").then((m) => ({ default: m.SmartFarmPage })));
const CleanEnergyPage = lazy(() => import("./pages/systems/CleanEnergyPage").then((m) => ({ default: m.CleanEnergyPage })));
const RACPage = lazy(() => import("./pages/systems/RACPage").then((m) => ({ default: m.RACPage })));

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f6f0] px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-black text-[#123B63]">404</h1>
        <h2 className="mt-4 text-xl font-bold text-[#123B63]">ไม่พบหน้าที่ต้องการ</h2>
        <RouterLink to="/" className="mt-6 inline-flex rounded-xl bg-[#123B63] px-4 py-2 text-sm font-bold text-white">กลับหน้าหลัก</RouterLink>
      </div>
    </div>
  );
}
function ProtectedRoute({ children }: { children: ReactNode }) { return <AdminGuard>{children}</AdminGuard>; }
function RouteFallback() { return <div className="flex min-h-[40vh] items-center justify-center text-sm font-bold text-slate-500">กำลังโหลด...</div>; }

export default function App() {
  return (
    <RuntimeErrorBoundary>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/activities/:slug" element={<ActivityDetailPage />} />
          <Route path="/centers" element={<CentersPage />} />
          <Route path="/projects" element={<ProjectsModule.ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectsModule.ProjectDetailPage />} />
          <Route path="/shellac" element={<ShellacLearningCenterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          <Route path="/admin/lac-satisfaction" element={<ProtectedRoute><LacSatisfactionPage /></ProtectedRoute>} />
          <Route path="/admin/facility-safety" element={<ProtectedRoute><FacilitySafetyAdminPage /></ProtectedRoute>} />
          <Route path="/storefront" element={<StorefrontPage />} />
          <Route path="/support-vegetables" element={<StorefrontPage />} />
          <Route path="/smart-farm" element={<SmartFarmPage />} />
          <Route path="/clean-energy" element={<CleanEnergyPage />} />
          <Route path="/rac" element={<RACPage />} />
          <Route path="/survey" element={<SurveyPage />} />
          <Route path="/site-map" element={<SiteMapPage />} />
          <Route path="*" element={<NotFoundComponent />} />
        </Routes>
      </Suspense>
      <Toaster position="top-right" richColors closeButton />
    </RuntimeErrorBoundary>
  );
}
