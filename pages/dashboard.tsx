import React from 'react'
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import Layout from '../components/Templates/Layout'
import { getSession, useSession } from 'next-auth/client'
import useTranslation from 'next-translate/useTranslation'
import Title from '../components/Atoms/Title'
import authRedirect from '../utils/authRedirect'
import accountSetupRedirect from '../utils/accountSetupRedirect'
import Notifications from '../components/Molecules/Notifications'
import { User } from '@prisma/client'

const DashboardPage = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const { t } = useTranslation()
	const session = useSession()[0]
	const userId = session?.userDetails?.id

	return (
		<Layout fullWidth page={t('navigation:dashboard')}>
			<div className='page'>
				<div className='flex items-center'>
					<Title className='flex-grow'>{t('navigation:dashboard')}</Title>
					<Notifications className="md:hidden" />
				</div>
				<main>
					
				</main>
			</div>
		</Layout>
	)
}

export default DashboardPage

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
	const session = await getSession({ req })
	if (!session) {
		return authRedirect('/dashboard')
	}

	if (session.userDetails.isNewUser) {
		return accountSetupRedirect()
	}

	return {
		props: {
			user: JSON.parse(JSON.stringify(session.userDetails)) as User
		}
	}
}
