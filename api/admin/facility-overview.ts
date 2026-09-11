import { sql } from "drizzle-orm";
import { getDb } from "../../src/db/index";
import { json, methodNotAllowed, type ApiRequest, type ApiResponse } from "../_http";
import { requirePermission } from "../_authorization";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requirePermission(req, res, "facility.read")) return;
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);

  try {
    const db = getDb();
    const [systems, buildings, assets, workOrders, inspections, auditLogs] = await Promise.all([
      db.execute(sql`select system_key, system_name, system_type, status, owner_domain, base_url from public.system_registry order by system_name`),
      db.execute(sql`select count(*)::int as total, count(*) filter (where active = true)::int as active from public.buildings`),
      db.execute(sql`select count(*)::int as total, count(*) filter (where status = 'active')::int as active, count(*) filter (where status = 'repairing')::int as repairing from public.assets`),
      db.execute(sql`select count(*)::int as total, count(*) filter (where status > 0 and status < 6)::int as open, count(*) filter (where status = 6)::int as completed from public.work_orders`),
      db.execute(sql`select count(*)::int as total, count(*) filter (where date >= current_date - interval '30 days')::int as last_30_days from public.inspections`),
      db.execute(sql`select count(*)::int as total, count(*) filter (where created_at >= now() - interval '24 hours')::int as last_24_hours from public.audit_logs`),
    ]);
    return json(res, 200, { success: true, data: {
      systems, buildings: buildings[0] ?? { total: 0, active: 0 }, assets: assets[0] ?? { total: 0, active: 0, repairing: 0 },
      workOrders: workOrders[0] ?? { total: 0, open: 0, completed: 0 }, inspections: inspections[0] ?? { total: 0, last_30_days: 0 },
      auditLogs: auditLogs[0] ?? { total: 0, last_24_hours: 0 },
    }});
  } catch (error) { console.error(error); return json(res, 500, { error: "ไม่สามารถอ่านข้อมูลระบบ Facility & Safety จากฐานกลางได้" }); }
}
