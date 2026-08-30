export type ProductStandard = 'GAP' | 'Organic 100%' | 'งานวิจัย';

export interface Product {
  id: string;
  name: string;
  image: string;
  standards: ProductStandard[];
  price: number;
  unit: string;
  stock: number; // 0 means out of stock
  isPreOrder: boolean;
  harvestDate?: string;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'ผักสลัดกรีนโอ๊ค (Green Oak)',
    image: 'https://images.unsplash.com/photo-1640958904159-51ae08bc3412?auto=format&fit=crop&q=80&w=400&h=300',
    standards: ['GAP', 'งานวิจัย'],
    price: 50,
    unit: 'กก.',
    stock: 15,
    isPreOrder: false,
  },
  {
    id: 'p2',
    name: 'มะเขือเทศราชินี',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400&h=300',
    standards: ['Organic 100%'],
    price: 80,
    unit: 'กก.',
    stock: 0,
    isPreOrder: true,
    harvestDate: '2026-09-05',
  },
  {
    id: 'p3',
    name: 'เมล่อนสายพันธุ์ใหม่ (วิจัย)',
    image: 'https://images.unsplash.com/photo-1595475207225-428b62bda831?auto=format&fit=crop&q=80&w=400&h=300',
    standards: ['GAP', 'งานวิจัย'],
    price: 150,
    unit: 'ลูก',
    stock: 5,
    isPreOrder: false,
  },
  {
    id: 'p4',
    name: 'ฟักทองบัตเตอร์นัท',
    image: 'https://images.unsplash.com/photo-1570586437263-ab629fccc818?auto=format&fit=crop&q=80&w=400&h=300',
    standards: ['Organic 100%'],
    price: 60,
    unit: 'กก.',
    stock: 20,
    isPreOrder: false,
  },
];
