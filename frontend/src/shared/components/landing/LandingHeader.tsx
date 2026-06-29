'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

import { useAuth } from '@/features/auth/providers/AuthProvider'
import { Avatar, Button } from '@/shared/components/ui'

export function LandingHeader() {
	const { user, isAuthenticated } = useAuth()
	const [mobileOpen, setMobileOpen] = useState(false)

	return (
		<motion.header
			initial={{ y: -20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.6, ease: 'easeOut' }}
			className='fixed top-0 right-0 left-0 z-50'
		>
			<div className='mx-auto max-w-6xl px-4 py-3 sm:px-6'>
				<div className='bg-background/60 flex items-center justify-between rounded-2xl border border-white/10 px-4 py-2 shadow-lg shadow-black/5 backdrop-blur-xl sm:px-6'>
					<Link href='/' className='flex items-center gap-2'>
						<div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600'>
							<span className='text-sm font-bold text-white'>N</span>
						</div>
						<span className='text-lg font-semibold'>Nelon Shift</span>
					</Link>

					<nav className='hidden items-center gap-6 md:flex'>
						<a
							href='#features'
							className='text-muted-foreground hover:text-foreground text-sm transition-colors'
						>
							Возможности
						</a>
						<a
							href='#how-it-works'
							className='text-muted-foreground hover:text-foreground text-sm transition-colors'
						>
							Как работает
						</a>
					</nav>

					{isAuthenticated ? (
						<div className='hidden items-center gap-3 md:flex'>
							<Button asChild variant='ghost' size='sm'>
								<Link href='/dashboard' className='flex items-center gap-2'>
									<Avatar name={user?.name ?? 'Г'} size='sm' />
									Дашборд
								</Link>
							</Button>
						</div>
					) : (
						<div className='hidden items-center gap-3 md:flex'>
							<Button asChild variant='ghost' size='sm'>
								<Link href='/auth/login'>Войти</Link>
							</Button>
							<Button asChild size='sm'>
								<Link href='/auth/register'>Начать бесплатно</Link>
							</Button>
						</div>
					)}

					<button
						className='cursor-pointer md:hidden'
						onClick={() => setMobileOpen(!mobileOpen)}
					>
						{mobileOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
					</button>
				</div>

				{mobileOpen && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						className='bg-background/95 mt-2 rounded-2xl border border-white/10 p-4 shadow-lg backdrop-blur-xl md:hidden'
					>
						<nav className='flex flex-col gap-3'>
							<a
								href='#features'
								className='text-muted-foreground hover:text-foreground text-sm transition-colors'
								onClick={() => setMobileOpen(false)}
							>
								Возможности
							</a>
							<a
								href='#how-it-works'
								className='text-muted-foreground hover:text-foreground text-sm transition-colors'
								onClick={() => setMobileOpen(false)}
							>
								Как работает
							</a>
							<hr className='border-white/10' />
							{isAuthenticated ? (
								<Button asChild size='sm'>
									<Link href='/dashboard'>Дашборд</Link>
								</Button>
							) : (
								<>
									<Button asChild variant='ghost' size='sm'>
										<Link href='/auth/login'>Войти</Link>
									</Button>
									<Button asChild size='sm'>
										<Link href='/auth/register'>Начать бесплатно</Link>
									</Button>
								</>
							)}
						</nav>
					</motion.div>
				)}
			</div>
		</motion.header>
	)
}
