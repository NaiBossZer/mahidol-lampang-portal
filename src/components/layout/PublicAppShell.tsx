import type { ReactNode } from "react";
import { PublicFooter } from "./PublicFooter";
import { PublicHeader } from "./PublicHeader";

export function PublicAppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-warm text-ink">
      <PublicHeader />
      <main id="main-content" className="min-w-0">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
