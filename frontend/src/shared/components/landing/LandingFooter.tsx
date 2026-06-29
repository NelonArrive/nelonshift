'use client'

import Link from 'next/link'

export function LandingFooter() {
	return (
		<footer className='border-t px-4 py-12'>
			<div className='mx-auto max-w-6xl'>
				<div className='flex flex-col items-center justify-between gap-6 sm:flex-row'>
					<div className='flex items-center gap-2'>
						<div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600'>
							<span className='text-sm font-bold text-white'>N</span>
						</div>
						<span className='text-lg font-semibold'>Nelon Shift</span>
					</div>

					<nav className='flex items-center gap-6'>
						<Link
							href='/auth/login'
							className='text-muted-foreground hover:text-foreground text-sm transition-colors'
						>
							Войти
						</Link>
						<Link
							href='/auth/register'
							className='text-muted-foreground hover:text-foreground text-sm transition-colors'
						>
							Регистрация
						</Link>
					</nav>
				</div>

				<div className='text-muted-foreground mt-8 text-center text-sm'>
					© {new Date().getFullYear()} Nelon Shift. Все права защищены.
				</div>
			</div>
		</footer>
	)
}
