import React from 'react';
import { MOCK_PRODUCTS } from './mockData';
import { ProductCard } from './ProductCard';
import { CartProvider, useCart } from './CartContext';
import { CartDrawer } from './CartDrawer';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  return (
    <CartProvider>
      <div className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#002D62] mb-2">
              ผลผลิตสดใหม่วันนี้จากศูนย์วิจัย
            </h2>
            <p className="text-gray-600">
              สนับสนุนผลผลิตทางการเกษตรปลอดภัย มาตรฐาน GAP และออร์แกนิก จากแปลงวิจัยมหาวิทยาลัยมหิดล วิทยาเขตอำนาจเจริญ (ศูนย์ลำปาง)
            </p>
          </div>
        </div>

        {/* 4-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <FloatingCart />
        <CartDrawer />
      </div>
    </CartProvider>
  );
};
