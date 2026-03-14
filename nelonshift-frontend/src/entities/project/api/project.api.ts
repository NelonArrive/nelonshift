import { api } from '@/shared/api'

import {
	TypeProjectItem,
	TypeSortBy,
	TypeSortOrder
} from '../model/project.types'

interface IGetAllParams {
	sortBy?: TypeSortBy
	sortOrder: TypeSortOrder
	search?: string
	status?: string
	page?: number
	limit?: number
}

interface ProjectsResponse {
	projects: TypeProjectItem[]
	total: number
	totalPages: number
	currentPage: number
}

export const projectsApi = {
	getAll: async (params?: IGetAllParams): Promise<ProjectsResponse> => {
		const {
			sortBy = 'name',
			sortOrder = 'asc',
			search = '',
			status,
			page = 1,
			limit = 8
		} = params || {}

		const apiSortField = sortBy === 'date' ? 'created_at' : sortBy
		const sortParam = sortOrder === 'desc' ? `-${apiSortField}` : apiSortField

		let baseUrl = `/projects?sortBy=${sortParam}`
		if (search) baseUrl += `&name=*${search.toLowerCase()}*`
		if (status && status !== 'ALL') baseUrl += `&status=${status}`

		const { data: allProjects } = await api.get<TypeProjectItem[]>(baseUrl)
		const total = allProjects.length

		const paginatedUrl = `${baseUrl}&page=${page}&limit=${limit}`
		const { data } = await api.get<TypeProjectItem[]>(paginatedUrl)

		const totalPages = Math.ceil(total / limit)

		return {
			projects: data,
			total,
			totalPages,
			currentPage: page
		}
	},

	getById: async (id: number): Promise<TypeProjectItem> => {
		const { data } = await api.get<TypeProjectItem>(`/projects/${id}`)
		return data
	},

	create: async (
		project: Omit<TypeProjectItem, 'id'>
	): Promise<TypeProjectItem> => {
		const { data } = await api.post<TypeProjectItem>('/projects', project)
		return data
	},

	update: async (
		id: number,
		project: Partial<TypeProjectItem>
	): Promise<TypeProjectItem> => {
		const { data } = await api.put<TypeProjectItem>(`/projects/${id}`, project)
		return data
	},

	delete: async (id: number): Promise<void> => {
		await api.delete(`/projects/${id}`)
	}
}
