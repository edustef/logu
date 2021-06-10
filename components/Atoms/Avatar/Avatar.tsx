import { Transition } from '@headlessui/react'
import clsx from 'clsx'
import useTranslation from 'next-translate/useTranslation'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import getAvatarName from '../../../utils/getAvatarName'

interface Props {
	className?: string
	width?: number
	height?: number
}

type UrlOrName = { url?: null; name: string } | { url: string; name?: never }

const Avatar: React.FC<Props & UrlOrName> = ({ className, url, name, width = 80, height = 80 }) => {
	const [src, setSrc] = useState<string>()
	const { t } = useTranslation()

	useEffect(() => {
		if (url) {
			setSrc(url)
		} else {
			setSrc(getAvatarName({ name, size: width }))
		}
	}, [url, name])

	return (
		<div style={{ width, height }} className={clsx('relative rounded-full', className)}>
			<Transition show={!src} leave='transition-opacity duration-300' leaveFrom='opacity-100' leaveTo='opacity-0'>
				<Skeleton className='absolute inset-0' width={width} height={height} circle />
			</Transition>
			<Transition
				show={Boolean(src)}
				enter='transition-opacity duration-300'
				enterFrom='opacity-0'
				enterTo='opacity-100'
			>
				<Image
					alt={t('common:avatarAlt')}
					src={src}
					width={width}
					height={height}
					className='rounded-full object-cover'
				/>
			</Transition>
		</div>
	)
}

export default Avatar
