import { ProjectFormDialog } from '@/entities/project/ui'

export function DashboardHeader({ description }: { description: string }) {
	return (
		<div className='flex justify-between'>
			<div>
				<h1 className='text-foreground flex items-center gap-2 text-3xl font-bold'>
					📊 Мои проекты
				</h1>
				<p className='text-muted-foreground mt-3'>{description}</p>
			</div>

			<ProjectFormDialog mode='create' />
		</div>
	)
}
