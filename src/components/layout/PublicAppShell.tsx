import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { HomePartners } from "../home/HomePartners";
import { PublicFooter } from "./PublicFooter";
import { PublicHeader } from "./PublicHeader";

export function PublicAppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="min-h-screen bg-surface-warm text-ink">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-navy focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-white">
        ข้ามไปยังเนื้อหาหลัก
      </a>
      <PublicHeader />
      <main id="main-content" className="min-w-0">
        {children}
        {isHomePage && <HomePartners />}
      </main>
      <PublicFooter />
    </div>
  );
}
