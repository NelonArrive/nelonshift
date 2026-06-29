'use client'

import { motion } from 'framer-motion'
import { type PropsWithChildren } from 'react'

import { AuthSocial } from './AuthSocial'

interface IAuthWrapperProps {
	heading: string
	description?: string
	isShowSocial?: boolean
}

export function AuthWrapper({
	children,
	heading,
	description,
	isShowSocial = false
}: PropsWithChildren<IAuthWrapperProps>) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20, scale: 0.98 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
			className='w-full max-w-[420px]'
		>
			<div className='bg-card rounded-2xl border p-8 shadow-2xl'>
				<div className='mb-6 text-center'>
					<h1 className='text-2xl font-bold'>{heading}</h1>
					{description && (
						<p className='text-muted-foreground mt-2 text-sm'>{description}</p>
					)}
				</div>

				{isShowSocial && <AuthSocial />}

				{children}
			</div>
		</motion.div>
	)
}
