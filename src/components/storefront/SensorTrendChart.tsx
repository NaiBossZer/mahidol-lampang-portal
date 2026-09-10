import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type SensorTrendPoint = {
  label: string;
  soilMoisturePercent: number;
  humidityPercent: number;
};

type SensorTrendChartProps = {
  data: SensorTrendPoint[];
};

export function SensorTrendChart({ data }: SensorTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="label" tick={{ fontSize: 10 }} />
        <YAxis width={30} tick={{ fontSize: 10 }} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="soilMoisturePercent"
          name="ความชื้นดิน %"
          stroke="#2E7D32"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="humidityPercent"
          name="ความชื้นอากาศ %"
          stroke="#002D62"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
