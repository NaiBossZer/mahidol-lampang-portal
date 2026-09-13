import { useEffect, useState } from "react";

interface Overview {
  systems: Array<{
    system_key: string;
    system_name: string;
    system_type: string;
    status: string;
    owner_domain: string;
    base_url: string | null;
  }>;
  buildings: { total: number; active: number };
  assets: { total: number; active: number; repairing: number };
  workOrders: { total: number; open: number; completed: number };
  inspections: { total: number; last_30_days: number };
  auditLogs: { total: number; last_24_hours: number };
}

const cards = [
  ["อาคาร", "buildings", "สถานที่ในระบบ"],
  ["ครุภัณฑ์/ระบบ", "assets", "ทรัพย์สินที่ติดตาม"],
  ["ใบแจ้งซ่อม", "workOrders", "งานซ่อมและ PM/CM"],
  ["การตรวจสอบ", "inspections", "Inspection records"],
  ["Audit Trail", "auditLogs", "รายการตรวจสอบย้อนหลัง"],
] as const;

export function FacilitySafetyAdminPage() {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetch("/api/admin/facility-overview", { credentials: "include" })
      .then(async (r) => {
        const body = await r.json();
        if (!r.ok) throw new Error(body.error || "โหลดข้อมูลไม่สำเร็จ");
        return body.data as Overview;
      })
      .then(setData)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "โหลดข้อมูลไม่สำเร็จ"));
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl bg-[#123B63] p-6 text-white shadow-xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
            Central Admin · Security Domain
          </p>
          <h1 className="mt-2 text-3xl font-black">Facility & Safety Control Center</h1>
          <p className="mt-2 max-w-3xl text-sm text-white/80">
            ศูนย์ควบคุมข้อมูลวิศวกรรม อาคาร ความปลอดภัย การตรวจสอบ และงานซ่อม โดย Portal Admin
            เป็นจุดควบคุมสิทธิ์เดียว
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map(([label, key, detail]) => {
            const value = data?.[key];
            const total = typeof value === "object" && value ? value.total : 0;
            return (
              <div key={key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-bold text-slate-500">{label}</div>
                <div className="mt-2 text-3xl font-black text-[#123B63]">{total}</div>
                <div className="mt-1 text-xs text-slate-400">{detail}</div>
              </div>
            );
          })}
        </section>

        {data && (
          <section className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-slate-800">System Registry</h2>
              <p className="mt-1 text-sm text-slate-500">
                รายการระบบที่เชื่อมกับศูนย์กลาง โดยไม่ทำสำเนาข้อมูลปฏิบัติการ
              </p>
              <div className="mt-5 space-y-3">
                {data.systems.map((system) => (
                  <div
                    key={system.system_key}
                    className="flex items-center justify-between rounded-xl bg-slate-50 p-4"
                  >
                    <div>
                      <div className="font-bold text-slate-800">{system.system_name}</div>
                      <div className="text-xs text-slate-500">
                        {system.system_key} · {system.owner_domain}
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                      {system.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-slate-800">Security Signals</h2>
              <div className="mt-5 space-y-4 text-sm">
                <div className="flex justify-between">
                  <span>ครุภัณฑ์กำลังซ่อม</span>
                  <b>{data.assets.repairing}</b>
                </div>
                <div className="flex justify-between">
                  <span>ใบแจ้งซ่อมเปิดอยู่</span>
                  <b>{data.workOrders.open}</b>
                </div>
                <div className="flex justify-between">
                  <span>ตรวจสอบ 30 วัน</span>
                  <b>{data.inspections.last_30_days}</b>
                </div>
                <div className="flex justify-between">
                  <span>Audit 24 ชั่วโมง</span>
                  <b>{data.auditLogs.last_24_hours}</b>
                </div>
              </div>
              <div className="mt-6 rounded-xl bg-amber-50 p-4 text-xs leading-5 text-amber-800">
                สิทธิ์แก้ไขข้อมูลความปลอดภัยยังคงอยู่ที่ domain Facility-Safety/RLS; Portal
                ทำหน้าที่เป็น Central Admin และไม่เปิดเผย service-role key ให้ browser
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
