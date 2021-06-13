import { Workspace } from '.prisma/client'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { getSession } from 'next-auth/client'
import useTranslation from 'next-translate/useTranslation'
import React, { useEffect, useState } from 'react'
import StatusCode from 'status-code-enum'
import Calendar from '../../components/Molecules/Calendar'
import WorkspaceDropdown from '../../components/Molecules/WorkspaceDropdown'
import Layout from '../../components/Templates/Layout'
import { WorkspaceWithUsers } from '../../schemas/userWorkspace.schema'
import accountSetupRedirect from '../../utils/accountSetupRedirect'
import authRedirect from '../../utils/authRedirect'
import parseQueryOne from '../../utils/parseQueryOne'
import { getWorkspace } from '../api/users-workspaces/[id]'

const OrganizePage = ({ workspace }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const { t } = useTranslation()
	
	return (
		<Layout>
			<div className='flex flex-col h-full'>
				<WorkspaceDropdown current={workspace} className='mt-2 text-2xl font-semibold' />
				<div className='mt-6 flex-grow'>
					<Calendar workspaceId={workspace.id} className='flex-grow' />
				</div>
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
	const workspace = await getWorkspace(id)

	if (!workspace) {
		res.statusCode = StatusCode.ClientErrorNotFound
		res.end()
	}

	return {
		props: {
			workspace: JSON.parse(JSON.stringify(workspace)) as WorkspaceWithUsers
		}
	}
}