'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { useForm } from 'react-hook-form'

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

import { LoginSchema, TypeLoginSchema } from '../schemas'

import { AuthWrapper } from './AuthWrapper'

export function LoginForm() {
	const [showPassword, setShowPassword] = useState(false)
	const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)
	const [isShowToFactor, setIsShowToFactor] = useState(false)

	const { theme } = useTheme()

	const form = useForm<TypeLoginSchema>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	})

	return (
		<AuthWrapper
			heading='Войти'
			description='Чтобы войти на сайт введите ваш email и пароль'
			backButtonLabel='Ещё нет аккаунта? Регистрация'
			backButtonHref='/auth/register'
			isShowSocial
		>
			<Form {...form}>
				<form className='grid gap-2 space-y-2'>
					{isShowToFactor && (
						<FormField
							control={form.control}
							name='code'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Код</FormLabel>
									<FormControl>
										<Input placeholder='123456' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}
					{!isShowToFactor && (
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
					<div className='flex justify-center'>
						<ReCAPTCHA
							sitekey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY as string}
							onChange={setRecaptchaValue}
							theme={theme === 'light' ? 'light' : 'dark'}
						/>
					</div>
					<Button type='submit'>Войти в аккаунт</Button>
				</form>
			</Form>
		</AuthWrapper>
	)
}
