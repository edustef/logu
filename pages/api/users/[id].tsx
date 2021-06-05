import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../utils/prisma'
import { getSession } from 'next-auth/client'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const { teamName } = req.body

	const session = await getSession({ req })
	const result = await prisma.team.create({
		data: {
			name: teamName,
			users: {
				connect: { email: session.user.email },
			},
		},
	})
	res.json(result)
}

export const updateUser = async ({ id, email }: { id: string; email: string }) => {
	return await prisma.user.update({
		where: {
			email: email,
		},
		data: {
			teams: {
				update: {
					where: {},
					data: {},
				},
			},
		},
	})
}
