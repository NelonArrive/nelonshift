'use client'

import { use } from 'react'

import { AuthGuard } from '@/features/auth/ui/AuthGuard'
import { ProjectDetail } from '@/entities/project/ui'

export default function ProjectPage({
	params
}: {
	params: Promise<{ id: number }>
}) {
	const { id } = use(params)

	return (
		<AuthGuard>
			<div className='mt-8 w-4xl'>
				<ProjectDetail projectId={id} />
			</div>
		</AuthGuard>
	)
}
