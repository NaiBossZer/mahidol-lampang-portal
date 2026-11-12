import { SystemRegistryView } from "@/components/SystemRegistryView";

export function FacilitySafetyInspectionPage() {
  return (
    <SystemRegistryView
      systemKey="facility-safety"
      title="Facility-Safety — ตรวจอาคาร"
      systemLabel="ตรวจอาคาร"
      sso
      forwardSearch
    />
  );
}
