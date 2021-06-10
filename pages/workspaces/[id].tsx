import React from 'react'
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import Layout from '../../components/Templates/Layout'
import Title from '../../components/Atoms/Title'
import { getSession } from 'next-auth/client'
import Card from '../../components/Molecules/Card'
import useTranslation from 'next-translate/useTranslation'
import authRedirect from '../../utils/authRedirect'
import { getWorkspace } from '../api/workspaces/[id]'
import StatusCode from 'status-code-enum'

export const getServerSideProps = async ({ req, params, res }: GetServerSidePropsContext) => {
	const session = await getSession({ req })
	let id: string

	if (typeof params['id'] === 'string') {
		id = params['id']
	} else {
		id = params['id'][0]
	}

	if (!session) {
		return authRedirect(req.url)
	}

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
			workspace: JSON.parse(JSON.stringify(workspace))
		}
	}
}

const WorkspacePage = ({ workspace }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const { t } = useTranslation()

	return (
		<Layout>
			<Title>{workspace.name}</Title>
			<Card>{workspace.name}</Card>
		</Layout>
	)
}

export default WorkspacePage
