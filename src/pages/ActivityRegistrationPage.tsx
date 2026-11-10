import { FormEvent, useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { CalendarDays, CheckCircle2, ClipboardList, Loader2, MapPin, ShieldCheck, Users } from "lucide-react";
import { PublicAppShell } from "@/components/layout/PublicAppShell";

type RegistrationSettings = {
  enabled: boolean;
  opens_at: string | null;
  closes_at: string | null;
  capacity: number | null;
  form_fields: { email?: boolean; organization?: boolean; participantType?: boolean };
  confirmation_message: string;
};
type Activity = {
  id: string; title: string; activity_date: string; location: string | null;
  featured_image?: string; summary?: string; registration_settings: RegistrationSettings;
};
const defaultSettings: RegistrationSettings = {
  enabled: true, opens_at: null, closes_at: null, capacity: null,
  form_fields: { email: true, organization: true, participantType: true },
  confirmation_message: "ลงทะเบียนสำเร็จ ขอบคุณที่สนใจเข้าร่วมกิจกรรม",
};

export function ActivityRegistrationPage() {
  const { slug = "" } = useParams();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [consent, setConsent] = useState(false);
  const [form, setForm] = useState({ fullName: "", phone: "", subdistrict: "", district: "", province: "", postalCode: "", email: "", organization: "", participantType: "general" });

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
          activityId: activity.id, ...form,
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
      {closed ? <div className="p-8 text-center"><Users className="mx-auto h-10 w-10 text-slate-400" /><h2 className="mt-3 text-lg font-bold text-brand-navy">{notYetOpen ? "ยังไม่ถึงเวลาเปิดรับลงทะเบียน" : "ปิดรับลงทะเบียนแล้ว"}</h2><p className="mt-2 text-sm text-slate-500">{notYetOpen && settings.opens_at ? `เปิดรับสมัคร ${new Date(settings.opens_at).toLocaleString("th-TH")}` : alreadyClosed && settings.closes_at ? `ปิดรับสมัครเมื่อ ${new Date(settings.closes_at).toLocaleString("th-TH")}` : "ขออภัย ขณะนี้ยังไม่เปิดรับสมัครกิจกรรมนี้"}</p></div> :
      <form onSubmit={submit} className="space-y-5 p-5 sm:p-8">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3"><ClipboardList className="h-5 w-5 text-brand-blue" /><h2 className="font-bold text-brand-navy">ข้อมูลผู้เข้าร่วม</h2></div>
        {settings.capacity && <p className="rounded-xl bg-blue-50 px-4 py-3 text-xs text-blue-800">เปิดรับสมัครจำนวนจำกัด {settings.capacity.toLocaleString("th-TH")} คน</p>}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="ชื่อ–นามสกุล *"><input required minLength={2} maxLength={200} value={form.fullName} onChange={(e) => update("fullName", e.target.value)} autoComplete="name" className={inputClass} placeholder="กรอกชื่อและนามสกุล" /></Field>
          <Field label="เบอร์โทรศัพท์ *"><input required type="tel" inputMode="numeric" pattern="0[0-9]{8,9}" maxLength={10} title="กรุณากรอกเบอร์โทรศัพท์ 9–10 หลัก โดยขึ้นต้นด้วย 0" value={form.phone} onChange={(e) => update("phone", e.target.value.replace(/[^0-9]/g, "").slice(0, 10))} autoComplete="tel" className={inputClass} placeholder="08XXXXXXXX" /></Field>
          <Field label="ตำบล / แขวง *"><input required maxLength={100} value={form.subdistrict} onChange={(e) => update("subdistrict", e.target.value)} autoComplete="address-level3" className={inputClass} placeholder="กรอกตำบล / แขวง" /></Field>
          <Field label="อำเภอ / เขต *"><input required maxLength={100} value={form.district} onChange={(e) => update("district", e.target.value)} autoComplete="address-level2" className={inputClass} placeholder="กรอกอำเภอ / เขต" /></Field>
          <Field label="จังหวัด *"><input required maxLength={100} value={form.province} onChange={(e) => update("province", e.target.value)} autoComplete="address-level1" className={inputClass} placeholder="กรอกจังหวัด" /></Field>
          <Field label="รหัสไปรษณีย์ *"><input required inputMode="numeric" pattern="[0-9]{5}" maxLength={5} title="กรุณากรอกรหัสไปรษณีย์ 5 หลัก" value={form.postalCode} onChange={(e) => update("postalCode", e.target.value.replace(/[^0-9]/g, "").slice(0, 5))} autoComplete="postal-code" className={inputClass} placeholder="รหัสไปรษณีย์ 5 หลัก" /></Field>
          {settings.form_fields?.email && <Field label="อีเมล"><input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} autoComplete="email" className={inputClass} placeholder="name@example.com" /></Field>}
          {settings.form_fields?.organization && <Field label="หน่วยงาน / สังกัด"><input value={form.organization} onChange={(e) => update("organization", e.target.value)} className={inputClass} placeholder="ชื่อหน่วยงานหรือชุมชน" /></Field>}
          {settings.form_fields?.participantType && <Field label="ประเภทผู้เข้าร่วม"><select value={form.participantType} onChange={(e) => update("participantType", e.target.value)} className={inputClass}><option value="general">บุคคลทั่วไป</option><option value="community">สมาชิกชุมชน</option><option value="student">นักเรียน / นักศึกษา</option><option value="staff">บุคลากร / เจ้าหน้าที่</option><option value="partner">หน่วยงานภาคีเครือข่าย</option></select></Field>}
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
