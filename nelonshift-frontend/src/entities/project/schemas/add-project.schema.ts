import { z } from 'zod'

export const addProjectSchema = z.object({
	name: z
		.string()
		.min(2, 'Название должно содержать минимум 2 символа')
		.max(50, 'Название слишком длинное'),
	status: z.enum(['ALL', 'PLANNED', 'ACTIVE', 'COMPLETED']),
	dateRange: z
		.object({
			from: z.date({ error: 'Выберите начальную дату' }),
			to: z.date().optional()
		})
		.refine(data => !data.to || data.from <= data.to, {
			message: 'Дата начала не может быть позже даты окончания'
		})
})

export type AddProjectFormData = z.infer<typeof addProjectSchema>
