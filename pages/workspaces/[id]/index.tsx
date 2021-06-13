import React from 'react'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import Layout from '../../../components/Templates/Layout'
import Title from '../../../components/Atoms/Title'
import { getSession } from 'next-auth/client'
import Card, { CardHeader } from '../../../components/Molecules/Card'
import useTranslation from 'next-translate/useTranslation'
import authRedirect from '../../../utils/authRedirect'
import { getWorkspace } from '../../api/workspaces/[id]'
import StatusCode from 'status-code-enum'
import accountSetupRedirect from '../../../utils/accountSetupRedirect'
import parseQueryOne from '../../../utils/parseQueryOne'
import { WorkspaceWithUsers } from '../../../schemas/userWorkspace.schema'
import Link from '../../../components/Atoms/Link'

const WorkspacePage = ({ workspace }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const { t } = useTranslation()
	return (
		<Layout>
			<Title hasBackBtn>{workspace.name}</Title>
			<div className='space-y-3'>
				<Card>{workspace.name}</Card>
				{!workspace.isIndividual && (
					<Card>
						<CardHeader className='flex items-center justify-between'>
							<h2 className='font-semibold'>{t('workspace:members')}</h2>
							<Link asBtn href={`/workspaces/${workspace.id}/invite`} className='bg-gray-darkless'>
								{t('workspace:addUsers')}
							</Link>
						</CardHeader>
						{workspace.users.map((user) => (
							<div key={user.userId}>
								<span>{user.user.name}</span>
								{user.isAdmin && <span> (Admin)</span>}
							</div>
						))}
					</Card>
				)}
			</div>
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
			workspace: JSON.parse(JSON.stringify(workspace)) as WorkspaceWithUsers
		}
	}
}
