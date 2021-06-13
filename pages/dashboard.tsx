import React from 'react'
import { GetServerSideProps } from 'next'
import Layout from '../components/Templates/Layout'
import { getSession } from 'next-auth/client'
import { User } from 'next-auth'
import useTranslation from 'next-translate/useTranslation'
import Title from '../components/Atoms/Title'
import authRedirect from '../utils/authRedirect'
import accountSetupRedirect from '../utils/accountSetupRedirect'
import Notifications from '../components/Molecules/Notifications'

type Props = {
	user: User
}

const DashboardPage: React.FC<Props> = () => {
	const { t } = useTranslation()

	return (
		<Layout page={t('navigation:dashboard')}>
			<div className='page'>
				<div className="flex items-center">
				<Title className="flex-grow">{t('navigation:dashboard')}</Title>
				<Notifications />
				</div>
				<main></main>
			</div>
		</Layout>
	)
}

export default DashboardPage

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const session = await getSession({ req })
	if (!session) {
		return authRedirect('/dashboard')
	}

	if (session.userDetails.isNewUser) {
		return accountSetupRedirect()
	}

	return {
		props: {}
	}
}
