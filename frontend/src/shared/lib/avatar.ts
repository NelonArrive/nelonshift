const AVATAR_COLORS = [
	'#FF6B6B',
	'#4ECDC4',
	'#45B7D1',
	'#96CEB4',
	'#FFEAA7',
	'#DDA0DD',
	'#98D8C8',
	'#F7DC6F',
	'#BB8FCE',
	'#85C1E9',
	'#F1948A',
	'#82E0AA',
	'#F8C471',
	'#AED6F1',
	'#D7BDE2',
	'#A3E4D7',
	'#FAD7A0',
	'#A9CCE3',
	'#D5DBDB',
	'#EDBB99',
	'#E8DAEF',
	'#D4EFDF',
	'#FCF3CF',
	'#D6EAF8',
	'#FADBD8',
	'#D5F5E3',
	'#FEF9E7',
	'#EBF5FB',
	'#FDEDEC',
	'#EAFAF1',
	'#FDF2E9',
	'#F4ECF7',
	'#EBF5FB',
	'#E8F8F5',
	'#FEF5E7',
	'#F0F3F4',
	'#F2F4F4'
]

function hashString(str: string): number {
	let hash = 0
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash)
		hash = hash & hash
	}
	return Math.abs(hash)
}

export function getAvatarColor(name: string): string {
	const index = hashString(name) % AVATAR_COLORS.length
	return AVATAR_COLORS[index]
}

export function getInitials(name: string): string {
	const words = name.trim().split(/\s+/)
	if (words.length >= 2) {
		return (words[0][0] + words[1][0]).toUpperCase()
	}
	return name.slice(0, 2).toUpperCase()
}

export function getContrastColor(bgColor: string): string {
	const hex = bgColor.replace('#', '')
	const r = parseInt(hex.substring(0, 2), 16)
	const g = parseInt(hex.substring(2, 4), 16)
	const b = parseInt(hex.substring(4, 6), 16)
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
	return luminance > 0.5 ? '#000000' : '#FFFFFF'
}
