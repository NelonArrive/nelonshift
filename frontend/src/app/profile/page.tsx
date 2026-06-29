'use client'

import type { Metadata } from 'next'

import { AuthGuard } from '@/features/auth/ui/AuthGuard'
import { ProfileContent } from '@/features/profile/ui/ProfileContent'

export default function ProfilePage() {
	return (
		<AuthGuard>
			<ProfileContent />
		</AuthGuard>
	)
}
