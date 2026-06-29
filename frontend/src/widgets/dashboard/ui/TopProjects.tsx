'use client'

import { AlertTriangle, Award } from 'lucide-react'
import Link from 'next/link'

import { useDashboardStats } from '@/entities/dashboard'

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Skeleton
} from '@/shared/components/ui'

export function TopProjects() {
	const { data, isLoading, error } = useDashboardStats()

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<Skeleton className='h-6 w-1/3' />
				</CardHeader>
				<CardContent>
					<div className='space-y-3'>
						{Array.from({ length: 3 }).map((_, i) => (
							<Skeleton key={i} className='h-12 w-full' />
						))}
					</div>
				</CardContent>
			</Card>
		)
	}

	if (error) {
		return (
			<Card>
				<CardContent className='flex items-center justify-center py-8 text-red-500'>
					<AlertTriangle className='mr-2 h-5 w-5' />
					Ошибка загрузки
				</CardContent>
			</Card>
		)
	}

	const topProjects = data?.topProjects ?? []

	if (topProjects.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2 text-lg'>
						<Award className='h-5 w-5' /> Топ проектов
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className='text-muted-foreground py-4 text-center text-sm'>
						Пока нет данных о заработке
					</p>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className='flex items-center gap-2 text-lg'>
					<Award className='h-5 w-5' /> Топ проектов за месяц
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='space-y-3'>
					{topProjects.map((project, index) => (
						<Link
							key={project.id}
							href={`/projects/${project.id}`}
							className='hover:bg-muted flex items-center justify-between rounded-lg p-3 transition-colors'
						>
							<div className='flex items-center gap-3'>
								<span className='text-muted-foreground flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300'>
									{index + 1}
								</span>
								<div>
									<p className='font-medium'>{project.name}</p>
									<p className='text-muted-foreground text-sm'>
										{project.shiftCount} смен
									</p>
								</div>
							</div>
							<div className='text-right'>
								<p className='font-medium'>
									{project.totalEarnings.toLocaleString('ru-RU')} ₽
								</p>
								<p className='text-muted-foreground text-sm'>
									{project.hourlyRate.toLocaleString('ru-RU')} ₽/час
								</p>
							</div>
						</Link>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
