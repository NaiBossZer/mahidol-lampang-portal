import type { Product } from "@/components/storefront/mockData";

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
  items?: { productId: string; productName?: string | null; quantity: number; pricePerUnit: string | number }[];
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
  constructor(message: string, status: number) { super(message); this.name = "ApiError"; this.status = status; }
}
function isRecord(v: unknown): v is Record<string, unknown> { return typeof v === "object" && v !== null; }
const pendingGets = new Map<string, Promise<unknown>>();
const GET_CACHE_TTL_MS = 30_000;
const getCache = new Map<string, { expiresAt: number; value: unknown }>();
async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 12_000);
  try {
    const r = await fetch(url, { ...init, signal: init.signal ?? controller.signal, headers: { Accept: "application/json", "Content-Type": "application/json", ...init.headers } });
    const p: unknown = await r.json().catch(() => null);
    if (!r.ok) {
      const m = isRecord(p) && typeof p["error"] === "string" ? p["error"] : "คำขอไม่สำเร็จ";
      throw new ApiError(m, r.status);
    }
    return isRecord(p) && p["data"] !== undefined ? (p["data"] as T) : (p as T);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(error instanceof DOMException && error.name === "AbortError" ? "บริการใช้เวลานานเกินไป" : "ไม่สามารถเชื่อมต่อบริการได้", 0);
  } finally { window.clearTimeout(timeout); }
}
export async function apiRequest<T>(url: string, init?: RequestInit): Promise<T> {
  const method = (init?.method ?? "GET").toUpperCase();
  if (method !== "GET") return request<T>(url, init);
  const cached = getCache.get(url);
  if (cached && cached.expiresAt > Date.now()) return cached.value as T;
  const pending = pendingGets.get(url);
  if (pending) return pending as Promise<T>;
  const promise = request<T>(url, init).then((value) => { getCache.set(url, { expiresAt: Date.now() + GET_CACHE_TTL_MS, value }); pendingGets.delete(url); return value; }).catch((error) => { pendingGets.delete(url); throw error; });
  pendingGets.set(url, promise);
  return promise;
}
export function invalidateApiCache(prefix?: string) {
  if (!prefix) { getCache.clear(); return; }
  for (const key of getCache.keys()) if (key.startsWith(prefix)) getCache.delete(key);
}

function standardsFromProduction(raw: Record<string, unknown>): Product["standards"] {
  const values = new Set<Product["standards"][number]>();
  const text = `${String(raw["category"] ?? "")} ${String(raw["researchTag"] ?? "")}`.toLowerCase();
  if (text.includes("organic") || text.includes("ออร์แกนิก")) values.add("Organic 100%");
  if (text.includes("gap")) values.add("GAP");
  if (raw["researchTag"] || text.includes("วิจัย") || text.includes("research")) values.add("งานวิจัย");
  return [...values];
}

export async function getProducts(): Promise<Product[]> {
  const data = await apiRequest<unknown[]>("/api/products");
  if (!Array.isArray(data)) return [];
  return data.flatMap((raw) => {
    if (!isRecord(raw) || typeof raw["id"] !== "string" || typeof raw["name"] !== "string") return [];
    const price = Number(raw["price"] ?? 0);
    const stock = Number(raw["stockQuantity"] ?? 0);
    const harvestDate = typeof raw["harvestDate"] === "string" ? raw["harvestDate"] : undefined;
    const standards = standardsFromProduction(raw);
    return [{
      id: raw["id"],
      name: raw["name"],
      image: typeof raw["imageUrl"] === "string" && raw["imageUrl"] ? raw["imageUrl"] : "/mahidol-logo.png",
      standards,
      price: Number.isFinite(price) ? price : 0,
      unit: typeof raw["unit"] === "string" ? raw["unit"] : "หน่วย",
      stock: Number.isFinite(stock) ? stock : 0,
      isPreOrder: raw["isPreorder"] === true,
      harvestDate,
      plotId: typeof raw["plotId"] === "string" ? raw["plotId"] : "",
      description: typeof raw["description"] === "string" ? raw["description"] : "",
      category: typeof raw["category"] === "string" ? raw["category"] : "",
      researchTag: typeof raw["researchTag"] === "string" ? raw["researchTag"] : "",
    }];
  });
}
export async function createProduct(p: ProductWriteInput) { const result = await apiRequest("/api/products", { method: "POST", body: JSON.stringify(p) }); invalidateApiCache("/api/products"); return result; }
export async function updateProduct(p: ProductWriteInput & { id: string }) { const result = await apiRequest(`/api/products?id=${encodeURIComponent(p.id)}`, { method: "PUT", body: JSON.stringify(p) }); invalidateApiCache("/api/products"); return result; }
export async function deleteProduct(id: string) { await apiRequest(`/api/products?id=${encodeURIComponent(id)}`, { method: "DELETE" }); invalidateApiCache("/api/products"); }
export async function updateInventory(id: string, stock: number) { const result = await apiRequest(`/api/inventory?id=${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify({ stock }) }); invalidateApiCache("/api/products"); return result; }
export async function uploadSlip(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("อ่านไฟล์ไม่สำเร็จ"));
    reader.onerror = () => reject(new Error("อ่านไฟล์ไม่สำเร็จ"));
    reader.readAsDataURL(file);
  });
  const result = await apiRequest<{ path: string }>("/api/uploads/slip", { method: "POST", body: JSON.stringify({ fileName: file.name, contentType: file.type, dataUrl }) });
  return result.path;
}
export async function createOrder(input: CreateOrderInput) { return apiRequest("/api/orders", { method: "POST", body: JSON.stringify(input) }); }
export async function getAdminOrders(): Promise<AdminOrder[]> { const d = await apiRequest<AdminOrder[]>("/api/orders"); return Array.isArray(d) ? d : []; }
export async function updateOrderStatus(id: string, status: OrderStatus) { return apiRequest(`/api/orders?id=${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify({ status }) }); }
export async function getAdminActivities(): Promise<AdminActivity[]> { return apiRequest("/api/admin/activities"); }
export async function createActivity(input: ActivityWriteInput) { const result = await apiRequest("/api/admin/activities", { method: "POST", body: JSON.stringify(input) }); invalidateApiCache("/api/admin/activities"); invalidateApiCache("/api/activities"); return result; }
export async function updateActivity(input: ActivityWriteInput & { id: string }) { const result = await apiRequest(`/api/admin/activities?id=${encodeURIComponent(input.id)}`, { method: "PUT", body: JSON.stringify(input) }); invalidateApiCache("/api/admin/activities"); invalidateApiCache("/api/activities"); return result; }
export async function deleteActivity(id: string) { await apiRequest(`/api/admin/activities?id=${encodeURIComponent(id)}`, { method: "DELETE" }); invalidateApiCache("/api/admin/activities"); invalidateApiCache("/api/activities"); }
export type EvBookingInput = { customerName: string; customerPhone: string; vehiclePlate: string; startAt: string; endAt: string };
export type EvBookingResult = { id: string; persisted: "api" | "local" };
export async function createEvBooking(input: EvBookingInput): Promise<EvBookingResult> {
  try { return { id: (await apiRequest<{ id: string }>("/api/ev-bookings", { method: "POST", body: JSON.stringify(input) })).id, persisted: "api" }; }
  catch (e) {
    if (!(e instanceof ApiError) || (e.status !== 0 && e.status !== 404 && e.status < 500)) throw e;
    const id = crypto.randomUUID(), key = "mahidol-lampang-ev-bookings-v1", old = JSON.parse(localStorage.getItem(key) ?? "[]");
    localStorage.setItem(key, JSON.stringify([...(Array.isArray(old) ? old : []), { ...input, id, status: "pending" }]));
    return { id, persisted: "local" };
  }
}
