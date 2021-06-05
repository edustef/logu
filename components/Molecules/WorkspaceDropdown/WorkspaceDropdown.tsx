import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import React, { Fragment, useState } from 'react'
import Link from '../../Atoms/Link'

interface Props {
	className: string
}

const WorkspaceDropdown: React.FC<Props> = ({ className }) => {
	const styles = {
		options: clsx(
			'absolute left-0 border border-gray-600 w-32 rounded-md shadow-md ml-4 py-2 z-10',
			'bg-white text-black',
			'dark:bg-gray-darkless dark:text-white shadow-md'
		),
		listItem: (active) => clsx(active && 'bg-green-300 dark:bg-green-600', 'p-1')
	}

	// TODO Fetch data with react-query
	const workspaces = {
		data: []
	}

	const router = useRouter()
	const { t } = useTranslation()
	const [selected, setSelected] = useState()

	return (
		<div className={className}>
			<Listbox className='relative' as='div' value={selected} onChange={setSelected}>
				<Listbox.Button className='flex items-center'>
					<span className='mr-1'>asd</span>
					<SelectorIcon className='w-5 h-5' />
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
							<Listbox.Option key={workspace.locale} value={workspace} as={Fragment}>
								{({ active, selected }) => (
									<li className={styles.listItem(active)}>
										<Link className='flex' href={router.pathname} locale={workspace.locale}>
											{selected && <CheckIcon className='w-6 h-6' />}
										</Link>
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
