'use client'

import { useAuth } from '@/hooks/useAuth'

// Mounts auth listener at the top of the app tree
export function AuthProvider({ children }: { children: React.ReactNode }) {
  useAuth()
  return <>{children}</>
}
