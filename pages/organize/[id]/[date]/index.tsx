import { Workspace } from '.prisma/client'
import { Schedule, User } from '@prisma/client'
import axios from 'axios'
import dayjs from 'dayjs'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { getSession } from 'next-auth/client'
import useTranslation from 'next-translate/useTranslation'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import StatusCode from 'status-code-enum'
import Title from '../../../../components/Atoms/Title'
import Calendar from '../../../../components/Molecules/Calendar'
import WorkspaceDropdown from '../../../../components/Molecules/WorkspaceDropdown'
import Layout from '../../../../components/Templates/Layout'
import { WorkspaceWithUsers } from '../../../../schemas/userWorkspace.schema'
import accountSetupRedirect from '../../../../utils/accountSetupRedirect'
import authRedirect from '../../../../utils/authRedirect'
import parseQueryOne from '../../../../utils/parseQueryOne'
import { getWorkspace } from '../../../api/workspaces/[id]'

const OrganizePage = ({ workspace, date, user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const { t } = useTranslation()
	const schedules = useQuery(['schedules', workspace.id, user.id, date], async () => {
		const { data } = await axios.get<Schedule>(`/api/schedules?userId=${user.id}&workspaceId=${workspace.id}&date=${date}`)
		return data
	})

	useEffect(() => {
		console.log(schedules.data)
	})

	return (
		<Layout>
			<div className='flex flex-col h-full'>
				<Title hasBackBtn>{dayjs(date).format('LL')}</Title>
				<div className='mt-6 flex-grow'></div>
			</div>
		</Layout>
	)
}

export default OrganizePage

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
			workspace: JSON.parse(JSON.stringify(workspace)) as WorkspaceWithUsers,
			date: date,
			user: JSON.parse(JSON.stringify(session.userDetails)) as User
		}
	}
}
