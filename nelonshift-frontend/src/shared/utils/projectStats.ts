import { formatDateRange } from '../lib'

export type Shift = {
	date: string
	basePay?: number | null
	overtimePay?: number | null
	perDiem?: number | null
}

export type ProjectStats = {
	shiftCount: number
	period: string
	totalEarnings: number
	payPerShift: number
}

export function calculateProjectStats(
	shifts: Shift[],
	projectDateRange?: { from: string; to: string }
): ProjectStats {
	if (!shifts.length) {
		return {
			shiftCount: 0,
			period: projectDateRange
				? formatDateRange(projectDateRange.from, projectDateRange.to)
				: '—',
			totalEarnings: 0,
			payPerShift: 0
		}
	}

	let period: string
	if (projectDateRange) {
		period = formatDateRange(projectDateRange.from, projectDateRange.to)
	} else {
		const shiftDates = shifts
			.map(shift => new Date(shift.date))
			.sort((a, b) => a.getTime() - b.getTime())
		period = formatDateRange(
			shiftDates[0].toISOString(),
			shiftDates[shiftDates.length - 1].toISOString()
		)
	}

	const payPerShift = shifts.reduce((_, shift) => shift.basePay ?? 0, 0)

	const totalEarnings = shifts.reduce(
		(sum, shift) =>
			sum +
			(shift.basePay ?? 0) +
			(shift.overtimePay ?? 0) +
			(shift.perDiem ?? 0),
		0
	)

	return {
		shiftCount: shifts.length,
		period,
		totalEarnings,
		payPerShift
	}
}
