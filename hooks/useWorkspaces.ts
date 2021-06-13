import { useQuery } from 'react-query'
import axios from 'axios'
import { Workspace } from '.prisma/client'
import { WorkspaceWithUsers } from '../schemas/userWorkspace.schema'
import { WorkspaceParams } from '../schemas/workspace.schema'

export default function useWorkspaces(props: WorkspaceParams = {}) {
	return useQuery(['workspaces', props], async () => {
		const { data } = await axios.get<WorkspaceWithUsers[]>('/api/workspaces', {
			params: props
		})

		return data
	})
}
