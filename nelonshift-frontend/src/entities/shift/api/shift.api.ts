import { api } from '@/shared/api'

import { TypeShift } from '../model'

export const shiftApi = {
	getShiftsById: async (projectId: number): Promise<TypeShift[]> => {
		const { data } = await api.get(`/projects/${projectId}/shifts`)
		return data
	},

	createShift: async (
		shift: Omit<TypeShift, 'id'>,
		projectId: number
	): Promise<TypeShift> => {
		const { data } = await api.post(`/projects/${projectId}/shifts`, shift)
		return data
	},

	updateShift: async (
		id: number,
		shift: Partial<TypeShift>,
		projectId: number
	): Promise<TypeShift> => {
		const { data } = await api.put(
			`/projects/${projectId}/shifts/${id}`,
			shift
		)
		return data
	},

	deleteShift: async (id: number, projectId: number): Promise<void> => {
		await api.delete(`/projects/${projectId}/shifts/${id}`)
	}
}
