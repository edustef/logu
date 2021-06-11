import { Switch } from '@headlessui/react'
import clsx from 'clsx'
import React, { Dispatch, SetStateAction } from 'react'

interface Props {
	className?: string
	checked: boolean
	onChange: Dispatch<SetStateAction<boolean>>
}

export const Toggle: React.FC<Props> = ({ className, checked, onChange }) => {
	return (
		<Switch
			checked={checked}
			onChange={onChange}
			className={clsx(
				className,
				checked ? 'bg-gray-dark' : 'bg-gray-darkless',
				'relative inline-flex flex-shrink-0 h-6 w-10 border-2 border-transparent rounded-full cursor-pointer',
				'transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75'
			)}
		>
			<span className='sr-only'>Use setting</span>
			<span
				aria-hidden='true'
				className={clsx(
					checked ? 'translate-x-4 bg-green-400' : 'translate-x-0 bg-white',
					'pointer-events-none inline-block h-5 w-5 rounded-full shadow-lg transform ring-0 transition ease-in-out duration-200'
				)}
			/>
		</Switch>
	)
}

export default Toggle
