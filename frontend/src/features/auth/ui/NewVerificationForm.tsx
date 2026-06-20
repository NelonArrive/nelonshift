'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { Loader } from '@/shared/components/ui'


import { AuthWrapper } from './AuthWrapper'

export function NewVerification() {
	return (
		<AuthWrapper heading='Подтверждение почты'>
			<div>
				<Loader />
			</div>
		</AuthWrapper>
	)
}
