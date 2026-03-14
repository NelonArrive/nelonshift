'use client'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { CalendarDays } from 'lucide-react'

import { useAllShifts } from '@/entities/shift/hooks'

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from '@/shared/components/ui'

export function NearestShifts() {
	const { data: shifts, isLoading } = useAllShifts()

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2 text-lg'>
						<CalendarDays className='h-5 w-5' /> Ближайшая смена
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className='text-muted-foreground'>Загрузка...</p>
				</CardContent>
			</Card>
		)
	}

	if (!shifts?.length) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2 text-lg'>
						<CalendarDays className='h-5 w-5' /> Ближайшая смена
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className='text-muted-foreground'>Нет данных о сменах</p>
				</CardContent>
			</Card>
		)
	}

	const now = new Date()
	const nearestShift = shifts
		.filter(s => new Date(s.date) > now)
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]

	return (
		<Card>
			<CardHeader>
				<CardTitle className='flex items-center gap-2 text-lg'>
					<CalendarDays className='h-5 w-5' /> Ближайшая смена
				</CardTitle>
			</CardHeader>
			<CardContent>
				{nearestShift ? (
					<div className='space-y-1'>
						<p className='text-xl font-bold'>
							{format(new Date(nearestShift.date), 'd MMMM yyyy', {
								locale: ru
							})}
						</p>
						<p className='text-muted-foreground'>
							Проект:{' '}
							<span className='font-semibold'>{nearestShift.projectTitle}</span>
						</p>
					</div>
				) : (
					<p className='text-muted-foreground'>Нет ближайших смен</p>
				)}
			</CardContent>
		</Card>
	)
}
