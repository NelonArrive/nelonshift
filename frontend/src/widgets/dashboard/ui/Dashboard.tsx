'use client'

import {
	ProjectSearch,
	ProjectsFilters,
	ProjectsList
} from '@/entities/project/ui'

import { DashboardHeader } from './DashboardHeader'
import { DashboardStats } from './DashboardStats'

export function Dashboard() {
	return (
		<div className='mt-8 w-3xl space-y-5'>
			<DashboardHeader description='Собирай смены по проектам и следи за статистикой' />
			<div className='mb-6 flex items-center justify-between gap-4'>
				<ProjectsFilters />
				<ProjectSearch />
			</div>
			<DashboardStats />
			<ProjectsList />
		</div>
	)
}
