import React, { useState } from 'react'
import Layout from '../components/Layout'
import Router from 'next/router'
import Calendar, { DatePicker } from '../components/Calendar'
import useTranslation from 'next-translate/useTranslation'
import { Popover } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'

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
				body: JSON.stringify(body),
			})
			await Router.push('/drafts')
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<Layout>
			<div className='px-2 flex flex-col'>
				<div className='mb-4 flex flex-col items-center'>
					<h1 className='text-2xl'>{t('navigation:organize')}</h1>
					<small className='text-xs text-gray-400 italic'>{t('navigation:organize-desc')}</small>
				</div>
				<Calendar className='flex-grow' />
			</div>
		</Layout>
	)
}

export default Draft
