import { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Service = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  description: string | null;
  icon: string | null;
  featuredImage: string | null;
  linkType: "INTERNAL" | "EXTERNAL" | "CONTACT";
  linkUrl: string | null;
  sortOrder: number;
  status: "draft" | "published" | "archived";
};

const emptyService: Omit<Service, "id"> = {
  title: "",
  slug: "",
  summary: "",
  description: "",
  icon: "",
  featuredImage: "",
  linkType: "INTERNAL",
  linkUrl: "",
  sortOrder: 0,
  status: "draft",
};

export function CmsPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [draft, setDraft] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/services", { credentials: "include" });
      const body = (await response.json()) as { data?: Service[]; error?: string };
      if (!response.ok) throw new Error(body.error ?? "โหลดข้อมูลไม่สำเร็จ");
      setServices(body.data ?? []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  async function save() {
    if (!draft) return;
    const isNew = !draft.id;
    const response = await fetch(isNew ? "/api/admin/services" : `/api/admin/services?id=${draft.id}`, {
      method: isNew ? "POST" : "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const body = (await response.json()) as { data?: Service; error?: string };
    if (!response.ok) return toast.error(body.error ?? "บันทึกไม่สำเร็จ");
    toast.success(isNew ? "สร้างบริการแล้ว" : "บันทึกบริการแล้ว");
    setDraft(null);
    await load();
  }

  async function remove(id: string) {
    if (!window.confirm("ยืนยันการลบบริการนี้?")) return;
    const response = await fetch(`/api/admin/services?id=${id}`, { method: "DELETE", credentials: "include" });
    if (!response.ok) {
      const body = (await response.json()) as { error?: string };
      return toast.error(body.error ?? "ลบไม่สำเร็จ");
    }
    toast.success("ลบบริการแล้ว");
    await load();
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Content CMS</p>
          <h1 className="mt-1 text-3xl font-black text-brand-navy">จัดการเนื้อหา</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">Semantic CMS V1 · จัดการ Services โดยไม่แก้โค้ดหน้าเว็บไซต์</p>
        </div>
        <button type="button" onClick={() => setDraft({ id: "", ...emptyService })} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-navy px-4 py-2.5 text-sm font-bold text-white">
          <Plus className="h-4 w-4" /> เพิ่มบริการ
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_420px]">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4 font-bold text-brand-navy">Services</div>
          {loading ? <p className="p-5 text-sm text-slate-500">กำลังโหลด...</p> : services.length === 0 ? <p className="p-5 text-sm text-slate-500">ยังไม่มีบริการ</p> : (
            <div className="divide-y divide-slate-100">
              {services.map((service) => (
                <div key={service.id} className="flex items-center justify-between gap-4 p-5">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900">{service.title}</p>
                    <p className="mt-1 text-xs text-slate-500">/{service.slug} · {service.status} · ลำดับ {service.sortOrder}</p>
                    {service.summary && <p className="mt-2 text-sm text-slate-600">{service.summary}</p>}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button type="button" onClick={() => setDraft(service)} className="min-h-10 rounded-lg border border-slate-200 px-3 text-sm font-bold text-brand-navy">แก้ไข</button>
                    <button type="button" onClick={() => void remove(service.id)} className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-red-200 text-red-700" aria-label={`ลบ ${service.title}`}><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-brand-navy">{draft ? (draft.id ? "แก้ไขบริการ" : "สร้างบริการ") : "เลือกเนื้อหา"}</h2>
          {!draft ? <p className="mt-3 text-sm text-slate-500">เลือกบริการที่ต้องการแก้ไข หรือสร้างรายการใหม่</p> : (
            <div className="mt-4 space-y-4">
              <label className="block text-sm font-semibold">ชื่อบริการ<input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
              <label className="block text-sm font-semibold">Slug<input value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
              <label className="block text-sm font-semibold">คำอธิบายสั้น<textarea value={draft.summary ?? ""} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} rows={3} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm font-semibold">ลำดับ<input type="number" value={draft.sortOrder} onChange={(e) => setDraft({ ...draft, sortOrder: Number(e.target.value) })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
                <label className="block text-sm font-semibold">สถานะ<select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as Service["status"] })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
              </div>
              <div className="flex gap-2 pt-2"><button type="button" onClick={() => void save()} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-brand-navy px-4 font-bold text-white"><Save className="h-4 w-4" /> บันทึก</button><button type="button" onClick={() => setDraft(null)} className="min-h-11 rounded-xl border border-slate-200 px-4 font-bold">ยกเลิก</button></div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
