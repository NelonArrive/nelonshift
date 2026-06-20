import type { Metadata } from 'next'
import { Geist_Mono } from 'next/font/google'

import { ProfileButton } from '@/shared/components/ui'
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
		'💰 Приложение для управления сменами. Удобное приложение для планирования, учёта и контроля рабочих смен. Отслеживайте время, распределяйте задачи и анализируйте продуктивность. Подходит для команд любого размера.'
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
					<div className='relative flex min-h-screen flex-col'>
						<ProfileButton userImage='/img/avatar.jpg' />
						<div className='flex w-full items-center justify-center px-3'>
							{children}
						</div>
					</div>
				</MainProvider>
			</body>
		</html>
	)
}
