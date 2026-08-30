import { createFileRoute } from '@tanstack/react-router';
import { SUB_SYSTEM_URLS } from '@/config';

export const Route = createFileRoute('/rac')({
  component: RACSystem,
});

function RACSystem() {
  return (
    <div className="w-full h-screen flex flex-col bg-white">
      <iframe
        src={SUB_SYSTEM_URLS.RAC}
        className="w-full h-full border-0"
        title="RAC System"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"
        allow="fullscreen; clipboard-write; geolocation; microphone; camera"
      />
    </div>
  );
}
