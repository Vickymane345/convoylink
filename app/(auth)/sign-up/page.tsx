'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock, User, Phone, Shield, Car, Truck, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/utils/helpers'

const schema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(11, 'Enter a valid Nigerian phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
  role: z.enum(['customer', 'provider', 'driver'] as const),
}).refine((d) => d.password === d.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
})
type FormData = z.infer<typeof schema>

type SignUpRole = 'customer' | 'provider' | 'driver'

const roles: { value: SignUpRole; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'customer',
    label: 'Customer',
    description: 'Book convoy services, hire drivers, rent vehicles',
    icon: <User className="h-5 w-5" />,
  },
  {
    value: 'provider',
    label: 'Service Provider',
    description: 'Offer convoy services, list your vehicles',
    icon: <Shield className="h-5 w-5" />,
  },
  {
    value: 'driver',
    label: 'Driver',
    description: 'Accept assignments, share GPS, earn income',
    icon: <Truck className="h-5 w-5" />,
  },
]

export default function SignUpPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'customer' },
  })

  const selectedRole = watch('role')

  const onSubmit = async (data: FormData) => {
    setAuthError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          phone: data.phone,
          role: data.role,
        },
      },
    })
    if (error) {
      setAuthError(error.message)
      return
    }
    setSuccess(true)
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md text-center"
      >
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm p-10">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Check your email</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            We sent a confirmation link to your email. Click it to activate your account, then sign in.
          </p>
          <Button asChild className="mt-6 w-full" size="lg">
            <Link href="/sign-in">Go to Sign In</Link>
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-lg"
    >
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="mt-1.5 text-sm text-zinc-400">Join Nigeria&apos;s premier convoy marketplace</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Role Selector */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">I want to</label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setValue('role', role.value)}
                  className={cn(
                    'relative flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all duration-200',
                    selectedRole === role.value
                      ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                      : 'border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300',
                  )}
                >
                  {role.icon}
                  <span className="text-xs font-medium leading-tight">{role.label}</span>
                  {selectedRole === role.value && (
                    <motion.div
                      layoutId="role-indicator"
                      className="absolute inset-0 rounded-xl border-2 border-orange-500"
                    />
                  )}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-zinc-500">
              {roles.find((r) => r.value === selectedRole)?.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Full Name</label>
              <Input
                placeholder="John Doe"
                icon={<User className="h-4 w-4" />}
                error={errors.full_name?.message}
                {...register('full_name')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Phone</label>
              <Input
                placeholder="08012345678"
                icon={<Phone className="h-4 w-4" />}
                error={errors.phone?.message}
                {...register('phone')}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              icon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register('email')}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  icon={<Lock className="h-4 w-4" />}
                  error={errors.password?.message}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-zinc-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Confirm</label>
              <Input
                type="password"
                placeholder="••••••••"
                icon={<Lock className="h-4 w-4" />}
                error={errors.confirm_password?.message}
                {...register('confirm_password')}
              />
            </div>
          </div>

          <AnimatePresence>
            {authError && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400"
              >
                {authError}
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-xs text-zinc-500">
            By signing up you agree to our{' '}
            <a href="#" className="text-orange-400 hover:underline">Terms of Service</a> and{' '}
            <a href="#" className="text-orange-400 hover:underline">Privacy Policy</a>.
          </p>

          <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
            Create Account
          </Button>
        </form>

        <div className="mt-5 text-center text-sm text-zinc-500">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-orange-400 hover:text-orange-300 font-medium">
            Sign In
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
