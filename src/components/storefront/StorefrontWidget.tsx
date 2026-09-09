import { useMemo, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { MOCK_PRODUCTS, type Product } from "./mockData";
import { ProductCard } from "./ProductCard";
import { CartProvider } from "./CartContext";
import { useCart } from "./useCart";
import { CartDrawer } from "./CartDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const FloatingCart = () => {
  const { totalItems, setIsCartOpen } = useCart();
  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        type="button"
        onClick={() => setIsCartOpen(true)}
        aria-label={`เปิดตะกร้าสินค้า มี ${totalItems} รายการ`}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#002D62] shadow-xl"
      >
        <ShoppingCart className="h-6 w-6 text-white" />
        <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-red-500 text-xs font-bold text-white">
          {totalItems}
        </span>
      </Button>
    </div>
  );
};

export const StorefrontWidget = () => {
  const [query, setQuery] = useState("");
  const [standard, setStandard] = useState("ทั้งหมด");

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return MOCK_PRODUCTS.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.plotId.toLowerCase().includes(normalizedQuery);
      const matchesStandard =
        standard === "ทั้งหมด" || product.standards.includes(standard as Product["standards"][number]);
      return matchesQuery && matchesStandard;
    });
  }, [query, standard]);

  return (
    <CartProvider>
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#C66B4F]">SOCIAL IMPACT MARKET</p>
          <h2 className="mt-2 text-3xl font-bold text-[#002D62]">Mahidol Farm Fresh Market</h2>
          <p className="mt-2 max-w-3xl text-gray-600">
            พื้นที่นำเสนอผลิตภัณฑ์และผลผลิตจากงานวิจัยเพื่อสังคม ระบบข้อมูลผลผลิตจากฐานข้อมูลกลางและการชำระเงินออนไลน์จะเปิดใช้งานในเฟสถัดไป
          </p>
        </div>

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

        {filteredProducts.length === 0 ? (
          <p className="rounded-lg border border-dashed p-8 text-center text-sm text-slate-500">
            ไม่พบผลผลิตตามเงื่อนไข
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <FloatingCart />
        <CartDrawer />
      </div>
    </CartProvider>
  );
};
