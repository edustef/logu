import { NextApiRequest, NextApiResponse } from 'next'
import { User } from 'next-auth'
import { getSession } from 'next-auth/client'
import StatusCode from 'status-code-enum'

export interface NextApiRequestWithUser extends NextApiRequest {
	user: User
}

export default async (req: NextApiRequestWithUser, res: NextApiResponse, next) => {
	const session = await getSession({ req })

	if (!session) {
		res.status(StatusCode.ClientErrorForbidden).json({ error: "Authorization failed. Make sure you're logged in" })
	}

	req.user = session.user

	next()
}
