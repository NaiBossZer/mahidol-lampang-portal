import { useState } from 'react';
import { monthlyReportData, dataProvenance } from '../data/mockData';

const months = monthlyReportData.map(d => d.month);

function fmt(n: number) { return n.toLocaleString('th-TH'); }
function fmtDec(n: number, d = 1) { return n.toFixed(d); }

export function MonthlyReport() {
  const [monthIdx, setMonthIdx] = useState(monthlyReportData.length - 1);
  const [showProvenance, setShowProvenance] = useState(false);
  const d = monthlyReportData[monthIdx];

  const peaTotal_kwh = d.sobprab_kwh + d.palad_kwh;
  const peaTotal_thb = d.sobprab_thb + d.palad_thb;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Month selector */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10,
      }}>
        <button onClick={() => setMonthIdx(i => Math.max(0, i - 1))} disabled={monthIdx === 0}
          style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid #E2E8F0', background: '#FFFFFF', cursor: monthIdx === 0 ? 'not-allowed' : 'pointer', color: '#475569', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#0F172A' }}>{months[monthIdx]}</div>
          <div style={{ fontSize: 12, color: '#64748B' }}>ปีงบประมาณ 2567</div>
        </div>
        <button onClick={() => setMonthIdx(i => Math.min(months.length - 1, i + 1))} disabled={monthIdx === months.length - 1}
          style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid #E2E8F0', background: '#FFFFFF', cursor: monthIdx === months.length - 1 ? 'not-allowed' : 'pointer', color: '#475569', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
        <div style={{ height: 28, width: 1, background: '#E2E8F0', margin: '0 4px' }} />
        <button onClick={() => setShowProvenance(v => !v)} style={{
          padding: '6px 12px', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          border: showProvenance ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
          background: showProvenance ? '#EFF6FF' : '#FFFFFF',
          color: showProvenance ? '#2563EB' : '#64748B',
        }}>
          {showProvenance ? '✓ ' : ''}Data Provenance
        </button>
      </div>

      {/* Data grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {/* Sobprab */}
        <div style={{ padding: '18px 20px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#2563EB', marginBottom: 12 }}>กฟภ. สบปราบ</div>
          <Metric label="หน่วยไฟฟ้า" value={fmt(d.sobprab_kwh)} unit="kWh" />
          <Metric label="ค่าไฟฟ้า" value={`฿${fmt(d.sobprab_thb)}`} unit="บาท" muted />
        </div>
        {/* Palad */}
        <div style={{ padding: '18px 20px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#7C3AED', marginBottom: 12 }}>กฟภ. ผาลาด</div>
          <Metric label="หน่วยไฟฟ้า" value={fmt(d.palad_kwh)} unit="kWh" />
          <Metric label="ค่าไฟฟ้า" value={`฿${fmt(d.palad_thb)}`} unit="บาท" muted />
        </div>
        {/* Solar */}
        <div style={{ padding: '18px 20px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#16A34A', marginBottom: 12 }}>Solar Energy</div>
          <Metric label="Solar Yield" value={fmt(d.solar_kwh)} unit="kWh" />
          <Metric label="สัดส่วน Solar" value={`${fmtDec(d.solar_ratio)}%`} unit="of total" muted />
        </div>
      </div>

      {/* PEA Total + Environment */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ padding: '18px 20px', background: 'linear-gradient(135deg, #0C2340 0%, #1A3A6B 100%)', border: 'none', borderRadius: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>กฟภ. รวม 2 พื้นที่</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}>฿{fmt(peaTotal_thb)}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2, marginBottom: 12 }}>ค่าไฟฟ้ารวม</div>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: 24 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#FFFFFF' }}>{fmt(peaTotal_kwh)}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>kWh รวม</div>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#FFFFFF' }}>{fmt(d.solar_kwh)}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Solar kWh</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '18px 20px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#16A34A', marginBottom: 12 }}>ผลต่อสิ่งแวดล้อม</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#0F172A' }}>{fmtDec(d.co2_avoided, 2)}</div>
              <div style={{ fontSize: 12, color: '#64748B' }}>CO₂ Avoided (ton)</div>
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#0F172A' }}>{fmtDec(d.coal_saved, 2)}</div>
              <div style={{ fontSize: 12, color: '#64748B' }}>Coal Saved (ton)</div>
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#16A34A' }}>{fmtDec(d.solar_ratio)}%</div>
              <div style={{ fontSize: 12, color: '#64748B' }}>Solar Ratio</div>
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#0F172A' }}>{fmt(d.solar_kwh + peaTotal_kwh)}</div>
              <div style={{ fontSize: 12, color: '#64748B' }}>Total kWh</div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Provenance */}
      {showProvenance && (
        <div style={{ border: '1px solid #BFDBFE', borderRadius: 12, overflow: 'hidden', background: '#F8FBFF' }}>
          <div style={{ padding: '12px 16px', background: '#EFF6FF', borderBottom: '1px solid #BFDBFE', display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="14" height="14" fill="none" stroke="#2563EB" strokeWidth={2} viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#1D4ED8' }}>Data Provenance — ที่มาของข้อมูลแต่ละค่า</span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Field</th>
                <th>ค่า</th>
                <th>Source Document</th>
                <th>ตำแหน่งในเอกสาร</th>
              </tr>
            </thead>
            <tbody>
              {dataProvenance.map(p => (
                <tr key={p.field}>
                  <td style={{ fontWeight: 600, fontSize: 13 }}>{p.field}</td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#1A3A6B', fontWeight: 600 }}>{p.value}</td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#475569' }}>{p.source}</td>
                  <td style={{ fontSize: 12, color: '#64748B' }}>{p.page}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, unit, muted }: { label: string; value: string; unit: string; muted?: boolean }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginTop: 3 }}>
        <span style={{ fontSize: muted ? 18 : 22, fontWeight: 700, color: muted ? '#475569' : '#0F172A' }}>{value}</span>
        <span style={{ fontSize: 11, color: '#94A3B8' }}>{unit}</span>
      </div>
    </div>
  );
}
