import { useState } from 'react';

interface Props {
  isApproved: boolean;
}

export function ExportPanel({ isApproved }: Props) {
  const [exporting, setExporting] = useState<'pdf' | 'pptx' | null>(null);
  const [exported, setExported] = useState<Set<string>>(new Set());

  const handleExport = (type: 'pdf' | 'pptx') => {
    if (!isApproved) return;
    setExporting(type);
    setTimeout(() => {
      setExporting(null);
      setExported(prev => new Set([...prev, type]));
    }, 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {!isApproved && (
        <div style={{
          padding: '14px 18px', borderRadius: 10,
          background: '#FFF7ED', border: '1px solid #FED7AA',
          display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: '#9A3412',
        }}>
          <span style={{ fontSize: 18 }}>⚠</span>
          <div>
            <span style={{ fontWeight: 600 }}>Export ยังไม่พร้อมใช้งาน — </span>
            Monthly Report ต้องผ่านการอนุมัติก่อน Export รายงาน
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* PPTX */}
        <div style={{
          padding: '24px', border: '1px solid #E2E8F0', borderRadius: 14,
          background: '#FFFFFF', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          display: 'flex', flexDirection: 'column', gap: 16,
          opacity: isApproved ? 1 : 0.5,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth={1.8}>
                <path d="M9 17H7A5 5 0 017 7h2M15 7h2a5 5 0 010 10h-2M8 12h8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Export PPTX</div>
              <div style={{ fontSize: 12, color: '#64748B' }}>PowerPoint Presentation</div>
            </div>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
            {['Editable text, table, and shapes', 'Chart data แก้ไขได้', '3 Slides ตามโครงสร้างรายงาน', 'Mahidol branding template'].map(item => (
              <li key={item} style={{ fontSize: 13, color: '#475569', display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ color: '#16A34A', fontWeight: 700 }}>✓</span> {item}
              </li>
            ))}
          </ul>
          <button
            onClick={() => handleExport('pptx')}
            disabled={!isApproved || exporting === 'pptx'}
            style={{
              padding: '11px', borderRadius: 9, border: 'none', cursor: isApproved ? 'pointer' : 'not-allowed',
              background: exported.has('pptx') ? '#F0FDF4' : '#EA580C',
              color: exported.has('pptx') ? '#16A34A' : '#FFFFFF',
              fontSize: 13.5, fontWeight: 600, fontFamily: 'inherit',
              boxShadow: isApproved && !exported.has('pptx') ? '0 2px 8px rgba(234,88,12,0.3)' : 'none',
              transition: 'all 0.2s ease',
            }}>
            {exporting === 'pptx' ? 'กำลัง Export…' : exported.has('pptx') ? '✓ ดาวน์โหลด PPTX' : 'Export PPTX'}
          </button>
        </div>

        {/* PDF */}
        <div style={{
          padding: '24px', border: '1px solid #E2E8F0', borderRadius: 14,
          background: '#FFFFFF', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          display: 'flex', flexDirection: 'column', gap: 16,
          opacity: isApproved ? 1 : 0.5,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth={1.8}>
                <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Export PDF</div>
              <div style={{ fontSize: 12, color: '#64748B' }}>Print-ready Report</div>
            </div>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
            {['Print-ready institutional layout', 'เก็บโครงสร้างรายงาน 3 หน้า', 'Data provenance footer', 'Tamper-evident PDF signature'].map(item => (
              <li key={item} style={{ fontSize: 13, color: '#475569', display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ color: '#16A34A', fontWeight: 700 }}>✓</span> {item}
              </li>
            ))}
          </ul>
          <button
            onClick={() => handleExport('pdf')}
            disabled={!isApproved || exporting === 'pdf'}
            style={{
              padding: '11px', borderRadius: 9, border: 'none', cursor: isApproved ? 'pointer' : 'not-allowed',
              background: exported.has('pdf') ? '#F0FDF4' : '#1A3A6B',
              color: exported.has('pdf') ? '#16A34A' : '#FFFFFF',
              fontSize: 13.5, fontWeight: 600, fontFamily: 'inherit',
              boxShadow: isApproved && !exported.has('pdf') ? '0 2px 8px rgba(26,58,107,0.3)' : 'none',
              transition: 'all 0.2s ease',
            }}>
            {exporting === 'pdf' ? 'กำลัง Export…' : exported.has('pdf') ? '✓ ดาวน์โหลด PDF' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* Export history */}
      {exported.size > 0 && (
        <div style={{ padding: '14px 16px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#16A34A', marginBottom: 8 }}>Export History</div>
          {[...exported].map(t => (
            <div key={t} style={{ fontSize: 13, color: '#15803D', display: 'flex', gap: 12 }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#94A3B8', fontSize: 12 }}>{new Date().toLocaleTimeString('th-TH')}</span>
              EE_Report_Sep2567.{t.toUpperCase()} — ดาวน์โหลดสำเร็จ
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
