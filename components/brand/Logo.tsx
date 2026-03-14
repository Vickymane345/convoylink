import { LogoIcon } from './LogoIcon'
import { cn } from '@/utils/helpers'

interface LogoProps {
  /** full = icon + wordmark, icon = mark only */
  variant?: 'full' | 'icon'
  /** icon size in px */
  iconSize?: number
  /** extra className on the wrapper */
  className?: string
  /** wordmark font size — defaults based on iconSize */
  textSize?: string
  /** invert wordmark colours for light backgrounds */
  light?: boolean
}

export function Logo({
  variant = 'full',
  iconSize = 32,
  className,
  textSize,
  light = false,
}: LogoProps) {
  if (variant === 'icon') {
    return <LogoIcon size={iconSize} className={className} />
  }

  // Auto-scale text relative to icon size
  const fontSize = textSize ?? (iconSize >= 40 ? 'text-2xl' : iconSize >= 32 ? 'text-xl' : 'text-base')

  return (
    <div className={cn('flex items-center gap-2.5 select-none', className)}>
      <LogoIcon size={iconSize} />
      <span
        className={cn(
          'font-bold tracking-tight leading-none',
          fontSize,
          light ? 'text-zinc-900' : 'text-white',
        )}
        style={{ letterSpacing: '-0.02em' }}
      >
        Convoy
        <span
          style={{
            background: 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fbbf24 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Link
        </span>
      </span>
    </div>
  )
}
