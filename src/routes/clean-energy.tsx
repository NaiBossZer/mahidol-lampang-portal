import { createFileRoute } from '@tanstack/react-router';
import { EmbeddedSystemView } from '@/components/EmbeddedSystemView';

const CLEAN_ENERGY_URL = 'https://mahidol-clean-energy.vercel.app';

export const Route = createFileRoute('/clean-energy')({
  component: CleanEnergySystem,
});

function CleanEnergySystem() {
  return <EmbeddedSystemView url={CLEAN_ENERGY_URL} title="Clean Energy System" systemLabel="Clean Energy" />;
}
