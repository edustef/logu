import { Workspace } from '.prisma/client'
import { CollectionIcon } from '@heroicons/react/outline'
import axios from 'axios'
import { Form, Formik } from 'formik'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import Button from '../../components/Atoms/Button'
import Card from '../../components/Molecules/Card'
import InputField from '../../components/Atoms/InputField'
import Layout from '../../components/Templates/Layout'
import Title from '../../components/Atoms/Title'

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

			toast(t('workspaces:create.success', { name: values.workspace }))
			router.push('/account')
		} catch (error) {
			console.error(error)
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<Layout>
			<Title>{t('workspaces:create.title')}</Title>
			<Formik
				initialValues={{
					workspace: ''
				}}
				validationSchema={Yup.object({
					workspace: Yup.string()
						.matches(/^\D+\w*/, t('validation:notNumberFirst', { field: t('workspaces:create.label') }))
						.min(3, t('validation:min', { num: 3 }))
						.max(30, t('validation:max', { num: 30 }))
						.required(t('validation:required', { field: t('workspaces:create.label') }))
				})}
				onSubmit={submitNewWorkspace}
			>
				{({ isSubmitting }) => (
					<Form>
						<>
							<Card className='mb-2'>
								<InputField
									className='w-full'
									label={t('workspaces:create.label')}
									icon={<CollectionIcon className='w-full h-full text-current' />}
									name='workspace'
									type='text'
									placeholder={t('workspaces:create.placeholder')}
								/>
							</Card>
							<Button
								disabled={isSubmitting}
								type='submit'
								className='block w-full bg-green-600 text-white disabled:cursor-not-allowed disabled:bg-gray-300 up'
							>
								{t('workspaces:create.addWorkspace')}
							</Button>
						</>
					</Form>
				)}
			</Formik>
		</Layout>
	)
}

export default CreatePage
