import { createFileRoute, redirect } from '@tanstack/react-router';
import { AdminDashboard } from '@/components/storefront/AdminDashboard';
import { Header } from '@/components/Header'; // Assuming Header is global or needed here

export const Route = createFileRoute('/admin')({
  beforeLoad: () => {
    // Check if running in browser
    if (typeof window !== 'undefined') {
      const isAuth = sessionStorage.getItem('dashboard_auth') === 'true';
      if (!isAuth) {
        throw redirect({
          to: '/login',
          search: {
            redirect: '/admin',
          },
        });
      }
    }
  },
  component: AdminPage,
});

function AdminPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Prompt']">
      <AdminDashboard />
    </div>
  );
}
