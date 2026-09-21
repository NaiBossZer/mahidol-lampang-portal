import { useEffect, useState } from "react";
import { Loader2, WifiOff } from "lucide-react";
import { EmbeddedSystemView } from "@/components/EmbeddedSystemView";
import { getSystemUrl } from "@/services/systemRegistry";

type Props = {
  systemKey: string;
  title: string;
  systemLabel: string;
  sso?: boolean;
};

export function SystemRegistryView({ systemKey, title, systemLabel, sso = false }: Props) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setError("");
    void getSystemUrl(systemKey)
      .then((value) => {
        if (!active) return;
        if (!value) setError("ยังไม่ได้ตั้งค่า URL ของระบบนี้ใน System Registry");
        setUrl(value);
      })
      .catch((reason) => {
        if (!active) return;
        setError(reason instanceof Error ? reason.message : "ไม่สามารถโหลด URL ของระบบได้");
      });
    return () => {
      active = false;
    };
  }, [systemKey]);

  if (error) {
    return (
      <div className="grid min-h-dvh place-items-center bg-slate-50 p-6 text-center">
        <div>
          <WifiOff className="mx-auto h-8 w-8 text-brand-navy" />
          <h1 className="mt-3 text-lg font-semibold text-brand-navy">เชื่อมต่อระบบไม่สำเร็จ</h1>
          <p className="mt-1 max-w-md text-sm text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!url) {
    return (
      <div className="grid min-h-dvh place-items-center bg-white text-sm font-semibold text-slate-600">
        <Loader2 className="mr-2 h-5 w-5 animate-spin text-northern-gold" />
        กำลังโหลด {systemLabel}…
      </div>
    );
  }

  return <EmbeddedSystemView url={url} title={title} systemLabel={systemLabel} sso={sso} />;
}
