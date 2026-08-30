import { createContext } from "react";
import type { Product } from "./mockData";

export interface CartItem extends Product {
  quantity: number;
}

export interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  isRevalidating: boolean;
}

export const CartContext = createContext<CartContextValue | undefined>(undefined);
