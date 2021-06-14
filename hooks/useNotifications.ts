import { useContext } from 'react'
import { NotificationsContext } from '../context/notificationsProvider'

export const useNotifications = () => {
	return useContext(NotificationsContext)
}
