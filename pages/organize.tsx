import React from 'react'
import Layout from '../components/Templates/Layout'
import Calendar from '../components/Molecules/Calendar'
import useTranslation from 'next-translate/useTranslation'
import Title from '../components/Atoms/Title'
import WorkspaceDropdown from '../components/Molecules/WorkspaceDropdown'

const Draft: React.FC = () => {
	const { t } = useTranslation()
	const [title, setTitle] = useState('')
	const [content, setContent] = useState('')

	const submitData = async (e: React.SyntheticEvent) => {
		e.preventDefault()
		try {
			const body = { title, content }
			await fetch(`http://localhost:3000/api/post`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			})
			await Router.push('/drafts')
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<Layout>
			<div className='px-2 flex flex-col'>
				<Title>{t('navigation:organize')}</Title>
				<Calendar className='flex-grow' />
			</div>
		</Layout>
	)
}

export default Draft
