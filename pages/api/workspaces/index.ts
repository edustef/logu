import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../utils/prisma'
import { YupWorkspaceData, YupWorkspaceObject } from '../../../schemas/workspace.schema'
import StatusCode from 'status-code-enum'
import { getSession } from 'next-auth/client'
import { WorkspaceParams } from '../../../models/WorkspaceParams'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const session = await getSession({ req })

	if (!session) {
		res.status(StatusCode.ClientErrorForbidden).end()
	}

	switch (req.method) {
		case 'GET':
			const result = await getWorkspaces(session.userDetails.id, req.query)
			res.json(result)
			break
		case 'POST':
			const isValid = await YupWorkspaceObject.isValid(req.body)
			if (isValid) {
				const result = await createWorkspace(session.userDetails.id, req.body)
				res.status(StatusCode.SuccessCreated).json(result)
			} else {
				res.status(StatusCode.ClientErrorBadRequest).end()
			}
			break
		default:
			break
	}

	res.status(StatusCode.ClientErrorMethodNotAllowed).end()
}

export const getWorkspaces = async (userId: string, params?: WorkspaceParams) => {
	const data = await prisma.workspace.findMany({
		where: {
			AND: {
				name: { contains: params?.name, mode: 'insensitive' },
				users: {
					some: {
						userId
					}
				}
			}
		},
		include: {
			users: { include: { user: true } }
		}
	})

	return data
}

export const createWorkspace = async (id: string, data: YupWorkspaceData) => {
	const res = await prisma.user.update({
		where: {
			id
		},
		data: {
			workspaces: {
				create: {
					workspace: { create: data },
					isAdmin: true
				}
			}
		},
		select: {
			workspaces: {
				include: {
					workspace: true
				},
				where: {
					workspace: {
						name: data.name
					}
				}
			}
		}
	})

	return res.workspaces[0]
}
