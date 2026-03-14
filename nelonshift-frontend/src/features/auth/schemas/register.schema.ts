import { z } from 'zod'

export const RegisterSchema = z
	.object({
		name: z.string().min(1, {
			message: 'Имя обязательно для заполнения'
		}),
		email: z.string().email({
			message: 'Неверный формат e-mail'
		}),
		password: z.string().min(6, {
			message: 'Минимальная длина пароля — 6 символов'
		}),
		passwordRepeat: z.string().min(6, {
			message: 'Минимальная длина подтверждающего пароля — 6 символов'
		})
	})
	.refine(data => data.password === data.passwordRepeat, {
		message: 'Пароли должны совпадать',
		path: ['passwordRepeat']
	})

export type TypeRegisterSchema = z.infer<typeof RegisterSchema>
