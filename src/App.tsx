import { Link as RouterLink, Route, Routes } from "react-router-dom";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { RuntimeErrorBoundary } from "./components/RuntimeErrorBoundary";
import { AdminGuard } from "./components/AdminGuard";
import { HomePage } from "./pages/HomePage";
import { SurveyPage } from "./pages/SurveyPage";
import { SiteMapPage } from "./pages/SiteMapPage";
import { LoginPage } from "./pages/admin/LoginPage";
import { AdminPage } from "./pages/admin/AdminPage";
import { DashboardPage } from "./pages/admin/DashboardPage";
import { StorefrontPage } from "./pages/store/StorefrontPage";
import { SmartFarmPage } from "./pages/systems/SmartFarmPage";
import { CleanEnergyPage } from "./pages/systems/CleanEnergyPage";
import { RACPage } from "./pages/systems/RACPage";
import { ActivitiesPage } from "./pages/social/ActivitiesPage";
import { ActivityDetailPage } from "./pages/social/ActivityDetailPage";
import { CentersPage } from "./pages/social/CentersPage";
import { ProjectsPage, ProjectDetailPage } from "./pages/social/ProjectsPage";
import { ShellacLearningCenterPage } from "./pages/social/ShellacLearningCenterPage";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f6f0] px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-black text-[#123B63]">404</h1>
        <h2 className="mt-4 text-xl font-bold text-[#123B63]">ไม่พบหน้าที่ต้องการ</h2>
        <RouterLink
          to="/"
          className="mt-6 inline-flex rounded-xl bg-[#123B63] px-4 py-2 text-sm font-bold text-white"
        >
          กลับหน้าหลัก
        </RouterLink>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  return <AdminGuard>{children}</AdminGuard>;
}

export default function App() {
  return (
    <RuntimeErrorBoundary>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/activities/:slug" element={<ActivityDetailPage />} />
        <Route path="/centers" element={<CentersPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:slug" element={<ProjectDetailPage />} />
        <Route path="/shellac" element={<ShellacLearningCenterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="/storefront" element={<StorefrontPage />} />
        <Route path="/support-vegetables" element={<StorefrontPage />} />
        <Route path="/smart-farm" element={<SmartFarmPage />} />
        <Route path="/clean-energy" element={<CleanEnergyPage />} />
        <Route path="/rac" element={<RACPage />} />
        <Route path="/survey" element={<SurveyPage />} />
        <Route path="/site-map" element={<SiteMapPage />} />
        <Route path="*" element={<NotFoundComponent />} />
      </Routes>
      <Toaster position="top-right" richColors closeButton />
    </RuntimeErrorBoundary>
  );
}
