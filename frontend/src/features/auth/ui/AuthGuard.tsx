'use client'

import { useRouter } from 'next/navigation'
import { type PropsWithChildren, useEffect } from 'react'

import { Loader } from '@/shared/components/ui'

import { useAuth } from '../providers/AuthProvider'

export function AuthGuard({ children }: PropsWithChildren) {
	const { isAuthenticated, isLoading } = useAuth()
	const router = useRouter()

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.replace('/auth/login')
		}
	}, [isAuthenticated, isLoading, router])

	if (isLoading || !isAuthenticated) {
		return (
			<div className='flex min-h-[50vh] items-center justify-center'>
				<Loader />
			</div>
		)
	}

	return <>{children}</>
}
