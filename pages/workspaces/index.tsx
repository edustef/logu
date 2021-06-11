import React, { useState } from 'react'
import { GetServerSideProps } from 'next'
import Layout from '../../components/Templates/Layout'
import Title from '../../components/Atoms/Title'
import { getSession } from 'next-auth/client'
import useWorkspaces from '../../hooks/useWorkspaces'
import Skeleton from 'react-loading-skeleton'
import Card from '../../components/Molecules/Card'
import Link from '../../components/Atoms/Link'
import useTranslation from 'next-translate/useTranslation'
import dayjs from 'dayjs'
import { SearchIcon } from '@heroicons/react/outline'
import useDebounce from '../../hooks/useDebounce'
import authRedirect from '../../utils/authRedirect'
import accountSetupRedirect from '../../utils/accountSetupRedirect'
import NoDataSvg from '../../public/svgs/undraw-no-data.svg'

const WorkspacePage: React.FC = () => {
	const { t } = useTranslation()
	const [search, setSearch] = useState<string>()
	const searchDebounced = useDebounce(search)
	const workspaces = useWorkspaces({ name: searchDebounced })

	return (
		<Layout>
			<div className='h-full flex flex-col'>
				<Title hasBackBtn>Workspaces</Title>
				<div className='w-full mb-3 relative inline-block text-gray-400 focus-within:text-gray-600'>
					<span className='flex items-center absolute left-0 inset-y-0'>
						<SearchIcon className='ml-1 w-6 h-6' />
					</span>
					<input
						type='search'
						defaultValue={search}
						onChange={(e) => setSearch(e.target.value)}
						name='search'
						className='w-full pl-8 py-1 text-gray-600 focus-within:text-black rounded pr-2'
						placeholder={t('workspaces:search.placeholder')}
					/>
				</div>
				<div className='space-y-3 flex-grow'>
					{workspaces.isLoading && <Skeleton count={2} />}
					{workspaces.isError && <div>{t('errors:failedLoad')}</div>}
					{workspaces.isSuccess &&
						workspaces.data.map((workspace) => (
							<Card key={workspace.id}>
								<Link className='block my-2 font-normal' href={`/workspaces/${workspace.id}`}>
									<h2 className='text-lg font-semibold'>{workspace.name}</h2>
									<div className='text-sm italic text-gray-400'>{dayjs(workspace.createdAt).format('LL')}</div>
									<div className='line-clamp-2 mt-2'>{workspace.description}</div>
								</Link>
							</Card>
						))}
					{workspaces.isSuccess && workspaces.data.length == 0 && (
						<div className='w-full h-full grid place-items-center'>
							<div className="flex flex-col items-center">
								<NoDataSvg className='w-24 h-24' />
								<div className='mt-2 font-semibold italic'>{t('workspaces:noData')}</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</Layout>
	)
}

export default WorkspacePage

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const session = await getSession({ req })

	if (!session) {
		return authRedirect('/dashboard')
	}

	if (session.userDetails.isNewUser) {
		return accountSetupRedirect()
	}

	return {
		props: {}
	}
}
