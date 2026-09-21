import { SystemRegistryView } from "@/components/SystemRegistryView";

export function FacilitySafetyDashboardPage() {
  return (
    <SystemRegistryView
      systemKey="facility-safety"
      title="Facility-Safety Dashboard"
      systemLabel="อาคารและความปลอดภัย"
      sso
    />
  );
}
