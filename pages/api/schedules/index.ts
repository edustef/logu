import { NotificationType } from '.prisma/client'
import { Schedule } from '@prisma/client'
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
			const workspaceId = parseQueryOne(req.query.workspaceId)
			const userId = parseQueryOne(req.query.userId)
			const date = parseQueryOne(req.query.date)
			console.log(workspaceId, userId, date)

			result = await getSchedules(workspaceId, userId, date)
			res.json(result)
			break
		case 'POST':
			result = await createSchedule(req.body)
			res.status(StatusCode.SuccessCreated).json(result)
			break
	}

	res.status(StatusCode.ClientErrorMethodNotAllowed).end()
}

export const getSchedules = async (workspaceId: string, userId: string, date: string) => {
	return await prisma.schedule.findMany({
		where: {
			AND: {
				userWorkspaceSchedules: {
					some: {
						userWorkspace: {
							workspaceId,
							userId
						}
					}
				},
				start: {
					gte: date ? new Date(date) : undefined
				},
				end: {
					lte: date ? new Date(date) : undefined
				}
			}
		}
	})
}

export const createSchedule = async ({
	start,
	end,
	userWorkspaceId,
	name,
	description = ''
}: {
	start: string
	end: string
	userWorkspaceId: string
	name: string
	description?: string
}) => {
	return await prisma.schedule.create({
		data: {
			name,
			description,
			start: new Date(start),
			end: new Date(end),
			userWorkspaceSchedules: {
				create: {
					userWorkspaceId: userWorkspaceId
				}
			}
		}
	})
}
