'use client'

import { motion } from 'framer-motion'
import {
	BarChart3,
	Calendar,
	Clock,
	DollarSign,
	Smartphone,
	Shield,
	Target,
	TrendingUp,
	Zap
} from 'lucide-react'

const features = [
	{
		icon: Calendar,
		title: 'Учёт смен',
		description: 'Добавляйте смены за секунды. Автоматический расчёт часов и оплаты.',
		color: 'from-blue-500 to-cyan-500'
	},
	{
		icon: Target,
		title: 'Управление проектами',
		description: 'Организуйте смены по проектам. Фильтры, сортировка, поиск.',
		color: 'from-purple-500 to-pink-500'
	},
	{
		icon: DollarSign,
		title: 'Контроль доходов',
		description: 'Отслеживайте заработок в реальном времени. Графики и статистика.',
		color: 'from-emerald-500 to-teal-500'
	},
	{
		icon: TrendingUp,
		title: 'Аналитика',
		description: 'Дашборд с ключевыми метриками. Топ проектов, помесячный анализ.',
		color: 'from-orange-500 to-amber-500'
	},
	{
		icon: Clock,
		title: 'Переработки',
		description: 'Автоматический расчёт переработок и суточных. Никаких ошибок.',
		color: 'from-rose-500 to-red-500'
	},
	{
		icon: Zap,
		title: 'Экспорт в Excel',
		description: 'Скачивайте отчёты в один клик. Готовые таблицы для бухгалтерии.',
		color: 'from-violet-500 to-indigo-500'
	},
	{
		icon: Smartphone,
		title: 'Мобильная версия',
		description: 'Работает на любом устройстве. Добавляйте смены прямо со смартфона.',
		color: 'from-cyan-500 to-blue-500'
	},
	{
		icon: Shield,
		title: 'Безопасность',
		description: 'JWT-авторизация, OAuth2. Ваши данные под надёжной защитой.',
		color: 'from-pink-500 to-rose-500'
	},
	{
		icon: BarChart3,
		title: 'Графики',
		description: 'Наглядные графики заработка и смен. Визуальный анализ данных.',
		color: 'from-amber-500 to-orange-500'
	}
]

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.08
		}
	}
}

const cardVariants = {
	hidden: { opacity: 0, y: 50, scale: 0.95 },
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] as const }
	}
}

export function FeaturesSection() {
	return (
		<section id='features' className='relative px-4 py-24'>
			<div className='mx-auto max-w-6xl'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-100px' }}
					transition={{ duration: 0.6 }}
					className='mb-16 text-center'
				>
					<h2 className='text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl'>
						Всё что нужно
					</h2>
					<p className='text-muted-foreground mx-auto mt-4 max-w-2xl text-lg'>
						Мощные инструменты для управления сменами, проектами и доходами
					</p>
				</motion.div>

				<motion.div
					variants={containerVariants}
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true, margin: '-50px' }}
					className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
				>
					{features.map((feature, index) => (
						<motion.div
							key={feature.title}
							variants={cardVariants}
							whileHover={{
								y: -8,
								scale: 1.02,
								transition: { duration: 0.3 }
							}}
							className='group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/5 backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/10'
						>
							<motion.div
								className='absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl'
								style={{
									background: `linear-gradient(135deg, ${
										feature.color.includes('blue') ? '#3b82f6' :
										feature.color.includes('purple') ? '#a855f7' :
										feature.color.includes('emerald') ? '#10b981' :
										feature.color.includes('orange') ? '#f97316' :
										feature.color.includes('rose') ? '#f43f5e' :
										feature.color.includes('violet') ? '#8b5cf6' :
										feature.color.includes('cyan') ? '#06b6d4' :
										feature.color.includes('pink') ? '#ec4899' :
										'#f59e0b'
									}, transparent)`
								}}
								initial={{ opacity: 0, scale: 0.5 }}
								whileHover={{ opacity: 0.15, scale: 1.2 }}
								transition={{ duration: 0.4 }}
							/>
							<div className={`inline-flex rounded-xl bg-gradient-to-br p-3 ${feature.color}`}>
								<feature.icon className='h-5 w-5 text-white' />
							</div>
							<h3 className='mt-4 text-lg font-semibold'>{feature.title}</h3>
							<p className='text-muted-foreground mt-2 text-sm leading-relaxed'>
								{feature.description}
							</p>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	)
}
