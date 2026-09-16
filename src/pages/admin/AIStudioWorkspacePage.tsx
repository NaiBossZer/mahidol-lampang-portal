import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  ClipboardList,
  FileText,
  ImagePlus,
  ListChecks,
  Newspaper,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { getAdminActivities, type AdminActivity } from "@/services/api";

const workflow = [
  { step: "01", title: "สร้างกิจกรรม", description: "กำหนดข้อมูลกิจกรรม ผู้รับผิดชอบ วันเวลา สถานที่ และเอกสารราชการ", to: "/admin/activities", icon: ClipboardList },
  { step: "02", title: "AI วิเคราะห์เอกสาร", description: "ส่งเอกสารเข้าสู่ AI เพื่อดึงข้อมูลสำคัญและตรวจความครบถ้วน", to: "/admin/ai?tab=command", icon: FileText },
  { step: "03", title: "AI สร้างแบบสอบถาม", description: "สร้างแบบสอบถามจากบริบทกิจกรรมและข้อมูลที่ AI วิเคราะห์ได้", to: "/admin/survey-workflow", icon: Bot },
  { step: "04", title: "ADMIN ตรวจสอบ", description: "ตรวจผลลัพธ์ของ AI ก่อนยืนยัน โดยยังคง Human-in-the-loop", to: "/admin/surveys", icon: ShieldCheck },
  { step: "05", title: "ยืนยันและผูกแบบสอบถาม", description: "ยืนยันผลที่ผ่านการตรวจสอบและส่งกลับไปยังกิจกรรมที่ตั้ง", to: "/admin/survey-workflow", icon: CheckCircle2 },
];

const studioTools = [
  { title: "คลังเอกสารราชการ", description: "จัดการเอกสารต้นทางของกิจกรรมและใช้เป็นบริบทสำหรับ AI", to: "/admin/cms", icon: Upload },
  { title: "AI Command Center", description: "ส่ง Intent ให้ AI วิเคราะห์ วางแผน เลือก Tool และจัดการ Approval", to: "/admin/ai?tab=command", icon: Bot },
  { title: "แบบสอบถามและผลประเมิน", description: "ติดตามแบบสอบถาม คำตอบ และผลวิเคราะห์กิจกรรม", to: "/admin/surveys", icon: ClipboardList },
  { title: "คลังภาพกิจกรรม", description: "จัดการภาพกิจกรรมและสื่อหลังจบโครงการ", to: "/admin/activities/photos", icon: ImagePlus },
  { title: "รายงานและ Analytics", description: "ดูตัวชี้วัด ผลสัมฤทธิ์ และข้อมูลสำหรับผู้บริหาร", to: "/admin/analytics", icon: BarChart3 },
  { title: "เสร็จสิ้นโครงการ / เผยแพร่", description: "เข้าสู่ workflow หลังจบกิจกรรมเพื่อจัดทำรายงาน ตรวจสอบ และเผยแพร่", to: "/admin/post-project", icon: Newspaper },
];

const statusLabel: Record<string, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  ongoing: "Ongoing",
  completed: "Completed",
  published: "Published",
  cancelled: "Cancelled",
  archived: "Archived",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" });
}

export function AIStudioWorkspacePage() {
  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadActivities() {
    setLoading(true);
    try {
      setActivities(await getAdminActivities());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "โหลดกิจกรรมไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadActivities();
  }, []);

  const summary = useMemo(() => ({
    total: activities.length,
    active: activities.filter((x) => x.status === "ongoing" || x.status === "scheduled").length,
    completed: activities.filter((x) => x.status === "completed" || x.status === "published").length,
  }), [activities]);

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-[#f8f9ff] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px] space-y-5">
        <div className="rounded-2xl bg-[#002d62] px-5 py-6 text-white shadow-sm sm:px-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold tracking-[.12em] text-[#d7e2ff]"><Sparkles className="h-3.5 w-3.5" /> AI ASSISTANT STUDIO</div>
              <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-[30px]">AI Studio Workspace</h1>
              <p className="mt-2 text-sm leading-6 text-[#d7e2ff]">UX/UI และ workflow หลักจาก AI Studio เชื่อมกับข้อมูล Production จริง โดย AI สร้างผลลัพธ์และ ADMIN เป็นผู้ตรวจสอบและยืนยัน</p>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-3"><div className="flex items-center gap-2 text-xs font-semibold"><ShieldCheck className="h-4 w-4 text-[#95f8a7]" /> Governed AI</div><p className="mt-1 text-[11px] text-white/65">RBAC · Approval · Audit · Portal API</p></div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            [Activity, "กิจกรรมทั้งหมด", summary.total],
            [RefreshCw, "กำลังดำเนินการ / กำหนดการ", summary.active],
            [CheckCircle2, "เสร็จสิ้น / เผยแพร่", summary.completed],
          ].map(([Icon, label, value]) => {
            const I = Icon as typeof Activity;
            return <div key={String(label)} className="rounded-xl border bg-white p-4 shadow-sm"><I className="h-4 w-4 text-[#002d62]" /><p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">{String(label)}</p><p className="mt-1 text-2xl font-black text-[#002d62]">{String(value)}</p></div>;
          })}
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-end justify-between gap-4">
            <div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-emerald-700">AI-ASSISTED WORKFLOW</p><h2 className="mt-1 text-lg font-bold text-[#002d62]">Activity & Survey Workflow</h2><p className="mt-1 text-xs text-slate-500">ลำดับเดียวกับ AI Studio แต่ action ทุกจุดวิ่งเข้าสู่ Production route</p></div>
            <Link to="/admin/activities" className="hidden items-center gap-1 rounded-lg bg-[#002d62] px-3 py-2 text-xs font-bold text-white sm:inline-flex">เริ่มสร้างกิจกรรม <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-5">
            {workflow.map((item) => { const Icon = item.icon; return <Link key={item.step} to={item.to} className="group rounded-xl border border-slate-200 bg-slate-50/60 p-4 transition hover:border-[#002d62]/30 hover:bg-white hover:shadow-sm"><div className="flex items-center justify-between"><span className="text-[10px] font-black tracking-widest text-slate-400">STEP {item.step}</span><Icon className="h-4 w-4 text-[#002d62]" /></div><h3 className="mt-3 text-sm font-bold text-slate-900">{item.title}</h3><p className="mt-1 text-[11px] leading-5 text-slate-500">{item.description}</p><div className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-[#002d62] opacity-70 group-hover:opacity-100">เปิด workflow <ArrowRight className="h-3 w-3" /></div></Link>; })}
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3"><div><div className="flex items-center gap-2"><ListChecks className="h-4 w-4 text-[#002d62]" /><h2 className="text-sm font-bold text-slate-900">Production Activities</h2></div><p className="mt-1 text-xs text-slate-500">ข้อมูลกิจกรรมจริงจาก Portal API</p></div><button type="button" onClick={() => void loadActivities()} disabled={loading} className="inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-bold disabled:opacity-50"><RefreshCw className={loading ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} /> รีเฟรช</button></div>
          {loading ? <div className="py-10 text-center text-sm text-slate-500">กำลังโหลดกิจกรรม...</div> : activities.length === 0 ? <div className="py-10 text-center"><p className="text-sm font-semibold text-slate-600">ยังไม่มีกิจกรรม</p><Link to="/admin/activities" className="mt-3 inline-flex rounded-lg bg-[#002d62] px-4 py-2 text-xs font-bold text-white">สร้างกิจกรรม</Link></div> : <div className="mt-4 divide-y">{activities.slice(0, 6).map((activity) => <Link key={activity.id} to="/admin/activities" className="flex flex-col gap-2 py-3 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:px-2"><div className="min-w-0"><p className="truncate text-sm font-bold text-[#002d62]">{activity.title}</p><p className="mt-1 text-xs text-slate-500">{formatDate(activity.activityDate)}{activity.location ? ` · ${activity.location}` : ""}</p></div><span className="w-fit rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-600">{statusLabel[activity.status] ?? activity.status}</span></Link>)}</div>}
        </div>

        <div><div className="mb-3 flex items-center gap-2"><ListChecks className="h-4 w-4 text-[#002d62]" /><h2 className="text-sm font-bold text-slate-900">Studio Tools</h2></div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{studioTools.map((tool) => { const Icon = tool.icon; return <Link key={tool.to + tool.title} to={tool.to} className="group rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-start justify-between gap-4"><div className="grid h-9 w-9 place-items-center rounded-lg bg-[#002d62]/8 text-[#002d62]"><Icon className="h-4 w-4" /></div><ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-[#002d62]" /></div><h3 className="mt-4 text-sm font-bold text-slate-900">{tool.title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{tool.description}</p></Link>; })}</div></div>

        <div className="grid gap-3 md:grid-cols-3"><Link to="/admin/ai?tab=queue" className="rounded-xl border border-blue-200 bg-blue-50 p-4"><p className="text-[10px] font-bold uppercase tracking-wide text-blue-700">Queue</p><p className="mt-1 text-sm font-bold text-slate-900">งานที่กำลังดำเนินการ</p></Link><Link to="/admin/ai?tab=approval" className="rounded-xl border border-amber-200 bg-amber-50 p-4"><p className="text-[10px] font-bold uppercase tracking-wide text-amber-700">Approval</p><p className="mt-1 text-sm font-bold text-slate-900">งานที่ต้องตัดสินใจโดย ADMIN</p></Link><Link to="/admin/ai?tab=history" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"><p className="text-[10px] font-bold uppercase tracking-wide text-emerald-700">History</p><p className="mt-1 text-sm font-bold text-slate-900">ตรวจสอบ execution และ audit</p></Link></div>
      </div>
    </section>
  );
}
