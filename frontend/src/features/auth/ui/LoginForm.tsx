'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
	Button,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input
} from '@/shared/components/ui'

import { authApi } from '../api/auth.api'
import { executeRecaptcha } from '../lib/recaptcha'
import { authQueryKey } from '../providers/AuthProvider'
import { LoginSchema, TypeLoginSchema } from '../schemas'

import { AuthWrapper } from './AuthWrapper'

export function LoginForm() {
	const [showPassword, setShowPassword] = useState(false)
	const [isShowTwoFactor, setIsShowTwoFactor] = useState(false)
	const [isPending, setIsPending] = useState(false)
	const router = useRouter()
	const queryClient = useQueryClient()

	const form = useForm<TypeLoginSchema>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: '',
			code: ''
		}
	})

	const onSubmit = async (data: TypeLoginSchema) => {
		setIsPending(true)
		try {
			if (isShowTwoFactor) {
				await authApi.verify2fa(data.code ?? '')
				await queryClient.invalidateQueries({ queryKey: authQueryKey })
				toast.success('Вход выполнен')
				router.push('/dashboard')
				return
			}

			const recaptchaToken = await executeRecaptcha('login')
			const response = await authApi.login({
				email: data.email,
				password: data.password,
				recaptchaToken
			})

			if (response.requires2fa) {
				setIsShowTwoFactor(true)
				toast.info('Введите код из письма')
				return
			}

			await queryClient.invalidateQueries({ queryKey: authQueryKey })
			toast.success('Вход выполнен')
			router.push('/dashboard')
		} catch (error: unknown) {
			const message =
				error instanceof Error
					? error.message
					: 'Не удалось войти. Проверьте email и пароль.'
			toast.error(message)
		} finally {
			setIsPending(false)
		}
	}

	return (
		<AuthWrapper
			heading='Войти'
			description='Чтобы войти на сайт введите ваш email и пароль'
			backButtonLabel='Ещё нет аккаунта? Регистрация'
			backButtonHref='/auth/register'
			isShowSocial
		>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='grid gap-2 space-y-2'
				>
					{isShowTwoFactor && (
						<FormField
							control={form.control}
							name='code'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Код из письма</FormLabel>
									<FormControl>
										<Input placeholder='123456' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}
					{!isShowTwoFactor && (
						<>
							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Почта</FormLabel>
										<FormControl>
											<Input
												placeholder='example@email.com'
												type='email'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='password'
								render={({ field }) => (
									<FormItem>
										<div className='flex items-center justify-center'>
											<FormLabel>Пароль</FormLabel>
											<Link
												href='/auth/reset-password'
												className='ml-auto inline-block text-sm underline'
											>
												Забыли пароль?
											</Link>
										</div>
										<FormControl>
											<div className='relative'>
												<Input
													placeholder='********'
													type={showPassword ? 'text' : 'password'}
													{...field}
												/>
												<Button
													type='button'
													variant='ghost'
													size='sm'
													className='absolute top-0 right-0 h-full cursor-pointer px-3 py-2 hover:bg-transparent'
													onClick={() => setShowPassword(!showPassword)}
												>
													{showPassword ? (
														<EyeOff className='h-4 w-4' />
													) : (
														<Eye className='h-4 w-4' />
													)}
												</Button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</>
					)}
					<Button type='submit' disabled={isPending}>
						{isShowTwoFactor ? 'Подтвердить код' : 'Войти в аккаунт'}
					</Button>
				</form>
			</Form>
		</AuthWrapper>
	)
}
