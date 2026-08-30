import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/clean-energy')({
  component: CleanEnergyFallback,
});

function CleanEnergyFallback() {
  return (
    <div className="w-full h-screen flex flex-col">
      <div className="bg-yellow-100 text-yellow-800 p-2 text-center text-sm font-medium">
        ⚠️ คุณกำลังใช้งานโหมด Local Development ระบบจำลองการดึงหน้าเว็บจาก 
        <a href="https://clean-energy-sub.vercel.app" target="_blank" rel="noreferrer" className="underline ml-1">
          https://clean-energy-sub.vercel.app
        </a>
        ผ่าน Iframe (บน Production จะใช้งานผ่าน Vercel Rewrites)
      </div>
      <iframe 
        src="https://clean-energy-sub.vercel.app" 
        className="w-full flex-1 border-0"
        title="Clean Energy System"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
}
