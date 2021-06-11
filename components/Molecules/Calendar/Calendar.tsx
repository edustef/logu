import React, { useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'
import useTranslation from 'next-translate/useTranslation'
import clsx from 'clsx'
import Button from '../../Atoms/Button'
import Toggle from '../../Atoms/Toggle'
import Link from '../../Atoms/Link'

interface Props {
	className?: string
}

const WORK_WEEK = 5
const FULL_WEEK = 7

type TypeOfWeek = typeof WORK_WEEK | typeof FULL_WEEK

const getWeekDays = (typeOfWeek: TypeOfWeek = WORK_WEEK) => {
	return Array(typeOfWeek)
		.fill('')
		.map((val, i) => {
			return dayjs().weekday(i).format('ddd').toUpperCase()
		})
}

const getMonthDaysPerWeek = (date: Dayjs, typeOfWeek: TypeOfWeek = WORK_WEEK) => {
	const firstWeekdayOfMonth = date.date(1).startOf('week')
	const daysPerWeek: Dayjs[][] = []

	let currentDate = firstWeekdayOfMonth
	for (let week = 0; week < 5; week++) {
		let weekDays: Dayjs[] = []
		for (let day = 0; day < typeOfWeek; day++) {
			weekDays.push(currentDate.weekday(day))
		}
		daysPerWeek.push(weekDays)
		currentDate = currentDate.add(FULL_WEEK, 'day')
	}

	return daysPerWeek
}

const Calendar: React.FC<Props> = ({ className }) => {
	const { t } = useTranslation()
	const [isFullWeek, setIsFullWeek] = useState(false)
	const [currentMonthDate, setCurrentMonthDate] = useState(dayjs())
	const [weekDays, setWeekDays] = useState<string[]>(getWeekDays())
	const [daysPerWeek, setDaysPerWeek] = useState<Dayjs[][]>(getMonthDaysPerWeek(dayjs()))

	useEffect(() => {
		setWeekDays(getWeekDays(isFullWeek ? FULL_WEEK : WORK_WEEK))
		setDaysPerWeek(getMonthDaysPerWeek(currentMonthDate, isFullWeek ? FULL_WEEK : WORK_WEEK))
	}, [isFullWeek, currentMonthDate])

	// console.log(dayjs().localeData().longDateFormat('L'))

	const handleMonthChange = (action: 'today' | 'next' | 'previous') => {
		switch (action) {
			case 'today':
				setCurrentMonthDate(dayjs())
				break
			case 'next':
				setCurrentMonthDate((date) => date.add(1, 'month'))
				break
			case 'previous':
				setCurrentMonthDate((date) => date.subtract(1, 'month'))
				break
		}
	}

	return (
		<div className={clsx(className, 'w-full h-full flex flex-col')}>
			<div className='flex justify-between items-center'>
				<div className='flex justify-between items-center'>
					<Button onClick={() => handleMonthChange('previous')} className='bg-green-600 px-1'>
						<ChevronLeftIcon className='w-6 h-6' />
					</Button>
					<Button onClick={() => handleMonthChange('today')} className='mx-3 bg-gray-dark'>
						{t('common:today')}
					</Button>
					<Button onClick={() => handleMonthChange('next')} className='bg-green-600 px-1'>
						<ChevronRightIcon className='w-6 h-6' />
					</Button>
				</div>
				<div className='flex items-center'>
					<span className='mr-2 text-gray-500 text-sm'>{t('calendar:toggleFullWeek')}</span>
					<Toggle checked={isFullWeek} onChange={setIsFullWeek} />
				</div>
			</div>
			<div
				className={clsx('mt-4 grid grid-flow-rows auto-cols-max', `grid-cols-${isFullWeek ? FULL_WEEK : WORK_WEEK}`)}
			>
				{weekDays.map((day) => (
					<div className='text-center flex-grow border border-gray-dark' key={day}>
						{day}
					</div>
				))}
			</div>
			<div
				className={clsx(
					'mt-4 flex-grow grid grid-flow-rows auto-cols-max',
					`grid-cols-${isFullWeek ? FULL_WEEK : WORK_WEEK}`
				)}
			>
				{daysPerWeek.map((week, weekIndex) => {
					return week.map((day, dayIndex) => (
						<Link
							href={`/${'qwe'}/${day.format('YYYY-MM-DD')}`}
							className={clsx(
								'border border-gray-dark text-center p-1',
								day.month() !== currentMonthDate.month() && 'text-gray-600'
							)}
							key={dayIndex}
						>
							<div className={clsx(day.isSame(dayjs(), 'day') && 'bg-green-600', 'mx-auto w-8 h-8 p-1 rounded-full')}>
								{day.format('D')}
							</div>
						</Link>
					))
				})}
			</div>
		</div>
	)
}

export default Calendar
