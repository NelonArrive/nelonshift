'use client'

import { motion } from 'framer-motion'
import { BarChart3, Plus, UserPlus } from 'lucide-react'

const steps = [
	{
		icon: UserPlus,
		number: '01',
		title: 'Регистрация',
		description: 'Создайте аккаунт за секунду. Используйте email или войдите через Google.'
	},
	{
		icon: Plus,
		number: '02',
		title: 'Добавьте проект',
		description: 'Создайте проект с датами начала и конца. Укажите ставку за смену.'
	},
	{
		icon: BarChart3,
		number: '03',
		title: 'Отслеживайте',
		description: 'Добавляйте смены, смотрите статистику и экспортируйте отчёты.'
	}
]

export function HowItWorksSection() {
	return (
		<section id='how-it-works' className='relative px-4 py-24'>
			<div className='mx-auto max-w-4xl'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-100px' }}
					transition={{ duration: 0.6 }}
					className='mb-16 text-center'
				>
					<h2 className='text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl'>
						Как работает
					</h2>
					<p className='text-muted-foreground mx-auto mt-4 max-w-xl text-lg'>
						Три простых шага чтобы начать
					</p>
				</motion.div>

				<div className='relative space-y-12'>
					<div className='absolute top-0 bottom-0 left-6 hidden w-px bg-gradient-to-b from-transparent via-border to-transparent sm:block' />

					{steps.map((step, index) => (
						<motion.div
							key={step.number}
							initial={{ opacity: 0, x: -20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true, margin: '-50px' }}
							transition={{ duration: 0.6, delay: index * 0.15 }}
							className='relative flex items-start gap-6'
						>
							<div className='bg-background relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border shadow-sm'>
								<span className='text-sm font-bold text-indigo-500'>
									{step.number}
								</span>
							</div>
							<div>
								<h3 className='text-xl font-semibold'>{step.title}</h3>
								<p className='text-muted-foreground mt-2 leading-relaxed'>
									{step.description}
								</p>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}
