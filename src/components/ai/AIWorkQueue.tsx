import { Clock3, FileCheck2, LoaderCircle, ShieldAlert } from "lucide-react";

export type AIQueueItem = {
  id: string;
  title: string;
  description: string;
  status: "running" | "approval" | "blocked";
  updatedAt: string;
};

const statusMap = {
  running: { label: "กำลังดำเนินการ", icon: LoaderCircle, className: "bg-sky-50 text-sky-700" },
  approval: { label: "รออนุมัติ", icon: FileCheck2, className: "bg-amber-50 text-amber-700" },
  blocked: { label: "ต้องการข้อมูล", icon: ShieldAlert, className: "bg-rose-50 text-rose-700" },
} as const;

export function AIWorkQueue({ items }: { items: AIQueueItem[] }) {
  if (!items.length)
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        ยังไม่มีงาน AI ในคิว
      </div>
    );
  return (
    <div className="space-y-2">
      {items.map((item) => {
        const meta = statusMap[item.status];
        const Icon = meta.icon;
        return (
          <article
            key={item.id}
            className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-50 text-slate-600">
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${meta.className}`}>
                  {meta.label}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">{item.description}</p>
              <p className="mt-2 flex items-center gap-1 text-[10px] font-medium text-slate-400">
                <Clock3 className="h-3 w-3" />
                {item.updatedAt}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
