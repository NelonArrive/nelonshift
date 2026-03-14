import Link from 'next/link'

import { Button } from '@/shared/components/ui'

export default function Home() {
	return (
		<main className='bg-background flex min-h-screen items-center justify-center px-6'>
			<div className='max-w-lg text-center'>
				<h1 className='text-foreground mb-4 text-5xl font-bold'>
					📅 Nelon Shift
				</h1>

				<p className='text-muted-foreground mb-8 text-lg'>
					Простое и удобное приложение для учёта смен. Следи за графиком,
					управляй часами и контролируй занятость.
				</p>

				<div className='flex justify-center gap-4'>
					<Button asChild>
						<Link href='/auth/login'>Войти</Link>
					</Button>
					<Button asChild variant='outline'>
						<Link href='/auth/register'>Регистрация</Link>
					</Button>
				</div>
			</div>
		</main>
	)
}
