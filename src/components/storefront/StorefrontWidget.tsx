import { useEffect, useMemo, useState } from "react";
import { getProducts } from "@/services/api";
import { Product } from "./mockData";
import { ProductCard } from "./ProductCard";
import { CartProvider } from "./CartContext";
import { useCart } from "./useCart";
import { CartDrawer } from "./CartDrawer";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SmartPlotsWidget } from "./SmartPlotsWidget";
import { PlotDetailView } from "./PlotDetailView";
import { ProductionEvCalendar } from "./ProductionEvCalendar";

// Floating Cart Button
const FloatingCart = () => {
  const { totalItems, setIsCartOpen } = useCart();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={() => setIsCartOpen(true)}
        className="rounded-full w-14 h-14 shadow-xl bg-[#002D62] hover:bg-[#002D62]/90 flex items-center justify-center relative"
      >
        <ShoppingCart className="w-6 h-6 text-white" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
          {totalItems}
        </span>
      </Button>
    </div>
  );
};

export const StorefrontWidget = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [standard, setStandard] = useState("ทั้งหมด");
  const [selectedPlot, setSelectedPlot] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void getProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);
  const refreshProducts = async () => {
    setProducts(await getProducts());
  };
  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesQuery =
          product.name.toLowerCase().includes(query.trim().toLowerCase()) ||
          product.plotId.toLowerCase().includes(query.trim().toLowerCase());
        const matchesStandard =
          standard === "ทั้งหมด" ||
          product.standards.includes(standard as Product["standards"][number]);
        return matchesQuery && matchesStandard;
      }),
    [products, query, standard],
  );

  return (
    <CartProvider>
      <div className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#002D62] mb-2">
              ผลผลิตสดใหม่วันนี้จากศูนย์วิจัย
            </h2>
            <p className="text-gray-600">
              สนับสนุนผลผลิตทางการเกษตรปลอดภัย มาตรฐาน GAP และออร์แกนิก จากแปลงวิจัยมหาวิทยาลัยมหิดล
              วิทยาเขตอำนาจเจริญ (ศูนย์ลำปาง)
            </p>
          </div>
        </div>

        <SmartPlotsWidget
          products={products}
          onSelectPlot={setSelectedPlot}
          onRefresh={refreshProducts}
        />
        <ProductionEvCalendar products={products} />
        <div className="my-6 flex flex-col gap-3 sm:flex-row">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ค้นหาผลผลิตหรือรหัสแปลง..."
            aria-label="ค้นหาผลผลิต"
          />
          <select
            value={standard}
            onChange={(event) => setStandard(event.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700"
            aria-label="กรองมาตรฐานสินค้า"
          >
            <option>ทั้งหมด</option>
            <option>GAP</option>
            <option>Organic 100%</option>
            <option>งานวิจัย</option>
          </select>
        </div>

        {/* 4-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="h-80 animate-pulse rounded-xl bg-slate-100"
                aria-label="กำลังโหลดสินค้า"
              />
            ))
          ) : filteredProducts.length === 0 ? (
            <p className="col-span-full rounded-lg border border-dashed p-8 text-center text-sm text-slate-500">
              ไม่พบผลผลิตตามเงื่อนไข
            </p>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onViewPlot={setSelectedPlot} />
            ))
          )}
        </div>

        <FloatingCart />
        <CartDrawer />
        <PlotDetailView
          product={selectedPlot}
          relatedProducts={products
            .filter((product) => product.plotId !== selectedPlot?.plotId)
            .slice(0, 3)}
          onClose={() => setSelectedPlot(null)}
        />
      </div>
    </CartProvider>
  );
};
