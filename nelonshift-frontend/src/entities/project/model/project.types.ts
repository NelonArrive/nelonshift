export type TypeProjectItem = {
	id: number
	name: string
	status: TypeStatusFilter
	dateRange: {
		from: Date | string
		to: Date | string
	}
	created_at: Date | string
	updated_at: Date | string
}

export type TypeSortBy = 'date' | 'name' | 'status' | 'totalPay'
export type TypeSortOrder = 'asc' | 'desc'
export type TypeViewMode = 'list' | 'grid'
export type TypeStatusFilter = 'ALL' | 'PLANNED' | 'ACTIVE' | 'COMPLETED'
