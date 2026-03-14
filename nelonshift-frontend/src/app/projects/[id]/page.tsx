'use client'

import { use } from 'react'

import { ProjectDetail } from '@/entities/project/ui'

export default function ProjectPage({
	params
}: {
	params: Promise<{ id: number }>
}) {
	const { id } = use(params)

	return (
		<div className='mt-8 w-4xl'>
			<ProjectDetail projectId={id} />
		</div>
	)
}
