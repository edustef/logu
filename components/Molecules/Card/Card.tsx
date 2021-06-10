import clsx from 'clsx'
import React from 'react'

type Props = {
	children: React.ReactNode
	className?: string
}

const Card: React.FC<Props> = ({ children, className = '' }) => {
	return (
		<div className={clsx('rounded-md p-3 shadow-md bg-gray-dark', className)}>
			{children}
		</div>
	)
}

export default Card
