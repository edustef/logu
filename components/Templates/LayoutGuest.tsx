import React from 'react'
import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'

import clsx from 'clsx'

interface Props {
	className?: string
	children: React.ReactNode
	fullWidth?: boolean
}

const LayoutGuest: React.FC<Props> = ({ children, className, fullWidth = false }) => {
	const { t } = useTranslation()

	return (
		<>
			<Head>
				<title>
					{t('metadata:title')} | {t('navigation:welcome')}
				</title>
				<link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
				<link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
				<link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
				<link rel='manifest' href='/site.webmanifest' />
				<link rel='mask-icon' href='/safari-pinned-tab.svg' color='#000' />
				<meta name='apple-mobile-web-app-title' content='Logu' />
				<meta name='application-name' content='Logu' />
				<meta name='msapplication-TileColor' content='#000' />
			</Head>
			<main
				className={clsx(
					!fullWidth && 'mx-auto max-w-3xl',
					'flex flex-col items-stretch min-h-screen w-full px-3 text-white bg-gray-darkest'
				)}
			>
				<div className={clsx(className, 'pt-6 flex-grow mb-6')}>{children}</div>
			</main>
		</>
	)
}

export default LayoutGuest
