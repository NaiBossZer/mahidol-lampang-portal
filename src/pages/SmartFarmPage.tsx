import { EmbeddedSystemView } from '@/components/EmbeddedSystemView';

const SMART_FARM_URL = 'https://mahidol-smart-farm.vercel.app';

export function SmartFarmPage() {
  return <EmbeddedSystemView url={SMART_FARM_URL} title="Smart Farm System" systemLabel="Smart Farm IoT" />;
}
