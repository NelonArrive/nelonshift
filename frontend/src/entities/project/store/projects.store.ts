import { create } from 'zustand'

import {
	TypeSortBy,
	TypeSortOrder,
	TypeStatusFilter,
	TypeViewMode
} from '../model'

interface IProjectsState {
	sortBy: TypeSortBy
	sortOrder: TypeSortOrder
	viewMode: TypeViewMode
	statusFilter: TypeStatusFilter
	searchQuery: string
	isSearchExpanded: boolean
	page: number
	limit: number

	setPage: (page: number) => void
	setLimit: (limit: number) => void
	setSortBy: (sortBy: TypeSortBy) => void
	setSortOrder: (order: TypeSortOrder) => void
	toggleSortOrder: () => void
	setViewMode: (view: TypeViewMode) => void
	setStatusFilter: (filter: TypeStatusFilter) => void
	setSearchQuery: (query: string) => void
	setIsSearchExpanded: (expanded: boolean) => void
}

const initialState = {
	sortBy: 'status' as TypeSortBy,
	sortOrder: 'asc' as TypeSortOrder,
	viewMode: 'list' as TypeViewMode,
	statusFilter: 'ALL' as TypeStatusFilter,
	searchQuery: '',
	isSearchExpanded: false,
	page: 1,
	limit: 8
}

export const useProjectsStore = create<IProjectsState>()(set => ({
	...initialState,
	setSortBy: sortBy => set({ sortBy }),
	setSortOrder: order => set({ sortOrder: order }),
	toggleSortOrder: () =>
		set(state => ({
			sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc'
		})),
	setViewMode: view => set({ viewMode: view }),
	setStatusFilter: filter => set({ statusFilter: filter }),
	setSearchQuery: query => set({ searchQuery: query }),
	setIsSearchExpanded: expanded => set({ isSearchExpanded: expanded }),
	setPage: page => set({ page }),
	setLimit: limit => set({ limit, page: 1 })
}))
