import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { projectsApi } from '../api/project.api'
import {
	TypeProjectItem,
	TypeSortBy,
	TypeSortOrder,
	TypeStatusFilter
} from '../model'
import { useProjectsStore } from '../store/projects.store'

export const projectsQueryKeys = {
	all: (
		sortBy: TypeSortBy,
		sortOrder: TypeSortOrder,
		status: TypeStatusFilter,
		search: string,
		page: number,
		limit: number
	) => ['projects', sortBy, sortOrder, status, search, page, limit] as const,
	detail: (id: number) => ['projects', id] as const
}

interface ProjectsResponse {
	projects: TypeProjectItem[]
	total: number
	totalPages: number
	currentPage: number
}

export const useProjects = () => {
	const { sortBy, sortOrder, searchQuery, statusFilter, page, limit } =
		useProjectsStore()

	return useQuery<ProjectsResponse>({
		queryKey: projectsQueryKeys.all(
			sortBy,
			sortOrder,
			statusFilter,
			searchQuery,
			page,
			limit
		),
		queryFn: () =>
			projectsApi.getAll({
				sortBy,
				sortOrder,
				status: statusFilter,
				search: searchQuery,
				page,
				limit
			}),
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000
	})
}

export const useProjectById = (id: number) => {
	return useQuery<TypeProjectItem>({
		queryKey: projectsQueryKeys.detail(id),
		queryFn: () => projectsApi.getById(id),
		enabled: !!id
	})
}

export const useCreateProject = () => {
	const queryClient = useQueryClient()
	const { sortBy, sortOrder, statusFilter, searchQuery, page, limit } =
		useProjectsStore()

	return useMutation({
		mutationFn: projectsApi.create,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: projectsQueryKeys.all(
					sortBy,
					sortOrder,
					statusFilter,
					searchQuery,
					page,
					limit
				)
			})
		}
	})
}

export const useUpdateProject = () => {
	const queryClient = useQueryClient()
	const { sortBy, sortOrder, statusFilter, searchQuery, page, limit } =
		useProjectsStore()

	return useMutation({
		mutationFn: ({
			id,
			...project
		}: { id: number } & Partial<TypeProjectItem>) =>
			projectsApi.update(id, project),
		onSuccess: data => {
			queryClient.invalidateQueries({
				queryKey: projectsQueryKeys.all(
					sortBy,
					sortOrder,
					statusFilter,
					searchQuery,
					page,
					limit
				)
			})
			queryClient.setQueryData(projectsQueryKeys.detail(data.id), data)
		}
	})
}

export const useDeleteProject = () => {
	const queryClient = useQueryClient()
	const { sortBy, sortOrder, statusFilter, searchQuery, page, limit } =
		useProjectsStore()

	return useMutation({
		mutationFn: projectsApi.delete,
		onSuccess: (_, deletedId) => {
			queryClient.invalidateQueries({
				queryKey: projectsQueryKeys.all(
					sortBy,
					sortOrder,
					statusFilter,
					searchQuery,
					page,
					limit
				)
			})
			queryClient.removeQueries({
				queryKey: projectsQueryKeys.detail(deletedId)
			})
		}
	})
}
