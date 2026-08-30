import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/smart-farm')({
  component: SmartFarmFallback,
});

function SmartFarmFallback() {
  return (
    <div className="w-full h-screen flex flex-col">
      <div className="bg-yellow-100 text-yellow-800 p-2 text-center text-sm font-medium">
        ⚠️ คุณกำลังใช้งานโหมด Local Development ระบบจำลองการดึงหน้าเว็บจาก 
        <a href="https://smart-farm-sub.vercel.app" target="_blank" rel="noreferrer" className="underline ml-1">
          https://smart-farm-sub.vercel.app
        </a>
        ผ่าน Iframe (บน Production จะใช้งานผ่าน Vercel Rewrites)
      </div>
      <iframe 
        src="https://smart-farm-sub.vercel.app" 
        className="w-full flex-1 border-0"
        title="Smart Farm System"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
}
