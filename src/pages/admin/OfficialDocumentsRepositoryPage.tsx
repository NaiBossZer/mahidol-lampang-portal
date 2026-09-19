import { useEffect, useMemo, useState } from "react";
import {
  FileImage,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

type MediaDocument = {
  id: string;
  entity_id: string;
  entity_type: string;
  field_key: string;
  original_name: string;
  public_url: string;
  mime_type: string;
  media_type: "image" | "document" | string;
  size_bytes: number;
  caption?: string | null;
  alt_text?: string | null;
  created_at: string;
};

type Activity = {
  id: string;
  title?: string | null;
  slug?: string | null;
  activityDate?: string | null;
  status?: string | null;
};

type Filter = "all" | "pdf" | "image";

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "-";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function fileLabel(doc: MediaDocument) {
  if (doc.mime_type === "application/pdf") return "PDF";
  if (doc.mime_type === "image/jpeg") return "JPG";
  if (doc.mime_type === "image/png") return "PNG";
  if (doc.mime_type === "image/webp") return "WEBP";
  return doc.mime_type.split("/").pop()?.toUpperCase() || "FILE";
}

function DocumentIcon({ doc }: { doc: MediaDocument }) {
  if (doc.mime_type === "application/pdf") {
    return <FileText className="h-5 w-5 text-rose-500" />;
  }
  if (doc.mime_type.startsWith("image/")) {
    return <ImageIcon className="h-5 w-5 text-sky-500" />;
  }
  return <FileImage className="h-5 w-5 text-slate-500" />;
}

export function OfficialDocumentsRepositoryPage() {
  const [documents, setDocuments] = useState<MediaDocument[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activityId, setActivityId] = useState("ALL");
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const [mediaResponse, activitiesResponse] = await Promise.all([
        fetch("/api/admin/media?fieldKey=documents", {
          credentials: "include",
          headers: { Accept: "application/json" },
        }),
        fetch("/api/admin/activities", {
          credentials: "include",
          headers: { Accept: "application/json" },
        }),
      ]);

      const mediaBody = (await mediaResponse.json()) as { data?: MediaDocument[]; error?: string };
      const activitiesBody = (await activitiesResponse.json()) as { data?: Activity[]; error?: string };

      if (!mediaResponse.ok) throw new Error(mediaBody.error ?? "โหลดเอกสารไม่สำเร็จ");
      if (!activitiesResponse.ok) throw new Error(activitiesBody.error ?? "โหลดรายการโครงการไม่สำเร็จ");

      setDocuments(Array.isArray(mediaBody.data) ? mediaBody.data : []);
      setActivities(Array.isArray(activitiesBody.data) ? activitiesBody.data : []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "โหลดคลังเอกสารไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const activityMap = useMemo(
    () => new Map(activities.map((activity) => [activity.id, activity])),
    [activities],
  );

  const filteredDocuments = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return documents.filter((doc) => {
      const activity = activityMap.get(doc.entity_id);
      const matchesActivity = activityId === "ALL" || doc.entity_id === activityId;
      const matchesType =
        filter === "all" ||
        (filter === "pdf" && doc.mime_type === "application/pdf") ||
        (filter === "image" && doc.mime_type.startsWith("image/"));
      const haystack = [
        doc.original_name,
        doc.caption ?? "",
        doc.alt_text ?? "",
        activity?.title ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return matchesActivity && matchesType && (!normalized || haystack.includes(normalized));
    });
  }, [activityId, activityMap, documents, filter, query]);

  const selectedActivity = activityId === "ALL" ? null : activityMap.get(activityId);
  const selectedLabel = selectedActivity?.title ?? "เอกสารทั้งหมด";
  const filterCounts = {
    all: documents.filter((doc) => activityId === "ALL" || doc.entity_id === activityId).length,
    pdf: documents.filter(
      (doc) =>
        (activityId === "ALL" || doc.entity_id === activityId) &&
        doc.mime_type === "application/pdf",
    ).length,
    image: documents.filter(
      (doc) =>
        (activityId === "ALL" || doc.entity_id === activityId) &&
        doc.mime_type.startsWith("image/"),
    ).length,
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-[#f4f7fb] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1380px] space-y-4">
        <header className="overflow-hidden rounded-2xl bg-[#0c2340] text-white shadow-sm">
          <div className="flex flex-col gap-5 px-5 py-5 sm:px-7 sm:py-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-blue-200">
                <span className="rounded-md bg-white/10 px-2 py-1 font-bold">คลังเอกสารราชการ</span>
                <span>โครงการ:</span>
                <span className="font-semibold text-white">{selectedLabel}</span>
              </div>
              <h1 className="mt-2 text-xl font-black tracking-tight sm:text-2xl">
                เอกสารราชการและบันทึกข้อความที่ใช้ประมวลผล AI
              </h1>
              <p className="mt-1.5 max-w-4xl text-xs leading-5 text-blue-100 sm:text-sm">
                แสดงเอกสารที่อัปโหลดเข้าสู่ระบบจากพื้นที่จัดเก็บกลาง โดยไม่สร้างชุดข้อมูลเอกสารใหม่
              </p>
            </div>
            <div className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-blue-100">
              <div className="flex items-center gap-2 font-bold text-white">
                <Sparkles className="h-4 w-4 text-violet-300" />
                AI Document Repository
              </div>
              <div className="mt-1">{documents.length} ไฟล์ในระบบ</div>
            </div>
          </div>
        </header>

        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              {([
                ["all", `ทั้งหมด (${filterCounts.all})`],
                ["pdf", `PDF (${filterCounts.pdf})`],
                ["image", `รูปภาพ (${filterCounts.image})`],
              ] as const).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFilter(id)}
                  className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                    filter === id
                      ? "bg-sky-100 text-sky-700"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {label}
                </button>
              ))}

              <select
                value={activityId}
                onChange={(event) => setActivityId(event.target.value)}
                className="min-w-[240px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-sky-400"
                aria-label="เลือกโครงการ"
              >
                <option value="ALL">ทุกโครงการ</option>
                {activities.map((activity) => (
                  <option key={activity.id} value={activity.id}>
                    {activity.title || activity.slug || activity.id}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="relative min-w-0 flex-1 lg:w-[320px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="ค้นหาชื่อไฟล์ หรือเอกสาร..."
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none focus:border-sky-400"
                />
              </label>
              <button
                type="button"
                onClick={() => void load()}
                className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">รีเฟรช</span>
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs leading-5 text-sky-800">
          <FolderOpen className="mr-2 inline h-4 w-4" />
          เอกสารที่แสดงด้านล่างดึงจากไฟล์ที่อัปโหลดจริงใน <strong>portal-media</strong> และ metadata ของ
          <strong> portal_media_assets</strong> เฉพาะ field <strong>documents</strong>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500 shadow-sm">
            กำลังโหลดเอกสาร...
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <FileText className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm font-bold text-slate-700">ยังไม่พบเอกสาร</p>
            <p className="mt-1 text-xs text-slate-500">
              {documents.length === 0
                ? "เมื่อมีการอัปโหลดเอกสารในระบบ เอกสารจะแสดงที่หน้านี้อัตโนมัติ"
                : "ลองเปลี่ยนตัวกรองหรือคำค้นหา"}
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredDocuments.map((doc) => {
              const activity = activityMap.get(doc.entity_id);
              const type = fileLabel(doc);
              const canPreview =
                doc.mime_type === "application/pdf" || doc.mime_type.startsWith("image/");

              return (
                <article
                  key={doc.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-50 px-2 py-1 text-[10px] font-black text-slate-600 ring-1 ring-slate-200">
                        <DocumentIcon doc={doc} />
                        {type}
                      </span>
                      <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                        อัปโหลดแล้ว
                      </span>
                    </div>

                    <h2 className="mt-4 min-h-[44px] break-words text-sm font-black leading-5 text-slate-800">
                      {doc.original_name}
                    </h2>

                    <div className="mt-3 space-y-1 text-[11px] leading-5 text-slate-500">
                      <p>
                        โครงการ: <span className="font-semibold text-slate-700">{activity?.title ?? doc.entity_id}</span>
                      </p>
                      {doc.caption && (
                        <p>
                          รายละเอียด: <span className="font-semibold text-slate-700">{doc.caption}</span>
                        </p>
                      )}
                      <p>
                        ขนาด: <span className="font-semibold text-slate-700">{formatBytes(doc.size_bytes)}</span>
                        {" · "}อัปโหลดเมื่อ:{" "}
                        <span className="font-semibold text-slate-700">{formatDate(doc.created_at)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-violet-700">
                      <Sparkles className="h-3.5 w-3.5" />
                      เอกสารสำหรับ AI Workflow
                    </span>
                    {canPreview ? (
                      <a
                        href={doc.public_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-white px-3 py-2 text-xs font-bold text-sky-700 hover:bg-sky-50"
                      >
                        ดูตัวอย่าง
                      </a>
                    ) : (
                      <a
                        href={doc.public_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      >
                        เปิดไฟล์
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
