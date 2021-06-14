import { NotificationType } from '.prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import StatusCode from 'status-code-enum'
import parseQueryOne from '../../../utils/parseQueryOne'
import prisma from '../../../utils/prisma'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const session = await getSession({ req })

	if (!session) {
		res.status(StatusCode.ClientErrorUnauthorized).end()
	}

	let result
	switch (req.method.toUpperCase()) {
		case 'GET':
			break
		case 'DELETE':
			result = await deleteNotification(parseQueryOne(req.query.id))
			res.status(StatusCode.SuccessCreated).json(result)
			break
	}

	res.status(StatusCode.ClientErrorMethodNotAllowed).end()
}

export const getNotifications = async (userId: string) => {
	return await prisma.notification.findMany({
		where: {
			user: {
				id: userId
			}
		}
	})
}

export const deleteNotification = async (id: string) => {
	return await prisma.notification.delete({
		where: { id }
	})
}
