export function formatDate(dateString: string): string {
	const date = new Date(dateString)
	return date.toLocaleDateString('ru-RU', {
		day: '2-digit',
		month: '2-digit'
	})
}

export function formatDateRange(startDate: string, endDate: string): string {
	if (!startDate || !endDate) return '—'
	if (startDate === endDate) {
		return formatDate(startDate)
	}
	return `${formatDate(startDate)} – ${formatDate(endDate)}`
}

export function formatDateRussian(dateString: string): string {
	const date = new Date(dateString)
	return date.toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'long'
	})
}
