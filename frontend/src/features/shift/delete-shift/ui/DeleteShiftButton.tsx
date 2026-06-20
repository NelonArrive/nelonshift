'use client'

import { Loader2, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { useDeleteShift } from '@/entities/shift/hooks/useShifts'

import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/shared/components/ui'

interface DeleteShiftButtonProps {
	projectId: number
	shiftId: number
}

export function DeleteShiftButton({
	projectId,
	shiftId
}: DeleteShiftButtonProps) {
	const [open, setOpen] = useState(false)
	const deleteShift = useDeleteShift(projectId)

	const handleDelete = async () => {
		try {
			await deleteShift.mutateAsync(shiftId)
			toast.success('Смена успешно удалена')
			setOpen(false)
		} catch {
			toast.error('Ошибка при удалении смены')
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					size='icon'
					variant='ghost'
					className='text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100'
				>
					<Trash2 className='h-4 w-4' />
				</Button>
			</DialogTrigger>

			<DialogContent className='sm:max-w-sm'>
				<DialogHeader>
					<DialogTitle>Удалить смену?</DialogTitle>
					<DialogDescription>
						Это действие нельзя отменить. Смена будет удалена навсегда.
					</DialogDescription>
				</DialogHeader>

				<div className='mt-4 flex justify-end gap-2'>
					<Button variant='outline' onClick={() => setOpen(false)}>
						Отмена
					</Button>
					<Button
						variant='destructive'
						onClick={handleDelete}
						disabled={deleteShift.isPending}
					>
						{deleteShift.isPending && (
							<Loader2 className='mr-2 h-4 w-4 animate-spin' />
						)}
						Удалить
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
