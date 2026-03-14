import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sign In',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Top bar */}
      <div className="px-6 py-5">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 shadow-lg shadow-orange-500/30">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-white text-lg">
            Convoy<span className="text-orange-500">Link</span>
          </span>
        </Link>
      </div>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </div>
    </div>
  )
}
