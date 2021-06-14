import React, { Fragment, useEffect, useRef, useState } from 'react'
import dayjs, { Dayjs, OpUnitType } from 'dayjs'
import { Dialog, Popover, Transition } from '@headlessui/react'
import Button from '../../../Atoms/Button'
import { ArrowLeftIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import { getDays, getMonths, getWeekDays, getYears } from '../_utils/getDates'
import { FULL_WEEK } from '../_utils/typeOfWeek'
import clsx from 'clsx'
import useTranslation from 'next-translate/useTranslation'

interface Props {
	defaultView?: 'month' | 'year' | 'years'
	defaultDate?: Dayjs
	show: boolean
	disableMonthView?: boolean
	disableYearView?: boolean
	disableYearsView?: boolean
	onChange: React.Dispatch<React.SetStateAction<Dayjs>>
	onClose: React.Dispatch<React.SetStateAction<boolean>>
}

const DatePicker: React.FC<Props> = ({
	defaultDate = dayjs(),
	show,
	onChange,
	onClose,
	defaultView = 'month',
	disableMonthView = false,
	disableYearView = false,
	disableYearsView = false
}) => {
	const { t } = useTranslation()
	const [currentView, setCurrentView] = useState<OpUnitType>(defaultView)
	const [currentDate, setCurrentDate] = useState(defaultDate)

	const [weekDays, setWeekDays] = useState<string[]>(getWeekDays())
	const [datesByDay, setDaysPerMonth] = useState<Dayjs[]>(getDays(dayjs()))
	const [datesByMonth, setMonths] = useState<Dayjs[]>(getMonths(currentDate))
	const [datesByYear, setYears] = useState<Dayjs[]>(getYears(currentDate))

	// console.log(dayjs().localeData().longDateFormat('L'))

	useEffect(() => {
		if (disableMonthView) {
			defaultView = 'year'
		}

		if (disableYearView) {
			defaultView = 'years'
		}
	})

	useEffect(() => {
		handleDateChange(defaultDate, defaultView)
	}, [show])

	const handleNavigation = (action: 'next' | 'previous') => {
		const amount = currentView === 'years' ? datesByYear.length : 1
		switch (action) {
			case 'next':
				handleDateChange(currentDate.add(amount, currentView), currentView)
				break
			case 'previous':
				handleDateChange(currentDate.subtract(amount, currentView), currentView)
				break
		}
	}

	const handleDateChange = (date: Dayjs, view: OpUnitType) => {
		setCurrentDate(date)
		switch (view) {
			case 'month':
				if (!disableMonthView) {
					setWeekDays(getWeekDays(FULL_WEEK))
					setDaysPerMonth(getDays(date, FULL_WEEK))
					setCurrentView(view)
				} else {
					onChange(date)
				}
				break
			case 'year':
				console.log(disableYearView)

				if (!disableYearView) {
					setMonths(getMonths(date))
					setCurrentView(view)
				} else {
					onChange(date)
				}
				break
			case 'years':
				if (!disableYearsView) {
					setYears(getYears(date))
					setCurrentView(view)
				} else {
					onChange(date)
				}
				break
		}
	}

	return (
		<>
			<Transition show={show} as={Fragment}>
				<Dialog as='div' className='fixed inset-0 z-10 overflow-y-auto' onClose={onClose}>
					<div className='text-white min-h-screen grid place-items-center px-3 text-center bg-black bg-opacity-50'>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0'
							enterTo='opacity-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100'
							leaveTo='opacity-0'
						>
							<Dialog.Overlay className='fixed inset-0' />
						</Transition.Child>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 scale-95'
							enterTo='opacity-100 scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 scale-100'
							leaveTo='opacity-0 scale-95'
						>
							<div className='flex flex-col h-80 min-h-[] w-full max-w-md p-3 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-dark shadow-xl rounded'>
								<div className="flex items-center justify-between">
									<Button onClick={() => onChange(dayjs())} className='mx-3 border border-gray-darkless'>
										{t('common:today')}
									</Button>
									<div className='flex flex-grow justify-around items-center'>
										<Button onClick={() => handleNavigation('previous')} className='px-1'>
											<ChevronLeftIcon className='w-6 h-6' />
										</Button>
										{currentView === 'month' && (
											<Button onClick={() => setCurrentView('year')} className='mx-3 text-lg bg-gray-darkless'>
												{currentDate.format('MMMM YYYY')}
											</Button>
										)}
										{currentView === 'year' && (
											<Button onClick={() => setCurrentView('years')} className='mx-3 text-lg bg-gray-darkless'>
												{currentDate.format('YYYY')}
											</Button>
										)}
										{currentView === 'years' && (
											<Button className='mx-3 text-lg bg-gray-darkless'>
												{datesByYear[0].format('YYYY')} - {datesByYear[datesByYear.length - 1].format('YYYY')}
											</Button>
										)}
										<Button onClick={() => handleNavigation('next')} className='px-1'>
											<ChevronRightIcon className='w-6 h-6' />
										</Button>
									</div>
								</div>
								{currentView === 'month' && (
									<div className='mt-2 grid auto-cols-max grid-cols-7'>
										{weekDays.map((day) => (
											<div className='text-center flex-grow border border-gray-dark' key={day}>
												{day}
											</div>
										))}
									</div>
								)}
								{currentView === 'month' && (
									<div className='mt-2 flex-grow grid auto-cols-max grid-cols-7'>
										{datesByDay.map((date, index) => (
											<div className={clsx('grid place-items-center p-1')} key={index}>
												<Button
													className={clsx(
														'p-1 rounded',
														date.isSame(dayjs(), 'day') && 'bg-green-600',
														!date.isSame(currentDate, 'month') && 'text-gray-400',
														date.isSame(currentDate, 'day') && 'border border-gray-darkless'
													)}
													onClick={() => onChange(date)}
												>
													{date.format('D')}
												</Button>
											</div>
										))}
									</div>
								)}
								{currentView === 'year' && (
									<div className='mt-2 flex-grow grid auto-cols-max grid-cols-4 grid-rows-3'>
										{datesByMonth.map((date, index) => (
											<div className={clsx('grid place-items-center p-1')} key={index}>
												<Button
													onClick={() => handleDateChange(date, 'month')}
													className={clsx(
														'p-3 rounded',
														date.isSame(dayjs(), 'month') && 'bg-green-600',
														date.isSame(currentDate, 'month') && 'border border-gray-darkless'
													)}
													key={index}
												>
													{date.format('MMM')}
												</Button>
											</div>
										))}
									</div>
								)}
								{currentView === 'years' && (
									<div className='mt-2 flex-grow grid auto-cols-max grid-cols-4 grid-rows-2'>
										{datesByYear.map((date, index) => (
											<div className={clsx('grid place-items-center p-1')} key={index}>
												<Button
													onClick={() => handleDateChange(date, 'year')}
													className={clsx(
														'p-2 rounded',
														date.isSame(dayjs(), 'year') && 'bg-green-600',
														date.isSame(currentDate, 'year') && 'border border-gray-darkless'
													)}
													key={index}
												>
													{date.format('YYYY')}
												</Button>
											</div>
										))}
									</div>
								)}
							</div>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition>
		</>
	)
}

export default DatePicker
