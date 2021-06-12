import { CommonParams } from './commonParams'
import { Asserts, object, string } from 'yup'
import { startsWithNumber } from '../constants/regex'

export const workspaceName = string().matches(startsWithNumber).min(3).max(30).required()
export const workspaceDescription = string().max(255).notRequired()

export const YupWorkspaceObject = object({
	name: workspaceName,
	description: workspaceDescription
})

export interface YupWorkspaceData extends Asserts<typeof YupWorkspaceObject> {}

export interface WorkspaceParams extends CommonParams {
	name?: string
}
