'use client'

import { type PropsWithChildren } from 'react'

import { TooltipProvider } from '../components/ui/Tooltip'

import { AuthProvider } from '@/features/auth/providers/AuthProvider'

import { TanstackQueryProvider } from './TanstackQueryProvider'
import { ThemeProvider } from './ThemeProvider'
import { ToastProvider } from './ToastProvider'

export function MainProvider({ children }: PropsWithChildren<unknown>) {
	return (
		<TanstackQueryProvider>
			<AuthProvider>
			<ThemeProvider
				attribute='class'
				defaultTheme='light'
				disableTransitionOnChange
			>
				<TooltipProvider delayDuration={0}>
					<ToastProvider />
					{children}
				</TooltipProvider>
			</ThemeProvider>
			</AuthProvider>
		</TanstackQueryProvider>
	)
}
