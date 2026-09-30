import { useState } from 'react';
import { validationResults } from '../data/mockData';

export function ValidationPanel() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sections = [
    { key: 'passed', label: 'Passed', count: validationResults.passed.length, color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0', icon: '✓', items: validationResults.passed },
    { key: 'warnings', label: 'Warnings', count: validationResults.warnings.length, color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', icon: '⚠', items: validationResults.warnings },
    { key: 'needsReview', label: 'Needs Review', count: validationResults.needsReview.length, color: '#EA580C', bg: '#FFF7ED', border: '#FED7AA', icon: '↻', items: validationResults.needsReview },
    { key: 'failed', label: 'Failed', count: validationResults.failed.length, color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', icon: '✕', items: validationResults.failed },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {sections.map(s => (
          <div key={s.key} style={{
            padding: '14px 16px', borderRadius: 10, background: s.bg, border: `1px solid ${s.border}`,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ fontSize: 18, color: s.color }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.count}</div>
              <div style={{ fontSize: 12, color: s.color, opacity: 0.8, fontWeight: 500 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Check list */}
      <div style={{ border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden' }}>
        {sections.flatMap(s => s.items.map((item, i) => (
          <div key={item.id} style={{
            padding: '13px 16px',
            borderBottom: '1px solid #F1F5F9',
            cursor: 'pointer',
            background: expandedId === item.id ? '#F8FAFC' : '#FFFFFF',
            transition: 'background 0.1s ease',
          }} onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{
                width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, flexShrink: 0,
              }}>{s.icon}</span>
              <span style={{ fontSize: 13.5, color: '#0F172A', flex: 1 }}>{item.message}</span>
              <svg width="14" height="14" fill="none" stroke="#94A3B8" strokeWidth={2} viewBox="0 0 24 24"
                style={{ transform: expandedId === item.id ? 'rotate(180deg)' : 'rotate(0)', transition: '0.2s', flexShrink: 0 }}>
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {expandedId === item.id && (
              <div style={{ marginTop: 10, marginLeft: 34, padding: '10px 12px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 12, color: '#64748B', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600 }}>Source: </span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{item.source}</span>
                </div>
                {s.key === 'warnings' && (
                  <div style={{ fontSize: 12, color: '#D97706' }}>⚠ ตรวจสอบค่านี้กับเอกสารต้นฉบับก่อนอนุมัติ</div>
                )}
                {s.key === 'passed' && (
                  <div style={{ fontSize: 12, color: '#16A34A' }}>✓ ผ่านการตรวจสอบอัตโนมัติ</div>
                )}
              </div>
            )}
          </div>
        )))}

        {sections.every(s => s.items.length === 0) && (
          <div style={{ padding: '32px', textAlign: 'center', color: '#94A3B8', fontSize: 14 }}>
            ยังไม่มีข้อมูล Validation — กรุณาประมวลผลด้วย AI Agent ก่อน
          </div>
        )}
      </div>

      {/* Approve actions */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <button style={{
          padding: '10px 20px', borderRadius: 9, border: '1px solid #E2E8F0',
          background: '#FFFFFF', color: '#64748B', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
        }}>
          ส่งกลับเพื่อแก้ไข
        </button>
        <button style={{
          padding: '10px 20px', borderRadius: 9, border: 'none',
          background: '#16A34A', color: '#FFFFFF', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          boxShadow: '0 2px 8px rgba(22,163,74,0.3)',
        }}>
          ✓ อนุมัติรายงาน
        </button>
      </div>
    </div>
  );
}
