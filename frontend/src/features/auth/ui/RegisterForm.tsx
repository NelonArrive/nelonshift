'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
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
import { RegisterSchema, TypeRegisterSchema } from '../schemas'

import { AuthWrapper } from './AuthWrapper'
import { RecaptchaWidget } from './RecaptchaWidget'

export function RegisterForm() {
	const [showPassword, setShowPassword] = useState(false)
	const [showPasswordRepeat, setShowPasswordRepeat] = useState(false)
	const [isPending, setIsPending] = useState(false)
	const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
	const router = useRouter()
	const queryClient = useQueryClient()

	const handleRecaptchaVerify = useCallback((token: string | null) => {
		setRecaptchaToken(token)
	}, [])

	const form = useForm<TypeRegisterSchema>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			passwordRepeat: ''
		}
	})

	const onSubmit = async (data: TypeRegisterSchema) => {
		if (!recaptchaToken) {
			toast.error('Подтвердите, что вы не робот')
			return
		}

		setIsPending(true)
		try {
			await authApi.signup({
				name: data.name,
				email: data.email,
				password: data.password,
				recaptchaToken
			})

			await authApi.login({
				email: data.email,
				password: data.password
			})

			await queryClient.invalidateQueries({ queryKey: authQueryKey })
			toast.success('Аккаунт создан', {
				description: 'Добро пожаловать!'
			})
			router.push('/dashboard')
		} catch (error: unknown) {
			const message =
				error instanceof Error
					? error.message
					: 'Не удалось создать аккаунт'
			toast.error(message)
		} finally {
			setIsPending(false)
		}
	}

	return (
		<AuthWrapper
			heading='Регистрация'
			description='Создайте аккаунт чтобы начать'
			isShowSocial
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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
								<FormLabel>Пароль</FormLabel>
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
					<FormField
						control={form.control}
						name='passwordRepeat'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Повторите пароль</FormLabel>
								<FormControl>
									<div className='relative'>
										<Input
											placeholder='********'
											type={showPasswordRepeat ? 'text' : 'password'}
											{...field}
										/>
										<Button
											type='button'
											variant='ghost'
											size='sm'
											className='absolute top-0 right-0 h-full cursor-pointer px-3 py-2 hover:bg-transparent'
											onClick={() =>
												setShowPasswordRepeat(!showPasswordRepeat)
											}
										>
											{showPasswordRepeat ? (
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
					<motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
						<Button
							type='submit'
							disabled={isPending || !recaptchaToken}
							className='w-full cursor-pointer'
						>
							{isPending ? 'Создание...' : 'Создать аккаунт'}
						</Button>
					</motion.div>
				</form>
			</Form>
		</AuthWrapper>
	)
}
