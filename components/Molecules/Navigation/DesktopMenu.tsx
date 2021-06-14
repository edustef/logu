import React from 'react'
import { HomeIcon, ChartBarIcon, UserIcon, ViewGridAddIcon } from '@heroicons/react/outline'
import useTranslation from 'next-translate/useTranslation'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { NavLink, NavigationRouter } from '.'
import LoguSvg from '../../../public/svgs/logu.svg'
import Notifications from '../../../components/Molecules/Notifications'

interface Props {
	className?: string
}

const DesktopMenu: React.FC<Props> = ({ className }) => {
	const router = useRouter()
	const { t } = useTranslation()

	return (
		<nav className={clsx(['border-b-2 py-1', 'border-gray-dark bg-gray-darkest', className])}>
			<div className='flex items-center'>
				<div className='flex ml-8 justify-center items-center mr-12'>
					<LoguSvg className='w-16' />
				</div>
				<div className='flex space-x-10 mr-auto'>
					<NavigationRouter currentPath={router.pathname}>
						<NavLink path='/dashboard' name={t('navigation:dashboard')}>
							<HomeIcon className='w-8 h-8' />
						</NavLink>
						<NavLink path='/organize' name={t('navigation:organize')}>
							<ViewGridAddIcon className='w-8 h-8' />
						</NavLink>
						<NavLink path='/reports' name={t('navigation:reports')}>
							<ChartBarIcon className='w-8 h-8' />
						</NavLink>
						<NavLink path='/account' name={t('navigation:account')}>
							<UserIcon className='w-8 h-8' />
						</NavLink>
					</NavigationRouter>
				</div>
				<Notifications className='mr-8  ml-auto' />
			</div>
		</nav>
	)
}

export default DesktopMenu
