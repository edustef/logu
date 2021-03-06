import React, { Fragment } from 'react'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import { CheckIcon, GlobeAltIcon } from '@heroicons/react/outline'
import { Listbox, Transition } from '@headlessui/react'
import { useLanguage } from '../../../hooks/useLanguage'
import languages from '../../../constants/languages'

interface Props {
	className?: string
	popupRight?: boolean
}

const LanguageMenu: React.FC<Props> = ({ className, popupRight = false }) => {
	const styles = {
		options: clsx(
			'absolute border border-gray-600 w-32 rounded-md shadow-md ml-4 py-2 z-10',
			popupRight ? 'right-0' : '',
			'bg-gray-darkless text-white shadow-md'
		),
		listItem: (active) => clsx(active && 'bg-green-600', 'p-1')
	}

	const [currentLanguage, setCurrentLanguage] = useLanguage()

	return (
		<div className={className}>
			<Listbox className='relative' as='div' value={currentLanguage} onChange={setCurrentLanguage}>
				<Listbox.Button>
					<GlobeAltIcon className='w-8 h-8' />
				</Listbox.Button>
				<Transition
					as={Fragment}
					enter={clsx('transition transform duration-150', popupRight ? 'origin-top-right' : 'origin-top-left')}
					enterFrom='scale-75 opacity-0'
					enterTo='scale-100 opacity-100'
					leave={clsx('transition transform duration-150', popupRight ? 'origin-top-right' : 'origin-top-left')}
					leaveFrom='opacity-100 scale-100'
					leaveTo='opacity-0 scale-75'
				>
					<Listbox.Options className={styles.options}>
						{languages.map((language) => (
							<Listbox.Option key={language.locale} value={language} as={Fragment}>
								{({ active, selected }) => (
									<li className={styles.listItem(active)}>
										<div className='flex cursor-pointer'>
											{selected && <CheckIcon className='w-6 h-6' />}
											{language.name}
										</div>
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

export default LanguageMenu
