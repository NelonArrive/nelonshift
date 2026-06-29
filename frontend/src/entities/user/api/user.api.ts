import { api } from '@/shared/api'

import { AuthUser } from '@/features/auth/model/auth.types'

interface UpdateUserRequest {
	name?: string
}

export const userApi = {
	getMe: async (): Promise<AuthUser> => {
		const { data } = await api.get<AuthUser>('/auth/me')
		return data
	},

	updateProfile: async (
		userId: string,
		request: UpdateUserRequest
	): Promise<AuthUser> => {
		const { data } = await api.put<AuthUser>(`/users/${userId}`, request)
		return data
	}
}
