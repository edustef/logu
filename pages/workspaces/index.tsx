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
import dayjs from 'dayjs'
import { SearchIcon } from '@heroicons/react/outline'
import BackButton from '../../components/Molecules/BackButton'

const WorkspacePage: React.FC = () => {
	const { t } = useTranslation()
	const workspaces = useWorkspaces()

	return (
		<Layout>
			<Title hasBackBtn>Workspaces</Title>
			<div className='relative inline-block text-gray-400 focus-within:text-gray-600'>
				<span className='flex items-center absolute left-0 inset-y-0'>
					<SearchIcon className='ml-1 w-6 h-6' />
				</span>
				<input
					type='search'
					className='pl-8 py-1 text-gray-600 focus-within:text-black rounded pr-2'
					placeholder={t('workspaces:search.placeholder')}
				/>
			</div>
			<Card>
				{workspaces.isLoading && <Skeleton count={2} />}
				{workspaces.isError && <div>{t('errors:failedLoad')}</div>}
				{workspaces.isSuccess &&
					workspaces.data.map((workspace) => (
						<Link className='block my-2 font-normal' href={`/workspaces/${workspace.id}`} key={workspace.id}>
							<h2 className='text-lg font-semibold'>{workspace.name}</h2>
							<div className='text-sm italic text-gray-400'>{dayjs(workspace.createdAt).format('LL')}</div>
							<div className='line-clamp-2 mt-2'>{workspace.description}</div>
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
