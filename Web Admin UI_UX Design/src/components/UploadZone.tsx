import { useState, useRef, useCallback } from 'react';
import { StatusBadge } from './StatusBadge';

interface UploadedFile {
  id: string;
  file: File;
  docType: 'pea' | 'solar';
  site: string;
  billingMonth: string;
  progress: number;
  status: 'uploading' | 'processed' | 'failed';
  sha256: string;
  selected: boolean;
}

function generateSha256() {
  const chars = '0123456789abcdef';
  return Array.from({ length: 64 }, () => chars[Math.floor(Math.random() * 16)]).join('');
}

interface Props {
  onSelectionChange: (count: number) => void;
}

export function UploadZone({ onSelectionChange }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [docType, setDocType] = useState<'pea' | 'solar'>('pea');
  const [site, setSite] = useState('สบปราบ');
  const [billingMonth, setBillingMonth] = useState('กันยายน 2567');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const peaSites = ['สบปราบ', 'ผาลาด'];
  const solarSites = ['Solar Cell — สบปราบ'];
  const months = ['ตุลาคม 2566','พฤศจิกายน 2566','ธันวาคม 2566','มกราคม 2567','กุมภาพันธ์ 2567','มีนาคม 2567','เมษายน 2567','พฤษภาคม 2567','มิถุนายน 2567','กรกฎาคม 2567','สิงหาคม 2567','กันยายน 2567'];

  const handleFiles = useCallback((fileList: FileList) => {
    Array.from(fileList).forEach(file => {
      const newFile: UploadedFile = {
        id: `f-${Date.now()}-${Math.random()}`,
        file,
        docType,
        site,
        billingMonth,
        progress: 0,
        status: 'uploading',
        sha256: generateSha256(),
        selected: false,
      };
      setFiles(prev => [...prev, newFile]);

      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 25 + 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setFiles(prev => prev.map(f => f.id === newFile.id ? { ...f, progress: 100, status: 'processed' } : f));
        } else {
          setFiles(prev => prev.map(f => f.id === newFile.id ? { ...f, progress } : f));
        }
      }, 300);
    });
  }, [docType, site, billingMonth]);

  const toggleSelect = (id: string) => {
    setFiles(prev => {
      const updated = prev.map(f => f.id === id && f.status === 'processed' ? { ...f, selected: !f.selected } : f);
      onSelectionChange(updated.filter(f => f.selected).length);
      return updated;
    });
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const updated = prev.filter(f => f.id !== id);
      onSelectionChange(updated.filter(f => f.selected).length);
      return updated;
    });
  };

  const sites = docType === 'pea' ? peaSites : solarSites;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Upload config */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>ประเภทเอกสาร</label>
          <select value={docType} onChange={e => { setDocType(e.target.value as 'pea' | 'solar'); setSite(e.target.value === 'pea' ? 'สบปราบ' : 'Solar Cell — สบปราบ'); }}
            style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13.5, background: '#FFFFFF', color: '#0F172A', fontFamily: 'inherit', cursor: 'pointer' }}>
            <option value="pea">PEA Electricity Bill (PDF)</option>
            <option value="solar">Solar Energy Report (Excel)</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>สถานที่ (Site)</label>
          <select value={site} onChange={e => setSite(e.target.value)}
            style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13.5, background: '#FFFFFF', color: '#0F172A', fontFamily: 'inherit', cursor: 'pointer' }}>
            {sites.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>รอบบิล (เดือน)</label>
          <select value={billingMonth} onChange={e => setBillingMonth(e.target.value)}
            style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13.5, background: '#FFFFFF', color: '#0F172A', fontFamily: 'inherit', cursor: 'pointer' }}>
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* Drop zone */}
      <div
        className={isDragging ? 'drag-over' : ''}
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={e => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${isDragging ? '#2563EB' : '#CBD5E1'}`,
          borderRadius: 12, padding: '32px 24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          background: isDragging ? '#EFF6FF' : '#FAFAFA',
          cursor: 'pointer', transition: 'all 0.15s ease',
          textAlign: 'center',
        }}>
        <input ref={inputRef} type="file" multiple accept={docType === 'pea' ? '.pdf' : '.xlsx,.xls'} style={{ display: 'none' }} onChange={e => e.target.files && handleFiles(e.target.files)} />
        <div style={{ width: 52, height: 52, borderRadius: 12, background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12M8 8l4-4 4 4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <div style={{ fontWeight: 600, color: '#0F172A', marginBottom: 4 }}>ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือก</div>
          <div style={{ fontSize: 13, color: '#64748B' }}>{docType === 'pea' ? 'รองรับ PDF เท่านั้น' : 'รองรับ Excel (.xlsx, .xls) เท่านั้น'}</div>
        </div>
        <div style={{ fontSize: 12, color: '#94A3B8', display: 'flex', gap: 8, alignItems: 'center' }}>
          <svg width="14" height="14" fill="none" stroke="#94A3B8" strokeWidth={2} viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round"/></svg>
          SHA-256 integrity check — ไฟล์ต้นฉบับไม่ถูกแก้ไขหลังจาก upload
        </div>
      </div>

      {/* Uploaded files */}
      {files.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            เอกสารที่อัปโหลด — {files.length} ไฟล์
          </div>
          {files.map(f => (
            <div key={f.id} style={{
              border: f.selected ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
              borderRadius: 10, padding: '14px 16px',
              background: f.selected ? '#F8FBFF' : '#FFFFFF',
              transition: 'all 0.15s ease',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                {/* File icon */}
                <div style={{
                  width: 42, height: 42, borderRadius: 8, flexShrink: 0,
                  background: f.docType === 'pea' ? '#FEF2F2' : '#F0FDF4',
                  color: f.docType === 'pea' ? '#DC2626' : '#16A34A',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11,
                }}>
                  {f.docType === 'pea' ? 'PDF' : 'XLS'}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, fontSize: 13.5, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.file.name}</span>
                    <StatusBadge status={f.status} size="sm" />
                  </div>
                  <div style={{ display: 'flex', gap: 16, marginTop: 6, flexWrap: 'wrap' }}>
                    {[
                      ['Site', f.site],
                      ['รอบบิล', f.billingMonth],
                      ['ขนาด', (f.file.size / 1024 / 1024).toFixed(2) + ' MB'],
                    ].map(([k, v]) => (
                      <span key={k} style={{ fontSize: 12, color: '#64748B' }}>
                        <span style={{ color: '#94A3B8' }}>{k}: </span>{v}
                      </span>
                    ))}
                  </div>

                  {/* SHA-256 */}
                  {f.status === 'processed' && (
                    <div style={{ marginTop: 8, padding: '6px 10px', background: '#F8FAFC', borderRadius: 6, display: 'flex', gap: 8, alignItems: 'center' }}>
                      <svg width="12" height="12" fill="none" stroke="#16A34A" strokeWidth={2} viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>SHA-256: {f.sha256}</span>
                    </div>
                  )}

                  {/* Progress */}
                  {f.status === 'uploading' && (
                    <div style={{ marginTop: 10 }}>
                      <div style={{ height: 4, background: '#E2E8F0', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: '#2563EB', borderRadius: 2, width: `${f.progress}%`, transition: 'width 0.2s ease' }} />
                      </div>
                      <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>{Math.round(f.progress)}%</div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  {f.status === 'processed' && (
                    <button
                      onClick={() => toggleSelect(f.id)}
                      style={{
                        padding: '6px 12px', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        border: f.selected ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
                        background: f.selected ? '#2563EB' : '#FFFFFF',
                        color: f.selected ? '#FFFFFF' : '#64748B',
                        transition: 'all 0.15s ease',
                      }}>
                      {f.selected ? '✓ Selected' : 'Select for AI'}
                    </button>
                  )}
                  <button onClick={() => removeFile(f.id)} style={{ padding: '6px 8px', borderRadius: 7, border: '1px solid #E2E8F0', background: '#FFFFFF', cursor: 'pointer', color: '#DC2626', fontSize: 12 }}>
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
