import type { ReactNode } from "react";

export const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
  "var(--color-chart-6)",
];

export function Panel({
  title,
  hint,
  children,
  className = "",
  action,
}: {
  title: string;
  hint?: string | undefined;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <section className={`panel flex flex-col ${className}`}>
      <header className="mb-2 flex items-start justify-between gap-2">
        <div>
          <h2 className="panel-title">{title}</h2>
          {hint ? <p className="mt-0.5 text-[10px] text-muted-foreground">{hint}</p> : null}
        </div>
        {action}
      </header>
      <div className="hairline mb-3" />
      <div className="min-h-0 flex-1">{children}</div>
    </section>
  );
}

export function Kpi({
  label,
  value,
  unit,
  sub,
  color = "var(--color-foreground)",
  size = "lg",
}: {
  label: string;
  value: string;
  unit?: string;
  sub?: string;
  color?: string;
  size?: "lg" | "md";
}) {
  return (
    <div className="panel flex flex-col justify-between gap-1">
      <span className="panel-title text-[10px]">{label}</span>
      <div className="flex items-end gap-1">
        <span
          className={`num-xl ${size === "lg" ? "text-4xl" : "text-3xl"}`}
          style={{ color }}
        >
          {value}
        </span>
        {unit ? <span className="pb-1 text-xs text-muted-foreground">{unit}</span> : null}
      </div>
      <span className="text-[11px] leading-tight text-muted-foreground">{sub ?? ""}</span>
    </div>
  );
}

export function Empty({ label = "ไม่สามารถวิเคราะห์ในประเด็นนี้ได้ เนื่องจากข้อมูลไม่เพียงพอ" }) {
  return (
    <div className="flex h-full min-h-24 items-center justify-center rounded border border-dashed border-border/60 p-4 text-center text-[11px] text-muted-foreground">
      {label}
    </div>
  );
}

export function Gauge({ value, label }: { value: number; label: string }) {
  const clamped = Math.max(0, Math.min(100, value));
  const angle = -90 + (clamped / 100) * 180;
  const color =
    clamped >= 90
      ? "var(--color-good)"
      : clamped >= 80
        ? "var(--color-gold)"
        : clamped >= 70
          ? "var(--color-chart-4)"
          : "var(--color-bad)";
  const r = 78;
  const arc = (from: number, to: number) => {
    const pt = (deg: number) => {
      const rad = ((deg - 90) * Math.PI) / 180;
      return [100 + r * Math.cos(rad), 100 + r * Math.sin(rad)];
    };
    const [x1, y1] = pt(from);
    const [x2, y2] = pt(to);
    return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
  };

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 120" className="w-full max-w-[240px]">
        <path d={arc(0, 180)} fill="none" stroke="var(--color-border)" strokeWidth="12" />
        <path
          d={arc(0, (clamped / 100) * 180)}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
        />
        <line
          x1="100"
          y1="100"
          x2={100 + 60 * Math.cos((angle * Math.PI) / 180)}
          y2={100 + 60 * Math.sin((angle * Math.PI) / 180)}
          stroke="var(--color-gold)"
          strokeWidth="3"
        />
        <circle cx="100" cy="100" r="5" fill="var(--color-gold)" />
      </svg>
      <div className="-mt-2 text-center">
        <div className="num-xl text-4xl" style={{ color }}>
          {clamped.toFixed(1)}
        </div>
        <div className="mt-1 text-xs font-semibold tracking-wide" style={{ color }}>
          {label}
        </div>
      </div>
    </div>
  );
}

export function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-widest">
      <span
        className="size-2 rounded-full"
        style={{
          background: ok ? "var(--color-good)" : "var(--color-bad)",
          boxShadow: `0 0 8px ${ok ? "var(--color-good)" : "var(--color-bad)"}`,
        }}
      />
      {ok ? "LIVE / CONNECTED" : "DISCONNECTED"}
    </span>
  );
}
