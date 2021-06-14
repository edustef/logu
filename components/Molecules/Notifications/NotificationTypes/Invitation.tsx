import { MailOpenIcon } from '@heroicons/react/solid'
import { Notification, User, Workspace } from '@prisma/client'
import axios from 'axios'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useQuery } from 'react-query'
import { WorkspaceWithUsers } from '../../../../schemas/userWorkspace.schema'
import Button from '../../../Atoms/Button'

interface Props {
	className?: string
	notification: Notification
}

const Invitation: React.FC<Props> = ({ className, notification }) => {
	const session = useSession()[0]
	const router = useRouter()
	const workspace = useQuery(['workspace', notification.resourceId], async () => {
		const { data } = await axios.get<WorkspaceWithUsers>(`/api/workspaces/${notification.resourceId}`)
		return data
	})

	const handleAccept = async () => {
		try {
			const res = await axios.post(`/api/workspaces/${workspace.data.id}/accept-invitation`, {
				userId: session.userDetails.id
			})

			await deleteNotification()
			router.push(`/workspaces/${workspace.data.id}`)
		} catch (err) {
			console.log(err)
		}
	}

	const handleReject = async () => {
		const res = await deleteNotification()
	}

	const deleteNotification = async () => {
		return await axios.delete(`/api/notifications/${notification.id}`)
	}

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
						<Button onClick={handleAccept} className='bg-green-600'>
							Accept
						</Button>
						<Button onClick={handleReject} className='bg-red-500'>
							Reject
						</Button>
					</div>
				</>
			)}
		</div>
	)
}

export default Invitation
