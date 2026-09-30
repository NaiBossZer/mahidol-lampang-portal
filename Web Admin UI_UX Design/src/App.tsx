import { useState } from 'react';
import { KPICard } from './components/KPICard';
import { StatusBadge } from './components/StatusBadge';
import { UploadZone } from './components/UploadZone';
import { AIPipeline } from './components/AIPipeline';
import { MonthlyReport } from './components/MonthlyReport';
import { ValidationPanel } from './components/ValidationPanel';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { ReportPreview } from './components/ReportPreview';
import { ApprovalTimeline } from './components/ApprovalTimeline';
import { ExportPanel } from './components/ExportPanel';
import { currentReport } from './data/mockData';

const tabs = [
  { id: 'overview', label: 'Overview', icon: '▦' },
  { id: 'sources', label: 'Source Documents', icon: '⬆' },
  { id: 'ai', label: 'AI Processing', icon: '⚡' },
  { id: 'monthly', label: 'Monthly Report', icon: '📋' },
  { id: 'executive', label: 'Executive View', icon: '◈' },
  { id: 'preview', label: 'Report Preview', icon: '◫' },
  { id: 'approval', label: 'Validation & Approval', icon: '✓' },
  { id: 'export', label: 'Export', icon: '↓' },
];

const navItems = [
  { label: 'Dashboard', icon: '▦', active: false },
  { label: 'Admin', icon: '⚙', active: false, hasChildren: true },
  { label: 'EE Report', icon: '⚡', active: true, isChild: true },
  { label: 'ผู้ใช้งาน', icon: '👤', active: false, isChild: true },
  { label: 'Settings', icon: '⚙', active: false },
];

function fmt(n: number) { return n.toLocaleString('th-TH'); }

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDocCount, setSelectedDocCount] = useState(0);
  const [aiProcessed, setAiProcessed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const peaTotal_thb = currentReport.sobprab_thb + currentReport.palad_thb;
  const peaTotal_kwh = currentReport.sobprab_kwh + currentReport.palad_kwh;

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#F4F6F9', fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 240 : 64, flexShrink: 0,
        background: 'linear-gradient(180deg, #0C2340 0%, #0F2E52 100%)',
        display: 'flex', flexDirection: 'column', gap: 0,
        transition: 'width 0.2s ease', overflow: 'hidden',
        boxShadow: '2px 0 12px rgba(0,0,0,0.15)',
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg, #2563EB 0%, #1A3A6B 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 800, color: '#FFFFFF',
          }}>M</div>
          {sidebarOpen && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap' }}>Mahidol Lampang</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>EE Report System</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
          {navItems.map(item => (
            <div
              key={item.label}
              className={`nav-item${item.isChild ? ' sub' : ''}${item.active ? ' active' : ''}`}
              style={{ paddingLeft: item.isChild && sidebarOpen ? 36 : sidebarOpen ? 14 : 12 }}
            >
              <span style={{ fontSize: item.isChild ? 13 : 15, flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>}
              {item.hasChildren && sidebarOpen && <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>▾</span>}
            </div>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: '12px 12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#FFFFFF', flexShrink: 0 }}>พ</div>
          {sidebarOpen && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>น.ส.พรพิมล วงศ์ทอง</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Admin Staff</div>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top header */}
        <header style={{
          background: '#FFFFFF', borderBottom: '1px solid #E2E8F0',
          padding: '0 28px', height: 64, display: 'flex', alignItems: 'center', gap: 16,
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)', flexShrink: 0,
        }}>
          <button onClick={() => setSidebarOpen(v => !v)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748B', fontSize: 20, display: 'flex', padding: 4, borderRadius: 6 }}>
            ☰
          </button>
          <div style={{ height: 24, width: 1, background: '#E2E8F0' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>ระบบรายงานสรุปการใช้ไฟฟ้าและพลังงานหมุนเวียน</div>
            <div style={{ fontSize: 12, color: '#64748B', display: 'flex', gap: 6, alignItems: 'center' }}>
              ข้อมูลจริงจากเอกสารต้นฉบับ
              <span style={{ color: '#CBD5E1' }}>→</span> AI extraction
              <span style={{ color: '#CBD5E1' }}>→</span> validation
              <span style={{ color: '#CBD5E1' }}>→</span> Monthly Report
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>กันยายน 2567</div>
              <div style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'JetBrains Mono, monospace' }}>อัปเดต 28/09/67 09:25</div>
            </div>
            <StatusBadge status="needs-review" />
            <button style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid #E2E8F0', background: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', fontSize: 16 }}>
              ↻
            </button>
          </div>
        </header>

        {/* Page scroll area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            <KPICard
              highlight
              title="ค่าไฟฟ้ารวม (กฟภ.)"
              subtitle="2 พื้นที่รวม"
              primary={`฿${fmt(peaTotal_thb)}`}
              primaryLabel="ค่าไฟฟ้ารวม"
              secondary={`${fmt(peaTotal_kwh)} kWh`}
              secondaryLabel="หน่วยรวม PEA"
              trend={{ value: '3.2%', up: false }}
              icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              accent="#2563EB"
            />
            <KPICard
              title="กฟภ. สถานีสบปราบ"
              subtitle="Sobprab Station"
              primary={`${fmt(currentReport.sobprab_kwh)} kWh`}
              primaryLabel="หน่วยไฟฟ้า"
              secondary={`฿${fmt(currentReport.sobprab_thb)}`}
              secondaryLabel="ค่าไฟฟ้า (บาท)"
              icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              accent="#2563EB"
            />
            <KPICard
              title="กฟภ. ผาลาด"
              subtitle="Palad Station"
              primary={`${fmt(currentReport.palad_kwh)} kWh`}
              primaryLabel="หน่วยไฟฟ้า"
              secondary={`฿${fmt(currentReport.palad_thb)}`}
              secondaryLabel="ค่าไฟฟ้า (บาท)"
              icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              accent="#7C3AED"
            />
            <KPICard
              title="Solar Energy"
              subtitle="พลังงานแสงอาทิตย์"
              primary={`${fmt(currentReport.solar_kwh)} kWh`}
              primaryLabel="Solar Yield"
              secondary={`${currentReport.solar_ratio.toFixed(1)}%`}
              secondaryLabel="Solar Ratio"
              trend={{ value: '0.7%', up: false }}
              icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              accent="#16A34A"
            />
          </div>

          {/* Tab navigation */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', overflowX: 'auto' }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '14px 18px', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                    fontSize: 13, fontWeight: activeTab === tab.id ? 600 : 400,
                    color: activeTab === tab.id ? '#1A3A6B' : '#64748B',
                    background: activeTab === tab.id ? '#F8FBFF' : '#FFFFFF',
                    borderBottom: activeTab === tab.id ? '2px solid #1A3A6B' : '2px solid transparent',
                    whiteSpace: 'nowrap', transition: 'all 0.15s ease', display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                  <span style={{ fontSize: 14 }}>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ padding: '24px' }}>
              {activeTab === 'overview' && <OverviewTab />}
              {activeTab === 'sources' && (
                <Section title="Source of Truth — เอกสารต้นฉบับ" subtitle='อัปโหลดเอกสารจริงเพื่อใช้เป็นแหล่งข้อมูลของ AI Agent และ Monthly Report — ไฟล์ต้นฉบับไม่ถูกแทนที่ด้วยข้อมูลที่ AI สร้างขึ้น' badge="Source of Truth" badgeColor="#1A3A6B">
                  <UploadZone onSelectionChange={setSelectedDocCount} />
                </Section>
              )}
              {activeTab === 'ai' && (
                <Section title="AI Agent Pipeline" subtitle="AI ทำหน้าที่สกัดข้อมูลจากเอกสารต้นฉบับ — เจ้าหน้าที่เป็นผู้ตรวจสอบและอนุมัติข้อมูลทุกครั้ง">
                  <AIPipeline selectedCount={selectedDocCount} onProcessComplete={() => setAiProcessed(true)} />
                </Section>
              )}
              {activeTab === 'monthly' && (
                <Section title="Monthly Report" subtitle="รายงานรายเดือน พร้อม Data Provenance แสดงที่มาของข้อมูลแต่ละค่า">
                  {aiProcessed ? <MonthlyReport /> : <EmptyState onUpload={() => setActiveTab('sources')} onProcess={() => setActiveTab('ai')} />}
                </Section>
              )}
              {activeTab === 'executive' && (
                <Section title="Executive Dashboard" subtitle="มุมมองสำหรับผู้บริหาร — ข้อมูลสรุป trend และ energy mix">
                  <ExecutiveDashboard />
                </Section>
              )}
              {activeTab === 'preview' && (
                <Section title="Report Preview" subtitle="ดูตัวอย่างรายงานก่อน Export — ข้อมูลจาก Monthly Report ที่ผ่าน validation">
                  <ReportPreview />
                </Section>
              )}
              {activeTab === 'approval' && (
                <Section title="ตรวจสอบข้อมูลก่อนอนุมัติ" subtitle="Validation results และ Approval workflow พร้อม Audit Trail">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                    <ValidationPanel />
                    <div style={{ height: 1, background: '#E2E8F0' }} />
                    <ApprovalTimeline />
                  </div>
                </Section>
              )}
              {activeTab === 'export' && (
                <Section title="ส่งออกรายงาน" subtitle="Export PPTX หรือ PDF — พร้อมใช้งานหลังจาก Monthly Report ผ่านการอนุมัติ">
                  <ExportPanel isApproved={false} />
                </Section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, subtitle, badge, badgeColor, children }: { title: string; subtitle: string; badge?: string; badgeColor?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', margin: 0 }}>{title}</h2>
            {badge && (
              <span style={{
                padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                background: badgeColor ?? '#1A3A6B', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em',
              }}>{badge}</span>
            )}
          </div>
          <p style={{ fontSize: 13, color: '#64748B', margin: '5px 0 0', maxWidth: 680 }}>{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function OverviewTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Workflow guide */}
      <div style={{ padding: '18px 20px', background: 'linear-gradient(135deg, #F8FBFF 0%, #EFF6FF 100%)', border: '1px solid #BFDBFE', borderRadius: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#1D4ED8', marginBottom: 10 }}>workflow ของระบบ EE Report</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {[
            { step: '1', label: 'Upload เอกสาร', color: '#2563EB' },
            { step: '2', label: 'AI Extraction', color: '#7C3AED' },
            { step: '3', label: 'Validation', color: '#EA580C' },
            { step: '4', label: 'Monthly Report', color: '#1A3A6B' },
            { step: '5', label: 'Approval', color: '#16A34A' },
            { step: '6', label: 'Export', color: '#0C2340' },
          ].map((s, i, arr) => (
            <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 12px', background: '#FFFFFF', borderRadius: 8, border: `1px solid ${s.color}20` }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: s.color, color: '#FFFFFF', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.step}</div>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: '#0F172A' }}>{s.label}</span>
              </div>
              {i < arr.length - 1 && <span style={{ color: '#CBD5E1', fontSize: 16 }}>→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Quick status */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {[
          { label: 'Source Documents', value: '3 ไฟล์', status: 'processed' as const, note: 'ล่าสุด: 28/09/67 09:22' },
          { label: 'AI Processing', value: 'สำเร็จ', status: 'approved' as const, note: 'EE-Agent v2.4.1' },
          { label: 'Report Status', value: 'Needs Review', status: 'needs-review' as const, note: '1 warning รอตรวจสอบ' },
        ].map(item => (
          <div key={item.label} style={{ padding: '16px 18px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>{item.label}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>{item.value}</span>
              <StatusBadge status={item.status} size="sm" />
            </div>
            <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 6 }}>{item.note}</div>
          </div>
        ))}
      </div>

      {/* Data traceability notice */}
      <div style={{ padding: '16px 18px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <svg width="20" height="20" fill="none" stroke="#16A34A" strokeWidth={2} viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 1 }}>
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: '#15803D' }}>Data Traceability — ทุกตัวเลขมีที่มาจากเอกสารต้นฉบับ</div>
          <div style={{ fontSize: 12.5, color: '#16A34A', marginTop: 4, lineHeight: 1.6 }}>
            ระบบนี้รับประกันว่าข้อมูลทุกตัวเลขใน Monthly Report สามารถ trace กลับไปยัง Source Document ได้ —
            AI ทำหน้าที่เพียงสกัดข้อมูล ไม่ใช่ผู้ตัดสิน เจ้าหน้าที่ต้องตรวจสอบและอนุมัติทุกครั้ง
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onUpload, onProcess }: { onUpload: () => void; onProcess: () => void }) {
  return (
    <div style={{
      padding: '60px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
      background: '#F8FAFC', borderRadius: 12, border: '1.5px dashed #CBD5E1', textAlign: 'center',
    }}>
      <div style={{ width: 64, height: 64, borderRadius: 16, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="28" height="28" fill="none" stroke="#2563EB" strokeWidth={1.8} viewBox="0 0 24 24">
          <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div>
        <div style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>ยังไม่มี Monthly Report</div>
        <div style={{ fontSize: 13.5, color: '#64748B', maxWidth: 420, lineHeight: 1.7 }}>
          อัปโหลด PDF ค่าไฟสบปราบ/ผาลาด หรือ Excel Solar
          จากนั้นเลือกเอกสารและสั่ง AI Agent เพื่อสร้างรายงานรายเดือน
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
        <button onClick={onUpload} style={{
          padding: '10px 20px', borderRadius: 9, border: 'none',
          background: '#1A3A6B', color: '#FFFFFF', fontSize: 13.5, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(26,58,107,0.3)',
        }}>
          ⬆ อัปโหลดเอกสาร
        </button>
        <button onClick={onProcess} style={{
          padding: '10px 20px', borderRadius: 9, border: '1px solid #E2E8F0',
          background: '#FFFFFF', color: '#1A3A6B', fontSize: 13.5, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>
          ⚡ เลือก Source และประมวลผล
        </button>
      </div>
    </div>
  );
}
