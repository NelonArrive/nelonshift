'use client'

import { ProjectsSort } from '@/features/project/projects-sort'

import { Card, Skeleton } from '@/shared/components/ui'
import { cn } from '@/shared/lib'

import { useProjects } from '../hooks'
import { useProjectsStore } from '../store'

import { ProjectItem } from './ProjectItem'
import { ProjectsPagination } from './ProjectsPagination'

export function ProjectsList() {
	const { viewMode } = useProjectsStore()
	const { data, isLoading, error } = useProjects()

	if (isLoading) {
		return (
			<section className='mt-6 space-y-3'>
				{Array.from({ length: 8 }).map((_, i) => (
					<Card key={i} className='p-4'>
						<Skeleton className='mb-2 h-6 w-2/3' />
						<Skeleton className='h-4 w-full' />
					</Card>
				))}
			</section>
		)
	}

	if (error)
		return <p className='mt-10 text-center'>Не удалось загрузить проекты 😢</p>

	if (!data?.content?.length)
		return (
			<p className='text-muted-foreground mt-10 text-center'>
				Проекты не нашлись, их просто нету...
			</p>
		)

	return (
		<div className='mb-10'>
			<ProjectsSort />
			<section
				className={cn(
					'mt-6',
					viewMode === 'grid'
						? 'grid grid-cols-1 gap-4 md:grid-cols-2'
						: 'space-y-4'
				)}
			>
				{data.content.map(project => (
					<ProjectItem key={project.id} project={project} />
				))}
			</section>
			<ProjectsPagination
				totalPages={data.totalPages}
				totalItems={data.totalElements}
			/>
		</div>
	)
}
