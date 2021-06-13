import { Popover } from '@headlessui/react'
import { BellIcon } from '@heroicons/react/outline'
import { Notification } from '@prisma/client'
import axios from 'axios'
import { useSession } from 'next-auth/client'
import React, { useEffect } from 'react'
import { useQuery } from 'react-query'
import Button from '../../Atoms/Button'
import Invitation from './NotificationTypes'

interface Props {
	className?: string
}

const Notifications: React.FC<Props> = ({ className }) => {
	const session = useSession()[0]
	const userId = session?.userDetails?.id

	const notifications = useQuery(
		['notifications', userId],
		async () => {
			const { data } = await axios.get<Notification[]>(`/api/notifications?userId=${session.userDetails.id}`)

			return data
		},
		{ enabled: !!userId }
	)

	useEffect(() => {
		console.log(notifications.data)
	}, [notifications])

	return (
		<Popover className='relative'>
			<Popover.Button>
				<div className='absolute top-0 right-0 w-3 h-3 rounded-full bg-green-500'></div>
				<BellIcon className='w-8 h-8' />
			</Popover.Button>

			<Popover.Panel className='absolute w-72 overflow-y-auto max-h-96 bg-gray-dark border border-gray-darkless rounded p-2 max-w-sm transform -translate-x--full right-0 z-10'>
				<div className='relative'>
					<div className='divide-y divide-gray-darkless'>
						{notifications.isSuccess &&
							notifications.data.map((notification) => {
								switch (notification.type) {
									case 'INVITATION':
										return <Invitation resourceId={notification.resourceId} key={notification.id} />
								}
							})}
					</div>
					<div className='sticky right-0 bottom-0 flex justify-end mt-2'>
						<Button className='text-sm bg-gray-darkless bg-opacity-50'>Clear all</Button>
					</div>
				</div>
			</Popover.Panel>
		</Popover>
	)
}

export default Notifications
