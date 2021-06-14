import { Popover } from '@headlessui/react'
import { BellIcon } from '@heroicons/react/outline'
import { Notification } from '@prisma/client'
import React from 'react'
import Button from '../../Atoms/Button'
import Invitation from './NotificationTypes'
import Skeleton from 'react-loading-skeleton'
import axios from 'axios'
import { UseQueryResult } from 'react-query'
import useTranslation from 'next-translate/useTranslation'

interface Props {
	className?: string
	notifications: UseQueryResult<Notification[], unknown>
}

const Notifications: React.FC<Props> = ({ className, notifications }) => {
	const { t } = useTranslation()

	const handleClearAll = async () => {
		try {
			const axiosPromises = notifications.data.map((notification) => {
				return axios.delete(`/api/notifications/${notification.id}`)
			})

			const response = await axios.all(axiosPromises)
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<Popover className='relative'>
			<Popover.Button>
				{notifications.isSuccess && notifications.data.length !== 0 && (
					<div className='absolute top-0 right-0 w-3 h-3 rounded-full bg-green-500'></div>
				)}
				<BellIcon className='w-8 h-8' />
			</Popover.Button>

			<Popover.Panel className='absolute w-72 overflow-y-auto max-h-96 bg-gray-dark border border-gray-darkless rounded p-2 max-w-sm transform -translate-x--full right-0 z-10'>
				<div className='relative'>
					<div className='divide-y divide-gray-darkless'>
						{notifications.isLoading && <Skeleton count={4} height={50} />}
						{notifications.isSuccess && notifications.data.length < 1 && (
							<div className='italic text-gray-400'>{t('dashboard:emptyNotifications')}</div>
						)}
						{notifications.isSuccess &&
							notifications.data.map((notification) => {
								switch (notification.type) {
									case 'INVITATION':
										return <Invitation notification={notification} key={notification.id} />
								}
							})}
					</div>
					<div className='sticky right-0 bottom-0 flex justify-end mt-2'>
						<Button onClick={handleClearAll} className='text-sm bg-gray-darkless bg-opacity-50'>
							Clear all
						</Button>
					</div>
				</div>
			</Popover.Panel>
		</Popover>
	)
}

export default Notifications
