import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../utils/prisma'
import { getSession } from 'next-auth/client'
import StatusCode from 'status-code-enum'
import { YupUserData, YupUserObject } from '../../../schemas/user.schema'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const session = await getSession({ req })

	if (!session) {
		res.status(StatusCode.ClientErrorForbidden).end()
	}

	switch (req.method) {
		case 'GET':
			break
		case 'PUT':
			const data: YupUserData = req.body
			if (YupUserObject.isValid(data)) {
				const result = await updateUser(session.userDetails.id, data)

				res.status(StatusCode.SuccessOK).json({ data: result })
			}
			break
		case 'DELETE':
			let id: string
			if (typeof req.query.id === 'string') {
				id = req.query.id
			} else {
				id = req.query.id[0]
			}

			await deleteUser(id)
			res.status(StatusCode.SuccessNoContent).end()
			break
	}

	res.status(StatusCode.ClientErrorMethodNotAllowed).end()
}

export const getUser = async ({ id }) => {
	return await prisma.user.findUnique({
		where: {
			id
		}
	})
}

export const updateUser = async (id: string, data: YupUserData) => {
	return await prisma.user.update({
		where: {
			id
		},
		data: data
	})
}

export const deleteUser = async (id: string) => {
	const workspacesWhereUserIsAdmin = await prisma.workspace.findMany({
		where: {
			users: {
				some: {
					AND: [{ userId: id }, { isAdmin: true }]
				}
			}
		},
		select: { id: true }
	})
	console.log(workspacesWhereUserIsAdmin)

	const sessionDelete = prisma.session.deleteMany({
		where: {
			userId: id
		}
	})
	const accountDelete = prisma.account.deleteMany({
		where: {
			userId: id
		}
	})

	const userWorkspaceScheduleDelete = prisma.userWorkspaceSchedule.deleteMany({
		where: {
			userId: id
		}
	})

	const userWorkspaceDelete = prisma.userWorkspace.deleteMany({
		where: {
			AND: [{ userId: id }, { isAdmin: true }]
		}
	})

	const userDelete = prisma.user.delete({
		where: {
			id: id
		}
	})

	const deleteWorkspacesTransaction = workspacesWhereUserIsAdmin.map(({ id }) => {
		return prisma.workspace.delete({
			where: {
				id
			}
		})
	})

	return await prisma.$transaction([
		sessionDelete,
		accountDelete,
		userWorkspaceScheduleDelete,
		userWorkspaceDelete,
		...deleteWorkspacesTransaction,
		userDelete
	])
}
