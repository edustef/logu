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

interface Props {
	className?: string
	workspaceId: string
}

const Calendar: React.FC<Props> = ({ workspaceId, className }) => {
	const { t } = useTranslation()
	const [isFullWeek, setIsFullWeek] = useState(false)
	const [currentDate, setCurrentDate] = useState(dayjs())
	const [daysView, setDaysView] = useState<string[]>(getWeekDays())
	const [daysPerWeek, setDaysPerWeek] = useState<Dayjs[]>(getDays(dayjs()))
	const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

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

	return (
		<div className={clsx(className, 'w-full h-full flex flex-col')}>
			<div className='flex justify-between items-center'>
				<div className='flex justify-between items-center'>
					<Button onClick={() => handleNavigation('previous')} className='bg-green-600 px-1'>
						<ChevronLeftIcon className='w-6 h-6' />
					</Button>
					<Button onClick={() => handleNavigation('today')} className='mx-3 bg-gray-dark'>
						{t('common:today')}
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
			<div className='flex justify-center mt-4'>
				<Button className="bg-gray-dark" onClick={() => setIsDatePickerOpen(true)}>
					<span className='font-semibold text-lg'>{currentDate.format('MMMM YYYY')}</span>
				</Button>
				<DatePicker disableMonthView show={isDatePickerOpen} onClose={setIsDatePickerOpen} defaultDate={currentDate} onChange={handleDateChange} />
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
							'border border-gray-dark text-center p-1',
							day.month() !== currentDate.month() && 'text-gray-600'
						)}
						key={index}
					>
						<div className={clsx(day.isSame(dayjs(), 'day') && 'bg-green-600', 'mx-auto w-8 h-8 p-1 rounded-full')}>
							{day.format('D')}
						</div>
					</Link>
				))}
			</div>
		</div>
	)
}

export default Calendar
