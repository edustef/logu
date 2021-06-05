import React from 'react'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'
import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import LoguSvg from '../public/svgs/logu.svg'
import Button from '../Atoms/Button'
import Link from '../Atoms/Link'

interface Props {
	className: string,
	children: React.ReactNode
}

const LayoutGuest: React.FC<Props> = ({ children }) => {
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
			<main className='flex flex-col min-h-screen w-full px-3 dark:text-white dark:bg-gray-darkest'>
				<div className='pt-6 h-0 flex-grow'>{children}</div>
			</main>
		</>
	)
}

export default LayoutGuest
