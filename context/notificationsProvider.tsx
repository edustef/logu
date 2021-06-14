import { Notification } from '@prisma/client'
import axios from 'axios'
import { useSession } from 'next-auth/client'
import React from 'react'
import { useQuery, UseQueryResult } from 'react-query'

interface Props {
	children: React.ReactNode
}

export const NotificationsContext = React.createContext<UseQueryResult<Notification[], unknown>>(undefined)

const NotificationsProvider: React.FC<Props> = ({ children }) => {
	const session = useSession()[0]
	const notifications = useQuery(
		['notifications', session?.userDetails?.id],
		async () => {
			const { data } = await axios.get<Notification[]>(`/api/notifications?userId=${session?.userDetails?.id}`)

			return data
		},
		{ enabled: !!session?.userDetails?.id }
	)

	return <NotificationsContext.Provider value={notifications}>{children}</NotificationsContext.Provider>
}

export default NotificationsProvider
