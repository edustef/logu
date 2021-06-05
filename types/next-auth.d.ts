import { User as PrismaUser } from '.prisma/client'
import NextAuth from 'next-auth'

declare module 'next-auth' {
	interface User extends PrismaUser {}

	interface DefaultSession {
		userDetails: PrismaUser
	}
}
