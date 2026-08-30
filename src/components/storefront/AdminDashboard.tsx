import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Search,
  Calendar as CalendarIcon,
  Package,
  ShoppingCart,
} from "lucide-react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { toast } from "sonner";
import {
  createProduct,
  deleteProduct,
  getAdminOrders,
  getProducts,
  updateOrderStatus,
  updateProduct,
  type ProductWriteInput,
} from "@/services/api";
import type { Product } from "./mockData";

// --- Types & Mock Data ---

type OrderStatus = "pending_payment" | "preparing" | "ready" | "completed" | "cancelled";

interface AdminProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  unit: string;
  plot: string;
  harvestDate: string;
  shelfLife: string;
  image: string;
}

interface Order {
  id: string;
  customerName: string;
  date: string;
  total: number;
  status: OrderStatus;
  slipImage?: string;
  items: { name: string; qty: number }[];
}

const MOCK_PRODUCTS: AdminProduct[] = [
  {
    id: "p1",
    name: "ผักสลัดกรีนโอ๊ค",
    price: 50,
    stock: 15,
    unit: "กก.",
    plot: "P-01 (รอบที่ 3)",
    harvestDate: "2026-08-31",
    shelfLife: "7 วัน",
    image: "https://images.unsplash.com/photo-1640958904159-51ae08bc3412?w=150",
  },
  {
    id: "p2",
    name: "มะเขือเทศราชินี",
    price: 80,
    stock: 0,
    unit: "กก.",
    plot: "T-02 (อินทรีย์)",
    harvestDate: "2026-09-05",
    shelfLife: "14 วัน",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=150",
  },
  {
    id: "p3",
    name: "เมล่อนสายพันธุ์ใหม่",
    price: 150,
    stock: 5,
    unit: "ลูก",
    plot: "M-01 (วิจัย)",
    harvestDate: "2026-09-10",
    shelfLife: "10 วัน",
    image: "https://images.unsplash.com/photo-1595475207225-428b62bda831?w=150",
  },
];

const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-001",
    customerName: "สมชาย ใจดี",
    date: "2026-08-30T10:30:00",
    total: 250,
    status: "pending_payment",
    slipImage: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=300",
    items: [
      { name: "ผักสลัดกรีนโอ๊ค", qty: 2 },
      { name: "เมล่อนสายพันธุ์ใหม่", qty: 1 },
    ],
  },
  {
    id: "ORD-002",
    customerName: "สมหญิง งามตา",
    date: "2026-08-30T09:15:00",
    total: 80,
    status: "preparing",
    items: [{ name: "มะเขือเทศราชินี", qty: 1 }],
  },
  {
    id: "ORD-003",
    customerName: "วิชัย มั่นคง",
    date: "2026-08-29T15:40:00",
    total: 150,
    status: "ready",
    items: [{ name: "ผักสลัดกรีนโอ๊ค", qty: 3 }],
  },
];

// --- Status Helpers ---
const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case "pending_payment":
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          รอตรวจสอบชำระเงิน
        </Badge>
      );
    case "preparing":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          กำลังเตรียมสินค้า
        </Badge>
      );
    case "ready":
      return (
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          พร้อมรับ/จัดส่ง
        </Badge>
      );
    case "completed":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          สำเร็จ
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          ยกเลิก
        </Badge>
      );
  }
};

export const AdminDashboard = () => {
  const [products, setProducts] = useState<AdminProduct[]>(MOCK_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  // States for Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [isSlipModalOpen, setIsSlipModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // States for Forecast Calendar
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    void Promise.all([getProducts(), getAdminOrders()]).then(([liveProducts, liveOrders]) => {
      if (liveProducts.length > 0)
        setProducts(
          liveProducts.map((product: Product) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            stock: product.stock,
            unit: product.unit,
            plot: product.plotId,
            harvestDate: product.harvestDate ?? product.harvestPrediction.estimatedDate,
            shelfLife: "-",
            image: product.image,
          })),
        );
      if (liveOrders.length > 0)
        setOrders(
          liveOrders.map((order) => ({
            id: order.id,
            customerName: order.customerName,
            date: order.createdAt,
            total: Number(order.totalAmount),
            status:
              order.status === "pending"
                ? "pending_payment"
                : order.status === "paid"
                  ? "preparing"
                  : order.status === "fulfilled"
                    ? "completed"
                    : "cancelled",
            items: [],
            ...(order.slipUrl ? { slipImage: order.slipUrl } : {}),
          })),
        );
    });
  }, []);

  // --- Handlers ---
  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const input: ProductWriteInput = {
      name: String(form.get("name") ?? "").trim(),
      image: String(form.get("image") ?? "").trim(),
      price: Number(form.get("price")),
      stock: Number(form.get("stock")),
      unit: String(form.get("unit") ?? "กก.").trim(),
      plotId: String(form.get("plot") ?? "").trim(),
      harvestDate: String(form.get("harvestDate") ?? ""),
      ...(editingProduct ? { id: editingProduct.id } : {}),
    };
    if (
      !input.name ||
      !Number.isFinite(input.price) ||
      input.price < 0 ||
      !Number.isInteger(input.stock) ||
      input.stock < 0 ||
      !input.unit
    ) {
      toast.error("กรุณาตรวจสอบข้อมูลสินค้า");
      return;
    }
    try {
      if (editingProduct) await updateProduct({ ...input, id: editingProduct.id });
      else await createProduct(input);
      toast.success("บันทึกสินค้าเข้าระบบแล้ว");
    } catch {
      toast.warning("API ยังไม่พร้อม จึงบันทึกเฉพาะในหน้าจอนี้");
    }
    const localProduct: AdminProduct = {
      id: editingProduct?.id ?? crypto.randomUUID(),
      name: input.name,
      image: input.image ?? "/mahidol-logo.png",
      price: input.price,
      stock: input.stock,
      unit: input.unit,
      plot: input.plotId ?? "-",
      harvestDate: input.harvestDate ?? "",
      shelfLife: String(form.get("shelfLife") ?? "-"),
    };
    setProducts((previous) =>
      editingProduct
        ? previous.map((product) => (product.id === editingProduct.id ? localProduct : product))
        : [...previous, localProduct],
    );
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleApproveSlip = async () => {
    if (selectedOrder) {
      try {
        await updateOrderStatus(selectedOrder.id, "paid");
        toast.success("อนุมัติการชำระเงินแล้ว");
      } catch {
        toast.warning("อัปเดต API ไม่สำเร็จ แต่ปรับสถานะในหน้าจอแล้ว");
      }
      setOrders((previous) =>
        previous.map((o) => (o.id === selectedOrder.id ? { ...o, status: "preparing" } : o)),
      );
      setIsSlipModalOpen(false);
    }
  };

  const handleRejectSlip = async () => {
    if (selectedOrder) {
      try {
        await updateOrderStatus(selectedOrder.id, "cancelled");
        toast.success("ปฏิเสธสลิปแล้ว");
      } catch {
        toast.warning("อัปเดต API ไม่สำเร็จ แต่ปรับสถานะในหน้าจอแล้ว");
      }
      setOrders((previous) =>
        previous.map((o) => (o.id === selectedOrder.id ? { ...o, status: "cancelled" } : o)),
      );
      setIsSlipModalOpen(false);
    }
  };

  const handleDeleteProduct = async (product: AdminProduct) => {
    try {
      await deleteProduct(product.id);
      toast.success("ลบสินค้าแล้ว");
    } catch {
      toast.warning("API ยังไม่พร้อม จึงลบเฉพาะในหน้าจอนี้");
    }
    setProducts((previous) => previous.filter((item) => item.id !== product.id));
  };

  // Helper for calendar
  const harvestsOnDate = products.filter(
    (p) => p.harvestDate === (date ? format(date, "yyyy-MM-dd") : ""),
  );

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-[#002D62]">ระบบหลังบ้าน (Admin Dashboard)</h2>
        <p className="text-gray-500">จัดการสินค้า คำสั่งซื้อ และคาดการณ์ผลผลิตของศูนย์วิจัย</p>
        {products.filter((product) => product.stock < 10).length > 0 && (
          <p role="status" className="mt-2 text-sm font-semibold text-red-600">
            แจ้งเตือน: มีสินค้า stock ต่ำกว่า 10 จำนวน{" "}
            {products.filter((product) => product.stock < 10).length} รายการ
          </p>
        )}
      </div>

      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="grid w-full md:w-[600px] grid-cols-3 mb-8">
          <TabsTrigger
            value="inventory"
            className="data-[state=active]:bg-[#002D62] data-[state=active]:text-white"
          >
            <Package className="w-4 h-4 mr-2" />
            สินค้าและผลผลิต
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="data-[state=active]:bg-[#002D62] data-[state=active]:text-white"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            คำสั่งซื้อ
          </TabsTrigger>
          <TabsTrigger
            value="forecast"
            className="data-[state=active]:bg-[#002D62] data-[state=active]:text-white"
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            ตารางเก็บเกี่ยว
          </TabsTrigger>
        </TabsList>

        {/* --- Tab 1: Inventory Management --- */}
        <TabsContent value="inventory">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>จัดการสินค้าและรอบเก็บเกี่ยว</CardTitle>
                <CardDescription>เพิ่ม ลบ แก้ไข ข้อมูลผลผลิตและสต็อก</CardDescription>
              </div>
              <Button
                className="bg-[#2E7D32] hover:bg-[#2E7D32]/90"
                onClick={() => {
                  setEditingProduct(null);
                  setIsProductModalOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" /> เพิ่มผลผลิต
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>สินค้า</TableHead>
                      <TableHead>แปลง/รอบวิจัย</TableHead>
                      <TableHead>สต็อกคงเหลือ</TableHead>
                      <TableHead>วันเก็บเกี่ยว</TableHead>
                      <TableHead>ราคา</TableHead>
                      <TableHead className="text-right">จัดการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 rounded-md object-cover"
                              onError={(event) => {
                                event.currentTarget.src = "/mahidol-logo.png";
                              }}
                            />
                            <span className="font-medium">{product.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{product.plot}</TableCell>
                        <TableCell>
                          <Badge variant={product.stock > 0 ? "secondary" : "destructive"}>
                            {product.stock} {product.unit}
                          </Badge>
                        </TableCell>
                        <TableCell>{product.harvestDate}</TableCell>
                        <TableCell>
                          ฿{product.price}/{product.unit}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setEditingProduct(product);
                              setIsProductModalOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => void handleDeleteProduct(product)}
                            aria-label={`ลบ ${product.name}`}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Tab 2: Orders Management --- */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>รายการคำสั่งซื้อล่าสุด</CardTitle>
              <CardDescription>จัดการสถานะการสั่งซื้อและตรวจสอบสลิปโอนเงิน</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>รหัสสั่งซื้อ</TableHead>
                      <TableHead>ลูกค้า</TableHead>
                      <TableHead>รายการสินค้า</TableHead>
                      <TableHead>ยอดรวม</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead className="text-right">ตรวจสอบสลิป</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {order.items.map((item, i) => (
                              <div key={i}>
                                {item.name} x{item.qty}
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="font-bold text-[#002D62]">฿{order.total}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="text-right">
                          {order.status === "pending_payment" && order.slipImage ? (
                            <Button
                              size="sm"
                              className="bg-[#F2A900] hover:bg-[#F2A900]/90 text-[#002D62]"
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsSlipModalOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-1" /> ดูสลิป
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" disabled>
                              ไม่มีสลิป
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Tab 3: Yield Forecast --- */}
        <TabsContent value="forecast">
          <Card>
            <CardHeader>
              <CardTitle>คาดการณ์ผลผลิต (Yield Forecast)</CardTitle>
              <CardDescription>ตรวจสอบรอบการเก็บเกี่ยวเพื่อเปิดระบบ Pre-Order</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-8">
              <div className="border rounded-md p-4 bg-white inline-block">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border-0"
                />
              </div>
              <div className="flex-1 space-y-4">
                <h3 className="font-semibold text-lg text-[#002D62]">
                  ผลผลิตที่คาดว่าจะเก็บเกี่ยววันที่: {date ? format(date, "dd MMM yyyy") : "-"}
                </h3>

                {harvestsOnDate.length > 0 ? (
                  <div className="space-y-4">
                    {harvestsOnDate.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-4 p-4 border rounded-lg bg-green-50/50"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-16 h-16 rounded-md object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-[#2E7D32]">{p.name}</h4>
                          <p className="text-sm text-gray-600">แปลงปลูก: {p.plot}</p>
                          <p className="text-sm text-gray-600">
                            ปริมาณคาดการณ์: {p.stock} {p.unit}
                          </p>
                        </div>
                        <Button variant="outline" className="border-[#002D62] text-[#002D62]">
                          เปิด Pre-Order
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400 border-2 border-dashed rounded-lg">
                    ไม่มีกำหนดเก็บเกี่ยวในวันนี้
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* --- Modals --- */}

      {/* Add/Edit Product Modal */}
      <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "แก้ไขข้อมูลผลผลิต" : "เพิ่มผลผลิตใหม่"}</DialogTitle>
            <DialogDescription>
              กรอกข้อมูลผลผลิต ข้อมูลงานวิจัย และวันที่เก็บเกี่ยว
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveProduct} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ชื่อผลผลิต</Label>
                <Input name="name" defaultValue={editingProduct?.name} required />
              </div>
              <div className="space-y-2">
                <Label>URL รูปภาพ</Label>
                <Input
                  name="image"
                  defaultValue={editingProduct?.image}
                  placeholder="https://..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>ราคา (บาท)</Label>
                <Input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={editingProduct?.price}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>ปริมาณ</Label>
                  <Input
                    name="stock"
                    type="number"
                    min="0"
                    defaultValue={editingProduct?.stock}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>หน่วย</Label>
                  <Input name="unit" defaultValue={editingProduct?.unit || "กก."} required />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-4 border">
              <h4 className="font-semibold text-sm text-[#002D62] flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" /> ฟิลด์พิเศษสำหรับงานวิจัย
              </h4>
              <div className="space-y-2">
                <Label>แปลงปลูก / รอบการวิจัยที่</Label>
                <Input
                  name="plot"
                  defaultValue={editingProduct?.plot}
                  placeholder="เช่น P-01 (รอบที่ 3)"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>วันที่เก็บเกี่ยว (Harvest Date)</Label>
                  <Input
                    name="harvestDate"
                    type="date"
                    defaultValue={editingProduct?.harvestDate}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>อายุการเก็บรักษา (Shelf Life)</Label>
                  <Input
                    name="shelfLife"
                    defaultValue={editingProduct?.shelfLife}
                    placeholder="เช่น 7 วัน"
                    required
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsProductModalOpen(false)}>
                ยกเลิก
              </Button>
              <Button type="submit" className="bg-[#002D62] hover:bg-[#002D62]/90">
                บันทึกข้อมูล
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Slip Preview Modal */}
      <Dialog open={isSlipModalOpen} onOpenChange={setIsSlipModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>ตรวจสอบการชำระเงิน</DialogTitle>
            <DialogDescription>คำสั่งซื้อ: {selectedOrder?.id}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4">
            <div className="w-full h-80 bg-gray-100 rounded-md border flex items-center justify-center overflow-hidden">
              {selectedOrder?.slipImage ? (
                <img
                  src={selectedOrder.slipImage}
                  alt="Slip"
                  className="object-contain w-full h-full"
                />
              ) : (
                <span className="text-gray-400">ไม่พบรูปภาพสลิป</span>
              )}
            </div>
            <div className="w-full flex justify-between gap-4 pt-4">
              <Button
                variant="outline"
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleRejectSlip}
              >
                <XCircle className="w-4 h-4 mr-2" /> ปฏิเสธ (ข้อมูลไม่ถูกต้อง)
              </Button>
              <Button
                className="w-full bg-[#2E7D32] hover:bg-[#2E7D32]/90"
                onClick={handleApproveSlip}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" /> อนุมัติ (รับยอดแล้ว)
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
