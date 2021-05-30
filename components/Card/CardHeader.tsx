import React from 'react'

type Props = {
	children: React.ReactNode
	className?: string
}

const CardHeader: React.FC<Props> = ({ children, className = '' }) => {
	return (
		<>
			<div className={className}>{children}</div>
			<hr className='my-2 border-gray-700' />
		</>
	)
}

export default CardHeader
