import { useState } from "react";
import PublicPortal from "./components/PublicPortal";
import AdminPortal from "./components/AdminPortal";

export default function App() {
  const [view, setView] = useState<"public" | "admin">("public");

  return (
    <div className="min-h-full">
      {/* Dev switcher */}
      <div className="fixed bottom-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => setView("public")}
          className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
            view === "public"
              ? "bg-[#123B63] text-white"
              : "bg-white text-[#123B63] border border-[#123B63]/30 hover:border-[#123B63]"
          }`}
        >
          Public
        </button>
        <button
          onClick={() => setView("admin")}
          className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
            view === "admin"
              ? "bg-[#123B63] text-white"
              : "bg-white text-[#123B63] border border-[#123B63]/30 hover:border-[#123B63]"
          }`}
        >
          Admin
        </button>
      </div>
      {view === "public" ? <PublicPortal /> : <AdminPortal />}
    </div>
  );
}
