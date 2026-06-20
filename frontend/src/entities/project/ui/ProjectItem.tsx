'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { useShifts } from '@/entities/shift/hooks/useShifts'

import { ShiftFormDialog } from '@/features/shift/shift-form'

import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from '@/shared/components/ui'

import { useProjectStats } from '../hooks/useProjectStats'
import { TypeProjectItem } from '../model'
import { useProjectsStore } from '../store'

import { ProjectStatusBadge } from './ProjectStatus'

export function ProjectItem({ project }: { project: TypeProjectItem }) {
	const { data: shifts = [], error, isLoading } = useShifts(project.id)
	const stats = useProjectStats(
		shifts,
		project?.startDate
			? {
					from: project.startDate,
					to: project.endDate || project.startDate
				}
			: undefined
	)
	const { viewMode } = useProjectsStore()

	const isGrid = viewMode === 'grid'
	const hasShifts = shifts.length > 0

	const projectStats = hasShifts ? (
		<div className='space-y-2 text-sm'>
			<div className='flex justify-between gap-2'>
				<span className='text-muted-foreground'>Период:</span>
				<span className={`${isGrid ? 'text-right' : ''} font-medium`}>
					{stats.period}
				</span>
			</div>
			<div className='flex justify-between'>
				<span className='text-muted-foreground'>За смену:</span>
				<span className='font-semibold'>{stats.payPerShift} ₽</span>
			</div>
			<div className='flex justify-between gap-2'>
				<span className='text-muted-foreground'>
					{isGrid ? 'Всего:' : 'Всего по проекту:'}
				</span>
				<span className={`${isGrid ? 'text-base' : ''} font-semibold`}>
					{stats.totalEarnings} ₽
				</span>
			</div>
		</div>
	) : (
		<div className='text-muted-foreground flex items-center justify-center py-4 text-sm'>
			<p>Смены еще не добавлены</p>
		</div>
	)

	const projectHeader = (
		<div className='flex items-start justify-between gap-3'>
			<div className='min-w-0 flex-1'>
				<CardTitle
					className={`${isGrid ? 'mb-2 text-lg' : 'text-xl'} font-semibold`}
				>
					{project.name}
				</CardTitle>
				{isGrid && <ProjectStatusBadge status={project.status} />}
			</div>
			<div className='flex items-center gap-1.5'>
				{project.status !== 'COMPLETED' && (
					<ShiftFormDialog
						projectId={project.id}
						iconOnly={isGrid}
						mode='create'
					/>
				)}
				<Link href={`/projects/${project.id}`}>
					<Button size={isGrid ? 'icon' : 'sm'} variant='secondary'>
						{isGrid ? (
							<ArrowRight className='h-4 w-4' />
						) : (
							<>
								Подробнее <ArrowRight className='ml-2 h-4 w-4' />
							</>
						)}
					</Button>
				</Link>
			</div>
		</div>
	)

	if (isGrid) {
		return (
			<Card className='group transition-all hover:shadow-md'>
				<CardHeader>{projectHeader}</CardHeader>
				<CardContent className='space-y-3 pt-0'>{projectStats}</CardContent>
			</Card>
		)
	}

	return (
		<Card>
			<CardHeader className='flex flex-row items-center justify-between'>
				<div className='flex items-center gap-3'>
					<CardTitle className='text-xl font-bold'>{project.name}</CardTitle>
					<ProjectStatusBadge status={project.status} />
				</div>
				<div className='flex gap-2'>
					{project.status !== 'COMPLETED' && (
						<ShiftFormDialog projectId={project.id} mode='create' />
					)}
					<Link href={`/projects/${project.id}`}>
						<Button size='sm' variant='secondary'>
							Подробнее <ArrowRight className='ml-2 h-4 w-4' />
						</Button>
					</Link>
				</div>
			</CardHeader>
			<CardContent>{projectStats}</CardContent>
		</Card>
	)
}
