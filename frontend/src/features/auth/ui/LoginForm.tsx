'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
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
import { authQueryKey } from '../providers/AuthProvider'
import { LoginSchema, TypeLoginSchema } from '../schemas'

import { AuthWrapper } from './AuthWrapper'
import { RecaptchaWidget } from './RecaptchaWidget'

export function LoginForm() {
	const [showPassword, setShowPassword] = useState(false)
	const [isShowTwoFactor, setIsShowTwoFactor] = useState(false)
	const [isPending, setIsPending] = useState(false)
	const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
	const router = useRouter()
	const queryClient = useQueryClient()

	const handleRecaptchaVerify = useCallback((token: string | null) => {
		setRecaptchaToken(token)
	}, [])

	const form = useForm<TypeLoginSchema>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: '',
			code: ''
		}
	})

	const onSubmit = async (data: TypeLoginSchema) => {
		if (!isShowTwoFactor && !recaptchaToken) {
			toast.error('Подтвердите, что вы не робот')
			return
		}

		setIsPending(true)
		try {
			if (isShowTwoFactor) {
				await authApi.verify2fa(data.code ?? '')
				await queryClient.invalidateQueries({ queryKey: authQueryKey })
				toast.success('Вход выполнен')
				router.push('/dashboard')
				return
			}

			const response = await authApi.login({
				email: data.email,
				password: data.password,
				recaptchaToken: recaptchaToken ?? undefined
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
			description='Введите email и пароль для входа'
			isShowSocial
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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
										<div className='flex items-center justify-between'>
											<FormLabel>Пароль</FormLabel>
											<Link
												href='/auth/reset-password'
												className='text-primary text-xs hover:underline'
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
							<RecaptchaWidget onVerify={handleRecaptchaVerify} />
						</>
					)}
					<motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
						<Button
							type='submit'
							disabled={isPending || (!isShowTwoFactor && !recaptchaToken)}
							className='w-full cursor-pointer'
						>
							{isPending
								? 'Вход...'
								: isShowTwoFactor
									? 'Подтвердить код'
									: 'Войти в аккаунт'}
						</Button>
					</motion.div>
				</form>
			</Form>
		</AuthWrapper>
	)
}
