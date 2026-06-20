'use client'

import { Button } from '@/shared/components/ui'

import { useProjectsStore } from '../store'
import { cn } from '@/shared/lib'

const filterOptions = [
	{ value: 'ALL', label: 'Всё' },
	{ value: 'PLANNED', label: 'Запланированные' },
	{ value: 'ACTIVE', label: 'Активные' },
	{ value: 'COMPLETED', label: 'Завершённые' }
] as const

export function ProjectsFilters() {
	const { statusFilter, setStatusFilter } = useProjectsStore()

	return (
		<div className='flex items-center gap-2'>
			{filterOptions.map(option => (
				<Button
					key={option.value}
					variant={statusFilter === option.value ? 'default' : 'outline'}
					size='sm'
					onClick={() => setStatusFilter(option.value)}
					className={cn(
						'transition-all duration-200',
						statusFilter === option.value && 'shadow-md'
					)}
				>
					{option.label}
				</Button>
			))}
		</div>
	)
}
