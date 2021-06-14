import React from 'react'
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import Layout from '../components/Templates/Layout'
import { getSession, useSession } from 'next-auth/client'
import useTranslation from 'next-translate/useTranslation'
import Title from '../components/Atoms/Title'
import authRedirect from '../utils/authRedirect'
import accountSetupRedirect from '../utils/accountSetupRedirect'
import Notifications from '../components/Molecules/Notifications'
import { User } from '@prisma/client'
import Card, { CardHeader } from '../components/Molecules/Card'
import useWorkspaces from '../hooks/useWorkspaces'
import Link from '../components/Atoms/Link'
import { PlusIcon, ArrowRightIcon } from '@heroicons/react/outline'
import Skeleton from 'react-loading-skeleton'
import clsx from 'clsx'

const DashboardPage = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const { t } = useTranslation()
	const session = useSession()[0]
	const userId = session?.userDetails?.id
	const workspaceTake = 5
	const workspaces = useWorkspaces({ take: workspaceTake.toString() })

	return (
		<Layout page={t('navigation:dashboard')}>
			<div className='page'>
				<div className='flex items-center'>
					<Title className='flex-grow'>{t('navigation:dashboard')}</Title>
					<Notifications className='md:hidden' />
				</div>
				<main>
					<Card>
						<CardHeader className='flex justify-between items-center'>
							<Link href='/workspaces'>
								<h2 className='font-semibold'>{t('dashboard:workspacesTitle')}</h2>
							</Link>
						</CardHeader>
						{workspaces.isLoading && <Skeleton count={2} />}
						{workspaces.isError && <div>{t('errors:failedLoad')}</div>}
						<div className='divide-y divide-gray-darkless divide-opacity-30'>
							{workspaces.isSuccess &&
								workspaces.data.map((workspace, index) => (
									<Link
										className={clsx(
											index === 0 && 'border-none pt-0',
											'border-t rounded-t-none border-opacity-30 w-full items-center py-2 border-gray-700'
										)}
										href={`/workspaces/${workspace.id}`}
										key={workspace.id}
									>
										<span className='flex-grow'>{workspace.name}</span>
										<span>
											<ArrowRightIcon className='w-4 h-4' />
										</span>
									</Link>
								))}
							{workspaces.isSuccess && workspaces.data.length === 0 && (
								<div className='italic text-gray-400'>{t('dashboard:noWorkspaces')}</div>
							)}
							{workspaces.data?.length === workspaceTake && (
								<Link className='flex items-center text-blue-300' href='/workspaces'>
									{t('dashboard:seeAllWorkspaces')} <ArrowRightIcon className='ml-2 w-4 h-4' />
								</Link>
							)}
						</div>
					</Card>
				</main>
			</div>
		</Layout>
	)
}

export default DashboardPage

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
	const session = await getSession({ req })
	if (!session) {
		return authRedirect('/dashboard')
	}

	if (session.userDetails.isNewUser) {
		return accountSetupRedirect()
	}

	return {
		props: {
			user: JSON.parse(JSON.stringify(session.userDetails)) as User
		}
	}
}
