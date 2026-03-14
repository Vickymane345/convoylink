'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Shield, Car, UserCheck, MapPin, Calendar, FileText,
  ArrowRight, ArrowLeft, CheckCircle2, Clock, AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useAuthStore } from '@/store/useAuthStore'
import {
  calculateBookingPrice,
  calculateVehicleBookingPrice,
  type BookingPriceBreakdown,
} from '@/services/bookingService'
import { formatCurrency, formatDateTime } from '@/utils/helpers'
import Link from 'next/link'

const schema = z.object({
  pickup_location: z.string().min(5, 'Enter a full pickup address'),
  dropoff_location: z.string().min(5, 'Enter a full destination address'),
  scheduled_date: z.string().min(1, 'Select a date'),
  scheduled_time: z.string().min(1, 'Select a time'),
  estimated_km: z.coerce.number().min(1).optional(),
  days: z.coerce.number().min(1).optional(),
  notes: z.string().optional(),
})
type FormData = z.infer<typeof schema>

const STEPS = ['Service', 'Details', 'Review', 'Confirm']

interface Props {
  serviceType: 'convoy' | 'vehicle' | 'driver'
  serviceId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  serviceData: any
  providerId: string
}

const serviceIcons = {
  convoy: <Shield className="h-6 w-6 text-orange-400" />,
  vehicle: <Car className="h-6 w-6 text-blue-400" />,
  driver: <UserCheck className="h-6 w-6 text-green-400" />,
}

const serviceColors = {
  convoy: 'orange',
  vehicle: 'blue',
  driver: 'green',
}

export function BookingWizard({ serviceType, serviceId, serviceData, providerId }: Props) {
  const [step, setStep] = useState(0)
  const [breakdown, setBreakdown] = useState<BookingPriceBreakdown | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuthStore()
  const router = useRouter()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: { days: undefined, estimated_km: undefined },
  })

  const watchedKm = watch('estimated_km')
  const watchedDays = watch('days')
  const watchedDate = watch('scheduled_date')
  const watchedTime = watch('scheduled_time')

  const getServiceName = () => {
    if (!serviceData) return serviceType
    if (serviceType === 'convoy') return serviceData.title
    if (serviceType === 'vehicle') return `${serviceData.make} ${serviceData.model} (${serviceData.year})`
    if (serviceType === 'driver') return serviceData.profile?.full_name ?? 'Driver'
    return serviceType
  }

  const computeBreakdown = (data: FormData): BookingPriceBreakdown => {
    if (!serviceData) return { base_price: 0, distance_cost: 0, subtotal: 0, platform_fee: 0, total: 0, provider_amount: 0 }
    if (serviceType === 'convoy') {
      return calculateBookingPrice(
        serviceData.base_price,
        serviceData.price_per_km,
        data.estimated_km ?? 50,
      )
    }
    const dailyRate = serviceType === 'vehicle' ? serviceData.daily_rate : 15000
    return calculateVehicleBookingPrice(dailyRate, data.days ?? 1)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDetailsSubmit = handleSubmit((data: any) => {
    setBreakdown(computeBreakdown(data as FormData))
    setStep(2)
  })

  const onConfirm = async (data: FormData): Promise<void> => {
    if (!user) { router.push('/sign-in?redirectTo=/book'); return }
    setSubmitting(true)
    setError(null)

    const scheduled_at = new Date(`${data.scheduled_date}T${data.scheduled_time}`).toISOString()
    const bd = computeBreakdown(data)

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: user.id,
          service_type: serviceType,
          service_id: serviceId,
          pickup_location: data.pickup_location,
          dropoff_location: data.dropoff_location,
          scheduled_at,
          total_amount: bd.total,
          platform_fee: bd.platform_fee,
          provider_amount: bd.provider_amount,
          provider_id: providerId,
          notes: data.notes,
        }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Booking failed')

      setBookingId(json.data.id)
      setStep(3)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  // Success screen
  if (step === 3 && bookingId) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.1 }}
              className="flex justify-center mb-6"
            >
              <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-400" />
              </div>
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
            <p className="text-zinc-400 text-sm mb-2">
              Your {serviceType} booking has been created successfully.
            </p>
            <p className="text-xs text-zinc-600 mb-8">Booking ID: {bookingId.slice(0, 8).toUpperCase()}</p>

            <div className="rounded-xl bg-orange-500/10 border border-orange-500/20 p-4 mb-8 text-left">
              <p className="text-sm text-orange-300 font-medium mb-1">Next Step: Payment</p>
              <p className="text-xs text-zinc-400">
                Complete payment to confirm your booking. Funds are held securely in escrow until your trip is complete.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link href={`/dashboard/bookings`}>
                <Button className="w-full" size="lg">View My Bookings</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" className="w-full">Go to Dashboard</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // Auth guard
  if (!user && step >= 1) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-sm text-center rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8">
          <AlertCircle className="h-10 w-10 text-orange-400 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-white mb-2">Sign in to continue</h2>
          <p className="text-sm text-zinc-400 mb-6">You need an account to book a service.</p>
          <Link href={`/sign-in?redirectTo=/book?service=${serviceType}&id=${serviceId}`}>
            <Button className="w-full">Sign In</Button>
          </Link>
          <Link href={`/sign-up`}>
            <Button variant="ghost" className="w-full mt-2">Create Account</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* Progress Steps */}
      <div className="mb-10">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-4 h-px bg-zinc-800 -z-0" />
          {STEPS.map((s, i) => (
            <div key={s} className="relative z-10 flex flex-col items-center gap-2">
              <motion.div
                animate={{
                  backgroundColor: i <= step ? '#f97316' : '#27272a',
                  borderColor: i <= step ? '#f97316' : '#3f3f46',
                  scale: i === step ? 1.1 : 1,
                }}
                className="h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white"
              >
                {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </motion.div>
              <span className={`text-xs hidden sm:block ${i === step ? 'text-white font-medium' : 'text-zinc-600'}`}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 0: Service Summary */}
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="text-xl font-bold text-white mb-6">Review Your Selection</h2>

            {!serviceId ? (
              <Card className="mb-6">
                <CardContent className="p-6 text-center text-zinc-400">
                  <p>No service selected. Please go back and choose a service.</p>
                  <Link href={`/${serviceType}`}>
                    <Button variant="outline" className="mt-4">Browse {serviceType}s</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`h-14 w-14 rounded-2xl bg-${serviceColors[serviceType]}-500/10 flex items-center justify-center`}>
                      {serviceIcons[serviceType]}
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1 capitalize">{serviceType} Service</p>
                      <h3 className="text-lg font-bold text-white">{getServiceName()}</h3>
                    </div>
                  </div>

                  {serviceType === 'convoy' && serviceData && (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Base Price</span>
                        <span className="text-white">{formatCurrency(serviceData.base_price)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Rate per km</span>
                        <span className="text-white">{formatCurrency(serviceData.price_per_km)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Max Distance</span>
                        <span className="text-white">{serviceData.max_distance_km} km</span>
                      </div>
                    </div>
                  )}

                  {serviceType === 'vehicle' && serviceData && (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Daily Rate</span>
                        <span className="text-white">{formatCurrency(serviceData.daily_rate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Plate Number</span>
                        <span className="text-white">{serviceData.plate_number}</span>
                      </div>
                    </div>
                  )}

                  {serviceType === 'driver' && serviceData && (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Experience</span>
                        <span className="text-white">{serviceData.years_experience} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Rating</span>
                        <span className="text-white">{serviceData.rating > 0 ? `${serviceData.rating}/5` : 'New'}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Button
              className="w-full"
              size="lg"
              onClick={() => {
                if (!user) { router.push(`/sign-in?redirectTo=/book?service=${serviceType}&id=${serviceId}`); return }
                setStep(1)
              }}
              disabled={!serviceId}
            >
              Continue to Details
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {/* Step 1: Details Form */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="text-xl font-bold text-white mb-6">Booking Details</h2>

            <form onSubmit={onDetailsSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  <MapPin className="inline h-4 w-4 mr-1 text-orange-400" />
                  Pickup Location
                </label>
                <Input
                  placeholder="Enter full pickup address"
                  error={errors.pickup_location?.message}
                  {...register('pickup_location')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  <MapPin className="inline h-4 w-4 mr-1 text-green-400" />
                  Destination
                </label>
                <Input
                  placeholder="Enter full destination address"
                  error={errors.dropoff_location?.message}
                  {...register('dropoff_location')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Date
                  </label>
                  <Input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    error={errors.scheduled_date?.message}
                    {...register('scheduled_date')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                    <Clock className="inline h-4 w-4 mr-1" />
                    Time
                  </label>
                  <Input
                    type="time"
                    error={errors.scheduled_time?.message}
                    {...register('scheduled_time')}
                  />
                </div>
              </div>

              {serviceType === 'convoy' && (
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                    Estimated Distance (km)
                  </label>
                  <Input
                    type="number"
                    min={1}
                    placeholder="50"
                    error={errors.estimated_km?.message}
                    {...register('estimated_km')}
                  />
                  {watchedKm && serviceData && (
                    <p className="text-xs text-zinc-500 mt-1">
                      Distance cost: {formatCurrency(serviceData.price_per_km * watchedKm)}
                    </p>
                  )}
                </div>
              )}

              {(serviceType === 'vehicle' || serviceType === 'driver') && (
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                    Number of Days
                  </label>
                  <Input
                    type="number"
                    min={1}
                    placeholder="1"
                    error={errors.days?.message}
                    {...register('days')}
                  />
                  {watchedDays && serviceData && (
                    <p className="text-xs text-zinc-500 mt-1">
                      {watchedDays} day{watchedDays > 1 ? 's' : ''} × {formatCurrency(serviceType === 'vehicle' ? serviceData.daily_rate : 15000)}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  <FileText className="inline h-4 w-4 mr-1" />
                  Additional Notes (optional)
                </label>
                <textarea
                  placeholder="Any special requirements or instructions..."
                  rows={3}
                  className="flex w-full rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  {...register('notes')}
                />
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep(0)} className="flex-1">
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button type="submit" className="flex-1">
                  Review Order <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Step 2: Review & Confirm */}
        {step === 2 && breakdown && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="text-xl font-bold text-white mb-6">Review Your Booking</h2>

            <div className="space-y-4 mb-6">
              {/* Service */}
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    {serviceIcons[serviceType]}
                    <div>
                      <p className="text-xs text-zinc-500 capitalize">{serviceType} Service</p>
                      <p className="text-sm font-semibold text-white">{getServiceName()}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-zinc-500 text-xs">Pickup</p>
                      <p className="text-zinc-200 text-sm mt-0.5 truncate">{watch('pickup_location')}</p>
                    </div>
                    <div>
                      <p className="text-zinc-500 text-xs">Destination</p>
                      <p className="text-zinc-200 text-sm mt-0.5 truncate">{watch('dropoff_location')}</p>
                    </div>
                    <div>
                      <p className="text-zinc-500 text-xs">Date & Time</p>
                      <p className="text-zinc-200 text-sm mt-0.5">
                        {watchedDate && watchedTime
                          ? formatDateTime(`${watchedDate}T${watchedTime}`)
                          : '—'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Price Breakdown */}
              <Card>
                <CardContent className="p-5">
                  <h3 className="text-sm font-semibold text-white mb-4">Price Breakdown</h3>
                  <div className="space-y-2.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Base price</span>
                      <span className="text-zinc-300">{formatCurrency(breakdown.base_price)}</span>
                    </div>
                    {breakdown.distance_cost > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Distance cost ({watch('estimated_km')} km)</span>
                        <span className="text-zinc-300">{formatCurrency(breakdown.distance_cost)}</span>
                      </div>
                    )}
                    {watch('days') && watch('days')! > 1 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Duration ({watch('days')} days)</span>
                        <span className="text-zinc-300">{formatCurrency(breakdown.base_price)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Subtotal</span>
                      <span className="text-zinc-300">{formatCurrency(breakdown.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Platform fee (10%)</span>
                      <span className="text-zinc-300">{formatCurrency(breakdown.platform_fee)}</span>
                    </div>
                    <div className="h-px bg-zinc-700 my-2" />
                    <div className="flex justify-between text-base font-bold">
                      <span className="text-white">Total</span>
                      <span className="text-orange-400">{formatCurrency(breakdown.total)}</span>
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg bg-zinc-800/60 p-3 text-xs text-zinc-400">
                    💳 Payment will be held in escrow until your trip is complete.
                    You&apos;ll be redirected to Stripe to complete payment after booking.
                  </div>
                </CardContent>
              </Card>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400"
              >
                {error}
              </motion.div>
            )}

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                <ArrowLeft className="h-4 w-4" /> Edit Details
              </Button>
              <Button
                className="flex-1"
                size="lg"
                loading={submitting}
                onClick={() => handleSubmit(onConfirm as any)()}
              >
                Confirm Booking
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
