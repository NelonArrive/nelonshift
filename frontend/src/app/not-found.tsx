'use client'

import { FileSearch, Home, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'

import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from '@/shared/components/ui'

export default function NotFound() {
	const router = useRouter()

	return (
		<div className='flex min-h-screen flex-col items-center justify-center px-4'>
			<Card className='animate-in fade-in w-full max-w-md text-center shadow-sm duration-500'>
				<CardHeader>
					<div className='flex flex-col items-center gap-3'>
						<FileSearch className='text-muted-foreground h-12 w-12' />
						<CardTitle className='text-2xl font-semibold'>
							Страница не найдена
						</CardTitle>
					</div>
				</CardHeader>

				<CardContent className='space-y-6'>
					<p className='text-muted-foreground text-sm'>
						Похоже, вы перешли по несуществующему адресу или страница была
						удалена.
					</p>

					<div className='flex flex-col items-center justify-center gap-3 sm:flex-row'>
						<Button
							variant='default'
							className='flex items-center gap-2 sm:w-auto'
							onClick={() => router.push('/dashboard')}
						>
							<Home className='h-4 w-4' />
							На главную
						</Button>

						<Button
							variant='outline'
							className='flex items-center gap-2 sm:w-auto'
							onClick={() => router.refresh()}
						>
							<RefreshCw className='h-4 w-4' />
							Обновить
						</Button>
					</div>
				</CardContent>
			</Card>

			<p className='text-muted-foreground mt-6 text-xs'>
				Ошибка 404 • Не удалось найти страницу
			</p>
		</div>
	)
}
