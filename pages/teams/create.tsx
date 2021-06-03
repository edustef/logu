import { Workspace } from '.prisma/client'
import { CollectionIcon } from '@heroicons/react/outline'
import axios from 'axios'
import { Form, Formik } from 'formik'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import Button from '../../components/Button'
import Card from '../../components/Card'
import InputField from '../../components/Form/InputField'
import Layout from '../../components/Layout'
import Title from '../../components/Title'

interface FormValues {
	workspace: string
}

const CreatePage: React.FC = () => {
	const { t } = useTranslation()
	const router = useRouter()
	const submitNewWorkspace = async (values: FormValues, { setSubmitting }) => {
		try {
			setSubmitting(true)
			const res = await axios.post<Workspace>(`/api/workspaces`, {
				headers: { 'Content-Type': 'application/json' },
				data: { ...values }
			})

			toast(t('teams:create.success', { name: values.workspace }))
			router.push('/account')
		} catch (error) {
			console.error(error)
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<Layout>
			<Title>{t('teams:create.title')}</Title>
			<Formik
				initialValues={{
					workspace: ''
				}}
				validationSchema={Yup.object({
					workspace: Yup.string()
						.matches(/^\D+\w*/, t('validation:notNumberFirst', { field: t('teams:create.label') }))
						.min(3, t('validation:min', { num: 3 }))
						.max(30, t('validation:max', { num: 30 }))
						.required(t('validation:required', { field: t('teams:create.label') }))
				})}
				onSubmit={submitNewWorkspace}
			>
				{({ isSubmitting }) => (
					<Form>
						<>
							<Card className='mb-2'>
								<InputField
									className='w-full'
									label={t('teams:create.label')}
									icon={<CollectionIcon className='w-full h-full text-current' />}
									name='workspace'
									type='text'
									placeholder={t('teams:create.placeholder')}
								/>
							</Card>
							<Button
								disabled={isSubmitting}
								type='submit'
								className='block w-full bg-green-600 text-white disabled:cursor-not-allowed disabled:bg-gray-300 up'
							>
								{t('teams:create.addWorkspace')}
							</Button>
						</>
					</Form>
				)}
			</Formik>
		</Layout>
	)
}

export default CreatePage
