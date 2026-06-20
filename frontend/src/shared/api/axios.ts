import axios, { type InternalAxiosRequestConfig } from 'axios'

export const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1'

export const BACKEND_BASE_URL =
	process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8080'

export const api = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json'
	}
})

let isRefreshing = false
let failedQueue: Array<{
	resolve: (value?: unknown) => void
	reject: (reason?: unknown) => void
}> = []

const processQueue = (error: unknown | null) => {
	failedQueue.forEach(promise => {
		if (error) {
			promise.reject(error)
		} else {
			promise.resolve()
		}
	})
	failedQueue = []
}

api.interceptors.response.use(
	response => response,
	async error => {
		const originalRequest = error.config as InternalAxiosRequestConfig & {
			_retry?: boolean
		}

		const isAuthRequest =
			originalRequest?.url?.includes('/auth/login') ||
			originalRequest?.url?.includes('/auth/signup') ||
			originalRequest?.url?.includes('/auth/refresh') ||
			originalRequest?.url?.includes('/auth/2fa')

		if (
			error.response?.status === 401 &&
			originalRequest &&
			!originalRequest._retry &&
			!isAuthRequest
		) {
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject })
				}).then(() => api(originalRequest))
			}

			originalRequest._retry = true
			isRefreshing = true

			try {
				await api.post('/auth/refresh')
				processQueue(null)
				return api(originalRequest)
			} catch (refreshError) {
				processQueue(refreshError)
				return Promise.reject(refreshError)
			} finally {
				isRefreshing = false
			}
		}

		console.error('API Error:', error.response?.data || error.message)
		return Promise.reject(error)
	}
)
