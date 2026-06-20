'use client'

import debounce from 'lodash.debounce'
import { Search, X } from 'lucide-react'
import { useEffect, useRef } from 'react'

import { Button, Input } from '@/shared/components/ui'
import { cn } from '@/shared/lib'

import { useProjectsStore } from '../store'

export function ProjectSearch() {
	const { searchQuery, isSearchExpanded, setSearchQuery, setIsSearchExpanded } =
		useProjectsStore()

	const searchInputRef = useRef<HTMLInputElement>(null)

	const debouncedSetSearchQuery = useRef(
		debounce((value: string) => {
			setSearchQuery(value.trim())
		}, 400)
	).current

	useEffect(() => {
		return () => debouncedSetSearchQuery.cancel()
	}, [debouncedSetSearchQuery])

	const handleSearchToggle = () => {
		if (isSearchExpanded) {
			setSearchQuery('')
			setIsSearchExpanded(false)
		} else {
			setIsSearchExpanded(true)
			setTimeout(() => searchInputRef.current?.focus(), 300)
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setSearchQuery(value)
		debouncedSetSearchQuery(value)
	}

	const handleBlur = () => {
		setTimeout(() => {
			if (
				document.activeElement !== searchInputRef.current &&
				!document.activeElement?.closest('.search-container')
			) {
				setIsSearchExpanded(false)
			}
		}, 150)
	}

	return (
		<div className='flex items-center gap-2'>
			<div
				className={cn(
					'search-container relative flex items-center transition-all duration-300 ease-in-out',
					isSearchExpanded ? 'w-64' : 'w-10'
				)}
			>
				<Button
					variant='outline'
					size='sm'
					onClick={handleSearchToggle}
					className={cn(
						'absolute left-0 z-10 transition-all duration-300',
						isSearchExpanded
							? 'border-0 bg-transparent hover:bg-transparent'
							: 'hover:bg-muted'
					)}
				>
					<Search className='h-4 w-4' />
				</Button>

				<form onSubmit={e => e.preventDefault()} className='w-full'>
					<Input
						ref={searchInputRef}
						value={searchQuery}
						onChange={handleChange}
						onBlur={handleBlur}
						placeholder='Поиск проектов...'
						className={cn(
							'pr-10 pl-10 transition-all duration-300 ease-in-out',
							isSearchExpanded
								? 'scale-100 opacity-100'
								: 'pointer-events-none scale-95 opacity-0'
						)}
					/>
				</form>

				{isSearchExpanded && searchQuery && (
					<Button
						variant='ghost'
						size='sm'
						onClick={() => setSearchQuery('')}
						className='hover:bg-muted absolute right-2 z-10 h-6 w-6 rounded-full p-0'
					>
						<X className='h-3 w-3' />
					</Button>
				)}
			</div>
		</div>
	)
}
