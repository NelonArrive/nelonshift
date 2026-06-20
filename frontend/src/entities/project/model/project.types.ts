export type TypeProjectItem = {
	id: number
	name: string
	status: TypeStatusFilter
	startDate: string | null
	endDate: string | null
	totalPay: number
	shiftCount: number
	createdAt: string
	updatedAt: string
}

export type TypeSortBy = 'date' | 'name' | 'status' | 'totalPay'
export type TypeSortOrder = 'asc' | 'desc'
export type TypeViewMode = 'list' | 'grid'
export type TypeStatusFilter = 'ALL' | 'PLANNED' | 'ACTIVE' | 'COMPLETED'

export type TypePageResponse<T> = {
	content: T[]
	page: number
	size: number
	totalElements: number
	totalPages: number
	first: boolean
	last: boolean
}
