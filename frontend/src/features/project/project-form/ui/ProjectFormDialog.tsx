'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
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
			startDate: new Date(),
			endDate: undefined
		}
	})

	useEffect(() => {
		if (mode === 'edit' && project && open) {
			reset({
				name: project.name,
				status: project.status,
				startDate: project.startDate
					? new Date(project.startDate)
					: new Date(),
				endDate: project.endDate ? new Date(project.endDate) : undefined
			})
		}
	}, [mode, project, open, reset])

	const startDateValue = watch('startDate')
	const endDateValue = watch('endDate')

	const onSubmit = (data: AddProjectFormData) => {
		if (mode === 'create') {
			createProject(
				{
					name: data.name,
					status: data.status,
					startDate: data.startDate.toISOString().split('T')[0],
					endDate: data.endDate
						? data.endDate.toISOString().split('T')[0]
						: null
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
					startDate: data.startDate.toISOString().split('T')[0],
					endDate: data.endDate
						? data.endDate.toISOString().split('T')[0]
						: null
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
							name='startDate'
							render={({ field }) => (
								<Calendar
									mode='range'
									selected={{
										from: field.value,
										to: endDateValue
									}}
									onSelect={range => {
										field.onChange(range?.from || new Date())
										if (range?.to) {
											// endDate will be handled separately
										}
									}}
									defaultMonth={field.value}
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
						{errors.startDate && (
							<p className='text-destructive mt-1 text-sm'>
								{errors.startDate.message}
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
							{startDateValue ? (
								<>
									📅 <strong>Период:</strong>{' '}
									{formatDateRussian(format(startDateValue, 'yyyy-MM-dd'))}
									{endDateValue &&
										` — ${formatDateRussian(format(endDateValue, 'yyyy-MM-dd'))}`}
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
