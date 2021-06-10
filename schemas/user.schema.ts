import { Asserts, object, string } from 'yup'
import { onlyWords } from '../constants/regex'

export const userName = string().matches(onlyWords).min(3).max(30).required()
export const userImage = string().url().notRequired()
export const userEmail = string().email()

export const YupUserObject = object({
	name: userName,
	email: userEmail,
	image: userImage
})

export interface YupUserData extends Asserts<typeof YupUserObject> {}
