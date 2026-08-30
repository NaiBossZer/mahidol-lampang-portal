import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { StorefrontWidget } from "@/components/storefront/StorefrontWidget";

export const Route = createFileRoute("/storefront")({ component: StorefrontRoute });

function StorefrontRoute() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="border-b border-[#002D62] bg-[#002D62] px-4 py-4 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm hover:text-[#F2A900]">
            <ArrowLeft className="h-4 w-4" /> กลับหน้าหลัก
          </Link>
          <span className="flex items-center gap-2 font-semibold">
            <ShoppingBag className="h-5 w-5 text-[#F2A900]" /> Mahidol Farm Fresh Market
          </span>
        </div>
      </div>
      <StorefrontWidget />
    </main>
  );
}
