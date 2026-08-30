import { createFileRoute } from '@tanstack/react-router';
import { SUB_SYSTEM_URLS } from '@/config';
import { EmbeddedSystemView } from '@/components/EmbeddedSystemView';

export const Route = createFileRoute('/rac')({
  component: RACSystem,
});

function RACSystem() {
  return <EmbeddedSystemView url={SUB_SYSTEM_URLS.RAC} title="RAC System" systemLabel="Research & Academic Center" />;
}
