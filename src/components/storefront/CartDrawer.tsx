import { useCart } from "./useCart";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export const CartDrawer = () => {
  const { items, updateQuantity, removeItem, totalPrice, isCartOpen, setIsCartOpen, isRevalidating } = useCart();

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-xl text-[#002D62]">
            <ShoppingBag className="h-5 w-5" />
            ตะกร้าสินค้า
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-gray-500">
              <ShoppingBag className="h-12 w-12 opacity-20" />
              <p>ตะกร้าสินค้าว่างเปล่า</p>
              <Button variant="outline" onClick={() => setIsCartOpen(false)}>
                เลือกซื้อสินค้าต่อ
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 rounded-lg bg-gray-50 p-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 rounded-md object-cover"
                    loading="lazy"
                    width="80"
                    height="80"
                    onError={(event) => {
                      event.currentTarget.src = "/mahidol-logo.png";
                    }}
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h4 className="line-clamp-2 text-sm font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-500">
                        ฿{item.price}/{item.unit}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center rounded-md border bg-white">
                        <button
                          type="button"
                          className="rounded-l-md p-1 hover:bg-gray-100"
                          aria-label={`ลดจำนวน ${item.name}`}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          type="button"
                          className="rounded-r-md p-1 hover:bg-gray-100"
                          aria-label={`เพิ่มจำนวน ${item.name}`}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="rounded-md p-1 text-red-500 transition-colors hover:bg-red-50"
                        aria-label={`ลบ ${item.name} ออกจากตะกร้า`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="mt-auto border-t pt-4">
            {isRevalidating && (
              <p role="status" className="mb-2 text-xs text-slate-500">
                กำลังตรวจสอบ stock ล่าสุด…
              </p>
            )}
            <div className="mb-4 flex items-center justify-between text-lg">
              <span className="font-semibold">ยอดรวม</span>
              <span className="font-bold text-[#2E7D32]">฿{totalPrice}</span>
            </div>
            <Button
              type="button"
              disabled
              className="w-full bg-slate-200 py-6 text-base font-semibold text-slate-500"
              title="ระบบชำระเงินจะเปิดใช้งานในเฟสถัดไป"
            >
              ชำระเงิน — อยู่ระหว่างเตรียมระบบ
            </Button>
            <p className="mt-2 text-center text-xs text-slate-500">
              ขณะนี้เปิดให้ทดลองเลือกสินค้าและจัดการตะกร้าเท่านั้น
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
