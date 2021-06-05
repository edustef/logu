import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../utils/prisma'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	switch (req.method.toUpperCase()) {
		case 'GET':
			const { id } = req.query
			if (typeof id === 'string') {
				const workspace = getWorkspace(id)
				res.json(workspace)
			}
			break
		case 'POST':
			break
	}
}

export const getWorkspace = async (id: string) => {
	return await prisma.workspace.findUnique({
		where: {
			id: id
		}
	})
}

export const updateWorkspace = async ({ id, email }: { id: string; email: string }) => {
	return await prisma.user.update({
		where: {
			email: email
		},
		data: {
			workspaces: {
				update: {
					where: {},
					data: {}
				}
			}
		}
	})
}
