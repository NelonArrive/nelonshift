'use client'

import { getAvatarColor, getContrastColor, getInitials } from '@/shared/lib/avatar'

interface AvatarProps {
	name: string
	size?: 'sm' | 'md' | 'lg' | 'xl'
	imageUrl?: string | null
	className?: string
}

const SIZE_MAP = {
	sm: 'h-8 w-8 text-xs',
	md: 'h-10 w-10 text-sm',
	lg: 'h-14 w-14 text-lg',
	xl: 'h-20 w-20 text-2xl'
}

export function Avatar({ name, size = 'md', imageUrl, className = '' }: AvatarProps) {
	const bgColor = getAvatarColor(name)
	const textColor = getContrastColor(bgColor)
	const initials = getInitials(name)

	return (
		<div
			className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold select-none ${SIZE_MAP[size]} ${className}`}
			style={{ backgroundColor: bgColor, color: textColor }}
		>
			{imageUrl ? (
				<img
					src={imageUrl}
					alt={name}
					className='h-full w-full object-cover'
				/>
			) : (
				<span>{initials}</span>
			)}
		</div>
	)
}
