import { useMemo } from 'react'

import {
	type ProjectStats,
	type Shift,
	calculateProjectStats
} from '@/shared/utils/projectStats'

export function useProjectStats(
	shifts: Shift[],
	projectDateRange?: { from: string; to: string }
): ProjectStats {
	return useMemo(
		() => calculateProjectStats(shifts, projectDateRange),
		[shifts, projectDateRange]
	)
}
