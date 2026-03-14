import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { AuthProvider } from '@/components/layout/AuthProvider'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'ConvoyLink — Nigeria\'s Convoy & Logistics Marketplace',
    template: '%s | ConvoyLink',
  },
  description:
    'Book convoy escort services, hire professional drivers, rent vehicles, and track convoys in real-time across Nigeria.',
  keywords: ['convoy', 'escort', 'driver hire', 'vehicle rental', 'Nigeria', 'logistics', 'security'],
  authors: [{ name: 'ConvoyLink' }],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    siteName: 'ConvoyLink',
    images: [{ url: '/logo.svg', width: 200, height: 48, alt: 'ConvoyLink' }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-white`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
