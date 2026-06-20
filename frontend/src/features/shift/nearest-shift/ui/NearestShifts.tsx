'use client'

import { useMemo } from 'react'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { CalendarDays } from 'lucide-react'

import { useProjects } from '@/entities/project/hooks'
import { shiftApi } from '@/entities/shift/api'

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from '@/shared/components/ui'
import { useQuery } from '@tanstack/react-query'

export function NearestShifts() {
	const { data: projectsData } = useProjects()

	const projectIds = useMemo(
		() => projectsData?.content?.map(p => p.id) ?? [],
		[projectsData]
	)

	const { data: allShifts, isLoading } = useQuery({
		queryKey: ['shifts', 'nearest', projectIds],
		queryFn: async () => {
			const results = await Promise.all(
				projectIds.map(id => shiftApi.getShiftsByProject(id))
			)
			return results.flat()
		},
		enabled: projectIds.length > 0
	})

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

	if (!allShifts?.length) {
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
	const nearestShift = allShifts
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
					</div>
				) : (
					<p className='text-muted-foreground'>Нет ближайших смен</p>
				)}
			</CardContent>
		</Card>
	)
}
