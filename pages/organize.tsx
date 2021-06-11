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
			<div className='flex flex-col h-full'>
				<WorkspaceDropdown className='mt-2 text-2xl font-semibold' />
				<div className='mt-6 flex-grow'>
					<Calendar className='flex-grow' />
				</div>
			</div>
		</Layout>
	)
}

export default OrganizePage

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
