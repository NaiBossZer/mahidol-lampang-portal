import { useEffect, useState } from "react";
import { ExternalLink, Loader2, WifiOff } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

type EmbeddedSystemViewProps = { url: string; title: string; systemLabel: string };

export function EmbeddedSystemView({ url, title, systemLabel }: EmbeddedSystemViewProps) {
  const [loading, setLoading] = useState(true);
  const [timedOut, setTimedOut] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  useEffect(() => {
    setLoading(true);
    setTimedOut(false);
    const timer = window.setTimeout(() => setTimedOut(true), 8_000);
    return () => window.clearTimeout(timer);
  }, [retryKey]);
  const failed = timedOut && loading;
  return (
    <div className="flex min-h-dvh w-full flex-col bg-white">
      <header className="border-b border-slate-200 bg-[#002D62] px-3 py-2 text-white sm:px-4" aria-label={`${systemLabel} navigation`}>
        <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-2">
          <nav className="flex min-h-11 min-w-0 items-center gap-2 text-sm" aria-label="เส้นทางการนำทาง">
            <RouterLink
              to="/"
              className="inline-flex min-h-11 items-center rounded-lg px-2 text-[#F2A900] hover:bg-white/10 hover:underline"
            >
              หน้าหลัก
            </RouterLink>
            <span aria-hidden="true">/</span>
            <span className="truncate font-medium" aria-current="page">{systemLabel}</span>
          </nav>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-lg px-2 text-xs text-[#F2A900] hover:bg-white/10 hover:underline sm:text-sm"
          >
            เปิดแท็บใหม่ <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>
      </header>
      <div className="relative min-h-0 flex-1" aria-busy={loading}>
        {loading && !failed && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center bg-white px-4 text-center"
            role="status"
            aria-live="polite"
          >
            <Loader2 className="mr-2 h-5 w-5 shrink-0 animate-spin text-[#F2A900]" aria-hidden="true" />
            กำลังเชื่อมต่อ {systemLabel}…
          </div>
        )}
        {failed && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-50 p-6 text-center" role="alert">
            <WifiOff className="mb-3 h-8 w-8 text-[#002D62]" aria-hidden="true" />
            <h1 className="text-lg font-semibold text-[#002D62]">เชื่อมต่อระบบไม่สำเร็จ</h1>
            <p className="mt-1 max-w-md text-sm text-slate-500">ระบบอาจปิดปรับปรุงหรือเครือข่ายตอบสนองช้า</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Button type="button" onClick={() => setRetryKey((current) => current + 1)} className="bg-[#002D62] text-white">
                ลองอีกครั้ง
              </Button>
              <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex">
                <Button type="button" variant="outline" className="border-[#002D62] text-[#002D62]">
                  เปิดแท็บใหม่
                </Button>
              </a>
            </div>
          </div>
        )}
        <iframe
          key={retryKey}
          src={url}
          className="h-full min-h-[calc(100dvh-3.5rem)] w-full border-0"
          title={title}
          onLoad={() => setLoading(false)}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"
          allow="fullscreen; clipboard-write; geolocation; microphone; camera"
        />
      </div>
    </div>
  );
}
