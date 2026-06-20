'use client'

import { AlertTriangle, Calendar } from 'lucide-react'

import { useProjectById } from '@/entities/project/hooks'
import { ProjectDetailHeader } from '@/entities/project/ui'
import { useShifts } from '@/entities/shift/hooks/useShifts'
import { ShiftsList } from '@/entities/shift/ui'

import { ShiftFormDialog } from '@/features/shift/shift-form'

import { Card, CardContent, Skeleton } from '@/shared/components/ui'

import { useProjectStats } from '../../hooks/useProjectStats'

import { ProjectDetailStats } from './ProjectDetailStats'

export function ProjectDetail({ projectId }: { projectId: number }) {
	const { data: project, isLoading, error } = useProjectById(projectId)
	const { data: shifts } = useShifts(projectId)

	const stats = useProjectStats(
		shifts ?? [],
		project?.startDate
			? {
					from: project.startDate,
					to: project.endDate || project.startDate
				}
			: undefined
	)

	if (isLoading) {
		return (
			<section className='space-y-4'>
				{Array.from({ length: 3 }).map((_, i) => (
					<Card key={i}>
						<CardContent className='p-6'>
							<Skeleton className='mb-2 h-6 w-1/2' />
							<Skeleton className='h-8 w-24' />
						</CardContent>
					</Card>
				))}
			</section>
		)
	}

	if (error || !project) {
		return (
			<section className='mt-10 flex flex-col items-center text-center text-red-500'>
				<AlertTriangle className='mb-2 h-6 w-6' />
				<p>Не удалось загрузить проект 😢</p>
			</section>
		)
	}

	if (!shifts?.length) {
		return (
			<div className='space-y-6'>
				<ProjectDetailHeader project={project} />
				<Card>
					<CardContent className='py-12 text-center'>
						<Calendar className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
						<h3 className='mb-2 text-lg font-semibold'>Смен пока нет</h3>
						<p className='text-muted-foreground mb-4'>
							Добавьте первую смену, чтобы начать отслеживать работу по проекту
						</p>
						<ShiftFormDialog projectId={project.id} mode='create' />
					</CardContent>
				</Card>
			</div>
		)
	}

	return (
		<section className='space-y-6'>
			<ProjectDetailHeader shifts={shifts} project={project} isAddShiftButton />
			<ProjectDetailStats
				shiftsCount={shifts.length}
				period={stats.period}
				totalEarnings={stats.totalEarnings}
				payPerShift={stats.payPerShift}
			/>
			<ShiftsList shifts={shifts} projectId={project.id} />
		</section>
	)
}
