import { useMemo } from "react";
import { Bot, CheckCircle2, Clock3, History, ListTodo, ShieldCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { AICommandCenterPage } from "./AICommandCenterPage";
import { AIWorkQueuePage } from "./AIWorkQueuePage";
import { AIExecutionPage } from "./AIExecutionPage";
import { AIApprovalPage } from "./AIApprovalPage";
import { AIHistoryPage } from "./AIHistoryPage";

const TABS = [
  { id: "command", label: "Command", description: "สั่งงานและวางแผน", icon: Bot },
  { id: "queue", label: "Queue", description: "คิวงานที่กำลังดำเนินการ", icon: ListTodo },
  { id: "execution", label: "Execution", description: "แผนและผลการทำงาน", icon: Clock3 },
  { id: "approval", label: "Approval", description: "งานที่ต้องตัดสินใจ", icon: ShieldCheck },
  { id: "history", label: "History", description: "ประวัติการทำงาน", icon: History },
] as const;

type TabId = (typeof TABS)[number]["id"];

function resolveTab(value: string | null): TabId {
  return TABS.some((tab) => tab.id === value) ? (value as TabId) : "command";
}

export function AIWorkspacePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = resolveTab(new URLSearchParams(location.search).get("tab"));

  const activeMeta = useMemo(() => TABS.find((tab) => tab.id === activeTab) ?? TABS[0], [activeTab]);

  function setTab(tab: TabId) {
    navigate(tab === "command" ? "/admin/ai" : `/admin/ai?tab=${tab}`);
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f8f9ff]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1400px] px-4 pt-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.14em] text-emerald-700">
                <Bot className="h-3.5 w-3.5" />
                AI WORKSPACE
              </div>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#002d62] sm:text-[30px]">
                ศูนย์ทำงาน AI
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-slate-600">
                รวม Command, Queue, Execution, Approval และ History ไว้ใน Workspace เดียว
                โดยยังคงระบบ Governance, RBAC และ Audit เดิม
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border bg-slate-50 px-3 py-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-700" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Current view</p>
                <p className="text-xs font-semibold text-slate-700">{activeMeta.label} · {activeMeta.description}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <div className="flex min-w-max gap-2 pb-3" role="tablist" aria-label="AI Workspace">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const active = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setTab(tab.id)}
                    className={
                      active
                        ? "inline-flex items-center gap-2 rounded-xl bg-[#002d62] px-4 py-2.5 text-sm font-bold text-white shadow-sm"
                        : "inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:border-[#002d62]/30 hover:text-[#002d62]"
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <div className="[&>section]:min-h-0">
        {activeTab === "command" && <AICommandCenterPage />}
        {activeTab === "queue" && <AIWorkQueuePage />}
        {activeTab === "execution" && <AIExecutionPage />}
        {activeTab === "approval" && <AIApprovalPage />}
        {activeTab === "history" && <AIHistoryPage />}
      </div>
    </div>
  );
}
