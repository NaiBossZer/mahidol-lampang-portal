import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, CalendarDays, ImageIcon, MapPin, Target, Users, Workflow,
  TrendingUp, Building2, Handshake, ClipboardCheck, Sparkles
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { getAdminActivities, type AdminActivity } from "@/services/api";

type Media = {
  id: string;
  public_url: string;
  caption?: string | null;
  is_post_event?: boolean;
  status?: string;
};

type Relations = {
  learningCenterIds: string[];
  organizations: Array<{ organizationId: string; organizerRole?: "primary" | "co" }>;
};

export function ActivityDetailAdminPage() {
  const { id = "" } = useParams();
  const [activity, setActivity] = useState<AdminActivity | null>(null);
  const [media, setMedia] = useState<Media[]>([]);
  const [relations, setRelations] = useState<Relations>({ learningCenterIds: [], organizations: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const activities = await getAdminActivities();
        const found = activities.find((item) => item.id === id) ?? null;
        if (!active) return;
        setActivity(found);
        if (!found) return;
        const [mediaResponse, relationResponse] = await Promise.all([
          fetch(`/api/admin/activity-media?activityId=${encodeURIComponent(id)}`, { credentials: "include" }),
          fetch(`/api/admin/activity-relations?activityId=${encodeURIComponent(id)}`, { credentials: "include" }),
        ]);
        const mediaBody = await mediaResponse.json().catch(() => null);
        const relationBody = await relationResponse.json().catch(() => null);
        if (active) {
          setMedia(Array.isArray(mediaBody?.data) ? mediaBody.data : []);
          setRelations(relationBody?.data ?? { learningCenterIds: [], organizations: [] });
        }
      } catch (error) {
        if (active) toast.error(error instanceof Error ? error.message : "โหลดรายละเอียดกิจกรรมไม่สำเร็จ");
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, [id]);

  const dateLabel = useMemo(() => {
    if (!activity) return "—";
    const date = new Date(activity.activityDate);
    return Number.isNaN(date.getTime())
      ? activity.activityDate
      : new Intl.DateTimeFormat("th-TH", { dateStyle: "long" }).format(date);
  }, [activity]);

  if (loading) {
    return <main className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-4 text-sm text-slate-500">กำลังโหลดรายละเอียดกิจกรรม...</main>;
  }

  if (!activity) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-6xl flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-lg font-bold text-brand-navy">ไม่พบข้อมูลกิจกรรม</p>
        <Link to="/admin/activities" className="rounded-xl bg-brand-navy px-4 py-2.5 text-sm font-bold text-white">กลับไปจัดการกิจกรรม</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link to="/admin/activities" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          <ArrowLeft className="h-4 w-4" /> กลับรายการกิจกรรม
        </Link>
        <Link to={`/admin/activities?edit=${encodeURIComponent(activity.id)}`} className="inline-flex min-h-10 items-center rounded-xl bg-brand-navy px-4 text-sm font-bold text-white hover:bg-brand-navy/90">
          แก้ไขกิจกรรม
        </Link>
      </div>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="grid lg:grid-cols-[1.25fr_0.75fr]">
          <div className="min-w-0 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={activity.status} />
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Activity Detail</span>
            </div>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-brand-navy sm:text-4xl">{activity.title}</h1>
            {activity.summary ? <p className="mt-4 text-base leading-8 text-slate-600">{activity.summary}</p> : null}
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Meta icon={CalendarDays} label="วันที่" value={dateLabel} />
              <Meta icon={MapPin} label="สถานที่" value={activity.location || "ไม่ได้ระบุ"} />
              <Meta icon={Users} label="ผู้เข้าร่วม" value={`${(activity.participantCount ?? 0).toLocaleString()} คน`} />
            </div>
          </div>
          <div className="min-h-64 bg-slate-100">
            {activity.featuredImage ? (
              <img src={activity.featuredImage} alt={activity.title} className="h-full min-h-64 w-full object-cover" />
            ) : (
              <div className="grid min-h-64 place-items-center text-slate-300"><ImageIcon className="h-14 w-14" /></div>
            )}
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          <DetailSection icon={ClipboardCheck} title="คำอธิบายกิจกรรม" text={activity.summary} empty="ยังไม่มีคำอธิบายกิจกรรม" />
          <DetailSection title="รายละเอียดกิจกรรม" text={activity.content} empty="ยังไม่มีรายละเอียดฉบับเต็ม" />
          <div className="grid gap-6 md:grid-cols-2">
            <DetailSection icon={Target} title="วัตถุประสงค์" text={activity.objective} empty="ยังไม่ได้ระบุ" />
            <DetailSection icon={Workflow} title="กระบวนการดำเนินงาน" text={activity.process} empty="ยังไม่ได้ระบุ" />
            <DetailSection icon={TrendingUp} title="ผลลัพธ์ที่ได้" text={activity.outcome} empty="ยังไม่ได้ระบุ" />
            <DetailSection icon={Sparkles} title="ผลกระทบ / คุณค่าที่เกิดขึ้น" text={activity.impact} empty="ยังไม่ได้ระบุ" />
          </div>
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionTitle icon={ImageIcon} title="ภาพกิจกรรม" count={media.length} />
            {media.length ? (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {media.map((item) => (
                  <figure key={item.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                    <img src={item.public_url} alt={item.caption || activity.title} className="aspect-[4/3] w-full object-cover" loading="lazy" />
                    {item.caption ? <figcaption className="p-2 text-xs text-slate-500">{item.caption}</figcaption> : null}
                  </figure>
                ))}
              </div>
            ) : <Empty text="ยังไม่มีภาพกิจกรรม" />}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionTitle icon={Building2} title="หน่วยงาน / ศูนย์ที่เกี่ยวข้อง" />
            <dl className="mt-4 space-y-4 text-sm">
              <div><dt className="text-xs text-slate-400">Learning Centers</dt><dd className="mt-1 font-semibold text-slate-700">{relations.learningCenterIds.length ? `${relations.learningCenterIds.length} รายการ` : "ไม่ได้ระบุ"}</dd></div>
              <div><dt className="text-xs text-slate-400">Organizations</dt><dd className="mt-1 font-semibold text-slate-700">{relations.organizations.length ? `${relations.organizations.length} รายการ` : "ไม่ได้ระบุ"}</dd></div>
            </dl>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionTitle icon={Sparkles} title="AI Analysis" />
            <p className="mt-3 text-sm leading-6 text-slate-500">ข้อมูลวิเคราะห์จาก AI แสดงเป็นหลักฐานประกอบการอ่าน และไม่เขียนทับข้อมูลกิจกรรมโดยอัตโนมัติ</p>
            <div className="mt-4 grid gap-2">
              {["objective", "target_group", "location", "kpi", "schedule"].map((key) => (
                <div key={key} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs">
                  <span className="font-semibold text-slate-600">{key}</span><span className="text-slate-400">ดูจาก AI Workspace</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionTitle icon={Handshake} title="Survey" />
            <p className="mt-3 text-sm leading-6 text-slate-500">ส่วนนี้เป็นจุดสรุป/นำทางไปยังข้อมูลแบบประเมิน ไม่สร้างแบบประเมินซ้ำใน Activity Detail</p>
            <Link to="/admin/surveys" className="mt-4 inline-flex min-h-10 items-center rounded-xl border border-slate-200 px-3.5 text-sm font-semibold text-brand-navy hover:bg-slate-50">ไปยังการจัดการ Survey</Link>
          </section>
        </aside>
      </div>
    </main>
  );
}

function Meta({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5"><div className="flex items-center gap-2 text-xs text-slate-400"><Icon className="h-4 w-4 text-brand-blue" />{label}</div><p className="mt-1.5 text-sm font-bold text-brand-navy">{value}</p></div>;
}
function DetailSection({ icon: Icon, title, text, empty }: { icon?: typeof Target; title: string; text?: string; empty: string }) {
  return <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><SectionTitle icon={Icon} title={title} /><p className={`mt-3 whitespace-pre-line text-sm leading-7 ${text ? "text-slate-600" : "text-slate-400"}`}>{text?.trim() || empty}</p></section>;
}
function SectionTitle({ icon: Icon, title, count }: { icon?: typeof Target; title: string; count?: number }) {
  return <div className="flex items-center gap-2 text-brand-navy">{Icon ? <Icon className="h-5 w-5 text-local-terracotta" /> : null}<h2 className="font-black">{title}</h2>{count !== undefined ? <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">{count}</span> : null}</div>;
}
function Empty({ text }: { text: string }) { return <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-400">{text}</div>; }
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = { published: "เผยแพร่", draft: "ร่าง", archived: "เก็บถาวร" };
  return <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-600">{map[status] || status}</span>;
}
