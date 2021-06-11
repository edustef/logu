import { useQuery } from 'react-query'
import axios from 'axios'
import { Workspace } from '.prisma/client'
interface Props {
	skip?: number
	take?: number
	sort?: { dir: 'ASC' | 'DESC'; field: 'string' }
	name?: string
}

export default function useWorkspaces(props: Props = {}) {
	return useQuery(['workspaces', props], async () => {
		const { data } = await axios.get<Workspace[]>('/api/workspaces', {
			params: props
		})

		return data
	})
}
