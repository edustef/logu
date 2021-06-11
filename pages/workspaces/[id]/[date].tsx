import React from 'react'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import Layout from '../../../components/Templates/Layout'
import Title from '../../../components/Atoms/Title'
import { getSession } from 'next-auth/client'
import Card from '../../../components/Molecules/Card'
import useTranslation from 'next-translate/useTranslation'
import authRedirect from '../../../utils/authRedirect'
import { getWorkspace } from '../../api/workspaces/[id]'
import StatusCode from 'status-code-enum'
import accountSetupRedirect from '../../../utils/accountSetupRedirect'
import parseQueryOne from '../../../utils/parseQueryOne'

const WorkspacePage = ({ workspace, date }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const { t } = useTranslation()
	console.log(date)

	return (
		<Layout>
			<Title hasBackBtn>{workspace.name}</Title>
			<Card>{workspace.name}</Card>
		</Layout>
	)
}

export default WorkspacePage

export const getServerSideProps = async ({ req, params, res }: GetServerSidePropsContext) => {
	const session = await getSession({ req })
	if (!session) {
		return authRedirect(req.url)
	}

	if (session.userDetails.isNewUser) {
		return accountSetupRedirect()
	}

	const id = parseQueryOne(params.id)
	const date = parseQueryOne(params.date)
	const workspace = await getWorkspace(id)

	if (!workspace) {
		res.statusCode = StatusCode.ClientErrorNotFound
		res.end()
	}

	if (!workspace.users.find(({ user }) => user.id === session.userDetails.id)) {
		res.statusCode = StatusCode.ClientErrorForbidden
		res.end()
	}

	return {
		props: {
			workspace: JSON.parse(JSON.stringify(workspace)),
			date: date
		}
	}
}
