'use client'

import { FaGoogle, FaYandex } from 'react-icons/fa'

import { BACKEND_BASE_URL } from '@/shared/api'
import { Button } from '@/shared/components/ui'

export function AuthSocial() {
	const handleOAuthLogin = (provider: 'google' | 'yandex') => {
		window.location.href = `${BACKEND_BASE_URL}/oauth2/authorization/${provider}`
	}

	return (
		<>
			<div className='mb-4 grid grid-cols-2 gap-6'>
				<Button
					type='button'
					className='cursor-pointer'
					variant='outline'
					onClick={() => handleOAuthLogin('google')}
				>
					<FaGoogle className='mr-2 size-4' />
					Google
				</Button>
				<Button
					type='button'
					className='cursor-pointer'
					variant='outline'
					onClick={() => handleOAuthLogin('yandex')}
				>
					<FaYandex className='mr-2 size-4' />
					Яндекс
				</Button>
			</div>
			<div className='relative mb-2'>
				<div className='absolute inset-0 flex items-center'>
					<span className='w-full border-t' />
				</div>
				<div className='relative flex justify-center text-xs uppercase'>
					<span className='bg-card text-muted-foreground px-2'>Или</span>
				</div>
			</div>
		</>
	)
}
