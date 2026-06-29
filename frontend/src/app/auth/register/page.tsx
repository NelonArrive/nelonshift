import type { Metadata } from 'next'

import { GuestGuard } from '@/features/auth/ui/GuestGuard'
import { RegisterForm } from '@/features/auth/ui'

export const metadata: Metadata = {
	title: 'Создать аккаунт',
	description: 'Создать аккаунт в Nelon Shift'
}

export default function RegisterPage() {
	return (
		<GuestGuard>
			<RegisterForm />
		</GuestGuard>
	)
}
