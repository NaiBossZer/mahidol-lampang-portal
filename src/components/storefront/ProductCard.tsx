import { useState } from "react";
import { Product } from "./mockData";
import { useCart } from "./useCart";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Leaf, FlaskConical, CheckCircle2, Radio, BarChart3 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const ProductCard = ({
  product,
  onViewPlot,
}: {
  product: Product;
  onViewPlot?: (product: Product) => void;
}) => {
  const { addItem } = useCart();
  const [expanded, setExpanded] = useState(false);
  const isOutOfStock = product.stock === 0 && !product.isPreOrder;

  // Calculate stock percentage (mock max stock as 50 for visualization)
  const maxStock = 50;
  const stockPercentage = Math.min(100, Math.max(0, (product.stock / maxStock) * 100));

  const getStandardIcon = (std: string) => {
    switch (std) {
      case "Organic 100%":
        return <Leaf className="w-3 h-3 mr-1" />;
      case "งานวิจัย":
        return <FlaskConical className="w-3 h-3 mr-1" />;
      case "GAP":
        return <CheckCircle2 className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  const getStandardColor = (std: string) => {
    switch (std) {
      case "Organic 100%":
        return "bg-[#2E7D32] text-white hover:bg-[#2E7D32]/80";
      case "งานวิจัย":
        return "bg-[#002D62] text-white hover:bg-[#002D62]/80";
      case "GAP":
        return "bg-[#F2A900] text-white hover:bg-[#F2A900]/80";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          onError={(event) => {
            event.currentTarget.src = "/mahidol-logo.png";
          }}
        />
        <Badge className="absolute bottom-2 left-2 bg-[#002D62] text-white">
          <Radio className="mr-1 h-3 w-3" /> IoT Monitored
        </Badge>
        {product.isPreOrder && (
          <div className="absolute top-2 right-2">
            <Badge
              variant="secondary"
              className="bg-white/90 text-[#002D62] font-semibold backdrop-blur-sm border-[#002D62]"
            >
              Pre-Order (เก็บเกี่ยว {product.harvestDate})
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4 flex-1 flex flex-col gap-2">
        <h3 className="font-semibold text-lg line-clamp-2 text-gray-900">{product.name}</h3>

        <div className="flex flex-wrap gap-1 mb-2">
          {product.standards.map((std) => (
            <Badge key={std} className={`${getStandardColor(std)} text-xs border-none`}>
              {getStandardIcon(std)}
              {std}
            </Badge>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="flex items-center gap-1 self-start text-xs font-medium text-[#002D62] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2A900]"
          aria-expanded={expanded}
        >
          <BarChart3 className="h-3 w-3" /> {expanded ? "ซ่อนข้อมูล IoT" : "ดูข้อมูล IoT"}
        </button>
        {expanded && (
          <dl
            className="grid grid-cols-2 gap-2 rounded-md bg-slate-50 p-2 text-xs"
            aria-label="ข้อมูลเซนเซอร์ล่าสุด"
          >
            <div>
              <dt className="text-slate-500">อุณหภูมิ</dt>
              <dd className="font-semibold">{product.sensorData.temperatureC}°C</dd>
            </div>
            <div>
              <dt className="text-slate-500">ดิน</dt>
              <dd className="font-semibold">{product.sensorData.soilMoisturePercent}%</dd>
            </div>
            <div>
              <dt className="text-slate-500">คาดการณ์</dt>
              <dd className="font-semibold">
                {product.harvestPrediction.confidencePercent}% มั่นใจ
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">แปลง</dt>
              <dd className="font-semibold">{product.plotId}</dd>
            </div>
          </dl>
        )}

        <div className="mt-auto">
          <div className="flex items-end justify-between mb-3">
            <span className="text-2xl font-bold text-[#002D62]">฿{product.price}</span>
            <span className="text-sm text-gray-500 mb-1">/{product.unit}</span>
          </div>

          {!product.isPreOrder && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>คงเหลือ</span>
                <span className={product.stock < 10 ? "text-red-500 font-medium" : ""}>
                  {product.stock} {product.unit}
                </span>
              </div>
              <Progress value={stockPercentage} className="h-1.5" />
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex w-full gap-2">
          <Button
            type="button"
            variant="outline"
            className="px-3 text-[#002D62]"
            onClick={() => onViewPlot?.(product)}
            aria-label={`ดูวิเคราะห์แปลง ${product.plotId}`}
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
          <Button
            className="flex-1 bg-[#2E7D32] text-white hover:bg-[#2E7D32]/90"
            disabled={isOutOfStock}
            onClick={() => addItem(product)}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {product.isPreOrder ? "สั่งจองล่วงหน้า" : "เพิ่มลงตะกร้า"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
