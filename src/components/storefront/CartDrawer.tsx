import React, { useState } from "react";
import { useCart } from "./useCart";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { CheckoutModal } from "./CheckoutModal";

export const CartDrawer = () => {
  const {
    items,
    updateQuantity,
    removeItem,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
    isRevalidating,
  } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <>
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="flex flex-col w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="text-xl flex items-center gap-2 text-[#002D62]">
              <ShoppingBag className="w-5 h-5" />
              ตะกร้าสินค้า
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto py-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
                <ShoppingBag className="w-12 h-12 opacity-20" />
                <p>ตะกร้าสินค้าว่างเปล่า</p>
                <Button variant="outline" onClick={() => setIsCartOpen(false)}>
                  เลือกซื้อสินค้าต่อ
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md"
                      onError={(event) => {
                        event.currentTarget.src = "/mahidol-logo.png";
                      }}
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                        <p className="text-sm text-gray-500">
                          ฿{item.price}/{item.unit}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-white border rounded-md">
                          <button
                            className="p-1 hover:bg-gray-100 rounded-l-md"
                            aria-label={`ลดจำนวน ${item.name}`}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <button
                            className="p-1 hover:bg-gray-100 rounded-r-md"
                            aria-label={`เพิ่มจำนวน ${item.name}`}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 p-1 hover:bg-red-50 rounded-md transition-colors"
                          aria-label={`ลบ ${item.name} ออกจากตะกร้า`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t pt-4 mt-auto">
              {isRevalidating && (
                <p role="status" className="mb-2 text-xs text-slate-500">
                  กำลังตรวจสอบ stock ล่าสุด…
                </p>
              )}
              <div className="flex justify-between items-center mb-4 text-lg">
                <span className="font-semibold">ยอดรวม</span>
                <span className="font-bold text-[#2E7D32]">฿{totalPrice}</span>
              </div>
              <Button
                className="w-full bg-[#F2A900] hover:bg-[#F2A900]/90 text-[#002D62] font-semibold text-lg py-6"
                onClick={handleCheckout}
              >
                ดำเนินการชำระเงิน
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </>
  );
};
