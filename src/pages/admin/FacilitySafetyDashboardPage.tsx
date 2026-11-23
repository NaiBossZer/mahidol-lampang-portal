import { useEffect, useState } from "react";
import { Loader2, WifiOff } from "lucide-react";
import { getSystemUrl } from "@/services/systemRegistry";

export function FacilitySafetyDashboardPage() {
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    void getSystemUrl("facility-safety")
      .then((value) => {
        if (!active) return;
        if (!value) {
          setError("ยังไม่ได้ตั้งค่า URL ของระบบอาคารและความปลอดภัย");
          return;
        }
        // Navigate to the standalone Facility-Safety deployment instead of
        // embedding it inside the Portal.
        window.location.replace(value);
      })
      .catch((reason) => {
        if (!active) return;
        setError(reason instanceof Error ? reason.message : "ไม่สามารถเปิดระบบอาคารและความปลอดภัยได้");
      });

    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return (
      <div className="grid min-h-[60vh] place-items-center bg-slate-50 p-6 text-center">
        <div>
          <WifiOff className="mx-auto h-8 w-8 text-brand-navy" />
          <h1 className="mt-3 text-lg font-semibold text-brand-navy">เปิดระบบไม่สำเร็จ</h1>
          <p className="mt-1 max-w-md text-sm text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-[60vh] place-items-center bg-white text-sm font-semibold text-muted-ink" role="status" aria-live="polite">
      <span className="inline-flex items-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin text-northern-gold" />
        กำลังเปิดระบบอาคารและความปลอดภัย…
      </span>
    </div>
  );
}
