import clsx from 'clsx'
import { LinkProps } from 'next/link'
import NextLink from 'next/link'
import React from 'react'
import { ClassNameModel } from '../../models/className.model'

interface Props extends LinkProps, ClassNameModel {}

const Link: React.FC<Props> = ({ className, children, href }) => {
	return (
		<NextLink href={href}>
			<a className={clsx('text-sm px-2 py-1 rounded font-semibold', className)}>{children}</a>
		</NextLink>
	)
}

export default Link
