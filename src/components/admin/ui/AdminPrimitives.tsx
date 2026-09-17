import { Children, isValidElement, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
import { Search, RefreshCw, Sparkles, ShieldCheck } from "lucide-react";

type AdminButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger"; icon?: ReactNode };

export function AdminPageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: ReactNode }) {
  const isActivityStudio = eyebrow === "ACTIVITIES";
  if (isActivityStudio) {
    return (
      <header className="rounded-2xl bg-gradient-to-r from-[#002d62] via-[#0c2340] to-[#00193c] px-5 py-6 text-white shadow-sm sm:px-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold tracking-wider text-[#d7e2ff]">
              <Sparkles className="h-3.5 w-3.5 text-sky-300" /> ACTIVITY MANAGEMENT STUDIO
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-[30px]">{title}</h1>
            {description && <p className="mt-1 text-sm leading-6 text-[#d7e2ff]">{description}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-2 [&_button]:!border-white/20 [&_button]:!bg-white [&_button]:!text-[#002d62] [&_button]:hover:!bg-slate-50">
            <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold"><ShieldCheck className="h-4 w-4 text-[#95f8a7]" /> Governed Activity Data</div>
              <p className="mt-0.5 text-[11px] text-white/70">CRUD · Relations · Media · Status</p>
            </div>
            {actions}
          </div>
        </div>
      </header>
    );
  }
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

export function AdminButton({ variant = "primary", icon, className = "", children, ...props }: AdminButtonProps) {
  const variants = {
    primary: "border border-[#002d62] bg-[#002d62] text-white shadow-sm hover:bg-[#0c2340]",
    secondary: "border border-slate-200 bg-white text-[#002d62] shadow-sm hover:bg-slate-50",
    ghost: "border border-transparent text-slate-600 hover:bg-slate-100",
    danger: "border border-red-200 bg-red-50 text-red-700 shadow-sm hover:bg-red-100",
  };
  return <button {...props} className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}>{icon}{children}</button>;
}

export function AdminCard({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>;
}

export function AdminFilterBar({ children, onRefresh, search, onSearchChange, placeholder = "ค้นหา..." }: { children?: ReactNode; onRefresh?: () => void; search?: string; onSearchChange?: (value: string) => void; placeholder?: string }) {
  return (
    <AdminCard className="mt-6 p-3 sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          {search !== undefined && onSearchChange && <AdminSearchInput value={search} onChange={onSearchChange} placeholder={placeholder} />}
          {children}
        </div>
        {onRefresh && <AdminButton variant="secondary" icon={<RefreshCw className="h-4 w-4" />} onClick={onRefresh} aria-label="รีเฟรชข้อมูล">รีเฟรช</AdminButton>}
      </div>
    </AdminCard>
  );
}

export function AdminSearchInput({ value, onChange, placeholder = "ค้นหา..." }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label className="relative block min-w-[220px] flex-1 lg:max-w-xl">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <span className="sr-only">{placeholder}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-[#002d62] focus:ring-4 focus:ring-[#002d62]/10" />
    </label>
  );
}

type StatusTone = "success" | "warning" | "neutral" | "danger";
type AdminStatusBadgeProps = { status?: string; label?: string; tone?: StatusTone; children?: ReactNode };
export function AdminStatusBadge({ status, label, tone, children }: AdminStatusBadgeProps) {
  const resolvedTone: StatusTone = tone ?? (status === "published" || status === "active" ? "success" : status === "archived" || status === "inactive" ? "neutral" : "warning");
  const tones: Record<StatusTone, string> = { success: "border-emerald-200 bg-emerald-50 text-emerald-700", warning: "border-amber-200 bg-amber-50 text-amber-700", neutral: "border-slate-200 bg-slate-100 text-slate-600", danger: "border-red-200 bg-red-50 text-red-700" };
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${tones[resolvedTone]}`}>{children ?? label ?? status}</span>;
}

function renderAdminTableChild(child: ReactNode, index: number) {
  if (!isValidElement(child)) return child;
  const childType = child.type;
  if (childType === AdminLoading || childType === AdminLoadingState) return <tbody key={`loading-${index}`}><tr><td colSpan={100} className="p-0">{child}</td></tr></tbody>;
  if (childType === AdminEmptyState || childType === AdminEmpty) return <tbody key={`empty-${index}`}><tr><td colSpan={100} className="p-0">{child}</td></tr></tbody>;
  return child;
}

export function AdminTable({ children, minWidth = "min-w-[760px]", className = "" }: { children: ReactNode; minWidth?: string; className?: string }) {
  const isPixelWidth = /^\d+(?:\.\d+)?px$/.test(minWidth);
  const isActivityStudioTable = minWidth === "820px";
  const tableChildren = Children.map(children, renderAdminTableChild);
  return (
    <AdminCard className={`mt-4 overflow-hidden ${isActivityStudioTable ? "border-slate-200/80 shadow-sm" : ""} ${className}`}>
      {isActivityStudioTable && (
        <div className="flex flex-col gap-2 border-b border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-violet-600"><Sparkles className="h-3.5 w-3.5" /> Activity Data Workspace</div>
            <p className="mt-1 text-sm font-bold text-[#002d62]">รายการกิจกรรมโครงการ</p>
            <p className="mt-0.5 text-xs text-slate-500">ข้อมูลกิจกรรมจากฐานข้อมูลกลาง พร้อมจัดการข้อมูล ความสัมพันธ์ และสื่อประกอบ</p>
          </div>
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-semibold text-emerald-700 sm:self-auto"><ShieldCheck className="h-3.5 w-3.5" /> Source of Truth</div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className={`w-full text-sm ${isPixelWidth ? "" : minWidth}`} style={isPixelWidth ? { minWidth } : undefined}>{tableChildren}</table>
      </div>
    </AdminCard>
  );
}

export function AdminTableHead({ children }: { children: ReactNode }) { return <thead className="bg-slate-50 text-xs font-semibold text-slate-500">{children}</thead>; }
export const AdminTableHeader = AdminTableHead;
export function AdminTableRow({ children }: { children: ReactNode }) { return <tr className="border-t border-slate-100 transition-colors hover:bg-slate-50/70">{children}</tr>; }
export function AdminLoading({ label = "กำลังโหลดข้อมูล..." }: { label?: string }) { return <div className="p-12 text-center text-sm text-slate-500">{label}</div>; }
export const AdminLoadingState = AdminLoading;
export function AdminEmpty({ label = "ไม่พบข้อมูล" }: { label?: string }) { return <div className="p-12 text-center text-sm text-slate-500">{label}</div>; }
type AdminEmptyStateProps = { title?: string; description?: string; action?: ReactNode };
export function AdminEmptyState({ title = "ไม่พบข้อมูล", description, action }: AdminEmptyStateProps) {
  return <div className="flex min-h-56 flex-col items-center justify-center px-6 py-12 text-center"><p className="text-sm font-semibold text-slate-700">{title}</p>{description && <p className="mt-1 max-w-md text-sm text-slate-500">{description}</p>}{action && <div className="mt-4">{action}</div>}</div>;
}
