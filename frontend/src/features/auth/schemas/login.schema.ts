import { z } from 'zod'

export const LoginSchema = z.object({
	email: z.string().email({
		message: 'Неверный формат e-mail'
	}),
	password: z.string().min(6, {
		message: 'Минимальная длина пароля — 6 символов'
	}),
	code: z.optional(z.string())
})

export type TypeLoginSchema = z.infer<typeof LoginSchema>
