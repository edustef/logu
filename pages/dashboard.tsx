import React from 'react'
import { GetServerSideProps, GetStaticProps } from 'next'
import Layout from '../components/Layout'
import Post, { PostProps } from '../components/Post'
import prisma from '../lib/prisma'
import { getSession } from 'next-auth/client'
import { User } from 'next-auth'
import useTranslation from 'next-translate/useTranslation'
import Title from '../components/Title'

type Props = {
	user: User
}

const DashboardPage: React.FC<Props> = ({ user }) => {
	const { t } = useTranslation()

	return (
		<Layout page={t('navigation:dashboard')}>
			<div className='page'>
				<Title>{t('navigation:dashboard')}</Title>
				<main></main>
			</div>
		</Layout>
	)
}

export default DashboardPage

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const session = await getSession({ req })
	if (!session) {
		return {
			redirect: {
				destination: '/auth/signin',
				permanent: false
			}
		}
	}

	return {
		props: { user: session.user }
	}
}
