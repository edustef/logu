import React from 'react'
import Layout from '../components/Templates/Layout'
import Calendar from '../components/Molecules/Calendar'
import useTranslation from 'next-translate/useTranslation'
import Title from '../components/Atoms/Title'
import WorkspaceDropdown from '../components/Molecules/WorkspaceDropdown'
import { getSession } from 'next-auth/client'
import { GetServerSideProps } from 'next'
import authRedirect from '../utils/authRedirect'
import accountSetupRedirect from '../utils/accountSetupRedirect'

const OrganizePage: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Layout>
			<div className='flex flex-col'>
				<div className='flex items-center'>
					<Title>{t('navigation:organize')}</Title>
					<WorkspaceDropdown />
				</div>
				<Calendar className='flex-grow' />
			</div>
		</Layout>
	)
}

export default OrganizePage

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
