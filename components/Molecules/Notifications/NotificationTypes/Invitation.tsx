import { MailOpenIcon } from '@heroicons/react/solid'
import { User, Workspace } from '@prisma/client'
import axios from 'axios'
import { useSession } from 'next-auth/client'
import React, { useEffect } from 'react'
import { useQuery } from 'react-query'
import { WorkspaceWithUsers } from '../../../../schemas/userWorkspace.schema'
import Button from '../../../Atoms/Button'

interface Props {
	className?: string
	resourceId: string
}

const Invitation: React.FC<Props> = ({ className, resourceId }) => {
	const session = useSession()[0]
	const workspace = useQuery(['workspace', resourceId], async () => {
		const { data } = await axios.get<WorkspaceWithUsers>(`/api/workspaces/${resourceId}`)
		return data
	})

	return (
		<div className='py-2 px-1'>
			{workspace.isSuccess && (
				<>
					<MailOpenIcon className='w-6 h-6 mr-2' />
					<div>
						You've been invited by {workspace.data.users.find((user) => user.isAdmin).user.name} to join{' '}
						<span className='font-semibold'>{workspace.data.name}</span>
					</div>
					<div className='space-x-4 mt-2'>
						<Button className='bg-green-600'>Accept</Button>
						<Button className='bg-red-500'>Reject</Button>
					</div>
				</>
			)}
		</div>
	)
}

export default Invitation
