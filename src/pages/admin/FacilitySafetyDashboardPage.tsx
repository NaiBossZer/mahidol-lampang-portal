import { EmbeddedSystemView } from "@/components/EmbeddedSystemView";

const FACILITY_SAFETY_URL = "https://mulpfacility-safety.vercel.app";

export function FacilitySafetyDashboardPage() {
  return (
    <EmbeddedSystemView
      url={FACILITY_SAFETY_URL}
      title="Facility-Safety Dashboard"
      systemLabel="อาคารและความปลอดภัย"
    />
  );
}
