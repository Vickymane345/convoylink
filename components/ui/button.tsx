'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/helpers'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-orange-500 text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600 hover:shadow-orange-500/40',
        secondary:
          'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700',
        outline:
          'border border-zinc-700 bg-transparent text-white hover:bg-zinc-800',
        ghost:
          'text-zinc-300 hover:bg-zinc-800 hover:text-white',
        destructive:
          'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/25',
        glass:
          'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        default: 'h-10 px-5 text-sm',
        lg: 'h-12 px-8 text-base',
        xl: 'h-14 px-10 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
