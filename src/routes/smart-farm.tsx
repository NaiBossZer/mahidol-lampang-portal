import { createFileRoute } from '@tanstack/react-router';
import { EmbeddedSystemView } from '@/components/EmbeddedSystemView';

const SMART_FARM_URL = 'https://mahidol-smart-farm.vercel.app';

export const Route = createFileRoute('/smart-farm')({
  component: SmartFarmSystem,
});

function SmartFarmSystem() {
  return <EmbeddedSystemView url={SMART_FARM_URL} title="Smart Farm System" systemLabel="Smart Farm IoT" />;
}
