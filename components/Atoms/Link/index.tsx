import clsx from 'clsx'
import { LinkProps } from 'next/link'
import NextLink from 'next/link'
import React from 'react'

interface Props extends LinkProps {
	className: string
}

const Link: React.FC<Props> = ({ className, children, ...props }) => {
	return (
		<NextLink {...props}>
			<a className={clsx('px-2 py-1 rounded font-semibold', className)}>{children}</a>
		</NextLink>
	)
}

export default Link
