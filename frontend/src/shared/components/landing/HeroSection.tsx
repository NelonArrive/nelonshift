'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

import { Button } from '@/shared/components/ui'

import { TypewriterText } from './TypewriterText'

const PHRASES = [
	'Для учёта смен',
	'Для управления проектами',
	'Для контроля рабочего времени',
	'Для учёта доходов',
	'Для роста продуктивности'
]

export function HeroSection() {
	return (
		<section className='relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-24 pb-16'>
			<div className='absolute inset-0'>
				<motion.div
					className='absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px]'
					animate={{
						x: [0, 100, -50, 0],
						y: [0, -80, 60, 0],
						scale: [1, 1.2, 0.9, 1]
					}}
					transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
				/>
				<motion.div
					className='absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px]'
					animate={{
						x: [0, -80, 50, 0],
						y: [0, 60, -80, 0],
						scale: [1, 0.9, 1.2, 1]
					}}
					transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
				/>
				<motion.div
					className='absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/8 blur-[100px]'
					animate={{
						x: [0, 60, -60, 0],
						y: [0, -40, 40, 0]
					}}
					transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
				/>
			</div>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 1 }}
				className='relative z-10 mx-auto max-w-4xl text-center'
			>
				<motion.div
					initial={{ opacity: 0, y: 20, scale: 0.95 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className='mb-8'
				>
					<span className='inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-400 backdrop-blur-sm'>
						<motion.span
							animate={{ rotate: [0, 15, -15, 0] }}
							transition={{ duration: 2, repeat: Infinity }}
						>
							<Sparkles className='h-4 w-4' />
						</motion.span>
						Управление сменами нового поколения
					</span>
				</motion.div>

				<motion.h1
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
					className='text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl'
				>
					<span className='bg-gradient-to-b from-white via-white/90 to-white/50 bg-clip-text text-transparent'>
						Nelon Shift
					</span>
				</motion.h1>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.7 }}
					className='mt-6'
				>
					<p className='mx-auto max-w-2xl text-xl sm:text-2xl'>
						<TypewriterText
							phrases={PHRASES}
							className='bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text font-medium text-transparent'
						/>
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.9 }}
					className='mt-8'
				>
					<p className='text-muted-foreground mx-auto max-w-xl text-lg'>
						Простое и удобное приложение для учёта смен. Отслеживайте время,
						управляйте проектами и контролируйте заработок.
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 1.1 }}
					className='mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row'
				>
					<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
						<Button asChild size='lg' className='group rounded-xl px-8 shadow-lg shadow-indigo-500/25'>
							<Link href='/auth/register'>
								Начать бесплатно
								<ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
							</Link>
						</Button>
					</motion.div>
					<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
						<Button asChild variant='outline' size='lg' className='rounded-xl px-8'>
							<a href='#features'>Узнать больше</a>
						</Button>
					</motion.div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 1.4 }}
					className='mt-16 flex items-center justify-center gap-6 text-sm text-neutral-500 sm:gap-8'
				>
					{['Бесплатно', 'Без карты', 'Мгновенный старт'].map((item, i) => (
						<motion.div
							key={item}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 1.5 + i * 0.1 }}
							className='flex items-center gap-2'
						>
							<motion.div
								className='h-2 w-2 rounded-full bg-emerald-500'
								animate={{ scale: [1, 1.3, 1] }}
								transition={{
									duration: 2,
									repeat: Infinity,
									delay: i * 0.3
								}}
							/>
							{item}
						</motion.div>
					))}
				</motion.div>
			</motion.div>
		</section>
	)
}
