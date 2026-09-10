import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({ eyebrow, title, description, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="min-w-0">
        {eyebrow && <p className="text-xs font-black uppercase tracking-[0.18em] text-local-terracotta">{eyebrow}</p>}
        <h2 className="mt-1 text-2xl font-black leading-tight text-brand-navy sm:text-3xl">{title}</h2>
        {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-ink">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
