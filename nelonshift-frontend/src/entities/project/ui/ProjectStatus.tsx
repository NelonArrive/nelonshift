import { Badge } from '@/shared/components/ui'

import { TypeStatusFilter } from '../model'

interface ProjectStatusProps {
	status: TypeStatusFilter
}

const STATUS_MAP: Record<
	Exclude<TypeStatusFilter, 'ALL'>,
	{ label: string; color: string }
> = {
	PLANNED: { label: 'Запланирован', color: 'bg-[#B59AFF]' },
	ACTIVE: { label: 'Активный', color: 'bg-[#68CC58]' },
	COMPLETED: { label: 'Завершён', color: 'bg-red-500' }
}

export function ProjectStatusBadge({ status }: ProjectStatusProps) {
	if (status === 'ALL') {
		return null
	}

	const { label, color } = STATUS_MAP[status] ?? {
		label: 'Неизвестный',
		color: 'bg-gray-400'
	}

	return (
		<Badge variant='outline' className='gap-2 px-2 py-0.5 text-xs font-medium'>
			<span className={`h-2 w-2 rounded-full ${color}`} />
			{label}
		</Badge>
	)
}
