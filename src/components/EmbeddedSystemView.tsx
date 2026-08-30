import { useEffect, useState } from "react";
import { ExternalLink, Loader2, WifiOff } from "lucide-react";
import { Link } from "@tanstack/react-router";
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
    <div className="flex h-screen w-full flex-col bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 bg-[#002D62] px-4 py-2 text-white">
        <div className="flex items-center gap-3 text-sm">
          <Link to="/" className="text-[#F2A900] hover:underline">
            หน้าหลัก
          </Link>
          <span aria-hidden="true">/</span>
          <span>{systemLabel}</span>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-[#F2A900] hover:underline"
        >
          เปิดแท็บใหม่ <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      <div className="relative min-h-0 flex-1">
        {loading && !failed && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center bg-white"
            role="status"
          >
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#F2A900]" />
            กำลังเชื่อมต่อ {systemLabel}…
          </div>
        )}
        {failed && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
            <WifiOff className="mb-3 h-8 w-8 text-[#002D62]" />
            <h1 className="text-lg font-semibold text-[#002D62]">เชื่อมต่อระบบไม่สำเร็จ</h1>
            <p className="mt-1 text-sm text-slate-500">ระบบอาจปิดปรับปรุงหรือเครือข่ายตอบสนองช้า</p>
            <div className="mt-4 flex gap-2">
              <Button
                type="button"
                onClick={() => setRetryKey((current) => current + 1)}
                className="bg-[#002D62] text-white"
              >
                ลองอีกครั้ง
              </Button>
              <a href={url} target="_blank" rel="noopener noreferrer">
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
          className="h-full w-full border-0"
          title={title}
          onLoad={() => setLoading(false)}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"
          allow="fullscreen; clipboard-write; geolocation; microphone; camera"
        />
      </div>
    </div>
  );
}
