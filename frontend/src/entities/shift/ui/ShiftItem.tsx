'use client'

import { Clock, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { ShiftFormDialog } from '@/features/shift/shift-form'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogTitle,
	Button
} from '@/shared/components/ui'
import { formatDate } from '@/shared/lib'

import { useDeleteShift } from '../hooks/useShifts'
import { TypeShift } from '../model/shift.types'

interface ShiftItemProps {
	shift: TypeShift
	totalEarnings: number
	projectId: number
}

export function ShiftItem({ shift, totalEarnings, projectId }: ShiftItemProps) {
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const deleteShift = useDeleteShift(projectId)

	const {
		date,
		hours,
		startTime,
		endTime,
		basePay,
		overtimeHours,
		overtimePay,
		perDiem
	} = shift

	const safeBasePay = basePay ?? 0
	const safeOvertimeHours = overtimeHours ?? 0
	const safeOvertimePay = overtimePay ?? 0
	const safePerDiem = perDiem ?? 0

	const handleDelete = () => {
		deleteShift.mutate(shift.id, {
			onSuccess: () => toast.success('Смена удалена'),
			onError: () => toast.error('Ошибка удаления смены')
		})
		setDeleteDialogOpen(false)
	}

	const timeDisplay =
		startTime && endTime
			? `${startTime} - ${endTime}`
			: hours
				? `${hours} час${hours === 1 ? '' : hours < 5 ? 'а' : 'ов'}`
				: ''

	return (
		<>
			<div className='group hover:bg-muted/50 relative flex items-center justify-between rounded-lg border p-4 transition-colors'>
				{/* Левая часть - дата и время */}
				<div className='flex items-center gap-4'>
					<div className='flex flex-col'>
						<span className='font-semibold'>{formatDate(date)}</span>
						{timeDisplay && (
							<span className='text-muted-foreground flex items-center gap-1 text-sm'>
								<Clock className='h-3 w-3' />
								{timeDisplay}
							</span>
						)}
					</div>
				</div>

				{/* Правая часть - оплаты */}
				<div className='flex items-center gap-4 sm:gap-6'>
					{/* Основная оплата */}
					<div className='text-right'>
						<div className='font-semibold'>{safeBasePay.toLocaleString()} ₽</div>
						<div className='text-muted-foreground text-xs'>Основная</div>
					</div>

					{/* Переработка */}
					{safeOvertimePay > 0 && (
						<div className='text-right'>
							<div className='font-semibold text-orange-600'>
								+{safeOvertimePay.toLocaleString()} ₽
							</div>
							<div className='text-muted-foreground text-xs'>
								Переработка{safeOvertimeHours > 0 ? ` (${safeOvertimeHours}ч)` : ''}
							</div>
						</div>
					)}

					{/* Суточные */}
					{safePerDiem > 0 && (
						<div className='text-right'>
							<div className='font-semibold text-green-600'>
								+{safePerDiem.toLocaleString()} ₽
							</div>
							<div className='text-muted-foreground text-xs'>Суточные</div>
						</div>
					)}

					{/* Итого */}
					<div className='border-l pl-4 text-right sm:pl-6'>
						<div className='text-lg font-bold'>
							{totalEarnings.toLocaleString()} ₽
						</div>
						<div className='text-muted-foreground text-xs'>Итого</div>
					</div>
				</div>

				{/* Кнопки действий */}
				<div className='absolute top-2 right-2 flex gap-1 opacity-0 transition-all group-hover:opacity-100'>
					<ShiftFormDialog projectId={projectId} mode='edit' shift={shift} />
					<Button
						size='icon'
						variant='ghost'
						className='h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600'
						onClick={() => setDeleteDialogOpen(true)}
					>
						<Trash2 className='h-4 w-4' />
					</Button>
				</div>
			</div>

			{/* Диалог подтверждения удаления */}
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogTitle>Удалить смену?</AlertDialogTitle>
					<AlertDialogDescription>
						Вы уверены, что хотите удалить смену от {formatDate(date)}? Это
						действие нельзя отменить.
					</AlertDialogDescription>
					<div className='flex justify-end gap-2'>
						<AlertDialogCancel>Отмена</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className='bg-red-600 hover:bg-red-700'
						>
							Удалить
						</AlertDialogAction>
					</div>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}
