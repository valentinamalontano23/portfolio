/* Line icons drawn for this site — one stroke weight, one visual family. */
const paths = {
  arrow: (
    <>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  arrowDown: (
    <>
      <path d="M12 4v15" />
      <path d="m6 13 6 6 6-6" />
    </>
  ),
  presence: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <circle cx="12" cy="10.5" r="2.6" />
      <path d="M7.5 18.2a4.8 4.8 0 0 1 9 0" />
    </>
  ),
  story: (
    <>
      <path d="M4 18c3-6 5.5-9 9-9" />
      <circle cx="4" cy="18" r="1.8" />
      <circle cx="19" cy="7.5" r="2.4" />
      <path d="M13 9h3.2" />
    </>
  ),
  range: (
    <>
      <circle cx="9" cy="9" r="5" />
      <rect x="10" y="10" width="10" height="10" rx="2.6" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.4 2.6 3.6 5.5 3.6 8.5s-1.2 5.9-3.6 8.5c-2.4-2.6-3.6-5.5-3.6-8.5S9.6 6.1 12 3.5Z" />
    </>
  ),
  social: (
    <>
      <rect x="6" y="2.8" width="12" height="18.4" rx="3" />
      <path d="m10.6 9.6 4.4 2.6-4.4 2.6z" />
    </>
  ),
  play: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m10.3 8.9 5.4 3.1-5.4 3.1z" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m15.4 8.6-2 4.8-4.8 2 2-4.8z" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="12" r="3.6" />
      <path d="M11.6 12H21" />
      <path d="M17.6 12v3.2" />
      <path d="M20 12v2.2" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s6.4-6 6.4-10.4A6.4 6.4 0 0 0 5.6 10.6C5.6 15 12 21 12 21Z" />
      <circle cx="12" cy="10.4" r="2.4" />
    </>
  ),
  hanger: (
    <>
      <path d="M12 8.4V7a2 2 0 1 1 2 2" />
      <path d="M12 8.4 3.6 15.2A1.6 1.6 0 0 0 4.6 18h14.8a1.6 1.6 0 0 0 1-2.8Z" />
    </>
  ),
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7.4" height="7.4" rx="1.8" />
      <rect x="13.1" y="3.5" width="7.4" height="7.4" rx="1.8" />
      <rect x="3.5" y="13.1" width="7.4" height="7.4" rx="1.8" />
      <path d="M16.8 13.1v7.4M13.1 16.8h7.4" />
    </>
  ),
  mail: (
    <>
      <rect x="2.8" y="5" width="18.4" height="14" rx="2.6" />
      <path d="m3.6 7 8.4 6 8.4-6" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  tiktok: (
    <>
      <path d="M14.4 3.2v10.9a3.6 3.6 0 1 1-3-3.55" />
      <path d="M14.4 5.4a4.8 4.8 0 0 0 4.6 3.4" />
    </>
  ),
  close: (
    <>
      <path d="m6 6 12 12M18 6 6 18" />
    </>
  ),
  menu: (
    <>
      <path d="M3.5 7.5h17M3.5 12h17M3.5 16.5h11" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.6" />
      <path d="m16 16 4.4 4.4" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3.4 13.9 9l5.6 1.9-5.6 1.9L12 18.4 10.1 12.8 4.5 10.9 10.1 9z" />
    </>
  )
}

export default function Icon({ name, className = 'h-5 w-5', strokeWidth = 1.4 }) {
  const d = paths[name]
  if (!d) return null
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {d}
    </svg>
  )
}
