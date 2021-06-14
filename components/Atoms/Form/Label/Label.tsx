import { SearchIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import React, { InputHTMLAttributes } from 'react'

interface Props extends React.LabelHTMLAttributes<HTMLLabelElement> {
	className?: string
}

const Label: React.FC<Props> = ({ className, children, ...props }) => {
	return <label className='block mb-1 uppercase text-sm text-gray-400 font-semibold'>{children}</label>
}

export default Label
