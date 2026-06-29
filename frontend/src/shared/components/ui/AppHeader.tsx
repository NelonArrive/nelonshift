'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useAuth } from '@/features/auth/providers/AuthProvider'
import { Avatar } from '@/shared/components/ui/Avatar'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/shared/components/ui/DropdownMenu'
import { LogOut, Moon, Sun, User } from 'lucide-react'
import { useTheme } from 'next-themes'

const HIDDEN_PATHS = ['/', '/auth', '/oauth2']

export function AppHeader() {
	const { user, isAuthenticated, logout } = useAuth()
	const pathname = usePathname()
	const { theme, setTheme } = useTheme()

	const shouldHide = HIDDEN_PATHS.some(
		p => pathname === p || pathname.startsWith(p + '/')
	)

	if (!isAuthenticated || shouldHide) return null

	const userName = user?.name ?? 'Гость'

	return (
		<header className='fixed top-0 right-0 left-0 z-50'>
			<div className='mx-auto max-w-6xl px-4 py-3 sm:px-6'>
				<div className='bg-background/60 flex items-center justify-between rounded-2xl border border-white/10 px-4 py-2 shadow-lg shadow-black/5 backdrop-blur-xl sm:px-6'>
					<Link href='/dashboard' className='flex items-center gap-2'>
						<div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600'>
							<span className='text-sm font-bold text-white'>N</span>
						</div>
						<span className='text-lg font-semibold'>Nelon Shift</span>
					</Link>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button className='cursor-pointer rounded-full transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background'>
								<Avatar name={userName} size='md' />
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end' className='w-56'>
							<div className='flex items-center gap-3 px-3 py-2'>
								<Avatar name={userName} size='md' />
								<div className='min-w-0 flex-1'>
									<p className='truncate text-sm font-medium'>{user?.name}</p>
									<p className='text-muted-foreground truncate text-xs'>
										{user?.email}
									</p>
								</div>
							</div>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => window.location.href = '/profile'}>
								<User className='mr-2 h-4 w-4' />
								Профиль
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
								{theme === 'dark' ? (
									<>
										<Sun className='mr-2 h-4 w-4' />
										Светлая тема
									</>
								) : (
									<>
										<Moon className='mr-2 h-4 w-4' />
										Тёмная тема
									</>
								)}
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className='text-red-600 dark:text-red-400'
								onClick={() => logout()}
							>
								<LogOut className='mr-2 h-4 w-4' />
								Выйти
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	)
}
