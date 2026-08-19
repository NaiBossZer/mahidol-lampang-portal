import { Check, Filter, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { shortLabel } from "@/lib/analysis";

export type FilterState = {
  values: Record<number, string[]>;
  from: string;
  to: string;
};

export function FilterBar({
  options,
  state,
  onChange,
  hasTimestamp,
  active,
}: {
  options: { index: number; header: string; values: string[] }[];
  state: FilterState;
  onChange: (next: FilterState) => void;
  hasTimestamp: boolean;
  active: number;
}) {
  const toggle = (index: number, value: string) => {
    const current = state.values[index] ?? [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...state, values: { ...state.values, [index]: next } });
  };

  return (
    <div className="no-print flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1 text-[10px] tracking-widest text-gold">
        <Filter className="size-3" /> FILTER
      </span>
      {options.map((opt) => {
        const selected = state.values[opt.index] ?? [];
        return (
          <Popover key={opt.index}>
            <PopoverTrigger className="flex items-center gap-1 rounded border border-border bg-panel/70 px-2 py-1 text-[11px] hover:border-gold/70">
              {shortLabel(opt.header, 22)}
              {selected.length ? (
                <span className="rounded bg-gold-soft px-1 text-[10px] text-gold">
                  {selected.length}
                </span>
              ) : null}
            </PopoverTrigger>
            <PopoverContent className="max-h-72 w-72 overflow-auto p-1" align="start">
              {opt.values.map((v) => {
                const on = selected.includes(v);
                return (
                  <button
                    key={v}
                    onClick={() => toggle(opt.index, v)}
                    className="flex w-full items-start gap-2 rounded px-2 py-1.5 text-left text-[11px] hover:bg-secondary"
                  >
                    <span
                      className={`mt-0.5 flex size-3.5 shrink-0 items-center justify-center rounded-sm border ${
                        on ? "border-gold bg-gold-soft" : "border-border"
                      }`}
                    >
                      {on ? <Check className="size-3 text-gold" /> : null}
                    </span>
                    <span className="flex-1">{v}</span>
                  </button>
                );
              })}
            </PopoverContent>
          </Popover>
        );
      })}
      {hasTimestamp ? (
        <div className="flex items-center gap-1 text-[11px]">
          <input
            type="date"
            value={state.from}
            onChange={(e) => onChange({ ...state, from: e.target.value })}
            className="rounded border border-border bg-panel/70 px-1.5 py-1 text-[11px]"
          />
          <span className="text-muted-foreground">–</span>
          <input
            type="date"
            value={state.to}
            onChange={(e) => onChange({ ...state, to: e.target.value })}
            className="rounded border border-border bg-panel/70 px-1.5 py-1 text-[11px]"
          />
        </div>
      ) : null}
      {active > 0 ? (
        <button
          onClick={() => onChange({ values: {}, from: "", to: "" })}
          className="flex items-center gap-1 rounded border border-border px-2 py-1 text-[11px] text-muted-foreground hover:text-gold"
        >
          <X className="size-3" /> ล้างตัวกรอง
        </button>
      ) : null}
    </div>
  );
}
