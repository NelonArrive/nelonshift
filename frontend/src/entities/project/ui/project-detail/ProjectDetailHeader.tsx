import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { TypeShift } from '@/entities/shift/model'

import { DeleteProjectButton } from '@/features/project/delete-project/ui/DeleteProjectButton'
import { ExportToExcelButton } from '@/features/project/export-to-excel/ui/ExportToExcelButton'
import { ProjectFormDialog } from '@/features/project/project-form/ui/ProjectFormDialog'
import { ShiftFormDialog } from '@/features/shift/shift-form'

import { Button, Card, CardHeader, CardTitle } from '@/shared/components/ui'
import { cn } from '@/shared/lib'

import { TypeProjectItem } from '../../model'
import { ProjectStatusBadge } from '../ProjectStatus'

interface IProjectHeaderProps {
	project: TypeProjectItem
	shifts?: TypeShift[]
	isAddShiftButton?: boolean
}

export function ProjectDetailHeader({
	project,
	isAddShiftButton,
	shifts
}: IProjectHeaderProps) {
	return (
		<Card>
			<CardHeader
				className={cn(
					'flex justify-between gap-4',
					isAddShiftButton ? 'items-start' : 'items-center'
				)}
			>
				<div>
					<div className='flex items-center gap-3'>
						<CardTitle className='text-2xl font-bold'>{project.name}</CardTitle>
						<ProjectStatusBadge status={project.status} />
					</div>

					<p className='text-muted-foreground mt-1 mb-4'>
						Подробности проекта и список смен
					</p>
					<div className='flex gap-2'>
						<ProjectFormDialog mode='edit' project={project} />
						<DeleteProjectButton
							projectId={project.id}
							projectName={project.name}
						/>
						{shifts?.length && (
							<ExportToExcelButton shifts={shifts} project={project} />
						)}
					</div>
				</div>

				<div className='flex flex-col gap-2'>
					<Link href='/dashboard'>
						<Button size='sm' variant='outline'>
							<ArrowLeft className='h-4 w-4' /> Панель управления
						</Button>
					</Link>

					{isAddShiftButton && (
						<ShiftFormDialog mode='create' projectId={project.id} />
					)}
				</div>
			</CardHeader>
		</Card>
	)
}
