'use client'

import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { useDeleteProject } from '@/entities/project/hooks'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogTitle,
	Button
} from '@/shared/components/ui'

interface DeleteProjectButtonProps {
	projectId: number
	projectName?: string
}

export function DeleteProjectButton({
	projectId,
	projectName = 'проект'
}: DeleteProjectButtonProps) {
	const [open, setOpen] = useState(false)
	const router = useRouter()
	const { mutate: deleteProject, isPending } = useDeleteProject()

	const handleDelete = () => {
		deleteProject(projectId, {
			onSuccess: () => {
				setOpen(false)
				router.push('/dashboard')
				toast.success('Проект успешно удалён')
			}
		})
	}

	return (
		<>
			<Button
				variant='outline'
				size='icon'
				onClick={() => setOpen(true)}
				className='border border-[#f72b35] p-2 transition-all'
				disabled={isPending}
				aria-label='Удалить проект'
			>
				<Trash2 color='#f72b35' className='h-4 w-4' />
			</Button>

			<AlertDialog open={open} onOpenChange={setOpen}>
				<AlertDialogContent>
					<AlertDialogTitle>Удалить проект?</AlertDialogTitle>
					<AlertDialogDescription>
						Вы уверены, что хотите удалить "{projectName}"? Это действие нельзя
						отменить.
					</AlertDialogDescription>
					<div className='flex justify-end gap-2'>
						<AlertDialogCancel disabled={isPending}>Отмена</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete} disabled={isPending}>
							{isPending ? 'Удаление...' : 'Удалить'}
						</AlertDialogAction>
					</div>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}
