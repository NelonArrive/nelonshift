import { z } from 'zod'

export const addProjectSchema = z.object({
	name: z
		.string()
		.min(2, 'Название должно содержать минимум 2 символа')
		.max(100, 'Название слишком длинное'),
	status: z.enum(['ALL', 'PLANNED', 'ACTIVE', 'COMPLETED']),
	startDate: z.date({ error: 'Выберите начальную дату' }),
	endDate: z.date().optional()
}).refine(data => !data.endDate || data.startDate <= data.endDate, {
	message: 'Дата начала не может быть позже даты окончания'
})

export type AddProjectFormData = z.infer<typeof addProjectSchema>
