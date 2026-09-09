import { useState } from "react";
import { Product } from "./mockData";
import { useCart } from "./useCart";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Leaf, FlaskConical, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
  const [expanded, setExpanded] = useState(false);
  const isOutOfStock = product.stock === 0 && !product.isPreOrder;
  const maxStock = 50;
  const stockPercentage = Math.min(100, Math.max(0, (product.stock / maxStock) * 100));

  const getStandardIcon = (standard: string) => {
    switch (standard) {
      case "Organic 100%":
        return <Leaf className="mr-1 h-3 w-3" />;
      case "งานวิจัย":
        return <FlaskConical className="mr-1 h-3 w-3" />;
      case "GAP":
        return <CheckCircle2 className="mr-1 h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
          decoding="async"
          width="400"
          height="300"
          onError={(event) => {
            event.currentTarget.src = "/mahidol-logo.png";
          }}
        />
        {product.isPreOrder && (
          <Badge className="absolute right-2 top-2 bg-white/90 text-[#002D62] backdrop-blur-sm">
            สั่งจองล่วงหน้า
          </Badge>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-lg font-semibold text-gray-900">{product.name}</h3>

        <div className="mb-2 flex flex-wrap gap-1">
          {product.standards.map((standard) => (
            <Badge key={standard} className="border-none bg-slate-100 text-xs text-[#002D62]">
              {getStandardIcon(standard)}
              {standard}
            </Badge>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="self-start text-xs font-medium text-[#002D62] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2A900]"
        >
          {expanded ? "ซ่อนรายละเอียด" : "ดูรายละเอียด"}
        </button>
        {expanded && (
          <div className="rounded-md bg-slate-50 p-3 text-xs leading-5 text-slate-600">
            <p>{product.qualityCertificates.join(" • ")}</p>
            {product.plotId && <p className="mt-1">แหล่งผลิต: {product.plotId}</p>}
          </div>
        )}

        <div className="mt-auto">
          <div className="mb-3 flex items-end justify-between">
            <span className="text-2xl font-bold text-[#002D62]">฿{product.price}</span>
            <span className="mb-1 text-sm text-gray-500">/{product.unit}</span>
          </div>

          {!product.isPreOrder && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>คงเหลือ</span>
                <span className={product.stock < 10 ? "font-medium text-red-500" : ""}>
                  {product.stock} {product.unit}
                </span>
              </div>
              <Progress value={stockPercentage} className="h-1.5" />
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-[#2E7D32] text-white hover:bg-[#2E7D32]/90"
          disabled={isOutOfStock}
          onClick={() => addItem(product)}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.isPreOrder ? "สั่งจองล่วงหน้า" : "เพิ่มลงตะกร้า"}
        </Button>
      </CardFooter>
    </Card>
  );
};
