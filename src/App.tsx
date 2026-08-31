import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { RuntimeErrorBoundary } from './components/RuntimeErrorBoundary';
import { MahidolLampangHub } from './components/pages/MahidolLampangHub';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { StorefrontPage } from './pages/StorefrontPage';
import { AdminPage } from './pages/AdminPage';
import { SmartFarmPage } from './pages/SmartFarmPage';
import { CleanEnergyPage } from './pages/CleanEnergyPage';
import { RACPage } from './pages/RACPage';
import { SurveyPage } from './pages/SurveyPage';

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <RouterLink
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </RouterLink>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <RuntimeErrorBoundary>
      <Routes>
        <Route path="/" element={<MahidolLampangHub />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/storefront" element={<StorefrontPage />} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />
        <Route path="/smart-farm" element={<SmartFarmPage />} />
        <Route path="/clean-energy" element={<CleanEnergyPage />} />
        <Route path="/rac" element={<RACPage />} />
        <Route path="/survey" element={<SurveyPage />} />
        <Route path="*" element={<NotFoundComponent />} />
      </Routes>
      <Toaster position="top-right" richColors closeButton />
    </RuntimeErrorBoundary>
  );
}

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const isAuth = typeof window !== 'undefined' && sessionStorage.getItem('dashboard_auth') === 'true';
  if (!isAuth) {
    const redirectPath = adminOnly ? '/admin' : '/dashboard';
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirectPath)}`} replace />;
  }
  return <>{children}</>;
}
