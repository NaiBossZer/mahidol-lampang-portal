import { createFileRoute } from '@tanstack/react-router';

const SMART_FARM_URL = 'https://mahidol-smart-farm.vercel.app';

export const Route = createFileRoute('/smart-farm')({
  component: SmartFarmSystem,
});

function SmartFarmSystem() {
  return (
    <div className="w-full h-screen flex flex-col bg-white">
      <iframe
        src={SMART_FARM_URL}
        className="w-full h-full border-0"
        title="Smart Farm System"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"
        allow="fullscreen; clipboard-write; geolocation; microphone; camera"
      />
    </div>
  );
}
