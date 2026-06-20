'use client'

import { AlertTriangle, Clock } from 'lucide-react'

import { useProjects } from '@/entities/project/hooks'

import { NearestShifts } from '@/features/shift/nearest-shift'

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Skeleton
} from '@/shared/components/ui'

export function DashboardStats() {
	const { data, isLoading, error } = useProjects()

	const projectsThisMonth =
		data?.content?.filter(p => {
			const created = new Date(p.createdAt)
			const now = new Date()
			return (
				created.getMonth() === now.getMonth() &&
				created.getFullYear() === now.getFullYear()
			)
		}).length ?? 0

	if (isLoading) {
		return (
			<section className='grid grid-cols-1 gap-6 sm:grid-cols-3'>
				{Array.from({ length: 3 }).map((_, i) => (
					<Card key={i}>
						<CardHeader>
							<Skeleton className='h-6 w-1/2' />
						</CardHeader>
						<CardContent>
							<Skeleton className='h-8 w-20' />
						</CardContent>
					</Card>
				))}
			</section>
		)
	}

	if (error) {
		return (
			<section className='mt-10 flex flex-col items-center text-center text-red-500'>
				<AlertTriangle className='mb-2 h-6 w-6' />
				<p>Не удалось загрузить статистику 😢</p>
			</section>
		)
	}

	return (
		<section className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2 text-lg'>
						<Clock className='h-5 w-5' /> Всего проектов
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className='text-3xl font-bold'>{data?.totalElements ?? 0}</p>
				</CardContent>
			</Card>

			<NearestShifts />

			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2 text-lg'>
						📅 В этом месяце
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className='text-3xl font-bold'>{projectsThisMonth}</p>
				</CardContent>
			</Card>
		</section>
	)
}
