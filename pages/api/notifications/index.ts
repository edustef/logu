import { NotificationType } from '.prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import StatusCode from 'status-code-enum'
import prisma from '../../../utils/prisma'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const session = await getSession({ req })

	if (!session) {
		res.status(StatusCode.ClientErrorUnauthorized).end()
	}

	let result
	switch (req.method.toUpperCase()) {
		case 'GET':
			result = await getNotifications(req.body.userId)
			res.json(result)
			break
		case 'POST':
			result = await createNotification(req.body.email, req.body.type, req.body.resourceId)
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

export const createNotification = async (email: string, type: string, resourceId: string) => {
	const enumType: NotificationType = NotificationType[type]
	return await prisma.notification.create({
		data: {
			type: enumType,
			resourceId,
			user: {
				connect: {
					email
				}
			}
		}
	})
}
