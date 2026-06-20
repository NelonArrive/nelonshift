import { api } from '@/shared/api'

import { TypeShift } from '../model'

interface ICreateShiftRequest {
	projectId: number
	date: string
	startTime?: string
	endTime?: string
	hours: number
	basePay?: number
	overtimeHours?: number
	overtimePay?: number
	perDiem?: number
	compensation?: number
}

export const shiftApi = {
	getShiftsByProject: async (projectId: number): Promise<TypeShift[]> => {
		const { data } = await api.get<TypeShift[]>(
			`/shifts?projectId=${projectId}`
		)
		return data
	},

	createShift: async (shift: ICreateShiftRequest): Promise<TypeShift> => {
		const { data } = await api.post<TypeShift>('/shifts', shift)
		return data
	},

	updateShift: async (
		id: number,
		shift: Partial<Omit<TypeShift, 'id' | 'compensation'>>
	): Promise<TypeShift> => {
		const { data } = await api.put<TypeShift>(`/shifts/${id}`, shift)
		return data
	},

	deleteShift: async (id: number): Promise<void> => {
		await api.delete(`/shifts/${id}`)
	}
}
