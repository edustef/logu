import { useQuery } from 'react-query'
import axios from 'axios'
import { Schedule } from '.prisma/client'
import { ScheduleParams } from '../schemas/schedule.schema'

export default function useSchedules(props: ScheduleParams = {}) {
	return useQuery(['workspaces', props], async () => {
		const { data } = await axios.get<Schedule[]>('/api/schedules', {
			params: props
		})

		return data
	})
}
