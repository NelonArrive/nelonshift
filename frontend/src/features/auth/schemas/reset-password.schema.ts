import { z } from 'zod'

export const ResetPasswordSchema = z.object({
	email: z.string().email({
		message: 'Неверный формат e-mail'
	})
})

export type TypeResetPasswordSchema = z.infer<typeof ResetPasswordSchema>
