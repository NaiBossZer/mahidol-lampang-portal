import { EmbeddedSystemView } from '@/components/EmbeddedSystemView';

const CLEAN_ENERGY_URL = 'https://mahidol-clean-energy.vercel.app';

export function CleanEnergyPage() {
  return <EmbeddedSystemView url={CLEAN_ENERGY_URL} title="Clean Energy System" systemLabel="Clean Energy" />;
}
