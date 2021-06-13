import React, { useState } from 'react'
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
import Button from '../../../components/Atoms/Button'
import Input from '../../../components/Atoms/Form/Input'
import { UserAddIcon, XIcon } from '@heroicons/react/outline'
import axios from 'axios'
import { Prisma, PrismaClient, Notification, NotificationType } from '@prisma/client'

const InviteUserPage = ({ workspace }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const { t } = useTranslation()
	const [userList, setUserList] = useState<string[]>([])
	const [emailInput, setEmailInput] = useState<string>('')
	const handleAddUser = () => {
		setUserList((list) => [...list, emailInput])
		setEmailInput('')
	}

	const handleDeleteUser = (index: number) => {
		setUserList((list) => list.filter((user, i) => i !== index))
	}

	const handleInvite = async () => {
		const invitations = userList.map((user) =>
			axios.post<Notification>(`/api/notifications`, {
				email: user,
				type: 'INVITATION',
				resourceId: workspace.id
			})
		)

		const results = await axios.all(invitations)

		results.forEach((res) => console.log(res))
	}

	return (
		<Layout>
			<Title hasBackBtn>{t('workspace:invite.title')}</Title>
			<div className='flex items-center mb-3'>
				<Input
					type='email'
					placeholder={t('common:email.placeholder')}
					value={emailInput}
					onChange={(e) => setEmailInput(e.target.value)}
					onKeyPress={(e) => {
						if (e.code === 'Enter') {
							handleAddUser()
						}
					}}
					name='search'
					className='flex-grow'
					button={<UserAddIcon className='w-6 h-6' />}
				/>
				<Button onClick={handleAddUser} className='ml-2 bg-gray-darkless'>
					{t('workspace:invite.addUserBtn')}
				</Button>
			</div>
			<div className='space-y-3'>
				<Card>
					<CardHeader>
						<h2 className='font-semibold'>{t('workspace:invite.listTitle')}</h2>
					</CardHeader>
					{userList.length < 1 && <div className='italic text-gray-400'>{t('workspace:invite.emptyList')}</div>}
					<div className='divide-y divide-gray-darkless divide-opacity-30'>
						{userList &&
							userList.map((user, index) => (
								<div key={index} className='flex space-y-2 items-center'>
									<span className='flex-grow'>{user}</span>
									<Button onClick={() => handleDeleteUser(index)}>
										<XIcon className='w-5 h-5' />
									</Button>
								</div>
							))}
					</div>
				</Card>
			</div>
			<Button onClick={handleInvite} className='w-full bg-green-600 mt-3'>
				{t('workspace:addUsers')}
			</Button>
			<div className='text-gray-400 italic mt-6 text-center'>{t('workspace:invite.noteAboutInvitation')}</div>
		</Layout>
	)
}

export default InviteUserPage

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
	}

	if (!workspace.users.find(({ user }) => user.id === session.userDetails.id)) {
		res.statusCode = StatusCode.ClientErrorForbidden
	}

	return {
		props: {
			workspace: JSON.parse(JSON.stringify(workspace)) as WorkspaceWithUsers
		}
	}
}
