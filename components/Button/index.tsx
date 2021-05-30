import clsx from 'clsx'
import React from 'react'
import { ClassNameModel } from '../../models/className.model'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button: React.FC<Props> = ({ className, onClick, children }) => {
	return (
		<button onClick={onClick} className={clsx('text-sm px-2 py-1 rounded font-semibold', className)}>
			{children}
		</button>
	)
}

export default Button
