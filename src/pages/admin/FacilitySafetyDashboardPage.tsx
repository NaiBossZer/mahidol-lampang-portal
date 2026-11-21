import { ShieldCheck } from "lucide-react";
import { SystemRegistryView } from "@/components/SystemRegistryView";
import { useAdminAuth } from "@/components/AdminGuard";

export function FacilitySafetyDashboardPage() {
  const { role, permissions } = useAdminAuth();
  const canAccess = role === "SUPER_ADMIN" || permissions.includes("facility.read");

  if (!canAccess) {
    return (
      <section className="grid min-h-[45vh] place-items-center rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
        <div>
          <ShieldCheck className="mx-auto h-9 w-9 text-amber-700" />
          <h1 className="mt-3 text-lg font-bold text-slate-900">ไม่มีสิทธิ์เข้าถึงระบบอาคารและความปลอดภัย</h1>
          <p className="mt-1 text-sm text-slate-600">กรุณาติดต่อผู้ดูแลระบบส่วนกลางเพื่อขอสิทธิ์ facility.read</p>
        </div>
      </section>
    );
  }

  return (
    <SystemRegistryView
      systemKey="facility-safety"
      title="Facility-Safety Dashboard"
      systemLabel="อาคารและความปลอดภัย"
      sso
    />
  );
}
