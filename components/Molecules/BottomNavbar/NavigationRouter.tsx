import Link from 'next/link'
import React from 'react'

interface Props {
	currentPath: string
	children: React.ReactNode
}

const NavigationRouter: React.FC<Props> = ({ currentPath, children }) => {
	return (
		<>
			{React.Children.map(children, (child) => {
				if (React.isValidElement(child)) {
					return React.cloneElement(child, { currentPath: currentPath })
				}
				return child
			})}
		</>
	)
}

export default NavigationRouter
