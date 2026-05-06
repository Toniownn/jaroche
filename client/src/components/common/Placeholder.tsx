import type { CSSProperties } from 'react';

type Tone = 'beige' | 'cream' | 'cocoa' | 'blush' | 'sage';

interface PlaceholderProps {
  label?: string;
  ratio?: string;
  tone?: string;
  className?: string;
}

const TONES: Record<Tone, { bg: string; stripe: string; ink: string }> = {
  beige: { bg: '#E8CBA8', stripe: '#D4A97A', ink: '#3D2F2F' },
  cream: { bg: '#F2E4D2', stripe: '#E0CDB3', ink: '#3D2F2F' },
  cocoa: { bg: '#A88775', stripe: '#8E6E5E', ink: '#FDF6F0' },
  blush: { bg: '#F3DDD3', stripe: '#E6C9BD', ink: '#3D2F2F' },
  sage: { bg: '#CDC6B0', stripe: '#B6AE94', ink: '#3D2F2F' },
};

export function Placeholder({
  label,
  ratio = '4 / 5',
  tone = 'beige',
  className,
}: PlaceholderProps) {
  const t = TONES[(tone as Tone) in TONES ? (tone as Tone) : 'beige'];
  const style: CSSProperties & Record<string, string> = {
    aspectRatio: ratio,
    '--ph-bg': t.bg,
    '--ph-stripe': t.stripe,
    '--ph-ink': t.ink,
  };
  return (
    <div className={className ? `ph ${className}` : 'ph'} style={style}>
      {label && <span className="ph-label">{label}</span>}
    </div>
  );
}
