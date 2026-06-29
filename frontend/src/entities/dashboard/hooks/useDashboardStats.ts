import { useQuery } from '@tanstack/react-query'

import { dashboardApi } from '../api/dashboard.api'

export const dashboardStatsKey = ['dashboard', 'stats'] as const

export function useDashboardStats() {
	return useQuery({
		queryKey: dashboardStatsKey,
		queryFn: dashboardApi.getStats,
		staleTime: 5 * 60 * 1000
	})
}
