import type { Metadata } from 'next'
import { Geist_Mono } from 'next/font/google'

import { MainProvider } from '@/shared/providers'
import '@/shared/styles/globals.css'

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin']
})

export const metadata: Metadata = {
	title: {
		absolute: 'Nelon Shift | Главная',
		template: '%s | Nelon Shift'
	},
	description:
		'Приложение для управления сменами.'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='ru' suppressHydrationWarning>
			<body className={geistMono.className}>
				<MainProvider>
					{children}
				</MainProvider>
			</body>
		</html>
	)
}
