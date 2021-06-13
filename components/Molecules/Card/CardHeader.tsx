import React from 'react'

type Props = {
	children: React.ReactNode
	className?: string
}

const CardHeader: React.FC<Props> = ({ children, className = '' }) => {
	return (
		<>
			<div className={className}>{children}</div>
			<div className='my-3 border border-gray-darkless border-opacity-50'></div>
		</>
	)
}

export default CardHeader
