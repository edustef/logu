import { Workspace } from '.prisma/client'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import React, { Fragment, useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import useWorkspaces from '../../../hooks/useWorkspaces'
import Button from '../../Atoms/Button'
import Link from '../../Atoms/Link'

interface Props {
	className?: string
}

const WorkspaceDropdown: React.FC<Props> = ({ className }) => {
	const styles = {
		options: clsx(
			'absolute left-0 mt-2 border border-gray-600 rounded-md shadow-md py-2 z-10',
			'bg-gray-darkless text-base text-white shadow-md'
		),
		listItem: (active) => clsx(active && 'bg-green-600', 'p-1')
	}

	const workspaces = useWorkspaces()
	const { t } = useTranslation()
	const [selected, setSelected] = useState<Workspace>(null)

	useEffect(() => {
		if (!selected && workspaces.isSuccess) {
			setSelected(workspaces.data[0])
		}
	}, [workspaces])

	return (
		<div className={clsx(className)}>
			<Listbox className='relative' as='div' value={selected} onChange={setSelected}>
				<Listbox.Button className='flex items-center'>
					<div className='mr-1'>{selected?.name ?? <Skeleton width='10rem' />}</div>
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
						{workspaces.isError && <div>{t('errors:failedLoad')}</div>}
						{workspaces.isSuccess &&
							workspaces.data.map((workspace) => (
								<Listbox.Option key={workspace.name} value={workspace} as={Fragment}>
									{({ active, selected }) => (
										<li className={styles.listItem(active)}>
											<Button className='w-full line-clamp-1'>
												<span className='flex items-center'>
													{selected && <CheckIcon className='w-5 h-5 mr-1' />}
													<span>{workspace.name}</span>
												</span>
											</Button>
										</li>
									)}
								</Listbox.Option>
							))}
					</Listbox.Options>
				</Transition>
			</Listbox>
		</div>
	)
}

export default WorkspaceDropdown
