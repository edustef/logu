import { useQuery } from 'react-query'
import axios from 'axios'
import { Workspace } from '.prisma/client'

interface Props {
	skip?: number
	take?: number
	sort?: { dir: 'ASC' | 'DESC'; field: 'string' }
	filter?: {
		[key: string]: string | string[]
	}
}

export default function useWorkspaces({ skip = null, take = null, sort = null, filter = null }: Props = {}) {
	return useQuery('workspaces', async () => {
		const { data } = await axios.get<Workspace[]>('/api/workspaces/')

		return data
	})
}
