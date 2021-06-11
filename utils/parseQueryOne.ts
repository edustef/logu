export default function parseQueryOne(query?: string | string[]) {
	if (!query) {
		return undefined
	}

	if (typeof query === 'string') {
		return query
	} else {
		return query[0]
	}
}
