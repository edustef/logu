import axios from 'axios'

axios.interceptors.response.use(
	(response) => {
		return response
	},
	function (error) {
		return Promise.reject(error.response)
	}
)
