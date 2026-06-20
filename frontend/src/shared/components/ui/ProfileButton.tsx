'use client'

import { LogOut, Moon, Sun, User, UserCircle } from 'lucide-react'
import { useTheme } from 'next-themes'
import { usePathname, useRouter } from 'next/navigation'
import * as React from 'react'

import { useAuth } from '@/features/auth/providers/AuthProvider'

import { Button } from './'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from './DropdownMenu'

interface ProfileButtonProps {
	userImage?: string
}

export function ProfileButton({ userImage }: ProfileButtonProps) {
	const { user, isAuthenticated, logout } = useAuth()
	const pathname = usePathname()
	const userName = user?.name
	const { theme, setTheme } = useTheme()
	const router = useRouter()

	const isAuthPage = pathname.startsWith('/auth') || pathname === '/'

	if (!isAuthenticated || isAuthPage) {
		return null
	}

	const toggleTheme = () => {
		setTheme(theme === 'dark' ? 'light' : 'dark')
	}

	const getInitials = (name: string) => {
		const words = name.trim().split(' ')
		if (words.length >= 2) {
			return (words[0][0] + words[1][0]).toUpperCase()
		}
		return name.slice(0, 2).toUpperCase()
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className='fixed top-5 right-5' asChild>
				<Button variant='outline' className='w-11 h-11' size='icon'>
					{userImage ? (
						<img
							src={userImage}
							alt={userName || 'Профиль'}
							className='h-[1.8rem] w-[1.8rem] rounded-sm object-cover'
						/>
					) : userName ? (
						<span className='text-lg font-medium'>{getInitials(userName)}</span>
					) : (
						<UserCircle className='h-[1.8rem] w-[1.8rem]' />
					)}
					<span className='sr-only'>Меню профиля</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='w-56'>
				{userName && (
					<>
						<div className='px-2 py-1.5 text-sm font-medium'>{userName}</div>
						<DropdownMenuSeparator />
					</>
				)}
				<DropdownMenuItem onClick={() => router.push('/profile')}>
					<User className='mr-2 h-4 w-4' />
					Профиль
				</DropdownMenuItem>
				<DropdownMenuItem onClick={toggleTheme}>
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
	)
}
