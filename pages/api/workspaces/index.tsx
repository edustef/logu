import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import nc from 'next-connect'
import auth, { NextApiRequestWithUser } from '../../../middlewares/auth'
import { Workspace } from '.prisma/client'

export default nc()
	.use(auth)
	.get(async (req: NextApiRequestWithUser, res: NextApiResponse) => {
		const result = await getWorkspaces({ email: req.user.email })

		res.json(result)
	})
	.post(async (req: NextApiRequestWithUser, res: NextApiResponse) => {
		const result = await createWorkspace({ workspace: req.body.data.workspace, email: req.user.email })

		res.json(result)
	})

export const getWorkspaces = async ({ email }: { email: string }) => {
	const data = await prisma.user.findUnique({
		where: {
			email: email
		},
		select: {
			workspaces: { select: { workspace: true } }
		}
	})

	return data.workspaces.map(({ workspace }: { workspace: Workspace }) => workspace)
}

export const createWorkspace = async ({ workspace, email }: { workspace: string; email: string }) => {
	console.log(workspace)
	const data = await prisma.user.update({
		where: {
			email: email
		},
		data: {
			workspaces: {
				create: {
					workspace: { create: { name: workspace } },
					isAdmin: true
				}
			}
		}
	})
}
