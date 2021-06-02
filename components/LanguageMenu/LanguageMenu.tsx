import React, { Fragment } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import GlobeSvg from './icons/globe.svg'
import CheckmarkSvg from './icons/checkmark.svg'
import { CheckIcon, GlobeAltIcon } from '@heroicons/react/outline'
import { Listbox } from '@headlessui/react'
import 'dayjs/locale/es'
import 'dayjs/locale/en'
import { ClassNameModel } from '../../models/className.model'
import { useLanguage, languages } from '../../hooks/useLanguage'

interface Props extends ClassNameModel {
	popupRight?: boolean
}

const LanguageMenu: React.FC<Props> = ({ className, popupRight = false }) => {
	const styles = {
		options: clsx(
			'absolute w-32 rounded-md shadow-md ml-4 py-2 z-10',
			popupRight ? 'right-0' : '',
			'bg-white text-black',
			'dark:bg-gray-800 dark:text-white'
		),
		listItem: (active) => clsx(active && 'bg-green-300 dark:bg-green-600', 'p-2')
	}

	const router = useRouter()
	const [currentLanguage, setCurrentLanguage] = useLanguage()

	return (
		<div className={className}>
			<Listbox className='relative' as='div' value={currentLanguage} onChange={setCurrentLanguage}>
				<Listbox.Button>
					<GlobeAltIcon className='w-8 h-8' />
				</Listbox.Button>
				<Listbox.Options className={styles.options}>
					{languages.map((language) => (
						<Listbox.Option key={language.locale} value={language} as={Fragment}>
							{({ active, selected }) => (
								<li className={styles.listItem(active)}>
									<Link href={router.pathname} locale={language.locale}>
										<a className='flex space-x-3'>
											{selected && <CheckIcon className='w-6 h-6' />}
											{language.name}
										</a>
									</Link>
								</li>
							)}
						</Listbox.Option>
					))}
				</Listbox.Options>
			</Listbox>
		</div>
	)
}

export default LanguageMenu
