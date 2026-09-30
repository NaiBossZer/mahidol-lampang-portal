import { approvalTrail } from '../data/mockData';

const stepColors: Record<string, string> = {
  Draft: '#94A3B8',
  Uploaded: '#2563EB',
  'AI Processed': '#7C3AED',
  'Needs Review': '#EA580C',
  Approved: '#16A34A',
  Published: '#0C2340',
};

export function ApprovalTimeline() {
  const currentIdx = approvalTrail.findIndex(s => !s.actor || !s.timestamp) - 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Status bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', paddingBottom: 4 }}>
        {approvalTrail.map((step, i) => {
          const isDone = step.actor !== null && step.timestamp !== null;
          const isCurrent = i === currentIdx + 1;
          const color = stepColors[step.step] ?? '#94A3B8';
          return (
            <div key={step.step} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                padding: '0 8px',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isDone ? color : isCurrent ? '#FFF7ED' : '#F1F5F9',
                  border: `2px solid ${isDone ? color : isCurrent ? '#EA580C' : '#E2E8F0'}`,
                  color: isDone ? '#FFFFFF' : isCurrent ? '#EA580C' : '#94A3B8',
                  fontSize: 13, fontWeight: 700, transition: 'all 0.2s ease',
                }}>
                  {isDone ? '✓' : isCurrent ? '◉' : '○'}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: isDone ? '#0F172A' : isCurrent ? '#EA580C' : '#94A3B8', whiteSpace: 'nowrap', textAlign: 'center' }}>
                  {step.step}
                </div>
              </div>
              {i < approvalTrail.length - 1 && (
                <div style={{ width: 32, height: 2, background: i < currentIdx + 1 ? color : '#E2E8F0', transition: 'background 0.3s ease' }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Audit trail table */}
      <div style={{ border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', fontSize: 12, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Audit Trail
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>ขั้นตอน</th>
              <th>ผู้ดำเนินการ</th>
              <th>เวลา</th>
              <th>หมายเหตุ</th>
            </tr>
          </thead>
          <tbody>
            {approvalTrail.map((step, i) => {
              const isDone = step.actor !== null && step.timestamp !== null;
              const isCurrent = i === currentIdx + 1;
              const color = stepColors[step.step] ?? '#94A3B8';
              return (
                <tr key={step.step}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: isDone ? color : isCurrent ? '#EA580C' : '#E2E8F0', flexShrink: 0 }} />
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{step.step}</span>
                    </div>
                  </td>
                  <td style={{ color: isDone ? '#0F172A' : '#94A3B8', fontSize: 13 }}>
                    {step.actor ?? '—'}
                  </td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: isDone ? '#475569' : '#CBD5E1' }}>
                    {step.timestamp ?? '—'}
                  </td>
                  <td style={{ fontSize: 12.5, color: isDone ? '#475569' : '#CBD5E1' }}>
                    {step.note}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Approve button */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button style={{ padding: '10px 18px', borderRadius: 9, border: '1px solid #E2E8F0', background: '#FFFFFF', color: '#64748B', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
          ส่งกลับแก้ไข
        </button>
        <button style={{
          padding: '10px 22px', borderRadius: 9, border: 'none',
          background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
          color: '#FFFFFF', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          boxShadow: '0 2px 10px rgba(22,163,74,0.35)',
        }}>
          ✓ อนุมัติรายงาน
        </button>
        <button style={{
          padding: '10px 22px', borderRadius: 9, border: 'none',
          background: '#0C2340', color: '#FFFFFF', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
          boxShadow: '0 2px 10px rgba(12,35,64,0.3)', opacity: 0.4, cursor: 'not-allowed' as const,
        }}>
          เผยแพร่
        </button>
      </div>
    </div>
  );
}
