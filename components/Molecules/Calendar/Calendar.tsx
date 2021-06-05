import React from 'react'
import dayjs from 'dayjs'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'
import useTranslation from 'next-translate/useTranslation'
import clsx from 'clsx'
import { ClassNameModel } from '../../models/className.model'

interface Props extends ClassNameModel {}

const Calendar: React.FC<Props> = ({ className }) => {
	const { t } = useTranslation()
	// console.log(dayjs().localeData().longDateFormat('L'))

	return (
		<div className={clsx(className, 'w-full h-full')}>
			<div className='flex px-4 justify-between'>
				<button className=''>
					<span>{dayjs().format('ll')}</span>
				</button>
				<div className='px-4 flex items-center'>
					<button className='bg-green-600'>
						<ChevronLeftIcon className='w-8 h-8' />
					</button>
					<button className='ml-2 bg-green-600'>
						<ChevronRightIcon className='w-8 h-8' />
					</button>
				</div>
			</div>
		</div>
	)
}

export default Calendar
