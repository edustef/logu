import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { getSession } from 'next-auth/client'
import StatusCode from 'status-code-enum'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const session = await getSession({ req })
	let result: any

	switch (req.method.toUpperCase()) {
		case 'GET':
			result = getUsers({ email: session.user.email })
			break
		default:
			res.statusCode = StatusCode.ClientErrorMethodNotAllowed
			res.statusMessage = 'Method not allowed'
			break
	}

	res.json(result)
}

export const getUsers = async ({ email }: { email: string }) => {
	return await prisma.user.findUnique({
		where: {
			email: email,
		},
	})
}
