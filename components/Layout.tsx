import clsx from 'clsx'
import useTranslation from 'next-translate/useTranslation'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import { ClassNameModel } from '../models/className.model'
import BottomNavbar from './BottomNavbar'

interface Props extends ClassNameModel {
	children: React.ReactNode
	page?: string
}

const Layout: React.FC<Props> = ({ children, className = '', page }) => {
	const styles = {
		root: clsx(['flex flex-col min-h-screen', 'bg-gray-50 text-black', 'dark:bg-gray-darkest dark:text-white', className])
	}
	const { t } = useTranslation()

	if (!page) {
		page = t('errors:page.notFound')
	}

	const router = useRouter()
	return (
		<div className={styles.root}>
			<Head>
				<title>
					{t('metadata:title')} | {page}
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
			<main className='px-3 pt-4 flex-grow'>{children}</main>
			<BottomNavbar />
		</div>
	)
}

export default Layout
