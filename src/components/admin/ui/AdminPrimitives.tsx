import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { Search, RefreshCw } from "lucide-react";

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-600">{eyebrow}</p>}
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#002d62] lg:text-3xl">{title}</h1>
        {description && <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

export function AdminButton({ variant = "primary", className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }) {
  const variants = {
    primary: "border border-[#002d62] bg-[#002d62] text-white shadow-sm hover:bg-[#0c2340]",
    secondary: "border border-slate-200 bg-white text-[#002d62] shadow-sm hover:bg-slate-50",
    ghost: "border border-transparent text-slate-600 hover:bg-slate-100",
  };
  return <button {...props} className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`} />;
}

export function AdminCard({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>;
}

export function AdminFilterBar({ children, onRefresh }: { children: ReactNode; onRefresh?: () => void }) {
  return (
    <AdminCard className="mt-6 p-3 sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">{children}</div>
        {onRefresh && <AdminButton variant="secondary" onClick={onRefresh} aria-label="รีเฟรชข้อมูล"><RefreshCw className="h-4 w-4" />รีเฟรช</AdminButton>}
      </div>
    </AdminCard>
  );
}

export function AdminSearchInput({ value, onChange, placeholder = "ค้นหา..." }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label className="relative block min-w-[220px] flex-1 lg:max-w-xl">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <span className="sr-only">{placeholder}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-[#002d62] focus:ring-2 focus:ring-[#002d62]/10" />
    </label>
  );
}

export function AdminStatusBadge({ status, label }: { status: string; label?: string }) {
  const tone = status === "published" || status === "active" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : status === "archived" || status === "inactive" ? "border-slate-200 bg-slate-100 text-slate-600" : "border-amber-200 bg-amber-50 text-amber-700";
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${tone}`}>{label ?? status}</span>;
}

export function AdminTable({ children, minWidth = "min-w-[760px]" }: { children: ReactNode; minWidth?: string }) {
  return <AdminCard className="mt-4 overflow-hidden"><div className="overflow-x-auto"><table className={`w-full ${minWidth} text-sm`}>{children}</table></div></AdminCard>;
}

export function AdminTableHead({ children }: { children: ReactNode }) {
  return <thead className="bg-slate-50 text-xs font-semibold text-slate-500">{children}</thead>;
}

export function AdminTableRow({ children }: { children: ReactNode }) {
  return <tr className="border-t border-slate-100 transition-colors hover:bg-slate-50/70">{children}</tr>;
}

export function AdminLoading({ label = "กำลังโหลดข้อมูล..." }: { label?: string }) {
  return <div className="p-12 text-center text-sm text-slate-500">{label}</div>;
}

export function AdminEmpty({ label = "ไม่พบข้อมูล" }: { label?: string }) {
  return <div className="p-12 text-center text-sm text-slate-500">{label}</div>;
}
