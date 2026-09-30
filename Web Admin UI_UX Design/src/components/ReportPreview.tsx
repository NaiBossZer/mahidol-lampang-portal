import { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { monthlyReportData } from '../data/mockData';

const TOOLTIP_STYLE = {
  background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8,
  boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontSize: 12, fontFamily: 'Inter, sans-serif',
};

function fmt(n: number) { return n.toLocaleString('th-TH'); }

const chartData = monthlyReportData.map(d => ({
  month: d.month.replace(' 67', '').replace(' 66', ''),
  cost_total: d.sobprab_thb + d.palad_thb,
  sobprab: d.sobprab_thb,
  palad: d.palad_thb,
  sobprab_kwh: d.sobprab_kwh,
  palad_kwh: d.palad_kwh,
  solar_kwh: d.solar_kwh,
  pea_pct: parseFloat((100 - d.solar_ratio).toFixed(1)),
  solar_pct: parseFloat(d.solar_ratio.toFixed(1)),
}));

const pages = ['หน้า 1: ค่าไฟฟ้า 2 พื้นที่', 'หน้า 2: สถิติหน่วยไฟฟ้า', 'หน้า 3: สัดส่วนพลังงาน'];

export function ReportPreview() {
  const [page, setPage] = useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Page tabs */}
      <div style={{ display: 'flex', gap: 8 }}>
        {pages.map((p, i) => (
          <button key={i} onClick={() => setPage(i)} style={{
            padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: page === i ? 600 : 400,
            border: page === i ? '1.5px solid #1A3A6B' : '1px solid #E2E8F0',
            background: page === i ? '#1A3A6B' : '#FFFFFF',
            color: page === i ? '#FFFFFF' : '#64748B',
            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s ease',
          }}>{p}</button>
        ))}
      </div>

      {/* Report page wrapper */}
      <div style={{
        background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12,
        boxShadow: '0 2px 16px rgba(0,0,0,0.08)', overflow: 'hidden',
      }}>
        {/* Report header */}
        <div style={{ background: '#0C2340', padding: '18px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Mahidol University / Mahidol Lampang</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF', marginTop: 3 }}>รายงานการใช้ไฟฟ้าและพลังงานหมุนเวียน</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>ปีงบประมาณ 2567</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>EE Report — Auto-generated</div>
          </div>
        </div>

        <div style={{ padding: '28px' }}>
          {page === 0 && <Page1 />}
          {page === 1 && <Page2 />}
          {page === 2 && <Page3 />}
        </div>

        {/* Report footer */}
        <div style={{ borderTop: '1px solid #F1F5F9', padding: '12px 28px', background: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 11, color: '#94A3B8' }}>ข้อมูลจาก: เอกสาร Source of Truth ผ่าน AI Agent EE-Agent v2.4.1</div>
          <div style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'JetBrains Mono, monospace' }}>หน้า {page + 1} / {pages.length}</div>
        </div>
      </div>
    </div>
  );
}

function Page1() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#0C2340', marginBottom: 4 }}>ค่าไฟฟ้า รวม 2 พื้นที่</div>
        <div style={{ fontSize: 13, color: '#64748B' }}>สบปราบ และ ผาลาด — ปีงบประมาณ 2567</div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={chartData} margin={{ top: 4, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `฿${(v/1000).toFixed(0)}k`} />
          <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: unknown) => [`฿${fmt(Number(v))}`, '']} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="sobprab" name="สบปราบ" stroke="#1A3A6B" strokeWidth={2.5} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="palad" name="ผาลาด" stroke="#7C3AED" strokeWidth={2.5} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
      <table className="data-table" style={{ fontSize: 13 }}>
        <thead><tr><th>เดือน</th><th>สบปราบ (฿)</th><th>ผาลาด (฿)</th><th>รวม (฿)</th></tr></thead>
        <tbody>
          {monthlyReportData.map(d => (
            <tr key={d.month}>
              <td>{d.month}</td>
              <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>฿{fmt(d.sobprab_thb)}</td>
              <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>฿{fmt(d.palad_thb)}</td>
              <td style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>฿{fmt(d.sobprab_thb + d.palad_thb)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Page2() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#0C2340', marginBottom: 4 }}>สถิติหน่วยไฟฟ้ารวม</div>
        <div style={{ fontSize: 13, color: '#64748B' }}>ผาลาด และ สบปราบ — ปีงบประมาณ 2567</div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={chartData} margin={{ top: 4, right: 20, left: 0, bottom: 0 }} barSize={16}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
          <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: unknown) => [`${fmt(Number(v))} kWh`, '']} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="sobprab_kwh" name="สบปราบ" fill="#1A3A6B" radius={[3, 3, 0, 0]} />
          <Bar dataKey="palad_kwh" name="ผาลาด" fill="#7C3AED" radius={[3, 3, 0, 0]} />
          <Bar dataKey="solar_kwh" name="Solar" fill="#16A34A" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <table className="data-table" style={{ fontSize: 13 }}>
        <thead><tr><th>เดือน</th><th>สบปราบ (kWh)</th><th>ผาลาด (kWh)</th><th>Solar (kWh)</th><th>รวม (kWh)</th></tr></thead>
        <tbody>
          {monthlyReportData.map(d => (
            <tr key={d.month}>
              <td>{d.month}</td>
              <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>{fmt(d.sobprab_kwh)}</td>
              <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>{fmt(d.palad_kwh)}</td>
              <td style={{ fontFamily: 'JetBrains Mono, monospace', color: '#16A34A' }}>{fmt(d.solar_kwh)}</td>
              <td style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>{fmt(d.sobprab_kwh + d.palad_kwh + d.solar_kwh)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Page3() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#0C2340', marginBottom: 4 }}>สัดส่วนการใช้พลังงานไฟฟ้า</div>
        <div style={{ fontSize: 13, color: '#64748B' }}>งานพันธกิจเพื่อสังคม อ.สบปราบ จ.ลำปาง — ปีงบประมาณ 2567</div>
      </div>
      <table className="data-table" style={{ fontSize: 12.5 }}>
        <thead>
          <tr>
            <th>เดือน</th>
            <th>PEA (kWh)</th>
            <th>Solar (kWh)</th>
            <th>รวม (kWh)</th>
            <th>PEA %</th>
            <th>Solar %</th>
          </tr>
        </thead>
        <tbody>
          {monthlyReportData.map(d => {
            const total = d.sobprab_kwh + d.palad_kwh + d.solar_kwh;
            const peaPct = (100 - d.solar_ratio).toFixed(1);
            return (
              <tr key={d.month}>
                <td>{d.month}</td>
                <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>{fmt(d.sobprab_kwh + d.palad_kwh)}</td>
                <td style={{ fontFamily: 'JetBrains Mono, monospace', color: '#16A34A', fontWeight: 600 }}>{fmt(d.solar_kwh)}</td>
                <td style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>{fmt(total)}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 40, height: 6, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${peaPct}%`, background: '#1A3A6B', borderRadius: 3 }} />
                    </div>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{peaPct}%</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 40, height: 6, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${d.solar_ratio}%`, background: '#16A34A', borderRadius: 3 }} />
                    </div>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#16A34A', fontWeight: 600 }}>{d.solar_ratio.toFixed(1)}%</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
