import React, { Fragment, useState } from 'react'
import Card, { CardHeader } from '../../components/Molecules/Card'
import { ArrowRightIcon, ClipboardCopyIcon, MailIcon } from '@heroicons/react/outline'
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
import Avatar from '../../components/Atoms/Avatar'
import { Dialog, Transition } from '@headlessui/react'
import axios from 'axios'
import { toast } from 'react-toastify'
import accountSetupRedirect from '../../utils/accountSetupRedirect'
import Preferences from '../../components/Molecules/Preferences'
import { PlusIcon } from '@heroicons/react/outline'

interface Props {
	user: User
}

const AccountPage: React.FC<Props> = ({ user }) => {
	const { t } = useTranslation()
	const workspaceTake = 5
	const workspaces = useWorkspaces({ take: workspaceTake.toString() })
	const [isDeleteModalOpen, setIsDeletModalOpen] = useState(false)
	const [confirmEmail, setConfirmEmail] = useState('')

	const handleAccountDelete = async () => {
		try {
			const res = await axios.delete(`/api/users/${user.id}`)
			signOut()
			toast.success(t('account:manage.deleteSuccess'))
		} catch (error) {
			console.log(error)

			toast.error(t('account:manage.deleteError'))
		}
	}

	const handleCloseModal = () => {
		setIsDeletModalOpen(false)
		setConfirmEmail('')
	}

	return (
		<Layout>
			<div className='flex items-center'>
				<Title className='flex-grow'>{t('navigation:account')}</Title>
				<LanguageMenu popupRight={true} />
			</div>
			<div className='space-y-4'>
				<Card>
					<CardHeader className='flex'>
						<Avatar url={user.image} width={50} height={50} className='rounded-full object-cover' />
						<div className='ml-3 flex flex-col'>
							<h2 className='font-semibold'>{user.name ?? t('account:noName')}</h2>
							<small className='text-sm text-gray-400'>{user.email}</small>
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
						<Link href='/workspaces'>
							<h2 className='font-semibold'>{t('account:workspacesTitle')}</h2>
						</Link>
						<Link asBtn href='/workspaces/create' className='bg-gray-darkless text-white'>
							<PlusIcon className="w-6 h-6 mr-1" />
							{t('account:newWorkspace')}
						</Link>
					</CardHeader>
					{workspaces.isLoading && <Skeleton count={2} />}
					{workspaces.isError && <div>{t('errors:failedLoad')}</div>}
					<div className="divide-y divide-gray-darkless divide-opacity-30">
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
							<div className='italic text-gray-400'>{t('account:noWorkspaces')}</div>
						)}
						{workspaces.data?.length === workspaceTake && (
							<Link className='flex items-center text-blue-300' href='/workspaces'>
								{t('account:seeAllWorkspaces')} <ArrowRightIcon className='ml-2 w-4 h-4' />
							</Link>
						)}
					</div>
				</Card>
				<Card>
					<CardHeader>
						<h2 className='font-semibold'>{t('account:preferences.title')}</h2>
					</CardHeader>
					<Preferences />
				</Card>
				<Card>
					<CardHeader>
						<h2 className='font-semibold'>{t('account:manage.title')}</h2>
					</CardHeader>
					<Button onClick={() => setIsDeletModalOpen(true)} className='bg-red-500'>
						{t('account:manage.delete')}
					</Button>
				</Card>
			</div>
			<Transition appear show={isDeleteModalOpen} as={Fragment}>
				<Dialog as='div' className='fixed inset-0 z-10 overflow-y-auto' onClose={handleCloseModal}>
					<div className='text-white min-h-screen grid place-items-center px-3 text-center bg-black bg-opacity-50'>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0'
							enterTo='opacity-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100'
							leaveTo='opacity-0'
						>
							<Dialog.Overlay className='fixed inset-0' />
						</Transition.Child>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 scale-95'
							enterTo='opacity-100 scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 scale-100'
							leaveTo='opacity-0 scale-95'
						>
							<div className='inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-dark shadow-xl rounded'>
								<Dialog.Title as='h3' className='text-lg font-medium leading-6'>
									{t('account:manage.deleteModalTitle')}
								</Dialog.Title>
								<div className='mt-2'>
									<p className='text-sm text-red-300 italic'>
										Note. This action will delete every workspace that you currently own and your members will no longer
										be able to access them.
									</p>
								</div>
								<div className='mt-2 mb-1 font-semibold'>{t('account:manage.emailLabel')}</div>
								<div className='relative w-full inline-block text-gray-400 focus-within:text-gray-600'>
									<span className='flex items-center absolute left-0 inset-y-0'>
										<MailIcon className='ml-1 w-6 h-6' />
									</span>
									<input
										defaultValue=''
										onChange={(val) => setConfirmEmail(val.target.value)}
										type='email'
										className='w-full pl-8 py-1 text-gray-600 focus-within:text-black rounded pr-2'
										placeholder={t('account:manage.emailPlaceholder')}
									/>
								</div>
								<div className='mt-4'>
									<Button
										disabled={user.email !== confirmEmail}
										className='bg-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed'
										onClick={() => {
											handleCloseModal()
											handleAccountDelete()
										}}
									>
										{t('account:manage.confirmButton')}
									</Button>
								</div>
							</div>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition>
		</Layout>
	)
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const session = await getSession({ req })
	if (!session) {
		return authRedirect('/account')
	}

	if (session.isNewUser) {
		accountSetupRedirect()
	}

	return {
		props: { user: JSON.parse(JSON.stringify(session.userDetails)) }
	}
}

export default AccountPage
