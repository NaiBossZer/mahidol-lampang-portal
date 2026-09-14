import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Activity,
  CalendarRange,
  CheckCircle2,
  ChevronDown,
  Edit3,
  Loader2,
  Package,
  Plus,
  ShoppingCart,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import {
  createActivity,
  createProduct,
  deleteActivity,
  deleteProduct,
  getAdminActivities,
  getAdminOrders,
  getProducts,
  updateActivity,
  updateInventory,
  updateOrderStatus,
  updateProduct,
  type AdminActivity,
  type AdminOrder,
  type ActivityWriteInput,
  type OrderStatus,
  type ProductWriteInput,
} from "@/services/api";
import { MOCK_PRODUCTS } from "@/components/storefront/mockData";
import { cn } from "@/lib/utils";

type Tab = "activities" | "products" | "orders";
type ProductRow = ProductWriteInput & { id: string };

const blankActivity: ActivityWriteInput = {
  title: "",
  slug: "",
  summary: "",
  content: "",
  activityDate: new Date().toISOString().slice(0, 16),
  location: "",
  participantCount: 0,
  objective: "",
  process: "",
  outcome: "",
  impact: "",
  featuredImage: "",
  status: "draft",
};

// ---- Status chip helpers ----

const ACTIVITY_STATUS_CONFIG: Record<
  string,
  { label: string; className: string }
> = {
  draft: {
    label: "ร่าง (Draft)",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
  published: {
    label: "เผยแพร่แล้ว",
    className: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  scheduled: {
    label: "กำหนดการแล้ว",
    className: "bg-blue-50 text-blue-800 border-blue-200",
  },
  ongoing: {
    label: "กำลังดำเนินการ",
    className: "bg-amber-50 text-amber-800 border-amber-200",
  },
  completed: {
    label: "เสร็จสิ้น",
    className: "bg-brand-blue/10 text-brand-blue border-brand-blue/20",
  },
  cancelled: {
    label: "ยกเลิก",
    className: "bg-rose-50 text-rose-700 border-rose-200",
  },
  archived: {
    label: "จัดเก็บแล้ว",
    className: "bg-slate-50 text-slate-500 border-slate-200",
  },
};

const ORDER_STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  pending: {
    label: "รอดำเนินการ",
    className: "bg-amber-50 text-amber-800 border-amber-200",
  },
  paid: {
    label: "ชำระแล้ว",
    className: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  fulfilled: {
    label: "ส่งมอบแล้ว",
    className: "bg-brand-blue/10 text-brand-blue border-brand-blue/20",
  },
  cancelled: {
    label: "ยกเลิก",
    className: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

function ActivityStatusChip({ status }: { status: string }) {
  const config = ACTIVITY_STATUS_CONFIG[status] ?? {
    label: status,
    className: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}

function OrderStatusChip({ status }: { status: string }) {
  const config = ORDER_STATUS_CONFIG[status] ?? {
    label: status,
    className: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}

// ---- Thai field label map ----

const ACTIVITY_FIELD_LABELS: Record<string, string> = {
  title: "ชื่อกิจกรรม *",
  slug: "URL Slug *",
  activityDate: "วันที่จัดกิจกรรม *",
  location: "สถานที่จัดกิจกรรม",
  participantCount: "จำนวนผู้เข้าร่วม (คน)",
  featuredImage: "URL รูปภาพหลัก",
  summary: "สรุปโดยย่อ",
  objective: "วัตถุประสงค์",
  process: "ขั้นตอนการดำเนินงาน",
  outcome: "ผลลัพธ์ที่ได้",
  impact: "ผลกระทบต่อชุมชน",
  content: "เนื้อหาฉบับเต็ม (รายละเอียด)",
};

const PRODUCT_FIELD_LABELS: Record<string, string> = {
  name: "ชื่อผลผลิต *",
  price: "ราคาต่อหน่วย (บาท) *",
  unit: "หน่วย (เช่น กก., ชิ้น)",
  stock: "จำนวนคงเหลือ *",
  image: "URL รูปภาพผลผลิต",
  harvestDate: "วันที่เก็บเกี่ยว",
  plotId: "รหัสแปลง (Plot ID)",
  researchTag: "หมวดวิจัย (Research Tag)",
  category: "หมวดหมู่สินค้า",
};

// ---- Tab definitions ----

const TABS: { id: Tab; label: string; icon: typeof Activity }[] = [
  { id: "activities", label: "กิจกรรม Social Engagement", icon: CalendarRange },
  { id: "products", label: "ผลผลิต / Products", icon: Package },
  { id: "orders", label: "คำสั่งซื้อ / Orders", icon: ShoppingCart },
];

export function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("activities");
  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingActivity, setEditingActivity] = useState<AdminActivity | null>(null);
  const [activityForm, setActivityForm] = useState<ActivityWriteInput>(blankActivity);
  const [showActivity, setShowActivity] = useState(false);
  const [showProduct, setShowProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductRow | null>(null);
  const [productForm, setProductForm] = useState<ProductWriteInput>({
    name: "",
    price: 0,
    unit: "กก.",
    stock: 0,
    image: "",
    isPreOrder: false,
    harvestDate: "",
    plotId: "",
    researchTag: "",
  });

  const load = async () => {
    setLoading(true);
    try {
      const [a, p, o] = await Promise.all([getAdminActivities(), getProducts(), getAdminOrders()]);
      setActivities(a);
      setProducts(p as ProductRow[]);
      setOrders(o);
    } catch (e) {
      console.error(e);
      toast.error("ไม่สามารถโหลดข้อมูลหลังบ้านได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const saveActivity = async () => {
    if (!activityForm.title || !activityForm.slug) {
      toast.error("กรุณาระบุชื่อกิจกรรมและ URL Slug");
      return;
    }
    try {
      if (editingActivity) await updateActivity({ ...activityForm, id: editingActivity.id });
      else await createActivity(activityForm);
      toast.success("บันทึกกิจกรรมเรียบร้อยแล้ว");
      setShowActivity(false);
      setEditingActivity(null);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "บันทึกกิจกรรมไม่สำเร็จ");
    }
  };

  const saveProduct = async () => {
    if (!productForm.name || productForm.price < 0 || productForm.stock < 0) {
      toast.error("กรุณาตรวจสอบข้อมูลผลผลิต");
      return;
    }
    try {
      if (editingProduct) await updateProduct({ ...productForm, id: editingProduct.id });
      else await createProduct(productForm);
      toast.success("บันทึกข้อมูลผลผลิตเรียบร้อยแล้ว");
      setShowProduct(false);
      setEditingProduct(null);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "บันทึกผลผลิตไม่สำเร็จ");
    }
  };

  const editProduct = (p: ProductRow) => {
    setEditingProduct(p);
    setProductForm({ ...p });
    setShowProduct(true);
  };

  return (
    <main className="w-full max-w-7xl mx-auto px-4 py-6 md:px-8 space-y-6">
      {/* Page header */}
      <header className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-blue">
            MAHIDOL SOCIAL ENGAGEMENT PLATFORM
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl">
          ศูนย์จัดการผลผลิตและกิจกรรม
        </h1>
        <p className="text-sm text-slate-600">
          จัดการกิจกรรมชุมชน ผลผลิต Smart Farm และคำสั่งซื้อจากฐานข้อมูลเดียวกัน
        </p>
      </header>

      {/* Tab Navigation */}
      <nav
        className="flex gap-1.5 rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-xs"
        aria-label="Tab navigation"
      >
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all cursor-pointer",
              tab === id
                ? "bg-brand-navy text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline truncate">{label}</span>
          </button>
        ))}
      </nav>

      {/* Content */}
      {loading ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-12 text-center">
          <Loader2 className="h-7 w-7 animate-spin text-brand-blue" />
          <p className="text-sm font-medium text-slate-500">กำลังโหลดข้อมูล...</p>
        </div>
      ) : tab === "activities" ? (
        <ActivitiesTab
          activities={activities}
          onAdd={() => {
            setEditingActivity(null);
            setActivityForm({ ...blankActivity });
            setShowActivity(true);
          }}
          onEdit={(a) => {
            setEditingActivity(a);
            setActivityForm({ ...a });
            setShowActivity(true);
          }}
          onDelete={async (a) => {
            if (confirm(`ลบกิจกรรม "${a.title}" หรือไม่?`)) {
              await deleteActivity(a.id);
              await load();
            }
          }}
        />
      ) : tab === "products" ? (
        <ProductsTab
          products={products}
          onAdd={() => {
            setEditingProduct(null);
            setProductForm({
              name: "",
              price: 0,
              unit: "กก.",
              stock: 0,
              image: "",
              isPreOrder: false,
              harvestDate: "",
              plotId: "",
              researchTag: "",
            });
            setShowProduct(true);
          }}
          onEdit={editProduct}
          onDelete={async (p) => {
            if (confirm(`ลบผลผลิต "${p.name}" หรือไม่?`)) {
              await deleteProduct(p.id);
              await load();
            }
          }}
        />
      ) : (
        <OrdersTab orders={orders} onStatusChange={async (id, status) => {
          await updateOrderStatus(id, status);
          await load();
        }} />
      )}

      {/* Activity Modal */}
      {showActivity && (
        <Modal
          title={editingActivity ? "แก้ไขกิจกรรม" : "เพิ่มกิจกรรมใหม่"}
          onClose={() => setShowActivity(false)}
          onSave={saveActivity}
          saveLabel="บันทึกกิจกรรม"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {(
              [
                "title",
                "slug",
                "activityDate",
                "location",
                "participantCount",
                "featuredImage",
                "summary",
                "objective",
                "process",
                "outcome",
                "impact",
                "content",
              ] as const
            ).map((k) => {
              const isWide =
                k === "content" ||
                k === "summary" ||
                k === "objective" ||
                k === "process" ||
                k === "outcome" ||
                k === "impact";
              return (
                <FormField
                  key={k}
                  label={ACTIVITY_FIELD_LABELS[k] ?? k}
                  className={isWide ? "md:col-span-2" : ""}
                >
                  {k === "participantCount" ? (
                    <input
                      type="number"
                      className={fieldClass}
                      value={activityForm[k] ?? 0}
                      onChange={(e) =>
                        setActivityForm({ ...activityForm, participantCount: Number(e.target.value) })
                      }
                    />
                  ) : k === "activityDate" ? (
                    <input
                      type="datetime-local"
                      className={fieldClass}
                      value={String(activityForm[k]).slice(0, 16)}
                      onChange={(e) =>
                        setActivityForm({ ...activityForm, activityDate: e.target.value })
                      }
                    />
                  ) : (
                    <textarea
                      rows={k === "content" ? 5 : 2}
                      className={fieldClass}
                      value={String(activityForm[k] ?? "")}
                      onChange={(e) => setActivityForm({ ...activityForm, [k]: e.target.value })}
                    />
                  )}
                </FormField>
              );
            })}
            <FormField label="สถานะ" className="md:col-span-2">
              <div className="relative">
                <select
                  className={cn(fieldClass, "appearance-none pr-8")}
                  value={activityForm.status}
                  onChange={(e) =>
                    setActivityForm({
                      ...activityForm,
                      status: e.target.value as ActivityWriteInput["status"],
                    })
                  }
                >
                  <option value="draft">ร่าง (Draft)</option>
                  <option value="published">เผยแพร่แล้ว (Published)</option>
                  <option value="scheduled">กำหนดการแล้ว (Scheduled)</option>
                  <option value="ongoing">กำลังดำเนินการ (Ongoing)</option>
                  <option value="completed">เสร็จสิ้น (Completed)</option>
                  <option value="cancelled">ยกเลิก (Cancelled)</option>
                  <option value="archived">จัดเก็บแล้ว (Archived)</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-3 h-4 w-4 text-slate-400" />
              </div>
            </FormField>
          </div>
        </Modal>
      )}

      {/* Product Modal */}
      {showProduct && (
        <Modal
          title={editingProduct ? "แก้ไขข้อมูลผลผลิต" : "เพิ่มผลผลิตใหม่"}
          onClose={() => setShowProduct(false)}
          onSave={saveProduct}
          saveLabel="บันทึกผลผลิต"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {(
              [
                "name",
                "price",
                "unit",
                "stock",
                "image",
                "harvestDate",
                "plotId",
                "researchTag",
                "category",
              ] as const
            ).map((k) => (
              <FormField key={k} label={PRODUCT_FIELD_LABELS[k] ?? k}>
                <input
                  type={k === "price" || k === "stock" ? "number" : "text"}
                  className={fieldClass}
                  value={String(productForm[k] ?? "")}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      [k]:
                        k === "price" || k === "stock"
                          ? Number(e.target.value)
                          : e.target.value,
                    })
                  }
                />
              </FormField>
            ))}
            <div className="md:col-span-2">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 transition hover:bg-slate-100/60">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-brand-navy"
                  checked={!!productForm.isPreOrder}
                  onChange={(e) =>
                    setProductForm({ ...productForm, isPreOrder: e.target.checked })
                  }
                />
                <div>
                  <p className="text-sm font-semibold text-slate-800">เปิดรับ Pre-order</p>
                  <p className="text-xs text-slate-500">
                    ลูกค้าสามารถสั่งจองล่วงหน้าก่อนสินค้าพร้อมจำหน่าย
                  </p>
                </div>
              </label>
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
}

// ---- Tab Components ----

function ActivitiesTab({
  activities,
  onAdd,
  onEdit,
  onDelete,
}: {
  activities: AdminActivity[];
  onAdd: () => void;
  onEdit: (a: AdminActivity) => void;
  onDelete: (a: AdminActivity) => void;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-brand-navy">กิจกรรม Social Engagement</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            จัดการวงจรกิจกรรม: ร่าง → เผยแพร่ → เสร็จสิ้น → จัดเก็บ
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand-navy px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-brand-navy/90 focus-visible:outline-2 focus-visible:outline-brand-blue transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          เพิ่มกิจกรรม
        </button>
      </div>

      {activities.length === 0 ? (
        <EmptyState icon={<CalendarRange className="h-8 w-8 text-slate-300" />} text="ยังไม่มีกิจกรรมที่บันทึก" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-xs">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  กิจกรรม
                </th>
                <th className="p-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                  วันที่จัด
                </th>
                <th className="p-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                  สถานะ
                </th>
                <th className="p-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                  ผู้เข้าร่วม
                </th>
                <th className="p-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activities.map((a) => (
                <tr key={a.id} className="transition hover:bg-slate-50/50">
                  <td className="p-4">
                    <p className="max-w-xs truncate text-sm font-semibold text-slate-900">
                      {a.title}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] text-slate-400">/{a.slug}</p>
                  </td>
                  <td className="p-4 text-center text-xs text-slate-600">
                    {new Date(a.activityDate).toLocaleDateString("th-TH", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-4 text-center">
                    <ActivityStatusChip status={a.status} />
                  </td>
                  <td className="p-4 text-center font-numeric text-sm font-semibold text-slate-700">
                    {(a.participantCount ?? 0).toLocaleString()}
                    <span className="ml-1 text-[10px] font-normal text-slate-400">คน</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEdit(a)}
                        title="แก้ไขกิจกรรม"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-brand-blue/30 hover:bg-brand-blue/5 hover:text-brand-blue transition cursor-pointer"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(a)}
                        title="ลบกิจกรรม"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 transition cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function ProductsTab({
  products,
  onAdd,
  onEdit,
  onDelete,
}: {
  products: ProductRow[];
  onAdd: () => void;
  onEdit: (p: ProductRow) => void;
  onDelete: (p: ProductRow) => void;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-brand-navy">ผลผลิต Smart Farm</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            ผลผลิตจากแปลงเกษตรที่พร้อมจำหน่ายหรือรับ Pre-order
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand-navy px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-brand-navy/90 focus-visible:outline-2 focus-visible:outline-brand-blue transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          เพิ่มผลผลิต
        </button>
      </div>

      {products.length === 0 ? (
        <EmptyState icon={<Package className="h-8 w-8 text-slate-300" />} text="ยังไม่มีผลผลิตในระบบ" />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition hover:border-slate-300 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">{p.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    แปลง {p.plotId || "—"} · {p.category || "ไม่ระบุหมวด"}
                  </p>
                </div>
                <span
                  className={cn(
                    "inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10px] font-bold",
                    p.stock > 0
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-rose-200 bg-rose-50 text-rose-700",
                  )}
                >
                  {p.stock > 0 ? `คงเหลือ ${p.stock}` : "หมดสต็อก"}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="font-numeric text-lg font-bold text-brand-navy">
                    ฿{Number(p.price).toLocaleString()}
                  </p>
                  <p className="text-[11px] text-slate-500">ต่อ {p.unit}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {p.isPreOrder && (
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                      Pre-order
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => onEdit(p)}
                    title="แก้ไขผลผลิต"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-brand-blue/30 hover:bg-brand-blue/5 hover:text-brand-blue transition cursor-pointer"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(p)}
                    title="ลบผลผลิต"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 transition cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function OrdersTab({
  orders,
  onStatusChange,
}: {
  orders: AdminOrder[];
  onStatusChange: (id: string, status: OrderStatus) => Promise<void>;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-base font-bold text-brand-navy">คำสั่งซื้อจากชุมชน</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          ตรวจสอบการชำระเงินและอัปเดตสถานะการส่งมอบผลผลิต
        </p>
      </div>

      {orders.length === 0 ? (
        <EmptyState icon={<ShoppingCart className="h-8 w-8 text-slate-300" />} text="ยังไม่มีคำสั่งซื้อในระบบ" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-xs">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  ลูกค้า
                </th>
                <th className="p-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                  วันที่สั่ง
                </th>
                <th className="p-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                  ยอดรวม
                </th>
                <th className="p-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                  สถานะปัจจุบัน
                </th>
                <th className="p-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                  เปลี่ยนสถานะ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => (
                <tr key={o.id} className="transition hover:bg-slate-50/50">
                  <td className="p-4">
                    <p className="text-sm font-semibold text-slate-900">{o.customerName}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-slate-400">{o.customerPhone}</p>
                  </td>
                  <td className="p-4 text-center text-xs text-slate-600">
                    {new Date(o.createdAt).toLocaleDateString("th-TH", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-4 text-center font-numeric text-sm font-bold text-brand-navy">
                    ฿{Number(o.totalAmount).toLocaleString()}
                  </td>
                  <td className="p-4 text-center">
                    <OrderStatusChip status={o.status} />
                  </td>
                  <td className="p-4 text-center">
                    <div className="relative inline-block min-w-[140px]">
                      <select
                        className="h-9 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/70 pl-3 pr-8 text-xs font-medium text-slate-700 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/15 transition cursor-pointer"
                        value={o.status}
                        onChange={async (e) => {
                          await onStatusChange(o.id, e.target.value as OrderStatus);
                        }}
                      >
                        <option value="pending">รอดำเนินการ</option>
                        <option value="paid">ชำระแล้ว</option>
                        <option value="fulfilled">ส่งมอบแล้ว</option>
                        <option value="cancelled">ยกเลิก</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

// ---- Shared sub-components ----

function EmptyState({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
      {icon}
      <p className="text-sm font-medium text-slate-500">{text}</p>
    </div>
  );
}

const fieldClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/15 transition resize-none";

function FormField({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-xs font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function Modal({
  title,
  onClose,
  onSave,
  saveLabel,
  children,
}: {
  title: string;
  onClose: () => void;
  onSave: () => void;
  saveLabel: string;
  children: ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex max-h-[90dvh] w-full max-w-3xl flex-col rounded-2xl border border-slate-200/60 bg-white shadow-xl">
        {/* Modal header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-base font-bold text-brand-navy">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิดหน้าต่าง"
            className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {/* Modal footer */}
        <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <XCircle className="h-4 w-4" />
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={onSave}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-navy px-5 text-sm font-bold text-white shadow-xs hover:bg-brand-navy/90 focus-visible:outline-2 focus-visible:outline-brand-blue transition cursor-pointer"
          >
            <CheckCircle2 className="h-4 w-4" />
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
