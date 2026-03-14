'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/useAuthStore'
import type { UserProfile } from '@/types'

export function useAuth() {
  const { user, isLoading, setUser, clearUser, setLoading } = useAuthStore()

  useEffect(() => {
    const supabase = createClient()

    // Get initial session
    supabase.auth.getUser().then(async ({ data: { user: authUser } }) => {
      if (!authUser) {
        clearUser()
        return
      }
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      setUser(profile as unknown as UserProfile)
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        clearUser()
        return
      }
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        setUser(profile as unknown as UserProfile)
      }
    })

    return () => subscription.unsubscribe()
  }, [setUser, clearUser, setLoading])

  return { user, isLoading }
}
