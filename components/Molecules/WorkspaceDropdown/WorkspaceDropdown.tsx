import { Workspace } from '.prisma/client'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import React, { Fragment, useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import useWorkspaces from '../../../hooks/useWorkspaces'
import { WorkspaceWithUsers } from '../../../schemas/userWorkspace.schema'
import Button from '../../Atoms/Button'
import Link from '../../Atoms/Link'

interface Props {
	className?: string
	current: WorkspaceWithUsers
}

const WorkspaceDropdown: React.FC<Props> = ({ className, current }) => {
	const styles = {
		options: clsx(
			'absolute left-0 mt-2 border border-gray-600 rounded-md shadow-md py-2 z-10',
			'bg-gray-darkless text-base text-white shadow-md'
		),
		listItem: (active: boolean) => clsx(active && 'bg-green-600', 'p-1')
	}
	const router = useRouter()

	const workspaces = useWorkspaces()
	const [workspaceSelected, setWorkspaceSelected] = useState<WorkspaceWithUsers>(current)

	useEffect(() => {
		if (workspaces.isSuccess) {
			setWorkspaceSelected(workspaces.data.find((workspace) => workspace.id === current.id))
		}
	}, [workspaces.isSuccess])

	const handleWorkspaceChange = (workspace: WorkspaceWithUsers) => {
		router.replace(`/organize/${workspace.id}`)
		setWorkspaceSelected(workspace)
	}

	return (
		<div className={clsx(className)}>
			{workspaces.isSuccess && (
				<Listbox className='relative' as='div' value={workspaceSelected} onChange={handleWorkspaceChange}>
					<Listbox.Button className='flex items-center'>
						<div className='mr-1'>{workspaceSelected.name ?? <Skeleton width='10rem' />}</div>
						<SelectorIcon className='w-6 h-6' />
					</Listbox.Button>
					<Transition
						as={Fragment}
						enter='transition transform duration-150'
						enterFrom='scale-75 opacity-0'
						enterTo='scale-100 opacity-100'
						leave='transition transform duration-150'
						leaveFrom='opacity-100 scale-100'
						leaveTo='opacity-0 scale-75'
					>
						<Listbox.Options className={styles.options}>
							{workspaces.data.map((workspace) => (
								<Listbox.Option key={workspace.name} value={workspace} as={Fragment}>
									{({ active, selected }) => (
										<li className={styles.listItem(active)}>
											<div className='px-2 w-full line-clamp-1'>
												<span className='flex items-center'>
													{selected && <CheckIcon className='w-5 h-5 mr-1' />}
													<span>{workspace.name}</span>
												</span>
											</div>
										</li>
									)}
								</Listbox.Option>
							))}
						</Listbox.Options>
					</Transition>
				</Listbox>
			)}
		</div>
	)
}

export default WorkspaceDropdown
