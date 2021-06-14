import React from 'react'
import { HomeIcon, ChartBarIcon, UserIcon, ViewGridAddIcon } from '@heroicons/react/outline'
import useTranslation from 'next-translate/useTranslation'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { NavLink, NavigationRouter } from '.'

interface Props {
	className?: string
}

const BottomNavbar: React.FC<Props> = ({ className }) => {
	const styles = {
		root: clsx(['block fixed shadow border-t-2 inset-x-0 bottom-0 z-10', 'border-gray-dark bg-gray-darkest'])
	}
	const router = useRouter()
	const { t } = useTranslation()

	return (
		<nav id='bottom-navigation' className={clsx(className, styles.root)}>
			<div id='tabs' className='flex justify-between'>
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
		</nav>
	)
}

export default BottomNavbar
