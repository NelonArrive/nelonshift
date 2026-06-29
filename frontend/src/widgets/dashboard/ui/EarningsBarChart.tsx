'use client'

import { AlertTriangle } from 'lucide-react'
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts'

import { useDashboardStats } from '@/entities/dashboard'

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Skeleton
} from '@/shared/components/ui'

const CHART_COLORS = [
	'#3b82f6',
	'#8b5cf6',
	'#06b6d4',
	'#10b981',
	'#f59e0b',
	'#ef4444'
]

function formatCurrency(value: number) {
	return value.toLocaleString('ru-RU') + ' ₽'
}

export function EarningsBarChart() {
	const { data, isLoading, error } = useDashboardStats()

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<Skeleton className='h-6 w-1/2' />
				</CardHeader>
				<CardContent>
					<Skeleton className='h-[250px] w-full' />
				</CardContent>
			</Card>
		)
	}

	if (error) {
		return (
			<Card>
				<CardContent className='flex items-center justify-center py-12 text-red-500'>
					<AlertTriangle className='mr-2 h-5 w-5' />
					Ошибка загрузки графика
				</CardContent>
			</Card>
		)
	}

	const projects = data?.topProjects ?? []

	if (projects.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className='text-lg'>Заработок по проектам</CardTitle>
				</CardHeader>
				<CardContent>
					<p className='text-muted-foreground py-12 text-center text-sm'>
						Нет данных для отображения
					</p>
				</CardContent>
			</Card>
		)
	}

	const chartData = projects.map(p => ({
		name: p.name.length > 16 ? p.name.slice(0, 16) + '…' : p.name,
		earnings: Number(p.totalEarnings),
		hourlyRate: Number(p.hourlyRate)
	}))

	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-lg'>Заработок по проектам</CardTitle>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width='100%' height={250}>
					<BarChart
						data={chartData}
						layout='vertical'
						margin={{ top: 0, right: 20, bottom: 0, left: 0 }}
					>
						<CartesianGrid
							strokeDasharray='3 3'
							horizontal={false}
							className='stroke-muted'
						/>
						<XAxis
							type='number'
							tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
							className='text-muted-foreground'
							fontSize={12}
							tickLine={false}
							axisLine={false}
						/>
						<YAxis
							type='category'
							dataKey='name'
							width={100}
							className='text-muted-foreground'
							fontSize={12}
							tickLine={false}
							axisLine={false}
						/>
						<Tooltip
							formatter={(value) => [formatCurrency(Number(value)), 'Заработок']}
							contentStyle={{
								backgroundColor: 'hsl(var(--card))',
								border: '1px solid hsl(var(--border))',
								borderRadius: '8px',
								fontSize: '13px'
							}}
							labelStyle={{ color: 'hsl(var(--foreground))' }}
							itemStyle={{ color: 'hsl(var(--foreground))' }}
						/>
						<Bar dataKey='earnings' radius={[0, 6, 6, 0]} barSize={28}>
							{chartData.map((_, index) => (
								<Cell
									key={`cell-${index}`}
									fill={CHART_COLORS[index % CHART_COLORS.length]}
								/>
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	)
}
