import { useEffect, useMemo, useState } from "react";
import { getProducts } from "@/services/api";
import type { Product } from "./mockData";
import { ProductionProductCard } from "./ProductionProductCard";
import { CartProvider } from "./CartContext";
import { useCart } from "./useCart";
import { CartDrawer } from "./CartDrawer";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductionPlotDetailView } from "./ProductionPlotDetailView";
import { ProductionEvCalendar } from "./ProductionEvCalendar";

const FloatingCart = () => { const { totalItems, setIsCartOpen } = useCart(); if (totalItems === 0) return null; return <div className="fixed bottom-6 right-6 z-50"><Button onClick={() => setIsCartOpen(true)} className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#002D62] shadow-xl"><ShoppingCart className="h-6 w-6 text-white" /><span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-red-500 text-xs font-bold text-white">{totalItems}</span></Button></div>; };

export const StorefrontWidget = () => {
  const [products, setProducts] = useState<Product[]>([]); const [query, setQuery] = useState(""); const [standard, setStandard] = useState("ทั้งหมด"); const [selectedPlot, setSelectedPlot] = useState<Product | null>(null); const [loading, setLoading] = useState(true);
  useEffect(() => { void getProducts().then(setProducts).finally(() => setLoading(false)); }, []);
  const filteredProducts = useMemo(() => products.filter((product) => { const q = query.trim().toLowerCase(); return (product.name.toLowerCase().includes(q) || product.plotId.toLowerCase().includes(q)) && (standard === "ทั้งหมด" || product.standards.includes(standard as Product["standards"][number])); }), [products, query, standard]);
  return <CartProvider><div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><div className="mb-8"><h2 className="mb-2 text-3xl font-bold text-[#002D62]">ผลผลิตสดใหม่จากศูนย์วิจัย</h2><p className="text-gray-600">ข้อมูลผลผลิต ราคา สต็อก แปลง และวันเก็บเกี่ยวจากฐานข้อมูลกลางที่เจ้าหน้าที่ดูแลโดยตรง</p></div><ProductionEvCalendar products={products} /><div className="my-6 flex flex-col gap-3 sm:flex-row"><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ค้นหาผลผลิตหรือรหัสแปลง..." aria-label="ค้นหาผลผลิต" /><select value={standard} onChange={(e) => setStandard(e.target.value)} className="rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700" aria-label="กรองมาตรฐานสินค้า"><option>ทั้งหมด</option><option>GAP</option><option>Organic 100%</option><option>งานวิจัย</option></select></div><div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">{loading ? Array.from({ length: 4 }, (_, i) => <div key={i} className="h-80 animate-pulse rounded-xl bg-slate-100" />) : filteredProducts.length === 0 ? <p className="col-span-full rounded-lg border border-dashed p-8 text-center text-sm text-slate-500">ไม่พบผลผลิตตามเงื่อนไข</p> : filteredProducts.map((product) => <ProductionProductCard key={product.id} product={product} onViewPlot={setSelectedPlot} />)}</div><FloatingCart /><CartDrawer /><ProductionPlotDetailView product={selectedPlot} relatedProducts={products.filter((product) => product.plotId !== selectedPlot?.plotId).slice(0, 3)} onClose={() => setSelectedPlot(null)} /></div></CartProvider>;
};
