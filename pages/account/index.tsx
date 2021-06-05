import React from 'react'
import Image from 'next/image'
import Card, { CardHeader } from '../../components/Molecules/Card'
import { ArrowRightIcon, ClipboardCopyIcon } from '@heroicons/react/outline'
import useTranslation from 'next-translate/useTranslation'
import Layout from '../../components/Templates/Layout'
import { getSession, signOut } from 'next-auth/client'
import { GetServerSideProps } from 'next'
import authRedirect from '../../utils/authRedirect'
import LanguageMenu from '../../components/Molecules/LanguageMenu'
import useWorkspaces from '../../hooks/useWorkspaces'
import Button from '../../components/Atoms/Button'
import Link from '../../components/Atoms/Link'
import Skeleton from 'react-loading-skeleton'
import Title from '../../components/Atoms/Title'
import clsx from 'clsx'
import { User } from '.prisma/client'

interface Props {
	user: User
}

const AccountPage: React.FC<Props> = ({ user }) => {
	const styles = {
		bar: 'h-2 bg-gray-700 rounded'
	}
	const { t } = useTranslation()
	const workspaces = useWorkspaces()

	return (
		<Layout>
			<div className='flex items-center'>
				<Title className='flex-grow'>{t('navigation:account')}</Title>
				<LanguageMenu popupRight={true} />
			</div>
			<div className='space-y-4'>
				<Card>
					<CardHeader className='flex'>
						<Image
							src={user.image}
							alt='Profile picture'
							width={50}
							height={50}
							className='rounded-full object-cover'
						/>
						<div className='ml-3 flex flex-col'>
							<h2 className='font-semibold'>{user.name ?? t('account:noName')}</h2>
							<small className='text-sm dark:text-gray-400'>{user.email}</small>
						</div>
					</CardHeader>
					<div className='flex justify-between'>
						<Link href='/account/edit' className='text-blue-300'>
							{t('account:editProfile')}
						</Link>
						<Button className='bg-red-500' onClick={() => signOut()}>
							{t('common:signOut')}
						</Button>
					</div>
				</Card>
				<Card>
					<CardHeader className='flex justify-between items-center'>
						<h2 className='font-semibold'>{t('account:workspacesTitle')}</h2>
						<Link href='/workspaces/create' className='bg-gray-700 text-white'>
							{t('account:newWorkspace')}
						</Link>
					</CardHeader>
					{workspaces.isLoading && <Skeleton count={2} />}
					{workspaces.isError && <div>{t('errors:failedLoad')}</div>}
					{workspaces.isSuccess &&
						workspaces.data.map((workspace, index) => (
							<Link
								className={clsx(index > 0 && 'border-t', 'flex items-center rounded-none my-2 border-gray-700')}
								href={`/workspaces/${workspace.name}`}
								key={workspace.id}
							>
								<span className='flex-grow'>{workspace.name}</span>
								<span>
									<ArrowRightIcon className='w-4 h-4' />
								</span>
							</Link>
						))}
					{workspaces.isSuccess && workspaces.data.length === 0 && (
						<div className='italic text-gray-400'>{t('account:noWorkspaces')}</div>
					)}
				</Card>
				<Card>
					<CardHeader className='flex justify-between items-center'>
						<h2 className='font-semibold'>{t('account:developersTitle')}</h2>
						<Button className='bg-green-600'>{t('account:generateAPI')}</Button>
					</CardHeader>
					<div className='mt-2 flex'>
						<div className='overflow-x-scroll w-48 md:w-64'>
							eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
						</div>
						<button>
							<ClipboardCopyIcon className='w-6 h-6 ml-2' />
						</button>
					</div>
				</Card>
			</div>
		</Layout>
	)
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const session = await getSession({ req })
	if (!session) {
		return authRedirect('/account')
	}

	if (session.isNewUser) {
		return {
			redirect: {
				permanent: false,
				destination: '/account-setup'
			}
		}
	}

	return {
		props: { user: JSON.parse(JSON.stringify(session.userDetails)) }
	}
}

export default AccountPage
