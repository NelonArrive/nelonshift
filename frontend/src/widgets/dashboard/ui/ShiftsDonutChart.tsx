'use client'

import { AlertTriangle } from 'lucide-react'
import {
	Cell,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip
} from 'recharts'
import type { PieLabelRenderProps } from 'recharts'

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

function renderCustomLabel(props: PieLabelRenderProps) {
	const cx = Number(props.cx ?? 0)
	const cy = Number(props.cy ?? 0)
	const midAngle = Number(props.midAngle ?? 0)
	const innerRadius = Number(props.innerRadius ?? 0)
	const outerRadius = Number(props.outerRadius ?? 0)
	const percent = Number(props.percent ?? 0)

	const RADIAN = Math.PI / 180
	const radius = innerRadius + (outerRadius - innerRadius) * 0.5
	const x = cx + radius * Math.cos(-midAngle * RADIAN)
	const y = cy + radius * Math.sin(-midAngle * RADIAN)

	if (percent < 0.05) return null

	return (
		<text
			x={x}
			y={y}
			fill='white'
			textAnchor='middle'
			dominantBaseline='central'
			fontSize={12}
			fontWeight={600}
		>
			{`${(percent * 100).toFixed(0)}%`}
		</text>
	)
}

export function ShiftsDonutChart() {
	const { data, isLoading, error } = useDashboardStats()

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<Skeleton className='h-6 w-1/2' />
				</CardHeader>
				<CardContent className='flex justify-center'>
					<Skeleton className='h-[250px] w-[250px] rounded-full' />
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
					<CardTitle className='text-lg'>Смены по проектам</CardTitle>
				</CardHeader>
				<CardContent>
					<p className='text-muted-foreground py-12 text-center text-sm'>
						Нет данных для отображения
					</p>
				</CardContent>
			</Card>
		)
	}

	const totalShifts = projects.reduce((sum, p) => sum + p.shiftCount, 0)
	const chartData = projects.map(p => ({
		name: p.name,
		value: p.shiftCount,
		percentage: totalShifts > 0 ? ((p.shiftCount / totalShifts) * 100).toFixed(0) : '0'
	}))

	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-lg'>Смены по проектам</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6'>
					<ResponsiveContainer width={180} height={180}>
						<PieChart>
							<Pie
								data={chartData}
								cx='50%'
								cy='50%'
								innerRadius={55}
								outerRadius={90}
								paddingAngle={3}
								dataKey='value'
								labelLine={false}
								label={renderCustomLabel}
							>
								{chartData.map((_, index) => (
									<Cell
										key={`cell-${index}`}
										fill={CHART_COLORS[index % CHART_COLORS.length]}
										stroke='hsl(var(--background))'
										strokeWidth={2}
									/>
								))}
							</Pie>
							<Tooltip
								formatter={(value, name) => [
									`${value} смен`,
									String(name)
								]}
								contentStyle={{
									backgroundColor: 'hsl(var(--card))',
									border: '1px solid hsl(var(--border))',
									borderRadius: '8px',
									fontSize: '13px'
								}}
								labelStyle={{ color: 'hsl(var(--foreground))' }}
								itemStyle={{ color: 'hsl(var(--foreground))' }}
							/>
						</PieChart>
					</ResponsiveContainer>

					<div className='flex-1 space-y-2'>
						{chartData.map((item, index) => (
							<div key={item.name} className='flex items-center gap-2'>
								<span
									className='h-3 w-3 shrink-0 rounded-full'
									style={{
										backgroundColor:
											CHART_COLORS[index % CHART_COLORS.length]
									}}
								/>
								<span className='text-muted-foreground truncate text-sm'>
									{item.name}
								</span>
								<span className='ml-auto text-sm font-medium'>
									{item.value}
								</span>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
