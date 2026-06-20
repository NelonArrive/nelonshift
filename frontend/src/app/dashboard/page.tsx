import type { Metadata } from 'next'

import { AuthGuard } from '@/features/auth/ui/AuthGuard'
import { Dashboard } from '@/widgets/dashboard/ui'

export const metadata: Metadata = {
	title: 'Панель управления',
	description: ''
}

export default function DashboardPage() {
	return (
		<AuthGuard>
			<Dashboard />
		</AuthGuard>
	)
}
