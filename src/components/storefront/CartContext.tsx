import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { getProducts } from "@/services/api";
import { CartContext, type CartItem } from "./cart-context";
import type { Product } from "./mockData";

const STORAGE_KEY = "mahidol-lampang-cart-v1";
function readStoredItems(): CartItem[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(stored)) return [];
    return stored.filter(
      (item): item is CartItem =>
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        "quantity" in item &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0,
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isRevalidating, setIsRevalidating] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    setItems(readStoredItems());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isHydrated]);

  useEffect(() => {
    if (!isHydrated || items.length === 0) return;
    let active = true;
    setIsRevalidating(true);
    void getProducts()
      .then((products) => {
        if (!active) return;
        const byId = new Map(products.map((product) => [product.id, product]));
        const next = items.flatMap((item) => {
          const current = byId.get(item.id);
          if (!current || (!current.isPreOrder && current.stock < 1)) return [];
          return [
            {
              ...item,
              ...current,
              quantity: current.isPreOrder ? item.quantity : Math.min(item.quantity, current.stock),
            },
          ];
        });
        if (
          next.length !== items.length ||
          next.some((item, index) => item.quantity !== items[index]?.quantity)
        )
          toast.info("ปรับจำนวนสินค้าในตะกร้าตาม stock ล่าสุดแล้ว");
        if (
          next.length !== items.length ||
          next.some(
            (item, index) =>
              item.id !== items[index]?.id || item.quantity !== items[index]?.quantity,
          )
        ) {
          setItems(next);
        }
      })
      .finally(() => {
        if (active) setIsRevalidating(false);
      });
    return () => {
      active = false;
    };
  }, [isHydrated, items]);

  const addItem = (product: Product, requested = 1) => {
    const quantity = Math.max(1, Math.floor(requested));
    if (!product.isPreOrder && product.stock < 1) {
      toast.error("สินค้านี้หมด stock แล้ว");
      return;
    }
    setItems((previous) => {
      const existing = previous.find((item) => item.id === product.id);
      const nextQuantity = (existing?.quantity ?? 0) + quantity;
      const safeQuantity = product.isPreOrder
        ? nextQuantity
        : Math.min(nextQuantity, product.stock);
      if (existing)
        return previous.map((item) =>
          item.id === product.id ? { ...item, ...product, quantity: safeQuantity } : item,
        );
      return [...previous, { ...product, quantity: safeQuantity }];
    });
    setIsCartOpen(true);
    toast.success(`เพิ่ม ${product.name} ลงตะกร้าแล้ว`);
  };

  const removeItem = (productId: string) =>
    setItems((previous) => previous.filter((item) => item.id !== productId));
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) return removeItem(productId);
    setItems((previous) => {
      const next = previous.flatMap((item) => {
        if (item.id !== productId) return [item];
        const safeQuantity = item.isPreOrder
          ? Math.floor(quantity)
          : Math.min(Math.floor(quantity), item.stock);
        return safeQuantity > 0 ? [{ ...item, quantity: safeQuantity }] : [];
      });
      return next;
    });
  };
  const clearCart = () => setItems([]);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        isRevalidating,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
