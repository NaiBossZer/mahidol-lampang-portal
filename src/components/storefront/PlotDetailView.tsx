import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Activity, Award, Map, ShieldCheck } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Product } from "./mockData";

type PlotDetailViewProps = {
  product: Product | null;
  relatedProducts: Product[];
  onClose: () => void;
};

export function PlotDetailView({ product, relatedProducts, onClose }: PlotDetailViewProps) {
  return (
    <Dialog open={product !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        {product && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-[#002D62]">
                <Map className="h-5 w-5" /> วิเคราะห์แปลง {product.plotId}
              </DialogTitle>
              <DialogDescription>
                {product.name} • อัปเดต{" "}
                {new Date(product.sensorData.recordedAt).toLocaleString("th-TH")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 md:grid-cols-2">
              <section className="rounded-lg border bg-slate-50 p-4" aria-labelledby="trend-title">
                <h3
                  id="trend-title"
                  className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#002D62]"
                >
                  <Activity className="h-4 w-4" /> แนวโน้มเซนเซอร์ 6 ชั่วโมง
                </h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={product.sensorTrend}>
                      <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                      <YAxis width={30} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="soilMoisturePercent"
                        name="ความชื้นดิน %"
                        stroke="#2E7D32"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="humidityPercent"
                        name="ความชื้นอากาศ %"
                        stroke="#002D62"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>
              <section className="rounded-lg border bg-slate-50 p-4">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#002D62]">
                  <Award className="h-4 w-4 text-[#F2A900]" /> การคาดการณ์และคุณภาพ
                </h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-slate-500">คาดการณ์เก็บเกี่ยว</dt>
                    <dd className="font-semibold">
                      {new Date(
                        `${product.harvestPrediction.estimatedDate}T00:00:00`,
                      ).toLocaleDateString("th-TH")}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">ความมั่นใจ</dt>
                    <dd className="font-semibold text-[#2E7D32]">
                      {product.harvestPrediction.confidencePercent}%
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">คะแนนคุณภาพ</dt>
                    <dd className="font-semibold text-[#F2A900]">
                      {product.harvestPrediction.qualityScore.toFixed(1)} / 5
                    </dd>
                  </div>
                </dl>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.qualityCertificates.map((certificate) => (
                    <Badge
                      key={certificate}
                      variant="outline"
                      className="border-[#2E7D32] text-[#2E7D32]"
                    >
                      <ShieldCheck className="mr-1 h-3 w-3" />
                      {certificate}
                    </Badge>
                  ))}
                </div>
              </section>
            </div>
            <section className="overflow-hidden rounded-lg border">
              <div className="flex h-36 items-center justify-center bg-[#002D62] text-center text-white">
                {product.plotMapUrl ? (
                  <img
                    src={product.plotMapUrl}
                    alt={`แผนที่แปลง ${product.plotId}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div>
                    <Map className="mx-auto mb-2 h-8 w-8 text-[#F2A900]" />
                    <p className="text-sm">Spatial plot viewport: {product.plotId}</p>
                    <p className="text-xs text-slate-300">ยังไม่มีไฟล์ผังแปลงจาก IoT gateway</p>
                  </div>
                )}
              </div>
            </section>
            {relatedProducts.length > 0 && (
              <section>
                <h3 className="mb-2 text-sm font-semibold text-[#002D62]">
                  ผลผลิตจากแปลงใกล้เคียง
                </h3>
                <div className="flex flex-wrap gap-2">
                  {relatedProducts.map((related) => (
                    <Badge key={related.id} variant="secondary">
                      {related.name}
                    </Badge>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
