'use client';

import type { ReactNode } from 'react';
import { Icon } from './Icon';

interface KpiProps {
  label: string;
  value: ReactNode;
  delta?: string | null;
  deltaDir?: 'up' | 'down';
  spark?: ReactNode;
}

export function KpiCard({ label, value, delta, deltaDir = 'up', spark }: KpiProps) {
  return (
    <div className="kpi">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-foot">
        {delta != null && (
          <span className={`kpi-delta ${deltaDir}`}>
            <Icon name={deltaDir === 'up' ? 'arrowUp' : 'arrowDown'} size={12} />
            {delta}
          </span>
        )}
        <span>vs last week</span>
      </div>
      {spark}
    </div>
  );
}

export function sparkPath(vals: number[], w = 110, h = 38, pad = 4) {
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  const step = (w - pad * 2) / (vals.length - 1);
  const pts: [number, number][] = vals.map((v, i) => {
    const x = pad + i * step;
    const y = pad + (h - pad * 2) * (1 - (v - min) / range);
    return [x, y];
  });
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const fill = `${d} L${w - pad} ${h} L${pad} ${h} Z`;
  return { d, fill };
}

export function Spark({
  vals,
  color = 'var(--a-beige-deep)',
  width = 110,
  height = 38,
}: {
  vals: number[];
  color?: string;
  width?: number;
  height?: number;
}) {
  if (vals.length < 2) return null;
  const { d, fill } = sparkPath(vals, width, height);
  return (
    <svg
      className="kpi-spark"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <path d={fill} fill={color} opacity="0.18" />
      <path d={d} stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  );
}
