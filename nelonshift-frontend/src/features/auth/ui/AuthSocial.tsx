'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { FaGoogle, FaYandex } from 'react-icons/fa'

import { Button } from '@/shared/components/ui'

export function AuthSocial() {

	return (
		<>
			<div className='mb-4 grid grid-cols-2 gap-6'>
				<Button
					className='cursor-pointer'
					variant='outline'
				>
					<FaGoogle className='mr-2 size-4' />
					Google
				</Button>
				<Button
					className='cursor-pointer'
					variant='outline'
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
