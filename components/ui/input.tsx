import * as React from 'react'
import { cn } from '@/utils/helpers'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">{icon}</div>
        )}
        <input
          type={type}
          className={cn(
            'flex h-11 w-full rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-sm text-white placeholder:text-zinc-500',
            'transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50',
            icon && 'pl-10',
            error && 'border-red-500 focus:ring-red-500',
            className,
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input }
