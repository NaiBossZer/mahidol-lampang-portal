interface KPICardProps {
  title: string;
  subtitle?: string;
  primary: string;
  primaryLabel: string;
  secondary?: string;
  secondaryLabel?: string;
  icon: React.ReactNode;
  trend?: { value: string; up: boolean };
  accent?: string;
  highlight?: boolean;
}

export function KPICard({ title, subtitle, primary, primaryLabel, secondary, secondaryLabel, icon, trend, accent = '#2563EB', highlight }: KPICardProps) {
  return (
    <div style={{
      background: highlight ? `linear-gradient(135deg, #0C2340 0%, #1A3A6B 100%)` : '#FFFFFF',
      border: highlight ? 'none' : '1px solid #E2E8F0',
      borderRadius: 14,
      padding: '22px 24px',
      boxShadow: highlight ? '0 4px 20px rgba(12,35,64,0.25)' : '0 1px 4px rgba(0,0,0,0.05)',
      display: 'flex', flexDirection: 'column', gap: 14,
      position: 'relative', overflow: 'hidden',
    }}>
      {highlight && (
        <div style={{
          position: 'absolute', top: -20, right: -20,
          width: 120, height: 120, borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
        }} />
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: highlight ? 'rgba(255,255,255,0.6)' : '#64748B' }}>{title}</div>
          {subtitle && <div style={{ fontSize: 11, color: highlight ? 'rgba(255,255,255,0.4)' : '#94A3B8', marginTop: 2 }}>{subtitle}</div>}
        </div>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: highlight ? 'rgba(255,255,255,0.12)' : `${accent}15`,
          color: highlight ? '#FFFFFF' : accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {icon}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 26, fontWeight: 700, color: highlight ? '#FFFFFF' : '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{primary}</div>
        <div style={{ fontSize: 12, color: highlight ? 'rgba(255,255,255,0.5)' : '#94A3B8', marginTop: 3 }}>{primaryLabel}</div>
      </div>

      {secondary && (
        <div style={{ borderTop: `1px solid ${highlight ? 'rgba(255,255,255,0.1)' : '#F1F5F9'}`, paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: highlight ? 'rgba(255,255,255,0.9)' : '#0F172A' }}>{secondary}</div>
            <div style={{ fontSize: 11, color: highlight ? 'rgba(255,255,255,0.4)' : '#94A3B8' }}>{secondaryLabel}</div>
          </div>
          {trend && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 12, fontWeight: 600,
              color: trend.up ? '#16A34A' : '#DC2626',
              background: trend.up ? '#F0FDF4' : '#FEF2F2',
              padding: '3px 8px', borderRadius: 20,
            }}>
              {trend.up ? '↑' : '↓'} {trend.value}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
