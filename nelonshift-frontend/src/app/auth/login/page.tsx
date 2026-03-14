import type { Metadata } from 'next'

import { LoginForm } from '@/features/auth/ui'

export const metadata: Metadata = {
	title: 'Войти в аккаунт',
	description: '🔐 Войти в аккаунт в Nelon Shift'
}

export default function LoginPage() {
	return <LoginForm />
}
