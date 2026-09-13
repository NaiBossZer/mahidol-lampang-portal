import { useState, type FormEvent } from "react";
import { Bot, Command, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type AICommandBarProps = {
  onSubmit?: (intent: string) => void;
  placeholder?: string;
  compact?: boolean;
};

export function AICommandBar({ onSubmit, placeholder = "บอก AI ว่าต้องการให้ทำอะไร…", compact = false }: AICommandBarProps) {
  const [value, setValue] = useState("");
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const intent = value.trim();
    if (!intent) return;
    onSubmit?.(intent);
    setValue("");
  };

  return (
    <form onSubmit={submit} className={cn("flex items-center gap-2 rounded-2xl border border-slate-200 bg-white shadow-sm", compact ? "p-1.5" : "p-2")}>
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-navy text-white" aria-hidden="true">
        <Bot className="h-4 w-4" />
      </div>
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="min-w-0 flex-1 bg-transparent px-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
        placeholder={placeholder}
        aria-label="คำสั่ง AI"
      />
      <span className="hidden items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-400 sm:flex">
        <Command className="h-3 w-3" />K
      </span>
      <button type="submit" className="inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-brand-navy px-3 text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-50" disabled={!value.trim()}>
        <Sparkles className="h-3.5 w-3.5" /> สั่ง AI
      </button>
    </form>
  );
}
