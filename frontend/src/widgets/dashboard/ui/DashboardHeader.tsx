'use client'

import { useAuth } from '@/features/auth/providers/AuthProvider'
import { ProjectFormDialog } from '@/entities/project/ui'
import { Avatar } from '@/shared/components/ui/Avatar'

export function DashboardHeader() {
	const { user } = useAuth()

	const name = user?.name ?? 'Гость'

	return (
		<div className='flex items-center justify-between gap-4'>
			<div className='flex items-center gap-3'>
				<Avatar name={name} size='lg' />
				<div>
					<h1 className='text-xl font-bold tracking-tight sm:text-2xl'>
						Привет, {name.split(' ')[0]} 👋
					</h1>
					<p className='text-muted-foreground mt-0.5 text-sm'>
						Управляй сменами и отслеживай заработок
					</p>
				</div>
			</div>

			<ProjectFormDialog mode='create' />
		</div>
	)
}
