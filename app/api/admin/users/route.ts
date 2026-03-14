import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single() as { data: { role: string } | null }

    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { user_id, action } = await request.json()
    if (!user_id || !action) return NextResponse.json({ error: 'user_id and action required' }, { status: 400 })

    const admin = await createAdminClient()

    if (action === 'verify') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (admin as any).from('user_profiles').update({ is_verified: true }).eq('id', user_id)
    } else if (action === 'unverify') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (admin as any).from('user_profiles').update({ is_verified: false }).eq('id', user_id)
    } else if (action === 'suspend') {
      // Mark user as suspended in profile
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (admin as any).from('user_profiles').update({ is_verified: false, role: 'customer' }).eq('id', user_id)
    } else {
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Admin user action error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
