import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import calendarPlugin from 'dayjs/plugin/calendar'
import weekday from 'dayjs/plugin/weekday'
import 'dayjs/locale/es'
import 'dayjs/locale/en-gb'

export function dayjsConfig() {
	dayjs.extend(localizedFormat)
	dayjs.extend(calendarPlugin)
	dayjs.extend(weekday)
	dayjs.locale('en-gb')
}
