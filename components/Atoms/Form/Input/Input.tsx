import { SearchIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import React, { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
	className?: string
	button: React.ReactChild
}

const Input: React.FC<Props> = ({ className, button, ...props }) => {
	return (
		<div className={clsx('relative inline-block text-gray-400 focus-within:text-gray-600', className)}>
			<span className='flex items-center absolute left-0 inset-y-0 pl-1'>{button}</span>
			<input
				{...props}
				className={clsx('w-full py-1 text-gray-600 focus-within:text-black rounded pr-2', button && 'pl-8')}
			/>
		</div>
	)
}

export default Input
