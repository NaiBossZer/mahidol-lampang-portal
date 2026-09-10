import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
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
  type ProductWriteInput,
  type OrderStatus,
} from "@/services/api";
import { MOCK_PRODUCTS } from "@/components/storefront/mockData";

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
const inputClass = "w-full rounded-lg border px-3 py-2 text-sm bg-white";

export function AdminDashboard() {
  const [tab, setTab] = useState<"activities" | "products" | "orders">("activities");
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
      toast.error("กรุณาระบุชื่อและ slug");
      return;
    }
    try {
      if (editingActivity) await updateActivity({ ...activityForm, id: editingActivity.id });
      else await createActivity(activityForm);
      toast.success("บันทึกกิจกรรมแล้ว");
      setShowActivity(false);
      setEditingActivity(null);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "บันทึกกิจกรรมไม่สำเร็จ");
    }
  };
  const saveProduct = async () => {
    if (!productForm.name || productForm.price < 0 || productForm.stock < 0) {
      toast.error("กรุณาตรวจสอบข้อมูลสินค้า");
      return;
    }
    try {
      if (editingProduct) await updateProduct({ ...productForm, id: editingProduct.id });
      else await createProduct(productForm);
      toast.success("บันทึกสินค้าแล้ว");
      setShowProduct(false);
      setEditingProduct(null);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "บันทึกสินค้าไม่สำเร็จ");
    }
  };
  const editProduct = (p: ProductRow) => {
    setEditingProduct(p);
    setProductForm({ ...p });
    setShowProduct(true);
  };
  return (
    <main className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      <header>
        <p className="text-sm font-semibold text-emerald-700">Mahidol Social Engagement Platform</p>
        <h1 className="text-3xl font-bold text-slate-900">ศูนย์จัดการระบบหลังบ้าน</h1>
        <p className="text-slate-500 mt-1">
          จัดการกิจกรรม ผลผลิต และคำสั่งซื้อจากฐานข้อมูลเดียวกัน
        </p>
      </header>
      <nav className="flex flex-wrap gap-2 border-b pb-3">
        {(
          [
            ["activities", "📋 กิจกรรม Social Engagement"],
            ["products", "🥬 ผลผลิต / Products"],
            ["orders", "🛒 คำสั่งซื้อ / Orders"],
          ] as const
        ).map(([k, l]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${tab === k ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"}`}
          >
            {l}
          </button>
        ))}
      </nav>
      {loading ? (
        <div className="py-20 text-center text-slate-500">กำลังโหลดข้อมูล...</div>
      ) : tab === "activities" ? (
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Activity CRUD</h2>
              <p className="text-sm text-slate-500">Draft → Published → Archived พร้อมหลักฐานกิจกรรม</p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-emerald-700 text-white" onClick={() => { setEditingActivity(null); setActivityForm({ ...blankActivity }); setShowActivity(true); }}>
              + เพิ่มกิจกรรม
            </button>
          </div>
          <div className="overflow-x-auto rounded-xl border bg-white">
            <table className="w-full text-sm"><thead className="bg-slate-50"><tr><th className="p-3 text-left">กิจกรรม</th><th className="p-3">วันที่</th><th className="p-3">สถานะ</th><th className="p-3">ผู้เข้าร่วม</th><th className="p-3 text-right">จัดการ</th></tr></thead><tbody>
              {activities.map((a) => <tr key={a.id} className="border-t"><td className="p-3"><b>{a.title}</b><div className="text-xs text-slate-400">/{a.slug}</div></td><td className="p-3 text-center">{new Date(a.activityDate).toLocaleDateString("th-TH")}</td><td className="p-3 text-center"><span className="rounded-full bg-slate-100 px-2 py-1">{a.status}</span></td><td className="p-3 text-center">{a.participantCount ?? 0}</td><td className="p-3 text-right space-x-2"><button className="underline" onClick={() => { setEditingActivity(a); setActivityForm({ ...a }); setShowActivity(true); }}>แก้ไข</button><button className="text-red-600 underline" onClick={async () => { if (confirm("ลบกิจกรรมนี้?")) { await deleteActivity(a.id); await load(); } }}>ลบ</button></td></tr>)}
            </tbody></table>
          </div>
        </section>
      ) : tab === "products" ? (
        <section className="space-y-4">
          <div className="flex justify-between items-center"><div><h2 className="text-xl font-bold">Products / Stock</h2><p className="text-sm text-slate-500">ผลผลิตจาก Smart Farm ที่พร้อมจำหน่าย/ให้การสนับสนุน</p></div><button className="px-4 py-2 rounded-lg bg-emerald-700 text-white" onClick={() => { setEditingProduct(null); setProductForm({ name: "", price: 0, unit: "กก.", stock: 0, image: "", isPreOrder: false, harvestDate: "", plotId: "", researchTag: "" }); setShowProduct(true); }}>+ เพิ่มผลผลิต</button></div>
          <div className="grid gap-3">{products.map((p) => <div key={p.id} className="rounded-xl border bg-white p-4 flex flex-wrap gap-4 items-center"><div className="flex-1"><b>{p.name}</b><div className="text-sm text-slate-500">฿{Number(p.price).toLocaleString()}/{p.unit} · แปลง {p.plotId || "-"}</div></div><span className={`px-3 py-1 rounded-full text-sm ${p.stock > 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>คงเหลือ {p.stock}</span><button className="underline" onClick={() => editProduct(p)}>แก้ไข</button><button className="text-red-600 underline" onClick={async () => { if (confirm("ลบสินค้านี้?")) { await deleteProduct(p.id); await load(); } }}>ลบ</button></div>)}</div>
        </section>
      ) : (
        <section className="space-y-4">
          <div><h2 className="text-xl font-bold">Orders</h2><p className="text-sm text-slate-500">ตรวจสอบการชำระเงินและสถานะการส่งมอบ</p></div>
          <div className="overflow-x-auto rounded-xl border bg-white"><table className="w-full text-sm"><thead className="bg-slate-50"><tr><th className="p-3 text-left">ลูกค้า</th><th className="p-3">วันที่</th><th className="p-3">ยอด</th><th className="p-3">สถานะ</th><th className="p-3">เปลี่ยนสถานะ</th></tr></thead><tbody>{orders.map((o) => <tr key={o.id} className="border-t"><td className="p-3"><b>{o.customerName}</b><div className="text-xs text-slate-400">{o.customerPhone}</div></td><td className="p-3 text-center">{new Date(o.createdAt).toLocaleString("th-TH")}</td><td className="p-3 text-center">฿{Number(o.totalAmount).toLocaleString()}</td><td className="p-3 text-center">{o.status}</td><td className="p-3 text-center"><select className="border rounded px-2 py-1" value={o.status} onChange={async (e) => { await updateOrderStatus(o.id, e.target.value as OrderStatus); await load(); }}><option value="pending">pending</option><option value="paid">paid</option><option value="fulfilled">fulfilled</option><option value="cancelled">cancelled</option></select></td></tr>)}</tbody></table></div>
        </section>
      )}
      {showActivity && <Modal title={editingActivity ? "แก้ไขกิจกรรม" : "เพิ่มกิจกรรม"} onClose={() => setShowActivity(false)} onSave={saveActivity}>
        <div className="grid md:grid-cols-2 gap-3">{(["title","slug","activityDate","location","participantCount","featuredImage","summary","objective","process","outcome","impact","content"] as const).map((k) => <label key={k} className={k === "content" || k === "summary" || k === "objective" || k === "process" || k === "outcome" || k === "impact" ? "md:col-span-2" : ""}><span className="text-xs font-semibold">{k}</span>{k === "participantCount" ? <input type="number" className={inputClass} value={activityForm[k] ?? 0} onChange={(e) => setActivityForm({ ...activityForm, participantCount: Number(e.target.value) })} /> : k === "activityDate" ? <input type="datetime-local" className={inputClass} value={String(activityForm[k]).slice(0, 16)} onChange={(e) => setActivityForm({ ...activityForm, activityDate: e.target.value })} /> : <textarea rows={k === "content" ? 5 : 2} className={inputClass} value={String(activityForm[k] ?? "")} onChange={(e) => setActivityForm({ ...activityForm, [k]: e.target.value })} />}</label>)}</div>
        <label><span className="text-xs font-semibold">status</span><select className={inputClass} value={activityForm.status} onChange={(e) => setActivityForm({ ...activityForm, status: e.target.value as ActivityWriteInput["status"] })}><option value="draft">draft</option><option value="published">published</option><option value="archived">archived</option></select></label>
      </Modal>}
      {showProduct && <Modal title={editingProduct ? "แก้ไขผลผลิต" : "เพิ่มผลผลิต"} onClose={() => setShowProduct(false)} onSave={saveProduct}>
        <div className="grid md:grid-cols-2 gap-3">{(["name","price","unit","stock","image","harvestDate","plotId","researchTag","category"] as const).map((k) => <label key={k}><span className="text-xs font-semibold">{k}</span><input type={k === "price" || k === "stock" ? "number" : "text"} className={inputClass} value={String(productForm[k] ?? "")} onChange={(e) => setProductForm({ ...productForm, [k]: k === "price" || k === "stock" ? Number(e.target.value) : e.target.value })} /></label>)}</div>
        <label className="flex items-center gap-2"><input type="checkbox" checked={!!productForm.isPreOrder} onChange={(e) => setProductForm({ ...productForm, isPreOrder: e.target.checked })} /> เปิดรับ Pre-order</label>
      </Modal>}
    </main>
  );
}
function Modal({ title, onClose, onSave, children }: { title: string; onClose: () => void; onSave: () => void; children: ReactNode }) {
  return <div className="fixed inset-0 z-50 bg-black/40 p-4 flex items-center justify-center"><div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto p-6"><div className="flex justify-between mb-5"><h3 className="text-xl font-bold">{title}</h3><button onClick={onClose}>✕</button></div>{children}<div className="flex justify-end gap-2 mt-6"><button className="px-4 py-2 border rounded-lg" onClick={onClose}>ยกเลิก</button><button className="px-4 py-2 bg-slate-900 text-white rounded-lg" onClick={onSave}>บันทึก</button></div></div></div>;
}
