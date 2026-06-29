export type TypeTopProject = {
	id: number
	name: string
	totalEarnings: number
	shiftCount: number
	hourlyRate: number
}

export type TypeDashboardStats = {
	totalActiveProjects: number
	totalCompletedProjects: number
	totalShifts: number
	totalHours: number
	totalEarnings: number
	currentMonthEarnings: number
	currentMonthShifts: number
	currentMonthHours: number
	topProjects: TypeTopProject[]
}
