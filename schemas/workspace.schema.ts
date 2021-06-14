import { CommonParams } from './commonParams'
import { Asserts, boolean, object, string } from 'yup'
import { startsWithNumber } from '../constants/regex'

export const workspaceName = string().matches(startsWithNumber).min(3).max(30).required()
export const workspaceDescription = string().max(255).notRequired()
export const workspaceIsIndividual = boolean().notRequired()

export const YupWorkspaceObject = object({
	name: workspaceName,
	description: workspaceDescription,
	isIndividual: workspaceIsIndividual
})

export interface YupWorkspaceData extends Asserts<typeof YupWorkspaceObject> {}

export interface WorkspaceParams extends CommonParams {
	name?: string
	isAdmin?: string
}