'use client'

import {
	ProjectSearch,
	ProjectsFilters,
	ProjectsList
} from '@/entities/project/ui'

import { DashboardHeader } from './DashboardHeader'
import { DashboardStats } from './DashboardStats'
import { EarningsBarChart } from './EarningsBarChart'
import { ShiftsDonutChart } from './ShiftsDonutChart'
import { TopProjects } from './TopProjects'

export function Dashboard() {
	return (
		<div className='mt-8 w-full max-w-3xl space-y-6 px-4 sm:px-0'>
			<DashboardHeader />

			<DashboardStats />

			<div className='grid grid-cols-1 gap-4 lg:grid-cols-5'>
				<div className='lg:col-span-3'>
					<EarningsBarChart />
				</div>
				<div className='lg:col-span-2'>
					<ShiftsDonutChart />
				</div>
			</div>

			<TopProjects />

			<div className='space-y-4'>
			<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
				<h2 className='text-lg font-semibold'>Все проекты</h2>
				<div className='flex items-center gap-3'>
					<ProjectsFilters />
					<ProjectSearch />
				</div>
			</div>
				<ProjectsList />
			</div>
		</div>
	)
}
