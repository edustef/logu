import React, { useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'
import useTranslation from 'next-translate/useTranslation'
import clsx from 'clsx'
import Button from '../../Atoms/Button'
import Toggle from '../../Atoms/Toggle'
import Link from '../../Atoms/Link'
import DatePicker from './DatePicker'
import { FULL_WEEK, WORK_WEEK } from './_utils/typeOfWeek'
import { getDays, getWeekDays } from './_utils/getDates'
import { useQuery } from 'react-query'
import axios from 'axios'
import { Schedule } from '@prisma/client'
import { useSession } from 'next-auth/client'

interface Props {
	className?: string
	workspaceId: string
}

const Calendar: React.FC<Props> = ({ workspaceId, className }) => {
	const { t } = useTranslation()
	const session = useSession()[0]
	const [isFullWeek, setIsFullWeek] = useState(false)
	const [currentDate, setCurrentDate] = useState(dayjs())
	const [daysView, setDaysView] = useState<string[]>(getWeekDays())
	const [daysPerWeek, setDaysPerWeek] = useState<Dayjs[]>(getDays(dayjs()))
	const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

	const schedules = useQuery(
		['schedules', workspaceId, session?.userDetails?.id],
		async () => {
			const { data } = await axios.get<Schedule[]>(
				`/api/schedules?userId=${session.userDetails.id}&workspaceId=${workspaceId}`
			)
			return data.map((schedule) => ({
				...schedule,
				start: dayjs(schedule.start),
				end: dayjs(schedule.end)
			}))
		},
		{
			enabled: !!session?.userDetails?.id
		}
	)

	useEffect(() => {
		setDaysView(getWeekDays(isFullWeek ? FULL_WEEK : WORK_WEEK))
		setDaysPerWeek(getDays(currentDate, isFullWeek ? FULL_WEEK : WORK_WEEK))
	}, [isFullWeek, currentDate])

	// console.log(dayjs().localeData().longDateFormat('L'))

	const handleNavigation = (action: 'today' | 'next' | 'previous') => {
		switch (action) {
			case 'today':
				setCurrentDate(dayjs())
				break
			case 'next':
				setCurrentDate((date) => date.add(1, 'month'))
				break
			case 'previous':
				setCurrentDate((date) => date.subtract(1, 'month'))
				break
		}
	}

	const handleDateChange = (date: Dayjs) => {
		setCurrentDate(date)
		setIsDatePickerOpen(false)
	}

	const shouldShowDate = (day: Dayjs, start: Dayjs, end: Dayjs) => {
		if (day.isSame(start, 'day') || day.isSame(end, 'day')) {
			return true
		}

		if (start.isAfter(day, 'day') && end.isBefore(day, 'day')) {
			return true
		}

		return false
	}

	return (
		<div className={clsx(className, 'w-full h-full flex flex-col')}>
			<div className='flex justify-between items-center'>
				<div className='flex justify-between items-center'>
					<Button onClick={() => handleNavigation('previous')} className='bg-green-600 px-1'>
						<ChevronLeftIcon className='w-6 h-6' />
					</Button>
					<Button className='border border-gray-darkless mx-2' onClick={() => setIsDatePickerOpen(true)}>
						<span className='font-semibold'>{currentDate.format('MMMM YYYY')}</span>
					</Button>
					<Button onClick={() => handleNavigation('next')} className='bg-green-600 px-1'>
						<ChevronRightIcon className='w-6 h-6' />
					</Button>
				</div>
				<div className='flex items-center'>
					<span className='mr-2 text-sm'>{t('calendar:toggleFullWeek')}</span>
					<Toggle checked={isFullWeek} onChange={setIsFullWeek} />
				</div>
			</div>
			<div className='flex justify-between mt-4'>
				<Link
					asBtn
					href={`/organize/${workspaceId}/create?date=${dayjs().format('YYYY-MM-DD')}`}
					className='bg-gray-darkless'
				>
					{t('organize:addSchedule')}
				</Link>
			</div>
			<div className={clsx('mt-4 grid auto-cols-max', isFullWeek ? 'grid-cols-7' : 'grid-cols-5')}>
				{daysView.map((day) => (
					<div className='text-center flex-grow border border-gray-dark' key={day}>
						{day}
					</div>
				))}
			</div>
			<div className={clsx('mt-4 flex-grow grid auto-cols-max', isFullWeek ? 'grid-cols-7' : 'grid-cols-5')}>
				{daysPerWeek.map((day, index) => (
					<Link
						href={`/organize/${workspaceId}/${day.format('YYYY-MM-DD')}`}
						className={clsx(
							'border border-gray-dark text-center p-1 flex-col',
							day.month() !== currentDate.month() && 'text-gray-600'
						)}
						key={index}
					>
						<div className={clsx(day.isSame(dayjs(), 'day') && 'bg-green-600', 'mx-auto w-8 h-8 p-1 rounded-full')}>
							{day.format('D')}
						</div>
						<div className='flex mt-2 items-center justify-center'>
							{schedules.isSuccess &&
								schedules.data.map((schedule) => {
									if (shouldShowDate(day, schedule.start, schedule.end)) {
										return <div key={schedule.id} className='mx-[2px] w-1 h-1 rounded-full bg-green-600'></div>
									}
								})}
						</div>
					</Link>
				))}
			</div>
			<DatePicker
				disableMonthView
				show={isDatePickerOpen}
				onClose={setIsDatePickerOpen}
				defaultDate={currentDate}
				onChange={handleDateChange}
			/>
		</div>
	)
}

export default Calendar
