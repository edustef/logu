import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import StatusCode from 'status-code-enum'
import { YupWorkspaceData } from '../../../../schemas/workspace.schema'
import parseQueryOne from '../../../../utils/parseQueryOne'
import prisma from '../../../../utils/prisma'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const session = await getSession({ req })

	if (!session) {
		res.status(StatusCode.ClientErrorForbidden).end()
	}

	switch (req.method.toUpperCase()) {
		case 'POST':
			const workspaceId = parseQueryOne(req.query.id)
			const result = await acceptInvitation(workspaceId, req.body.userId)
			res.status(StatusCode.SuccessCreated).json(result)
			break
		default:
			res.status(StatusCode.ClientErrorMethodNotAllowed).end()
			break
	}
}

export const acceptInvitation = async (workspaceId: string, userId: string) => {
	console.log(workspaceId, userId)

	const workspace = await prisma.workspace.update({
		where: {
			id: workspaceId
		},
		data: {
			users: {
				create: {
					user: {
						connect: {
							id: userId
						}
					}
				}
			}
		}
	})

	return workspace
}
