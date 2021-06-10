import type { NextApiResponse } from 'next'
import prisma from '../../../utils/prisma'
import nc from 'next-connect'
import auth, { NextApiRequestWithUser } from '../../../middlewares/auth'
import { Workspace } from '.prisma/client'
import { YupWorkspaceData, YupWorkspaceObject } from '../../../schemas/workspace.schema'
import StatusCode from 'status-code-enum'
import { getSession } from 'next-auth/client'

export default async function handle(req: NextApiRequestWithUser, res: NextApiResponse) {
	const session = await getSession({ req })
	const { skip, take, filter } = req.query
	// console.log(take, filter)

	switch (req.method) {
		case 'GET':
			const result = await getWorkspaces(session.userDetails.id)
			res.json(result)
			break
		case 'POST':
			console.log(req.body)

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

export const getWorkspaces = async (id: string) => {
	const data = await prisma.user.findUnique({
		where: {
			id
		},
		select: {
			workspaces: {
				take: 3,
				orderBy: [
					{
						createdAt: 'desc'
					}
				],
				include: { workspace: true }
			}
		}
	})

	return data.workspaces.map(({ workspace }: { workspace: Workspace }) => workspace)
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
