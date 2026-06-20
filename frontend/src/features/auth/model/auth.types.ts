import { TypeProjectItem } from '@/entities/project/model'

export type AuthUser = {
	id: string
	email: string
	name: string
	projects?: TypeProjectItem[]
}

export type LoginRequest = {
	email: string
	password: string
	recaptchaToken?: string
}

export type SignupRequest = {
	email: string
	name: string
	password: string
	recaptchaToken?: string
}

export type AuthResponse = {
	id: string
	email: string
	name: string
	requires2fa?: boolean
}
