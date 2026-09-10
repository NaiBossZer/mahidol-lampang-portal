import { useState } from "react";
import AdminSidebar from "./admin/AdminSidebar";
import AdminHeader from "./admin/AdminHeader";
import AdminDashboard from "./admin/AdminDashboard";
import AdminLACSatisfaction from "./admin/AdminLACSatisfaction";

export type AdminPage = "dashboard" | "lac-satisfaction" | "facility" | "hub";

export default function AdminPortal() {
  const [page, setPage] = useState<AdminPage>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <AdminDashboard />;
      case "lac-satisfaction": return <AdminLACSatisfaction />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex">
      <AdminSidebar currentPage={page} navigate={setPage} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader page={page} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-6 max-md:p-4 overflow-auto">
          {renderPage()}
        </main>
        <div className="border-t border-[#E2E6EA] bg-white px-6 py-3 flex items-center justify-between text-xs text-[#9BA8B7]">
          <span>Admin Console · มหิดล ลำปาง v2.4.1</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#5F8D62]" />
            ระบบทำงานปกติ
          </div>
        </div>
      </div>
    </div>
  );
}
