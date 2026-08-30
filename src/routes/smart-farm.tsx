import { createFileRoute, redirect } from '@tanstack/react-router';

// ตรวจสอบว่าอยู่ใน Production หรือ Local Dev
const isProd = typeof window !== 'undefined'
  ? window.location.hostname !== 'localhost'
  : true;

const SMART_FARM_URL = 'https://mahidol-smart-farm.vercel.app';

export const Route = createFileRoute('/smart-farm')({
  beforeLoad: () => {
    // บน Production: Vercel Rewrites จะ intercept request นี้ก่อนถึง Router
    // แต่ถ้า Request ผ่านมาถึงที่นี่ได้ (เช่น Local Dev) ให้ redirect ออกไป
    if (isProd) {
      // ใน Production ควรถูก intercepted โดย Vercel Rewrites
      // แต่เป็น Safety net: redirect ออกไปยัง URL ตรง ๆ
      throw redirect({ href: SMART_FARM_URL });
    }
    // Local Dev: อนุญาตให้ render Iframe fallback
  },
  component: SmartFarmLocal,
});

/** แสดงเฉพาะตอน Local Development */
function SmartFarmLocal() {
  return (
    <div className="w-full h-screen flex flex-col">
      <div className="bg-yellow-100 text-yellow-800 p-2 text-center text-sm font-medium">
        ⚠️{' '}
        <strong>Local Dev Mode</strong> — แสดงผลผ่าน Iframe{' '}
        <a
          href={SMART_FARM_URL}
          target="_blank"
          rel="noreferrer"
          className="underline font-bold"
        >
          mahidol-smart-farm.vercel.app
        </a>
        {' '}(บน Production จะใช้ Vercel Edge Rewrites แทน)
      </div>
      <iframe
        src={SMART_FARM_URL}
        className="w-full flex-1 border-0"
        title="Smart Farm System"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
}
