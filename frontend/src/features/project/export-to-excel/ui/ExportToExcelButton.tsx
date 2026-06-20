import { FileSpreadsheet } from 'lucide-react'
import { toast } from 'sonner'

import { TypeProjectItem } from '@/entities/project/model'
import { TypeShift } from '@/entities/shift/model'

import { Button } from '@/shared/components/ui'

import { exportProjectToExcel } from '../lib/exportProjectToExcel'

interface ExportToExcelButtonProps {
	project: TypeProjectItem
	shifts: TypeShift[]
}

export function ExportToExcelButton({
	project,
	shifts
}: ExportToExcelButtonProps) {
	const handleExport = async () => {
		try {
			await exportProjectToExcel(project, shifts)
			toast.success('Экспорт завершён', {
				description: `Проект "${project.name}" успешно экспортирован в Excel.`
			})
		} catch (error) {
			console.error('Ошибка экспорта:', error)
			toast.error('Ошибка экспорта', {
				description:
					error instanceof Error
						? error.message
						: 'Не удалось экспортировать проект. Попробуйте ещё раз.'
			})
		}
	}

	return (
		<Button
			onClick={handleExport}
			size='icon'
			variant='outline'
			className='border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950'
		>
			<FileSpreadsheet className='h-4 w-4' />
		</Button>
	)
}
