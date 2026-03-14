'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { addDays, format } from 'date-fns'
import { Edit, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { useCreateProject, useUpdateProject } from '@/entities/project/hooks'
import { TypeProjectItem } from '@/entities/project/model'
import {
	AddProjectFormData,
	addProjectSchema
} from '@/entities/project/schemas/add-project.schema'
import { useShifts } from '@/entities/shift/hooks'

import {
	Button,
	Calendar,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Input,
	Label,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/shared/components/ui'
import { formatDateRussian } from '@/shared/lib'

interface ProjectFormDialogProps {
	mode: 'create' | 'edit'
	project?: TypeProjectItem
	trigger?: React.ReactNode
}

export function ProjectFormDialog({
	mode,
	project,
	trigger
}: ProjectFormDialogProps) {
	const { mutate: createProject, isPending: isCreating } = useCreateProject()
	const { mutate: updateProject, isPending: isUpdating } = useUpdateProject()

	const { data: shifts } = useShifts(project?.id || 0)

	const [open, setOpen] = useState(false)

	const isPending = isCreating || isUpdating

	const {
		register,
		control,
		handleSubmit,
		reset,
		watch,
		formState: { errors }
	} = useForm<AddProjectFormData>({
		resolver: zodResolver(addProjectSchema),
		defaultValues: {
			name: '',
			status: 'PLANNED',
			dateRange: {
				from: new Date(),
				to: addDays(new Date(), 0)
			}
		}
	})

	useEffect(() => {
		if (mode === 'edit' && project && open) {
			const dates = shifts?.map(shift => new Date(shift.date))
			const minDate = dates?.length
				? new Date(Math.min(...dates.map(d => d.getTime())))
				: new Date()
			const maxDate = dates?.length
				? new Date(Math.max(...dates.map(d => d.getTime())))
				: new Date()

			reset({
				name: project.name,
				status: project.status,
				dateRange: {
					from: minDate,
					to: maxDate
				}
			})
		}
	}, [mode, project, open, reset])

	const dateRangeValue = watch('dateRange')

	const onSubmit = (data: AddProjectFormData) => {
		const now = new Date().toISOString()

		if (mode === 'create') {
			createProject(
				{
					name: data.name,
					status: data.status,
					dateRange: {
						from: data.dateRange.from.toISOString(),
						to: data.dateRange.to
							? data.dateRange.to.toISOString()
							: data.dateRange.from.toISOString()
					},
					created_at: now,
					updated_at: now
				},
				{
					onSuccess: () => {
						toast.success('Проект успешно создан!', {
							description: `Проект "${data.name}" добавлен в список`
						})
						setOpen(false)
						reset()
					},
					onError: error => {
						toast.error('Ошибка при создании проекта', {
							description: error.message
						})
					}
				}
			)
		} else {
			updateProject(
				{
					id: project!.id,
					name: data.name,
					status: data.status,
					dateRange: {
						from: data.dateRange.from.toISOString(),
						to: data.dateRange.to
							? data.dateRange.to.toISOString()
							: data.dateRange.from.toISOString()
					},
					updated_at: now
				},
				{
					onSuccess: () => {
						toast.success('Проект успешно обновлён!', {
							description: `Проект "${data.name}" обновлён`
						})
						setOpen(false)
					},
					onError: error => {
						toast.error('Ошибка при обновлении проекта', {
							description: error.message
						})
					}
				}
			)
		}
	}

	const defaultTrigger =
		mode === 'create' ? (
			<Button>
				<Plus className='mr-2 h-4 w-4' />
				Создать проект
			</Button>
		) : (
			<Button
				variant='outline'
				className='p-2 transition-all'
				aria-label='Редактировать проект'
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
						{mode === 'create'
							? 'Создать новый проект'
							: 'Редактировать проект'}
					</DialogTitle>
					<DialogDescription>
						{mode === 'create'
							? 'Укажи название и плановый период проекта'
							: 'Обнови информацию о проекте'}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
					{/* Название проекта */}
					<div>
						<Label className='mb-2' htmlFor='projectName'>
							Название проекта
						</Label>
						<Input
							id='projectName'
							placeholder='Например: АГРО-ПРО'
							{...register('name')}
						/>
						{errors.name && (
							<p className='text-destructive mt-1 text-sm'>
								{errors.name.message}
							</p>
						)}
					</div>

					{/* Статус */}
					<div>
						<Label className='mb-2'>Статус</Label>
						<Controller
							control={control}
							name='status'
							render={({ field }) => (
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger className='w-full'>
										<SelectValue placeholder='Выберите статус' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='PLANNED'>Запланированный</SelectItem>
										<SelectItem value='ACTIVE'>Активный</SelectItem>
										<SelectItem value='COMPLETED'>Завершенный</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
						{errors.status && (
							<p className='text-destructive mt-1 text-sm'>
								{errors.status.message}
							</p>
						)}
					</div>

					{/* Календарь для выбора периода */}
					<div>
						<Label className='mb-2'>Плановый период проекта</Label>
						<div className='flex flex-col items-center justify-center rounded-md border p-4'>
							<Controller
								control={control}
								name='dateRange'
								render={({ field }) => (
									<Calendar
										mode='range'
										selected={{
											from: field.value.from,
											to: field.value.to
										}}
										onSelect={range => {
											field.onChange({
												from: range?.from || new Date(),
												to: range?.to
											})
										}}
										defaultMonth={field.value.from}
										disabled={date => {
											const today = new Date()
											today.setHours(0, 0, 0, 0)
											return date < today
										}}
										modifiers={{ today: new Date() }}
										modifiersClassNames={{
											today: 'bg-muted text-foreground font-bold'
										}}
									/>
								)}
							/>
						</div>
						{errors.dateRange && (
							<p className='text-destructive mt-1 text-sm'>
								{errors.dateRange.message || errors.dateRange.from?.message}
							</p>
						)}
						<div className='text-muted-foreground mt-2 flex items-center gap-2 text-sm'>
							<span className='bg-muted rounded-full px-2 py-0.5 text-xs'>
								i
							</span>
							<span>
								Выбор диапазона: <strong>1× клик</strong> — выбрать,{' '}
								<strong>2× клик</strong> — сбросить
							</span>
						</div>

						{/* Итог */}
						<div className='mt-3 rounded-md border p-3 text-sm'>
							{dateRangeValue?.from ? (
								<>
									📅 <strong>Период:</strong>{' '}
									{formatDateRussian(format(dateRangeValue.from, 'yyyy-MM-dd'))}
									{dateRangeValue.to &&
										` — ${formatDateRussian(format(dateRangeValue.to, 'yyyy-MM-dd'))}`}
								</>
							) : (
								<span>Выберите период проекта</span>
							)}
						</div>
					</div>

					<div className='flex justify-end gap-2'>
						<Button
							type='button'
							variant='outline'
							onClick={() => setOpen(false)}
							disabled={isPending}
						>
							Отмена
						</Button>
						<Button type='submit' disabled={isPending}>
							{isPending
								? mode === 'create'
									? 'Создание...'
									: 'Сохранение...'
								: mode === 'create'
									? 'Создать проект'
									: 'Сохранить'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
