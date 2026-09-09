import { SUB_SYSTEM_URLS } from "@/config";
import { EmbeddedSystemView } from "@/components/EmbeddedSystemView";

export function CleanEnergyPage() {
  return (
    <EmbeddedSystemView
      url={SUB_SYSTEM_URLS.CLEAN_ENERGY}
      title="Clean Energy System"
      systemLabel="Clean Energy"
    />
  );
}
