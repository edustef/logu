export class HttpError extends Error {
	status: number
	constructor(message: string) {
		super(message)

		Object.setPrototypeOf(this, HttpError.prototype)
	}
}
