import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'
import useTranslation from 'next-translate/useTranslation'
import React, { useEffect, useState } from 'react'
import StatusCode from 'status-code-enum'
import Layout from '../../components/Templates/Layout'
import accountSetupRedirect from '../../utils/accountSetupRedirect'
import authRedirect from '../../utils/authRedirect'
import { getWorkspaces } from '../api/workspaces'

const OrganizePage: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Layout fullWidth>
			<div></div>
		</Layout>
	)
}

export default OrganizePage

export const getServerSideProps: GetServerSideProps = async ({ req, params, res }) => {
	const session = await getSession({ req })

	if (!session) {
		return authRedirect(req.url)
	}

	if (session.userDetails.isNewUser) {
		return accountSetupRedirect()
	}

	const workspaces = await getWorkspaces(session.userDetails.id, { isAdmin: '1' })

	if (!workspaces) {
		res.statusCode = StatusCode.ClientErrorNotFound
		return {
			redirect: {
				destination: '/workspaces/create',
				permanent: false
			}
		}
	}

	return {
		redirect: {
			destination: `/organize/${workspaces[0].id}`,
			permanent: false
		}
	}
}
