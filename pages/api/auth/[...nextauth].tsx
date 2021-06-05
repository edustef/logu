import { NextApiHandler } from 'next'
import NextAuth, { NextAuthOptions } from 'next-auth'
import Providers from 'next-auth/providers'
import Adapters from 'next-auth/adapters'
import prisma from '../../../utils/prisma'
import getAvatarName from '../../../utils/getAvatarName'
import { User } from '.prisma/client'

const options: NextAuthOptions = {
	providers: [
		Providers.Google({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET
		}),
		Providers.Email({
			server: {
				host: process.env.SMTP_HOST,
				port: Number(process.env.SMTP_PORT),
				auth: {
					user: process.env.SMTP_USER,
					pass: process.env.SMTP_PASSWORD
				}
			},
			from: process.env.SMTP_FROM
		})
	],
	adapter: Adapters.Prisma.Adapter({ prisma }),
	secret: process.env.SECRET,
	pages: {
		signIn: '/auth/signin',
		error: '/auth/error', // Error code passed in query string as ?error=
		verifyRequest: '/auth/verify-request', // (used for check email message)
		newUser: null // If set, new users will be directed here on first sign in
	},
	callbacks: {
		async session(session, user) {

			session.userDetails = user as User

			if (!session.userDetails.image) {
				session.userDetails.image = getAvatarName(session.userDetails.name)
			}

			return session
		}
	}
}

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options)
export default authHandler
