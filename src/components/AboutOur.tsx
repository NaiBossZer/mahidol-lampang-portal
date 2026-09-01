import { ArrowUpRight } from "lucide-react";

export type KnowledgeItem = {
  type: string;
  title: string;
  meta: string;
  color: string;
};

interface KnowledgeSectionProps {
  items: KnowledgeItem[];
}

export default function AboutOur({ items }: KnowledgeSectionProps) {
  return (
    <section id="learning" className="bg-slate-100/80 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <h2 className="text-xl font-bold text-[#002D62] sm:text-2xl">องค์ความรู้และงานวิจัย</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {items.map((k, i) => (
            <div key={i} className="flex flex-col justify-between rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
              <div className="space-y-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${k.color}`}>{k.type}</span>
                <h3 className="text-sm font-bold text-[#002D62] leading-snug">{k.title}</h3>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>{k.meta}</span>
                <ArrowUpRight size={14} className="text-slate-600" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}