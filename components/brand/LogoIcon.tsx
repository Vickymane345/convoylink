/**
 * ConvoyLink Icon Mark
 * Shield with converging road perspective lines + destination dot
 * — protection (shield) + convoy movement (road) + arrival (dot)
 */
interface LogoIconProps {
  size?: number
  className?: string
}

export function LogoIcon({ size = 36, className }: LogoIconProps) {
  const id = `cl-grad-${size}`
  const glowId = `cl-glow-${size}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ConvoyLink"
    >
      <defs>
        {/* Orange gradient for the shield */}
        <linearGradient id={id} x1="6" y1="4" x2="30" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="55%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        {/* Inner highlight gradient */}
        <linearGradient id={`${id}-hi`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.18" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        {/* Glow filter */}
        <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Dark rounded-square background ── */}
      <rect width="36" height="36" rx="9" fill="#18181b" />

      {/* ── Shield body ── */}
      <path
        d="M18 4 L31 9 L31 21 Q31 31.5 18 35 Q5 31.5 5 21 L5 9 Z"
        fill={`url(#${id})`}
      />

      {/* Shield inner highlight (top-left gloss) */}
      <path
        d="M18 4 L31 9 L31 18 Q26 8 18 6 Q11 8 7 14 L5 9 Z"
        fill={`url(#${id}-hi)`}
      />

      {/* ── Road perspective lines (convoy in motion) ── */}
      {/* Left road edge — converges to vanishing point */}
      <path
        d="M10.5 31.5 L17.3 14.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.95"
        filter={`url(#${glowId})`}
      />
      {/* Right road edge */}
      <path
        d="M25.5 31.5 L18.7 14.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.95"
        filter={`url(#${glowId})`}
      />

      {/* Center dashes (road marking) */}
      <circle cx="18" cy="29" r="1.1" fill="white" fillOpacity="0.55" />
      <circle cx="18" cy="24" r="0.9" fill="white" fillOpacity="0.45" />
      <circle cx="18" cy="19.5" r="0.7" fill="white" fillOpacity="0.35" />

      {/* ── Destination dot (vanishing point / safe arrival) ── */}
      <circle
        cx="18"
        cy="13"
        r="2.2"
        fill="white"
        fillOpacity="0.95"
        filter={`url(#${glowId})`}
      />
      {/* Outer ring around destination dot */}
      <circle
        cx="18"
        cy="13"
        r="4"
        stroke="white"
        strokeWidth="1"
        strokeOpacity="0.25"
        fill="none"
      />
    </svg>
  )
}
