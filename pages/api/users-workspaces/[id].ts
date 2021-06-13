import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import StatusCode from 'status-code-enum'
import { YupUserWorkspaceData } from '../../../schemas/userWorkspace.schema'
import prisma from '../../../utils/prisma'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const session = await getSession({ req })

	if (!session) {
		res.status(StatusCode.ClientErrorForbidden).end()
	}

	switch (req.method.toUpperCase()) {
		case 'GET':
			const { id } = req.query
			if (typeof id === 'string') {
				const workspace = await getWorkspace(id)

				if (!workspace) {
					res.status(StatusCode.ClientErrorNotFound).end()
				}
				if (workspace.users.find(({ user }) => user.id === session.userDetails.id)) {
					res.status(StatusCode.ClientErrorForbidden).end()
				}

				res.json(workspace)
			}
			break
		case 'PUT':
			break
		default:
			res.status(StatusCode.ClientErrorMethodNotAllowed).end()
			break
	}
}

export const getWorkspace = async (workspaceId: string) => {
	const workspace = await prisma.workspace.findUnique({
		where: {
			id: workspaceId
		},
		include: {
			users: {
				include: { user: true }
			}
		}
	})

	return workspace
}

export const updateWorkspace = async (userId: string, workspaceId: string, data: YupUserWorkspaceData) => {
	return await prisma.userWorkspace.update({
		where: {
			userId_workspaceId: { userId, workspaceId }
		},
		data: {
			workspace: {}
		}
	})
}