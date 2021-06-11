import { useQuery } from 'react-query'
import axios from 'axios'
import { Workspace } from '.prisma/client'
import { WorkspaceParams } from '../models/WorkspaceParams'

export default function useWorkspaces(props: WorkspaceParams = {}) {
	return useQuery(['workspaces', props], async () => {
		const { data } = await axios.get<Workspace[]>('/api/workspaces', {
			params: props
		})

		return data
	})
}
