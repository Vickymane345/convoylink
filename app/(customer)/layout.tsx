import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/DashboardShell'

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/sign-in')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single() as { data: { role: string } | null }

  // Redirect drivers/providers to their own dashboards
  if (profile?.role === 'admin') redirect('/admin/dashboard')
  if (profile?.role === 'provider') redirect('/provider/dashboard')
  if (profile?.role === 'driver') redirect('/driver/dashboard')

  return <DashboardShell>{children}</DashboardShell>
}
