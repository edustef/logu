import React from 'react'
import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/client'
import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import LoguSvg from '../public/svgs/logu.svg'
import Button from '../components/Button'
import Link from '../components/Link'
import LayoutGuest from '../components/LayoutGuest'
import { useGoogleOneTap } from '../utils/useGoogleOneTap'

interface Props {
	clientId: string
}

const HomePage: React.FC<Props> = ({ clientId }) => {
	const { t } = useTranslation()

	useGoogleOneTap(clientId)

	return (
		<LayoutGuest>
			<Head>
				<script src='https://accounts.google.com/gsi/client' />
			</Head>
			<div className='flex justify-center'>
				<LoguSvg className='w-24 h-24' />
			</div>
			<div className='flex justify-center'>
				<Link href='/account' className='bg-white text-black uppercase mr-3'>
					Get started
				</Link>
				<Button className='border border-white uppercase'>Discover</Button>
			</div>
			<div id='put-google-one-tap-here-plz'></div>
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
		props: {
			clientId: process.env.GOOGLE_CLIENT_ID
		}
	}
}
