import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/DashboardShell'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/sign-in')

  // Use service role to bypass RLS when reading the profile role
  const admin = await createAdminClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (admin as any)
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single() as { data: { role: string } | null }

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard')
  }

  return <DashboardShell>{children}</DashboardShell>
}
