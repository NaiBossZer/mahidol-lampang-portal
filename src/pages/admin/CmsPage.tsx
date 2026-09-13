import { useEffect, useMemo, useState } from "react";
import { FileImage, FileUp, Plus, RefreshCw, Save, X } from "lucide-react";
import { toast } from "sonner";

type Tab = "services" | "home" | "navigation" | "footer" | "projects" | "centers" | "partners";
type Row = Record<string, unknown> & { id?: string };

const tabs: Array<{ id: Tab; label: string }> = [
  { id: "services", label: "Services" },
  { id: "home", label: "Home" },
  { id: "navigation", label: "Navigation" },
  { id: "footer", label: "Footer" },
  { id: "projects", label: "Projects" },
  { id: "centers", label: "Learning Centers" },
  { id: "partners", label: "Partners" },
];

const endpoints: Record<Tab, string> = {
  services: "/api/admin/services",
  home: "/api/admin/home",
  navigation: "/api/admin/navigation",
  footer: "/api/admin/footer",
  projects: "/api/admin/projects",
  centers: "/api/admin/learning-centers",
  partners: "/api/admin/partners",
};

const emptyRows: Record<Tab, Row> = {
  services: { title: "", slug: "", summary: "", description: "", icon: "", featuredImage: "", linkType: "INTERNAL", linkUrl: "", sortOrder: 0, status: "draft" },
  home: { sectionKey: "HOME_HERO", title: "", subtitle: "", description: "", image: "", sortOrder: 0, isEnabled: true },
  navigation: { label: "", slug: "", targetType: "INTERNAL", targetUrl: "", sortOrder: 0, isEnabled: true, openNewTab: false },
  footer: { organizationName: "", address: "", phone: "", email: "", facebookUrl: "", lineUrl: "", copyrightText: "", privacyUrl: "", termsUrl: "" },
  projects: { title: "", slug: "", description: "", objective: "", status: "active", coverImage: "" },
  centers: { name: "", slug: "", type: "LEARNING_CENTER", description: "", province: "", district: "", subdistrict: "", address: "", coverImage: "", status: "active" },
  partners: { name: "", type: "", logo: "", description: "" },
};

const mediaFields: Partial<Record<Tab, { key: string; entityType: string; label: string }>> = {
  services: { key: "featuredImage", entityType: "services", label: "รูปภาพหลัก" },
  home: { key: "image", entityType: "home_sections", label: "รูปภาพ Section" },
  projects: { key: "coverImage", entityType: "social_projects", label: "Cover Image" },
  centers: { key: "coverImage", entityType: "learning_centers", label: "Cover Image" },
  partners: { key: "logo", entityType: "partners", label: "Logo" },
};

function labelFor(key: string) {
  const labels: Record<string, string> = {
    sectionKey: "Section Key", targetType: "Target Type", targetUrl: "Target URL", sortOrder: "ลำดับ", isEnabled: "เปิดใช้งาน", openNewTab: "เปิดแท็บใหม่",
    linkType: "Link Type", linkUrl: "Link URL", organizationName: "ชื่อองค์กร", copyrightText: "Copyright",
  };
  return labels[key] ?? key.replace(/[A-Z]/g, (m) => ` ${m}`).replace(/^./, (m) => m.toUpperCase());
}

function mediaLabel(tab: Tab) {
  return mediaFields[tab]?.label ?? "ไฟล์";
}

function textAreaField(key: string) {
  return ["description", "summary", "subtitle", "address", "objective", "copyrightText"].includes(key);
}

function booleanField(key: string) {
  return ["isEnabled", "openNewTab"].includes(key);
}

function selectField(key: string) {
  return ["linkType", "targetType"].includes(key);
}

function inputFor(key: string, value: unknown, onChange: (value: unknown) => void) {
  if (textAreaField(key)) return <textarea value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />;
  if (booleanField(key)) return <input type="checkbox" checked={value === true} onChange={(e) => onChange(e.target.checked)} className="mt-2 h-4 w-4" />;
  if (key === "sortOrder") return <input type="number" value={Number(value ?? 0)} onChange={(e) => onChange(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />;
  if (key === "status") return <select value={String(value ?? "draft")} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option><option value="active">Active</option></select>;
  if (selectField(key)) return <select value={String(value ?? "INTERNAL")} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"><option value="INTERNAL">Internal</option><option value="EXTERNAL">External</option><option value="CONTACT">Contact</option></select>;
  return <input value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />;
}

async function uploadMedia(tab: Tab, entityId: string, file: File, altText: string) {
  const config = mediaFields[tab];
  if (!config) throw new Error("ฟิลด์นี้ไม่รองรับไฟล์");
  const form = new FormData();
  form.set("entityType", config.entityType);
  form.set("entityId", entityId);
  form.set("fieldKey", config.key);
  form.set("altText", altText);
  form.set("file", file);
  const response = await fetch("/api/admin/media", { method: "POST", credentials: "include", body: form });
  const body = (await response.json()) as { data?: Row; error?: string };
  if (!response.ok || !body.data) throw new Error(body.error ?? "อัปโหลดไฟล์ไม่สำเร็จ");
  return body.data;
}

export function CmsPage() {
  const [tab, setTab] = useState<Tab>("services");
  const [rows, setRows] = useState<Row[]>([]);
  const [draft, setDraft] = useState<Row | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const endpoint = useMemo(() => endpoints[tab], [tab]);
  const mediaConfig = mediaFields[tab];

  async function load() {
    setLoading(true);
    try {
      const response = await fetch(endpoint, { credentials: "include", headers: { Accept: "application/json" } });
      const body = (await response.json()) as { data?: Row | Row[]; error?: string };
      if (!response.ok) throw new Error(body.error ?? "โหลดข้อมูลไม่สำเร็จ");
      const data = body.data;
      setRows(Array.isArray(data) ? data : data ? [data] : []);
      if (tab === "footer" && data && !Array.isArray(data)) setDraft(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { setDraft(null); setMediaFile(null); void load(); }, [endpoint]);

  async function save() {
    if (!draft) return;
    setSaving(true);
    try {
      const isNew = !draft.id;
      const response = await fetch(isNew ? endpoint : `${endpoint}?id=${encodeURIComponent(String(draft.id))}`, {
        method: isNew ? "POST" : "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(draft),
      });
      const body = (await response.json()) as { data?: Row; error?: string };
      if (!response.ok || !body.data) throw new Error(body.error ?? "บันทึกไม่สำเร็จ");

      let saved = body.data;
      if (mediaFile && mediaConfig && saved.id) {
        const media = await uploadMedia(tab, String(saved.id), mediaFile, String(saved.title ?? saved.name ?? saved.label ?? mediaLabel(tab)));
        const publicUrl = String(media.public_url ?? "");
        if (!publicUrl) throw new Error("Storage ไม่คืน public URL");
        const next = { ...saved, [mediaConfig.key]: publicUrl };
        const updateResponse = await fetch(`${endpoint}?id=${encodeURIComponent(String(saved.id))}`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(next),
        });
        const updateBody = (await updateResponse.json()) as { data?: Row; error?: string };
        if (!updateResponse.ok || !updateBody.data) throw new Error(updateBody.error ?? "บันทึก URL ของ Storage ไม่สำเร็จ");
        saved = updateBody.data;
      }

      setDraft(null);
      setMediaFile(null);
      toast.success(mediaFile && mediaConfig ? "บันทึกเนื้อหาและไฟล์ใน Storage แล้ว" : "บันทึกเนื้อหาแล้ว");
      void saved;
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "บันทึกไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  }

  function startNew() {
    setDraft({ ...emptyRows[tab] });
    setMediaFile(null);
  }

  function selectRow(row: Row) {
    setDraft(row);
    setMediaFile(null);
  }

  return <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Content CMS</p><h1 className="mt-1 text-3xl font-black text-brand-navy">Central Content Management</h1><p className="mt-2 max-w-3xl text-sm text-slate-600">ข้อมูลเนื้อหาอยู่ใน Central Portal และไฟล์ทุกฟิลด์จะถูกเก็บผ่าน Supabase Storage</p></div>
      <div className="flex gap-2"><button type="button" onClick={() => void load()} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-brand-navy"><RefreshCw className="h-4 w-4" /> รีเฟรช</button><button type="button" onClick={startNew} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-navy px-4 text-sm font-bold text-white"><Plus className="h-4 w-4" /> เพิ่มรายการ</button></div>
    </div>

    <div className="mt-6 flex gap-2 overflow-x-auto border-b border-slate-200 pb-2">{tabs.map((item) => <button key={item.id} type="button" onClick={() => setTab(item.id)} className={`shrink-0 rounded-lg px-3 py-2 text-sm font-bold ${tab === item.id ? "bg-brand-navy text-white" : "text-slate-600 hover:bg-slate-100"}`}>{item.label}</button>)}</div>

    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_420px]">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 px-5 py-4 font-bold text-brand-navy">{tabs.find((x) => x.id === tab)?.label}</div>{loading ? <p className="p-5 text-sm text-slate-500">กำลังโหลด...</p> : rows.length === 0 ? <p className="p-5 text-sm text-slate-500">ยังไม่มีข้อมูล</p> : <div className="divide-y divide-slate-100">{rows.map((row, index) => <button key={String(row.id ?? index)} type="button" onClick={() => selectRow(row)} className="block w-full p-5 text-left hover:bg-slate-50"><p className="font-bold text-slate-900">{String(row.title ?? row.name ?? row.label ?? row.sectionKey ?? "รายการ")}</p><p className="mt-1 text-xs text-slate-500">{String(row.slug ?? row.status ?? row.targetUrl ?? "")} {row.sortOrder !== undefined ? `· ลำดับ ${String(row.sortOrder)}` : ""}</p><p className="mt-2 line-clamp-2 text-sm text-slate-600">{String(row.summary ?? row.description ?? row.subtitle ?? "")}</p></button>)}</div>}</div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3"><h2 className="font-bold text-brand-navy">{draft ? (draft.id ? "แก้ไขเนื้อหา" : "สร้างเนื้อหา") : "เลือกเนื้อหา"}</h2>{draft && <button type="button" onClick={() => { setDraft(null); setMediaFile(null); }} aria-label="ปิด"><X className="h-5 w-5 text-slate-500" /></button>}</div>
        {!draft ? <p className="mt-3 text-sm text-slate-500">เลือกข้อมูลจากรายการ หรือสร้างรายการใหม่</p> : <div className="mt-4 space-y-4">
          {Object.entries(draft).filter(([key]) => key !== "id" && !["createdAt", "updatedAt", "publishedAt"].includes(key) && key !== mediaConfig?.key).map(([key, value]) => <label key={key} className="block text-sm font-semibold text-slate-700">{labelFor(key)}{inputFor(key, value, (next) => setDraft((current) => current ? { ...current, [key]: next } : current))}</label>)}

          {mediaConfig && <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4"><div className="flex items-start gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-brand-navy"><FileImage className="h-5 w-5" /></div><div><p className="text-sm font-bold text-brand-navy">{mediaConfig.label}</p><p className="mt-1 text-xs text-slate-500">เพิ่มไฟล์ผ่าน Supabase Storage · bucket: <span className="font-semibold">portal-media</span> · JPEG / PNG / WebP / PDF · ไม่เกิน 25MB</p></div></div>{String(draft[mediaConfig.key] ?? "") && <div className="mt-3 rounded-lg bg-white p-2 text-xs text-slate-500 break-all">ไฟล์ปัจจุบัน: {String(draft[mediaConfig.key])}</div>}<label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-brand-navy hover:bg-slate-50"><FileUp className="h-4 w-4" />{mediaFile ? mediaFile.name : `เลือก ${mediaConfig.label}`}<input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="sr-only" onChange={(e) => setMediaFile(e.target.files?.[0] ?? null)} /></label>{mediaFile && <p className="mt-2 text-xs text-emerald-700">พร้อมอัปโหลด: {mediaFile.name} ({Math.ceil(mediaFile.size / 1024)} KB)</p>}</div>}

          <div className="flex gap-2 pt-2"><button type="button" disabled={saving} onClick={() => void save()} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-brand-navy px-4 font-bold text-white disabled:opacity-60"><Save className="h-4 w-4" /> {saving ? "กำลังบันทึก..." : "บันทึก"}</button><button type="button" onClick={() => { setDraft(null); setMediaFile(null); }} className="min-h-11 rounded-xl border border-slate-200 px-4 font-bold">ยกเลิก</button></div>
        </div>}
      </div>
    </div>
  </section>;
}
