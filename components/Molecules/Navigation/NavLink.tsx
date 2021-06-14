import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'

interface Props {
	currentPath?: string
	path: string
	name: string
	children: React.ReactNode
}

/**
 * Wrap NavLinks in NavigationRouter and pass the currentPath to it
 */
const NavLink: React.FC<Props> = ({ currentPath, path, name, children }) => {
	const isActive = currentPath.split('/')[1] === path.split('/')[1]
	return (
		<Link href={path}>
			<a
				className={clsx(
					isActive ? 'text-green-500' : '',
					'w-full flex flex-col items-center focus:text-green-500 hover:text-green-500 justify-center text-center pt-2 pb-1'
				)}
			>
				{children}
				<span className='tab tab-home block text-xs'>{name}</span>
			</a>
		</Link>
	)
}

export default NavLink
