import clsx from 'clsx'
import React from 'react'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button: React.FC<Props> = ({ className, children, ...props }) => {
	return (
		<button {...props} className={clsx('px-2 py-1 rounded font-semibold inline-flex items-center justify-center', className)}>
			{children}
		</button>
	)
}

export default Button
