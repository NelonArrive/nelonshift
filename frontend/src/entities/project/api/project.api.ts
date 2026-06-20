import { api } from '@/shared/api'

import {
	TypePageResponse,
	TypeProjectItem,
	TypeSortBy,
	TypeSortOrder
} from '../model/project.types'

interface IGetAllParams {
	sortBy?: TypeSortBy
	sortDirection?: TypeSortOrder
	search?: string
	status?: string
	page?: number
	size?: number
}

export const projectsApi = {
	getAll: async (
		params?: IGetAllParams
	): Promise<TypePageResponse<TypeProjectItem>> => {
		const {
			sortBy = 'date',
			sortDirection = 'desc',
			search = '',
			status,
			page = 0,
			size = 8
		} = params || {}

		const queryParams = new URLSearchParams()
		queryParams.set('sortBy', sortBy)
		queryParams.set('sortDirection', sortDirection)
		queryParams.set('page', String(page))
		queryParams.set('size', String(size))
		if (search) queryParams.set('name', search)
		if (status && status !== 'ALL') queryParams.set('status', status)

		const { data } = await api.get<TypePageResponse<TypeProjectItem>>(
			`/projects?${queryParams.toString()}`
		)
		return data
	},

	getById: async (id: number): Promise<TypeProjectItem> => {
		const { data } = await api.get<TypeProjectItem>(`/projects/${id}`)
		return data
	},

	create: async (
		project: Pick<TypeProjectItem, 'name' | 'status' | 'startDate' | 'endDate'>
	): Promise<TypeProjectItem> => {
		const { data } = await api.post<TypeProjectItem>('/projects', project)
		return data
	},

	update: async (
		id: number,
		project: Partial<
			Pick<TypeProjectItem, 'name' | 'status' | 'startDate' | 'endDate'>
		>
	): Promise<TypeProjectItem> => {
		const { data } = await api.put<TypeProjectItem>(`/projects/${id}`, project)
		return data
	},

	delete: async (id: number): Promise<void> => {
		await api.delete(`/projects/${id}`)
	}
}
