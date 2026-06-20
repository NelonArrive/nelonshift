'use client'

import { ArrowUpDown, Grid3x3, List } from 'lucide-react'

import { TypeSortBy } from '@/entities/project/model'
import { useProjectsStore } from '@/entities/project/store'

import { Button } from '@/shared/components/ui'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/shared/components/ui'

export function ProjectsSort() {
	const {
		setSortBy,
		sortBy,
		sortOrder,
		toggleSortOrder,
		viewMode,
		setViewMode
	} = useProjectsStore()

	return (
		<div className='flex items-center justify-between gap-4 border-y py-4'>
			{/* Левая часть - Сортировка */}
			<div className='flex items-center gap-3'>
				<span className='text-muted-foreground text-sm font-medium'>
					Сортировка:
				</span>

				<Select
					value={sortBy}
					onValueChange={(value: TypeSortBy) => setSortBy(value)}
				>
					<SelectTrigger className='w-[180px]'>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='date'>По дате</SelectItem>
						<SelectItem value='name'>По названию</SelectItem>
						<SelectItem value='status'>По статусу</SelectItem>
						<SelectItem value='totalPay'>По прибыли</SelectItem>
					</SelectContent>
				</Select>

				{/* Кнопка ASC/DESC */}
				<Button
					variant='outline'
					size='sm'
					className='min-w-[140px] gap-2'
					onClick={toggleSortOrder}
				>
					<ArrowUpDown className='h-4 w-4' />
					{sortOrder === 'asc' ? 'По возрастанию' : 'По убыванию'}
				</Button>
			</div>

			{/* Правая часть - Вид отображения */}
			<div className='flex items-center gap-2'>
				<span className='text-muted-foreground mr-2 text-sm font-medium'>
					Вид:
				</span>
				<Button
					variant={viewMode === 'list' ? 'default' : 'outline'}
					size='sm'
					onClick={() => setViewMode('list')}
				>
					<List className='h-4 w-4' />
				</Button>
				<Button
					variant={viewMode === 'grid' ? 'default' : 'outline'}
					size='sm'
					onClick={() => setViewMode('grid')}
				>
					<Grid3x3 className='h-4 w-4' />
				</Button>
			</div>
		</div>
	)
}
