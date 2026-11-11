import { FormEvent, useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { CalendarDays, CheckCircle2, ChevronDown, ChevronUp, ClipboardList, Clock3, Loader2, MapPin, ShieldCheck, Users } from "lucide-react";
import { PublicAppShell } from "@/components/layout/PublicAppShell";

type RegistrationSettings = {
  enabled: boolean;
  opens_at: string | null;
  closes_at: string | null;
  capacity: number | null;
  form_fields: { email?: boolean; participantType?: boolean };
  confirmation_message: string;
};
type Activity = {
  id: string; title: string; activity_date: string; location: string | null;
  featured_image?: string; summary?: string; registration_settings: RegistrationSettings;
};
const defaultSettings: RegistrationSettings = {
  enabled: true, opens_at: null, closes_at: null, capacity: null,
  form_fields: { email: true, participantType: true },
  confirmation_message: "ลงทะเบียนสำเร็จ ขอบคุณที่สนใจเข้าร่วมกิจกรรม",
};


const shellacSchedule = [
  { time: "08.30–09.00", title: "ลงทะเบียน", detail: "รับชมวีดิทัศน์เกี่ยวกับพื้นที่และครั่งของคณะสิ่งแวดล้อมฯ", kind: "ลงทะเบียน" },
  { time: "09.00–09.10", title: "พิธีเปิดโครงการ", detail: "คณบดีคณะสิ่งแวดล้อมและทรัพยากรศาสตร์กล่าวรายงาน และนายกองค์การบริหารส่วนจังหวัดลำปาง (อบจ.ลำปาง) ให้เกียรติเป็นประธานกล่าวเปิดงานโครงการอบรม “ครั่งสร้างรายได้ สู้โลกร้อน” มุ่งยกระดับเศรษฐกิจชุมชน", kind: "พิธีการ" },
  { time: "09.10–10.10", title: "ความรู้พื้นฐาน วงจรชีวิตครั่ง และการคัดเลือกพืชอาศัยที่เหมาะสม", detail: "วิทยากร: ศูนย์ส่งเสริมเทคโนโลยีการเกษตรด้านแมลงเศรษฐกิจ จังหวัดเชียงใหม่", kind: "บรรยาย" },
  { time: "10.10–10.15", title: "พักรับประทานอาหารว่าง", detail: "", kind: "พัก" },
  { time: "10.15–11.00", title: "เทคนิคการปล่อยเลี้ยง การดูแลรักษา และเฝ้าระวังศัตรูครั่ง", detail: "การจัดการแปลงให้เหมาะสมกับสภาพอากาศแปรปรวน · วิทยากร: ศูนย์ส่งเสริมเทคโนโลยีการเกษตรด้านแมลงเศรษฐกิจ จังหวัดเชียงใหม่", kind: "บรรยาย" },
  { time: "11.00–12.00", title: "การเก็บเกี่ยวและคัดคุณภาพผลผลิตครั่ง", detail: "การเตรียมครั่งดิบ/ครั่งแห้งเพื่อจำหน่าย ภาพรวมตลาด ราคา และโอกาสสร้างมูลค่าเพิ่ม · วิทยากร: บริษัท ครีเอเซียมิลล์ จำกัด", kind: "บรรยาย" },
  { time: "12.00–13.00", title: "รับประทานอาหารกลางวัน", detail: "", kind: "พัก" },
  { time: "13.00–13.30", title: "สาธิตการสังเกตและคัดเลือกกิ่งเชื้อครั่ง", detail: "ข้อควรระวังในการขนย้ายและเตรียมกิ่งเชื้อ โดยวิทยากรร่วม", kind: "สาธิต" },
  { time: "13.30–14.30", title: "ฝึกปฏิบัติการปล่อยเลี้ยงครั่งในแปลงสาธิต", detail: "แบ่งกลุ่มฝึกปฏิบัติและรับคำแนะนำจากวิทยากรร่วม", kind: "ปฏิบัติ" },
  { time: "14.30–14.45", title: "พักรับประทานอาหารว่าง", detail: "", kind: "พัก" },
  { time: "14.45–15.45", title: "ติดตามการเจริญเติบโตของครั่งและตรวจสภาพกิ่งเลี้ยง", detail: "การบันทึกข้อมูล และแนวทางดูแลแปลงเมื่อเกิดความร้อน ฝนผิดฤดูกาล หรือสภาพแห้งแล้ง โดยวิทยากรร่วม", kind: "ปฏิบัติ" },
  { time: "15.45–16.00", title: "ถาม–ตอบ และสรุปแนวทางนำความรู้ไปใช้ในพื้นที่", detail: "ผู้เข้าร่วมประเมินผลการอบรม", kind: "สรุป" },
] as const;

export function ActivityRegistrationPage() {
  const { slug = "" } = useParams();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [consent, setConsent] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(true);
  const [form, setForm] = useState({ fullName: "", phone: "", age: "", subdistrict: "", district: "", province: "", email: "", participantType: "general", occupation: "", occupationOther: "", shellacExperience: "" });

  useEffect(() => {
    fetch(`/api/registrations?slug=${encodeURIComponent(slug)}`)
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "ไม่สามารถโหลดกิจกรรมได้");
        setActivity({ ...body.data, registration_settings: body.data.registration_settings ?? defaultSettings });
      })
      .catch((e) => setError(e instanceof Error ? e.message : "ไม่สามารถโหลดกิจกรรมได้"))
      .finally(() => setLoading(false));
  }, [slug]);

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const formElement = event.currentTarget as HTMLFormElement;
    if (!activity || !consent) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityId: activity.id, ...form, occupation: form.occupation === "other" ? `อื่น ๆ: ${form.occupationOther.trim()}` : form.occupation,
          website: (formElement.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "",
          pdpaConsent: consent,
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "ลงทะเบียนไม่สำเร็จ");
      setCode(body.data.registrationCode);
    } catch (e) {
      setError(e instanceof Error ? e.message : "ลงทะเบียนไม่สำเร็จ");
    } finally {
      setSubmitting(false);
    }
  }

  const settings = activity?.registration_settings ?? defaultSettings;
  const now = Date.now();
  const notYetOpen = !!settings.opens_at && now < Date.parse(settings.opens_at);
  const alreadyClosed = !!settings.closes_at && now >= Date.parse(settings.closes_at);
  const closed = !settings.enabled || notYetOpen || alreadyClosed;

  if (loading) return <PublicAppShell><main className="grid min-h-[60vh] place-items-center text-sm text-slate-500">กำลังโหลดข้อมูลกิจกรรม...</main></PublicAppShell>;
  if (error && !activity) return <PublicAppShell><main className="mx-auto grid min-h-[60vh] max-w-xl place-items-center px-4 text-center"><div><p className="font-bold text-slate-800">{error}</p><RouterLink to="/" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-brand-navy px-5 text-sm font-bold text-white">กลับหน้าหลัก</RouterLink></div></main></PublicAppShell>;
  if (code) return <PublicAppShell><main className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-4 py-12"><section className="w-full rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-sm"><CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" /><p className="mt-4 text-sm font-bold text-emerald-700">ลงทะเบียนสำเร็จ</p><h1 className="mt-2 text-2xl font-black text-brand-navy">ยืนยันการลงทะเบียน</h1><p className="mt-3 text-sm text-slate-600">{activity?.title}</p><p className="mt-6 text-xs text-slate-500">หมายเลขลงทะเบียนของท่าน</p><p className="mt-2 rounded-xl bg-slate-50 px-4 py-4 font-mono text-2xl font-black tracking-widest text-brand-navy">{code}</p><p className="mt-4 text-sm leading-6 text-slate-600">{settings.confirmation_message}</p><RouterLink to="/" className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-brand-navy px-5 py-3 text-sm font-bold text-white">กลับหน้าหลัก</RouterLink></section></main></PublicAppShell>;

  return <PublicAppShell><main className="min-h-screen bg-surface-warm px-4 py-8 text-slate-800 sm:py-12"><div className="mx-auto max-w-3xl">
    <RouterLink to={`/activities/${slug}`} className="inline-flex min-h-10 items-center text-sm font-bold text-brand-navy">← กลับไปหน้ากิจกรรม</RouterLink>
    <section className="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="bg-brand-navy px-6 py-7 text-white sm:px-8">{activity?.featured_image && <img src={activity.featured_image} alt="" className="mb-5 h-44 w-full rounded-2xl object-cover" />}<p className="text-xs font-bold tracking-widest text-northern-gold">MAHIDOL UNIVERSITY · EVENT REGISTRATION</p><h1 className="mt-3 text-2xl font-black leading-tight sm:text-3xl">ลงทะเบียนเข้าร่วมกิจกรรม</h1><p className="mt-3 text-sm leading-6 text-blue-100">{activity?.title}</p><div className="mt-5 flex flex-wrap gap-4 text-xs text-white/80"><span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4" />{activity?.activity_date}</span>{activity?.location && <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" />{activity.location}</span>}</div></div>

      {slug === "shellac-income-climate-workshop-2026-1793678474794" && <section className="border-t border-slate-100 bg-white">
        <button type="button" onClick={() => setScheduleOpen((open) => !open)} aria-expanded={scheduleOpen} className="flex min-h-16 w-full items-center justify-between gap-3 px-5 py-4 text-left sm:px-8">
          <span className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-brand-blue"><CalendarDays className="h-5 w-5" /></span>
            <span><span className="block font-bold text-brand-navy">กำหนดการอบรม</span><span className="mt-1 block text-xs text-slate-500">วันศุกร์ที่ 18 ธันวาคม 2569 · 08.30–16.00 น.</span></span>
          </span>
          <span className="flex items-center gap-1 text-xs font-bold text-brand-blue">{scheduleOpen ? "ซ่อนกำหนดการ" : "ดูกำหนดการ"}{scheduleOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</span>
        </button>
        {scheduleOpen && <div className="px-5 pb-6 sm:px-8">
          <div className="rounded-2xl bg-slate-50 p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2 text-xs text-slate-500"><Clock3 className="h-4 w-4" /> กำหนดการตลอดทั้งวัน</div>
            <ol className="space-y-0">
              {shellacSchedule.map((item, index) => <li key={item.time} className="relative grid grid-cols-[92px_minmax(0,1fr)] gap-3 pb-4 last:pb-0 sm:grid-cols-[112px_minmax(0,1fr)]">
                {index !== shellacSchedule.length - 1 && <span aria-hidden="true" className="absolute left-[91px] top-2 h-full w-px bg-slate-200 sm:left-[111px]" />}
                <span className="relative z-10 pt-0.5 text-[11px] font-bold tabular-nums text-brand-blue sm:text-xs">{item.time} น.</span>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2"><span className="text-sm font-bold leading-5 text-slate-800">{item.title}</span><span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${item.kind === "พัก" ? "bg-amber-100 text-amber-800" : item.kind === "ปฏิบัติ" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"}`}>{item.kind}</span></span>
                  {item.detail && <span className="mt-1 block text-xs leading-5 text-slate-500">{item.detail}</span>}
                </span>
              </li>)}
            </ol>
            <p className="mt-5 border-t border-slate-200 pt-3 text-[11px] text-slate-400">หมายเหตุ: กำหนดการอาจมีการเปลี่ยนแปลงตามความเหมาะสม</p>
          </div>
        </div>}
      </section>}
      {closed ? <div className="p-8 text-center"><Users className="mx-auto h-10 w-10 text-slate-400" /><h2 className="mt-3 text-lg font-bold text-brand-navy">{notYetOpen ? "ยังไม่ถึงเวลาเปิดรับลงทะเบียน" : "ปิดรับลงทะเบียนแล้ว"}</h2><p className="mt-2 text-sm text-slate-500">{notYetOpen && settings.opens_at ? `เปิดรับสมัคร ${new Date(settings.opens_at).toLocaleString("th-TH")}` : alreadyClosed && settings.closes_at ? `ปิดรับสมัครเมื่อ ${new Date(settings.closes_at).toLocaleString("th-TH")}` : "ขออภัย ขณะนี้ยังไม่เปิดรับสมัครกิจกรรมนี้"}</p></div> :
      <form onSubmit={submit} className="space-y-5 p-5 sm:p-8">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3"><ClipboardList className="h-5 w-5 text-brand-blue" /><h2 className="font-bold text-brand-navy">ข้อมูลผู้เข้าร่วม</h2></div>
        {settings.capacity && <p className="rounded-xl bg-blue-50 px-4 py-3 text-xs text-blue-800">เปิดรับสมัครจำนวนจำกัด {settings.capacity.toLocaleString("th-TH")} คน</p>}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="ชื่อ–นามสกุล *"><input required minLength={2} maxLength={200} value={form.fullName} onChange={(e) => update("fullName", e.target.value)} autoComplete="name" className={inputClass} placeholder="กรอกชื่อและนามสกุล" /></Field>
          <Field label="เบอร์โทรศัพท์ *"><input required type="tel" inputMode="numeric" pattern="0[0-9]{8,9}" maxLength={10} title="กรุณากรอกเบอร์โทรศัพท์ 9–10 หลัก โดยขึ้นต้นด้วย 0" value={form.phone} onChange={(e) => update("phone", e.target.value.replace(/[^0-9]/g, "").slice(0, 10))} autoComplete="tel" className={inputClass} placeholder="08XXXXXXXX" /></Field>
          <Field label="อายุ (ปี) *"><input required type="number" min={1} step={1} inputMode="numeric" value={form.age} onChange={(e) => update("age", e.target.value.replace(/[^0-9]/g, ""))} className={inputClass} placeholder="กรอกอายุเป็นปี" /></Field>
          <Field label="ตำบล / แขวง *"><input required maxLength={100} value={form.subdistrict} onChange={(e) => update("subdistrict", e.target.value)} autoComplete="address-level3" className={inputClass} placeholder="กรอกตำบล / แขวง" /></Field>
          <Field label="อำเภอ / เขต *"><input required maxLength={100} value={form.district} onChange={(e) => update("district", e.target.value)} autoComplete="address-level2" className={inputClass} placeholder="กรอกอำเภอ / เขต" /></Field>
          <Field label="จังหวัด *"><input required maxLength={100} value={form.province} onChange={(e) => update("province", e.target.value)} autoComplete="address-level1" className={inputClass} placeholder="กรอกจังหวัด" /></Field>
          {settings.form_fields?.email && <Field label="อีเมล"><input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} autoComplete="email" className={inputClass} placeholder="name@example.com" /></Field>}
          {settings.form_fields?.participantType && <Field label="ประเภทผู้เข้าร่วม"><select value={form.participantType} onChange={(e) => update("participantType", e.target.value)} className={inputClass}><option value="general">บุคคลทั่วไป</option><option value="community">สมาชิกชุมชน</option><option value="student">นักเรียน / นักศึกษา</option><option value="staff">บุคลากร / เจ้าหน้าที่</option><option value="partner">หน่วยงานภาคีเครือข่าย</option></select></Field>}
          {slug === "shellac-income-climate-workshop-2026-1793678474794" && <>
            <div className="sm:col-span-2 mt-2 border-t border-slate-100 pt-4"><h3 className="font-bold text-brand-navy">ข้อมูลพื้นฐานเกี่ยวกับอาชีพและครั่ง</h3><p className="mt-1 text-xs text-slate-500">ใช้เพื่อเตรียมเนื้อหาและประเมินผลการอบรม</p></div>
            <Field label="อาชีพปัจจุบัน *"><select required value={form.occupation} onChange={(e) => update("occupation", e.target.value)} className={inputClass}><option value="">เลือกอาชีพ</option><option value="เกษตรกร">เกษตรกร</option><option value="ผู้ประกอบการ / ค้าขาย">ผู้ประกอบการ / ค้าขาย</option><option value="นักเรียน / นักศึกษา">นักเรียน / นักศึกษา</option><option value="ข้าราชการ / พนักงานเอกชน">ข้าราชการ / พนักงานเอกชน</option><option value="รับจ้างทั่วไป">รับจ้างทั่วไป</option><option value="แม่บ้าน / ไม่ได้ประกอบอาชีพ">แม่บ้าน / ไม่ได้ประกอบอาชีพ</option><option value="other">อื่น ๆ</option></select></Field>
            {form.occupation === "other" && <Field label="โปรดระบุอาชีพ *"><input required maxLength={120} value={form.occupationOther} onChange={(e) => update("occupationOther", e.target.value)} className={inputClass} placeholder="ระบุอาชีพของท่าน" /></Field>}
            <Field label="ประสบการณ์เกี่ยวกับการเลี้ยงครั่ง *"><select required value={form.shellacExperience} onChange={(e) => update("shellacExperience", e.target.value)} className={inputClass}><option value="">เลือกประสบการณ์</option><option value="no_experience">ไม่เคยมีประสบการณ์</option><option value="studied">เคยศึกษา / เรียนรู้เกี่ยวกับครั่ง แต่ยังไม่เคยเลี้ยง</option><option value="trial">เคยทดลองเลี้ยงครั่ง</option><option value="current">เลี้ยงครั่งอยู่ในปัจจุบัน</option><option value="former">เคยเลี้ยงครั่ง แต่ปัจจุบันไม่ได้เลี้ยง</option></select></Field>
          </>}
        </div>
        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-[#12345b]" /><span><strong className="text-brand-navy">ยินยอมให้เก็บรวบรวมและใช้ข้อมูลส่วนบุคคล *</strong><br /><span className="text-xs text-slate-600">ข้าพเจ้ายินยอมให้มหาวิทยาลัยมหิดลใช้ข้อมูลที่กรอกเพื่อดำเนินการลงทะเบียน ติดต่อประสานงาน และบริหารจัดการการเข้าร่วมกิจกรรม ตามประกาศความเป็นส่วนตัวของมหาวิทยาลัย</span></span></label>
        {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={!consent || submitting || !activity} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-navy px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-blue disabled:cursor-not-allowed disabled:bg-slate-300">{submitting ? <><Loader2 className="h-4 w-4 animate-spin" />กำลังบันทึก...</> : <><ShieldCheck className="h-4 w-4" />ยืนยันการลงทะเบียน</>}</button>
        <p className="text-center text-[11px] leading-5 text-slate-400">ข้อมูลของท่านจะถูกใช้เพื่อการจัดกิจกรรมและการประสานงานเท่านั้น</p>
      </form>}
    </section>
    <p className="mt-5 text-center text-xs text-slate-400">คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ · มหาวิทยาลัยมหิดล</p>
  </div></main></PublicAppShell>;
}

const inputClass = "mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10";
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block text-xs font-bold text-slate-600">{label}{children}</label>; }
