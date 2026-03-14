import type { Metadata } from 'next'

import { Dashboard } from '@/widgets/dashboard/ui'

export const metadata: Metadata = {
	title: 'Панель управления',
	description: ''
}

export default function DashboardPage() {
	return <Dashboard />
}
