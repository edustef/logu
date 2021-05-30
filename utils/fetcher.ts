import axios from 'axios'
import { errorMonitor } from 'node:events'
import { HttpError } from './HttpError'

const fetcher = async (url) => {
	try {
		const { data } = await axios(url)
		if (data.error) {
			console.log(data)
		}
		return data
	} catch (err) {
		if (axios.isAxiosError(err)) {
			const error = new Error(err.response.data.errorMessage)
			error.stack = err.response.status.toString()
			error.name = err.response.statusText
			throw error
		}
	}
}

export default fetcher
