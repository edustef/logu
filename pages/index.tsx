import React from 'react'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'
import useTranslation from 'next-translate/useTranslation'
import LoguSvg from '../public/svgs/logu.svg'
import Button from '../components/Atoms/Button'
import Link from '../components/Atoms/Link'
import LayoutGuest from '../components/Templates/LayoutGuest'
import { useGoogleOneTap } from '../hooks/useGoogleOneTap'
import LanguageMenu from '../components/Molecules/LanguageMenu'
import Feature1 from '../public/svgs/undraw-presentation1.svg'
import Feature2 from '../public/svgs/undraw-presentation2.svg'
import Feature3 from '../public/svgs/undraw-presentation3.svg'
import Card from '../components/Molecules/Card'

interface Props {
	clientId: string
}

const HomePage: React.FC<Props> = () => {
	const { t } = useTranslation()
	useGoogleOneTap()

	return (
		<LayoutGuest fullWidth>
			<LanguageMenu />
			<div className='flex flex-col items-center justify-center'>
				<LoguSvg className='w-16 md:w-36 mb-2' />
				<div className='text-lg font-semibold italic'>
					{t('home:subtitle1')} {t('home:subtitle2')}
				</div>
			</div>
			<div className='flex justify-center mt-10'>
				<Link asBtn href='/account' className='bg-green-600 text-white uppercase mr-3'>
					{t('home:getStarted')}
				</Link>
			</div>
			<div className='flex flex-wrap justify-around'>
				<div className='bg-gray-dark rounded shadow-md p-4 flex-col text-center my-10 md:mx-8 w-80 md:h-96'>
					<h2 className='text-2xl'>{t('home:feature1.title')}</h2>
					<p className='mt-2 mb-6'>{t('home:feature1.description')}</p>
					<Feature1 />
				</div>
				<div className='mb-16 md:mb-0 bg-gray-dark rounded-md shadow-md p-4 text-center my-10 md:mx-8 w-80 md:h-96'>
					<h2 className='text-2xl'>{t('home:feature2.title')}</h2>
					<p className='mt-2 mb-6'>{t('home:feature2.description')}</p>
					<Feature2 />
				</div>
				<div className='bg-gray-dark rounded shadow-md p-4 text-center my-10 md:mx-8 w-80 md:h-96'>
					<h2 className='text-2xl'>{t('home:feature3.title')}</h2>
					<p className='mt-2 mb-6'>{t('home:feature2.description')}</p>
					<Feature3 />
				</div>
			</div>
		</LayoutGuest>
	)
}

export default HomePage

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const session = await getSession({ req })

	if (session) {
		return {
			redirect: {
				destination: '/dashboard',
				permanent: false
			}
		}
	}

	return {
		props: {}
	}
}
