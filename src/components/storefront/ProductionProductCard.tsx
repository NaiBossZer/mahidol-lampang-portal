import { useState } from "react";
import type { Product } from "./mockData";
import { useCart } from "./useCart";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Leaf,
  FlaskConical,
  CheckCircle2,
  BarChart3,
  PackageCheck,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

type ProductionProduct = Product & {
  description?: string;
  category?: string;
  researchTag?: string;
};
export function ProductionProductCard({
  product,
  onViewPlot,
}: {
  product: Product;
  onViewPlot?: (product: Product) => void;
}) {
  const p = product as ProductionProduct;
  const { addItem } = useCart();
  const [expanded, setExpanded] = useState(false);
  const out = p.stock === 0 && !p.isPreOrder;
  const maxStock = Math.max(p.stock, 50);
  const icon = (std: string) =>
    std === "Organic 100%" ? (
      <Leaf className="mr-1 h-3 w-3" />
    ) : std === "งานวิจัย" ? (
      <FlaskConical className="mr-1 h-3 w-3" />
    ) : (
      <CheckCircle2 className="mr-1 h-3 w-3" />
    );
  return (
    <Card className="flex h-full flex-col overflow-hidden hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={p.image}
          alt={p.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/mahidol-logo.png";
          }}
        />
        {p.isPreOrder && p.harvestDate && (
          <Badge className="absolute right-2 top-2 bg-white/90 text-[#002D62]">
            Pre-Order • เก็บเกี่ยว {new Date(p.harvestDate).toLocaleDateString("th-TH")}
          </Badge>
        )}
      </div>
      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-lg font-semibold text-slate-900">{p.name}</h3>
        <div className="flex flex-wrap gap-1">
          {p.standards.map((std) => (
            <Badge key={std} className="border-none bg-slate-100 text-slate-700">
              {icon(std)}
              {std}
            </Badge>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 self-start text-xs font-semibold text-[#002D62] hover:underline"
        >
          <PackageCheck className="h-3 w-3" />
          {expanded ? "ซ่อนข้อมูลการผลิต" : "ดูข้อมูลการผลิต"}
        </button>
        {expanded && (
          <dl className="grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-3 text-xs">
            <div>
              <dt className="text-slate-500">หมวดหมู่</dt>
              <dd className="font-semibold">{p.category || "-"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">แปลงผลิต</dt>
              <dd className="font-semibold">{p.plotId || "-"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">รหัสงานวิจัย</dt>
              <dd className="font-semibold">{p.researchTag || "-"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">วันเก็บเกี่ยว</dt>
              <dd className="font-semibold">
                {p.harvestDate ? new Date(p.harvestDate).toLocaleDateString("th-TH") : "ยังไม่ระบุ"}
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-slate-500">รายละเอียด</dt>
              <dd>{p.description || "ไม่มีรายละเอียดเพิ่มเติม"}</dd>
            </div>
          </dl>
        )}
        <div className="mt-auto">
          <div className="mb-3 flex items-end justify-between">
            <span className="text-2xl font-bold text-[#002D62]">฿{p.price}</span>
            <span className="mb-1 text-sm text-slate-500">/{p.unit}</span>
          </div>
          {!p.isPreOrder && (
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>คงเหลือ</span>
                <span>
                  {p.stock} {p.unit}
                </span>
              </div>
              <Progress value={(p.stock / maxStock) * 100} className="h-1.5" />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex w-full gap-2">
          <Button
            variant="outline"
            className="px-3 text-[#002D62]"
            onClick={() => onViewPlot?.(p)}
            aria-label={`ดูข้อมูลการผลิต ${p.name}`}
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
          <Button
            disabled={out}
            className="flex-1 bg-[#2E7D32] text-white hover:bg-[#2E7D32]/90"
            onClick={() => addItem(p)}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {p.isPreOrder ? "สั่งจองล่วงหน้า" : "เพิ่มลงตะกร้า"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
