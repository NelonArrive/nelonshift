'use client'

import { AnimatedBackground } from '@/shared/components/landing/AnimatedBackground'
import { CTASection } from '@/shared/components/landing/CTASection'
import { FeaturesSection } from '@/shared/components/landing/FeaturesSection'
import { HeroSection } from '@/shared/components/landing/HeroSection'
import { HowItWorksSection } from '@/shared/components/landing/HowItWorksSection'
import { LandingFooter } from '@/shared/components/landing/LandingFooter'
import { LandingHeader } from '@/shared/components/landing/LandingHeader'

export default function Home() {
	return (
		<>
			<AnimatedBackground />
			<LandingHeader />
			<main className='relative z-10'>
				<HeroSection />
				<FeaturesSection />
				<HowItWorksSection />
				<CTASection />
			</main>
			<LandingFooter />
		</>
	)
}
