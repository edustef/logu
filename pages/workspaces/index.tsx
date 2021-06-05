import React from 'react'
import { GetServerSideProps } from 'next'
import Layout from '../../components/Templates/Layout'
import Title from '../../components/Atoms/Title'
import { UserWorkspace } from '.prisma/client'
import { getSession } from 'next-auth/client'
import useWorkspaces from '../../hooks/useWorkspaces'
import Skeleton from 'react-loading-skeleton'
import Card from '../../components/Molecules/Card'
import Link from '../../components/Atoms/Link'
import useTranslation from 'next-translate/useTranslation'

const WorkspacePage: React.FC = () => {
	const { t } = useTranslation()
	const workspaces = useWorkspaces()

	return (
		<Layout>
			<Title>Workspaces</Title>
			<Card>
				{workspaces.isLoading && <Skeleton count={2} />}
				{workspaces.isError && <div>{t('errors:failedLoad')}</div>}
				{workspaces.isSuccess &&
					workspaces.data.map((workspace) => (
						<Link className='block my-2' href={`/teams/${workspace.name}`} key={workspace.id}>
							{workspace.name}
						</Link>
					))}
				{workspaces.isSuccess && !workspaces.data && <div>{t('account:noWorkspaces')}</div>}
			</Card>
		</Layout>
	)
}

export default WorkspacePage

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const session = await getSession({ req })
	if (!session) {
		return {
			redirect: {
				destination: '/dashboard',
				permanent: false
			}
		}
	}

	return {
		props: {}
	}
}
