'use client'

import { AlertTriangle, Clock, DollarSign, Hash, TrendingUp } from 'lucide-react'

import { useDashboardStats } from '@/entities/dashboard'

import { NearestShifts } from '@/features/shift/nearest-shift'

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Skeleton
} from '@/shared/components/ui'

interface StatCardProps {
	title: string
	value: string | number
	icon: React.ReactNode
	description?: string
}

function StatCard({ title, value, icon, description }: StatCardProps) {
	return (
		<Card>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
				<CardTitle className='text-sm font-medium'>{title}</CardTitle>
				{icon}
			</CardHeader>
			<CardContent>
				<p className='text-2xl font-bold'>{value}</p>
				{description && (
					<p className='text-muted-foreground mt-1 text-xs'>{description}</p>
				)}
			</CardContent>
		</Card>
	)
}

export function DashboardStats() {
	const { data, isLoading, error } = useDashboardStats()

	if (isLoading) {
		return (
			<section className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
				{Array.from({ length: 4 }).map((_, i) => (
					<Card key={i}>
						<CardHeader>
							<Skeleton className='h-4 w-1/2' />
						</CardHeader>
						<CardContent>
							<Skeleton className='h-7 w-16' />
							<Skeleton className='mt-1 h-3 w-1/3' />
						</CardContent>
					</Card>
				))}
			</section>
		)
	}

	if (error) {
		return (
			<section className='flex items-center justify-center rounded-lg border border-red-200 bg-red-50 py-6 text-red-600 dark:border-red-900 dark:bg-red-950'>
				<AlertTriangle className='mr-2 h-5 w-5' />
				Не удалось загрузить статистику
			</section>
		)
	}

	return (
		<section className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
			<StatCard
				title='Активных проектов'
				value={data?.totalActiveProjects ?? 0}
				icon={<Clock className='h-4 w-4 text-muted-foreground' />}
				description={`${data?.totalCompletedProjects ?? 0} завершено`}
			/>

			<StatCard
				title='Заработок за месяц'
				value={`${(data?.currentMonthEarnings ?? 0).toLocaleString('ru-RU')} ₽`}
				icon={<DollarSign className='h-4 w-4 text-muted-foreground' />}
				description={`${(data?.totalEarnings ?? 0).toLocaleString('ru-RU')} ₽ всего`}
			/>

			<StatCard
				title='Часов за месяц'
				value={data?.currentMonthHours ?? 0}
				icon={<TrendingUp className='h-4 w-4 text-muted-foreground' />}
				description={`${data?.currentMonthShifts ?? 0} смен`}
			/>

			<StatCard
				title='Всего смен'
				value={data?.totalShifts ?? 0}
				icon={<Hash className='h-4 w-4 text-muted-foreground' />}
				description={`${data?.totalHours ?? 0} часов`}
			/>
		</section>
	)
}
