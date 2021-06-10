import { UserWorkspace } from '.prisma/client'
import { Asserts, boolean, object, string } from 'yup'
import { onlyWords } from '../constants/regex'
import { workspaceName } from './workspace.schema'

export const userName = string().matches(onlyWords).min(3).max(30).required()
export const userImage = string().url().notRequired()
export const userEmail = string().email()
export const userIsAdmin = boolean()

export const UserWorkspaceObject = object({
	name: userName,
	image: userImage,
	workspaceName: workspaceName,
	isAdmin: userIsAdmin
})

export interface UserWorkspaceData extends Asserts<typeof UserWorkspaceObject> {}
