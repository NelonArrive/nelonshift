'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { authQueryKey } from '@/features/auth/providers/AuthProvider'
import { Loader } from '@/shared/components/ui'
import { useQueryClient } from '@tanstack/react-query'

export default function OAuthRedirectPage() {
	const router = useRouter()
	const queryClient = useQueryClient()

	useEffect(() => {
		queryClient.invalidateQueries({ queryKey: authQueryKey })
		router.replace('/dashboard')
	}, [queryClient, router])

	return (
		<div className='flex min-h-screen items-center justify-center'>
			<Loader />
		</div>
	)
}
