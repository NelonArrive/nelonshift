'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { usePathname, useRouter } from 'next/navigation'
import {
	createContext,
	type PropsWithChildren,
	useCallback,
	useContext,
	useMemo
} from 'react'

import { authApi } from '../api/auth.api'
import { AuthUser } from '../model/auth.types'

type AuthContextValue = {
	user: AuthUser | null
	isLoading: boolean
	isAuthenticated: boolean
	refetchUser: () => Promise<void>
	logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const PUBLIC_PATHS = [
	'/',
	'/auth/login',
	'/auth/register',
	'/auth/reset-password',
	'/auth/new-password',
	'/oauth2/redirect'
]

export const authQueryKey = ['auth', 'me'] as const

export function AuthProvider({ children }: PropsWithChildren) {
	const router = useRouter()
	const pathname = usePathname()
	const queryClient = useQueryClient()

	const isPublicPath = PUBLIC_PATHS.some(
		path => pathname === path || pathname.startsWith(`${path}/`)
	)

	const { data: user, isLoading, refetch } = useQuery({
		queryKey: authQueryKey,
		queryFn: authApi.me,
		retry: false,
		staleTime: 5 * 60 * 1000,
		enabled: !isPublicPath || pathname === '/oauth2/redirect'
	})

	const isAuthenticated = !!user

	const refetchUser = useCallback(async () => {
		await refetch()
	}, [refetch])

	const logout = useCallback(async () => {
		try {
			await authApi.logout()
		} finally {
			queryClient.setQueryData(authQueryKey, null)
			queryClient.clear()
			router.push('/auth/login')
		}
	}, [queryClient, router])

	const value = useMemo(
		() => ({
			user: user ?? null,
			isLoading: !isPublicPath && isLoading,
			isAuthenticated,
			refetchUser,
			logout
		}),
		[user, isLoading, isAuthenticated, isPublicPath, refetchUser, logout]
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth must be used within AuthProvider')
	}
	return context
}
