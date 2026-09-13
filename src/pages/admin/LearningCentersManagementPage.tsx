import { useEffect, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  createAdminLearningCenter,
  getAdminLearningCenters,
  type LearningCenter,
  updateAdminLearningCenter,
} from "@/services/admin-learning-centers";

const empty = {
  name: "",
  slug: "",
  type: "LEARNING_CENTER",
  description: "",
  province: "ลำปาง",
  district: "",
  subdistrict: "",
  address: "",
  cover_image: "",
  status: "active",
};
export function LearningCentersManagementPage() {
  const [items, setItems] = useState<LearningCenter[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    try {
      setItems(await getAdminLearningCenters());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  async function save() {
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error("กรุณาระบุชื่อและ slug");
      return;
    }
    try {
      if (editing) await updateAdminLearningCenter(editing, form);
      else await createAdminLearningCenter(form);
      toast.success(editing ? "บันทึกการแก้ไขแล้ว" : "สร้าง Learning Center แล้ว");
      setForm(empty);
      setEditing(null);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "บันทึกไม่สำเร็จ");
    }
  }
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
            Learning Centers
          </p>
          <h1 className="mt-1 text-2xl font-bold text-brand-navy lg:text-3xl">ศูนย์การเรียนรู้</h1>
          <p className="mt-1 text-sm text-slate-600">
            จัดการข้อมูลศูนย์และเชื่อมกับกิจกรรมแบบหลายต่อหลายได้
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-brand-navy"
        >
          <RefreshCw className="h-4 w-4" />
          รีเฟรช
        </button>
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-brand-navy">รายการศูนย์</h2>
            <span className="text-xs text-slate-500">{items.length} รายการ</span>
          </div>
          <div className="mt-4 divide-y divide-slate-100">
            {loading ? (
              <p className="py-8 text-center text-sm text-slate-500">กำลังโหลด...</p>
            ) : items.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">ยังไม่มีข้อมูล</p>
            ) : (
              items.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => {
                    setEditing(x.id);
                    setForm({
                      name: x.name,
                      slug: x.slug,
                      type: x.type,
                      description: x.description ?? "",
                      province: x.province ?? "",
                      district: x.district ?? "",
                      subdistrict: x.subdistrict ?? "",
                      address: x.address ?? "",
                      cover_image: x.cover_image ?? "",
                      status: x.status,
                    });
                  }}
                  className="block w-full py-4 text-left hover:bg-slate-50"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-slate-800">{x.name}</span>
                    <span className="text-xs font-medium text-emerald-700">{x.status}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {x.type} · {x.province || "ไม่ระบุจังหวัด"}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-brand-navy">{editing ? "แก้ไขศูนย์" : "เพิ่มศูนย์"}</h2>
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setForm(empty);
                }}
                className="text-xs font-semibold text-slate-500"
              >
                ยกเลิก
              </button>
            )}
          </div>
          <div className="mt-4 space-y-3">
            {(
              [
                ["name", "ชื่อศูนย์"],
                ["slug", "Slug"],
                ["description", "คำอธิบาย"],
                ["province", "จังหวัด"],
                ["district", "อำเภอ"],
                ["subdistrict", "ตำบล"],
                ["address", "ที่อยู่"],
                ["cover_image", "Cover image"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="block text-sm font-semibold text-slate-700">
                {label}
                <input
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="dashboard-control mt-1 w-full"
                />
              </label>
            ))}
            <label className="block text-sm font-semibold text-slate-700">
              ประเภท
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="dashboard-control mt-1 w-full"
              >
                <option value="SOCIAL_CENTER">Social Center</option>
                <option value="LEARNING_CENTER">Learning Center</option>
                <option value="RESEARCH_SITE">Research Site</option>
                <option value="COMMUNITY">Community</option>
                <option value="SCHOOL">School</option>
                <option value="PARTNER_SITE">Partner Site</option>
              </select>
            </label>
            <button
              type="button"
              onClick={() => void save()}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-navy px-4 text-sm font-bold text-white"
            >
              <Plus className="h-4 w-4" />
              {editing ? "บันทึกการแก้ไข" : "สร้างศูนย์"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
