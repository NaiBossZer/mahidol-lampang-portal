import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { monthlyReportData } from '../data/mockData';

function fmt(n: number) { return n.toLocaleString('th-TH'); }

const chartData = monthlyReportData.map(d => ({
  month: d.month.replace(' 67', '').replace(' 66', ''),
  sobprab: d.sobprab_thb,
  palad: d.palad_thb,
  sobprab_kwh: d.sobprab_kwh,
  palad_kwh: d.palad_kwh,
  solar_kwh: d.solar_kwh,
  solar_ratio: d.solar_ratio,
}));

const lastD = monthlyReportData[monthlyReportData.length - 1];
const peaTotal = lastD.sobprab_kwh + lastD.palad_kwh;
const mixData = [
  { name: 'PEA กฟภ.', value: peaTotal, color: '#1A3A6B' },
  { name: 'Solar', value: lastD.solar_kwh, color: '#16A34A' },
];

const TOOLTIP_STYLE = {
  background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8,
  boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontSize: 12, fontFamily: 'Inter, sans-serif',
};

export function ExecutiveDashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* KPI summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'ค่าไฟฟ้ารวม', value: `฿${fmt(lastD.sobprab_thb + lastD.palad_thb)}`, sub: 'กันยายน 2567', color: '#1A3A6B' },
          { label: 'หน่วยไฟฟ้ารวม (PEA)', value: `${fmt(peaTotal)} kWh`, sub: 'สบปราบ + ผาลาด', color: '#2563EB' },
          { label: 'Solar Yield', value: `${fmt(lastD.solar_kwh)} kWh`, sub: 'Solar Cell สบปราบ', color: '#16A34A' },
          { label: 'Solar Contribution', value: `${lastD.solar_ratio.toFixed(1)}%`, sub: 'of total energy', color: '#EA580C' },
        ].map(k => (
          <div key={k.label} style={{ padding: '18px 20px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: k.color, letterSpacing: '-0.02em' }}>{k.value}</div>
            <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
        {/* Line chart — electricity cost */}
        <div style={{ padding: '20px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>ค่าไฟฟ้า รวม 2 พื้นที่ (บาท/เดือน)</div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 16 }}>ปีงบประมาณ 2567</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `฿${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: unknown) => [`฿${fmt(Number(v))}`, '']} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="sobprab" name="สบปราบ" stroke="#1A3A6B" strokeWidth={2} dot={{ r: 3, fill: '#1A3A6B' }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="palad" name="ผาลาด" stroke="#7C3AED" strokeWidth={2} dot={{ r: 3, fill: '#7C3AED' }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Donut — energy mix */}
        <div style={{ padding: '20px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Energy Mix</div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 8 }}>PEA vs Solar — ก.ย. 2567</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={mixData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={2} dataKey="value">
                {mixData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: unknown) => [`${fmt(Number(v))} kWh`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
            {mixData.map(m => (
              <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: m.color }} />
                <span style={{ color: '#64748B' }}>{m.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* Bar — kWh by month */}
        <div style={{ padding: '20px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>หน่วยไฟฟ้ารวม (kWh/เดือน)</div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 16 }}>สบปราบ + ผาลาด</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: unknown) => [`${fmt(Number(v))} kWh`, '']} />
              <Bar dataKey="sobprab_kwh" name="สบปราบ" fill="#1A3A6B" radius={[3, 3, 0, 0]} />
              <Bar dataKey="palad_kwh" name="ผาลาด" fill="#7C3AED" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line — Solar contribution */}
        <div style={{ padding: '20px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Solar Contribution Trend (%)</div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 16 }}>สัดส่วน Solar ต่อพลังงานรวม</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} domain={[0, 30]} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: unknown) => [`${Number(v).toFixed(1)}%`, 'Solar Ratio']} />
              <Line type="monotone" dataKey="solar_ratio" name="Solar Ratio" stroke="#16A34A" strokeWidth={2.5} dot={{ r: 3, fill: '#16A34A' }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
