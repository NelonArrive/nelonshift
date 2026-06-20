import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { projectsApi } from '../api/project.api'
import {
	TypePageResponse,
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
		size: number
	) => ['projects', sortBy, sortOrder, status, search, page, size] as const,
	detail: (id: number) => ['projects', id] as const
}

export const useProjects = () => {
	const { sortBy, sortOrder, searchQuery, statusFilter, page, limit } =
		useProjectsStore()

	return useQuery<TypePageResponse<TypeProjectItem>>({
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
				sortDirection: sortOrder,
				status: statusFilter,
				search: searchQuery,
				page: page - 1,
				size: limit
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
		}: {
			id: number
		} & Partial<Pick<TypeProjectItem, 'name' | 'status' | 'startDate' | 'endDate'>>) =>
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
