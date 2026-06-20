import { api } from '@/shared/api'

import {
	AuthResponse,
	AuthUser,
	LoginRequest,
	SignupRequest
} from '../model/auth.types'

export const authApi = {
	login: async (data: LoginRequest): Promise<AuthResponse> => {
		const { data: response } = await api.post<AuthResponse>('/auth/login', data)
		return response
	},

	signup: async (data: SignupRequest): Promise<{ message: string }> => {
		const { data: response } = await api.post<{ message: string }>(
			'/auth/signup',
			data
		)
		return response
	},

	logout: async (): Promise<{ message: string }> => {
		const { data: response } = await api.post<{ message: string }>('/auth/logout')
		return response
	},

	me: async (): Promise<AuthUser> => {
		const { data } = await api.get<AuthUser>('/auth/me')
		return data
	},

	verify2fa: async (code: string): Promise<AuthResponse> => {
		const { data } = await api.post<AuthResponse>('/auth/2fa/verify', { code })
		return data
	},

	forgotPassword: async (payload: {
		email: string
		recaptchaToken?: string
	}): Promise<{ message: string }> => {
		const { data } = await api.post<{ message: string }>(
			'/auth/forgot-password',
			payload
		)
		return data
	},

	resetPassword: async (payload: {
		token: string
		password: string
	}): Promise<{ message: string }> => {
		const { data } = await api.post<{ message: string }>(
			'/auth/reset-password',
			payload
		)
		return data
	}
}
