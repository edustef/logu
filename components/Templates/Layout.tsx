import clsx from 'clsx'
import useTranslation from 'next-translate/useTranslation'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import BottomNavbar, { DesktopMenu } from '../Molecules/Navigation'

interface Props {
	className?: string
	children: React.ReactNode
	page?: string
	fullWidth?: boolean
}

const Layout: React.FC<Props> = ({ children, className = '', page, fullWidth = false }) => {
	const styles = {
		root: clsx(['flex flex-col min-h-screen', 'bg-gray-darkest text-white', className])
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
			<DesktopMenu className='hidden md:block' />
			<main
				className={clsx(
					!fullWidth && 'max-w-3xl mx-auto',
					'flex w-full h-full items-stretch p-3 md:p-8 flex-grow mb-[60px] md:mb-0'
				)}
			>
				<div className='w-full'>{children}</div>
			</main>
			<BottomNavbar className='md:hidden' />
		</div>
	)
}

export default Layout
