'use client'

import { useCallback, useEffect, useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { ShieldCheck, ShieldAlert } from 'lucide-react'

const SITE_KEY = process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY

interface RecaptchaWidgetProps {
	onVerify: (token: string | null) => void
	theme?: 'light' | 'dark'
}

export function RecaptchaWidget({ onVerify, theme = 'light' }: RecaptchaWidgetProps) {
	const [isReady, setIsReady] = useState(false)
	const [verified, setVerified] = useState(false)
	const [error, setError] = useState(false)

	const handleChange = useCallback(
		(token: string | null) => {
			if (token) {
				setVerified(true)
				setError(false)
				onVerify(token)
			} else {
				setVerified(false)
				onVerify(null)
			}
		},
		[onVerify]
	)

	useEffect(() => {
		const timer = setTimeout(() => setIsReady(true), 500)
		return () => clearTimeout(timer)
	}, [])

	if (!SITE_KEY) {
		return null
	}

	return (
		<div className='flex flex-col items-center gap-2'>
			{isReady && (
				<ReCAPTCHA
					sitekey={SITE_KEY}
					theme={theme}
					size='invisible'
					onChange={handleChange}
					onExpired={() => {
						setVerified(false)
						onVerify(null)
					}}
					onErrored={() => {
						setError(true)
						setVerified(false)
						onVerify(null)
					}}
				/>
			)}
			{!isReady && (
				<div className='text-muted-foreground flex items-center gap-2 text-xs'>
					<div className='h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent' />
					Проверка безопасности...
				</div>
			)}
			{verified && (
				<div className='flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400'>
					<ShieldCheck className='h-3.5 w-3.5' />
					Вы прошли проверку
				</div>
			)}
			{error && (
				<div className='flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400'>
					<ShieldAlert className='h-3.5 w-3.5' />
					Ошибка проверки. Обновите страницу.
				</div>
			)}
		</div>
	)
}
