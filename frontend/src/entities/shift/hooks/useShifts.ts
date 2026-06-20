import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { shiftApi } from '../api'
import { TypeShift } from '../model/shift.types'

export const shiftQueryKeys = {
	all: (projectId: number) => ['projects', projectId, 'shifts'] as const,
	detail: (projectId: number, id: number) =>
		['projects', projectId, 'shifts', id] as const
}

export const useShifts = (projectId: number) =>
	useQuery<TypeShift[]>({
		queryKey: shiftQueryKeys.all(projectId),
		queryFn: () => shiftApi.getShiftsByProject(projectId),
		enabled: !!projectId
	})

export const useCreateShift = (projectId: number) => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (shift: {
			date: string
			startTime?: string
			endTime?: string
			hours: number
			basePay?: number
			overtimeHours?: number
			overtimePay?: number
			perDiem?: number
			compensation?: number
		}) => shiftApi.createShift({ ...shift, projectId }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: shiftQueryKeys.all(projectId) })
		}
	})
}

export const useUpdateShift = (projectId: number) => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({
			id,
			...shift
		}: { id: number } & Partial<Omit<TypeShift, 'id' | 'compensation'>>) =>
			shiftApi.updateShift(id, shift),
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
		mutationFn: (id: number) => shiftApi.deleteShift(id),
		onSuccess: (_, deletedId) => {
			queryClient.invalidateQueries({ queryKey: shiftQueryKeys.all(projectId) })
			queryClient.removeQueries({
				queryKey: shiftQueryKeys.detail(projectId, deletedId)
			})
		}
	})
}
