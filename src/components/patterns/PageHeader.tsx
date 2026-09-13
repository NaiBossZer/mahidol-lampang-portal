import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ eyebrow, title, description, actions, className }: PageHeaderProps) {
  return (
    <header className={cn("border-b border-border bg-white", className)}>
      <div className="container-content flex flex-col gap-5 py-8 sm:py-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-xs font-black uppercase tracking-[0.18em] text-local-terracotta">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-2 text-balance text-3xl font-black leading-tight text-brand-navy sm:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-ink sm:text-base">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
      </div>
    </header>
  );
}
