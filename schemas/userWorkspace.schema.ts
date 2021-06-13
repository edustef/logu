import { UserWorkspace as PrismaUserWorkspace, Workspace as PrismaWorkspace, User as PrismaUser } from '.prisma/client'
import { Asserts, boolean, object, string } from 'yup'
import { onlyWords } from '../constants/regex'
import { workspaceName } from './workspace.schema'

export const userName = string().matches(onlyWords).min(3).max(30).required()
export const userImage = string().url().notRequired()
export const userEmail = string().email()
export const userIsAdmin = boolean()

export const YupUserWorkspaceObject = object({
	name: userName,
	image: userImage,
	workspaceName: workspaceName,
	isAdmin: userIsAdmin
})

export interface YupUserWorkspaceData extends Asserts<typeof YupUserWorkspaceObject> {}

export type UserWorkspace = PrismaUserWorkspace & { workspace: PrismaWorkspace, user: PrismaUser }

export type WorkspaceWithUsers = PrismaWorkspace & { users: (PrismaUserWorkspace & { user: PrismaUser })[] }

export type UserWithWorkspaces = PrismaUser & {workspaces: (PrismaUserWorkspace & { workspace: PrismaWorkspace})[]}