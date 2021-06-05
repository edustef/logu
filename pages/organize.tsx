import React from 'react'
import Layout from '../components/Templates/Layout'
import Calendar from '../components/Molecules/Calendar'
import useTranslation from 'next-translate/useTranslation'
import Title from '../components/Atoms/Title'
import WorkspaceDropdown from '../components/Molecules/WorkspaceDropdown'

const Draft: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Layout>
			<div className='flex flex-col'>
				<div className='flex items-center'>
					<Title>{t('navigation:organize')}</Title>
					<WorkspaceDropdown />
				</div>
				<Calendar className='flex-grow' />
			</div>
		</Layout>
	)
}

export default Draft
