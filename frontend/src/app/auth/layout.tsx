'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AuthLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	const pathname = usePathname()
	const isLogin = pathname === '/auth/login'

	return (
		<div className='relative flex min-h-screen items-center justify-center px-4'>
			<div className='pointer-events-none absolute inset-0 overflow-hidden'>
				<div className='absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px]' />
				<div className='absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px]' />
				<div className='absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/8 blur-[100px]' />
			</div>

			<div className='relative z-10 flex w-full flex-col items-center'>
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className='mb-8'
				>
					<Link href='/' className='flex items-center gap-2'>
						<div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25'>
							<span className='text-lg font-bold text-white'>N</span>
						</div>
						<span className='text-xl font-semibold'>Nelon Shift</span>
					</Link>
				</motion.div>

				{children}

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5 }}
					className='mt-6 text-center'
				>
					<p className='text-muted-foreground text-sm'>
						{isLogin ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
						<Link
							href={isLogin ? '/auth/register' : '/auth/login'}
							className='text-indigo-400 hover:text-indigo-300 transition-colors'
						>
							{isLogin ? 'Зарегистрироваться' : 'Войти'}
						</Link>
					</p>
				</motion.div>
			</div>
		</div>
	)
}
