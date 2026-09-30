import { useState } from 'react';
import { StatusBadge } from './StatusBadge';

interface PipelineStep {
  id: string;
  num: string;
  title: string;
  desc: string;
  status: 'pending' | 'running' | 'done' | 'error';
  timestamp?: string;
  detail?: string;
}

const initialSteps: PipelineStep[] = [
  { id: 's1', num: '01', title: 'Ingest', desc: 'ไฟล์ถูกเก็บใน private storage', status: 'pending' },
  { id: 's2', num: '02', title: 'Extract', desc: 'AI อ่านข้อมูลจาก PDF / Excel', status: 'pending' },
  { id: 's3', num: '03', title: 'Validate', desc: 'ตรวจสอบ site / month / data consistency', status: 'pending' },
  { id: 's4', num: '04', title: 'Persist', desc: 'สร้าง readings และ Monthly Report', status: 'pending' },
];

interface Props {
  selectedCount: number;
  onProcessComplete: () => void;
}

export function AIPipeline({ selectedCount, onProcessComplete }: Props) {
  const [steps, setSteps] = useState<PipelineStep[]>(initialSteps);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState<number | null>(null);

  const canRun = selectedCount > 0 && !isRunning && !isComplete;

  const now = () => {
    const d = new Date();
    return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}:${d.getSeconds().toString().padStart(2,'0')}`;
  };

  const runPipeline = async () => {
    if (!canRun) return;
    setIsRunning(true);
    setIsComplete(false);
    const t0 = Date.now();
    setStartTime(t0);
    const reset = initialSteps.map(s => ({ ...s, status: 'pending' as const, timestamp: undefined, detail: undefined }));
    setSteps(reset);

    const details = [
      `${selectedCount} ไฟล์ถูก ingest เข้า secure storage — checksum verified`,
      `AI อ่าน ${selectedCount} ไฟล์ — สกัด 66 fields สำเร็จ`,
      `Validation ผ่าน 6/6 checks — 1 warning (Solar Ratio ลดลง)`,
      `Monthly Report กันยายน 2567 ถูกสร้างเรียบร้อย`,
    ];

    for (let i = 0; i < 4; i++) {
      await delay(800 + Math.random() * 600);
      setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'running' as const, timestamp: now() } : s));
      await delay(600 + Math.random() * 800);
      setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'done' as const, detail: details[i] } : s));
    }

    setElapsed(Math.round((Date.now() - t0) / 100) / 10);
    setIsRunning(false);
    setIsComplete(true);
    onProcessComplete();
  };

  const reset = () => {
    setSteps(initialSteps);
    setIsRunning(false);
    setIsComplete(false);
    setElapsed(null);
  };

  const statusColor = { pending: '#94A3B8', running: '#2563EB', done: '#16A34A', error: '#DC2626' };
  const statusBg = { pending: '#F1F5F9', running: '#EFF6FF', done: '#F0FDF4', error: '#FEF2F2' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header + run button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div>
          <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>
            {selectedCount === 0 ? (
              <span style={{ color: '#EA580C' }}>⚠ กรุณาเลือก Source Document ก่อนประมวลผล</span>
            ) : (
              <span style={{ color: '#16A34A' }}>✓ เลือก {selectedCount} เอกสาร พร้อมประมวลผล</span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {isComplete && (
            <button onClick={reset} style={{ padding: '9px 16px', borderRadius: 9, border: '1px solid #E2E8F0', background: '#FFFFFF', color: '#64748B', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
              รีเซ็ต
            </button>
          )}
          <button
            onClick={runPipeline}
            disabled={!canRun}
            style={{
              padding: '10px 20px', borderRadius: 9, fontSize: 13.5, fontWeight: 600, cursor: canRun ? 'pointer' : 'not-allowed',
              border: 'none', fontFamily: 'inherit', transition: 'all 0.15s ease',
              background: canRun ? '#1A3A6B' : '#E2E8F0',
              color: canRun ? '#FFFFFF' : '#94A3B8',
              boxShadow: canRun ? '0 2px 8px rgba(26,58,107,0.3)' : 'none',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
            {isRunning ? (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} style={{ animation: 'spin 1s linear infinite' }}>
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                กำลังประมวลผล…
              </>
            ) : isComplete ? (
              '✓ ประมวลผลสำเร็จ'
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ประมวลผลด้วย AI Agent
              </>
            )}
          </button>
        </div>
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {steps.map((step, idx) => (
          <div key={step.id} style={{
            display: 'flex', gap: 14, alignItems: 'flex-start',
            padding: '14px 16px', borderRadius: 10,
            background: statusBg[step.status],
            border: `1px solid ${step.status === 'running' ? '#BFDBFE' : step.status === 'done' ? '#BBF7D0' : step.status === 'error' ? '#FECACA' : '#E2E8F0'}`,
            transition: 'all 0.2s ease',
          }}>
            {/* Step number circle */}
            <div style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: step.status === 'pending' ? '#E2E8F0' : statusBg[step.status],
              border: `2px solid ${statusColor[step.status]}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: statusColor[step.status],
              fontFamily: 'JetBrains Mono, monospace',
            }}>
              {step.status === 'done' ? '✓' : step.status === 'error' ? '✕' : step.status === 'running' ? '▶' : step.num}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: '#0F172A' }}>{step.title}</span>
                {step.status !== 'pending' && (
                  <StatusBadge status={step.status === 'done' ? 'approved' : step.status === 'running' ? 'processing' : 'failed'} size="sm" />
                )}
                {step.timestamp && <span style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'JetBrains Mono, monospace' }}>{step.timestamp}</span>}
              </div>
              <div style={{ fontSize: 13, color: '#475569', marginTop: 2 }}>{step.desc}</div>
              {step.detail && (
                <div style={{ fontSize: 12, color: statusColor[step.status], marginTop: 6, padding: '5px 10px', background: 'rgba(0,0,0,0.03)', borderRadius: 6 }}>
                  {step.detail}
                </div>
              )}
              {step.status === 'running' && (
                <div style={{ marginTop: 8, height: 3, background: '#BFDBFE', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: '#2563EB', borderRadius: 2, width: '60%', animation: 'progress-indeterminate 1.2s ease-in-out infinite' }} />
                </div>
              )}
            </div>

            {/* Step line connector */}
            {idx < 3 && (
              <div style={{
                position: 'absolute',
                display: 'none', // visual connector is implicit from layout
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Summary after complete */}
      {isComplete && (
        <div style={{
          padding: '18px 20px', borderRadius: 12,
          background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
          border: '1px solid #BBF7D0',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16,
        }}>
          {[
            ['Agent', 'EE-Agent v2.4.1'],
            ['เวลาประมวลผล', `${elapsed}s`],
            ['เอกสาร', `${selectedCount} ฉบับ`],
            ['Fields ที่สกัด', '66 fields'],
            ['Warnings', '1 รายการ'],
            ['Output', 'Monthly Report ก.ย. 2567'],
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 11, color: '#16A34A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', marginTop: 3 }}>{v}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }
