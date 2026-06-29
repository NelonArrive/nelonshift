'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Mail, Moon, Pencil, Save, Sun, User } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { authQueryKey, useAuth } from '@/features/auth/providers/AuthProvider'
import { useDashboardStats } from '@/entities/dashboard'
import { userApi } from '@/entities/user'

import {
	Avatar,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Skeleton
} from '@/shared/components/ui'

const ProfileSchema = z.object({
	name: z
		.string()
		.min(2, 'Имя должно содержать минимум 2 символа')
		.max(50, 'Имя не должно превышать 50 символов')
})

type TypeProfileSchema = z.infer<typeof ProfileSchema>

export function ProfileContent() {
	const { user, isLoading: isAuthLoading } = useAuth()
	const { data: stats, isLoading: isStatsLoading } = useDashboardStats()
	const queryClient = useQueryClient()
	const { theme, setTheme } = useTheme()
	const [isEditing, setIsEditing] = useState(false)
	const [isPending, setIsPending] = useState(false)

	const form = useForm<TypeProfileSchema>({
		resolver: zodResolver(ProfileSchema),
		defaultValues: {
			name: user?.name ?? ''
		}
	})

	const onSubmit = async (data: TypeProfileSchema) => {
		if (!user?.id) return

		setIsPending(true)
		try {
			await userApi.updateProfile(user.id, { name: data.name })
			await queryClient.invalidateQueries({ queryKey: authQueryKey })
			toast.success('Профиль обновлён')
			setIsEditing(false)
		} catch (error: unknown) {
			const message =
				error instanceof Error ? error.message : 'Не удалось обновить профиль'
			toast.error(message)
		} finally {
			setIsPending(false)
		}
	}

	if (isAuthLoading) {
		return (
			<div className='mx-auto mt-8 w-full max-w-2xl space-y-6 px-4'>
				<Skeleton className='h-48 w-full rounded-xl' />
				<Skeleton className='h-32 w-full rounded-xl' />
			</div>
		)
	}

	if (!user) return null

	return (
		<div className='mx-auto mt-8 w-full max-w-2xl space-y-6 px-4 pb-12'>
			<Card>
				<CardContent className='pt-6'>
					<div className='flex flex-col items-center gap-4 sm:flex-row sm:items-start'>
						<Avatar name={user.name} size='xl' />

						<div className='flex-1 text-center sm:text-left'>
							<h1 className='text-2xl font-bold'>{user.name}</h1>
							<p className='text-muted-foreground mt-1 flex items-center justify-center gap-1.5 text-sm sm:justify-start'>
								<Mail className='h-3.5 w-3.5' />
								{user.email}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className='flex flex-row items-center justify-between'>
					<CardTitle className='flex items-center gap-2 text-lg'>
						<User className='h-5 w-5' />
						Личные данные
					</CardTitle>
					{!isEditing && (
						<Button
							variant='ghost'
							size='sm'
							onClick={() => {
								form.reset({ name: user.name })
								setIsEditing(true)
							}}
						>
							<Pencil className='mr-1.5 h-3.5 w-3.5' />
							Изменить
						</Button>
					)}
				</CardHeader>
				<CardContent>
					{isEditing ? (
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className='space-y-4'
							>
								<FormField
									control={form.control}
									name='name'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Имя</FormLabel>
											<FormControl>
												<Input placeholder='Ваше имя' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className='flex gap-2'>
									<Button type='submit' disabled={isPending} size='sm'>
										<Save className='mr-1.5 h-3.5 w-3.5' />
										{isPending ? 'Сохранение...' : 'Сохранить'}
									</Button>
									<Button
										type='button'
										variant='outline'
										size='sm'
										onClick={() => setIsEditing(false)}
									>
										Отмена
									</Button>
								</div>
							</form>
						</Form>
					) : (
						<div className='space-y-3'>
							<div>
								<p className='text-muted-foreground text-xs'>Имя</p>
								<p className='text-sm font-medium'>{user.name}</p>
							</div>
							<div>
								<p className='text-muted-foreground text-xs'>Почта</p>
								<p className='text-sm font-medium'>{user.email}</p>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className='text-lg'>Статистика</CardTitle>
				</CardHeader>
				<CardContent>
					{isStatsLoading ? (
						<div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
							{Array.from({ length: 4 }).map((_, i) => (
								<Skeleton key={i} className='h-16 rounded-lg' />
							))}
						</div>
					) : (
						<div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
							<div className='rounded-lg border p-3 text-center'>
								<p className='text-muted-foreground text-xs'>Проектов</p>
								<p className='text-xl font-bold'>
									{(stats?.totalActiveProjects ?? 0) +
										(stats?.totalCompletedProjects ?? 0)}
								</p>
							</div>
							<div className='rounded-lg border p-3 text-center'>
								<p className='text-muted-foreground text-xs'>Смен</p>
								<p className='text-xl font-bold'>
									{stats?.totalShifts ?? 0}
								</p>
							</div>
							<div className='rounded-lg border p-3 text-center'>
								<p className='text-muted-foreground text-xs'>Часов</p>
								<p className='text-xl font-bold'>
									{stats?.totalHours ?? 0}
								</p>
							</div>
							<div className='rounded-lg border p-3 text-center'>
								<p className='text-muted-foreground text-xs'>Заработок</p>
								<p className='text-xl font-bold'>
									{(stats?.totalEarnings ?? 0).toLocaleString('ru-RU')} ₽
								</p>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className='text-lg'>Тема оформления</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='flex items-center gap-3'>
						<div className='flex rounded-lg border p-1'>
							<button
								onClick={() => setTheme('light')}
								className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors ${
									theme === 'light'
										? 'bg-primary text-primary-foreground'
										: 'text-muted-foreground hover:text-foreground'
								}`}
							>
								<Sun className='h-3.5 w-3.5' />
								Светлая
							</button>
							<button
								onClick={() => setTheme('dark')}
								className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors ${
									theme === 'dark'
										? 'bg-primary text-primary-foreground'
										: 'text-muted-foreground hover:text-foreground'
								}`}
							>
								<Moon className='h-3.5 w-3.5' />
								Тёмная
							</button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
