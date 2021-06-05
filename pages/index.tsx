import React from 'react'
import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/client'
import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import LoguSvg from '../public/svgs/logu.svg'
import Button from '../components/Atoms/Button'
import Link from '../components/Atoms/Link'
import LayoutGuest from '../components/LayoutGuest'
import { useGoogleOneTap } from '../hooks/useGoogleOneTap'

interface Props {
	clientId: string
}

const HomePage: React.FC<Props> = () => {
	const { t } = useTranslation()
	useGoogleOneTap()

	return (
		<LayoutGuest>
			<div className='flex justify-center'>
				<LoguSvg className='w-24 h-24' />
			</div>
			<div className='flex justify-center'>
				<Link href='/account' className='bg-white text-black uppercase mr-3'>
					Get started
				</Link>
				<Button className='border border-white uppercase'>Discover</Button>
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
