type Status = 'draft' | 'processing' | 'needs-review' | 'approved' | 'published' | 'processed' | 'failed' | 'uploading' | 'selected';

const configs: Record<Status, { label: string; bg: string; text: string; dot: string }> = {
  draft:        { label: 'Draft',        bg: '#F1F5F9', text: '#475569', dot: '#94A3B8' },
  processing:   { label: 'Processing',   bg: '#FFFBEB', text: '#92400E', dot: '#D97706' },
  'needs-review': { label: 'Needs Review', bg: '#FFF7ED', text: '#9A3412', dot: '#EA580C' },
  approved:     { label: 'Approved',     bg: '#F0FDF4', text: '#15803D', dot: '#16A34A' },
  published:    { label: 'Published',    bg: '#EFF6FF', text: '#1D4ED8', dot: '#2563EB' },
  processed:    { label: 'Processed',    bg: '#F0FDF4', text: '#15803D', dot: '#16A34A' },
  failed:       { label: 'Failed',       bg: '#FEF2F2', text: '#B91C1C', dot: '#DC2626' },
  uploading:    { label: 'Uploading…',   bg: '#EFF6FF', text: '#1D4ED8', dot: '#2563EB' },
  selected:     { label: 'Selected',     bg: '#EFF6FF', text: '#1D4ED8', dot: '#2563EB' },
};

export function StatusBadge({ status, size = 'md' }: { status: Status; size?: 'sm' | 'md' }) {
  const cfg = configs[status] ?? configs.draft;
  const px = size === 'sm' ? '6px 10px' : '5px 12px';
  const fs = size === 'sm' ? '11px' : '12px';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: cfg.bg, color: cfg.text,
      padding: px, borderRadius: 20, fontSize: fs, fontWeight: 600, whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: '50%', background: cfg.dot,
        flexShrink: 0,
        ...(status === 'processing' || status === 'uploading' ? { animation: 'pulse-dot 1.5s ease-in-out infinite' } : {}),
      }} />
      {cfg.label}
    </span>
  );
}
