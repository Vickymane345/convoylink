import Link from 'next/link'
import { Shield, Twitter, Linkedin, Instagram } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white text-lg">
                Convoy<span className="text-orange-500">Link</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Nigeria's premier marketplace for convoy escort services, vehicle rental, and professional driver hire.
            </p>
            <div className="flex gap-3 mt-4">
              {[Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-8 w-8 flex items-center justify-center rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Services</h4>
            <ul className="space-y-2">
              {['Convoy Escort', 'Vehicle Rental', 'Driver Hire', 'Corporate Logistics'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Company</h4>
            <ul className="space-y-2">
              {['About', 'Blog', 'Careers', 'Press', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Legal</h4>
            <ul className="space-y-2">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Refund Policy'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-500">© 2025 ConvoyLink. All rights reserved.</p>
          <p className="text-xs text-zinc-500">Made in Nigeria 🇳🇬</p>
        </div>
      </div>
    </footer>
  )
}
