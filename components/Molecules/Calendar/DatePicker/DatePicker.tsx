import React, { Fragment, useEffect, useRef, useState } from 'react'
import dayjs, { Dayjs, OpUnitType } from 'dayjs'
import { Dialog, Popover, Transition } from '@headlessui/react'
import Button from '../../../Atoms/Button'
import { ArrowLeftIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import { getDays, getMonths, getWeekDays, getYears } from '../_utils/getDates'
import { FULL_WEEK } from '../_utils/typeOfWeek'
import clsx from 'clsx'
import useTranslation from 'next-translate/useTranslation'
import BackButton from '../../BackButton'

interface Props {
	defaultView?: 'month' | 'year' | 'years'
	defaultDate?: Dayjs
	show: boolean
	onChange: React.Dispatch<React.SetStateAction<Dayjs>>
	onClose: React.Dispatch<React.SetStateAction<boolean>>
}

const DatePicker: React.FC<Props> = ({ defaultDate = dayjs(), show, onChange, onClose, defaultView = 'year' }) => {
	const { t } = useTranslation()
	const [view, setView] = useState<OpUnitType>(defaultView)
	const [currentDate, setCurrentDate] = useState(defaultDate)

	const [weekDays, setWeekDays] = useState<string[]>(getWeekDays())
	const [datesByDay, setDaysPerMonth] = useState<Dayjs[]>(getDays(dayjs()))
	const [datesByMonth, setMonths] = useState<Dayjs[]>(getMonths(currentDate))
	const [datesByYear, setYears] = useState<Dayjs[]>(getYears(currentDate))

	useEffect(() => {
		setCurrentDate(defaultDate)
	}, [defaultDate])

	useEffect(() => {
		switch (view) {
			case 'month':
				setWeekDays(getWeekDays(FULL_WEEK))
				setDaysPerMonth(getDays(currentDate, FULL_WEEK))
				break
			case 'year':
				setMonths(getMonths(currentDate))
				break
			case 'years':
				setYears(getYears(currentDate))
				break
		}
	}, [view, currentDate])

	// console.log(dayjs().localeData().longDateFormat('L'))

	const handleNavigation = (action: 'next' | 'previous') => {
		const amount = view === 'years' ? datesByYear.length : 1
		switch (action) {
			case 'next':
				setCurrentDate((date) => date.add(amount, view))
				break
			case 'previous':
				setCurrentDate((date) => date.subtract(amount, view))
				break
		}
	}

	return (
		<>
			<Transition appear show={show} as={Fragment}>
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
							<div className='flex flex-col h-80 w-full max-w-md p-3 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-dark shadow-xl rounded'>
								{view !== 'month' && <Button className="self-start" onClick={() => setView('month')}><ArrowLeftIcon className="w-5 h-5" /></Button>}
								<div className='flex justify-around items-center'>
									<Button onClick={() => handleNavigation('previous')} className='px-1'>
										<ChevronLeftIcon className='w-6 h-6' />
									</Button>
									{view === 'month' && (
										<Button onClick={() => setView('year')} className='mx-3 bg-gray-darkless'>
											{currentDate.format('YYYY')}
										</Button>
									)}
									{view === 'year' && (
										<Button onClick={() => setView('years')} className='mx-3 bg-gray-darkless'>
											{currentDate.format('YYYY')}
										</Button>
									)}
									{view === 'years' && <Button className='mx-3 bg-gray-darkless'>{currentDate.format('YYYY')}</Button>}
									<Button onClick={() => handleNavigation('next')} className='px-1'>
										<ChevronRightIcon className='w-6 h-6' />
									</Button>
								</div>
								{view === 'month' && (
									<div className='mt-2 grid auto-cols-max grid-cols-7'>
										{weekDays.map((day) => (
											<div className='text-center flex-grow border border-gray-dark' key={day}>
												{day}
											</div>
										))}
									</div>
								)}
								{view === 'month' && (
									<div className='mt-2 flex-grow grid auto-cols-max grid-cols-7'>
										{datesByDay.map((date, index) => (
											<Button
												onClick={() => onChange(date)}
												className={clsx(
													'border border-gray-dark grid place-items-center p-1',
													date.month() !== currentDate.month() && 'text-gray-600'
												)}
												key={index}
											>
												<div className={clsx(date.isSame(dayjs(), 'day') && 'bg-green-600', 'p-1 rounded-full')}>
													{date.format('D')}
												</div>
											</Button>
										))}
									</div>
								)}
								{view === 'year' && (
									<div className='mt-2 flex-grow grid auto-cols-max grid-cols-4 grid-rows-3'>
										{datesByMonth.map((date, index) => (
											<Button
												onClick={() => setView('month')}
												className={clsx('border border-gray-dark grid place-items-center p-1')}
												key={index}
											>
												<div
													className={clsx(date.isSame(dayjs(), 'month') && 'bg-green-600', 'p-1 rounded-full')}
													key={index}
												>
													{date.format('MMM')}
												</div>
											</Button>
										))}
									</div>
								)}
								{view === 'years' && (
									<div className='mt-2 flex-grow grid auto-cols-max grid-cols-4 grid-rows-2'>
										{datesByYear.map((date, index) => (
											<Button
												onClick={() => setView('year')}
												className={clsx('border border-gray-dark grid place-items-center p-1')}
												key={index}
											>
												<div
													className={clsx(date.isSame(dayjs(), 'month') && 'bg-green-600', 'p-1 rounded-full')}
													key={index}
												>
													{date.format('YYYY')}
												</div>
											</Button>
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
