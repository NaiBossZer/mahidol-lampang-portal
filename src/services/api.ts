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
  createdAt: string;
  totalAmount: string | number;
  status: OrderStatus;
  slipUrl?: string | null;
};
export type ProductWriteInput = {
  id?: string;
  name: string;
  price: number;
  unit: string;
  stock: number;
  image?: string;
  isPreOrder?: boolean;
  harvestDate?: string;
  plotId?: string;
};
export type EvBookingInput = {
  customerName: string;
  customerPhone: string;
  vehiclePlate: string;
  startAt: string;
  endAt: string;
};
export type EvBookingResult = { id: string; persisted: "api" | "local" };

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type ApiEnvelope<T> = { success?: boolean; data?: T; error?: string };
type ApiProduct = {
  id: string;
  name: string;
  price: string | number;
  unit: string;
  stockQuantity: number;
  imageUrl?: string | null;
  isPreorder: boolean;
  harvestDate?: string | null;
  researchTag?: string | null;
};

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new ApiError("ไม่สามารถเชื่อมต่อบริการได้", 0);
  }
  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const error =
      isRecord(payload) && typeof payload["error"] === "string"
        ? payload["error"]
        : "คำขอไม่สำเร็จ";
    throw new ApiError(error, response.status);
  }
  if (!isRecord(payload) || payload["data"] === undefined) return payload as T;
  return payload["data"] as T;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function mapApiProduct(product: ApiProduct): Product {
  const fallback = MOCK_PRODUCTS.find((item) => item.id === product.id) ?? MOCK_PRODUCTS[0];
  if (!fallback) throw new ApiError("ไม่พบข้อมูลสินค้าเริ่มต้น", 500);
  const mapped: Product = {
    ...fallback,
    id: product.id,
    name: product.name,
    price: Number(product.price),
    unit: product.unit,
    stock: product.stockQuantity,
    image: product.imageUrl ?? fallback.image,
    isPreOrder: product.isPreorder,
  };
  if (product.harvestDate) mapped.harvestDate = product.harvestDate;
  return mapped;
}

export async function getProducts(): Promise<Product[]> {
  try {
    const data = await request<unknown>("/api/products");
    if (!Array.isArray(data)) throw new ApiError("รูปแบบข้อมูลสินค้าไม่ถูกต้อง", 500);
    return data.filter(isApiProduct).map(mapApiProduct);
  } catch {
    return MOCK_PRODUCTS;
  }
}

function isApiProduct(value: unknown): value is ApiProduct {
  if (!isRecord(value)) return false;
  return (
    typeof value["id"] === "string" &&
    typeof value["name"] === "string" &&
    (typeof value["price"] === "number" || typeof value["price"] === "string") &&
    typeof value["unit"] === "string" &&
    typeof value["stockQuantity"] === "number" &&
    typeof value["isPreorder"] === "boolean"
  );
}

export async function createOrder(input: CreateOrderInput): Promise<unknown> {
  return request("/api/orders", { method: "POST", body: JSON.stringify(input) });
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<unknown> {
  return request(`/api/admin/orders/${encodeURIComponent(orderId)}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function getAdminOrders(): Promise<AdminOrder[]> {
  try {
    const data = await request<unknown>("/api/admin/orders");
    return Array.isArray(data) ? data.filter(isAdminOrder) : [];
  } catch {
    return [];
  }
}

function isAdminOrder(value: unknown): value is AdminOrder {
  if (!isRecord(value)) return false;
  return (
    typeof value["id"] === "string" &&
    typeof value["customerName"] === "string" &&
    typeof value["createdAt"] === "string" &&
    (typeof value["totalAmount"] === "string" || typeof value["totalAmount"] === "number") &&
    ["pending", "paid", "fulfilled", "cancelled"].includes(String(value["status"]))
  );
}

export async function createProduct(product: ProductWriteInput): Promise<unknown> {
  return request("/api/products", {
    method: "POST",
    body: JSON.stringify({
      ...product,
      stockQuantity: product.stock,
      imageUrl: product.image,
      isPreorder: product.isPreOrder,
      researchTag: product.plotId,
    }),
  });
}

export async function updateProduct(product: ProductWriteInput & { id: string }): Promise<unknown> {
  return request(`/api/products/${encodeURIComponent(product.id)}`, {
    method: "PUT",
    body: JSON.stringify({
      ...product,
      stockQuantity: product.stock,
      imageUrl: product.image,
      isPreorder: product.isPreOrder,
      researchTag: product.plotId,
    }),
  });
}

export async function deleteProduct(productId: string): Promise<void> {
  await request(`/api/products/${encodeURIComponent(productId)}`, { method: "DELETE" });
}

export async function updateInventory(productId: string, stock: number): Promise<unknown> {
  return request(`/api/inventory/${encodeURIComponent(productId)}`, {
    method: "PATCH",
    body: JSON.stringify({ stock }),
  });
}

export async function createEvBooking(input: EvBookingInput): Promise<EvBookingResult> {
  try {
    const data = await request<{ id: string }>("/api/ev-bookings", {
      method: "POST",
      body: JSON.stringify(input),
    });
    if (!data.id) throw new ApiError("ข้อมูลการจองจากระบบไม่ถูกต้อง", 500);
    return { id: data.id, persisted: "api" };
  } catch (error) {
    if (
      !(error instanceof ApiError) ||
      (error.status !== 0 && error.status !== 404 && error.status < 500)
    )
      throw error;
    const id = crypto.randomUUID();
    const pending = JSON.parse(
      localStorage.getItem("mahidol-lampang-ev-bookings-v1") ?? "[]",
    ) as unknown;
    const bookings = Array.isArray(pending) ? pending : [];
    localStorage.setItem(
      "mahidol-lampang-ev-bookings-v1",
      JSON.stringify([...bookings, { ...input, id, status: "pending" }]),
    );
    return { id, persisted: "local" };
  }
}
