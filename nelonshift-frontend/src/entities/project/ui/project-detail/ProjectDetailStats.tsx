'use client'

import { Card, CardContent } from '@/shared/components/ui'

interface ProjectStatsProps {
	shiftsCount: number
	period: string
	totalEarnings: number
	payPerShift: number
}

export function ProjectDetailStats({
	shiftsCount,
	period,
	totalEarnings,
	payPerShift
}: ProjectStatsProps) {
	return (
		<div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
			<Card>
				<CardContent>
					<div className='text-2xl font-bold'>{shiftsCount}</div>
					<p className='text-muted-foreground text-xs'>Всего смен</p>
				</CardContent>
			</Card>

			<Card>
				<CardContent>
					<div className='text-xl font-bold'>{period}</div>
					<p className='text-muted-foreground text-xs'>Период</p>
				</CardContent>
			</Card>

			<Card>
				<CardContent>
					<div className='text-2xl font-bold'>
						{totalEarnings.toLocaleString()} ₽
					</div>
					<p className='text-muted-foreground text-xs'>Всего заработано</p>
				</CardContent>
			</Card>

			<Card>
				<CardContent>
					<div className='text-2xl font-bold'>
						{payPerShift.toLocaleString()} ₽
					</div>
					<p className='text-muted-foreground text-xs'>Ставка за смену</p>
				</CardContent>
			</Card>
		</div>
	)
}
