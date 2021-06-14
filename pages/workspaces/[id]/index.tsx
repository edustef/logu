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
import { User } from '@prisma/client'
import Avatar from '../../../components/Atoms/Avatar'
import Button from '../../../components/Atoms/Button'
import { ViewGridAddIcon } from '@heroicons/react/solid'
import { MailOpenIcon } from '@heroicons/react/outline'

const WorkspacePage = ({ workspace, user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const { t } = useTranslation()

	console.log(user, workspace.users)
	const isAdmin = () => {
		return workspace.users.find((usr) => user.id === usr.user.id && usr.isAdmin)
	}

	return (
		<Layout>
			<Title hasBackBtn>{workspace.name}</Title>
			<Link asBtn className='bg-gray-darkless mt-2' href={`/organize/${workspace.id}`}>
				<ViewGridAddIcon className='w-6 h-6 mr-1' />
				{t('workspace:organizeBtn')}
			</Link>
			<div className='space-y-3 mt-3'>
				{!workspace.isIndividual && (
					<Card>
						<CardHeader className='flex items-center justify-between'>
							<h2 className='font-semibold'>{t('workspace:members')}</h2>
							{isAdmin() && (
								<Link asBtn href={`/workspaces/${workspace.id}/invite`} className='bg-gray-darkless'>
									<MailOpenIcon className="w-6 h-6 mr-1" />
									{t('workspace:addUsers')}
								</Link>
							)}
						</CardHeader>
						<div className='space-y-3'>
							{workspace.users.map((user) => (
								<div className='flex items-center' key={user.userId}>
									<Avatar className='mr-3' width={40} height={40} url={user.user.image} />
									<span>{user.user.name}</span>
									{user.isAdmin && <span> (Admin)</span>}
								</div>
							))}
						</div>
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
			workspace: JSON.parse(JSON.stringify(workspace)) as WorkspaceWithUsers,
			user: JSON.parse(JSON.stringify(session.userDetails)) as User
		}
	}
}
