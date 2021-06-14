import clsx from 'clsx'
import { LinkProps } from 'next/link'
import NextLink from 'next/link'
import React from 'react'

interface Props extends LinkProps {
	className?: string
	asBtn?: boolean
}

const Link: React.FC<Props> = ({ className, asBtn = false, children, ...props }) => {
	return (
		<NextLink {...props}>
			<a className={clsx('py-1 rounded font-semibold inline-flex items-center', asBtn && 'px-2', className)}>{children}</a>
		</NextLink>
	)
}

export default Link
