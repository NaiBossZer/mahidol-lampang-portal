import { AdminDashboard } from "@/components/storefront/AdminDashboard";

export function AdminPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
                Mahidol Social Engagement Platform
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-brand-navy lg:text-3xl">
                ศูนย์จัดการระบบหลังบ้าน
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                จัดการกิจกรรม ผลผลิต และคำสั่งซื้อจากฐานข้อมูลส่วนกลาง
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500">
              Central Administration
            </div>
          </div>
        </div>
      </section>
      <AdminDashboard />
    </div>
  );
}
