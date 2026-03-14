import { z } from 'zod'

export const addShiftSchema = z
	.object({
		date: z.string().min(1, 'Выберите дату смены'),
		startTime: z.string().min(1, 'Укажите время начала'),
		endTime: z.string().min(1, 'Укажите время окончания'),
		basePay: z.number().min(0, 'Оплата не может быть отрицательной').optional(),
		overtimeHours: z
			.number()
			.min(0, 'Часы не могут быть отрицательными')
			.optional(),
		overtimePay: z
			.number()
			.min(0, 'Оплата не может быть отрицательной')
			.optional(),
		perDiem: z
			.number()
			.min(0, 'Суточные не могут быть отрицательными')
			.optional()
	})
	.refine(
		data => {
			if (!data.startTime || !data.endTime) return true
			return data.startTime < data.endTime
		},
		{
			message: 'Время окончания должно быть позже времени начала',
			path: ['endTime']
		}
	)

export type AddShiftFormData = z.infer<typeof addShiftSchema>
