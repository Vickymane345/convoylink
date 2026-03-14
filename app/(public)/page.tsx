import { HeroSection } from '@/features/landing/HeroSection'
import { ServicesSection } from '@/features/landing/ServicesSection'
import { StatsSection } from '@/features/landing/StatsSection'
import { HowItWorksSection } from '@/features/landing/HowItWorksSection'
import { TestimonialsSection } from '@/features/landing/TestimonialsSection'
import { CtaSection } from '@/features/landing/CtaSection'

export default function HomePage() {
  return (
    <div className="bg-zinc-950">
      <HeroSection />
      <ServicesSection />
      <StatsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CtaSection />
    </div>
  )
}
