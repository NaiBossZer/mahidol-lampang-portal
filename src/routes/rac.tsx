import { createFileRoute, redirect } from '@tanstack/react-router';

const isProd = typeof window !== 'undefined'
  ? window.location.hostname !== 'localhost'
  : true;

const RAC_URL = 'https://mahidol-shellac.vercel.app';

export const Route = createFileRoute('/rac')({
  beforeLoad: () => {
    if (isProd) {
      throw redirect({ href: RAC_URL });
    }
  },
  component: RACLocal,
});

function RACLocal() {
  return (
    <div className="w-full h-screen flex flex-col">
      <div className="bg-yellow-100 text-yellow-800 p-2 text-center text-sm font-medium">
        ⚠️{' '}
        <strong>Local Dev Mode</strong> — แสดงผลผ่าน Iframe{' '}
        <a
          href={RAC_URL}
          target="_blank"
          rel="noreferrer"
          className="underline font-bold"
        >
          mahidol-shellac.vercel.app
        </a>
        {' '}(บน Production จะใช้ Vercel Edge Rewrites แทน)
      </div>
      <iframe
        src={RAC_URL}
        className="w-full flex-1 border-0"
        title="RAC System"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
}
