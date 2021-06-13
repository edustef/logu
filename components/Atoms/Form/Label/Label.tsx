import { SearchIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import React, { InputHTMLAttributes } from 'react'

interface Props extends React.LabelHTMLAttributes<HTMLLabelElement> {
	className?: string
	button: React.ReactChild
}

const Label: React.FC<Props> = ({ className, button, children, ...props }) => {
	return (
		<label className='' {...props}>
			{children}
		</label>
	)
}

export default Label
