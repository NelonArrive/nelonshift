import { api } from '@/shared/api'

import { TypeDashboardStats } from '../model/dashboard.types'

export const dashboardApi = {
	getStats: async (): Promise<TypeDashboardStats> => {
		const { data } = await api.get<TypeDashboardStats>('/dashboard/stats')
		return data
	}
}
