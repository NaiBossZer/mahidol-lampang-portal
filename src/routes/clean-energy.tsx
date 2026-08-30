import { createFileRoute } from '@tanstack/react-router';

const CLEAN_ENERGY_URL = 'https://mahidol-clean-energy.vercel.app';

export const Route = createFileRoute('/clean-energy')({
  component: CleanEnergySystem,
});

function CleanEnergySystem() {
  return (
    <div className="w-full h-screen flex flex-col bg-white">
      <iframe
        src={CLEAN_ENERGY_URL}
        className="w-full h-full border-0"
        title="Clean Energy System"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"
        allow="fullscreen; clipboard-write; geolocation; microphone; camera"
      />
    </div>
  );
}
