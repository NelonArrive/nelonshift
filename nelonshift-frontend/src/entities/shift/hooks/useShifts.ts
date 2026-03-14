import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useProjects } from '@/entities/project/hooks'

import { shiftApi } from '../api'
import { TypeShift } from '../model/shift.types'

export const shiftQueryKeys = {
	all: (projectId: number) => ['projects', projectId, 'shifts'] as const,
	detail: (projectId: number, id: number) =>
		['projects', projectId, 'shifts', id] as const
}

export const useAllShifts = () => {
	const { data: projectsData } = useProjects()

	return useQuery<TypeShift[]>({
		queryKey: ['shifts', 'all'],
		queryFn: async () => {
			if (!projectsData?.projects?.length) return []

			const shiftsPromises = projectsData.projects.map(async project => {
				try {
					const shifts = await shiftApi.getShiftsById(project.id)
					return shifts.map(shift => ({
						...shift,
						projectId: project.id,
						projectTitle: project.name
					}))
				} catch (error) {
					console.error('Error fetching shifts for project', project.id, error)
					return []
				}
			})

			const allShifts = await Promise.all(shiftsPromises)
			const flatShifts = allShifts.flat()
			return flatShifts
		},
		enabled: !!projectsData?.projects?.length
	})
}

export const useShifts = (projectId: number) =>
	useQuery<TypeShift[]>({
		queryKey: shiftQueryKeys.all(projectId),
		queryFn: () => shiftApi.getShiftsById(projectId),
		enabled: !!projectId
	})

export const useCreateShift = (projectId: number) => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (shift: Omit<TypeShift, 'id'>) =>
			shiftApi.createShift(shift, projectId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: shiftQueryKeys.all(projectId) })
		}
	})
}

export const useUpdateShift = (projectId: number) => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({ id, ...shift }: { id: number } & Partial<TypeShift>) =>
			shiftApi.updateShift(id, shift, projectId),
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: shiftQueryKeys.all(projectId) })
			if (data?.id) {
				queryClient.setQueryData(
					shiftQueryKeys.detail(projectId, data.id),
					data
				)
			}
		}
	})
}

export const useDeleteShift = (projectId: number) => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (id: number) => shiftApi.deleteShift(id, projectId),
		onSuccess: (_, deletedId) => {
			queryClient.invalidateQueries({ queryKey: shiftQueryKeys.all(projectId) })
			queryClient.removeQueries({
				queryKey: shiftQueryKeys.detail(projectId, deletedId)
			})
		}
	})
}
