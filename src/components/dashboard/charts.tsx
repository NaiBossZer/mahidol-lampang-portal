import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  ComposedChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { CHART_COLORS, Empty } from "./primitives";
import { shortLabel } from "@/lib/analysis";

const axis = {
  stroke: "var(--color-muted-foreground)",
  fontSize: 10,
  tickLine: false,
};

const tooltipStyle = {
  contentStyle: {
    background: "oklch(0.2 0.05 262)",
    border: "1px solid var(--color-panel-line)",
    borderRadius: 6,
    fontSize: 11,
    color: "var(--color-foreground)",
  },
  labelStyle: { color: "var(--color-gold)", fontSize: 11 },
};

export function DonutChart({
  data,
  height = 200,
}: {
  data: { label: string; count: number }[];
  height?: number;
}) {
  if (!data.length) return <Empty />;
  const top = data.slice(0, 8);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={top}
          dataKey="count"
          nameKey="label"
          innerRadius="52%"
          outerRadius="80%"
          paddingAngle={2}
          stroke="transparent"
        >
          {top.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip {...tooltipStyle} />
        <Legend
          wrapperStyle={{ fontSize: 10, color: "var(--color-muted-foreground)" }}
          formatter={(v) => shortLabel(String(v), 22)}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function VBarChart({
  data,
  height = 200,
  color = "var(--color-chart-1)",
}: {
  data: { label: string; count: number }[];
  height?: number;
  color?: string;
}) {
  if (!data.length) return <Empty />;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data.slice(0, 10)} margin={{ top: 4, right: 8, bottom: 4, left: -18 }}>
        <CartesianGrid stroke="var(--color-border)" vertical={false} />
        <XAxis
          dataKey="label"
          {...axis}
          interval={0}
          tickFormatter={(v) => shortLabel(String(v), 12)}
        />
        <YAxis {...axis} />
        <Tooltip {...tooltipStyle} />
        <Bar dataKey="count" radius={[3, 3, 0, 0]} fill={color} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function RatingBars({
  data,
  height,
}: {
  data: { label: string; mean: number; sd: number; scaleMax: number }[];
  height?: number;
}) {
  if (!data.length) return <Empty />;
  const h = height ?? Math.max(140, data.length * 26 + 20);
  const rows = data.map((d) => ({ ...d, norm: (d.mean / d.scaleMax) * 5 }));
  return (
    <ResponsiveContainer width="100%" height={h}>
      <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 34, bottom: 0, left: 4 }}>
        <CartesianGrid stroke="var(--color-border)" horizontal={false} />
        <XAxis type="number" domain={[0, 5]} {...axis} />
        <YAxis
          type="category"
          dataKey="label"
          width={175}
          {...axis}
          tickFormatter={(v) => shortLabel(String(v), 30)}
        />
        <Tooltip
          {...tooltipStyle}
          formatter={(value, _n, item) => {
            const p = item?.payload as { sd: number } | undefined;
            return [`${Number(value).toFixed(2)} (SD ${p?.sd?.toFixed(2) ?? "-"})`, "ค่าเฉลี่ย"];
          }}
        />
        <Bar dataKey="norm" radius={[0, 3, 3, 0]} barSize={12}>
          {rows.map((r, i) => (
            <Cell
              key={i}
              fill={
                r.norm >= 4.5
                  ? "var(--color-good)"
                  : r.norm >= 4
                    ? "var(--color-gold)"
                    : "var(--color-bad)"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function RadarPanel({
  data,
  height = 230,
}: {
  data: { label: string; value: number }[];
  height?: number;
}) {
  if (data.length < 3) return <Empty />;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data.map((d) => ({ ...d, label: shortLabel(d.label, 16) }))}>
        <PolarGrid stroke="var(--color-border)" />
        <PolarAngleAxis dataKey="label" tick={{ fill: "var(--color-muted-foreground)", fontSize: 9 }} />
        <PolarRadiusAxis domain={[0, 100]} tick={{ fill: "var(--color-muted-foreground)", fontSize: 8 }} />
        <Radar
          dataKey="value"
          stroke="var(--color-gold)"
          fill="var(--color-gold)"
          fillOpacity={0.28}
        />
        <Tooltip {...tooltipStyle} formatter={(v) => [`${Number(v).toFixed(1)}%`, "คะแนน"]} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function StackedRatingBars({
  data,
  height,
}: {
  data: { label: string; buckets: Record<string, number> }[];
  height?: number;
}) {
  if (!data.length) return <Empty />;
  const keys = Array.from(
    new Set(data.flatMap((d) => Object.keys(d.buckets))),
  ).sort((a, b) => Number(a) - Number(b));
  const rows = data.map((d) => ({ label: shortLabel(d.label, 28), ...d.buckets }));
  const h = height ?? Math.max(150, data.length * 30 + 30);
  return (
    <ResponsiveContainer width="100%" height={h}>
      <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 4 }}>
        <XAxis type="number" {...axis} />
        <YAxis type="category" dataKey="label" width={165} {...axis} />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 10 }} />
        {keys.map((k, i) => (
          <Bar
            key={k}
            dataKey={k}
            stackId="a"
            name={`ระดับ ${k}`}
            fill={CHART_COLORS[i % CHART_COLORS.length]}
            barSize={14}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TrendChart({
  data,
  height = 190,
}: {
  data: { date: string; count: number; mean: number | null }[];
  height?: number;
}) {
  if (!data.length) return <Empty />;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 6, right: 6, bottom: 0, left: -20 }}>
        <CartesianGrid stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="date" {...axis} />
        <YAxis yAxisId="l" {...axis} />
        <YAxis yAxisId="r" orientation="right" domain={[0, 5]} {...axis} />
        <Tooltip {...tooltipStyle} />
        <Bar yAxisId="l" dataKey="count" name="จำนวนผู้ตอบ" fill="var(--color-chart-1)" radius={[3, 3, 0, 0]} />
        <Line
          yAxisId="r"
          type="monotone"
          dataKey="mean"
          name="ค่าเฉลี่ยความพึงพอใจ"
          stroke="var(--color-gold)"
          strokeWidth={2}
          dot={{ r: 3 }}
          connectNulls
        />
        <Legend wrapperStyle={{ fontSize: 10 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export function MatrixChart({
  data,
  height = 260,
}: {
  data: { label: string; satisfaction: number; importance: number; quadrant: string }[];
  height?: number;
}) {
  if (!data.length) return <Empty />;
  const colorOf = (q: string) =>
    q === "KEEP"
      ? "var(--color-good)"
      : q === "PROMOTE"
        ? "var(--color-chart-4)"
        : q === "PRIORITY"
          ? "var(--color-bad)"
          : "var(--color-gold)";
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 10, right: 12, bottom: 4, left: -12 }}>
        <CartesianGrid stroke="var(--color-border)" />
        <XAxis
          type="number"
          dataKey="satisfaction"
          name="ความพึงพอใจ (%)"
          domain={["dataMin - 3", "dataMax + 3"]}
          {...axis}
        />
        <YAxis
          type="number"
          dataKey="importance"
          name="ความสำคัญ (%)"
          domain={[0, 100]}
          {...axis}
        />
        <ZAxis range={[70, 70]} />
        <Tooltip
          {...tooltipStyle}
          formatter={(value, name) => [`${Number(value).toFixed(1)}%`, String(name)]}
          labelFormatter={() => ""}
          content={({ payload }) => {
            const p = payload?.[0]?.payload as
              | { label: string; satisfaction: number; importance: number; quadrant: string }
              | undefined;
            if (!p) return null;
            return (
              <div className="rounded border border-border bg-popover p-2 text-[11px]">
                <div className="font-semibold text-gold">{p.quadrant}</div>
                <div className="max-w-56">{shortLabel(p.label, 60)}</div>
                <div className="text-muted-foreground">
                  พึงพอใจ {p.satisfaction.toFixed(1)}% · สำคัญ {p.importance.toFixed(1)}%
                </div>
              </div>
            );
          }}
        />
        <Scatter data={data}>
          {data.map((d, i) => (
            <Cell key={i} fill={colorOf(d.quadrant)} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}

export function WordCloud({ words }: { words: { word: string; count: number }[] }) {
  if (!words.length) return <Empty />;
  const max = words[0]?.count ?? 1;
  const min = words[words.length - 1]?.count ?? 1;
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      {words.slice(0, 34).map((w, i) => {
        const t = max === min ? 1 : (w.count - min) / (max - min);
        return (
          <span
            key={w.word}
            style={{
              fontSize: `${0.7 + t * 1.2}rem`,
              color: CHART_COLORS[i % CHART_COLORS.length],
              opacity: 0.6 + t * 0.4,
              fontWeight: t > 0.5 ? 700 : 500,
            }}
            title={`${w.count} ครั้ง`}
          >
            {w.word}
          </span>
        );
      })}
    </div>
  );
}

const CHANNEL_RULES: { key: string; re: RegExp; color: string }[] = [
  { key: "Facebook", re: /facebook|fb|เฟส|เพจ/i, color: "var(--color-chart-1)" },
  { key: "LINE", re: /\bline\b|ไลน์|ไลน|line\s*oa/i, color: "var(--color-good)" },
  { key: "Website", re: /website|web\b|เว็บ|www|เว็บไซต์/i, color: "var(--color-chart-2)" },
  { key: "Email", re: /e-?mail|อีเมล|จดหมาย|หนังสือเชิญ|หนังสือ/i, color: "var(--color-chart-3)" },
  { key: "Instagram / TikTok / X", re: /instagram|\big\b|tiktok|twitter|\bx\b/i, color: "var(--color-chart-4)" },
  { key: "YouTube", re: /youtube|ยูทู/i, color: "var(--color-chart-5)" },
  { key: "เพื่อน / คนรู้จัก", re: /เพื่อน|คนรู้จัก|บอกต่อ|ปากต่อปาก|อาจารย์|รุ่นพี่/i, color: "var(--color-chart-6)" },
  { key: "หน่วยงาน / ต้นสังกัด", re: /หน่วยงาน|ต้นสังกัด|คณะ|ผู้บังคับบัญชา|ประกาศ/i, color: "var(--color-gold)" },
  { key: "โปสเตอร์ / ป้าย", re: /โปสเตอร์|ป้าย|แผ่นพับ|ไวนิล|poster/i, color: "var(--color-chart-2)" },
];

export function ChannelBreakdown({
  items,
  total,
}: {
  items: { label: string; count: number; percent: number }[];
  total: number;
}) {
  if (!items.length) return <Empty />;

  const grouped = new Map<string, { count: number; color: string }>();
  items.forEach((it) => {
    const rule = CHANNEL_RULES.find((r) => r.re.test(it.label));
    const key = rule ? rule.key : it.label.replace(/^อื่น.*$/i, "อื่น ๆ").trim() || "อื่น ๆ";
    const color = rule ? rule.color : "var(--color-muted-foreground)";
    const prev = grouped.get(key);
    grouped.set(key, { count: (prev?.count ?? 0) + it.count, color: prev?.color ?? color });
  });

  const sum = total || Array.from(grouped.values()).reduce((a, b) => a + b.count, 0);
  const rows = Array.from(grouped.entries())
    .map(([label, v]) => ({ label, ...v, percent: sum ? (v.count / sum) * 100 : 0 }))
    .sort((a, b) => b.count - a.count);
  const max = rows[0]?.count ?? 1;

  return (
    <div className="space-y-2.5">
      {rows.map((r) => (
        <div key={r.label}>
          <div className="mb-1 flex items-baseline justify-between gap-2 text-[11px]">
            <span className="truncate font-medium">{r.label}</span>
            <span className="shrink-0 text-muted-foreground">
              <span className="num-xl text-[12px]" style={{ color: r.color }}>
                {r.count}
              </span>{" "}
              · {r.percent.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-border/50">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.max(2, (r.count / max) * 100)}%`,
                background: `linear-gradient(90deg, ${r.color}, ${r.color}99)`,
                boxShadow: `0 0 8px ${r.color}55`,
              }}
            />
          </div>
        </div>
      ))}
      <p className="pt-1 text-[10px] text-muted-foreground">
        รวมการเลือกช่องทางทั้งหมด {sum} ครั้ง (ตอบได้มากกว่า 1 ช่องทาง)
      </p>
    </div>
  );
}
