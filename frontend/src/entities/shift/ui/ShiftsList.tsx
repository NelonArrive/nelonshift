'use client'

import { Clock } from 'lucide-react'

import { TypeShift } from '@/entities/shift/model'
import { ShiftItem } from '@/entities/shift/ui'

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from '@/shared/components/ui'

interface ShiftsListProps {
	shifts: TypeShift[]
	projectId: number
}

export function ShiftsList({ shifts, projectId }: ShiftsListProps) {
	const sortedShifts = [...shifts].sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
	)

	const calculateShiftEarnings = (shift: TypeShift) => {
		return (
			(shift.basePay || 0) + (shift.overtimePay || 0) + (shift.perDiem || 0)
		)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					<Clock className='h-5 w-5' />
					История смен
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{sortedShifts.map(shift => (
						<ShiftItem
							key={shift.id}
							shift={shift}
							projectId={projectId}
							totalEarnings={calculateShiftEarnings(shift)}
						/>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
