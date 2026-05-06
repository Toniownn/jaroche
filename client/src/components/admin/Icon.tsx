'use client';

import type { JSX } from 'react';

export type IconName =
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'customers'
  | 'journal'
  | 'discounts'
  | 'reviews'
  | 'analytics'
  | 'settings'
  | 'search'
  | 'bell'
  | 'plus'
  | 'chevron'
  | 'chevronDown'
  | 'chevronLeft'
  | 'download'
  | 'upload'
  | 'filter'
  | 'more'
  | 'eye'
  | 'edit'
  | 'trash'
  | 'check'
  | 'x'
  | 'arrow'
  | 'arrowUp'
  | 'arrowDown'
  | 'box'
  | 'mail'
  | 'map'
  | 'truck'
  | 'save'
  | 'logout'
  | 'yarn';

interface Props {
  name: IconName;
  size?: number;
  className?: string;
}

const paths: Record<IconName, JSX.Element> = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </>
  ),
  orders: (
    <>
      <path d="M5 7h14l-1.5 11.5a2 2 0 0 1-2 1.75H8.5a2 2 0 0 1-2-1.75L5 7z" />
      <path d="M9 7V5a3 3 0 0 1 6 0v2" />
    </>
  ),
  products: (
    <>
      <path d="M3 8l9-5 9 5-9 5-9-5z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8" />
    </>
  ),
  customers: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M3 20c.6-3.4 2.9-5.5 6-5.5s5.4 2.1 6 5.5" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M14.5 14c2.6-.5 4.7 1 5.5 4" />
    </>
  ),
  journal: (
    <>
      <path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H18a1 1 0 0 1 1 1v15.5a1.5 1.5 0 0 1-1.5 1.5H6.5A1.5 1.5 0 0 1 5 19.5v-15z" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </>
  ),
  discounts: (
    <>
      <path d="M3 12l8.5-8.5a2 2 0 0 1 1.4-.6H19a2 2 0 0 1 2 2v6a2 2 0 0 1-.6 1.4L12 20.5a2 2 0 0 1-2.8 0L3 14a2 2 0 0 1 0-2z" />
      <circle cx="16" cy="8" r="1.2" fill="currentColor" />
    </>
  ),
  reviews: <path d="M12 3l2.6 5.4 5.9.6-4.4 4 1.3 5.8L12 16l-5.4 2.8L7.9 13 3.5 9l5.9-.6L12 3z" />,
  analytics: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m16 16 5 5" />
    </>
  ),
  bell: (
    <>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9z" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  chevron: <path d="m9 6 6 6-6 6" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronLeft: <path d="m15 6-6 6 6 6" />,
  download: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M7 10l5 5 5-5" />
      <path d="M12 15V3" />
    </>
  ),
  upload: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M17 8l-5-5-5 5" />
      <path d="M12 3v12" />
    </>
  ),
  filter: <path d="M3 6h18M6 12h12M10 18h4" />,
  more: (
    <>
      <circle cx="5" cy="12" r="1.4" fill="currentColor" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" />
      <circle cx="19" cy="12" r="1.4" fill="currentColor" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  edit: (
    <>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </>
  ),
  trash: (
    <>
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 1.8H8a2 2 0 0 1-2-1.8L5 6" />
    </>
  ),
  check: <path d="M5 12l5 5L20 7" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowUp: <path d="M7 14l5-5 5 5" />,
  arrowDown: <path d="M7 10l5 5 5-5" />,
  box: (
    <>
      <path d="M3 8l9-5 9 5-9 5-9-5z" />
      <path d="M3 8v8l9 5 9-5V8" />
    </>
  ),
  mail: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  map: (
    <>
      <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" />
      <path d="M9 4v14M15 6v14" />
    </>
  ),
  truck: (
    <>
      <path d="M3 7h11v10H3z" />
      <path d="M14 10h4l3 3v4h-7" />
      <circle cx="7" cy="18" r="1.8" />
      <circle cx="17" cy="18" r="1.8" />
    </>
  ),
  save: (
    <>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <path d="M17 21v-8H7v8M7 3v5h8" />
    </>
  ),
  logout: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </>
  ),
  yarn: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.5 12c2 1 5 1.5 8.5 1.5s6.5-.5 8.5-1.5M5 7c2 .8 4.5 1.3 7 1.3s5-.5 7-1.3M5 17c2-.8 4.5-1.3 7-1.3s5 .5 7 1.3" />
      <path d="M9 3.5c-1 2-1.5 5-1.5 8.5s.5 6.5 1.5 8.5M15 3.5c1 2 1.5 5 1.5 8.5s-.5 6.5-1.5 8.5" />
    </>
  ),
};

export function Icon({ name, size = 18, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}
