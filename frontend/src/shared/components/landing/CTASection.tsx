'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { Button } from '@/shared/components/ui'

export function CTASection() {
	return (
		<section className='relative px-4 py-24'>
			<div className='mx-auto max-w-4xl'>
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-100px' }}
					transition={{ duration: 0.8 }}
					className='relative overflow-hidden rounded-3xl border border-white/10 p-8 sm:p-12 md:p-16'
				>
					<div className='absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent' />
					<div className='absolute -top-24 -right-24 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl' />
					<div className='absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl' />

					<div className='relative z-10 text-center'>
						<h2 className='text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl'>
							Готовы начать?
						</h2>
						<p className='text-muted-foreground mx-auto mt-4 max-w-xl text-lg'>
							Присоединяйтесь к тысячам пользователей, которые уже контролируют
							свои смены и доходы.
						</p>
						<div className='mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row'>
							<Button asChild size='lg' className='group px-8'>
								<Link href='/auth/register'>
									Создать аккаунт бесплатно
									<ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
								</Link>
							</Button>
						</div>
						<p className='text-muted-foreground mt-4 text-sm'>
							Бесплатно · Без карты · Отмена в любое время
						</p>
					</div>
				</motion.div>
			</div>
		</section>
	)
}
