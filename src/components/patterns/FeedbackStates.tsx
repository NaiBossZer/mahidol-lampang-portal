import { AlertCircle, Inbox, Loader2 } from "lucide-react";

export function LoadingState({ label = "กำลังโหลด..." }: { label?: string }) {
  return (
    <div className="flex min-h-32 items-center justify-center gap-2 rounded-2xl border border-border bg-white p-6 text-sm font-semibold text-muted-ink" role="status" aria-live="polite">
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function EmptyState({ title = "ยังไม่มีข้อมูล", description }: { title?: string; description?: string }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white p-8 text-center">
      <Inbox className="h-8 w-8 text-muted-ink" aria-hidden="true" />
      <h2 className="mt-3 text-base font-bold text-brand-navy">{title}</h2>
      {description && <p className="mt-1 max-w-md text-sm leading-6 text-muted-ink">{description}</p>}
    </div>
  );
}

export function ErrorState({ title = "เกิดข้อผิดพลาด", description = "ไม่สามารถแสดงข้อมูลได้ในขณะนี้" }: { title?: string; description?: string }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800" role="alert">
      <div className="flex gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <div>
          <h2 className="font-bold">{title}</h2>
          <p className="mt-1 text-sm leading-6">{description}</p>
        </div>
      </div>
    </div>
  );
}
