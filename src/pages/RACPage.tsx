import { SUB_SYSTEM_URLS } from '@/config';
import { EmbeddedSystemView } from '@/components/EmbeddedSystemView';

export function RACPage() {
  return <EmbeddedSystemView url={SUB_SYSTEM_URLS.RAC} title="RAC System" systemLabel="Research & Academic Center" />;
}
