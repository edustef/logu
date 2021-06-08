import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import calendarPlugin from 'dayjs/plugin/calendar'

export function dayjsConfig() {
	dayjs.extend(localizedFormat)
	dayjs.extend(calendarPlugin)
}
