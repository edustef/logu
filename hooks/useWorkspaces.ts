import { useQuery } from 'react-query'
import axios from 'axios'
import { Workspace } from '.prisma/client'
import { WorkspaceParams } from '../models/WorkspaceParams'
import { WorkspaceWithUsers } from '../schemas/userWorkspace.schema'

export default function useWorkspaces(props: WorkspaceParams = {}) {
	return useQuery(['workspaces', props], async () => {
		const { data } = await axios.get<WorkspaceWithUsers[]>('/api/workspaces', {
			params: props
		})

		return data
	})
}
