export function YarnIcon({ size = 22, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      stroke={color}
      strokeWidth={1.1}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="13" />
      <path d="M9 16 Q 20 8, 31 16" />
      <path d="M9 20 Q 20 12, 31 20" />
      <path d="M9 24 Q 20 16, 31 24" />
      <path d="M11 28 Q 20 22, 29 28" />
      <path d="M14 32 Q 20 28, 26 32" />
      <path d="M28 30 Q 33 33, 34 38" />
    </svg>
  );
}
