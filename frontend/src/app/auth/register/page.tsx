import type { Metadata } from 'next'

import { RegisterForm } from '@/features/auth/ui'

export const metadata: Metadata = {
	title: 'Создать аккаунт',
	description: '🔒 Создать аккаунт в Nelon Shift'
}

export default function RegisterPage() {
	return <RegisterForm />
}
