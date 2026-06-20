import ExcelJS from 'exceljs'

import { TypeProjectItem } from '@/entities/project/model'
import { TypeShift } from '@/entities/shift/model'

const HOURLY_RATE = 4000 / 12 // ~333.33 руб/час для обычной смены
const OVERTIME_RATE = 400 // руб/час за переработку
const PER_DIEM = 1200 // суточные

export async function exportProjectToExcel(
	project: TypeProjectItem,
	shifts: TypeShift[]
) {
	const workbook = new ExcelJS.Workbook()
	const worksheet = workbook.addWorksheet('Табель')

	// Сортируем смены по дате
	const sortedShifts = shifts.sort(
		(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
	)

	// Форматирование дат
	const formatDate = (dateStr: string) => {
		const date = new Date(dateStr)
		const day = date.getDate()
		const month = date.toLocaleDateString('ru-RU', { month: 'short' })
		return `${day}.${month}`
	}

	// Строка 1: Общая сумма (будет формула)
	worksheet.getCell('A1').value = 'Общая сумма'
	worksheet.getCell('B1').value = { formula: 'K12' } // Ссылка на итоговую сумму с налогом
	worksheet.getCell('A1').font = { bold: true }
	worksheet.getCell('B1').numFmt = '#,##0.00'

	// Строка 2: Пустая для отступа

	// Строка 3: Имя работника (можно добавить, если есть)
	worksheet.getCell('A3').value = project.name
	worksheet.getCell('A3').font = { bold: true, size: 14 }

	// Строка 4: Заголовок "Дата"
	worksheet.getCell('A4').value = 'Дата'
	worksheet.getCell('A4').font = { bold: true }

	// Заполняем даты (начиная с B4)
	sortedShifts.forEach((shift, index) => {
		const cell = worksheet.getCell(4, 2 + index) // B4, C4, D4...
		cell.value = formatDate(shift.date)
		cell.alignment = { horizontal: 'center' }
	})

	// Заголовок "Часы" справа
	worksheet.getCell(4, 2 + sortedShifts.length).value = 'Часы'
	worksheet.getCell(4, 2 + sortedShifts.length).font = { bold: true }

	// Строка 5: Заголовок "Время"
	worksheet.getCell('A5').value = 'Время'
	worksheet.getCell('A5').font = { bold: true }

	// Заполняем время
	sortedShifts.forEach((shift, index) => {
		const cell = worksheet.getCell(5, 2 + index)
		cell.value = `${shift.startTime}-${shift.endTime}`
		cell.alignment = { horizontal: 'center' }
	})

	// Строка 6: Смена
	worksheet.getCell('A6').value = 'Смена'
	worksheet.getCell('A6').font = { bold: true }

	sortedShifts.forEach((shift, index) => {
		const cell = worksheet.getCell(6, 2 + index)
		cell.value = shift.hours
		cell.alignment = { horizontal: 'center' }
	})

	// Итого часов смены (формула суммы)
	const hoursColumn = 2 + sortedShifts.length
	worksheet.getCell(6, hoursColumn).value = {
		formula: `SUM(B6:${String.fromCharCode(65 + hoursColumn - 2)}6)`
	}
	worksheet.getCell(6, hoursColumn).font = { bold: true }

	// Строка 7: Переработка
	worksheet.getCell('A7').value = 'Переработка'
	worksheet.getCell('A7').font = { bold: true }

	sortedShifts.forEach((shift, index) => {
		if (shift.overtimeHours && shift.overtimeHours > 0) {
			const cell = worksheet.getCell(7, 2 + index)
			cell.value = shift.overtimeHours
			cell.alignment = { horizontal: 'center' }
		}
	})

	// Итого переработок
	worksheet.getCell(7, hoursColumn).value = {
		formula: `SUM(B7:${String.fromCharCode(65 + hoursColumn - 2)}7)`
	}
	worksheet.getCell(7, hoursColumn).font = { bold: true }

	// Строка 8: Суточные
	worksheet.getCell('A8').value = 'Суточные'
	worksheet.getCell('A8').font = { bold: true }

	sortedShifts.forEach((shift, index) => {
		if (shift.perDiem && shift.perDiem > 0) {
			const cell = worksheet.getCell(8, 2 + index)
			cell.value = shift.perDiem
			cell.alignment = { horizontal: 'center' }
		}
	})

	// Строка 9: Компенсация (обычно 0)
	worksheet.getCell('A9').value = 'Компенсация'
	worksheet.getCell('A9').font = { bold: true }

	// Заголовок "Сумма" справа от "Часы"
	const sumColumn = hoursColumn + 1
	worksheet.getCell(4, sumColumn).value = 'Сумма'
	worksheet.getCell(4, sumColumn).font = { bold: true }

	// Формулы расчёта сумм
	// Сумма за смены (часы * ставка)
	worksheet.getCell(6, sumColumn).value = {
		formula: `${worksheet.getCell(6, hoursColumn).address}/12*4000`
	}
	worksheet.getCell(6, sumColumn).numFmt = '#,##0'

	// Сумма за переработки
	worksheet.getCell(7, sumColumn).value = {
		formula: `${worksheet.getCell(7, hoursColumn).address}*400`
	}
	worksheet.getCell(7, sumColumn).numFmt = '#,##0'

	// Сумма суточных (сумма всех суточных)
	worksheet.getCell(8, sumColumn).value = {
		formula: `SUM(B8:${String.fromCharCode(65 + hoursColumn - 2)}8)`
	}
	worksheet.getCell(8, sumColumn).numFmt = '#,##0'

	// Компенсация = 0
	worksheet.getCell(9, sumColumn).value = 0

	// Строка 10: Итого
	worksheet.getCell('A10').value = 'Итого'
	worksheet.getCell('A10').font = { bold: true, size: 12 }
	worksheet.getCell(10, sumColumn).value = {
		formula: `${worksheet.getCell(6, sumColumn).address}+${worksheet.getCell(7, sumColumn).address}+${worksheet.getCell(8, sumColumn).address}+${worksheet.getCell(9, sumColumn).address}`
	}
	worksheet.getCell(10, sumColumn).font = { bold: true }
	worksheet.getCell(10, sumColumn).numFmt = '#,##0'

	// Строка 11: Билеты
	worksheet.getCell('A11').value = 'Билеты'
	worksheet.getCell('A11').font = { bold: true }
	worksheet.getCell(11, sumColumn).value = 0

	// Строка 12: С Налогом
	worksheet.getCell('A12').value = 'С Налогом'
	worksheet.getCell('A12').font = { bold: true }
	worksheet.getCell(12, sumColumn).value = {
		formula: `(${worksheet.getCell(10, sumColumn).address}+${worksheet.getCell(11, sumColumn).address})*100/94`
	}
	worksheet.getCell(12, sumColumn).font = { bold: true }
	worksheet.getCell(12, sumColumn).numFmt = '#,##0.00000'

	// Настройка ширины колонок
	worksheet.getColumn(1).width = 15
	for (let i = 2; i <= sortedShifts.length + 3; i++) {
		worksheet.getColumn(i).width = 12
	}

	// Добавляем границы
	const lastRow = 12
	const lastCol = sumColumn
	for (let row = 4; row <= lastRow; row++) {
		for (let col = 1; col <= lastCol; col++) {
			const cell = worksheet.getCell(row, col)
			cell.border = {
				top: { style: 'thin' },
				left: { style: 'thin' },
				bottom: { style: 'thin' },
				right: { style: 'thin' }
			}
		}
	}

	// Фон для заголовков
	for (let col = 1; col <= lastCol; col++) {
		const cell = worksheet.getCell(4, col)
		cell.fill = {
			type: 'pattern',
			pattern: 'solid',
			fgColor: { argb: 'FFE0E0E0' }
		}
	}

	// Сохранение файла
	const buffer = await workbook.xlsx.writeBuffer()
	const blob = new Blob([buffer], {
		type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
	})

	const url = window.URL.createObjectURL(blob)
	const link = document.createElement('a')
	link.href = url
	link.download = `${project.name}_${new Date().toISOString().split('T')[0]}.xlsx`
	link.click()
	window.URL.revokeObjectURL(url)
}
