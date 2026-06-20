'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Edit, Loader2, PlusCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { useCreateShift, useUpdateShift } from '@/entities/shift/hooks'
import { TypeShift } from '@/entities/shift/model'
import { AddShiftFormData, addShiftSchema } from '@/entities/shift/schemas'

import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Input,
	Label
} from '@/shared/components/ui'
import { formatDateRussian } from '@/shared/lib'

interface ShiftFormDialogProps {
	mode: 'create' | 'edit'
	projectId: number
	shift?: TypeShift
	iconOnly?: boolean
	trigger?: React.ReactNode
}

export function ShiftFormDialog({
	mode,
	projectId,
	shift,
	iconOnly = false,
	trigger
}: ShiftFormDialogProps) {
	const [open, setOpen] = useState(false)
	const createShift = useCreateShift(projectId)
	const updateShift = useUpdateShift(projectId)

	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors, isSubmitting }
	} = useForm<AddShiftFormData>({
		resolver: zodResolver(addShiftSchema),
		defaultValues: {
			date: new Date().toISOString().split('T')[0],
			startTime: '09:00',
			endTime: '18:00',
			basePay: 0,
			overtimeHours: 0,
			perDiem: 0
		}
	})

	useEffect(() => {
		if (open && mode === 'edit' && shift) {
			reset({
				date: new Date(shift.date).toISOString().split('T')[0],
				startTime: shift.startTime || '09:00',
				endTime: shift.endTime || '18:00',
				basePay: shift.basePay || 0,
				overtimeHours: shift.overtimeHours || 0,
				perDiem: shift.perDiem || 0
			})
		}
	}, [open, mode, shift, reset])

	const dateValue = watch('date')
	const startTimeValue = watch('startTime')
	const endTimeValue = watch('endTime')
	const basePayValue = watch('basePay')
	const overtimeHoursValue = watch('overtimeHours')
	const perDiemValue = watch('perDiem')

	function getHoursDiff(start: string, end: string): number {
		const [sh, sm] = start.split(':').map(Number)
		const [eh, em] = end.split(':').map(Number)
		let diff = eh + em / 60 - (sh + sm / 60)
		if (diff < 0) diff += 24
		return parseFloat(diff.toFixed(2))
	}

	const onSubmit = async (data: AddShiftFormData) => {
		const hours = getHoursDiff(data.startTime, data.endTime)
		const overtimePay = (data.overtimeHours || 0) * 400

		const payload = {
			...data,
			hours,
			overtimePay
		}

		try {
			if (mode === 'create') {
				await createShift.mutateAsync(payload)
				toast.success('Смена успешно добавлена!')
			} else if (shift) {
				await updateShift.mutateAsync({ id: shift.id, ...payload })
				toast.success('Смена успешно обновлена!')
			}

			setOpen(false)
			reset()
		} catch {
			toast.error(
				mode === 'create'
					? 'Ошибка при добавлении смены'
					: 'Ошибка при обновлении смены'
			)
		}
	}

	const selectedDate = dateValue ? new Date(dateValue) : null
	const overtimePayValue = (overtimeHoursValue || 0) * 400
	const total = (basePayValue || 0) + overtimePayValue + (perDiemValue || 0)

	const defaultTrigger =
		mode === 'create' ? (
			iconOnly ? (
				<Button size='icon' variant='default' className='h-8 w-8'>
					<PlusCircle className='h-4 w-4' />
				</Button>
			) : (
				<Button size='sm'>
					<PlusCircle className='mr-1 h-5 w-5' /> Добавить смену
				</Button>
			)
		) : (
			<Button
				size='icon'
				variant='ghost'
				className='h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100'
			>
				<Edit className='h-4 w-4' />
			</Button>
		)

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
			<DialogContent className='w-[90%] rounded-lg sm:max-w-lg'>
				<DialogHeader>
					<DialogTitle>
						{mode === 'create' ? 'Добавить смену' : 'Редактировать смену'}
					</DialogTitle>
					<DialogDescription>
						{mode === 'create'
							? 'Укажи дату и время новой смены'
							: 'Обнови данные смены'}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
					{/* Дата */}
					<div>
						<Label htmlFor='date'>Дата смены</Label>
						<Input id='date' type='date' {...register('date')} />
						{errors.date && (
							<p className='text-destructive mt-1 text-sm'>
								{errors.date.message}
							</p>
						)}
					</div>

					{/* Время */}
					<div className='grid grid-cols-2 gap-4'>
						<div>
							<Label htmlFor='startTime'>Начало</Label>
							<Input id='startTime' type='time' {...register('startTime')} />
						</div>
						<div>
							<Label htmlFor='endTime'>Окончание</Label>
							<Input id='endTime' type='time' {...register('endTime')} />
						</div>
					</div>

					{/* Оплата */}
					<div className='space-y-3'>
						<div>
							<Label htmlFor='basePay'>Основная оплата (₽)</Label>
							<Input
								id='basePay'
								type='number'
								step='any'
								placeholder='0'
								{...register('basePay', { valueAsNumber: true })}
							/>
						</div>

						<div>
							<Label htmlFor='overtimeHours'>Переработка (ч)</Label>
							<Input
								id='overtimeHours'
								type='number'
								step='any'
								min='0'
								placeholder='0'
								{...register('overtimeHours', { valueAsNumber: true })}
							/>
							<p className='text-muted-foreground mt-1 text-sm'>
								Оплата автоматически: {overtimePayValue.toLocaleString()} ₽
							</p>
						</div>

						<div>
							<Label htmlFor='perDiem'>Суточные (₽)</Label>
							<Input
								id='perDiem'
								type='number'
								step='any'
								placeholder='0'
								{...register('perDiem', { valueAsNumber: true })}
							/>
						</div>
					</div>

					{/* Итог */}
					<div className='bg-muted/50 rounded-md border p-4'>
						<div className='mb-2 text-sm'>
							{selectedDate ? (
								<>
									📅 <strong>Смена:</strong>{' '}
									{formatDateRussian(selectedDate.toISOString())} с{' '}
									{startTimeValue} до {endTimeValue}
								</>
							) : (
								<span>Выберите дату смены</span>
							)}
						</div>
						<div className='flex items-center justify-between border-t pt-2'>
							<span className='text-sm font-medium'>Итого к оплате:</span>
							<span className='text-xl font-bold'>
								{total.toLocaleString()} ₽
							</span>
						</div>
					</div>

					<div className='flex justify-end gap-2'>
						<Button
							type='button'
							variant='outline'
							onClick={() => setOpen(false)}
						>
							Отмена
						</Button>
						<Button type='submit' disabled={isSubmitting}>
							{isSubmitting && (
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							)}
							{mode === 'create' ? 'Создать' : 'Сохранить'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
