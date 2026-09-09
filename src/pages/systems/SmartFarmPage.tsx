import { SUB_SYSTEM_URLS } from "@/config";
import { EmbeddedSystemView } from "@/components/EmbeddedSystemView";

export function SmartFarmPage() {
  return (
    <EmbeddedSystemView
      url={SUB_SYSTEM_URLS.SMART_FARM}
      title="Smart Farm System"
      systemLabel="Smart Farm IoT"
    />
  );
}
