import dayjs, { Dayjs } from 'dayjs'
import { FULL_WEEK, TypeOfWeek, WORK_WEEK } from './typeOfWeek'

export const getWeekDays = (typeOfWeek: TypeOfWeek = WORK_WEEK) => {
	return Array(typeOfWeek)
		.fill('')
		.map((val, i) => {
			return dayjs().weekday(i).format('ddd').toUpperCase()
		})
}

export const getDays = (date: Dayjs, typeOfWeek: TypeOfWeek = WORK_WEEK) => {
	const firstWeekdayOfMonth = date.date(1).startOf('week')
	const days: Dayjs[] = []

	let currentDate = firstWeekdayOfMonth
	for (let week = 0; week < 5; week++) {
		for (let day = 0; day < typeOfWeek; day++) {
			days.push(currentDate.weekday(day))
		}
		currentDate = currentDate.add(FULL_WEEK, 'day')
	}

	return days
}

export const getMonths = (date: Dayjs) => {
	const months: Dayjs[] = []

	for (let month = 0; month < 12; month++) {
		months.push(date.set('month', month))
	}

	return months
}

export const getYears = (date: Dayjs, range = 8) => {
	const years: Dayjs[] = []

	const middle = Math.ceil(range)
	for (let index = 1; index <= range; index++) {
		if (index < middle) {
			years.push(date.subtract(middle - index, 'year'))
		} else if (index > middle) {
			years.push(date.add(index - middle, 'year'))
		} else {
			years.push(date)
		}
	}

	return years
}
