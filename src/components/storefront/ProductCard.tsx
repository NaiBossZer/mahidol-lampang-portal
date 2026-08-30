import React from 'react';
import { Product } from './mockData';
import { useCart } from './CartContext';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Leaf, FlaskConical, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
  const isOutOfStock = product.stock === 0 && !product.isPreOrder;
  
  // Calculate stock percentage (mock max stock as 50 for visualization)
  const maxStock = 50;
  const stockPercentage = Math.min(100, Math.max(0, (product.stock / maxStock) * 100));

  const getStandardIcon = (std: string) => {
    switch (std) {
      case 'Organic 100%': return <Leaf className="w-3 h-3 mr-1" />;
      case 'งานวิจัย': return <FlaskConical className="w-3 h-3 mr-1" />;
      case 'GAP': return <CheckCircle2 className="w-3 h-3 mr-1" />;
      default: return null;
    }
  };

  const getStandardColor = (std: string) => {
    switch (std) {
      case 'Organic 100%': return 'bg-[#2E7D32] text-white hover:bg-[#2E7D32]/80';
      case 'งานวิจัย': return 'bg-[#002D62] text-white hover:bg-[#002D62]/80';
      case 'GAP': return 'bg-[#F2A900] text-white hover:bg-[#F2A900]/80';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        />
        {product.isPreOrder && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-white/90 text-[#002D62] font-semibold backdrop-blur-sm border-[#002D62]">
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
        
        <div className="mt-auto">
          <div className="flex items-end justify-between mb-3">
            <span className="text-2xl font-bold text-[#002D62]">
              ฿{product.price}
            </span>
            <span className="text-sm text-gray-500 mb-1">/{product.unit}</span>
          </div>
          
          {!product.isPreOrder && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>คงเหลือ</span>
                <span className={product.stock < 10 ? 'text-red-500 font-medium' : ''}>
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
          className="w-full bg-[#2E7D32] hover:bg-[#2E7D32]/90 text-white"
          disabled={isOutOfStock}
          onClick={() => addItem(product)}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {product.isPreOrder ? 'สั่งจองล่วงหน้า' : 'เพิ่มลงตะกร้า'}
        </Button>
      </CardFooter>
    </Card>
  );
};
