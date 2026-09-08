import { MOCK_PRODUCTS, type Product } from "@/components/storefront/mockData";
export type OrderLineInput = { productId: string; quantity: number };
export type CreateOrderInput = {
  customerName: string;
  customerPhone: string;
  deliveryType: "pickup" | "delivery";
  address?: string;
  slipUrl?: string;
  items: OrderLineInput[];
};
export type OrderStatus = "pending" | "paid" | "fulfilled" | "cancelled";
export type AdminOrder = {
  id: string;
  customerName: string;
  customerPhone: string;
  createdAt: string;
  totalAmount: string | number;
  status: OrderStatus;
  slipUrl?: string | null;
  items?: {
    productId: string;
    productName?: string | null;
    quantity: number;
    pricePerUnit: string | number;
  }[];
};
export type ProductWriteInput = {
  id?: string;
  name: string;
  description?: string;
  category?: string;
  price: number;
  unit: string;
  stock: number;
  image?: string;
  isPreOrder?: boolean;
  harvestDate?: string;
  researchTag?: string;
  plotId?: string;
};
export type ActivityWriteInput = {
  id?: string;
  projectId?: string;
  centerId?: string;
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  activityDate: string;
  location?: string;
  participantCount?: number;
  objective?: string;
  process?: string;
  outcome?: string;
  impact?: string;
  featuredImage?: string;
  status: "draft" | "published" | "archived";
};
export type AdminActivity = ActivityWriteInput & {
  id: string;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};
export class ApiError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
export async function apiRequest<T>(url: string, init?: RequestInit): Promise<T> {
  let r: Response;
  try {
    r = await fetch(url, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new ApiError("ไม่สามารถเชื่อมต่อบริการได้", 0);
  }
  const p: unknown = await r.json().catch(() => null);
  if (!r.ok) {
    const m = isRecord(p) && typeof p["error"] === "string" ? p["error"] : "คำขอไม่สำเร็จ";
    throw new ApiError(m, r.status);
  }
  return isRecord(p) && p["data"] !== undefined ? (p["data"] as T) : (p as T);
}
export async function getProducts(): Promise<Product[]> {
  const data = await apiRequest<any[]>("/api/products");
  return Array.isArray(data)
    ? data.map((p) => {
        const base = MOCK_PRODUCTS.find((x) => x.name === p.name) ?? MOCK_PRODUCTS[0];
        if (!base) throw new ApiError("ไม่พบข้อมูลสินค้าเริ่มต้น", 500);
        return {
          ...base,
          id: p.id,
          name: p.name,
          price: Number(p.price),
          stock: p.stockQuantity,
          image: p.imageUrl ?? base.image,
          isPreOrder: p.isPreorder,
          plotId: p.plotId ?? "",
          harvestDate: p.harvestDate ?? base.harvestPrediction.estimatedDate,
        };
      })
    : [];
}
export async function createProduct(p: ProductWriteInput) {
  return apiRequest("/api/products", { method: "POST", body: JSON.stringify(p) });
}
export async function updateProduct(p: ProductWriteInput & { id: string }) {
  return apiRequest(`/api/products?id=${encodeURIComponent(p.id)}`, {
    method: "PUT",
    body: JSON.stringify(p),
  });
}
export async function deleteProduct(id: string) {
  await apiRequest(`/api/products?id=${encodeURIComponent(id)}`, { method: "DELETE" });
}
export async function updateInventory(id: string, stock: number) {
  return apiRequest(`/api/inventory?id=${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({ stock }),
  });
}
export async function createOrder(input: CreateOrderInput) {
  return apiRequest("/api/orders", { method: "POST", body: JSON.stringify(input) });
}
export async function getAdminOrders(): Promise<AdminOrder[]> {
  const d = await apiRequest<AdminOrder[]>("/api/orders");
  return Array.isArray(d) ? d : [];
}
export async function updateOrderStatus(id: string, status: OrderStatus) {
  return apiRequest(`/api/orders?id=${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
export async function getAdminActivities(): Promise<AdminActivity[]> {
  return apiRequest("/api/admin/activities");
}
export async function createActivity(input: ActivityWriteInput) {
  return apiRequest("/api/admin/activities", { method: "POST", body: JSON.stringify(input) });
}
export async function updateActivity(input: ActivityWriteInput & { id: string }) {
  return apiRequest(`/api/admin/activities?id=${encodeURIComponent(input.id)}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}
export async function deleteActivity(id: string) {
  return apiRequest(`/api/admin/activities?id=${encodeURIComponent(id)}`, { method: "DELETE" });
}
export type EvBookingInput = {
  customerName: string;
  customerPhone: string;
  vehiclePlate: string;
  startAt: string;
  endAt: string;
};
export type EvBookingResult = { id: string; persisted: "api" | "local" };
export async function createEvBooking(input: EvBookingInput): Promise<EvBookingResult> {
  try {
    return {
      id: (
        await apiRequest<{ id: string }>("/api/ev-bookings", {
          method: "POST",
          body: JSON.stringify(input),
        })
      ).id,
      persisted: "api",
    };
  } catch (e) {
    if (!(e instanceof ApiError) || (e.status !== 0 && e.status !== 404 && e.status < 500)) throw e;
    const id = crypto.randomUUID(),
      key = "mahidol-lampang-ev-bookings-v1",
      old = JSON.parse(localStorage.getItem(key) ?? "[]");
    localStorage.setItem(
      key,
      JSON.stringify([...(Array.isArray(old) ? old : []), { ...input, id, status: "pending" }]),
    );
    return { id, persisted: "local" };
  }
}
