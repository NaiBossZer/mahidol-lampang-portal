import { useCallback, useState } from "react";
import { Activity, AlertTriangle, CheckCircle2, RefreshCw, Sprout } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PlotStatus, Product } from "./mockData";

const statusCopy: Record<PlotStatus, { label: string; className: string; icon: typeof Sprout }> = {
  ready: { label: "พร้อมเก็บเกี่ยว", className: "bg-[#2E7D32] text-white", icon: CheckCircle2 },
  normal: { label: "ติดตามปกติ", className: "bg-[#F2A900] text-[#002D62]", icon: Activity },
  attention: { label: "ต้องตรวจสอบ", className: "bg-red-600 text-white", icon: AlertTriangle },
};

type SmartPlotsWidgetProps = {
  products: Product[];
  onSelectPlot?: (product: Product) => void;
  onRefresh?: () => Promise<void>;
};

export function SmartPlotsWidget({ products, onSelectPlot, onRefresh }: SmartPlotsWidgetProps) {
  const [lastRefresh, setLastRefresh] = useState(() => new Date());
  const [refreshing, setRefreshing] = useState(false);
  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await onRefresh?.();
      setLastRefresh(new Date());
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  return (
    <section
      aria-labelledby="smart-plots-title"
      className="rounded-xl border border-[#002D62]/15 bg-white p-5 shadow-sm"
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs tracking-widest text-[#002D62]">// LIVE_IOT_TELEMETRY</p>
          <h2
            id="smart-plots-title"
            className="mt-1 flex items-center gap-2 text-xl font-bold text-[#002D62]"
          >
            <Sprout className="h-5 w-5 text-[#2E7D32]" /> แปลงอัจฉริยะ
          </h2>
          <p className="mt-1 text-xs text-slate-500" aria-live="polite">
            อัปเดตล่าสุด {lastRefresh.toLocaleTimeString("th-TH")}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => void refresh()}
          disabled={refreshing}
          className="border-[#002D62] text-[#002D62]"
          aria-label="รีเฟรชข้อมูลเซนเซอร์"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />{" "}
          {refreshing ? "กำลังโหลด" : "รีเฟรช"}
        </Button>
      </div>
      {products.length === 0 ? (
        <p className="rounded-lg border border-dashed p-6 text-center text-sm text-slate-500">
          ยังไม่มีข้อมูลแปลงปลูก
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => {
            const status = statusCopy[product.plotStatus];
            const Icon = status.icon;
            return (
              <button
                type="button"
                key={product.plotId}
                onClick={() => onSelectPlot?.(product)}
                className="rounded-lg border border-slate-200 p-3 text-left transition hover:-translate-y-0.5 hover:border-[#002D62] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2A900]"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-[#002D62]">
                    {product.plotId}
                  </span>
                  <Badge className={status.className}>
                    <Icon className="mr-1 h-3 w-3" />
                    {status.label}
                  </Badge>
                </div>
                <p className="truncate text-sm font-semibold text-slate-800">{product.name}</p>
                <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-slate-500">
                  <div>
                    <dt>อุณหภูมิ</dt>
                    <dd className="font-mono font-semibold text-slate-800">
                      {product.sensorData.temperatureC}°C
                    </dd>
                  </div>
                  <div>
                    <dt>ความชื้น</dt>
                    <dd className="font-mono font-semibold text-slate-800">
                      {product.sensorData.humidityPercent}%
                    </dd>
                  </div>
                  <div>
                    <dt>ดิน</dt>
                    <dd className="font-mono font-semibold text-slate-800">
                      {product.sensorData.soilMoisturePercent}%
                    </dd>
                  </div>
                  <div>
                    <dt>แสง</dt>
                    <dd className="font-mono font-semibold text-slate-800">
                      {Math.round(product.sensorData.lightLux / 1000)}k lux
                    </dd>
                  </div>
                </dl>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
