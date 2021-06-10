import React from 'react'
import { GetServerSideProps } from 'next'
import Layout from '../components/Templates/Layout'
import { getSession } from 'next-auth/client'
import Title from '../components/Atoms/Title'
import useTranslation from 'next-translate/useTranslation'
import authRedirect from '../utils/authRedirect'
import accountSetupRedirect from '../utils/accountSetupRedirect'

const ReportsPage = () => {
	const { t } = useTranslation()
	return (
		<Layout>
			<div className='page'>
				<Title>{t('navigation:reports')}</Title>
				<main></main>
			</div>
		</Layout>
	)
}

export default ReportsPage

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const session = await getSession({ req })
	if (!session) {
		authRedirect('/dashboard')
	}

	if (session.isNewUser) {
		accountSetupRedirect()
	}

	return {
		props: {}
	}
}
