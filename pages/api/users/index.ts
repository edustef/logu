import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../utils/prisma'
import { getSession } from 'next-auth/client'
import StatusCode from 'status-code-enum'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const session = await getSession({ req })

	switch (req.method.toUpperCase()) {
		case 'GET':
			const result = await getUsers({ email: session.user.email })
			res.json(result)
			break
	}

	res.status(StatusCode.ClientErrorMethodNotAllowed).end()
}

export const getUsers = async ({ email }: { email: string }) => {
	return await prisma.user.findUnique({
		where: {
			email: email
		}
	})
}
