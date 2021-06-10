import { Asserts, date, object, string } from 'yup'

export const schedulename = string()
export const scheduleDescription = string().max(255)
export const scheduleStart = date()
export const scheduleEnd = date()

export const YupScheduleObject = object({
	name: string(),
	description: string(),
	start: date(),
	end: date()
})

export interface YupScheduleData extends Asserts<typeof YupScheduleObject> {}