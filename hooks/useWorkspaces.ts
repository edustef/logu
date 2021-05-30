import { useQuery } from 'react-query'
import axios from 'axios'
import { Workspace } from '.prisma/client'

const getWorkspaces = async () => {
	const { data } = await axios.get<Workspace[]>('/api/workspaces')

	return data
}

export default function useWorkspaces() {
	return useQuery('workspaces', getWorkspaces)
}
